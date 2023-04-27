import { VAxios } from "./axios";

function createAxios() {
  return new VAxios({
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
}

export const http = createAxios();
