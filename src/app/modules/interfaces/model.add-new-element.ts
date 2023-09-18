import { PayloadType } from 'src/app/services/deleteElement/delete.service';

export interface Element {
  value: string;
  viewValue: string;
}

export interface BodyRequest {
  applicationId: string;
  type: PayloadType;
  elementId: number;
  replicaIp?: string;
}

export interface Data {
  valueId: number;
  serviceId: number;
  valuePath: string;
  typeOfValue: string;
  descriptionOfValue: string;
  value: string;
  normalValueState: string | null;
  warningValueState: string | null;
  criticValueState: string | null;
  stateAlarm: boolean;
  comparator: string | null;
  actualStateValue: string;
}

export interface BodyResponse {
  data: Data;
  message: string;
  status: number;
  code: number;
}

export const dataDummy: BodyResponse = {
  data: {
    valueId: 3,
    serviceId: 80,
    valuePath: '/actuator/health',
    typeOfValue: 'STRING',
    descriptionOfValue: 'health',
    value: '/status',
    normalValueState: 'UP',
    warningValueState: null,
    criticValueState: null,
    stateAlarm: false,
    comparator: null,
    actualStateValue: 'UP',
  },
  message: 'success',
  status: 100,
  code: 200,
};

export const Dummybody: BodyRequest = {
  applicationId: '1',
  elementId: 2,
  type: PayloadType.SERVICE,
};
