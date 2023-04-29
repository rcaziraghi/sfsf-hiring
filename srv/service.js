const cds = require('@sap/cds');
require('./workarounds');

const {
    onSendRequestForApproval,
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    afterPatchRequests,
    // readSF_Positions,
    // readSF_CostCenters,
    // readSF_PositionMatrixRelationships,
    // readSF_Companies,
    // readSF_JobCodes,
    readSF_Entities,
    beforeCreatePositions,
    beforeUpdatePositions,
    beforeDeletePositions,
    beforeCreateCostCenters,
    beforeUpdateCostCenters,
    beforeDeleteCostCenters,
    // beforeCreateCompanies,
    // beforeUpdateCompanies,
    // beforeDeleteCompanies,
    afterUp
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {
    /*** SERVICE ENTITIES ***/
    const {
        Requests,
        Positions,
        CostCenters,
        // Companies,
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
    this.on('sendRequestForApproval', onSendRequestForApproval);

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

    this.before('PATCH', Requests, async req => {

        console.log("before patch")

    });

    // this.before('CREATE', Companies, beforeCreateCompanies);
    // this.before('UPDATE', Companies, beforeUpdateCompanies);
    // this.before('DELETE', Companies, beforeDeleteCompanies);

    // AFTER events
    this.after('SAVE', Requests, afterSaveRequests);
    this.after('READ', Requests, afterReadRequests);
    this.after('PATCH', Requests, afterPatchRequests);
});