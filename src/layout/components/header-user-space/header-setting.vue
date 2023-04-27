<template>
  <a-button type="text" @click="open">
    <template #icon>
      <setting-outlined :style="{ fontSize: '18px' }"
    /></template>
  </a-button>
  <a-drawer
    title="项目配置"
    placement="right"
    width="305"
    :open="show"
    @close="close"
  >
    <a-form layout="horizontal" :label-col="{ span: 7 }">
      <a-form-item label="菜单主题">
        <a-radio-group
          v-model:value="formState.sideMenuTheme"
          @change="changeMenuTheme"
        >
          <a-radio-button value="dark">暗黑</a-radio-button>
          <a-radio-button value="light">白色</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="面包屑">
        <a-switch
          @change="changeBreadCrumbFlag"
          v-model:checked="formState.breadCrumbFlag"
          checked-children="显示"
          un-checked-children="隐藏"
        />
      </a-form-item>
      <a-form-item label="标签页">
        <a-switch
          @change="changePageTagFlag"
          v-model:checked="formState.pageTagFlag"
          checked-children="显示"
          un-checked-children="隐藏"
        />
      </a-form-item>
      <a-form-item label="页脚">
        <a-switch
          @change="changeFooterFlag"
          v-model:checked="formState.footerFlag"
          checked-children="显示"
          un-checked-children="隐藏"
        />
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" type="primary" @click="copy"
        >复制配置信息</a-button
      >
      <a-button type="block" danger @click="reset">恢复默认配置 </a-button>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { Modal } from "ant-design-vue";
import projectSetting from "/@/settings/projectSetting";
import { useProjectSettingStore } from "/@/store/modules/projectSetting";
import { storage } from "/@/utils/storage";
import { PROJECT_SETTING } from "/@/store/mutation-types";

const show = ref(false);
defineExpose({
  show,
});
function close() {
  show.value = false;
}
function open() {
  show.value = true;
}

function copy() {
  let content = JSON.stringify(formState, null, 2);
  // 创建元素用于复制
  const aux = document.createElement("input");
  // 设置元素内容
  aux.setAttribute("value", content);
  // 将元素插入页面进行调用
  document.body.appendChild(aux);
  // 复制内容
  aux.select();
  // 将内容复制到剪贴板
  document.execCommand("copy");
  // 删除创建元素
  document.body.removeChild(aux);

  Modal.success({
    title: "复制成功",
    content: h("div", {}, [
      h("p", "可以直接修改 /src/settings/projectSetting.js 文件保存此配置"),
    ]),
  });
}

function reset() {
  for (const k in projectSetting) {
    formState[k] = projectSetting[k];
  }
  projectSettingStore.reset();
}

const projectSettingStore = useProjectSettingStore();
useProjectSettingStore().$subscribe((mutation, state) => {
  storage.set(PROJECT_SETTING, JSON.stringify(state));
});

// 表单
let formValue = {
  // 菜单主题
  sideMenuTheme: projectSettingStore.sideMenuTheme,
  // 标签页
  pageTagFlag: projectSettingStore.pageTagFlag,
  // 面包屑
  breadCrumbFlag: projectSettingStore.breadCrumbFlag,
  // 页脚
  footerFlag: projectSettingStore.footerFlag,
};
let formState = reactive({ ...formValue });

function changeMenuTheme(e) {
  projectSettingStore.$patch({
    sideMenuTheme: e.target.value,
  });
}

function changeBreadCrumbFlag(e) {
  projectSettingStore.$patch({
    breadCrumbFlag: e,
  });
}

function changePageTagFlag(e) {
  projectSettingStore.$patch({
    pageTagFlag: e,
  });
}

function changeFooterFlag(e) {
  projectSettingStore.$patch({
    footerFlag: e,
  });
}
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid fade(fade(#000, 85%), 5%);
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}
</style>
