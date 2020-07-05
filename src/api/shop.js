/*

商铺请求的封装都可以在这里

*/

import req from "@/utils/request";

//获取店铺详情
export function getShopInfo() {
    return req.get("/shop/info")
};

//店铺内容修改
export function editShopInfo(params) {
    return req.post("/shop/edit",params)
};