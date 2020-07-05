/*

订单请求的封装都可以在这里

*/

import req from "@/utils/request";


//订单列表
export function getOrderlist(params) {
    return req.get("/order/list", params)
};

//获取订单详情
export function getOrderDetail(params) {
    return req.get("/order/detail", params)
};

//查询订单
export function searchOrderDetail(params) {
    return req.get("/order/search", params)
};

//修改订单信息
export function editOrder(params) {
    return req.post("/order/edit", params)
};