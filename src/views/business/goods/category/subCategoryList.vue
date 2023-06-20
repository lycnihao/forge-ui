<template>
  <div>
    <a-card>
      <div class="page-header flex justify-between">
        <div class="text-lg font-bold">
          <span>子分类管理</span>
        </div>
        <a-form layout="inline">
          <a-form-item label="类别名称">
            <a-input placeholder="请输入类别名称" :style="{ width: '300px' }" v-model:value="params.name" />
          </a-form-item>
          <a-button type="primary" @click="queryData()" class="mr-2"> 查询 </a-button>
          <a-button type="info"> 重置 </a-button>
        </a-form>
      </div>
      <div class="table-operations">
        <a-button type="primary" size="small" @click="openDrawer()"> 添加分类 </a-button>
        <span style="margin-left: 8px">
          <template v-if="selectedRowKeys.length > 0">
            {{ `已选择 ${selectedRowKeys.length} 条数据` }}
          </template>
        </span>
      </div>
      <a-table
        rowKey="code"
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
          <template v-if="column.key === 'subFlag'">{{ record.subFlag ? '子类目' : '普通类目' }}</template>
          <template v-if="column.key === 'statusFlag'">{{ record.statusFlag ? '正常' : '禁用' }}</template>
          <template v-else-if="column.key === 'action'">
            <a-space size="middle">
              <a-button type="link" size="small" @click="openDrawer('update', record.id)"> 编辑 </a-button>
              <a-popconfirm
              title="确认禁用吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="disableCategory(record.id)"
            >
            <a-button type="link" size="small"> 禁用 </a-button>
            </a-popconfirm>
            <a-popconfirm
              title="确认删除吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteCategory(record.id)"
            >
            <a-button type="link" size="small"> 删除 </a-button>
            </a-popconfirm>
            </a-space>
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
          :total="paginationTotal"
          showLessItems
          showSizeChanger
          @change="queryData"
          @showSizeChange="queryData"
        />
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import categoryApi from '/@/api/system/category';

  const emits = defineEmits(['openDrawer']);
  const props = defineProps({
    treeItemKey: String,
  });

  interface Params {
    name: string;
    parentId: string | undefined;
    page: number;
    size: number;
  }

  const params: Params = reactive({
    name: '',
    parentId: undefined,
    page: 1,
    size: 10,
  });

  let tableData = ref([]);
  const loading = ref(false);
  const paginationTotal = ref(0);

  async function queryData() {
    try {
      loading.value = true;
      params.parentId = props.treeItemKey;
      var { data } = await categoryApi.pageList(params);
      tableData.value = data.content;
      paginationTotal.value = data.totalElements;
    } finally {
      loading.value = false;
    }
  }
  watch(
    () => props.treeItemKey, 
    () => queryData());

  const columns = [
    {
      title: '分类编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '是否子类目',
      key: 'subFlag',
      dataIndex: 'subFlag',
    },
    {
      title: '状态',
      key: 'statusFlag',
      dataIndex: 'statusFlag',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  const selectedRowKeys = ref([]);
  const onSelectChange = (rowKeys: any) => {
    console.log('selectedRowKeys changed: ', rowKeys);
    selectedRowKeys.value = rowKeys;
  };
  
  function openDrawer(type?: string, id?: number) {
    emits('openDrawer', type, id);
  }

  // 禁用分类
  async function disableCategory(id: number) {
    await categoryApi.disableCategory(id);
    queryData();
  }

  // 删除分类
  async function deleteCategory(id: number) {
    await categoryApi.deleteCategory(id);
    queryData();
  }

  defineExpose({ queryData });
</script>
