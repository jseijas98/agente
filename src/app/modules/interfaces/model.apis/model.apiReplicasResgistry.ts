export interface ApiReplicasResgistry {
    replica_id:    number;
    apiId:         number;
    replicaIp:     string;
    metadata:      string;
    status:        string;
    creation_date: Date;
    replica_name:  string;
    lastTestDate:  number[];
    label_hash:    string;
}
