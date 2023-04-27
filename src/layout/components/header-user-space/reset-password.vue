<template>
  <a-modal
    :open="show"
    :confirm-loading="loading"
    title="修改密码"
    ok-text="确认"
    cancel-text="取消"
    @ok="updatePwd"
    @cancel="cancelModal"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="原密码" name="oldPassword">
        <a-input
          v-model:value.trim="form.oldPassword"
          type="password"
          placeholder="请输入原密码"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        name="newPassword"
        help="字母（不限大小写）+数字组合，6-15位"
      >
        <a-input
          v-model:value.trim="form.newPassword"
          type="password"
          placeholder="请输入新密码"
        />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPwd">
        <a-input
          v-model:value.trim="form.confirmPwd"
          type="password"
          placeholder="请输入确认密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { updatePassword } from "/@/api/system/user";

let form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPwd: undefined,
});

let confirmPwdValidate = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请输入确认密码");
  } else if (value !== form.newPassword) {
    return Promise.reject("两次输入不匹配");
  } else {
    return Promise.resolve();
  }
};
const reg = /(^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$)/; //校验正则
const rules = {
  oldPassword: [{ required: true, message: "请输入原密码" }],
  newPassword: [{ required: true, pattern: reg, message: "密码格式错误" }],
  confirmPwd: [{ required: true, pattern: reg, validator: confirmPwdValidate }],
};
const loading = ref(false);
const formRef = ref();
async function updatePwd() {
  formRef.value.validateFields().then(async () => {
    loading.value = true;
    try {
      const { oldPassword, newPassword } = form;
      const params = { oldPassword, newPassword };
      await updatePassword(params);
      message.success("修改成功");
      show.value = false;
    } finally {
      loading.value = false;
    }
  });
}

const show = ref(false);

function showModal() {
  show.value = true;
}

function cancelModal() {
  show.value = false;
}

defineExpose({ showModal });
</script>
