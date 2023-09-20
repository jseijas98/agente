export interface ComponentListApis {
    componentList: ComponentListElement;
    health:        number;
}

export interface ComponentListElement {
    apiId:                     number;
    status:                    string;
    health:                    string;
    applicationId:             number;
    common:                    null;
    base_url:                  string;
    label_app:                 string;
    nameSpace:                 string;
    numTest:                   number;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    warningTrigger:                number | null;
    criticalTrigger:               number | null;
    warningAlarm:                  boolean;
    criticalAlarm:                 boolean;
    lastTestDate:              number[];
    response_time:             number;
    testInterv:                number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
