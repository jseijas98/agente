export interface LoadBalancerRegistry {
    registryId:                number;
    vserverId:                 number;
    description:               string;
    status:                    string;
    urlServer:                 string;
    lastTestDate:              number[];
    successfulConsecutiveTest: number;
    failedConsecutiveTest:     number;
    historyFailedTest:         number;
    historySuccessfulTest:     number;
    applicationId:             number;
    response_time:             number;
}
