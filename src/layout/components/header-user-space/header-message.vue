<template>
  <a-dropdown trigger="click" v-model:open="show">
    <a-button type="text" @click="fetchMessage">
      <template #icon>
        <a-badge dot>
          <BellOutlined :style="{ fontSize: '18px' }" />
        </a-badge>
      </template>
    </a-button>
    <template #overlay>
      <div>
        <a-spin :spinning="loading">
          <a-tabs
            class="dropdown-tabs"
            centered
            :tabBarStyle="{ textAlign: 'center' }"
            style="width: 300px"
          >
            <a-tab-pane tab="通知" key="1">
              <a-list class="tab-pane" size="small">
                <a-list-item>
                  <a-list-item-meta description="n天前">
                    <template #title>
                      <a href="#">您有新的饿了么订单请查收</a>
                    </template>
                    <template #avatar>
                      <a-avatar />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
              <div class="bottom-bar">
                <div>一键已读</div>
                <div>查看更多</div>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="消息" key="2">
              <a-list class="tab-pane" :locale="{ emptyText: '暂无数据' }" />
            </a-tab-pane>
            <a-tab-pane tab="待办" key="3">
              <a-list class="tab-pane" :locale="{ emptyText: '暂无数据' }" />
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BellOutlined } from "@ant-design/icons-vue";

defineExpose({ showMessage });

function showMessage() {
  show.value = true;
}

const loading = ref(false);
const show = ref(false);

const fetchMessage = () => {
  if (loading.value) {
    loading.value = false;
    return;
  }
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 700);
};
</script>

<style lang="less">
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }

  .notice-badge {
    color: inherit;
  }
}

.dropdown-tabs {
  background-color: #fff;
  box-shadow: 0 2px 8px #00000026;
  border-radius: 4px;
}
.bottom-bar {
  height: 46px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 46px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
  transition: all 0.3s;
}
.bottom-bar div {
  display: inline-block;
  width: 50%;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}
</style>
