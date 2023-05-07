using deloitte.hiring.service.CatalogService as service from '../../srv/service';

//Custom actions and dynamic expressions

//Libera o envio somente se estiver em rascunho
annotate service.Requests with actions {
    sendRequestForApproval @(
        Core.OperationAvailable            : {$edmJson: {$Eq: [
            {$Path: 'in/status_ID'},
            1
        ]}},
        Common.SideEffects.TargetProperties: ['in/status_ID'],
        Common.IsActionCritical : true,
    )
};

//Libera atualizacao somente se for rascunho
annotate service.Requests with @(UI.UpdateHidden: {$edmJson: {$Ne: [
    {$Path: 'status_ID'},
    1
]}});
