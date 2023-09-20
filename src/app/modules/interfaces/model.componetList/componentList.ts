export interface Componente {
    data:    Datum[];
    message: any[];
}

export interface Datum {
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
    warningTrigger:                number | null;
    criticalTrigger:               number;
    warningAlarm:                  boolean;
    criticalAlarm:                 boolean;
    reqSeg:                    null;
    testInterv:                number;
    histSuccessfulTest:        number;
    lastTestsDate:             number[];
    nameSpace:                 string;
    status:                    string;
    consecutiveSuccessfulTest: number;
    response_time:             number;
}


export interface DataAplication {
  data:    Datum[];
  message: any[];
}

export interface Datum {
  type:    string;
  message: string;
  health:  number;
}
