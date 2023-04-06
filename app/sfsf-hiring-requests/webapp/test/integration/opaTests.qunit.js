sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'deloitte/hiring/sfsfhiringrequests/test/integration/FirstJourney',
		'deloitte/hiring/sfsfhiringrequests/test/integration/pages/RequestsList',
		'deloitte/hiring/sfsfhiringrequests/test/integration/pages/RequestsObjectPage'
    ],
    function(JourneyRunner, opaJourney, RequestsList, RequestsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('deloitte/hiring/sfsfhiringrequests') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRequestsList: RequestsList,
					onTheRequestsObjectPage: RequestsObjectPage
                }
            },
            opaJourney.run
        );
    }
);