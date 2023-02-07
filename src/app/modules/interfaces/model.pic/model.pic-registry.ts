export interface PicRegistry {
    registry_id:               number;
    integrationId:             number;
    status:                    string;
    applicationId:             number;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    lastTestDate:              number[];
    response_time:             number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
    description:               string;
}
