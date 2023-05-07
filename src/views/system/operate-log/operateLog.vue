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
        <a-form-item label="请求时间">
          <a-range-picker @change="changeCreateDate" style="width: 240px" />
        </a-form-item>
        <a-form-item label="快速筛选" class="smart-query-form-item">
          <a-radio-group
            v-model:value="params.successFlag"
            @change="queryData()"
          >
            <a-radio-button :value="undefined">全部</a-radio-button>
            <a-radio-button :value="true">成功</a-radio-button>
            <a-radio-button :value="false">失败</a-radio-button>
          </a-radio-group>
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
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.dataIndex === 'successFlag'">
            <a-tag :color="text ? 'success' : 'error'">
              {{ text ? "成功" : "失败" }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="showDetail(record.id)">
              详情
            </a-button>
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
    </a-card>
    <OperateLogDetailModal ref="detailModal" />
  </div>
</template>
<script lang="ts" setup name="operate_log">
import { ref, unref, reactive, onMounted } from "vue";
import operateLogApi from "/@/api/system/operateLog";
import OperateLogDetailModal from "./operateLogModal.vue";

const columns = ref([
  {
    title: "用户",
    dataIndex: "operateUserName",
  },
  {
    title: "操作模块",
    dataIndex: "module",
    ellipsis: true,
  },
  {
    title: "操作内容",
    dataIndex: "content",
    ellipsis: true,
  },
  {
    title: "请求路径",
    dataIndex: "url",
    ellipsis: true,
  },
  {
    title: "IP",
    dataIndex: "ip",
    ellipsis: true,
  },
  {
    title: "客户端",
    dataIndex: "userAgent",
    ellipsis: true,
  },
  {
    title: "请求方法",
    dataIndex: "method",
    ellipsis: true,
  },
  {
    title: "请求结果",
    dataIndex: "successFlag",
  },
  {
    title: "时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

const params = reactive({
  page: 1,
  size: 10,
  username: "",
  startDate: undefined,
  endDate: undefined,
  successFlag: undefined,
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
    const { data } = await operateLogApi.getOperateLog(_params);
    tableData.value = data.content;
    total.value = data.totalElements;
  } finally {
    loading.value = false;
  }
};
const detailModal = ref();
function showDetail(id: any) {
  detailModal.value.show(id);
}

onMounted(() => {
  queryData();
});
</script>
