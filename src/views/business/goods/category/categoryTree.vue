<template>
  <div>
    <a-card :segmented="{ content: true }" :bordered="false" size="small">
      <a-space size="small">
        <a-button type="primary" @click="showCreateModal">
          添加分类
          <template #icon>
            <FileAddOutlined />
          </template>
        </a-button>
        <a-button type="info" @click="packHandle">
          全部{{ expandedKeys.length ? '收起' : '展开' }}
          <template #icon>
            <AlignLeftOutlined />
          </template>
        </a-button>
      </a-space>
      <a-divider />
      <div class="w-full">
        <a-input type="input" v-model:value="pattern" placeholder="输入分类名称搜索">
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
              <template #title="{ value: val, title }">
                <a-popover placement="right">
                  <template #content>
                    <p @click="showCreateModal(val)">添加下级</p>
                    <p @click="showUpdateModal(val)">修改分类</p>
                    <p @click="onDelete(val)">删除分类</p>
                  </template>
                  {{ title }}
                </a-popover>
              </template>
            </a-tree>
          </template>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import categoryApi from '/@/api/system/category';

  const props = defineProps({
    loading: Boolean,
    treeData: {
      type: Array,
      default: () => [],
    },
  });
  const emits = defineEmits(['change', 'openDrawer', 'reloadTree']);

  let treeItemKey = ref([]);

  let expandedKeys = ref([]);

  const pattern = ref('');

  function showCreateModal(key: any) {
    if (key) {
      emits('openDrawer', 'add', key);
    } else if (treeItemKey.value.length > 0) {
      emits('openDrawer', 'add', treeItemKey.value[0]);
    }
  }

  function showUpdateModal(key: any) {
    emits('openDrawer', 'update', key);
  }

  function onDelete(id: any) {
    Modal.confirm({
      title: '提示',
      content: `您确定想删除此分类吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await categoryApi.deleteCategory(id);
        message.success('删除成功');
        emits('reloadTree');
      },
      onCancel: () => {
      },
    });
  }

  function selectedTree(keys: any) {
    if (keys.length) {
      emits('change', keys[0]);
    } else {
      emits('change', undefined);
    }
  }

  function onExpandedKeys(keys: any) {
    expandedKeys.value = keys;
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = unref(props.treeData).map((item: any) => item.key as string) as [];
    }
  }
</script>
