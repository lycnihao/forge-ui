import type { UserConfig, ConfigEnv } from "vite";
import { loadEnv } from "vite";
import { resolve } from "path";
import { createVitePlugins } from "./vite/plugins";

const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  console.log("mode:", mode);
  console.log("command:", command);
  console.log("env:", env);
  const VITE_PORT = Number(env.VITE_PORT);
  const VITE_API_URL = env.VITE_API_URL;
  const isBuild = command === "build";
  return {
    resolve: {
      // 绝对路径重命名：/@/xxxx => src/xxxx
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve("src") + "/",
        },
        {
          find: /^~/,
          replacement: "",
        },
      ],
    },
    // 服务端渲染
    server: {
      host: "0.0.0.0",
      port: VITE_PORT,
      proxy: {
        "/api": {
          target: VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              "src/styles/index.less"
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 3000,
    },
    plugins: createVitePlugins(env, isBuild),
  };
};
