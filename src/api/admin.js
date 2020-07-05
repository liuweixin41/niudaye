//获取管理员个人信息

/*
帐号请求的封装都可以在这里

*/

import req from "@/utils/request";
//获取个人信息
export function getAdminInfo() {
    return req.get("/users/info")
};

//修改头像的接口
export function chageAvatar(params) {
    return req.get("/users/avataredit", params)
};

//获取用户权限角色
export function getRole() {
    return req.get("/users/role")
};