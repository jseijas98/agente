export interface ApiRegistry {
    registry_id:               number;
    apiId:                     number;
    status:                    string;
    health:                    string;
    applicationId:             number;
    label_app:                 string;
    nameSpace:                 string;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    lastTestDate:              string;
    response_time:             number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
