<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition name="fade" mode="out-in" appear>
        <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAsyncRouteStore } from "/@/store/modules/asyncRoute";

export default defineComponent({
  name: "MainView",
  setup() {
    const asyncRouteStore = useAsyncRouteStore();

    // 需要缓存的路由组件
    const keepAliveComponents = computed(
      () => asyncRouteStore.keepAliveComponents
    );

    return {
      keepAliveComponents,
    };
  },
});
</script>
