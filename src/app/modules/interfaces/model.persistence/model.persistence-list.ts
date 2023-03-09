export interface PersistenceList {
    dbId:                      number;
    dbName:                    null;
    status:                    string;
    description:               string;
    applicationId:             number;
    numTest:                   number;
    consecutiveFailedTest:     number;
    historyFailedTest:         number;
    lowTrigger:                number;
    highTrigger:               number;
    lowAlarm:                  boolean;
    highAlarm:                 boolean;
    lastTestDate:              number[];
    reqSeg:                    null;
    testInterv:                number;
    consecutiveSuccessfulTest: number;
    historySuccessfulTest:     number;
    url:                       string;
    userName:                  string;
    password:                  string;
    sqlSentence:               string;
    dbType:                    string;
    response_time:             number;
}