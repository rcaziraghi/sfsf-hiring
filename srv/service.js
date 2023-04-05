const cds = require('@sap/cds');
const {
    readSF_Positions,
    readSF_CostCenters,
    readSF_PositionMatrixRelationships
} = require('./lib/handlers');

module.exports = cds.service.impl(async function () {
    /*** SERVICE ENTITIES ***/
    const {
        SF_Positions,
        SF_CostCenters,
        SF_PositionMatrixRelationships
    } = this.entities;

    /*** HANDLERS REGISTRATION ***/
    // ON events
    this.on('READ', SF_Positions, readSF_Positions);
    this.on('READ', SF_CostCenters, readSF_CostCenters);
    this.on('READ', SF_PositionMatrixRelationships, readSF_PositionMatrixRelationships);

    // BEFORE events

    // AFTER events
});
