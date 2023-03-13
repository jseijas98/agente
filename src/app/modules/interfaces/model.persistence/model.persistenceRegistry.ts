export interface PersistenceRegistry {
    registryId:                number;
    dbId:                      number;
    dbName:                    null;
    description:               string;
    status:                    string;
    applicationId:             number;
    consecutiveFailedTest:     number;
    histFailedTest:            number;
    lastTestDate:              number[];
    response_time:             number;
    consecutiveSuccessfulTest: number;
    histSuccessfulTest:        number;
    dbType:                    string;
}