/*
帐号请求的封装都可以在这里

*/

import req from "@/utils/request";

//登录接口
export function checkLogin(params) {
     return req.post("/users/checkLogin", params)
};

//添加账户接口
export function AddAccount(params) {
     return req.post("/users/add", params);
};

//账号列表接口
// 获取账号列表
export function getAccList(params) {
     return req.get("/users/list", params);
}
//删除一条记录
export function delAccList(params) {
     return req.get("/users/del", params);
}

// 编辑一条
export function editAcc(params) {
     return req.post("/users/edit", params);
}

//批量删除
export function batchDel(params) {
     return req.get("/users/batchdel",params)
}

//确认旧密码是否正确
export function regPwd(params) {
     return req.get("/users/checkoldpwd", params);
}

//修改新密码
export function changePwd(params) {
     return req.post("/users/editpwd", params);
}


