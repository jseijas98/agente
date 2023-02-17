import { Time } from "@angular/common";

export interface GetApis {
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
    lowTrigger  :              number;
    highTrigger :              number;
    lowAlarm:                  boolean;
    highAlarm:                 boolean;
    lastTestDate:              number[];
    response_time:             number;
    testInterv:                number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
