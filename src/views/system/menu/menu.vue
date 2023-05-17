<template>
  <div>
    <a-row justify="space-between" :gutter="16">
      <a-col span="6">
        <a-card :segmented="{ content: true }" :bordered="false" size="small">
          <a-space size="small">
            <a-button type="primary" @click="openCreateDrawer">
              添加菜单
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
          <div class="w-full menu">
            <a-input
              type="input"
              v-model:value="pattern"
              placeholder="输入菜单名称搜索"
            >
              <template #suffix>
                <a-icon size="18" class="cursor-pointer">
                  <SearchOutlined />
                </a-icon>
              </template>
            </a-input>
            <div class="py-3 menu-list">
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
                />
              </template>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col span="18">
        <a-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <a-space>
              <a-icon size="18">
                <FormOutlined />
              </a-icon>
              <span
                >编辑菜单{{ treeItemTitle ? `：${treeItemTitle}` : "" }}</span
              >
            </a-space>
          </template>
          <MenuForm
            ref="menuFormRef"
            v-if="isEditMenu"
            :form="formParams"
            :treeData="treeData"
            :addFlag="false"
            :submitOk="reloadTree"
          />
          <div v-else>
            <h1 class="font-medium text-lg pt-2 pl-2">
              请选择右侧需要更改的菜单
            </h1>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      v-model:visible="isDrawer"
      width="650"
      placement="right"
      title="添加菜单"
    >
      <MenuForm
        ref="menuFormRef"
        :form="formParams"
        :addFlag="true"
        :treeData="treeData"
        :submitOk="reloadTree"
      />
      <template #footer>
        <a-space>
          <a-button
            type="primary"
            :loading="drawerLoading"
            @click="drawerSubmit"
            >提交</a-button
          >
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup name="system_menu">
import { ref, unref, reactive, onMounted } from "vue";
import permissionApi from "/@/api/system/permission";
import { getTreeItem } from "/@/utils/tree";
import MenuForm from "./menuForm.vue";

const menuFormRef = ref();

let treeItemKey = ref([]);

let expandedKeys = ref([]);

const treeData = ref([]);

const loading = ref(true);
const isEditMenu = ref(false);
const isDrawer = ref(false);
const treeItemTitle = ref("");
const pattern = ref("");

const defaultForm = {
  id: undefined,
  parentKey: "",
  parentId: "",
  type: 1,
  name: "",
  title: "",
  icon: "",
  path: "",
  redirect: "",
  component: "",
  sort: 1,
  keepAlive: true,
};
const formParams = reactive({
  parentKey: "",
});
Object.assign(formParams, defaultForm);

function openCreateDrawer() {
  isEditMenu.value = false;
  isDrawer.value = true;
  resetForm();
  if (treeItemKey.value.length > 0) {
    console.log("key" + treeItemKey.value[0]);
    formParams.parentKey = treeItemKey.value[0];
  }
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
    isEditMenu.value = true;
  } else {
    isEditMenu.value = false;
    treeItemKey.value = [];
    treeItemTitle.value = "";
  }
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

const drawerLoading = ref(false);
function drawerSubmit() {
  drawerLoading.value = true;
  const { formSubmit } = menuFormRef.value;
  formSubmit();
  drawerLoading.value = false;
  isDrawer.value = false;
}

async function loadPermission() {
  console.log("loadPermission");
  loading.value = true;
  const { data } = await permissionApi.getAllPermission();
  treeData.value = getTreePermissions(data);
  loading.value = false;
}

onMounted(async () => {
  loadPermission();
});

function reloadTree() {
  if (drawerLoading.value) {
    drawerLoading.value = false;
  }
  isEditMenu.value = false;
  treeItemTitle.value = "";
  loadPermission();
}

function getTreePermissions(permissions: any) {
  return permissions.map((item: any) => {
    const children = item.children ? getTreePermissions(item.children) : [];
    return {
      ...item,
      key: item.name,
      value: item.name,
      title: item.title,
      children: children,
      isLeaf: children.length == 0,
      parentKey: item.parentName,
    };
  });
}
</script>
