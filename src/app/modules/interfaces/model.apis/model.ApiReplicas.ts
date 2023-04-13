export interface ApiReplicas {
    replica_id:    number;
    apiId:         number;
    replicaIp:     string;
    metadata:      string;
    status:        string;
    creation_date: Date;
    replica_name:  string;
    lastTestDate:  string;
    actualState:   boolean;
    label_hash:    string;
}
