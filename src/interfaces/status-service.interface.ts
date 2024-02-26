import { ConstantControllerStatus } from 'src/filters/constant-controller-status';
export interface StatusServiceInterface {
  status:
    | (typeof ConstantControllerStatus)['SUCCESS']
    | (typeof ConstantControllerStatus)['NOT_FOUND']
    | (typeof ConstantControllerStatus)['INVALID_DELETE_DATE_CONDITION']
    | (typeof ConstantControllerStatus)['INVALID_UPDATE_DATE_CONDITION'];
}
