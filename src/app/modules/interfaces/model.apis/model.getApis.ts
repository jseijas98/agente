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
    minTestFailed:             number;
    maxTestFailed:             number;
    lowAlarm:                  string;
    highAlarm:                 string;
    lastTestDate:              number[];
    response_time:             number;
    testInterv:                number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
