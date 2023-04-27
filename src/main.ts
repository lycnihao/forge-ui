import "/@/styles/tailwind.css";
import * as antIcons from "@ant-design/icons-vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createApp } from "vue";
import App from "./App.vue";
import "/@/styles/index.less";
import router, { setupRouter } from "/@/router/index";
import { setupStore } from "/@/store";
import { permission } from "/@/utils/permission";
import "nprogress/nprogress.css";
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";

async function bootstrap() {
  const app = createApp(App);

  app.use(Antd);
  app.use(router);
  app.use(JsonViewer);

  // 注册图标组件
  const icons: any = antIcons;
  Object.keys(icons).forEach((key) => {
    app.component(key, icons[key]);
  });

  // 挂载状态管理
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载APP实例
  await router.isReady();

  // 注册全局自定义指令，如：v-permission权限指令
  app.directive("permission", permission);

  app.mount("#app");
}

void bootstrap();
