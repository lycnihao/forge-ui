<template>
  <a-dropdown class="header-trigger">
    <div class="wrapper">
      <a-avatar style="margin: 0 5px" :size="24" id="adminAvatar" :src="avatar">
        {{ nickname }}
      </a-avatar>
      <span class="name">{{ nickname }}</span>
    </div>
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item @click="showUpdatePwdModal">
          <span>修改密码</span>
        </a-menu-item>
        <a-menu-item @click="doLogout">
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <ResetPassword ref="resetPasswordRef" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Modal, message } from "ant-design-vue";
import { useUserStore } from "/@/store/modules/user";
import { TABS_ROUTES } from "/@/store/mutation-types";
import ResetPassword from "./reset-password.vue";
import { useRoute, useRouter } from "vue-router";

const resetPasswordRef = ref();
function showUpdatePwdModal() {
  resetPasswordRef.value.showModal();
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const nickname = userStore.getNickname;
const avatar = userStore.getAvatar;
// 退出登录
const doLogout = () => {
  Modal.confirm({
    title: "提示",
    content: "您确定要退出登录吗",
    okText: "确定",
    cancelText: "取消",
    onOk: () => {
      userStore.logout().then(() => {
        message.success("成功退出登录");
        // 移除标签页
        localStorage.removeItem(TABS_ROUTES);
        router
          .replace({
            name: "Login",
            query: {
              redirect: route.fullPath,
            },
          })
          .finally(() => location.reload());
      });
    },
    onCancel: () => {},
  });
};
</script>
<style lang="less" scoped>
.wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.header-trigger {
  height: @header-user-height;
  line-height: @header-user-height;

  .avatar {
    vertical-align: middle;
  }

  .name {
    margin-left: 5px;
    font-weight: 500;
  }
}
</style>
