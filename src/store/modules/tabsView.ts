import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";

// 不需要出现在标签页中的路由
const whiteList = ["Redirect", "login"];

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  path: string;
  name: string;
  hash: string;
  meta: object;
  params: object;
  query: object;
};

export type ITabsViewState = {
  tabsList: RouteItem[]; // 标签页
};

//保留固定路由
function retainAffixRoute(list: any[]) {
  return list.filter((item) => item?.meta?.affix ?? false);
}

export const useTabsViewStore = defineStore({
  id: "app-tabs-view",
  state: (): ITabsViewState => ({
    tabsList: [],
  }),
  getters: {},
  actions: {
    initTabs(routes: RouteItem[]) {
      // 初始化标签页
      this.tabsList = routes;
    },
    addTabs(route: any): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabsList.some(
        (item) => item.fullPath == route.fullPath
      );
      if (!isExists) {
        this.tabsList.push(route);
      }
      // for (const tab of this.tabsList) {
      //   console.log(tab);
      // }
      return true;
    },
    setHomeTab(route: any): boolean {
      this.tabsList.unshift(route);
      return true;
    },
    closeLeftTabs(route: any) {
      // 关闭左侧
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList = this.tabsList.filter(
        (item, i) => i >= index || (item?.meta?.affix ?? false)
      );
    },
    closeRightTabs(route: any) {
      // 关闭右侧
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList = this.tabsList.filter(
        (item, i) => i <= index || (item?.meta?.affix ?? false)
      );
    },
    closeOtherTabs(route: any) {
      // 关闭其他
      this.tabsList = this.tabsList.filter(
        (item) =>
          item.fullPath == route.fullPath || (item?.meta?.affix ?? false)
      );
    },
    closeCurrentTab(route: any) {
      // 关闭当前页
      const index = this.tabsList.findIndex(
        (item) => item.fullPath == route.fullPath
      );
      this.tabsList.splice(index, 1);
      // for (const tab of this.tabsList) {
      //   console.log(tab);
      // }
    },
    closeAllTabs() {
      // 关闭全部
      console.log(retainAffixRoute(this.tabsList));
      this.tabsList = retainAffixRoute(this.tabsList);
    },
  },
});
