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
            Label : '{@i18n>sendForApproval}'
        },
        {Value: title}
    ],
    HeaderInfo                       : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : '{@i18n>Solicitacao}',
        TypeNamePlural: '{@i18n>Solicitacoes}',
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
        startingDate,
        status.name,
        budgetPer
    ],
    LineItem                         : {
        $value            : [
            {
                $Type: 'UI.DataField',
                Value: title
            },
            {
                $Type: 'UI.DataField',
                Value: startingDate
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
        ![@UI.Criticality]: status.criticality,
    },
    HeaderFacets                     : [
        {
            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#status'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#budgetCapProgress'
        }
    ],
    Facets                           : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'RequestDetails',
            Target: '@UI.FieldGroup#RequestDetails',
            Label : '{@i18n>Detalhes}'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'OrganizationalDetails',
            Target: '@UI.FieldGroup#OrganizationalDetails',
            Label : '{@i18n>Organizacao}'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'BudgetDetails',
            Target: '@UI.FieldGroup#BudgetDetails',
            Label : '{@i18n>Budget}'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Comments',
            Target: '@UI.FieldGroup#Comments',
            Label : '{@i18n>Comentarios}'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'ProcessAutomation',
            Target: '@UI.FieldGroup#PA',
            Label : '{@i18n>ProcessAutomation}',
            ![@UI.Hidden]: PAHidden
        }
    ],
    DataPoint #title                 : {
        Value: title,
        Title: '{@i18n>TituloPosicao}'
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
                Label: '{@i18n>PosicaoTemplate}'
            },
            {
                $Type: 'UI.DataField',
                Value: title,
                Label: '{@i18n>Titulo}'
            },
            {
                $Type: 'UI.DataField',
                Value: jobCode_externalCode,
                Label: '{@i18n>JobCode}'
            },
            {
                $Type: 'UI.DataField',
                Value: description,
                Label: '{@i18n>Descricao}'
            },
            {
                $Type: 'UI.DataField',
                Value: startingDate,
                Label: '{@i18n>Inicio}'
            }
        ]
    },
    FieldGroup #OrganizationalDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: company_externalCode,
                Label: '{@i18n>Empresa}'
            },
            {
                $Type: 'UI.DataField',
                Value: businessUnit_externalCode,
                Label: '{@i18n>BusinessUnit}'
            },
            {
                $Type: 'UI.DataField',
                Value: division_externalCode,
                Label: '{@i18n>Divisao}'
            },
            {
                $Type: 'UI.DataField',
                Value: department_externalCode,
                Label: '{@i18n>Departamento}'
            },
        ]
    },
    FieldGroup #BudgetDetails        : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: costCenter_externalCode,
                Label: '{@i18n>CentroCusto}'
            },
            {
                $Type                  : 'UI.DataField',
                Value                  : budget,
                Label                  : '{@i18n>Budget}',
                ![@Common.FieldControl]: #ReadOnly

            },
            {
                $Type                  : 'UI.DataField',
                Value                  : budgetCap,
                Label                  : '{@i18n>BudgetCap}',
                ![@Common.FieldControl]: #ReadOnly

            }
        ]
    },
    FieldGroup #Comments             : {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: comments,
            Label: '{@i18n>Comentarios}'
        }]
    },
    FieldGroup #PA             : {
        $Type: 'UI.FieldGroupType',
        Data : [
        //     {
        //     $Type: 'UI.DataField',
        //     Value: PAUUID,
        //     Label: '{@i18n>PAUUID}'
        // },
        {
            $Type: 'UI.DataField',
            Value: PAStatus,
            Label: '{@i18n>PAStatus}'
        },
        {
            $Type: 'UI.DataField',
            Value: PAStartedAt,
            Label: '{@i18n>PAStartedAt}'
        },
        {
            $Type: 'UI.DataField',
            Value: PACompletedAt,
            Label: '{@i18n>PACompletedAt}'
        }],
        ![@UI.Hidden]: PAHidden
    },
});

annotate service.Requests with {
    ID                @(
        title    : '{@i18n>IDRequisicao}',
        UI.Hidden: true
    )  @readonly;
    title             @(title: '{@i18n>TituloPosicao}');
    comments          @(
        title: '{@i18n>Comentarios}',
        UI.MultiLineText
    );
    startingDate      @(
        Common: {FieldControl: #Mandatory},
        title : '{@i18n>Inicio}'
    );
    status            @(
        Common: {
            Text                 : status.name,
            TextArrangement      : #TextOnly,
            ValueListWithFixedValues,
            FieldControl         : #ReadOnly,
            DefaultValuesFunction: '1',
        },
        title : '{@i18n>Status}',
    );
    position          @(
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
                Label         : '{@i18n>Posicoes}'
            }
        },
        title : '{@i18n>Posicao}'
    );
    jobCode           @(
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
                Label         : '{@i18n>JobCodes}'
            }
        },
        title : '{@i18n>JobCode}'
    );
    costCenter        @(
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
                Label         : '{@i18n>CentrosCusto}'
            }
        },
        title : '{@i18n>CentroCusto}'
    );
    company           @(
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
                Label         : '{@i18n>Empresas}'
            }
        },
        title : '{@i18n>Empresa}'
    );
    businessUnit      @(
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
                Label         : '{@i18n>BusinessUnits}'
            }
        },
        title : '{@i18n>BusinessUnit}'
    );
    division          @(
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
                Label         : '{@i18n>Divisoes}'
            }
        },
        title : '{@i18n>Divisao}'
    );
    department        @(
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
                Label         : '{@i18n>Departamentos}'
            }
        },
        title : '{@i18n>Departamento}'
    );
    budget            @Measures.ISOCurrency: currency_code
                      @Common              : {Label: '{@i18n>BudgetActual}'
                                                                           //  ,FieldControl   : #ReadOnly
                                                     };
    budgetCap         @Measures.ISOCurrency: currency_code
                      @Common              : {Label: '{@i18n>BudgetMax}'
                                                                        //  FieldControl   : #ReadOnly
                                                     };
    budgetPer         @Measures.Unit       : '%'
                      @Common              : {
        Label       : '{@i18n>BudgetPer}',
        FieldControl: #ReadOnly
    };
    budgetCriticality @Measures.Unit       : '%'
                      @Common              : {
        Label       : '{@i18n>BudgetPer}',
        FieldControl: #ReadOnly
    };
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
    }  @title: '{@i18n>IDStatus}';
    name @title : '{@i18n>Status}'
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
        TypeName      : '{@i18n>Status}',
        TypeNamePlural: '{@i18n>Status}',
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
            Label: '{@i18n>Descricao}'
        },
        {
            $Type: 'UI.DataField',
            Value: criticality,
            Label: '{@i18n>Criticalidade}'
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
        Label : '{@i18n>Detalhes}'
    }],
    FieldGroup #Detail : {Data: [{
        $Type: 'UI.DataField',
        Value: name,
        Label: '{@i18n>Status}'
    }]},
    FieldGroup #Details: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: name,
                Label: '{@i18n>Nome}'
            },
            {
                $Type: 'UI.DataField',
                Value: descr,
                Label: '{@i18n>Descricao}'
            },
            {
                $Type: 'UI.DataField',
                Value: criticality,
                Label: '{@i18n>Criticalidade}'
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
    }  @title: '{@i18n>Posicao}';
    positionTitle @title : '{@i18n>Titulo}'
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
        TypeName      : '{@i18n>Posicao',
        TypeNamePlural: '{@i18n>Posicoes}',
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
            Label: '{@i18n>DataInicio}'
        },
        {
            $Type: 'UI.DataField',
            Value: positionTitle,
            Label: '{@i18n>Titulo}'
        },
        {
            $Type: 'UI.DataField',
            Value: externalName_defaultValue,
            Label: '{@i18n>Descricao}'
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
        Label : '{@i18n>Detalhes}'
    }],
    FieldGroup #Detail : {Data: [{
        $Type: 'UI.DataField',
        Value: positionTitle,
        Label: '{@i18n>Status}'
    }]},
    FieldGroup #Details: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: positionTitle,
                Label: '{@i18n>Nome}'
            },
            {
                $Type: 'UI.DataField',
                Value: externalName_defaultValue,
                Label: '{@i18n>Descricao}'
            },
            {
                $Type: 'UI.DataField',
                Value: comment,
                Label: '{@i18n>Comentario}'
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
    externalCode             @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>CentroCusto}';
    description_defaultValue @title : '{@i18n>CentroCusto}'
}

//////////////// SF_Companies
annotate service.SF_Companies with {
    externalCode             @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>Empresa}';
    description_defaultValue @title : '{@i18n>Empresa}'
}

//////////////// SF_BusinessUnits
annotate service.SF_BusinessUnits with {
    externalCode             @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>BusinessUnit}';
    description_defaultValue @title : '{@i18n>BusinessUnit}'
}

//////////////// SF_Divisions
annotate service.SF_Divisions with {
    externalCode             @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>Divisao}';
    description_defaultValue @title : '{@i18n>Divisao}'
}

//////////////// SF_Departments
annotate service.SF_Departments with {
    externalCode             @Common: {
        Text           : description_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>Departamento}';
    description_defaultValue @title : '{@i18n>Departamento}'
}

//////////////// SF_JobCodes
annotate service.SF_JobCodes with {
    externalCode      @Common: {
        Text           : name_defaultValue,
        TextArrangement: #TextFirst
    }  @title: '{@i18n>JobCode}';
    name_defaultValue @title : '{@i18n>JobsCode}'
}
