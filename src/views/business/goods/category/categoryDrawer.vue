<template>
  <div>
    <a-drawer v-model:open="isDrawer" :title="drawerTitle" width="800">
      <a-spin :spinning="drawerLoading">
        <a-form :model="formParams" ref="formRef" label-placement="left" class="py-4" :label-col="{ span: 4 }">
          <h1>基本信息</h1>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="上级分类" name="parentId">
                <a-tree-select :tree-data="treeData" v-model:value="formParams.parentId" clearable />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label-col="{ offset: 4 }" label="分类编码" name="name" :rule="rules.name">
                <a-input :placeholder="`分类编码`" v-model:value="formParams.name" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label-col="{ offset: 4 }" label="分类名称" name="code" :rule="rules.code">
                <a-input :placeholder="`分类名称`" v-model:value="formParams.code" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注" name="remark">
                <a-textarea v-model:value="formParams.remark" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="显示排序" name="sort">
                <a-input-number v-model:value="formParams.sort" clearable />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label-col="{ offset: 4 }" label="是否子类目" name="subFlag">
                <a-switch v-model:checked="formParams.subFlag" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label-col="{ offset: 4 }" label="是否启用" name="statusFlag">
                <a-switch v-model:checked="formParams.statusFlag" />
              </a-form-item>
            </a-col>
          </a-row>
          <template v-if="formParams.subFlag">
            <a-divider />
            <div class="flex flex-row">
              <h1 class="mr-2">属性</h1>
              <a-button type="primary" size="small" class="mr-2">删除</a-button>
              <a-button type="primary" size="small" @click="showCategoryAttributeModal('add')">添加属性</a-button>
            </div>
            <CategoryAttribute ref="categoryAttributeModalRef" :attributeList="attributeList" @attributeSubmit="attributeSubmit" />
          </template>
        </a-form>
      </a-spin>
      <template #footer>
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="drawerSubmit">提交</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import categoryApi from '/@/api/system/category';
  import CategoryAttribute from './categoryAttribute.vue';

  const emits = defineEmits(['refresh']);

  defineProps({
    treeData: {
      type: Array,
      default: () => [],
    },
  });

  const isDrawer = ref(false);
  const operateType = ref('add');
  const treeItemKey = ref();
  const drawerTitle = ref('添加分类');
  const attributeList = ref([]);
  async function showDrawer(type: any, key: any) {
    operateType.value = type;
    treeItemKey.value = key;
    isDrawer.value = true;
    console.log(operateType.value);
    console.log(treeItemKey.value);
    if (operateType.value === 'add') {
      drawerTitle.value = '添加分类';
      resetForm();
      if (treeItemKey.value) {
        formParams.parentId = treeItemKey.value;
      }
    } else if (operateType.value === 'update') {
      drawerTitle.value = '修改分类';
      drawerLoading.value = true;
      const { data } = await categoryApi.getCategoryById(treeItemKey.value);
      drawerLoading.value = false;
      attributeList.value = data.attributeList;
      attributeList.value.forEach((item: any) => {
        console.log(item.attributeValueList)
        if (item.attributeValueList) {
          item.attributeValues = item.attributeValueList.map((item: any) => {
          return {
            key: item.id,
            values: item.value
          }
        });
        } else {
          item.attributeValues = [];
        }
      });
      Object.assign(formParams, data);
    }
  }
  function closeDrawer() {
    isDrawer.value = false;
  }

  const drawerLoading = ref(false);
  const formRef = ref();
  const rules = {
    name: { required: true, message: '请输入部门名称', trigger: 'blur' },
    code: { required: true, message: '请输入部门编码', trigger: 'blur' },
  };
  let formParams = reactive({
    id: undefined,
    parentId: undefined,
    name: undefined,
    code: undefined,
    sort: undefined,
    subFlag: false,
    statusFlag: true,
    remark: undefined,
    categoryAttribute: [],
  });

  const submitLoading = ref(false);
  function drawerSubmit() {
    formRef.value.validateFields().then(async () => {
      submitLoading.value = true;
      try {
        formParams.categoryAttribute = categoryAttributeModalRef.value.attributes();
        if (operateType.value == 'add') {
          await categoryApi.addCategory(formParams);
        }
        if (operateType.value == 'update') {
          await categoryApi.updateCategory(formParams);
        }
      } finally {
        closeDrawer();
        emits('refresh');
        submitLoading.value = false;
      }
    });
  }

  function resetForm() {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    formParams.id = undefined;
  }

  const categoryAttributeModalRef = ref();
  function showCategoryAttributeModal(type: any) {
    console.log(type);
    categoryAttributeModalRef.value.showModal(type);
  }

  function attributeSubmit(record: any) {
    console.log('attributeSubmit', record);
  }

  defineExpose({ showDrawer, closeDrawer });
</script>
