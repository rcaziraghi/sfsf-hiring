const cds = require('@sap/cds');
require('./workarounds');

const {
    onSendRequestForApproval,
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    afterPatchRequests,
    readSF_Entities,
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
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {
    /*** SERVICE ENTITIES ***/
    const {
        Requests,
        Positions,
        CostCenters,
        Companies,
        Divisions,
        Departments,
        BusinessUnits,
        JobCodes,
        SF_Positions,
        SF_JobCodes,
        SF_CostCenters,
        SF_PositionMatrixRelationships,
        SF_Companies,
        SF_BusinessUnits,
        SF_Divisions,
        SF_Departments,
    } = this.entities;

    /*** HANDLERS REGISTRATION ***/
    // Actions
    this.on('sendRequestForApproval', Requests, onSendRequestForApproval);

    // ON events
    this.on('READ', SF_Positions, readSF_Entities);
    this.on('READ', SF_CostCenters, readSF_Entities);
    this.on('READ', SF_JobCodes, readSF_Entities);
    this.on('READ', SF_PositionMatrixRelationships, readSF_Entities);
    this.on('READ', SF_Companies, readSF_Entities);
    this.on('READ', SF_BusinessUnits, readSF_Entities);
    this.on('READ', SF_Divisions, readSF_Entities);
    this.on('READ', SF_Departments, readSF_Entities);

    // BEFORE events
    this.before('SAVE', Requests, beforeSaveRequests);
    this.before('CREATE', Requests, beforeCreateRequests);

    this.before('CREATE', Positions, beforeCreatePositions);
    this.before('UPDATE', Positions, beforeUpdatePositions);
    this.before('DELETE', Positions, beforeDeletePositions);

    this.before('CREATE', CostCenters, beforeCreateCostCenters);
    this.before('UPDATE', CostCenters, beforeUpdateCostCenters);
    this.before('DELETE', CostCenters, beforeDeleteCostCenters);

    this.before('CREATE', Companies, beforeCreateCompanies);
    this.before('UPDATE', Companies, beforeUpdateCompanies);
    this.before('DELETE', Companies, beforeDeleteCompanies);

    this.before('CREATE', Divisions, beforeCreateDivisions);
    this.before('UPDATE', Divisions, beforeUpdateDivisions);
    this.before('DELETE', Divisions, beforeDeleteDivisions);

    this.before('CREATE', Departments, beforeCreateDepartments);
    this.before('UPDATE', Departments, beforeUpdateDepartments);
    this.before('DELETE', Departments, beforeDeleteDepartments);

    this.before('CREATE', BusinessUnits, beforeCreateBusinessUnits);
    this.before('UPDATE', BusinessUnits, beforeUpdateBusinessUnits);
    this.before('DELETE', BusinessUnits, beforeDeleteBusinessUnits);

    this.before('CREATE', JobCodes, beforeCreateJobCodes);
    this.before('UPDATE', JobCodes, beforeUpdateJobCodes);
    this.before('DELETE', JobCodes, beforeDeleteJobCodes);

    // AFTER events
    this.after('SAVE', Requests, afterSaveRequests);
    this.after('READ', Requests, afterReadRequests);
    this.after('PATCH', Requests, afterPatchRequests);
});