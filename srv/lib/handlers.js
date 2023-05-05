const cds = require('@sap/cds');
const namespace = 'deloitte.hiring.db.';
const namespaceCatalogService = 'deloitte.hiring.service.catalogservice.';

let FoundationService = null;
let PositionService = null;

(async function () {
    // Connect to external SF OData services
    FoundationService = await cds.connect.to('ECFoundationOrganization');
    PositionService = await cds.connect.to('ECPositionManagement');
    HiringRequestPAService = await cds.connect.to('HiringProcessAutomation');
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
// Read SF entities
async function readSF_Entities(req) {
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

        try {
            const response = await HiringRequestPAService.tx(req).post("/", {
                
                
            });
        } catch (error) {
            console.error("Error Message: " + error.message);
        };

        // await UPDATE(req._target).with({
        //     status_ID: 3
        // });
    } catch (err) {
        req.error(err.code, err.message);
    }
}

// Before "save" project (exclusive for Fiori Draft support)
async function beforeSaveRequests(req) {

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

        if (req.data.division_externalCode) {
            let division = await cds.tx(req).run(SELECT.one.from(namespace + 'Divisions').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.division_externalCode
                },
                startDate: {
                    '=': req.data.division_startDate
                }
            }));
            if (!division) {
                await executeCreateDivision(req, req.data.division_externalCode, req.data.division_startDate)
            } else {
                await executeUpdateDivision(req, req.data.division_externalCode, req.data.division_startDate)
            }
        }

        if (req.data.department_externalCode) {
            let department = await cds.tx(req).run(SELECT.one.from(namespace + 'Departments').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.department_externalCode
                },
                startDate: {
                    '=': req.data.department_startDate
                }
            }));
            if (!department) {
                await executeCreateDepartment(req, req.data.department_externalCode, req.data.department_startDate)
            } else {
                await executeUpdateDepartment(req, req.data.department_externalCode, req.data.department_startDate)
            }
        }

        if (req.data.businessUnit_externalCode) {
            let businessUnit = await cds.tx(req).run(SELECT.one.from(namespace + 'BusinessUnits').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.businessUnit_externalCode
                },
                startDate: {
                    '=': req.data.businessUnit_startDate
                }
            }));
            if (!businessUnit) {
                await executeCreateBusinessUnit(req, req.data.businessUnit_externalCode, req.data.businessUnit_startDate)
            } else {
                await executeUpdateBusinessUnit(req, req.data.businessUnit_externalCode, req.data.businessUnit_startDate)
            }
        }

        if (req.data.jobCode_externalCode) {
            let jobCode = await cds.tx(req).run(SELECT.one.from(namespace + 'JobCodes').columns(['externalCode', 'startDate']).where({
                externalCode: {
                    '=': req.data.jobCode_externalCode
                },
                startDate: {
                    '=': req.data.jobCode_startDate
                }
            }));
            if (!jobCode) {
                await executeCreateJobCode(req, req.data.jobCode_externalCode, req.data.jobCode_startDate)
            } else {
                await executeUpdateJobCode(req, req.data.jobCode_externalCode, req.data.jobCode_startDate)
            }
        }

        return req;
    } catch (err) {
        //req.error(err.code, err.message);
        console.log(err.code);
        console.log(err.message);
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
        //req.error(err.code, err.message);
        console.log(err.code)
        console.log(err.message)
    }
}

//Update virtual fields
async function afterReadRequests(Requests, req) {
    try {
        if (Array.isArray(Requests)) {
            return Promise.all(Requests.map(async Request => {
                Request = await updateBudgetInfo(Request, req);
            }))
        } else {
            Requests = await updateBudgetInfo(Requests, req);
        }
        return Requests;
    } catch (err) {
        req.error(err.code, err.message);
    }
}

//Update the organizational units based on template
async function afterPatchRequests(Requests, req) {
    try {
        if (Array.isArray(Requests)) {
            return Promise.all(Requests.map(async Request => {
                Request = await updateOrganizational(Request, req);
            }))
        } else {
            Requests = await updateOrganizational(Requests, req);
        }
        return Requests;
    } catch (err) {
        req.error(err.code, err.message);
        //console.log(err.code);
        //console.log(err.message);
    }
}

//Update organizational entities based on template
async function updateOrganizational(Request, req) {

    let updated = false;

    let RequestDraftOrganizational = await cds.tx(req).run(SELECT.one.from(namespaceCatalogService + 'Requests_drafts')
        .where({
            ID: {
                '=': Request.ID
            }
        }));

    if (RequestDraftOrganizational.POSITION_CODE && RequestDraftOrganizational.POSITION_EFFECTIVESTARTDATE) {

        let templatesfPosition = await PositionService.tx(req).run(SELECT.one.from('Position')
            .columns(['code', 'effectiveStartDate', 'positionTitle', 'jobTitle', 'jobCode', 'company', 'businessUnit', 'department', 'costCenter', 'division', 'effectiveStatus', 'externalName_defaultValue', 'externalName_en_US'])
            .where({
                code: {
                    '=': RequestDraftOrganizational.POSITION_CODE
                },
                effectiveStartDate: {
                    '=': RequestDraftOrganizational.POSITION_EFFECTIVESTARTDATE
                }
            }));

        if (templatesfPosition) {

            if (!RequestDraftOrganizational.TITLE && templatesfPosition.positionTitle) {

                RequestDraftOrganizational.TITLE = templatesfPosition.positionTitle;
                updated = true;

            }

            if (!RequestDraftOrganizational.COSTCENTER_EXTERNALCODE && templatesfPosition.costCenter) {

                const sfCostCenter = await FoundationService.tx(req).run(SELECT.one.from('FOCostCenter')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.costCenter
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfCostCenter) {
                    RequestDraftOrganizational.COSTCENTER_EXTERNALCODE = sfCostCenter.externalCode;
                    RequestDraftOrganizational.COSTCENTER_STARTDATE = sfCostCenter.startDate
                    updated = true;
                    await executeUpdateCostCenter(req, sfCostCenter.externalCode, sfCostCenter.startDate)

                }

            }

            if (!RequestDraftOrganizational.COMPANY_EXTERNALCODE && templatesfPosition.company) {

                const sfCompany = await FoundationService.tx(req).run(SELECT.one.from('FOCompany')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.company
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfCompany) {

                    RequestDraftOrganizational.COMPANY_EXTERNALCODE = sfCompany.externalCode;
                    RequestDraftOrganizational.COMPANY_STARTDATE = sfCompany.startDate;
                    updated = true;

                }

            }

            if (!RequestDraftOrganizational.DIVISION_EXTERNALCODE && templatesfPosition.division) {

                const sfDivision = await FoundationService.tx(req).run(SELECT.one.from('FODivision')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.division
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfDivision) {

                    RequestDraftOrganizational.DIVISION_EXTERNALCODE = sfDivision.externalCode;
                    RequestDraftOrganizational.DIVISION_STARTDATE = sfDivision.startDate;
                    updated = true;

                }

            }

            if (!RequestDraftOrganizational.BUSINESSUNIT_EXTERNALCODE && templatesfPosition.businessUnit) {

                const sfBusinessUnit = await FoundationService.tx(req).run(SELECT.one.from('FOBusinessUnit')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.businessUnit
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfBusinessUnit) {

                    RequestDraftOrganizational.BUSINESSUNIT_EXTERNALCODE = sfBusinessUnit.externalCode;
                    RequestDraftOrganizational.BUSINESSUNIT_STARTDATE = sfBusinessUnit.startDate;
                    updated = true;

                }

            }

            if (!RequestDraftOrganizational.DEPARTMENT_EXTERNALCODE && templatesfPosition.department) {

                const sfDepartment = await FoundationService.tx(req).run(SELECT.one.from('FODepartment')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.department
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfDepartment) {

                    RequestDraftOrganizational.DEPARTMENT_EXTERNALCODE = sfDepartment.externalCode;
                    RequestDraftOrganizational.DEPARTMENT_STARTDATE = sfDepartment.startDate;
                    updated = true;

                }

            }

            if (!RequestDraftOrganizational.JOBCODE_EXTERNALCODE && templatesfPosition.jobCode) {

                const sfJobCode = await FoundationService.tx(req).run(SELECT.one.from('FOJobCode')
                    .columns(['externalCode', 'startDate'])
                    .where({
                        externalCode: {
                            '=': templatesfPosition.jobCode
                        },
                        status: {
                            '=': 'A'
                        }
                    }));

                if (sfJobCode) {

                    RequestDraftOrganizational.JOBCODE_EXTERNALCODE = sfJobCode.externalCode;
                    RequestDraftOrganizational.JOBCODE_STARTDATE = sfJobCode.startDate;
                    updated = true;

                }

            }

            //TODO get CostCenter
            if (RequestDraftOrganizational.BUDGET == 0e+0 && RequestDraftOrganizational.BUDGETCAP == 0e+0) {


                RequestDraftOrganizational.BUDGET = 1110000.00;
                RequestDraftOrganizational.BUDGETCAP = 1250000.00;
                RequestDraftOrganizational.CURRENCY_CODE = 'EUR';
                updated = true;

            }

            if (updated) {
                await cds.tx(req).run(UPDATE.entity(namespaceCatalogService + 'Requests_drafts').data(RequestDraftOrganizational));
            }

        }

    }

    return Request;
}

async function updateBudgetInfo(Request, req) {
    let RequestBudget = await cds.tx(req).run(SELECT.one.from(namespace + 'Requests').columns(['budget', 'budgetCap']).where({
        ID: {
            '=': Request.ID
        }
    }));
    if (RequestBudget && RequestBudget.budget && RequestBudget.budgetCap && RequestBudget.budgetCap > 0 && RequestBudget.budget > 0) {
        Request.budgetPer = Math.abs((RequestBudget.budget / RequestBudget.budgetCap) * 100).toFixed(2);
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
        //console.log(err)
        //console.log(err.code, err.message);
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
        //console.log(err)
        //console.log(err.code, err.message);
        req.error(err.code, err.message);
    }
}

//Update CostCenters
async function executeUpdateCostCenter(req, externalCode, startDate) {
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

///////////////////////////////////////////////////////////////////////////
//Companies
//Create Company
async function executeCreateCompany(req, externalCode, startDate) {
    try {
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
        req.error(err.code, err.message);
        //console.log(err)
        //console.log(err.code, err.message);
    }
}

//Update Companies
async function executeUpdateCompany(req, externalCode, startDate) {
    try {
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
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
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
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
    }
}

async function beforeUpdateCompanies(req) {

}

async function beforeDeleteCompanies(req) {

}

///////////////////////////////////////////////////////////////////////////
//Divisions
//Create Division
async function executeCreateDivision(req, externalCode, startDate) {
    try {
        const Division = await cds.tx(req).run(SELECT.one.from(namespace + 'Divisions').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!Division) {
            const sfDivision = await FoundationService.tx(req).run(SELECT.one.from('FODivision')
                .columns([
                    'externalCode',
                    "startDate",
                    // "createdBy",
                    // "createdDateTime",
                    // "createdOn",
                    // "currency",
                    // "defaultLocation",
                    // "defaultPayGroup",
                    // "description",
                    // "description_de_DE",
                    "description_defaultValue",
                    // "description_en_GB",
                    // "description_en_US",
                    // "description_es_ES",
                    // "description_fr_FR",
                    // "description_ja_JP",
                    // "description_ko_KR",
                    // "description_localized",
                    // "description_nl_NL",
                    // "description_pt_BR",
                    // "description_pt_PT",
                    // "description_ru_RU",
                    // "description_zh_CN",
                    // "description_zh_TW",
                    // "endDate",
                    // "lastModifiedBy",
                    // "lastModifiedDateTime",
                    // "lastModifiedOn",
                    // "name",
                    // "name_de_DE",
                    "name_defaultValue",
                    // "name_en_GB",
                    // "name_en_US",
                    // "name_es_ES",
                    // "name_fr_FR",
                    // "name_ja_JP",
                    // "name_ko_KR",
                    // "name_localized",
                    // "name_nl_NL",
                    // "name_pt_BR",
                    // "name_pt_PT",
                    // "name_ru_RU",
                    // "name_zh_CN",
                    // "name_zh_TW",
                    // "standardHours",
                    // "status"
                ])
                .where({
                    externalCode: {
                        '=': externalCode
                    },
                    startDate: {
                        '=': startDate
                    }
                }));
            if (sfDivision) {
                await cds.tx(req).run(INSERT.into(namespace + 'Divisions').entries(sfDivision));
            }
        }
    } catch (err) {
        req.error(err.code, err.message);
        //console.log(err)
        //console.log(err.code, err.message);
    }
}

//Update Divisions
async function executeUpdateDivision(req, externalCode, startDate) {
    try {
        const sfDivision = await FoundationService.tx(req).run(SELECT.one.from('FODivision')
            .columns([
                'externalCode',
                "startDate",
                // "createdBy",
                // "createdDateTime",
                // "createdOn",
                // "currency",
                // "defaultLocation",
                // "defaultPayGroup",
                // "description",
                // "description_de_DE",
                "description_defaultValue",
                // "description_en_GB",
                // "description_en_US",
                // "description_es_ES",
                // "description_fr_FR",
                // "description_ja_JP",
                // "description_ko_KR",
                // "description_localized",
                // "description_nl_NL",
                // "description_pt_BR",
                // "description_pt_PT",
                // "description_ru_RU",
                // "description_zh_CN",
                // "description_zh_TW",
                // "endDate",
                // "lastModifiedBy",
                // "lastModifiedDateTime",
                // "lastModifiedOn",
                // "name",
                // "name_de_DE",
                "name_defaultValue",
                // "name_en_GB",
                // "name_en_US",
                // "name_es_ES",
                // "name_fr_FR",
                // "name_ja_JP",
                // "name_ko_KR",
                // "name_localized",
                // "name_nl_NL",
                // "name_pt_BR",
                // "name_pt_PT",
                // "name_ru_RU",
                // "name_zh_CN",
                // "name_zh_TW",
                // "standardHours",
                // "status"
            ])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (sfDivision) {
            await cds.tx(req).run(UPDATE.entity(namespace + 'Divisions').data(sfDivision));
        }
    } catch (error) {
        req.error(err.code, err.message);
        //console.log(err.code);
        //console.log(err.message);
    }
}

async function beforeCreateDivisions(req) {
    try {
        // Add SF Division to Divisions entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.division_externalCode) ? item.division_externalCode : null;
        const startDate = (item.division_startDate) ? item.division_startDate : null;
        if (externalCode && startDate) {
            await executeCreateDivision(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
    }
}

async function beforeUpdateDivisions(req) {

}

async function beforeDeleteDivisions(req) {

}

///////////////////////////////////////////////////////////////////////////
//Departments
//Create department
async function executeCreateDepartment(req, externalCode, startDate) {
    try {
        const department = await cds.tx(req).run(SELECT.one.from(namespace + 'Departments').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!department) {
            const sfDepartment = await FoundationService.tx(req).run(SELECT.one.from('FODepartment')
                .columns([
                    'externalCode',
                    "startDate",
                    // "createdBy",
                    // "createdDateTime",
                    // "createdOn",
                    // "currency",
                    // "defaultLocation",
                    // "defaultPayGroup",
                    // "description",
                    // "description_de_DE",
                    "description_defaultValue",
                    // "description_en_GB",
                    // "description_en_US",
                    // "description_es_ES",
                    // "description_fr_FR",
                    // "description_ja_JP",
                    // "description_ko_KR",
                    // "description_localized",
                    // "description_nl_NL",
                    // "description_pt_BR",
                    // "description_pt_PT",
                    // "description_ru_RU",
                    // "description_zh_CN",
                    // "description_zh_TW",
                    // "endDate",
                    // "lastModifiedBy",
                    // "lastModifiedDateTime",
                    // "lastModifiedOn",
                    // "name",
                    // "name_de_DE",
                    "name_defaultValue",
                    // "name_en_GB",
                    // "name_en_US",
                    // "name_es_ES",
                    // "name_fr_FR",
                    // "name_ja_JP",
                    // "name_ko_KR",
                    // "name_localized",
                    // "name_nl_NL",
                    // "name_pt_BR",
                    // "name_pt_PT",
                    // "name_ru_RU",
                    // "name_zh_CN",
                    // "name_zh_TW",
                    // "standardHours",
                    // "status"
                ])
                .where({
                    externalCode: {
                        '=': externalCode
                    },
                    startDate: {
                        '=': startDate
                    }
                }));
            if (sfDepartment) {
                await cds.tx(req).run(INSERT.into(namespace + 'Departments').entries(sfDepartment));
            }
        }
    } catch (err) {
        req.error(err.code, err.message);
        //console.log(err)
        //console.log(err.code, err.message);
    }
}

//Update Departments
async function executeUpdateDepartment(req, externalCode, startDate) {
    try {
        const sfDepartment = await FoundationService.tx(req).run(SELECT.one.from('FODepartment')
            .columns([
                'externalCode',
                "startDate",
                // "createdBy",
                // "createdDateTime",
                // "createdOn",
                // "currency",
                // "defaultLocation",
                // "defaultPayGroup",
                // "description",
                // "description_de_DE",
                "description_defaultValue",
                // "description_en_GB",
                // "description_en_US",
                // "description_es_ES",
                // "description_fr_FR",
                // "description_ja_JP",
                // "description_ko_KR",
                // "description_localized",
                // "description_nl_NL",
                // "description_pt_BR",
                // "description_pt_PT",
                // "description_ru_RU",
                // "description_zh_CN",
                // "description_zh_TW",
                // "endDate",
                // "lastModifiedBy",
                // "lastModifiedDateTime",
                // "lastModifiedOn",
                // "name",
                // "name_de_DE",
                "name_defaultValue",
                // "name_en_GB",
                // "name_en_US",
                // "name_es_ES",
                // "name_fr_FR",
                // "name_ja_JP",
                // "name_ko_KR",
                // "name_localized",
                // "name_nl_NL",
                // "name_pt_BR",
                // "name_pt_PT",
                // "name_ru_RU",
                // "name_zh_CN",
                // "name_zh_TW",
                // "standardHours",
                // "status"
            ])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (sfDepartment) {
            await cds.tx(req).run(UPDATE.entity(namespace + 'Departments').data(sfDepartment));
        }
    } catch (error) {
        req.error(err.code, err.message);
        //console.log(err.code);
        //console.log(err.message);
        //console.log('erro execute update department');
    }
}

async function beforeCreateDepartments(req) {
    try {
        // Add SF department to Departments entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.department_externalCode) ? item.department_externalCode : null;
        const startDate = (item.department_startDate) ? item.department_startDate : null;
        if (externalCode && startDate) {
            await executeCreateDepartment(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
    }
}

async function beforeUpdateDepartments(req) {

}

async function beforeDeleteDepartments(req) {

}

///////////////////////////////////////////////////////////////////////////
//BusinessUnits
//Create BusinessUnit
async function executeCreateBusinessUnit(req, externalCode, startDate) {
    try {
        const businessUnit = await cds.tx(req).run(SELECT.one.from(namespace + 'BusinessUnits').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!businessUnit) {
            const sfBusinessUnit = await FoundationService.tx(req).run(SELECT.one.from('FOBusinessUnit')
                .columns([
                    'externalCode',
                    "startDate",
                    // "createdBy",
                    // "createdDateTime",
                    // "createdOn",
                    // "currency",
                    // "defaultLocation",
                    // "defaultPayGroup",
                    // "description",
                    // "description_de_DE",
                    "description_defaultValue",
                    // "description_en_GB",
                    // "description_en_US",
                    // "description_es_ES",
                    // "description_fr_FR",
                    // "description_ja_JP",
                    // "description_ko_KR",
                    // "description_localized",
                    // "description_nl_NL",
                    // "description_pt_BR",
                    // "description_pt_PT",
                    // "description_ru_RU",
                    // "description_zh_CN",
                    // "description_zh_TW",
                    // "endDate",
                    // "lastModifiedBy",
                    // "lastModifiedDateTime",
                    // "lastModifiedOn",
                    // "name",
                    // "name_de_DE",
                    "name_defaultValue",
                    // "name_en_GB",
                    // "name_en_US",
                    // "name_es_ES",
                    // "name_fr_FR",
                    // "name_ja_JP",
                    // "name_ko_KR",
                    // "name_localized",
                    // "name_nl_NL",
                    // "name_pt_BR",
                    // "name_pt_PT",
                    // "name_ru_RU",
                    // "name_zh_CN",
                    // "name_zh_TW",
                    // "standardHours",
                    // "status"
                ])
                .where({
                    externalCode: {
                        '=': externalCode
                    },
                    startDate: {
                        '=': startDate
                    }
                }));
            if (sfBusinessUnit) {
                await cds.tx(req).run(INSERT.into(namespace + 'BusinessUnits').entries(sfBusinessUnit));
            }
        }
    } catch (err) {
        req.error(err.code, err.message);
        //console.log(err)
        //console.log(err.code, err.message);
    }
}

//Update BusinessUnits
async function executeUpdateBusinessUnit(req, externalCode, startDate) {
    try {
        const sfBusinessUnit = await FoundationService.tx(req).run(SELECT.one.from('FOBusinessUnit')
            .columns([
                'externalCode',
                "startDate",
                // "createdBy",
                // "createdDateTime",
                // "createdOn",
                // "currency",
                // "defaultLocation",
                // "defaultPayGroup",
                // "description",
                // "description_de_DE",
                "description_defaultValue",
                // "description_en_GB",
                // "description_en_US",
                // "description_es_ES",
                // "description_fr_FR",
                // "description_ja_JP",
                // "description_ko_KR",
                // "description_localized",
                // "description_nl_NL",
                // "description_pt_BR",
                // "description_pt_PT",
                // "description_ru_RU",
                // "description_zh_CN",
                // "description_zh_TW",
                // "endDate",
                // "lastModifiedBy",
                // "lastModifiedDateTime",
                // "lastModifiedOn",
                // "name",
                // "name_de_DE",
                "name_defaultValue",
                // "name_en_GB",
                // "name_en_US",
                // "name_es_ES",
                // "name_fr_FR",
                // "name_ja_JP",
                // "name_ko_KR",
                // "name_localized",
                // "name_nl_NL",
                // "name_pt_BR",
                // "name_pt_PT",
                // "name_ru_RU",
                // "name_zh_CN",
                // "name_zh_TW",
                // "standardHours",
                // "status"
            ])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (sfBusinessUnit) {
            await cds.tx(req).run(UPDATE.entity(namespace + 'BusinessUnits').data(sfBusinessUnit));
        }
    } catch (error) {
        req.error(err.code, err.message);
        //console.log(err.code);
        //console.log(err.message);
    }
}

async function beforeCreateBusinessUnits(req) {
    try {
        // Add SF BusinessUnit to BusinessUnits entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.businessUnit_externalCode) ? item.businessUnit_externalCode : null;
        const startDate = (item.businessUnit_startDate) ? item.businessUnit_startDate : null;
        if (externalCode && startDate) {
            await executeCreateBusinessUnit(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
    }
}

async function beforeUpdateBusinessUnits(req) {

}

async function beforeDeleteBusinessUnits(req) {

}

///////////////////////////////////////////////////////////////////////////
//JobCodes
//Create JobCode
async function executeCreateJobCode(req, externalCode, startDate) {
    try {
        const jobCode = await cds.tx(req).run(SELECT.one.from(namespace + 'JobCodes').columns(['externalCode', 'startDate'])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (!jobCode) {
            const sfJobCode = await FoundationService.tx(req).run(SELECT.one.from('FOJobCode')
                .columns([
                    'externalCode',
                    "startDate",
                    "createdBy",
                    "createdDateTime",
                    "createdOn",
                    "employeeClass",
                    "endDate",
                    "grade",
                    "isFulltimeEmployee",
                    "isRegular",
                    "jobFunction",
                    "jobLevel",
                    "lastModifiedBy",
                    "lastModifiedDateTime",
                    "lastModifiedOn",
                    "name",
                    "name_defaultValue",
                    "name_localized",
                    "parentJobCode",
                    "standardHours",
                    "status",
                    "supervisorLevel",
                    "workerCompCode"
                ])
                .where({
                    externalCode: {
                        '=': externalCode
                    },
                    startDate: {
                        '=': startDate
                    }
                }));
            if (sfJobCode) {
                await cds.tx(req).run(INSERT.into(namespace + 'JobCodes').entries(sfJobCode));
            }
        }
    } catch (err) {
        req.error(err.code, err.message);
        //console.log(err)
        //console.log(err.code, err.message);
    }
}

//Update JobCodes
async function executeUpdateJobCode(req, externalCode, startDate) {
    try {
        const sfJobCode = await FoundationService.tx(req).run(SELECT.one.from('FOJobCode')
            .columns([
                'externalCode',
                "startDate",
                "createdBy",
                "createdDateTime",
                "createdOn",
                "employeeClass",
                "endDate",
                "grade",
                "isFulltimeEmployee",
                "isRegular",
                "jobFunction",
                "jobLevel",
                "lastModifiedBy",
                "lastModifiedDateTime",
                "lastModifiedOn",
                "name",
                "name_defaultValue",
                "name_localized",
                "parentJobCode",
                "standardHours",
                "status",
                "supervisorLevel",
                "workerCompCode"
            ])
            .where({
                externalCode: {
                    '=': externalCode
                },
                startDate: {
                    '=': startDate
                }
            }));
        if (sfJobCode) {
            await cds.tx(req).run(UPDATE.entity(namespace + 'JobCodes').data(sfJobCode));
        }
    } catch (error) {
        req.error(err.code, err.message);
        //console.log(err.code);
        //console.log(err.message);
    }
}

async function beforeCreateJobCodes(req) {
    try {
        // Add SF JobCode to JobCodes entity if it does not exist yet
        const item = req.data;
        const externalCode = (item.jobCode_externalCode) ? item.jobCode_externalCode : null;
        const startDate = (item.jobCode_startDate) ? item.jobCode_startDate : null;
        if (externalCode && startDate) {
            await executeCreateJobCode(req, externalCode, startDate);
        }
        return req;
    } catch (err) {
        //console.log(err.code);
        //console.log(err.message);
        req.error(err.code, err.message);
    }
}

async function beforeUpdateJobCodes(req) {

}

async function beforeDeleteJobCodes(req) {

}


module.exports = {
    readSF_Entities,
    onSendRequestForApproval,
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    afterPatchRequests,
    beforeCreatePositions,
    beforeUpdatePositions,
    beforeDeletePositions,
    beforeCreateCostCenters,
    beforeUpdateCostCenters,
    beforeDeleteCostCenters,
    beforeCreateCompanies,
    beforeUpdateCompanies,
    beforeDeleteCompanies,
    beforeCreateDivisions,
    beforeUpdateDivisions,
    beforeDeleteDivisions,
    beforeCreateDepartments,
    beforeUpdateDepartments,
    beforeDeleteDepartments,
    beforeCreateBusinessUnits,
    beforeUpdateBusinessUnits,
    beforeDeleteBusinessUnits,
    beforeCreateJobCodes,
    beforeUpdateJobCodes,
    beforeDeleteJobCodes,
}