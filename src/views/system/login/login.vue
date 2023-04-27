<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="../../../assets/logo.svg" alt="" />
        </div>
        <div class="view-account-top-desc">Welcome to load in forge admin</div>
      </div>
      <div class="view-account-form">
        <a-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="formInline.username"
              placeholder="请输入用户名"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item class="default-color">
            <div class="space-between">
              <div>
                <a-checkbox v-model:checked="autoLogin">自动登录</a-checkbox>
              </div>
              <div class="order-last">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="handleSubmit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form-item>
          <a-form-item class="default-color">
            <div class="view-account-other">
              <div>
                <span>其它登录方式</span>
              </div>
              <div class="view-account-other-item">
                <a href="javascript:">
                  <github-outlined class="icon" />
                </a>
              </div>
              <div class="view-account-other-item">
                <a href="javascript:">
                  <wechat-outlined class="icon" />
                </a>
              </div>
              <div style="margin-left: auto">
                <a href="javascript:">注册账号</a>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "/@/store/modules/user";
import { PageEnum } from "/@/enums/pageEnum";

const formRef = ref();
const loading = ref(false);
const autoLogin = ref(true);

const formInline = reactive({
  username: "admin",
  password: "123456",
  isCaptcha: true,
});

const rules = {
  username: { required: true, message: "请输入用户名", trigger: "blur" },
  password: { required: true, message: "请输入密码", trigger: "blur" },
};

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const handleSubmit = () => {
  formRef.value.validateFields().then(async () => {
    message.loading("登录中...");
    loading.value = true;
    const { username, password } = formInline;
    const params = {
      username,
      password,
    };

    try {
      const { success, errMessage } = await userStore.login(params);
      message.destroy();
      if (success) {
        const toPath = decodeURIComponent(
          (route.query?.redirect || "/") as string
        );
        message.success("登录成功，即将进入系统");
        if (route.name === "Login") {
          console.log(router.getRoutes());
          router.replace(PageEnum.BASE_HOME);
        } else router.replace(toPath);
      } else {
        message.info(errMessage || "登录失败");
      }
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-logo {
      margin-bottom: 5px;
    }
    &-desc {
      font-size: 14px;
      color: fade(#000, 45%);
    }
  }

  &-other {
    width: 100%;
    display: flex;
    align-items: center;

    &-item {
      width: 25px;
      font-size: larger;
      padding-left: 6px;
    }
  }

  .default-color {
    color: fade(fade(#000, 85%), 75%);
  }
}

.space-between {
  display: flex;
  justify-content: space-between;
}

.icon {
  color: fade(fade(#000, 85%), 55%);
}

@media (min-width: 768px) {
  .view-account {
    background-image: url("/@/assets/login.svg");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
    background-color: #fff;
  }
}
</style>
