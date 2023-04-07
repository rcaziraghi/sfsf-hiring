using { deloitte.hiring.db as my } from '../db/schema';

namespace deloitte.hiring.service;

service CatalogService @(path:'/hiring', requires : 'authenticated-user' ) {

  @odata.draft.enabled
  entity Requests as 
    SELECT from my.Requests {
        *,
        null as budgetPer: Decimal,
        null as budgetCriticality: Integer
        } excluding { createdBy, modifiedBy } 
      actions {
        action sendRequestForApproval()
    };

  annotate Requests with actions {
    sendRequestForApproval @(
    Core.OperationAvailable : {
      $edmJson: { $Eq: [{ $Path: 'in/status_ID'}, 1]}
    },
   Common.SideEffects.TargetProperties : ['in/status_ID'], ) };


  entity Status as projection on my.Status;
  annotate Status with @(requires: 'Admin');

  entity Positions as 
    select from my.Positions {
    * 
    // , SF_Position.externalName_defaultValue as Position_name
  };
  annotate Positions with @(requires: 'Admin');

  @readonly
  entity SF_PositionMatrixRelationships as projection on my.SF_PositionMatrixRelationships;
  annotate SF_PositionMatrixRelationships with @(requires: 'Admin');

  @readonly
  entity SF_Positions as projection on my.SF_Positions;
  annotate SF_Positions with @(requires: 'Admin');

  @readonly
  entity SF_CostCenters as projection on my.SF_CostCenters;
  annotate SF_CostCenters with @(requires: 'Admin');

}