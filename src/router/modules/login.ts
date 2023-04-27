import { RouteRecordRaw } from "vue-router";
import { PageEnum } from "/@/enums/pageEnum";
export const loginRouters: Array<RouteRecordRaw> = [
  {
    path: PageEnum.BASE_LOGIN,
    name: PageEnum.BASE_LOGIN_NAME,
    component: () => import("/@/views/system/login/login.vue"),
    meta: {
      title: "登录",
    },
  },
];
