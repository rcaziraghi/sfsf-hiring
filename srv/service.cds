using { deloitte.hiring as my } from '../db/schema';
using ECPositionManagement as PosMan_API from '../srv/external/ECPositionManagement.csn';
using ECFoundationOrganization as Foundation_API from '../srv/external/ECFoundationOrganization.csn';

service CatalogService @(path:'/hiring') {

  entity requests as SELECT from my.Requests {*} excluding { createdBy, modifiedBy };

  @readonly
  entity SF_PositionMatrixRelationships as select from PosMan_API.PositionMatrixRelationship {
    key Position_code,
    key matrixRelationshipType,
    key Position_effectiveStartDate,
        createdDateTime,
        relatedPosition,
        relatedPositionNav
  };

  @readonly
  entity SF_Positions as select from PosMan_API.Position {
    key code,
    key effectiveStartDate,
        positionTitle,
        jobTitle,
        company,
        businessUnit,
        department,
        comment,
        costCenter,
        createdDate,
        createdBy,
        division,
        effectiveStatus,
        externalName_defaultValue,
        externalName_en_US,
        jobCode,
        positionMatrixRelationship,
        parentPosition,
        employeeClass

  };

  @readonly
  entity SF_CostCenters as select from Foundation_API.FOCostCenter {
    key externalCode,
    key startDate,
        costcenterExternalObjectID,
        costcenterManager,
        createdDateTime,
        description,
        description_defaultValue,
        createdBy
  };

//   entity template as projection on my.template;

//   entity costCenter as projection on my.costCenter;


}