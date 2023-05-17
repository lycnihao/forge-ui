<template>
  <a-row justify="space-between" :gutter="16">
    <a-col span="6">
      <Department :showMenu="true" @change="onChange" />
    </a-col>
    <a-col span="18">
      <User ref="userList" />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup name="system_dept_user">
import { ref } from "vue";
import Department from "./department.vue";
import User from "./userList.vue";

const userList = ref();

function onChange(id: any) {
  userList.value.queryDataByDepartmentId(id);
}
</script>
