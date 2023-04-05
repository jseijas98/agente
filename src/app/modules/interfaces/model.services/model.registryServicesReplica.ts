export interface ServicesReplicasRegistry {
    replica_id:    number;
    serviceId:     number;
    replicaIp:     string;
    metadata:      string;
    status:        string;
    creation_date: Date;
    replica_name:  string;
    lastTestDate:  string;
    actualState:   boolean;
    label_hash:    string;
}
