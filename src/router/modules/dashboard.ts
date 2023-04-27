import { RouteRecordRaw } from "vue-router";
import ForgeLayout from "/@/layout/forge-layout.vue";

export const dashboardRouters: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "_dashboard",
    redirect: { name: "dashboard" },
    meta: {
      title: "首页",
    },
    component: ForgeLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "首页",
        },
        component: () => import("/@/views/system/dashboard/index.vue"),
      },
    ],
  },
];
