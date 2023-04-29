using {deloitte.hiring.db as my} from '../db/schema';

namespace deloitte.hiring.service;

service CatalogService @(
  path    : '/hiring',
  requires: 'authenticated-user'
) {

  @odata.draft.enabled
  entity Requests                       as
    select from my.Requests {
      *,
      null as budgetPer         : Decimal,
      null as budgetCriticality : Integer
    }
    excluding {
      createdBy,
      modifiedBy
    } actions {
      action sendRequestForApproval()
    };
  annotate Requests with @odata.draft.enabled;
  annotate Requests with @fiori.draft.enabled;

  entity Status                         as projection on my.Status;
  annotate Status with @(requires: 'Admin');
  entity Positions                      as projection on my.Positions;
  annotate Positions with @(requires: 'Admin');

  // entity Companies as projection on my.Companies;
  // annotate Companies with @(requires: 'Admin');

  entity JobCodes                       as projection on my.JobCodes;
  annotate JobCodes with @(requires: 'Admin');

  @readonly
  entity SF_PositionMatrixRelationships as projection on my.SF_PositionMatrixRelationships;

  annotate SF_PositionMatrixRelationships with @(requires: 'Admin');

  @readonly
  entity SF_CostCenters                 as projection on my.SF_CostCenters;

  annotate SF_CostCenters with @(requires: 'Admin');

  @readonly
  entity SF_Positions                   as projection on my.SF_Positions;

  annotate SF_Positions with @(requires: 'Admin');

  @readonly
  entity SF_JobCodes                    as projection on my.SF_JobCodes;

  annotate SF_JobCodes with @(requires: 'Admin');

  @readonly
  entity SF_Companies                   as projection on my.SF_Companies;

  annotate SF_Companies with @(requires: 'Admin');

  @readonly
  entity SF_BusinessUnits               as projection on my.SF_BusinessUnits;

  annotate SF_BusinessUnits with @(requires: 'Admin');

  @readonly
  entity SF_Divisions                   as projection on my.SF_Divisions;

  annotate SF_Divisions with @(requires: 'Admin');

  @readonly
  entity SF_Departments                 as projection on my.SF_Departments;

  annotate SF_Departments with @(requires: 'Admin');


}
