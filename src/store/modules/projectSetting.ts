import { defineStore } from "pinia";
import projectSetting from "/@/settings/projectSetting";
import { storage } from "/@/utils/storage";
import { PROJECT_SETTING } from "/@/store/mutation-types";

let state: any = { ...projectSetting };

const appConfigStr = storage.get(PROJECT_SETTING);
if (appConfigStr) {
  state = JSON.parse(appConfigStr);
}

export const useProjectSettingStore = defineStore({
  id: "projectSetting",
  state: () => ({
    ...state,
  }),
  actions: {
    reset(): void {
      let key: keyof any;
      for (key in projectSetting) {
        this.$state[key] = projectSetting[key as keyof typeof projectSetting];
      }
    },
  },
});
