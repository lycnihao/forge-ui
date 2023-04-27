import type { ObjectDirective, DirectiveBinding } from "vue";
import { useUserStore } from "/@/store/modules/user";

/**
 * 判断是否存在权限
 * 可用于 v-if 显示逻辑
 * */
export function hasPermission(accesses: string[]): boolean {
  if (!accesses || !accesses.length) return true;
  return _somePermissions(accesses);
}

/**
 * 检查权限
 * @param accesses
 */
function _somePermissions(accesses: string[]) {
  return useUserStore().getPermissions.some((item) => {
    const { value }: any = item;
    return Array.of(accesses).filter((t) => t === value).length > 0;
  });
}

/**
 * 注册v-permission权限指令
 */
export const permission: ObjectDirective = {
  mounted(el: HTMLButtonElement, binding: DirectiveBinding<string[]>) {
    const { value, arg } = binding;
    const disabled = arg && arg === "disabled";

    if (hasPermission(value)) {
      return;
    }

    if (disabled && el) {
      el.disabled = true;
      el.style["disabled"] = "disabled";
      el.classList.add("a-button--disabled");
      return;
    }
    el?.remove?.();
  },
};
