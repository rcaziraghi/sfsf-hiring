using {
    Currency,
    managed,
    cuid,
    sap
} from '@sap/cds/common';
using ECPositionManagement as PosMan_API from '../srv/external/ECPositionManagement.csn';
using ECFoundationOrganization as Foundation_API from '../srv/external/ECFoundationOrganization.csn';

namespace deloitte.hiring.db;

entity Requests : cuid {
    title          : localized String;
    description    : localized String;
    status         : Association to one Status;
    position       : Association to one Positions;
    parentPosition : Association to one Positions;
    jobCode        : Association to one JobCodes;
    costCenter     : Association to one CostCenters;
    company        : Association to one Companies;
    businessUnit   : Association to one BusinessUnits;
    division       : Association to one Divisions;
    department     : Association to one Departments;
    startingDate   : Date;
    budgetCap      : Decimal default 0.00;
    budget         : Decimal default 0.00;
    currency       : Currency;
    comments       : localized String;
    PAUUID         : UUID;
    PAStatus       : String;
    PAStartedAt    : DateTime;
    PAStartedBy    : String;
    PACompletedAt  : DateTime;
}

@readonly
@cds.autoexpose
entity Status : sap.common.CodeList {
    key ID          : Integer;
        name        : localized String;
        descr       : localized String;
        criticality : Integer;
}

@readonly
@cds.autoexpose
entity Positions {
    key code                       : String;
    key effectiveStartDate         : String;
        positionTitle              : String;
        jobTitle                   : String;
        company                    : String;
        businessUnit               : String;
        department                 : String;
        comment                    : String;
        costCenter                 : String;
        createdDate                : String;
        createdBy                  : String;
        division                   : String;
        effectiveStatus            : String;
        externalName_defaultValue  : String;
        externalName_en_US         : String;
        jobCode                    : String;
        positionMatrixRelationship : String;
        parentPosition             : String;
        employeeClass              : String;
}

@readonly
@cds.autoexpose
entity CostCenters {
    key externalCode               : String;
    key startDate                  : String;
        costcenterExternalObjectID : String;
        costcenterManager          : String;
        createdDateTime            : String;
        description                : localized String;
        description_defaultValue   : localized String;
        createdBy                  : String;
}

@readonly
@cds.autoexpose
entity JobCodes {
    key externalCode         : String;
    key startDate            : String;
        createdBy            : String;
        createdDateTime      : String;
        createdOn            : String;
        employeeClass        : String;
        endDate              : String;
        grade                : String;
        isFulltimeEmployee   : Boolean;
        isRegular            : String;
        jobFunction          : String;
        jobLevel             : String;
        lastModifiedBy       : String;
        lastModifiedDateTime : String;
        lastModifiedOn       : String;
        name                 : String;
        name_defaultValue    : String;
        name_localized       : String;
        parentJobCode        : String;
        standardHours        : Decimal default 0.00;
        status               : String;
        supervisorLevel      : String;
        workerCompCode       : String;
}

@readonly
@cds.autoexpose
entity Companies {
    key externalCode             : String;
    key startDate                : String;
        country                  : String;
        createdBy                : String;
        createdDateTime          : String;
        createdOn                : String;
        currency                 : String;
        defaultLocation          : String;
        defaultPayGroup          : String;
        description              : String;
        description_de_DE        : String;
        description_defaultValue : String;
        description_en_GB        : String;
        description_en_US        : String;
        description_es_ES        : String;
        description_fr_FR        : String;
        description_ja_JP        : String;
        description_ko_KR        : String;
        description_localized    : String;
        description_nl_NL        : String;
        description_pt_BR        : String;
        description_pt_PT        : String;
        description_ru_RU        : String;
        description_zh_CN        : String;
        description_zh_TW        : String;
        endDate                  : String;
        lastModifiedBy           : String;
        lastModifiedDateTime     : String;
        lastModifiedOn           : String;
        name                     : String;
        name_de_DE               : String;
        name_defaultValue        : String;
        name_en_GB               : String;
        name_en_US               : String;
        name_es_ES               : String;
        name_fr_FR               : String;
        name_ja_JP               : String;
        name_ko_KR               : String;
        name_localized           : String;
        name_nl_NL               : String;
        name_pt_BR               : String;
        name_pt_PT               : String;
        name_ru_RU               : String;
        name_zh_CN               : String;
        name_zh_TW               : String;
        standardHours            : Integer;
        status                   : String;
}

@readonly
@cds.autoexpose
entity BusinessUnits {
    key externalCode             : String;
    key startDate                : String;
        description_defaultValue : String;
        name_defaultValue        : String;
}

@readonly
@cds.autoexpose
entity Divisions {
    key externalCode             : String;
    key startDate                : String;
        description_defaultValue : String;
        name_defaultValue        : String;
}

@readonly
@cds.autoexpose
entity Departments {
    key externalCode             : String;
    key startDate                : String;
        description_defaultValue : String;
        name_defaultValue        : String;
}

@readonly
@cds.autoexpose
entity SF_PositionMatrixRelationships as
    select from PosMan_API.PositionMatrixRelationship {
        key Position_code,
        key matrixRelationshipType,
        key Position_effectiveStartDate,
            createdDateTime,
            relatedPosition,
            relatedPositionNav
    };

@readonly
@cds.autoexpose
entity SF_Positions                   as
    select from PosMan_API.Position {
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
@cds.autoexpose
entity SF_CostCenters                 as
    select from Foundation_API.FOCostCenter {
        key externalCode,
        key startDate,
            costcenterExternalObjectID,
            costcenterManager,
            createdDateTime,
            description,
            description_defaultValue,
            createdBy
    };

@readonly
@cds.autoexpose
entity SF_Companies                   as
    select from Foundation_API.FOCompany {
        key externalCode,
        key startDate,
            country,
            createdBy,
            createdDateTime,
            createdOn,
            currency,
            defaultLocation,
            defaultPayGroup,
            description,
            description_de_DE,
            description_defaultValue,
            description_en_GB,
            description_en_US,
            description_es_ES,
            description_fr_FR,
            description_ja_JP,
            description_ko_KR,
            description_localized,
            description_nl_NL,
            description_pt_BR,
            description_pt_PT,
            description_ru_RU,
            description_zh_CN,
            description_zh_TW,
            endDate,
            lastModifiedBy,
            lastModifiedDateTime,
            lastModifiedOn,
            name,
            name_de_DE,
            name_defaultValue,
            name_en_GB,
            name_en_US,
            name_es_ES,
            name_fr_FR,
            name_ja_JP,
            name_ko_KR,
            name_localized,
            name_nl_NL,
            name_pt_BR,
            name_pt_PT,
            name_ru_RU,
            name_zh_CN,
            name_zh_TW,
            standardHours,
            status
    };

@readonly
@cds.autoexpose
entity SF_BusinessUnits               as
    select from Foundation_API.FOBusinessUnit {
        key externalCode,
        key startDate,
            createdBy,
            createdDateTime,
            createdOn,
            description,
            description_defaultValue,
            endDate,
            headOfUnit,
            lastModifiedBy,
            lastModifiedDateTime,
            lastModifiedOn,
            name,
            name_defaultValue,
            status
    };

@readonly
@cds.autoexpose
entity SF_Divisions                   as
    select from Foundation_API.FODivision {
        key externalCode,
        key startDate,
            // businessUnitFlx,
            createdBy,
            createdDateTime,
            createdOn,
            description,
            description_defaultValue,
            endDate,
            headOfUnit,
            lastModifiedBy,
            lastModifiedDateTime,
            lastModifiedOn,
            name,
            name_defaultValue,
            parent,
            status

    };

@readonly
@cds.autoexpose
entity SF_Departments                 as
    select from Foundation_API.FODepartment {
        key externalCode,
        key startDate,
            costCenter,
            createdBy,
            createdDateTime,
            createdOn,
            // cust_toLegalEntityProp,
            // divisionFlx,
            description,
            description_defaultValue,
            endDate,
            headOfUnit,
            lastModifiedBy,
            lastModifiedDateTime,
            lastModifiedOn,
            name,
            name_defaultValue,
            parent,
            status

    };

@readonly
@cds.autoexpose
entity SF_JobCodes                    as
    select from Foundation_API.FOJobCode {
        key externalCode,
        key startDate,
            createdBy,
            createdDateTime,
            createdOn,
            employeeClass,
            endDate,
            grade,
            isFulltimeEmployee,
            isRegular,
            jobFunction,
            jobLevel,
            lastModifiedBy,
            lastModifiedDateTime,
            lastModifiedOn,
            name,
            name_defaultValue,
            name_localized,
            parentJobCode,
            standardHours,
            status,
            supervisorLevel,
            workerCompCode
    };
