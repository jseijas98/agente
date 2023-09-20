export interface ServicesList {
    serviceId:                 number;
    description:               null;
    health:                    string;
    applicationId:             number;
    serviceName:               string;
    labelApp:                  string;
    base_url:                   string;
    numTest:                   number;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    criticalTrigger:               number;
    warningTrigger:                number;
    warningAlarm:                  null;
    criticalAlarm:                 null;
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
    warningTrigger: number;
    criticalTrigger: number;
    warningAlarm: number;
    criticalAlarm: number;
    base_url: string;
    description:null;
  }
