import { http } from "/@/utils/http/request";
import { BasicResponseModel } from "/@/types/http";

/**
 * @description: 部门 tree
 */
export function tree() {
  return http.request({
    url: "/department/tree",
    method: "GET",
  });
}

/**
 * @description: 添加部门信息
 */
export function addDept(params: any) {
  return http.request<BasicResponseModel>({
    url: "/department/add",
    method: "post",
    data: params,
  });
}

/**
 * @description: 更新部门信息
 */
export function updateDept(params: any) {
  return http.request<BasicResponseModel>({
    url: "/department/update",
    method: "post",
    data: params,
  });
}

/**
 * @description: 删除部门信息
 */
export function deleteDept(permissionId: number) {
  return http.request<BasicResponseModel>({
    url: `/department/delete/${permissionId}`,
    method: "post",
  });
}

export default {
  tree,
  addDept,
  updateDept,
  deleteDept,
};
