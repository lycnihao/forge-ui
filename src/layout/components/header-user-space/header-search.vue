<template>
  <a-button type="text" @click="showModal">
    <template #icon>
      <search-outlined :style="{ fontSize: '18px' }" />
    </template>
  </a-button>
  <a-modal
    :open="show"
    :footer="null"
    :closable="false"
    @cancel="cancelModal"
    :bodyStyle="{ 'max-height': 300, 'overflow-y': 'auto' }"
  >
    <div class="search-input">
      <a-input
        placeholder="请输入关键词搜索"
        enter-button="搜索"
        size="large"
        v-model:value="searchText"
        @keyup.up="onUp"
        @keyup.down="onDown"
        @input="search"
        @keyup.enter="enter"
      >
        <template #prefix>
          <search-outlined />
        </template>
      </a-input>
    </div>
    <div class="search-content">
      <a-list
        item-layout="horizontal"
        :data-source="data"
        v-if="data.length > 0"
      >
        <template #renderItem="{ index, item }">
          <a-list-item
            :class="
              'search-item cursor-pointer' +
              (keyIndex == index ? ' search-item-active' : '')
            "
            @click="go(item.path)"
          >
            <a-list-item-meta>
              <template #title>
                <span class="search-item-title text-gray-900">
                  {{ item.title }}
                </span>
              </template>
              <template #description>
                <span class="search-item-description text-gray-600">
                  {{ item.description }}
                </span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <div class="no-data" v-else>
        <span>暂无搜索结果</span>
      </div>
    </div>
    <div class="search-footer" style="display: flex; justify-content: flex-end">
      <span class="text-gray-600">选择</span>
      <kbd class="text-gray-600">↑</kbd>
      <kbd class="text-gray-600">↓</kbd>
      <span class="text-gray-600">确认</span>
      <kbd class="text-gray-600">Enter</kbd>
      <span class="text-gray-600">关闭</span>
      <kbd class="text-gray-600">Esc</kbd>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PageEnum } from "/@/enums/pageEnum";
const show = ref(false);
const data = ref<any>([]);
function showModal() {
  show.value = true;
}
function cancelModal() {
  show.value = false;
  keyIndex.value = -1;
  searchText.value = "";
  data.value = [];
}

var searchData = ref<any>([]);
for (let i = 0; i < 1; i++) {
  searchData.value.push({
    title: "标题信息",
    description: "描述信息",
    path: PageEnum.BASE_HOME,
  });
}
const searchText = ref<string>("");
let keyIndex = ref(-1);
function onUp() {
  keyIndex.value > 0 && keyIndex.value--;
  console.log(keyIndex.value);
}
function onDown() {
  keyIndex.value < data.value.length - 1 && keyIndex.value++;
  console.log(keyIndex.value);
}
function search(event: any) {
  console.log(event.target.value);
  keyIndex.value = -1;
  data.value = searchData.value.filter((data: any) =>
    data.title.startsWith(event.target.value)
  );
}
function enter() {
  if (keyIndex.value > -1) {
    go(data.value[keyIndex.value].path);
  }
}

const router = useRouter();
function go(path: string) {
  console.log("go:", path);
  router.replace(path);
  cancelModal();
}
</script>

<style lang="less" scoped>
.no-data {
  display: flex;
  justify-content: center;
  font-size: 0.9em;
  margin: 0 auto;
  padding: 36px 0;
  text-align: center;
  width: 80%;
}
.search-content {
  margin-top: 10px;
}
.search-footer span {
  margin-left: 18px;
  margin-right: 4px;
}
kbd {
  display: inline-table;
  font-size: 10px;
  text-align: center;
  padding: 0.125rem 0.228rem;
  border-width: 1px;
  width: 1.25rem;
  margin-right: 0.25rem;
  box-shadow: 1px 1px #cbcdd0;
  border: 1px solid rgb(217 227 238 / 75%);
  border-radius: 4px;
}
.cursor-pointer {
  cursor: pointer;
}

.search-item {
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 10px;
  &-title {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  &-description {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  &:hover,
  &-active {
    background-color: fade(#000, 5%);
  }
}
</style>
