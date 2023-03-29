export interface NewApi {
  applicationId: number,
  labelApp: string;
  namespace: string;
  testInterval: number;
  url: string;
}

export interface NewIntegration {
  applicationId: number,
  testInterval: number;
  url: string;
  json: string;
  channel: string;
  description: string;
}

export interface NewLoadBalancer {
  applicationId: number,
  testInterval: number;
  url: string;
  json: string;
  description: string;
}

export interface NewPersistence {
  applicationId: number,
  name: string;
  sqlSentence: string;
  username: string;
  password: string;
  testInterval: number;
  url: string;
  dataBaseType: string;
  description: string;
}

export interface NewService {
  applicationId: number,
  testInterval: number;
  name: string;
  labelApp: string;
  namespace: string;
  url: string;
  description: string;
}

export interface Element {
  value: string;
  viewValue: string;
}
