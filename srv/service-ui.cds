using deloitte.hiring.service.CatalogService as service from './service';

namespace deloitte.hiring.ui;

////////////////////////////////////////////////////////////////////////////
//
// UI annotations for the Root Entity
//
annotate service.Requests with @(UI : {
    UpdateHidden        : false,
    DeleteHidden        : false,
    CreateHidden        : false,
    Identification      : [
        {Value : title}
    ],
    HeaderInfo          : {
        $Type          : 'UI.HeaderInfoType',
        TypeName       : 'Solicitação',
        TypeNamePlural : 'Solicitações',
        Title          : {
            $Type : 'UI.DataField',
            Value : title
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : status.name
        }
    },
    SelectionFields     : [
        title,
        startDate,
        status.name,
        budgetCap
    ],
    LineItem            : [
        {
            $Type : 'UI.DataField',
            Value : title
        },
        {
            $Type : 'UI.DataField',
            Value : startDate
        },
        {
            $Type : 'UI.DataField',
            Value : budgetCap
        },
        {
            $Type             : 'UI.DataField',
            Value             : status.name,
            Criticality       : status.criticality,
            ![@UI.Importance] : #High
        }
    ],
    HeaderFacets        : [{
        $Type  : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#Detail'
    }],
    Facets              : [
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'RequestDetails',
            Target : '@UI.FieldGroup#Details',
            Label  : 'Detalhes'
        }
    ],
    DataPoint #title : {
        Value : title,
        Title : 'Título da posição'
    },
    FieldGroup #Detail  : {Data : [{
        $Type       : 'UI.DataField',
        Value       : status_ID,
        Criticality : status.criticality
    }]},
    FieldGroup #Details : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : title,
                Label : 'Título'
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : 'Status'
            },
            {
                $Type : 'UI.DataField',
                Value : startDate,
                Label : 'Início'
            },
            {
                $Type : 'UI.DataField',
                Value : comments,
                Label : 'Comentários'
            }
        ]
    },
});

annotate service.Requests with {
    ID          @(
        title     : 'ID da Requisição',
        UI.Hidden : true
    )           @readonly;
    title        @(title : 'Título da Posição');
    comments @(
        title : 'Comentários',
        UI.MultiLineText
    );
    startDate   @(title : 'Início');
    status      @(
        Common : {
            Text            : status.name,
            TextArrangement : #TextOnly,
            ValueListWithFixedValues,
            FieldControl    : #Mandatory
        },
        title  : 'Status'
    );
}

annotate service.Requests @(Capabilities : {
    Insertable : true,
    Deletable  : true,
    Updatable  : true,
});


////////////////
annotate service.Status with {
    ID   @Common : {
        Text            : name,
        TextArrangement : #TextOnly
    }    @title :  'ID de status';
    name @title  : 'Status'
}

annotate service.Status with @(UI : {
    CreateHidden    : true,
    UpdateHidden    : true,
    DeleteHidden    : true,
    Identification  : [{
        $Type : 'UI.DataField',
        Value : name
    }],
    HeaderInfo      : {
        $Type          : 'UI.HeaderInfoType',
        TypeName       : 'Status',
        TypeNamePlural : 'Status',
        Title          : {
            $Type : 'UI.DataField',
            Value : name
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : descr
        }
    },
    SelectionFields : [
        name,
        descr
    ],
    LineItem        : [
        {
            $Type : 'UI.DataField',
            Value : ID
        },
        {
            $Type : 'UI.DataField',
            Value : descr,
            Label : 'Descrição'
        },
        {
            $Type : 'UI.DataField',
            Value : criticality,
            Label : 'Criticalidade'
        }
    ],
    HeaderFacets        : [{
        $Type  : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#Detail'
    }],
    Facets              : [{
        $Type  : 'UI.ReferenceFacet',
        ID     : 'StatusDetails',
        Target : '@UI.FieldGroup#Details',
        Label  : 'Detalhes'
    }],
    FieldGroup #Detail  : {Data : [{
        $Type : 'UI.DataField',
        Value : name,
        Label : 'Status'
    }]},
    FieldGroup #Details : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : 'Nome'
            },
            {
                $Type : 'UI.DataField',
                Value : descr,
                Label : 'Descrição'
            },
            {
                $Type : 'UI.DataField',
                Value : criticality,
                Label : 'Criticalidade'
            }
        ]
    },
});

annotate service.Status @(Capabilities : {
    Insertable : false,
    Deletable  : false,
    Updatable  : false
});