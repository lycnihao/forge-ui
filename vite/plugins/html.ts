/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { createHtmlPlugin } from "vite-plugin-html";
export function configHtmlPlugin(
  env: Record<string, string>,
  isBuild: boolean
) {
  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: env.VITE_GLOB_APP_TITLE,
      },
    },
  });
}
