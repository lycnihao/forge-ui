import { http } from "/@/utils/http/request";
import { BasicResponseModel } from "/@/types/http";

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取当前登录用户信息
 */
export function getUserInfo() {
  return http.request<BasicResponseModel>({
    url: "/user/info",
    method: "get",
  });
}

/**
 * @description: 修改用户密码
 */
export function updatePassword(params: any) {
  return http.request<BasicResponseModel>({
    url: "/user/updatePassword",
    method: "post",
    params: params,
  });
}

/**
 * @description: 重置用户密码
 */
export function resetPassword(userId: number) {
  return http.request<BasicResponseModel>({
    url: `/user/update/password/password/reset/${userId}`,
    method: "post",
  });
}

/**
 * @description: 获取用户信息
 */
export function getUserInfoById(id: number) {
  return http.request<BasicResponseModel>({
    url: `/user/info/${id}`,
    method: "get",
  });
}

/**
 * @description: 添加用户信息
 */
export function addUserInfo(params: any) {
  return http.request<BasicResponseModel>({
    url: "/user/add",
    method: "post",
    data: params,
  });
}

/**
 * @description: 更新用户信息
 */
export function updateUserInfo(params: any) {
  return http.request<BasicResponseModel>({
    url: "/user/update",
    method: "post",
    data: params,
  });
}

/**
 * @description: 禁用用户信息
 */
export function disabledUserInfo(userId: number) {
  return http.request<BasicResponseModel>({
    url: `/user/disabled?userId=${userId}`,
    method: "post",
  });
}

/**
 * @description: 批量删除用户信息
 */
export function batchDeleteUser(params: Array<number>) {
  return http.request<BasicResponseModel>({
    url: `/user/batch/delete`,
    method: "post",
    data: params,
  });
}

/**
 * @description: 用户登录
 */
export function login(params: any) {
  return http.request<BasicResponseModel>({
    url: "/user/login",
    method: "POST",
    params,
  });
}

/**
 * @description: 用户登出
 */
export function logout() {
  return http.request({
    url: "/user/logout",
    method: "POST",
  });
}

/**
 * @description: 获取用户列表
 */
export function getUserList(params: any) {
  return http.request<any>({
    url: "/user/list",
    method: "get",
    params,
  });
}

/**
 * @description: 调整当前用户部门
 */
export function adjustDepartment(params: any) {
  return http.request<BasicResponseModel>({
    url: "/user/adjustDepartment",
    method: "post",
    data: params,
  });
}

export default {
  getUserInfo,
  updatePassword,
  getUserInfoById,
  addUserInfo,
  updateUserInfo,
  disabledUserInfo,
  batchDeleteUser,
  login,
  logout,
  getUserList,
  adjustDepartment,
  resetPassword,
};
