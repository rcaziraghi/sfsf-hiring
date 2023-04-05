using { Currency, managed, cuid } from '@sap/cds/common';
namespace deloitte.hiring;

entity Requests : cuid {
  title  : localized String;
  template  : Association to one Templates;
  position  : Association to one Positions;
  costCenter : Association to one CostCenters;
  startDate  : DateTime;
  comments : localized String;
}

@readonly
@cds.autoexpose
entity Positions {
    code : String(8);
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

@readonly
@cds.autoexpose
entity CostCenters {
    externalCode: String;
    description_defaultValue: String; 
}