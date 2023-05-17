<template>
  <a-modal
    v-model:visible="updateDeptModal"
    :confirm-loading="updateDeptLoading"
    title="调整部门"
    ok-text="确认"
    cancel-text="取消"
    @ok="updateDept"
    @cancel="cancelModal"
  >
    <Department @change="onChange" />
  </a-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import Department from "./department.vue";
import userApi from "/@/api/system/user";

const props = defineProps({
  selectedRowKeys: Array,
});
const emits = defineEmits(["submitOk"]);

const departmentId = ref(undefined);

const updateDeptModal = ref(false);
const updateDeptLoading = ref(false);
const showModal = () => {
  updateDeptModal.value = true;
};
defineExpose({ showModal });

const cancelModal = () => {
  updateDeptModal.value = false;
  departmentId.value = undefined;
};
function onChange(id: any) {
  departmentId.value = id;
}
const updateDept = async () => {
  if (!props.selectedRowKeys || props.selectedRowKeys.length == 0) {
    message.error("请选择至少一条数据");
    return;
  }
  if (!departmentId.value) {
    message.error("请选择部门");
    return;
  }
  try {
    updateDeptLoading.value = true;
    await userApi.adjustDepartment({
      userIds: props.selectedRowKeys,
      departmentId: departmentId.value,
    });
    message.success("调整成功");
    cancelModal();
    emits("submitOk");
  } finally {
    updateDeptLoading.value = false;
  }
};
</script>
