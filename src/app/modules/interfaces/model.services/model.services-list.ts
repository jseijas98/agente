export interface ServicesList {
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
    highTrigger:               number;
    lowTrigger:                number;
    lowAlarm:                  null;
    highAlarm:                 null;
    reqSeg:                    null;
    testInterv:                number;
    histSuccessfulTest:        number;
    lastTestsDate:             number[];
    nameSpace:                 string;
    status:                    string;
    consecutiveSuccessfulTest: number;
    response_time:             number;
}

export interface ServiceInfo {
    Id: number;
    status: string;
    nameSpace: string;
    test_interval: number;
    label_app: string;
    response_time: number;
    last_test: string;
    health: string;
    applId: number;
    triggerLow: number;
    triggerHigh: number;
    lowAlarm: number;
    highAlarm: number;
    url: string;
  }