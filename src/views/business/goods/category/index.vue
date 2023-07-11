<template>
  <div>
    <a-row justify="space-between" :gutter="16">
      <a-col span="6">
        <CategoryTree :loading="loading" :treeData="treeData" @change="selectedTree" @openDrawer="openDrawer" @reloadTree="reloadTree" />
      </a-col>
      <a-col span="18">
        <SubCategoryList ref="subCategoryListRef" :treeItemKey="treeItemKey" @openDrawer="openDrawer" @reloadTree="reloadTree" />
      </a-col>
    </a-row>
    <CategoryDrawer ref="categoryDrawerRef" :operateFlag="operateFlag" :treeData="treeData" @refresh="reloadTree" />
  </div>
</template>
<script lang="ts" setup name="goods_category">
  import { ref } from 'vue';
  import CategoryTree from './categoryTree.vue';
  import SubCategoryList from './subCategoryList.vue';
  import CategoryDrawer from './categoryDrawer.vue';
  import categoryApi from '/@/api/system/category';
  import { onMounted } from 'vue';

  // 操作标识 add, update, delete
  let operateFlag = ref();
  let treeItemKey = ref();

  function selectedTree(key: any) {
    treeItemKey.value = key;
    console.log(key);
  }

  const categoryDrawerRef = ref();
  function openDrawer(type: any, key: any) {
    operateFlag.value = type;
    categoryDrawerRef.value.showDrawer(type, key);
  }

  const treeData = ref([]);
  const loading = ref(false);
  async function loadCategroryTree() {
    console.log('loadCategrory');
    loading.value = true;
    const { data } = await categoryApi.tree();
    treeData.value = getTree(data);
    loading.value = false;
  }

  function reloadTree() {
    loadCategroryTree();
  }
  const subCategoryListRef = ref();
  function reloadCategrory() {
    subCategoryListRef.value.queryData();
  }

  function getTree(dataList: any) {
    return dataList.map((item: any) => {
      const children = item.children ? getTree(item.children) : [];
      return {
        ...item,
        key: item.id,
        value: item.id,
        title: item.name,
        children: children,
        isLeaf: children.length == 0,
      };
    });
  }

  onMounted(async () => {
    reloadTree();
    reloadCategrory();
  });
</script>
