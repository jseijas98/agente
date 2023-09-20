import { Time } from "@angular/common";


export interface ResponseModel{
data:any;
message:string;
code:number;
status:number;
}

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
    warningTrigger  :          number;
    criticalTrigger :          number;
    warningAlarm:              boolean;
    criticalAlarm:             boolean;
    lastTestDate:              string;
    response_time:             number;
    testInterv:                number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
