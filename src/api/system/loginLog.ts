import { http } from "/@/utils/http/request";

/**
 * @description: 获取登录日志列表
 */
export function getLoginLog(params) {
  return http.request({
    url: "/loginLog/list",
    method: "GET",
    params,
  });
}

export default {
  getLoginLog,
};
