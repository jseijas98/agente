export interface ComponentListIntegration {
    componentList: ComponentList[];
    health:        number;
}

export interface ComponentList {
    integrationId:             number;
    status:                    string;
    integrationType:           null;
    channel:                   null;
    description:               string;
    numTest:                   number;
    consecutiveFailedTest:     number;
    warningTrigger:                null;
    criticalTrigger:               null;
    warningAlarm:                  boolean;
    criticalAlarm:                 boolean;
    lastTestDate:              number[];
    reqSeg:                    null;
    testInterv:                number;
    applicationId:             number;
    consecutiveSuccessfulTest: number;
    url:                       string;
    json:                      string;
    historyFailedTest:         number;
    historySuccessfulTest:     number;
    response_time:             number;
}
