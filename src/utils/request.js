/* 封装的整个项目请求  by lwx*/
import axios from "axios";
import qs from "qs";
import local from "@/utils/storage.js";
import { Message } from "element-ui";

//设置基本地址,之后的请求自动接上此地址
axios.defaults.baseURL = "http://127.0.0.1:5000";//服务器地址
axios.defaults.timeout = 8000;//请求超时的时间

//请求拦截
axios.interceptors.request.use((config) => {
  
  //先取出本地存的token
  let tk = local.get("tk");

  if (tk) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    config.headers.Authorization = tk;
  }
  return config
});
// 响应拦截
axios.interceptors.response.use((response) => {
  //response.data就是响应的数据
  if (response.data.code !== undefined && response.data.msg !== undefined) {
   
    let { code, msg } = response.data;
    //响应成功时调用Message弹一个框框
    if (code === 0) { 
      Message({
        type: "success",
        message: msg,
      })
    } else if (code === 1) {
      Message.error(msg)
    }
  }
  return response
});

//封装请求方法
export default {
  //传入地址和参数
  get(url, data = {}) {
    //返回promise实例
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data
      }).then((response) => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  //传入地址和参数
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(data))
        .then((response) => {
          //  console.log(response)
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};