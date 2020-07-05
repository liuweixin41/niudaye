import req from "@/utils/request";

//首页报表
export function getTotaldata() {
    return req.get("/order/totaldata")
};
//订单报表接口

export function geOrderdata(params) {
    return req.get("/order/ordertotal",params)
};