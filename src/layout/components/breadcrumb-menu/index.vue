<template>
  <a-breadcrumb separator=">" style="display: inline-block">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{
      item.label
    }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

let currentRoute = useRoute();
const generator: any = (routerMap: any) => {
  return routerMap.map((item: any) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === "/",
    };
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentMenu.children = generator(item.children, currentMenu);
    }
    return currentMenu;
  });
};

//根据路由监听面包屑
const breadcrumbList = computed(() => {
  return generator(currentRoute.matched);
});
</script>
