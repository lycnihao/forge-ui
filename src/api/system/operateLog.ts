import { http } from "/@/utils/http/request";

/**
 * @description: 获取操作日志列表
 */
export function getOperateLog(params: any) {
  return http.request({
    url: "/operateLog/list",
    method: "GET",
    params,
  });
}

export function getOperateLogDetail(operateLogId: any) {
  return http.request({
    url: `/operateLog/detail/${operateLogId}`,
    method: "GET",
  });
}
export default {
  getOperateLog,
  getOperateLogDetail,
};
