export interface ServicesRegistry {
    registry_id:               number;
    serviceId:                 number;
    status:                    string;
    health:                    string;
    applicationId:             number;
    label_app:                 string;
    nameSpace:                 string;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    lastTestDate:              number[];
    response_time:             number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
}
