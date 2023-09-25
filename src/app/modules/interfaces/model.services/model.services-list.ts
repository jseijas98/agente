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

  export interface ServiceResponse{
      labelApp: string;
      serviceId: number;
      description: string | null;
      health: string;
      applicationId: number;
      serviceName: string;
      testUrl: string | null;
      numTest: number;
      consecutiveFailedTest: number;
      histFailedTest: number;
      warningTrigger: number;
      criticalTrigger: number;
      warningAlarm: boolean;
      criticalAlarm: boolean;
      reqSeg: string | null;
      testInterv: number;
      histSuccessfulTest: number;
      lastTestsDate: string;
      nameSpace: string;
      status: string;
      consecutiveSuccessfulTest: number;
      response_time: number;
    }

    export interface Metric {
      valueId: number;
      serviceId: number;
      valuePath: string;
      typeOfValue: string;
      descriptionOfValue: string;
      value: string;
      normalValueState: string;
      warningValueState: string;
      criticValueState: string;
      stateAlarm: boolean;
      comparator: string;
      actualStateValue: string;
    }

    export interface Value {
      valueId: number;
      apiId: number;
      valuePath: string;
      typeOfValue: string;
      descriptionOfValue: string;
      value: string;
      normalValueState: string;
      warningValueState: string | null;
      criticValueState: string | null;
      stateAlarm: boolean;
      comparator: string | null;
      actualStateValue: string;
    }

    export interface editValue {
      type: string;
      elementId: number;
      valuePath?: string;
      value?: string;
      typeOfValue?: string;
      descriptionOfValue?: string;
      normalValueState?: string;
      warningValueState?: string;
      criticValueState?: string;
      comparator?: string;
      actualStateValue?: string;
      stateAlarm: boolean;
    }

    export enum ColorHex {
      DEFAULT = "#D3D3D3",
      VERDE = "#5AA454",
      AMARILLO = "#A10A28",
      ROJO = "#C7B42C",
    }
    


