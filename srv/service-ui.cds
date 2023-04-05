using deloitte.hiring.db as service from './service';

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