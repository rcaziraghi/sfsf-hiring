const cds = require('@sap/cds');
const namespace = 'deloitte.hiring.db.';

let FoundationService = null;
let PositionService = null;

(async function () {
    // Connect to external SF OData services
    FoundationService = await cds.connect.to('ECFoundationOrganization');
    PositionService = await cds.connect.to('ECPositionManagement');
})();

/*** HELPERS ***/

// Remove the specified columns from the ORDER BY clause of a SELECT statement
function removeColumnsFromOrderBy(query, columnNames) {
    if (query.SELECT && query.SELECT.orderBy) {
        columnNames.forEach(columnName => {
            // Look for column in query and its respective index
            const element = query.SELECT.orderBy.find(column => column.ref[0] === columnName);
            const idx = query.SELECT.orderBy.indexOf(element);

            if (idx > -1) {
                // Remove column from oder by list
                query.SELECT.orderBy.splice(idx, 1);
                if (!query.SELECT.orderBy.length) {
                    // If list ends up empty, remove it from query
                    delete query.SELECT.orderBy;
                }
            }
        });
    }

    return query;
}

/*** HANDLERS ***/

// Read SF Positions
async function readSF_Positions(req) {
    try {
        // Columns that are not sortable must be removed from "order by"
        req.query = removeColumnsFromOrderBy(req.query, ['defaultFullName']);

        // Handover to the SF OData Service to fecth the requested data
        const tx = PositionService.tx(req);
        return await tx.run(req.query);
    } catch (err) {
        req.error(err.code, err.message);
    }
}

// Read SF Positions
async function readSF_PositionMatrixRelationships(req) {
    try {
        // Columns that are not sortable must be removed from "order by"
        req.query = removeColumnsFromOrderBy(req.query, ['defaultFullName']);

        // Handover to the SF OData Service to fecth the requested data
        const tx = PositionService.tx(req);
        return await tx.run(req.query);
    } catch (err) {
        req.error(err.code, err.message);
    }
}

// Read SF Cost Centers
async function readSF_CostCenters(req) {
    try {
        // Columns that are not sortable must be removed from "order by"
        req.query = removeColumnsFromOrderBy(req.query, ['defaultFullName']);

        // Handover to the SF OData Service to fecth the requested data
        const tx = FoundationService.tx(req);
        return await tx.run(req.query);
    } catch (err) {
        req.error(err.code, err.message);
    }
}

//Requests
// Before "save" project (exclusive for Fiori Draft support)
async function beforeSaveRequests(req) {
    console.log('beforeSaveRequests')
    try {

        if (req.data.position_code) {
            let position = await cds.tx(req).run(SELECT.one.from(namespace + 'Positions').columns(['code', 'effectiveStartDate']).where({
                code: {
                    '=': req.data.position_code
                },
                effectiveStartDate: {
                    '=': req.data.position_effectiveStartDate
                }
            }));
            if (!position) {
                await executeCreatePosition(req, req.data.position_code, req.data.position_effectiveStartDate)
            } else {
                await executeUpdatePosition(req, req.data.position_code, req.data.position_effectiveStartDate)
            }
        }

        if (req.data.costCenter_externalCode) {
            let costCenter = await cds.tx(req).run(SELECT.one.from(namespace + 'CostCenters').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.costCenter_externalCode
                },
                startDate: {
                    '=': req.data.costCenter_startDate
                }
            }));
            if (!costCenter) {
                await executeCreateCostCenter(req, req.data.costCenter_externalCode, req.data.costCenter_startDate)
            } else {
                await executeUpdateCostCenter(req, req.data.costCenter_externalCode, req.data.costCenter_startDate)
            }
        }

        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

//Default status, budget and budgetCap
async function beforeCreateRequests(req) {
    try {
        if (!req.data.status_ID) {
            req.data.status_ID = 1;
        }
        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function afterReadRequests(Requests, req) {
    try {
        // return Requests.map(Request => {
            // Request.budget = 70.00;
            // Request.budgetCap = 100.00;
            if (Requests.budget && Requests.budgetCap && Requests.budgetCap > 0) {
                Requests.budgetPer = Math.abs((Requests.budget / Requests.budgetCap) * 100);
                Requests.budgetCriticality = Requests.budgetPer >= 0 && Requests.budgetPer <= 50 ? 5 : Requests.budgetPer >= 51 && Requests.budgetPer <= 70 ? 3 : Requests.budgetPer >= 71 && Requests.budgetPer <= 99 ? 2 : Requests.budgetPer >= 100 ? 1 : 0;
            } else {
                Requests.budgetPer = 0.00;
                Requests.budgetCriticality = 0;
            }
        // })
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function afterSaveRequests(req) {
    try {

        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

/// Positions
//Create Positions
async function executeCreatePosition(req, code, effectiveStartDate) {
    try {
        console.log('executeCreatePosition');
        const position = await cds.tx(req).run(SELECT.one.from(namespace + 'Positions').columns(['code', 'effectiveStartDate']).where({
            code: {
                '=': code
            },
            effectiveStartDate: {
                '=': effectiveStartDate
            }
        }));
        if (!position) {
            const sfPosition = await PositionService.tx(req).run(SELECT.one.from('Position').columns(['code', 'effectiveStartDate', 'positionTitle', 'jobTitle', 'company', 'businessUnit', 'department', 'comment', 'costCenter', 'createdDate', 'createdBy', 'division', 'effectiveStatus', 'externalName_defaultValue', 'externalName_en_US', 'jobCode', 'employeeClass']).where({
                code: {
                    '=': code
                },
                effectiveStartDate: {
                    '=': effectiveStartDate
                }
            }));
            if (sfPosition) {
                await cds.tx(req).run(INSERT.into(namespace + 'Positions').entries(sfPosition));
            }
        }
    } catch (err) {
        console.log(err)
        console.log(err.code, err.message);
        req.error(err.code, err.message);
    }
}

//Update Positions
async function executeUpdatePosition(req, code, effectiveStartDate) {
    console.log('executeUpdatePosition');
    const sfPosition = await PositionService.tx(req).run(SELECT.one.from('Position').columns(['code', 'effectiveStartDate', 'positionTitle', 'jobTitle', 'company', 'businessUnit', 'department', 'comment', 'costCenter', 'createdDate', 'createdBy', 'division', 'effectiveStatus', 'externalName_defaultValue', 'externalName_en_US', 'jobCode', 'positionMatrixRelationship', 'parentPosition', 'employeeClass']).where({
        code: {
            '=': code
        },
        effectiveStartDate: {
            '=': effectiveStartDate
        }
    }));
    if (sfPosition) {
        await cds.tx(req).run(UPDATE.entity(namespace + 'Positions').data(sfPosition));
    }
}

async function beforeCreatePositions(req) {
    try {
        // Add SF Position to Positions entity if it does not exist yet
        const item = req.data;
        const code = (item.position_code) ? item.position_code : null;
        const effectiveStartDate = (item.position_effectiveStartDate) ? item.position_effectiveStartDate : null;
        if (code && effectiveStartDate) {
            await executeCreatePosition(req, code, effectiveStartDate);
        }
        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function beforeUpdatePositions(req) {

}

async function beforeDeletePositions(req) {

}

////////////////////////////////////////////
///CostCenters
//Create CostCenter
async function executeCreateCostCenter(req, externalCode, startDate) {
    try {
        console.log('executeCreateCostCenter');
        const CostCenter = await cds.tx(req).run(SELECT.one.from(namespace + 'CostCenters').columns(['externalCode', 'startDate']).where({
            externalCode: {
                '=': externalCode
            },
            startDate: {
                '=': startDate
            }
        }));
        if (!CostCenter) {
            const sfCostCenter = await FoundationService.tx(req).run(SELECT.one.from('FOCostCenter').columns(['externalCode', 'startDate', 'costcenterExternalObjectID', 'costcenterManager', 'createdDateTime', 'description', 'description_defaultValue', 'createdBy']).where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
            if (sfCostCenter) {
                await cds.tx(req).run(INSERT.into(namespace + 'CostCenters').entries(sfCostCenter));
            }
        }
    } catch (err) {
        console.log(err)
        console.log(err.code, err.message);
        req.error(err.code, err.message);
    }
}

//Update CostCenters
async function executeUpdateCostCenter(req, externalCode, startDate) {
    console.log('executeUpdateCostCenter');
    const sfCostCenter = await FoundationService.tx(req).run(SELECT.one.from('FOCostCenter').columns(['externalCode', 'startDate', 'costcenterExternalObjectID', 'costcenterManager', 'createdDateTime', 'description', 'description_defaultValue', 'createdBy']).where({
        externalCode: {
            '=': externalCode
        },
        startDate: {
            '=': startDate
        }
    }));
    if (sfCostCenter) {
        await cds.tx(req).run(UPDATE.entity(namespace + 'CostCenters').data(sfCostCenter));
    }
}

async function beforeCreateCostCenters(req) {
    try {
        // Add SF Cost Center to CostCenters entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.position_externalCode) ? item.position_externalCode : null;
        const startDate = (item.position_startDate) ? item.position_startDate : null;
        if (externalCode && startDate) {
            await executeCreateCostCenter(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function beforeUpdateCostCenters(req) {

}

async function beforeDeleteCostCenters(req) {

}

module.exports = {
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    readSF_Positions,
    readSF_CostCenters,
    readSF_PositionMatrixRelationships,
    beforeCreatePositions,
    beforeUpdatePositions,
    beforeDeletePositions,
    beforeCreateCostCenters,
    beforeUpdateCostCenters,
    beforeDeleteCostCenters
}