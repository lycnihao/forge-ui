<template>
  <a-menu
    mode="inline"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    v-model:collapsed="inlineCollapsed"
    :theme="theme"
  >
    <template v-for="item in menusList" :key="item.name">
      <template v-if="!item.children">
        <a-menu-item :key="item.name" @click="routerRedirect(item.path)">
          <template #icon>
            <component
              v-if="item.meta && item.meta.icon"
              :is="item.meta.icon"
            />
          </template>
          {{ item.meta?.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <SubMenu :key="item.name" :menu-info="item" :parentPath="item.path" />
      </template>
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAsyncRouteStore } from "/@/store/modules/asyncRoute";
import SubMenu from "./sider-menu-sub.vue";

export default defineComponent({
  name: "SiderMenu",
  components: {
    SubMenu,
  },
  props: {
    theme: {
      type: String,
      default: "dark",
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    // 获取当前打开的子菜单
    const route = useRoute();
    const matched = route.matched;
    const getOpenKeys =
      matched && matched.length ? matched.map((item) => item.name) : [];
    const asyncRouteStore = useAsyncRouteStore();
    const menusList = asyncRouteStore.getMenus;

    const router = useRouter();
    const routerRedirect = (path: string) => {
      console.log("redirect:" + path);
      router.replace(path);
    };

    let currentRouteName = ref<any[]>([route.name]);
    watch(
      () => router.currentRoute.value,
      (newValue: any) => {
        currentRouteName.value = [newValue.name];
      }
    );

    return {
      routerRedirect,
      menusList,
      openKeys: getOpenKeys,
      selectedKeys: currentRouteName,
      inlineCollapsed: ref<boolean>(false),
    };
  },
  watch: {
    collapsed(newVal) {
      this.inlineCollapsed = newVal;
    },
    inlineCollapsed(newVal) {
      // collapsed更改传给父组件
      this.$emit("update:collapsed", newVal);
    },
  },
});
</script>
