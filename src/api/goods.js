/*

商品请求的封装都可以在这里

*/

import req from "@/utils/request";

//商品列表
export function getGoodslist(params) {
    return req.get("/goods/list", params)
};

//添加商品
export function addGoods(params) {
    return req.post("/goods/add", params)
};

//编辑商品
export function editGoods(params) {
    return req.post("/goods/edit", params)
};

//删除一条商品
export function delGoods(params) {
    return req.get("/goods/del", params)
};

//获取分类
export function getCateList(params) {
    return req.get("/goods/categories", params)
};

//添加分类
export function addCateList(params) {
    return req.post("/goods/addcate", params)
};

//删除分类
export function delCate(params) {
    return req.get("/goods/delcate", params)
};

//修改分类
export function editCate(params) {
    return req.post("/goods/editcate", params)
};