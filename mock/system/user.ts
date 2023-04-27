export default [
  {
    url: "/user/login",
    timeout: 1000,
    method: "post",
    response: () => {
      return {
        success: true,
        errCode: null,
        level: null,
        errMessage: null,
        devMessage: null,
        data: {
          access_token: "0a7aaca279f6464194099a4124930b38",
          expired_in: 86400,
          refresh_token: "973e53ef385b41f8bc77d7977e3e0516",
        },
      };
    },
  },
  {
    url: "/user/logout",
    timeout: 2000,
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        type: "success",
      };
    },
  },
  {
    url: "/user/updatePassword",
    timeout: 2000,
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        type: "success",
      };
    },
  },
  {
    url: "/user/info",
    timeout: 1000,
    method: "get",
    response: () => {
      return {
        success: true,
        errCode: null,
        level: null,
        errMessage: null,
        devMessage: null,
        data: {
          userId: 1,
          username: "admin",
          nickname: "admin",
          email: "test@example.com",
          avatar: "",
          roles: null,
          roleIds: null,
          permissions: [
            {
              label: "删除权限",
              value: "system_permission_del",
            },
            {
              label: "菜单权限",
              value: "system_menu",
            },
            {
              label: "添加角色",
              value: "system_role_add",
            },
            {
              label: "角色列表",
              value: "system_role_list",
            },
            {
              label: "删除用户",
              value: "system_user_del",
            },
            {
              label: "修改权限",
              value: "system_permission_upd",
            },
            {
              label: "Dashboard",
              value: "dashboard",
            },
            {
              label: "用户管理",
              value: "system_user",
            },
            {
              label: "用户列表",
              value: "system_user_list",
            },
            {
              label: "修改角色",
              value: "system_role_upd",
            },
            {
              label: "修改用户",
              value: "system_user_upd",
            },
            {
              label: "权限管理",
              value: "auth",
            },
            {
              label: "删除角色",
              value: "system_role_del",
            },
            {
              label: "添加用户",
              value: "system_user_add",
            },
            {
              label: "添加权限",
              value: "system_permission_add",
            },
            {
              label: "角色管理",
              value: "system_role",
            },
            {
              label: "工作台",
              value: "dashboard_workplace",
            },
            {
              label: "系统管理",
              value: "system",
            },
          ],
        },
      };
    },
  },
];
