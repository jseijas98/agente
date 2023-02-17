export interface Applications {

    applicationId:             string;
    applicationName:           string,
    description:               string,
    status:                    string,
    numTest:                   string,
    lastTestDate:              string,
    successfulConsecutiveTest: string,
    failedConsecutiveTest:     string,
    historySuccessfulTest:     string,
    historyFailedTest:         string,
    minFailTest:               string,
    maxFailTest:               string,
    lowAlarm:                  string,
    highAlarm:                 string,
    reqSeg:                    string,
    testInterv:                string,
}
