<template>
  <a-layout>
    <a-layout-sider
      class="forge-layout-sider"
      v-model:collapsed="collapsed"
      :theme="theme"
      :trigger="null"
      collapsible
      breakpoint="lg"
    >
      <SiderMenu :theme="theme" :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="forge-layout-header"
        style="background: #fff; padding: 0"
      >
        <a-row justify="space-between" class="forge-layout-header-user">
          <a-col class="forge-layout-header-left">
            <a-space :size="18">
              <div>
                <a-tooltip placement="bottom">
                  <template #title>展开/关闭</template>
                  <a-button type="text" @click="toggleCollapsed">
                    <template #icon>
                      <menu-unfold-outlined v-if="collapsed" />
                      <menu-fold-outlined v-else />
                    </template>
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>刷新</template>
                  <a-button type="text" @click="reloadPage">
                    <template #icon>
                      <reload-outlined class="trigger" />
                    </template>
                  </a-button>
                </a-tooltip>
              </div>
              <MenuBreadcrumb v-show="breadCrumbFlag" />
            </a-space>
          </a-col>
          <!---用戶操作区域-->
          <a-col class="forge-layout-header-right">
            <HeaderUserSpace />
          </a-col>
        </a-row>
        <TagsView v-show="pageTagFlag" />
      </a-layout-header>
      <a-layout-content class="forge-layout-content">
        <MainView />
      </a-layout-content>
      <a-layout-footer class="layout-footer">
        <PageFooter v-show="footerFlag" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, unref, computed } from "vue";
import SiderMenu from "./components/side-menu/index.vue";
import { useRoute, useRouter } from "vue-router";
import MainView from "./main-view.vue";
import TagsView from "./components/page-tag/index.vue";
import MenuBreadcrumb from "./components/breadcrumb-menu/index.vue";
import HeaderUserSpace from "./components/header-user-space/index.vue";
import PageFooter from "./components/page-footer/index.vue";
import { useProjectSettingStore } from "/@/store/modules/projectSetting";

export default defineComponent({
  name: "ForgeLayout",
  components: {
    SiderMenu,
    MenuBreadcrumb,
    HeaderUserSpace,
    TagsView,
    MainView,
    PageFooter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const collapsed = ref<boolean>(false);
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };
    const routerRedirect = (path: string) => {
      console.log("redirect:" + path);
      router.replace(path);
    };
    // 刷新页面
    const reloadPage = () => {
      router.push({
        path: "?redirect=" + unref(route).fullPath,
      });
    };
    const settingStore = useProjectSettingStore();
    //主题颜色
    const theme = computed(() => settingStore.$state.sideMenuTheme);
    // 是否显示面包屑
    const breadCrumbFlag = computed(() => settingStore.$state.breadCrumbFlag);
    // 是否显示标签页
    const pageTagFlag = computed(() => settingStore.$state.pageTagFlag);
    // 是否显示页脚
    const footerFlag = computed(() => settingStore.$state.footerFlag);
    return {
      theme,
      breadCrumbFlag,
      pageTagFlag,
      footerFlag,
      collapsed,
      routerRedirect,
      toggleCollapsed,
      reloadPage,
    };
  },
});
</script>
<style lang="less" scoped>
:deep(.ant-layout-header) {
  height: 40px;
  line-height: 45px;
}
.forge-layout-sider {
  overflow: auto;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
}

.forge-layout-header {
  .forge-layout-header-user {
    border-bottom: 1px solid fade(fade(#000, 85%), 4%);
  }

  .forge-layout-header-left {
    display: flex;
    height: @header-user-height;
    padding-left: 8px;
  }

  .forge-layout-header-right {
    display: flex;
    height: @header-user-height;
    padding-right: 8px;
  }
}

.forge-layout-content {
  padding: 15px 15px 0;
  min-height: 280px;
}

.layout-footer {
  position: relative;
  padding: 7px 0px;
  display: flex;
  justify-content: center;
}
</style>
