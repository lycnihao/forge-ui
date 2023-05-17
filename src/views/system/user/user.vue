<template>
  <div>
    <a-card>
      <a-form layout="inline">
        <a-form-item label="账号">
          <a-input
            placeholder="请输入账号"
            :style="{ width: '300px' }"
            v-model:value="params.username"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            placeholder="请输入邮箱"
            :style="{ width: '300px' }"
            v-model:value="params.email"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input placeholder="请输入手机号" :style="{ width: '300px' }" />
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
          添加用户
        </a-button>
        <a-button @click="handleBatchDel">
          <template #icon>
            <delete-outlined />
          </template>
          批量删除
        </a-button>
      </div>
      <a-table
        size="middle"
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
          <template v-else-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              v-permission:disabled="'system_user_upd'"
              @click="handleEdit(record)"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认重置密码吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleResPwd(record)"
            >
              <a-button
                type="link"
                size="small"
                v-permission:disabled="'system_user_res_password'"
              >
                重置密码
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              title="确认禁用吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDisabled(record)"
            >
              <a-button
                type="link"
                size="small"
                v-permission:disabled="'system_user_dis'"
              >
                禁用
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
      :title="addUserFlag ? '新增用户' : '编辑用户'"
      :width="502"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="closeModal"
    >
      <template #header> {{ addUserFlag ? "新增用户" : "编辑用户" }} </template>
      <template #footer>
        <a-button
          type="primary"
          :loading="formSubmitLoading"
          @click="confirmForm"
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
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="form.username"
              placeholder="输入用户名"
              :disabled="!addUserFlag"
            />
          </a-form-item>
          <a-form-item label="显示昵称" name="nickname">
            <a-input v-model:value="form.nickname" placeholder="输入昵称" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="form.email" placeholder="输入邮箱" />
          </a-form-item>
          <a-form-item :span="24" label="部门" name="departmentId">
            <a-tree-select
              :tree-data="treeData"
              v-model:value="form.departmentId"
              clearable
            />
          </a-form-item>
          <a-form-item label="角色" name="roleIds">
            <a-select
              v-model:value="form.roleIds"
              :options="roleOptions"
              mode="multiple"
              clearable
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>
    <UserPasswordDialog ref="userPasswordDialog" />
  </div>
</template>
<script lang="ts" setup name="system_user">
import { reactive, ref, onMounted } from "vue";
import { Modal, message } from "ant-design-vue";
import userApi from "/@/api/system/user";
import roleApi from "/@/api/system/role";
import deptApi from "/@/api/system/department";
import UserPasswordDialog from "./userPasswordDialog.vue";

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
  {
    title: "操作",
    key: "action",
  },
];
const params = reactive({
  page: 1,
  size: 10,
  username: "",
  email: "",
});
const total = ref(0);
let tableData = ref([]);
const loading = ref(false);
const queryData = async () => {
  try {
    loading.value = true;
    var { data } = await userApi.getUserList(params);
    tableData.value = data.content;
    total.value = data.totalElements;
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  queryData();
});

/**
 * 添加/编辑用户
 */
const showModal = ref(false);
function modalOpen() {
  showModal.value = true;
}
function modalClose() {
  showModal.value = true;
}

const loadModal = ref(false);
const addUserFlag = ref(false);
const formSubmitLoading = ref(false);
const defaultForm = {
  userId: undefined,
  username: "",
  nickname: "",
  email: "",
  description: "",
  status: "",
  roleIds: [],
  departmentId: undefined,
};

let form = reactive(Object.assign({}, defaultForm));

const rules = reactive({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
  email: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  roleIds: [
    {
      type: "array",
      required: true,
      message: "请选择角色",
      trigger: ["blur", "change"],
    },
  ],
});

const closeModal = () => {
  // 重置表单
  Object.assign(form, defaultForm);
  loadModal.value = false;
};

const treeData = ref([]);
async function loadDept() {
  loading.value = true;
  const { data } = await deptApi.tree();
  treeData.value = getTree(data);
  loading.value = false;
}
function getTree(dataList: any) {
  return dataList.map((item: any) => {
    const children = item.children ? getTree(item.children) : [];
    return {
      ...item,
      key: item.id,
      value: item.id,
      title: item.deptName,
      children: children,
      isLeaf: children.length == 0,
    };
  });
}

const roleOptions = ref([]);

async function handleAdd() {
  console.log("点击了新增");
  modalOpen();
  addUserFlag.value = true;
  const roles = await roleApi.getAllRoles();
  loadDept();
  roleOptions.value = roles.data.map(
    (r: any) => new Object({ label: r.name, value: r.id })
  );
}

async function handleEdit(record: any) {
  console.log("点击了编辑", record);
  modalOpen();
  loadModal.value = true;
  addUserFlag.value = false;
  const roles = await roleApi.getAllRoles();
  roleOptions.value = roles.data.map(
    (r: any) => new Object({ label: r.name, value: r.id })
  );
  loadDept();
  const { data } = await userApi.getUserInfoById(record.userId);
  Object.assign(form, data);
  loadModal.value = false;
}

const userPasswordDialog = ref();
async function handleResPwd(record: any) {
  console.log("点击了重置密码", record);
  const { data } = await userApi.resetPassword(record.userId);
  message.success("重置成功");
  userPasswordDialog.value.showModal(record.username, data);
}

async function handleDisabled(record: any) {
  console.log("点击了禁用", record);
  await userApi.disabledUserInfo(record.userId);
  message.success("禁用成功");
  queryData();
}

const selectedRowKeys = ref([]);
const onSelectChange = (rowKeys: any) => {
  console.log("selectedRowKeys changed: ", rowKeys);
  selectedRowKeys.value = rowKeys;
};
async function handleBatchDel() {
  Modal.confirm({
    title: "提示",
    content: "您确定要删除选中用户吗",
    okText: "确定",
    cancelText: "取消",
    onOk: async () => {
      console.log("点击了批量删除");
      await userApi.batchDeleteUser(selectedRowKeys.value);
      message.success("批量删除成功");
      queryData();
    },
    onCancel: () => {},
  });
}

const formRef: any = ref(null);
function confirmForm(e: any) {
  e.preventDefault();
  formSubmitLoading.value = true;
  try {
    formRef.value.validateFields().then(async () => {
      if (addUserFlag.value) {
        await userApi.addUserInfo(form);
      } else {
        await userApi.updateUserInfo(form);
      }
      message.success("保存成功");
      modalClose();
      queryData();
    });
  } finally {
    formSubmitLoading.value = false;
  }
}
</script>
