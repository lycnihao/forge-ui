<template>
  <a-config-provider :locale="locale">
    <a-style-provider hash-priority="high">
      <RouterView />
    </a-style-provider>
  </a-config-provider>
</template>
<script lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
};
</script>
