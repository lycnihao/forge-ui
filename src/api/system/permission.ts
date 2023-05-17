import { http } from "/@/utils/http/request";
import { BasicResponseModel } from "/@/types/http";

/**
 * @description: 获取所有权限
 */
export function getAllPermission() {
  return http.request({
    url: "/permission/getAllPermissions",
    method: "GET",
  });
}

/**
 * @description: 添加权限信息
 */
export function addPermissionInfo(params: any) {
  return http.request<BasicResponseModel>({
    url: "/permission/add",
    method: "post",
    data: params,
  });
}

/**
 * @description: 更新权限信息
 */
export function updatePermissionInfo(params: any) {
  return http.request<BasicResponseModel>({
    url: "/permission/update",
    method: "post",
    data: params,
  });
}

/**
 * @description: 删除权限信息
 */
export function deletePermissionInfo(permissionId: any) {
  return http.request<BasicResponseModel>({
    url: `/permission/delete`,
    method: "post",
    params: { permissionId: permissionId },
  });
}

export default {
  getAllPermission,
  addPermissionInfo,
  updatePermissionInfo,
  deletePermissionInfo,
};
