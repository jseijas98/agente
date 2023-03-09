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
    lowTrigger:                null;
    highTrigger:               null;
    lowAlarm:                  boolean;
    highAlarm:                 boolean;
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
