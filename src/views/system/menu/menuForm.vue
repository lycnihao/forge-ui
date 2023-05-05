<template>
  <div>
    <a-form
      :model="formParams"
      ref="formRef"
      label-placement="left"
      class="py-4"
      :label-col="{ span: 3 }"
    >
      <a-form-item :span="24" label="类型" name="type" :rules="rules.type">
        <a-radio-group v-model:value="formParams.type">
          <a-radio-button :value="1">目录</a-radio-button>
          <a-radio-button :value="2">菜单</a-radio-button>
          <a-radio-button :value="3">按钮</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item :span="24" :label="'上级' + typeLable" name="parentKey">
        <a-tree-select
          :tree-data="treeData"
          v-model:value="formParams.parentKey"
          clearable
        />
      </a-form-item>
      <a-form-item
        :span="12"
        :label="`名称`"
        name="title"
        :rule="{
          required: true,
          message: `请输入${typeLable}名称`,
          trigger: 'blur',
        }"
      >
        <a-input
          :placeholder="`${typeLable}名称`"
          v-model:value="formParams.title"
        />
      </a-form-item>
      <a-form-item :span="12" :label="`${typeLable}图标`" name="icon">
        <a-input
          :placeholder="`${typeLable}图标`"
          v-model:value="formParams.icon"
        />
      </a-form-item>
      <a-form-item :span="12" label="路由地址" name="path" :rules="rules.path">
        <a-input placeholder="路由地址" v-model:value="formParams.path" />
      </a-form-item>
      <a-form-item
        :span="12"
        label="默认路由"
        name="redirect"
        v-if="formParams.type === 1"
      >
        <a-input placeholder="默认路由" v-model:value="formParams.redirect" />
      </a-form-item>
      <a-form-item :span="12" label="路由名称" name="name" :rules="rules.name">
        <a-input placeholder="路由名称" v-model:value="formParams.name" />
      </a-form-item>
      <a-form-item :span="12" label="显示排序" name="sort">
        <a-input-number v-model:value="formParams.sort" clearable />
      </a-form-item>
      <a-form-item
        :span="24"
        label="组件路径"
        name="component"
        v-if="formParams.type !== 3"
      >
        <a-input placeholder="组件路径" v-model:value="formParams.component" />
      </a-form-item>
      <a-form-item :span="24" label="是否缓存" name="keepAlive">
        <a-radio-group
          v-model:value="formParams.keepAlive"
          :default-value="true"
        >
          <a-radio-button :value="true">开启</a-radio-button>
          <a-radio-button :value="false">关闭</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :span="24"
        name="auth"
        style="margin-left: 100px"
        v-if="!addFlag"
      >
        <a-space>
          <a-button type="primary" :loading="subLoading" @click="formSubmit"
            >保存修改</a-button
          >
          <a-button @click="handleDel">删除</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed, watch } from "vue";
import { message, Modal } from "ant-design-vue";
import permissionApi from "/@/api/system/permission";

export default defineComponent({
  name: "MenuForm",
  props: {
    form: Object,
    addFlag: Boolean,
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    submitOk: {
      type: Function,
      default() {},
    },
  },
  setup(props) {
    const { addFlag } = toRefs(props);
    const formParams = reactive({});
    const rules = {
      type: {
        required: true,
        message: "请选择菜单类型",
        trigger: "change",
        type: "number",
      },
      name: { required: true, message: "请选择路由名称", trigger: "blur" },
      path: { required: true, message: "请选择路由地址", trigger: "blur" },
    };

    const formRef: any = ref(null);

    const subLoading = ref(false);
    const typeLable = computed(() => {
      if (formParams?.type == 1) {
        return "目录";
      }
      if (formParams?.type == 2) {
        return "菜单";
      }
      if (formParams?.type == 3) {
        return "按钮";
      }
      return "";
    });

    function formSubmit() {
      formRef.value.validateFields().then(async () => {
        if (addFlag.value) {
          await permissionApi.addPermissionInfo(formParams);
        } else {
          await permissionApi.updatePermissionInfo(formParams);
        }
        message.success("保存成功");
        props.submitOk();
      });
    }

    function handleDel() {
      Modal.info({
        title: "提示",
        content: `您确定想删除此权限吗?`,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          await permissionApi.deletePermissionInfo(formParams.id);
          message.success("删除成功");
          props.submitOk();
        },
        onCancel: () => {
          message.error("已取消");
        },
      });
    }

    watch(
      props.form || {},
      (value) => {
        Object.assign(formParams, value);
      },
      { immediate: true }
    );

    return {
      props,
      formParams,
      rules,
      formRef,
      subLoading,
      typeLable,
      formSubmit,
      handleDel,
    };
  },
});
</script>
