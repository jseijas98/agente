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
    lowTrigger:                number | null;
    highTrigger:               number | null;
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
