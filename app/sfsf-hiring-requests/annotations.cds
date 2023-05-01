using deloitte.hiring.service.CatalogService as service from '../../srv/service';

//UI

namespace deloitte.hiring.ui;

////////////////////////////////////////////////////////////////////////////
//
// UI annotations for the Root Entity
// Requests
annotate service.Requests with @(UI: {
    UpdateHidden                     : false,
    DeleteHidden                     : false,
    CreateHidden                     : false,
    Identification                   : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'deloitte.hiring.service.CatalogService.sendRequestForApproval',
            Label : 'Enviar para aprovação'
        },
        {Value: title}
    ],
    HeaderInfo                       : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Solicitação',
        TypeNamePlural: 'Solicitações',
        Title         : {
            $Type: 'UI.DataField',
            Value: title
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: status.name
        }
    },
    SelectionFields                  : [
        title,
        startDate,
        status.name,
        budgetPer
    ],
    LineItem                         : [
        {
            $Type: 'UI.DataField',
            Value: title
        },
        {
            $Type: 'UI.DataField',
            Value: startDate
        },
        {
            $Type: 'UI.DataField',
            Value: budgetPer
        },
        {
            $Type: 'UI.DataField',
            Value: budget
        },
        {
            $Type: 'UI.DataField',
            Value: budgetCap
        },
        {
            $Type            : 'UI.DataField',
            Value            : status.name,
            Criticality      : status.criticality,
            ![@UI.Importance]: #High
        }
    ],
    HeaderFacets                     : [
        {
            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#status'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#budgetCapProgress',
        }
    ],
    Facets                           : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'RequestDetails',
            Target: '@UI.FieldGroup#RequestDetails',
            Label : 'Detalhes'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'OrganizationalDetails',
            Target: '@UI.FieldGroup#OrganizationalDetails',
            Label : 'Organização'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'BudgetDetails',
            Target: '@UI.FieldGroup#BudgetDetails',
            Label : 'Budget'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Comments',
            Target: '@UI.FieldGroup#Comments',
            Label : 'Comentários'
        }
    ],
    DataPoint #title                 : {
        Value: title,
        Title: 'Título da posição'
    },
    DataPoint #budgetCapProgress     : {
        Value        : budgetPer,
        TargetValue  : 100.0,
        Visualization: #Progress,
        Criticality  : budgetCriticality
    },
    DataPoint #status                : {
        Value      : status_ID,
        Criticality: status.criticality
    },
    FieldGroup #Header               : {Data: [{
        $Type      : 'UI.DataField',
        Value      : status_ID,
        Criticality: status.criticality
    }]},
    FieldGroup #RequestDetails       : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: position_code,
                Label: 'Posição template'
            },
            {
                $Type: 'UI.DataField',
                Value: title,
                Label: 'Título'
            },
            {
                $Type: 'UI.DataField',
                Value: jobCode_externalCode,
                Label: 'Job code'
            },
            {
                $Type: 'UI.DataField',
                Value: startDate,
                Label: 'Início'
            }
        ]
    },
    FieldGroup #OrganizationalDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: company_externalCode,
                Label: 'Empresa'
            },
            {
                $Type: 'UI.DataField',
                Value: businessUnit_externalCode,
                Label: 'Business Unit'
            },
            {
                $Type: 'UI.DataField',
                Value: division_externalCode,
                Label: 'Divisão'
            },
            {
                $Type: 'UI.DataField',
                Value: department_externalCode,
                Label: 'Departamento'
            },
        ]
    },
    FieldGroup #BudgetDetails        : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: costCenter_externalCode,
                Label: 'Centro de Custo'
            },
            {
                $Type: 'UI.DataField',
                Value: budget,
                Label: 'Budget'
            },
            {
                $Type: 'UI.DataField',
                Value: budgetCap,
                Label: 'Budget Cap'
            }
        ]
    },
    FieldGroup #Comments             : {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: comments,
            Label: 'Comentários'
        }]
    },
});

annotate service.Requests with {
    ID           @(
        title    : 'ID da Requisição',
        UI.Hidden: true
    )  @readonly;
    title        @(title: 'Título da Posição');
    comments     @(
        title: 'Comentários',
        UI.MultiLineText
    );
    startDate    @(title: 'Início');
    status       @(
        Common: {
            Text                 : status.name,
            TextArrangement      : #TextOnly,
            ValueListWithFixedValues,
            FieldControl         : #ReadOnly,
            DefaultValuesFunction: '1',
        },
        title : 'Status',
    );
    position     @(
        Common: {
            Text           : position.positionTitle,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_Positions',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'position_code',
                        ValueListProperty: 'code'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'position_effectiveStartDate',
                        ValueListProperty: 'effectiveStartDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'positionTitle'
                    }
                ],
                Label         : 'Posições'
            }
        },
        title : 'Posição'
    );
    jobCode     @(
        Common: {
            Text           : jobCode.name_defaultValue,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_JobCodes',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'jobCode_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'jobCode_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'name_defaultValue'
                    }
                ],
                Label         : 'Job codes'
            }
        },
        title : 'Job code'
    );
    costCenter   @(
        Common: {
            Text           : costCenter.description,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_CostCenters',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'costCenter_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'costCenter_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description_defaultValue'
                    }
                ],
                Label         : 'Centros de custo'
            }
        },
        title : 'Centro de custo'
    );
    company      @(
        Common: {
            Text           : company.name_defaultValue,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_Companies',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'company_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'company_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'name_defaultValue'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description_localized'
                    }
                ],
                Label         : 'Empresas'
            }
        },
        title : 'Empresa'
    );
    businessUnit @(
        Common: {
            Text           : businessUnit.name_defaultValue,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_BusinessUnits',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'businessUnit_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'businessUnit_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'name_defaultValue'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description_defaultValue'
                    }
                ],
                Label         : 'Business Units'
            }
        },
        title : 'Business Unit'
    );
    division     @(
        Common: {
            Text           : division.name_defaultValue,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_Divisions',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'division_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'division_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'name_defaultValue'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description_defaultValue'
                    }
                ],
                Label         : 'Divisões'
            }
        },
        title : 'Divisão'
    );
    department   @(
        Common: {
            Text           : department.name_defaultValue,
            TextArrangement: #TextFirst,
            FieldControl   : #Mandatory,
            ValueList      : {
                $Type         : 'Common.ValueListType',
                CollectionPath: 'SF_Departments',
                Parameters    : [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'department_externalCode',
                        ValueListProperty: 'externalCode'
                    },
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'department_startDate',
                        ValueListProperty: 'startDate'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'name_defaultValue'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description_defaultValue'
                    }
                ],
                Label         : 'Departamentos'
            }
        },
        title : 'Departamento'
    );
    budget       @Measures.ISOCurrency: currency_code
                 @Common              : {Label: 'Budget actual',
                                         FieldControl   : #ReadOnly};
    budgetCap    @Measures.ISOCurrency: currency_code
                 @Common              : {Label: 'Budget Max',
                                         FieldControl   : #ReadOnly};
    budgetPer    @Measures.Unit       : '%'
                 @Common              : {Label: 'Budget %',
                                         FieldControl   : #ReadOnly};
}

annotate service.Requests @(Capabilities: {
    Insertable: true,
    Deletable : true,
    Updatable : true,
});

//////////////// Status
annotate service.Status with {
    ID   @Common: {
        Text           : name,
        TextArrangement: #TextOnly
    }  @title: 'ID de status';
    name @title : 'Status'
}

annotate service.Status with @(UI: {
    CreateHidden       : true,
    UpdateHidden       : true,
    DeleteHidden       : true,
    Identification     : [{
        $Type: 'UI.DataField',
        Value: name
    }],
    HeaderInfo         : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Status',
        TypeNamePlural: 'Status',
        Title         : {
            $Type: 'UI.DataField',
            Value: name
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: descr
        }
    },
    SelectionFields    : [
        name,
        descr
    ],
    LineItem           : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: descr,
            Label: 'Descrição'
        },
        {
            $Type: 'UI.DataField',
            Value: criticality,
            Label: 'Criticalidade'
        }
    ],
    HeaderFacets       : [{
        $Type : 'UI.ReferenceFacet',
        Target: '@UI.FieldGroup#Detail'
    }],
    Facets             : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'StatusDetails',
        Target: '@UI.FieldGroup#Details',
        Label : 'Detalhes'
    }],
    FieldGroup #Detail : {Data: [{
        $Type: 'UI.DataField',
        Value: name,
        Label: 'Status'
    }]},
    FieldGroup #Details: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: name,
                Label: 'Nome'
            },
            {
                $Type: 'UI.DataField',
                Value: descr,
                Label: 'Descrição'
            },
            {
                $Type: 'UI.DataField',
                Value: criticality,
                Label: 'Criticalidade'
            }
        ]
    },
});

annotate service.Status @(Capabilities: {
    Insertable: false,
    Deletable : false,
    Updatable : false
});

//////////////// Positions
annotate service.Positions with {
    code          @Common: {
        Text           : positionTitle,
        TextArrangement: #TextOnly
    }  @title: 'Posição';
    positionTitle @title : 'Título'
}

annotate service.Positions with @(UI: {
    CreateHidden       : true,
    UpdateHidden       : true,
    DeleteHidden       : true,
    Identification     : [{
        $Type: 'UI.DataField',
        Value: positionTitle
    }],
    HeaderInfo         : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Posição',
        TypeNamePlural: 'Posições',
        Title         : {
            $Type: 'UI.DataField',
            Value: positionTitle
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: externalName_defaultValue
        }
    },
    SelectionFields    : [
        positionTitle,
        externalName_defaultValue
    ],
    LineItem           : [
        {
            $Type: 'UI.DataField',
            Value: code
        },
        {
            $Type: 'UI.DataField',
            Value: effectiveStartDate,
            Label: 'Data de início'
        },
        {
            $Type: 'UI.DataField',
            Value: positionTitle,
            Label: 'Título'
        },
        {
            $Type: 'UI.DataField',
            Value: externalName_defaultValue,
            Label: 'Descrição'
        }
    ],
    HeaderFacets       : [{
        $Type : 'UI.ReferenceFacet',
        Target: '@UI.FieldGroup#Detail'
    }],
    Facets             : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'StatusDetails',
        Target: '@UI.FieldGroup#Details',
        Label : 'Detalhes'
    }],
    FieldGroup #Detail : {Data: [{
        $Type: 'UI.DataField',
        Value: positionTitle,
        Label: 'Status'
    }]},
    FieldGroup #Details: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: positionTitle,
                Label: 'Nome'
            },
            {
                $Type: 'UI.DataField',
                Value: externalName_defaultValue,
                Label: 'Descrição'
            },
            {
                $Type: 'UI.DataField',
                Value: comment,
                Label: 'Comentário'
            }
        ]
    },
});

annotate service.Positions @(Capabilities: {
    Insertable: false,
    Deletable : false,
    Updatable : false
});

//////////////// costCenter
annotate service.CostCenters with {
    externalCode          @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Centro de custo';
    description_defaultValue @title : 'Centro de custo'
}

//////////////// SF_Companies
annotate service.SF_Companies with {
    externalCode          @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Empresa';
    description_defaultValue @title : 'Empresa'
}

//////////////// SF_BusinessUnits
annotate service.SF_BusinessUnits with {
    externalCode          @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Business Unit';
    description_defaultValue @title : 'Business Unit'
}

//////////////// SF_Divisions
annotate service.SF_Divisions with {
    externalCode          @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Divisão';
    description_defaultValue @title : 'Divisão'
}

//////////////// SF_Departments
annotate service.SF_Departments with {
    externalCode          @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Departamento';
    description_defaultValue @title : 'Departamento'
}

//////////////// SF_JobCodes
annotate service.SF_JobCodes with {
    externalCode          @Common: {
        Text           : name_defaultValue,
        TextArrangement: #TextFirst
    }  @title: 'Job Code';
    name_defaultValue @title : 'Job Code'
}
