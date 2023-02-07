export interface PicList {
    integrationId:             number;
    status:                    string;
    integrationType:           string;
    channel:                   string;
    description:               string;
    numTest:                   number;
    consecutiveFailedTest:     number;
    minTestFailed:             number;
    maxTestFailed:             number;
    lowAlarm:                  string;
    highAlarm:                 string;
    lastTestDate:              number[];
    reqSeg:                    string;
    testInterv:                number;
    applicationId:             number;
    consecutiveSuccessfulTest: number;
    url:                       string;
    json:                      string;
    historyFailedTest:         number;
    historySuccessfulTest:     number;
    response_time:             number;
}
