<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-table
          rowKey="code"
          :row-selection="{
            getCheckboxProps: getCheckboxProps,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columns"
          :data-source="attributeData"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'formType'">
              <template v-if="record.formType == 1">单选框</template>
              <template v-if="record.formType == 2">复选框</template>
              <template v-if="record.formType == 3">文本框</template>
              <template v-if="record.formType == 4">下拉框</template>
            </template>
            <template v-else-if="column.key === 'action' && !defaultCodes.includes(record.code)">
              <a-space size="middle">
                <a-button type="link" size="small" @click="showModal('update', index)"> 编辑 </a-button>
                <a-popconfirm title="确认删除吗?" ok-text="确认" cancel-text="取消" @confirm="() => {}">
                  <a-button type="link" size="small"> 删除 </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-modal :open="show" :confirm-loading="loading" :title="modalTitle" ok-text="确认" cancel-text="取消" @ok="modalSubmit" @cancel="cancelModal">
      <a-form :model="form" ref="formRef" label-placement="left" class="py-4" :label-col="{ span: 5 }">
        <h1>基本信息</h1>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="属性名称" name="name" :rule="rules.name">
              <a-input :placeholder="`属性名称`" v-model:value="form.name" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="属性编码" name="code" :rule="rules.code">
              <a-input :placeholder="`属性编码`" v-model:value="form.code" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="展示方式" name="code">
              <a-select v-model:value="form.formType" :options="formTypeOptions" clearable />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="remark">
              <a-textarea v-model:value="form.remark" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider />
        <div class="flex flex-row">
          <h1 class="mr-2">信息内容</h1>
          <a-button type="primary" size="small" class="mr-2">删除</a-button>
          <a-button type="primary" size="small" @click="addItem">添加</a-button>
        </div>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-table :columns="valueColumns" :dataSource="dataSource">
              <template #bodyCell="{ column, text, record }">
                <template v-if="['values'].includes(column.dataIndex)">
                  <div>
                    <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0" />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <div class="editable-row-operations">
                    <span v-if="editableData[record.key]" class="flex justify-around">
                      <a-typography-link @click="save(record.key)">保存</a-typography-link>
                      <a-popconfirm title="确定取消吗？" @confirm="cancel(record.key)">
                        <a>取消</a>
                      </a-popconfirm>
                    </span>
                    <span v-else class="flex justify-around">
                      <a @click="edit(record.key)">编辑</a>
                      <a-popconfirm title="确定删除吗？" @confirm="delItem(record.key)">
                        <a>删除</a>
                      </a-popconfirm>
                    </span>
                  </div>
                </template>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  import defaultCategory from './categoryData';
  const props = defineProps({
    attributeList: {
      type: Array,
      default: () => [],
    },
  });

  const columns = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '属性编码',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: '表单方式',
      key: 'formType',
      dataIndex: 'formType',
    },
    {
      title: '属性值',
      key: 'attributeValues',
      dataIndex: 'attributeValues',
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
  let attributeData: Ref<any[]> = ref([]);
  attributeData.value = Object.assign([], defaultCategory);
  watch(
    () => props.attributeList,
    (values) => {
      attributeData.value = Object.assign([], defaultCategory);
      values.forEach((item: any) => {
        attributeData.value.push(item);
      });
    },
    { immediate: true }
  );

  const defaultCodes = defaultCategory.map((item: any) => {
    return item.code;
  });
  const getCheckboxProps = (record: any) => ({
    disabled: defaultCodes.includes(record.code),
  });
  const selectedRowKeys = ref([]);
  const onSelectChange = (rowKeys: any) => {
    console.log('selectedRowKeys changed: ', rowKeys);
    selectedRowKeys.value = rowKeys;
  };

  const updateIndex: Ref<number | undefined> = ref(undefined);
  const show = ref(false);
  function showModal(type: any, index: number) {
    show.value = true;
    operateType.value = type;
    if (type === 'update') {
      form = reactive({ ...attributeData.value[index] });
      dataSource.value = attributeData.value[index].attributeValues;
      updateIndex.value = index;
    } else {
      updateIndex.value = undefined;
    }
  }
  function cancelModal() {
    show.value = false;
    resetForm();
  }

  const loading = ref(false);
  const formRef = ref();

  let form = reactive({
    id: undefined,
    name: undefined,
    code: undefined,
    formType: 1,
    remark: undefined,
  });
  const formTypeOptions = [
    { label: '单选框', value: 1 },
    { label: '复选框', value: 2 },
    { label: '文本框', value: 3 },
    { label: '下拉框', value: 4 },
  ];
  const rules = {
    name: { required: true, message: '请输入属性名称', trigger: 'blur' },
    code: { required: true, message: '请输入属性代码', trigger: 'blur' },
  };
  function resetForm() {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    form.id = undefined;
    dataSource.value = [];
  }

  const valueColumns = [
    {
      title: '属性值',
      key: 'values',
      dataIndex: 'values',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
    },
  ];

  interface Attribute {
    key: string;
    values: string;
  }

  const dataSource: Ref<Attribute[]> = ref([]);

  const editableData: UnwrapRef<Record<string, any>> = reactive({});

  const addItem = () => {
    var item = add();
    edit(item.key);
  };

  const delItem = (key: string) => {
    console.log(key);
    dataSource.value = reactive(dataSource.value.filter((item) => key !== item.key));
  };

  const add = () => {
    var key = Math.random().toString(36);
    const item = {
      key: key,
      values: '',
    };
    dataSource.value.push(item);
    return item;
  };

  const edit = (key: string) => {
    editableData[key] = Object.assign({}, dataSource.value.filter((item) => key === item.key)[0]);
  };
  const save = (key: string) => {
    Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };
  const cancel = (key: string) => {
    delete editableData[key];
  };

  const submitLoading = ref(false);
  const operateType = ref('add');
  const modalTitle = ref('添加属性');
  function modalSubmit() {
    formRef.value.validateFields().then(async () => {
      submitLoading.value = true;
      try {
        if (operateType.value === 'add') {
          attributeData.value.push({
            name: form.name,
            code: form.code,
            formType: form.formType,
            remark: form.remark,
            attributeValues: dataSource.value,
          });
        } else {
          if (updateIndex.value) {
            attributeData.value[updateIndex.value] = {
              name: form.name,
              code: form.code,
              formType: form.formType,
              remark: form.remark,
              attributeValues: dataSource.value,
            };
          }
        }
      } finally {
        cancelModal();
        submitLoading.value = false;
      }
    });
  }

  function attributes() {
    return attributeData.value
      .filter((item) => !defaultCodes.includes(item.code))
      .map((item) => {
        return {
          ...item,
          values: item.attributeValues?.map((value: any) => value.values),
        };
      });
  }

  defineExpose({ attributes, showModal });
</script>
