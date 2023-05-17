<template>
  <div>
    <a-card>
      <a-form layout="inline">
        <a-form-item label="角色名">
          <a-input
            placeholder="请输入角色名称"
            :style="{ width: '300px' }"
            v-model:value="params.name"
          />
        </a-form-item>
        <a-button type="primary" @click="queryData()" class="mr-2">
          查询
        </a-button>
        <a-button type="info"> 重置 </a-button>
      </a-form>
      <div class="table-operations">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined />
          </template>
          添加角色
        </a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              v-permission:disabled="'system_role_upd'"
              @click="handleEdit(record)"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-button
                type="link"
                size="small"
                v-permission:disabled="'system_role_del'"
              >
                删除
              </a-button>
            </a-popconfirm>
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
    <a-drawer
      placement="right"
      v-model:visible="showModal"
      :title="addRoleFlag ? '新增角色' : '编辑角色'"
      :width="502"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="closeModal"
    >
      <template #header> {{ addRoleFlag ? "新增角色" : "编辑角色" }} </template>
      <template #footer>
        <a-button type="primary" :loading="formBtnLoading" @click="confirmForm"
          >提交</a-button
        >&nbsp;
        <a-button>重置</a-button>
      </template>
      <a-spin :spinning="loadModal">
        <a-form
          ref="formRef"
          label-placement="left"
          :label-col="{ span: 4 }"
          :model="form"
          :rules="rules"
        >
          <a-form-item label="角色编码" name="code">
            <a-input
              v-model:value="form.code"
              placeholder="输入角色编码"
              :disabled="!addRoleFlag"
            />
          </a-form-item>
          <a-form-item label="角色名称" name="name">
            <a-input v-model:value="form.name" placeholder="输入角色名" />
          </a-form-item>
          <a-form-item label="角色权限">
            <a-card>
              <a-tree
                checkable
                :virtual="true"
                :checkStrictly="false"
                :tree-data="treeData"
                @check="onCheck"
                v-model:checkedKeys="checkedKeys"
                v-model:expandedKeys="expandedKeys"
                style="max-height: 650px; overflow: hidden"
              />
            </a-card>
          </a-form-item>
          <a-form-item label="备注">
            <a-input
              v-model:value="form.description"
              type="textarea"
              placeholder="请输入备注"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup name="system_role">
import { unref, reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import roleApi from "/@/api/system/role";
import permissionApi from "/@/api/system/permission";

const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "角色编码",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "操作",
    key: "action",
  },
];
const rules = {
  name: { required: true, message: "请输入角色名称", trigger: "blur" },
};

const loading = ref(false);
const total = ref(0);
const params = reactive({
  page: 1,
  size: 10,
  name: "",
});
let tableData = ref([]);
const queryData = async () => {
  try {
    loading.value = true;
    let _params = {
      ...unref(params),
    };
    const { data } = await roleApi.getRoleList(_params);
    tableData.value = data.content;
    total.value = data.totalElements;
  } finally {
    loading.value = false;
  }
};

const allPermissions = ref([] as any);
onMounted(async () => {
  // 加载表格
  queryData();
  // 加载权限树
  const { data } = await permissionApi.getAllPermission();
  allPermissions.value = data;
});

const showModal = ref(false);
const loadModal = ref(false);
const addRoleFlag = ref(false);
const formBtnLoading = ref(false);
const formRef: any = ref(null);
let expandedKeys = ref([]);
let checkedKeys = ref([]);
// 包含选中与半选中
let checkedAllKeys = ref([] as any);
let treeData = ref([] as any);

const defaultForm = {
  id: undefined,
  name: "",
  code: "",
  description: "",
  permissions: [],
};
let form = reactive(Object.assign({}, defaultForm));
const resetForm = () => {
  Object.assign(form, defaultForm);
  treeData.value = getTreePermissions(allPermissions.value, []);
};

const closeModal = () => {
  // 重置表单
  resetForm();
  loadModal.value = false;
  checkedKeys.value = [];
  expandedKeys.value = [];
  treeData.value = [];
};

async function handleAdd() {
  console.log("点击了新增");
  showModal.value = true;
  addRoleFlag.value = true;
  // 重置表单
  resetForm();
}

async function handleEdit(record: any) {
  console.log("点击了编辑", record);
  showModal.value = true;
  loadModal.value = true;
  addRoleFlag.value = false;
  const { data } = await roleApi.getRoleInfo(record.id);
  Object.assign(form, data);
  treeData.value = getTreePermissions(allPermissions.value, data.permissions);
  loadModal.value = false;
}

async function handleDelete(record: any) {
  console.log("点击了删除", record);
  await roleApi.deleteRoleInfo(record.id);
  message.success("删除成功");
  queryData();
}

function confirmForm(e: any) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validateFields().then(async () => {
    try {
      form.permissions = checkedAllKeys.value;
      if (addRoleFlag.value) {
        await roleApi.addRoleInfo(form);
      } else {
        await roleApi.updateRoleInfo(form);
      }
      message.success("保存成功");
      showModal.value = false;
      queryData();
    } finally {
      formBtnLoading.value = false;
    }
  });
}

function getTreePermissions(permissions: any, checkedPermissions: any) {
  return permissions.map((item: any) => {
    const children = item.children
      ? getTreePermissions(item.children, checkedPermissions)
      : [];
    if (checkedPermissions.indexOf(item.name) >= 0 && children.length == 0) {
      checkedKeys.value.push(item.name as never);
    }
    return {
      key: item.name,
      title: item.title,
      children: children,
      isLeaf: children.length == 0,
    };
  });
}

function onCheck(_checkedKeysValue: any, e: any) {
  const checkedNodes = e.checkedNodes.map((node: any) => node.key);
  const halfCheckedKeys = e.halfCheckedKeys;
  console.log(checkedNodes);
  console.log(halfCheckedKeys);
  checkedAllKeys.value = [...checkedNodes, ...halfCheckedKeys];
}
</script>
