export interface ComponentListService {
    componentList: ComponentList[];
    health:        number;
}

export interface ComponentList {
    serviceId:                 number;
    description:               null;
    health:                    string;
    applicationId:             number;
    serviceName:               string;
    labelApp:                  string;
    testUrl:                   string;
    numTest:                   number;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    lowTrigger:                number | null;
    highTrigger:               number | null;
    lowAlarm:                  boolean;
    highAlarm:                 boolean;
    reqSeg:                    null;
    testInterv:                number;
    histSuccessfulTest:        number;
    lastTestsDate:             number[];
    nameSpace:                 string;
    status:                    string;
    consecutiveSuccessfulTest: number;
    response_time:             number;
}
