import { defineStore } from "pinia";
import { store } from "/@/store";
import { storage } from "/@/utils/storage";
import { ACCESS_TOKEN, CURRENT_USER } from "/@/store/mutation-types";
import { getUserInfo, login, logout } from "/@/api/system/user";
import { BasicResponseModel } from "/@/types/http";

export interface IUserState {
  token: string;
  avatar: string;
  permissions: any[];
  info: any;
}

export const useUserStore = defineStore({
  id: "app-user",
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ""),
    avatar: "",
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.info?.nickname;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions: any) {
      this.permissions = permissions;
    },
    setUserInfo(info: any) {
      this.info = info;
    },
    // 登录
    async login(userInfo: any) {
      try {
        const response = await login(userInfo);
        const { data, success } = response;
        if (success) {
          // token有效期1小时
          const ex = 60 * 60;
          storage.set(ACCESS_TOKEN, data["access_token"], ex);
          storage.set(CURRENT_USER, data, ex);
          this.setToken(data["access_token"]);
          //this.setUserInfo(data);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    async getInfo() {
      try {
        const response = await getUserInfo();
        const result = response.data;
        storage.set(CURRENT_USER, result, 60 * 60 * 1000);
        if (result.permissions && result.permissions.length) {
          const permissionsList = result.permissions;
          this.setPermissions(permissionsList);
          this.setUserInfo(result);
        } else {
          return Promise.reject(
            new Error("getInfo: permissionsList must be a non-null array !")
          );
        }
        this.setAvatar(result.avatar);
        return Promise.resolve(response);
      } catch (e: BasicResponseModel<any> | any) {
        return Promise.resolve(e);
      }
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo("");
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      await logout();
      return Promise.resolve("");
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
