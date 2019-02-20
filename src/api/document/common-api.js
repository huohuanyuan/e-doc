import axios from 'axios'
//获取历史版本
export const ApiGetHistoryVer = query => { return axios.get("/file/version/find_all", { params: query }).then(res => res.data) };
//获取文件目录下的文件list
export const ApiGetFileRecord = query => { return axios.get("/audit/find_file_audits", { params: query }).then(res => res.data) };
//文件删除
export const ApiGetFileDelete = query => { return axios.get("/file/delete", { params: query }).then(res => res.data) };
//文件发送至流程
export const ApiGetFileSendTo = query => { return axios.get("/file/operation/send", { params: query }).then(res => res.data) };

//接收任务
export const ApiGetAcceptTask = query => { return axios.post("/file/operation/receive/" + query ).then(res => res.data) };

