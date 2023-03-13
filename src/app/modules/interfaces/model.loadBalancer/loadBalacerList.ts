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
    lowTrigger:                null;
    highTrigger:               null;
    lowAlarm:                  boolean;
    highAlarm:                 boolean;
    reqSeg:                    null;
    testInterv:                number;
    applicationId:             number;
    historySuccessfulTest:     number;
    response_time:             number;
}
