using deloitte.hiring.service.CatalogService as service from '../../srv/service';

//Side effects

annotate service.Requests @(Common :{
    SideEffects #TemplateChanged : {
        SourceProperties : ['position_code'],
        TargetProperties : ['title', 'company_externalCode', 'businessUnit_externalCode', 
                            'division_externalCode', 'department_externalCode', 'costCenter_externalCode', 
                            'jobCode_externalCode', 'jobCode_externalCode', 
                            'budget', 'budgetCap', 'budgetPer', 'currency_code' ]
    }
}); 