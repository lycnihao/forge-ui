export interface BasicResponseModel<T = any> {
  success: boolean;
  errCode: number;
  errMessage: string;
  data: T;
}
