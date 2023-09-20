export interface ComponentListPersistence {
    componentList: ComponentList[];
    health:        number;
}

export interface ComponentList {
    dbId:                      number;
    dbName:                    null;
    status:                    string;
    description:               string;
    applicationId:             number;
    numTest:                   number;
    consecutiveFailedTest:     number;
    historyFailedTest:         number;
    warningTrigger:                number | null;
    criticalTrigger:               number | null;
    warningAlarm:                  boolean;
    criticalAlarm:                 boolean;
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
