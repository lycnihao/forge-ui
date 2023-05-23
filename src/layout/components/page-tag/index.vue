<template>
  <!-- 标签页，共两部分：1、标签 ；2、标签操作区 -->
  <a-row class="forge-page-tag-space">
    <a-dropdown :trigger="['contextmenu']">
      <div class="forge-page-tag">
        <a-tabs
          :tab-position="mode"
          v-model:activeKey="state.selectedKey"
          size="small"
          @tabClick="goPage"
        >
          <a-tab-pane v-for="item in tabsList" :key="item.name">
            <template #tab>
              <span>
                {{ item.meta.title }}
                <close-outlined
                  @click.stop="closeTabItem(item)"
                  v-if="item.name !== 'dashboard_workplace'"
                  class="forge-page-tag-close"
                />
              </span>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="reloadPage()">刷新</a-menu-item>
          <a-menu-item @click="removeTab(undefined)">关闭</a-menu-item>
          <a-menu-item @click="closeOther()">关闭其他</a-menu-item>
          <a-menu-item @click="closeAll()">关闭所有</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <a-dropdown>
      <!--标签页操作区-->
      <div class="forge-page-tag-operate">
        <div class="forge-page-tag-operate-icon">
          <AppstoreOutlined />
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="reloadPage()">刷新</a-menu-item>
          <a-menu-item @click="removeTab(undefined)">关闭</a-menu-item>
          <a-menu-item @click="closeOther()">关闭其他</a-menu-item>
          <a-menu-item @click="closeAll()">关闭所有</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-row>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { AppstoreOutlined, CloseOutlined } from "@ant-design/icons-vue";
import { computed, ref, watch, reactive, unref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PageEnum } from "/@/enums/pageEnum";
import { useTabsViewStore, RouteItem } from "/@/store/modules/tabsView";
import { useAsyncRouteStore } from "/@/store/modules/asyncRoute";
import { useGo } from "/@/utils/usePage";
import { storage } from "/@/utils/storage";
import { TABS_ROUTES } from "/@/store/mutation-types";

const router = useRouter();
const route = useRoute();
const mode = ref("top");
const tabsViewStore = useTabsViewStore();
const asyncRouteStore = useAsyncRouteStore();
const go = useGo();

const state = reactive({
  activeKey: route.fullPath,
  selectedKey: route.name,
});

// 获取简易的路由对象
const getSimpleRoute = (route: any): RouteItem => {
  const { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
};
let cacheRoutes: RouteItem[] = [];
const simpleRoute = getSimpleRoute(route);
try {
  const routesStr = storage.get(TABS_ROUTES) as string | null | undefined;
  cacheRoutes = routesStr ? JSON.parse(routesStr) : [simpleRoute];
} catch (e) {
  cacheRoutes = [simpleRoute];
}
// 将最新的路由信息同步到 localStorage 中
const routes = router.getRoutes();
cacheRoutes.forEach((cacheRoute) => {
  const route = routes.find((route) => route.path === cacheRoute.path);
  if (route) {
    cacheRoute.meta = route.meta || cacheRoute.meta;
    cacheRoute.name = (route.name || cacheRoute.name) as string;
  }
});

// 初始化标签页
tabsViewStore.initTabs(cacheRoutes);

// 设置首页标签页
const pageHomeIsExists = tabsViewStore.tabsList.some(
  (item) => item.name == PageEnum.BASE_HOME_PAGE_NAME
);
if (!pageHomeIsExists) {
  const homeRoute = routes.find(
    (route) => route.name === PageEnum.BASE_HOME_PAGE_NAME
  );
  if (homeRoute != null) {
    tabsViewStore.setHomeTab({
      ...homeRoute,
      fullPath: homeRoute.path,
    });
  }
}

// 移除缓存组件名称
const delKeepAliveCompName = () => {
  if (route.meta.keepAlive) {
    const name = router.currentRoute.value.matched.find(
      (item) => item.name == route.name
    )?.components?.default.name;
    if (name) {
      asyncRouteStore.keepAliveComponents =
        asyncRouteStore.keepAliveComponents.filter((item) => item != name);
    }
  }
};

// 标签页列表
const tabsList: any = computed(() => tabsViewStore.tabsList);
const whiteList: string[] = [
  PageEnum.BASE_LOGIN_NAME,
  PageEnum.REDIRECT_NAME,
  PageEnum.ERROR_PAGE_NAME,
];
watch(
  () => route.fullPath,
  (to) => {
    if (whiteList.includes(route.name as string)) return;
    state.activeKey = to;
    state.selectedKey = route.name;
    tabsViewStore.addTabs(getSimpleRoute(route));
  },
  { immediate: true }
);

// 关闭当前页面
const removeTab = (route: any) => {
  if (tabsList.value.length === 1) {
    return message.warning("这已经是最后一页，不能再关闭了！");
  }
  delKeepAliveCompName();
  tabsViewStore.closeCurrentTab(route);
  // 如果关闭的是当前页
  if (state.activeKey === route.fullPath) {
    const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)];
    state.activeKey = currentRoute.fullPath;
    state.selectedKey = currentRoute.name;
    router.push(currentRoute);
  }
};
// 刷新页面
const reloadPage = () => {
  delKeepAliveCompName();
  router.push({
    path: "?redirect=" + unref(route).fullPath,
  });
};
// 注入刷新页面方法
provide("reloadPage", reloadPage);
// 关闭左侧
// const closeLeft = () => {
//   tabsViewStore.closeLeftTabs(route);
//   state.activeKey = route.fullPath;
//   state.selectedKey = route.name;
//   router.replace(route.fullPath);
// };

// 关闭右侧
// const closeRight = () => {
//   tabsViewStore.closeRightTabs(route);
//   state.activeKey = route.fullPath;
//   state.selectedKey = route.name;
//   router.replace(route.fullPath);
// };

// 关闭其他
const closeOther = () => {
  tabsViewStore.closeOtherTabs(route);
  state.activeKey = route.fullPath;
  state.selectedKey = route.name;
  router.replace(route.fullPath);
};

// 关闭全部
const closeAll = () => {
  tabsViewStore.closeAllTabs();
  router.replace(PageEnum.BASE_HOME);
};

//tags 跳转页面
function goPage(tabsKey: any) {
  const { name, fullPath } = route;
  const goRoute = tabsList.value.find((item: any) => item.name == tabsKey);
  if (fullPath === goRoute.fullPath) return;
  state.activeKey = fullPath;
  state.selectedKey = name;
  go(goRoute, true);
}

//删除tab
function closeTabItem(e: any) {
  const { fullPath } = e;
  const routeInfo = tabsList.value.find(
    (item: any) => item.fullPath == fullPath
  );
  removeTab(routeInfo);
}
</script>

<style scoped lang="less">
@forge-page-tag-operate-width: 30px;
@forge-page-tag-height: 22px;

.forge-page-tag-operate {
  width: @forge-page-tag-operate-width;
  height: @forge-page-tag-operate-width;
  //background-color: #fff;
  font-size: 17px;
  text-align: center;
  vertical-align: middle;
  line-height: @forge-page-tag-operate-width;
  padding-right: 10px;
  cursor: pointer;
  color: fade(#000, 45%);

  .forge-page-tag-operate-icon {
    transition: all 1s;
    transform-origin: 10px 20px;
    position: relative;
    top: -6px;
  }

  .forge-page-tag-operate-icon:hover {
    width: 20px;
    height: 20px;
    transform: rotate(360deg);
  }
}

.forge-page-tag-operate:hover {
  color: @primary-color;
}

.forge-page-tag-space {
  background-color: #fff;
  height: 30px;
  .forge-page-tag {
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    padding-left: 20px;
    user-select: none;
    width: calc(100% - @forge-page-tag-operate-width - 2px);
    height: calc(@forge-page-tag-height + 1px);

    .forge-page-tag-close {
      display: table-cell;
      margin-left: 5px;
      font-size: 10px;
    }

    /**  覆盖 ant design vue的 tabs 样式，变小一点 **/
    :deep(.ant-tabs) {
      height: @forge-page-tag-height;
      line-height: @forge-page-tag-height;
    }

    :deep(.ant-tabs-nav::before) {
      border-bottom: 1px solid #fff;
    }

    :deep(.ant-tabs-small > .ant-tabs-nav .ant-tabs-tab) {
      padding: 3px 8px 3px 8px;
    }

    :deep(.ant-tabs-tab-active) {
      background-color: tint(@primary-color, 90%);

      .forge-page-tag-close {
        color: @primary-color;
      }
    }
  }
}
</style>
