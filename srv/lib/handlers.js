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

// Read SF Companies
async function readSF_Companies(req) {
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


////////////////////////////////////////////////////////////////////////////
///Requests
//Actions
async function onSendRequestForApproval(req) {
    try {
        await UPDATE(req._target).with({
            status_ID: 3
        });
    } catch (err) {
        req.error(err.code, err.message);
    }
}

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

        if (req.data.company_externalCode) {
            let company = await cds.tx(req).run(SELECT.one.from(namespace + 'Companies').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.company_externalCode
                },
                startDate: {
                    '=': req.data.company_startDate
                }
            }));
            if (!company) {
                await executeCreateCompany(req, req.data.company_externalCode, req.data.company_startDate)
            } else {
                await executeUpdateCompany(req, req.data.company_externalCode, req.data.company_startDate)
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
            req.data.status_ID = 2;
        }
        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function afterReadRequests(Requests, req) {
    try {
        if (Array.isArray(Requests)) {
            return Promise.all(Requests.map(async Request => {
                Request = await updateBudgetInfo(Request, req);
            }))
        } else {
            Requests = await updateBudgetInfo(Requests, req);
        }
        console.log(Requests);
        return Requests;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

async function updateBudgetInfo(Request, req) {
    let RequestBudget = await cds.tx(req).run(SELECT.one.from(namespace + 'Requests').columns(['budget', 'budgetCap']).where({
        ID: {
            '=': Request.ID
        }
    }));
    if (RequestBudget.budget && RequestBudget.budgetCap && RequestBudget.budgetCap > 0 && RequestBudget.budget > 0) {
        Request.budgetPer = Math.abs((RequestBudget.budget / RequestBudget.budgetCap) * 100);
        Request.budgetCriticality = Request.budgetPer >= 0 && Request.budgetPer <= 50 ? 5 : Request.budgetPer >= 51 && Request.budgetPer <= 70 ? 3 : Request.budgetPer >= 71 && Request.budgetPer <= 99 ? 2 : Request.budgetPer >= 100 ? 1 : 0;
    } else {
        Request.budgetPer = 0.00;
        Request.budgetCriticality = 0;
    }
    return Request;
}

async function afterSaveRequests(req) {
    try {

        return req;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

////////////////////////////////////////////////////////////////////////////
///Positions
//Create Positions
async function executeCreatePosition(req, code, effectiveStartDate) {
    try {
        console.log('executeCreatePosition');
        const position = await cds.tx(req).run(SELECT.one.from(namespace + 'Positions')
            .columns(['code', 'effectiveStartDate'])
            .where({
                code: {
                    '=': code
                },
                effectiveStartDate: {
                    '=': effectiveStartDate
                }
            }));
        if (!position) {
            const sfPosition = await PositionService.tx(req).run(SELECT.one.from('Position')
                .columns(['code', 'effectiveStartDate', 'positionTitle', 'jobTitle', 'company', 'businessUnit', 'department', 'comment', 'costCenter', 'createdDate', 'createdBy', 'division', 'effectiveStatus', 'externalName_defaultValue', 'externalName_en_US', 'jobCode', 'employeeClass'])
                .where({
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
    const sfPosition = await PositionService.tx(req).run(SELECT.one.from('Position')
        .columns(['code', 'effectiveStartDate', 'positionTitle', 'jobTitle', 'company', 'businessUnit', 'department', 'comment', 'costCenter', 'createdDate', 'createdBy', 'division', 'effectiveStatus', 'externalName_defaultValue', 'externalName_en_US', 'jobCode', 'positionMatrixRelationship', 'parentPosition', 'employeeClass'])
        .where({
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

////////////////////////////////////////////////////////////////////////////
///CostCenters
//Create CostCenter
async function executeCreateCostCenter(req, externalCode, startDate) {
    try {
        console.log('executeCreateCostCenter');
        const CostCenter = await cds.tx(req).run(SELECT.one.from(namespace + 'CostCenters').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!CostCenter) {
            const sfCostCenter = await FoundationService.tx(req).run(SELECT.one.from('FOCostCenter')
                .columns(['externalCode', 'startDate', 'costcenterExternalObjectID', 'costcenterManager', 'createdDateTime', 'description', 'description_defaultValue', 'createdBy'])
                .where({
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
    const sfCostCenter = await FoundationService.tx(req).run(SELECT.one.from('FOCostCenter')
        .columns(['externalCode', 'startDate', 'costcenterExternalObjectID', 'costcenterManager', 'createdDateTime', 'description', 'description_defaultValue', 'createdBy'])
        .where({
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
        const externalCode = (item.costCenter_externalCode) ? item.costCenter_externalCode : null;
        const startDate = (item.costCenter_startDate) ? item.costCenter_startDate : null;
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

////////////////////////////////////////////////////////////////////////////
///Companies
//Create Company
async function executeCreateCompany(req, externalCode, startDate) {
    try {
        console.log('executeCreateCompany');
        const Company = await cds.tx(req).run(SELECT.one.from(namespace + 'Companies').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!Company) {
            const sfCompany = await FoundationService.tx(req).run(SELECT.one.from('FOCompany')
                .columns([
                    'externalCode',
                    "startDate",
                    "createdBy",
                    "createdDateTime",
                    "createdOn",
                    "currency",
                    "defaultLocation",
                    "defaultPayGroup",
                    "description",
                    "description_de_DE",
                    "description_defaultValue",
                    "description_en_GB",
                    "description_en_US",
                    "description_es_ES",
                    "description_fr_FR",
                    "description_ja_JP",
                    "description_ko_KR",
                    "description_localized",
                    "description_nl_NL",
                    "description_pt_BR",
                    "description_pt_PT",
                    "description_ru_RU",
                    "description_zh_CN",
                    "description_zh_TW",
                    "endDate",
                    "lastModifiedBy",
                    "lastModifiedDateTime",
                    "lastModifiedOn",
                    "name",
                    "name_de_DE",
                    "name_defaultValue",
                    "name_en_GB",
                    "name_en_US",
                    "name_es_ES",
                    "name_fr_FR",
                    "name_ja_JP",
                    "name_ko_KR",
                    "name_localized",
                    "name_nl_NL",
                    "name_pt_BR",
                    "name_pt_PT",
                    "name_ru_RU",
                    "name_zh_CN",
                    "name_zh_TW",
                    "standardHours",
                    "status"
                ])
                .where({
                    externalCode: {
                        '=': externalCode
                    },
                    startDate: {
                        '=': startDate
                    }
                }));
            if (sfCompany) {
                await cds.tx(req).run(INSERT.into(namespace + 'Companies').entries(sfCompany));
            }
        }
    } catch (err) {
        console.log(err)
        console.log(err.code, err.message);
        req.error(err.code, err.message);
        console.log('erro create company')
    }
}

//Update Companies
async function executeUpdateCompany(req, externalCode, startDate) {
    try {
        console.log('executeUpdateCompany');
        const sfCompany = await FoundationService.tx(req).run(SELECT.one.from('FOCompany')
            .columns([
                'externalCode',
                "startDate",
                "createdBy",
                "createdDateTime",
                "createdOn",
                "currency",
                "defaultLocation",
                "defaultPayGroup",
                "description",
                "description_de_DE",
                "description_defaultValue",
                "description_en_GB",
                "description_en_US",
                "description_es_ES",
                "description_fr_FR",
                "description_ja_JP",
                "description_ko_KR",
                "description_localized",
                "description_nl_NL",
                "description_pt_BR",
                "description_pt_PT",
                "description_ru_RU",
                "description_zh_CN",
                "description_zh_TW",
                "endDate",
                "lastModifiedBy",
                "lastModifiedDateTime",
                "lastModifiedOn",
                "name",
                "name_de_DE",
                "name_defaultValue",
                "name_en_GB",
                "name_en_US",
                "name_es_ES",
                "name_fr_FR",
                "name_ja_JP",
                "name_ko_KR",
                "name_localized",
                "name_nl_NL",
                "name_pt_BR",
                "name_pt_PT",
                "name_ru_RU",
                "name_zh_CN",
                "name_zh_TW",
                "standardHours",
                "status"
            ])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (sfCompany) {
            await cds.tx(req).run(UPDATE.entity(namespace + 'Companies').data(sfCompany));
        }
    } catch (error) {
        console.log(err.code);
        console.log(err.message);
        req.error(err.code, err.message);
        console.log('erro execute update company');
    }
}

async function beforeCreateCompanies(req) {
    try {
        // Add SF Company to Companies entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.company_externalCode) ? item.company_externalCode : null;
        const startDate = (item.company_startDate) ? item.company_startDate : null;
        if (externalCode && startDate) {
            await executeCreateCompany(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        console.log(err.code);
        console.log(err.message);
        req.error(err.code, err.message);
        console.log('erro before create company');
    }
}

async function beforeUpdateCompanies(req) {

}

async function beforeDeleteCompanies(req) {

}

module.exports = {
    readSF_Positions,
    readSF_CostCenters,
    readSF_PositionMatrixRelationships,
    readSF_Companies,
    onSendRequestForApproval,
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    beforeCreatePositions,
    beforeUpdatePositions,
    beforeDeletePositions,
    beforeCreateCostCenters,
    beforeUpdateCostCenters,
    beforeDeleteCostCenters,
    beforeCreateCompanies,
    beforeUpdateCompanies,
    beforeDeleteCompanies,
}