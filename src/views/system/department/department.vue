<template>
  <div>
    <a-card :segmented="{ content: true }" :bordered="false" size="small">
      <template v-if="props.showMenu">
        <a-space size="small">
          <a-button type="primary" @click="showCreateModal">
            添加部门
            <template #icon>
              <FileAddOutlined />
            </template>
          </a-button>
          <a-button type="info" @click="packHandle">
            全部{{ expandedKeys.length ? "收起" : "展开" }}
            <template #icon>
              <AlignLeftOutlined />
            </template>
          </a-button>
        </a-space>
        <a-divider />
      </template>
      <div class="w-full">
        <a-input
          type="input"
          v-model:value="pattern"
          placeholder="输入部门名称搜索"
          v-if="props.showMenu"
        >
          <template #suffix>
            <a-icon size="18" class="cursor-pointer">
              <SearchOutlined />
            </a-icon>
          </template>
        </a-input>
        <div class="py-3">
          <template v-if="loading">
            <div class="flex items-center justify-center py-4">
              <a-spin size="medium" />
            </div>
          </template>
          <template v-else>
            <a-tree
              :virtual="true"
              :pattern="pattern"
              :tree-data="treeData"
              :expandedKeys="expandedKeys"
              style="max-height: 650px; overflow: hidden"
              @update:selected-keys="selectedTree"
              @update:expanded-keys="onExpandedKeys"
            >
              <template #title="{ value: val, title }" v-if="props.showMenu">
                <a-popover placement="right">
                  <template #content>
                    <p @click="showCreateModal(val)">添加下级</p>
                    <p @click="showUpdateModal(val)">修改部门</p>
                    <p @click="onDelete(val)">删除部门</p>
                  </template>
                  {{ title }}
                </a-popover>
              </template>
            </a-tree>
          </template>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model:visible="isDrawer"
      :confirm-loading="drawerLoading"
      title="添加部门"
      ok-text="确认"
      cancel-text="取消"
      @ok="drawerSubmit"
      @cancel="cancelModal"
    >
      <DeptForm
        ref="deptFormRef"
        :form="formParams"
        :addFlag="true"
        :treeData="treeData"
        :submitOk="reloadTree"
      />
    </a-modal>
  </div>
</template>
<script lang="ts" setup name="system_department">
import { ref, unref, reactive, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import deptApi from "/@/api/system/department";
import { getTreeItem } from "/@/utils/tree";
import DeptForm from "./departmentForm.vue";

const props = defineProps({
  showMenu: Boolean,
});

const emits = defineEmits(["change"]);

const deptFormRef = ref();

let treeItemKey = ref([]);

let expandedKeys = ref([]);

const treeData = ref([]);

const loading = ref(true);
const isDrawer = ref(false);
const treeItemTitle = ref("");
const pattern = ref("");

const defaultForm = {
  id: undefined,
  parentId: undefined,
  deptName: "",
  sort: 1,
};
let formParams = reactive({
  id: undefined,
  parentId: undefined,
  deptName: undefined,
  sort: undefined,
});
Object.assign(formParams, defaultForm);

function showCreateModal(parentId: any) {
  isDrawer.value = true;
  resetForm();
  if (treeItemKey.value.length > 0) {
    console.log("key" + treeItemKey.value[0]);
    formParams.parentId = treeItemKey.value[0];
  }
  if (parentId) {
    formParams.parentId = parentId;
  }
}

function showUpdateModal(key: any) {
  isDrawer.value = true;
  const treeItem = getTreeItem(unref(treeData), key);
  treeItemTitle.value = treeItem.title;
  Object.assign(formParams, treeItem);
}

function cancelModal() {
  isDrawer.value = false;
}

function resetForm() {
  Object.assign(formParams, defaultForm);
}

function selectedTree(keys: any) {
  if (keys.length) {
    const treeItem = getTreeItem(unref(treeData), keys[0]);
    treeItemKey.value = keys;
    treeItemTitle.value = treeItem.title;
    Object.assign(formParams, treeItem);
    emits("change", keys[0]);
  } else {
    treeItemKey.value = [];
    treeItemTitle.value = "";
    emits("change", undefined);
  }
}

const drawerLoading = ref(false);
function drawerSubmit() {
  drawerLoading.value = true;
  const { formSubmit } = deptFormRef.value;
  formSubmit();
  drawerLoading.value = false;
  isDrawer.value = false;
}

function onDelete(deptId: any) {
  Modal.info({
    title: "提示",
    content: `您确定想删除此部门吗?`,
    okText: "确定",
    cancelText: "取消",
    onOk: async () => {
      await deptApi.deleteDept(deptId);
      message.success("删除成功");
      loadDept();
    },
    onCancel: () => {
      message.error("已取消");
    },
  });
}

function onExpandedKeys(keys: any) {
  expandedKeys.value = keys;
}

function packHandle() {
  if (expandedKeys.value.length) {
    expandedKeys.value = [];
  } else {
    expandedKeys.value = unref(treeData).map(
      (item: any) => item.key as string
    ) as [];
  }
}

async function loadDept() {
  console.log("loadDept");
  loading.value = true;
  const { data } = await deptApi.tree();
  treeData.value = getTree(data);
  loading.value = false;
}

onMounted(async () => {
  loadDept();
});

function reloadTree() {
  treeItemTitle.value = "";
  loadDept();
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
</script>
