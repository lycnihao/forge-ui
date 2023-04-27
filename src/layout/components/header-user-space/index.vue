<template>
  <a-space :size="18">
    <!-- 全局搜索 -->
    <HeaderSearch />
    <!---消息通知--->
    <HeaderMessage ref="headerMessage" />
    <!---头像信息--->
    <HeaderAvatar />
    <!---设置--->
    <HeaderSetting ref="headerSetting" />
  </a-space>
</template>
<script setup lang="ts">
import HeaderSearch from "./header-search.vue";
import HeaderMessage from "./header-message.vue";
import HeaderSetting from "./header-setting.vue";
import HeaderAvatar from "./header-avatar.vue";
</script>
