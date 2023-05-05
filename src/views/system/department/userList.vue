<template>
  <div>
    <a-card>
      <div class="page-header flex justify-between">
        <div class="text-lg font-bold">
          <span>用户管理</span>
        </div>
        <a-form layout="inline">
          <a-form-item label="账号">
            <a-input
              placeholder="请输入账号"
              :style="{ width: '300px' }"
              v-model:value="params.username"
            />
          </a-form-item>
          <a-button type="primary" @click="queryData()" class="mr-2">
            查询
          </a-button>
          <a-button type="info"> 重置 </a-button>
        </a-form>
      </div>
      <div class="table-operations">
        <a-button type="primary" size="small" @click="showModal">
          变更岗位
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="selectedRowKeys.length > 0">
            {{ `已选择 ${selectedRowKeys.length} 条数据` }}
          </template>
        </span>
      </div>
      <a-table
        rowKey="userId"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'roles'">
            <span>
              <a-tag v-for="tagKey in record.roles" :key="tagKey">
                {{ tagKey }}
              </a-tag>
            </span>
          </template>
        </template>
      </a-table>
      <div class="page-pagination">
        <a-pagination
          class="pagination"
          v-model:current="params.page"
          v-model:page-size="params.size"
          :defaultPageSize="params.size"
          :page-size-options="['10', '20', '50', '100']"
          :total="total"
          showLessItems
          showSizeChanger
          @change="queryData"
          @showSizeChange="queryData"
        />
      </div>
      <userDeptModal
        ref="userDeptModalRef"
        :selectedRowKeys="selectedRowKeys"
        @submitOk="queryData()"
      />
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { unref, reactive, ref, onMounted } from "vue";
import userApi from "/@/api/system/user";
import userDeptModal from "./userDeptModal.vue";

const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "邮箱",
    key: "email",
    dataIndex: "email",
  },
  {
    title: "角色",
    key: "roles",
    dataIndex: "roles",
  },
  {
    title: "创建时间",
    key: "createDate",
    dataIndex: "createDate",
  },
];
const total = ref(0);

const params = reactive({
  page: 1,
  size: 10,
  username: "",
  email: "",
  departmentId: undefined,
});
let tableData = ref([]);
const loading = ref(false);
const queryData = async () => {
  try {
    loading.value = true;
    let _params = {
      ...unref(params),
    };
    const { data } = await userApi.getUserList(_params);
    tableData.value = data.content;
    total.value = data.totalElements;
  } finally {
    loading.value = false;
    selectedRowKeys.value = [];
  }
};

const queryDataByDepartmentId = (departmentId: any) => {
  params.departmentId = departmentId;
  queryData();
};
defineExpose({ queryDataByDepartmentId });

const selectedRowKeys = ref([]);
const onSelectChange = (rowKeys: any) => {
  console.log("selectedRowKeys changed: ", rowKeys);
  selectedRowKeys.value = rowKeys;
};

const userDeptModalRef = ref();
const showModal = () => {
  userDeptModalRef.value.showModal();
};

onMounted(() => {
  queryData();
});
</script>
