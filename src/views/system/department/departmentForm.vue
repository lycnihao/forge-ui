<template>
  <div>
    <a-form
      :model="formParams"
      ref="formRef"
      label-placement="left"
      class="py-4"
      :label-col="{ span: 4 }"
    >
      <a-form-item :span="24" label="上级部门" name="parentId">
        <a-tree-select
          :tree-data="treeData"
          v-model:value="formParams.parentId"
          clearable
        />
      </a-form-item>
      <a-form-item
        :span="12"
        label="部门名称"
        name="deptName"
        :rule="rules.deptName"
      >
        <a-input
          :placeholder="`部门名称`"
          v-model:value="formParams.deptName"
        />
      </a-form-item>
      <a-form-item :span="12" label="显示排序" name="sort">
        <a-input-number v-model:value="formParams.sort" clearable />
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch } from "vue";
import { message } from "ant-design-vue";
import deptApi from "../../../api/system/department";

export default defineComponent({
  name: "DeptForm",
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
    const formParams = reactive({
      id: undefined,
      parentId: undefined,
      deptName: undefined,
      sort: undefined,
    });
    const rules = {
      deptName: { required: true, message: "请输入部门名称", trigger: "blur" },
    };

    const formRef: any = ref(null);

    const subLoading = ref(false);

    function formSubmit() {
      formRef.value.validateFields().then(async () => {
        const param = {
          ...formParams,
        };
        if (typeof param.parentId == "object") {
          param.parentId = undefined;
        }
        if (!param.id) {
          await deptApi.addDept(param);
        } else {
          await deptApi.updateDept(param);
        }
        message.success("保存成功");
        props.submitOk();
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
      formParams,
      rules,
      formRef,
      subLoading,
      formSubmit,
    };
  },
});
</script>
