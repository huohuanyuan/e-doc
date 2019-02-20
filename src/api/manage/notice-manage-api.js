import axios from 'axios'
//获取notice
export const ApiGetNotice = params => { return axios.get("/notice/content", { params: params }).then(res => res.data) };
//公告发布
export const ApiPostNotice = params => { return axios.post("/notice/send", params).then(res => res.data) };
//公告删除
export const ApiDeleteNotice = query =>{return axios.delete("/notice/delete", { params: query }).then(res=>res.data)};
