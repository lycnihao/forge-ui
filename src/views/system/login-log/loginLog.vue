<template>
  <div>
    <a-card>
      <a-form layout="inline">
        <a-form-item label="用户名">
          <a-input
            placeholder="请输入用户名称"
            :style="{ width: '300px' }"
            v-model:value="params.username"
          />
        </a-form-item>
        <a-form-item label="用户Ip">
          <a-input
            placeholder="请输入用户Ip"
            :style="{ width: '300px' }"
            v-model:value="params.ip"
          />
        </a-form-item>
        <a-form-item label="时间">
          <a-range-picker @change="changeCreateDate" style="width: 240px" />
        </a-form-item>
        <a-button type="primary" @click="queryData()" class="mr-2">
          查询
        </a-button>
        <a-button type="info"> 重置 </a-button>
      </a-form>
      <a-table
        style="margin-top: 1rem"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ text, column }">
          <template v-if="column.dataIndex === 'loginResult'">
            <template v-if="text === 0">
              <a-tag color="success">登录成功</a-tag>
            </template>
            <template v-if="text === 1">
              <a-tag color="error">登录失败</a-tag>
            </template>
            <template v-if="text === 2">
              <a-tag color="processing">退出登录</a-tag>
            </template>
          </template>
        </template>
      </a-table>
      <div class="page-pagination">
        <a-pagination
          class="pagination"
          v-model:current="params.page"
          v-model:page-size="params.pageSize"
          :defaultPageSize="params.pageSize"
          :page-size-options="['10', '20', '50', '100']"
          :total="total"
          showLessItems
          showSizeChanger
          @change="queryData"
          @showSizeChange="queryData"
        />
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup name="operate_log">
import { ref, unref, reactive, onMounted } from "vue";
import loginLogApi from "/@/api/system/loginLog";

const columns = ref([
  {
    title: "用户ID",
    dataIndex: "userId",
    width: 90,
  },
  {
    title: "用户名",
    dataIndex: "userName",
    ellipsis: true,
  },
  {
    title: "IP",
    dataIndex: "loginIp",
    ellipsis: true,
  },
  {
    title: "设备信息",
    dataIndex: "userAgent",
    ellipsis: true,
  },
  {
    title: "结果",
    dataIndex: "loginResult",
    ellipsis: true,
  },
  {
    title: "备注",
    dataIndex: "remark",
    ellipsis: true,
  },
  {
    title: "时间",
    dataIndex: "createTime",
    width: 150,
  },
]);

const params = reactive({
  page: 1,
  pageSize: 10,
  username: undefined,
  startDate: undefined,
  endDate: undefined,
  ip: undefined,
});
// 时间变动
function changeCreateDate(_dates: any, dateStrings: any) {
  params.startDate = dateStrings[0];
  params.endDate = dateStrings[1];
}

let tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const queryData = async () => {
  try {
    loading.value = true;
    let _params = {
      ...unref(params),
    };
    const { data } = await loginLogApi.getLoginLog(_params);
    tableData.value = data.content;
    total.value = data.totalElements;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  queryData();
});
</script>
