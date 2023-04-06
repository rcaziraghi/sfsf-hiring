sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'deloitte.hiring.sfsfhiringrequests',
            componentId: 'RequestsObjectPage',
            entitySet: 'Requests'
        },
        CustomPageDefinitions
    );
});