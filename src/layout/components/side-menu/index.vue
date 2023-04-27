<template>
  <div class="forge-layout-sider-logo">
    <transition mode="out-in">
      <img src="../../../assets/logo.svg" alt="" v-if="!collapsed" />
      <img
        src="../../../assets/logo-thumbnail.svg"
        alt=""
        style="width: 80px"
        v-else
      />
    </transition>
  </div>
  <RecursionMenu :theme="theme" :collapsed="collapsed" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RecursionMenu from "./recursion-menu.vue";
export default defineComponent({
  name: "SiderMenu",
  components: {
    RecursionMenu,
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
});
</script>
<style lang="less" scoped>
.forge-layout-sider-logo > img {
  padding: 10px 19px 4px;
}
</style>
