using { deloitte.hiring.db as my } from '../db/schema';

service CatalogService @(path:'/hiring', requires : 'authenticated-user' ) {

  entity Requests as SELECT from my.Requests {*} excluding { createdBy, modifiedBy };
  entity Status as projection on my.Status;
  annotate Status with @(requires: 'Admin');

  @readonly
  entity SF_PositionMatrixRelationships as projection on my.SF_PositionMatrixRelationships;
  annotate Status with @(requires: 'Admin');

  @readonly
  entity SF_Positions as projection on my.SF_Positions;
  annotate Status with @(requires: 'Admin');

  @readonly
  entity SF_CostCenters as projection on my.SF_CostCenters;
  annotate Status with @(requires: 'Admin');

}