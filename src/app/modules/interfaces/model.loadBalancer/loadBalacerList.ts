export interface LoadBalancerList {
    vserverId:                 number;
    description:               string;
    status:                    string;
    urlServer:                 string;
    json:                      string;
    numTest:                   number;
    lastTestDate:              number[];
    consecutiveSuccessfulTest: number;
    consecutiveFailedTest:     number;
    historyFailedTest:         number;
    warningTrigger:                null;
    criticalTrigger:               null;
    warningAlarm:                  boolean;
    criticalAlarm:                 boolean;
    reqSeg:                    null;
    testInterv:                number;
    applicationId:             number;
    historySuccessfulTest:     number;
    response_time:             number;
}
