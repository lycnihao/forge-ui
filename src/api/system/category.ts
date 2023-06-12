import { http } from '/@/utils/http/request';
import { BasicResponseModel } from '/@/types/http';

/**
 * @description: 商品分类 tree
 */
export function tree() {
  return http.request({
    url: '/goods/category/tree',
    method: 'GET',
  });
}

/**
 * @description: 获取分类列表
 */
export function pageList(params: any) {
  return http.request<BasicResponseModel>({
    url: '/goods/category/list',
    method: 'GET',
    params,
  });
}

/**
 * @description: 根据id获取分类
 */
export function getCategoryById(id: number) {
  return http.request<BasicResponseModel>({
    url: `/goods/category/${id}`,
    method: 'GET',
  });
}

/**
 * @description: 添加分类信息
 */
export function addCategory(params: any) {
  return http.request<BasicResponseModel>({
    url: '/goods/category/add',
    method: 'post',
    data: params,
  });
}

/**
 * @description: 更新分类信息
 */
export function updateCategory(params: any) {
  return http.request<BasicResponseModel>({
    url: '/goods/category/update',
    method: 'post',
    data: params,
  });
}

/**
 * @description: 删除分类信息
 */
export function deleteCategory(id: any) {
  return http.request<BasicResponseModel>({
    url: `/goods/category/delete/${id}`,
    method: 'post',
  });
}

/**
 * @description: 禁用分类信息
 */
export function disableCategory(id: any) {
  return http.request<BasicResponseModel>({
    url: `/goods/category/disable/${id}`,
    method: 'post',
  });
}

export default {
  tree,
  pageList,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  disableCategory,
};
