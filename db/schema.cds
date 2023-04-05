using { Currency, managed, cuid, sap } from '@sap/cds/common';
using ECPositionManagement as PosMan_API from '../srv/external/ECPositionManagement.csn';
using ECFoundationOrganization as Foundation_API from '../srv/external/ECFoundationOrganization.csn';

namespace deloitte.hiring.db;

entity Requests : cuid {
  title  : localized String;
  //template  : Association to one Templates;
  status : Association to one Status;
  position  : Association to one SF_Positions;
  costCenter : Association to one SF_CostCenters;
  startDate  : DateTime;
  budgetCap : Integer;
  budget: Integer;
  currency : Currency;
  comments : localized String;
}

@readonly
@cds.autoexpose
entity Status : sap.common.CodeList {
    key ID : Integer;
        name: String;
        descr: String; 
        criticality: Integer;
}

@readonly
@cds.autoexpose
entity Positions {
    code : String;
}

@readonly
@cds.autoexpose
entity Jobs {
    externalCode: String;
    jobFunction: Association to one JobFunctions;
}

@readonly
@cds.autoexpose
entity JobFunctions {
    externalCode: String;
    description_defaultValue: String;
    name_localized: String;
}

@readonly
@cds.autoexpose
entity Templates {
    code: String;
}

@readonly
@cds.autoexpose
entity Companies {
    externalCode: String;
    description_defaultValue: String; 
}

@readonly
@cds.autoexpose
entity BusinessUnits {
    externalCode: String;
    entityUUID: UUID;
    description_defaultValue: String; 
}

@readonly
@cds.autoexpose
entity Departments {
    externalCode: String;
    entityUUID: UUID;
    description_defaultValue: String; 
}

// @readonly
// @cds.autoexpose
// entity CostCenters {
//     externalCode: String;
//     description_defaultValue: String; 
// }



entity SF_PositionMatrixRelationships as select from PosMan_API.PositionMatrixRelationship {
    key Position_code,
    key matrixRelationshipType,
    key Position_effectiveStartDate,
        createdDateTime,
        relatedPosition,
        relatedPositionNav
};

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
