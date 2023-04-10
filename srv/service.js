const cds = require('@sap/cds'); 
require('./workarounds');

const {
    onSendRequestForApproval,
    beforeSaveRequests,
    beforeCreateRequests,
    afterSaveRequests,
    afterReadRequests,
    readSF_Positions,
    readSF_CostCenters,
    readSF_PositionMatrixRelationships,
    readSF_Companies,
    beforeCreatePositions,
    beforeUpdatePositions,
    beforeDeletePositions,
    beforeCreateCostCenters,
    beforeUpdateCostCenters,
    beforeDeleteCostCenters,
    beforeCreateCompanies,
    beforeUpdateCompanies,
    beforeDeleteCompanies
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {
    /*** SERVICE ENTITIES ***/
    const {
        Requests,
        Positions,
        CostCenters,
        Companies,
        SF_Positions,
        SF_CostCenters,
        SF_PositionMatrixRelationships,
        SF_Companies,
    } = this.entities;

    /*** HANDLERS REGISTRATION ***/
    // Actions
    this.on('sendRequestForApproval', onSendRequestForApproval);

    // ON events
    this.on('READ', SF_Positions, readSF_Positions);
    this.on('READ', SF_CostCenters, readSF_CostCenters);
    this.on('READ', SF_PositionMatrixRelationships, readSF_PositionMatrixRelationships);
    this.on('READ', SF_Companies, readSF_Companies);

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

    // AFTER events
    this.after('SAVE', Requests, afterSaveRequests);
    this.after('READ', Requests, afterReadRequests);

});
