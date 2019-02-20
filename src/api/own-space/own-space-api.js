import axios from 'axios'

// 请求个人基本信息
export const ApiGetUserInfo = query => { return axios.get("/user/info", { params: query }).then(res => res.data) };

// 保存个人信息
export const ApiPostUserInfoModify = params => { return axios.post("/user/info/modify", params).then(res => res.data) };

// 请求项目是否接受邮件
export const ApiGetUserStudy = query => { return axios.get("/user/study_alert", { params: query }).then(res => res.data) };

//切换是否接受邮件
export const ApiPostUserStudy = params => { return axios.post("/user/study_alert", params).then(res => res.data) };

// 修改密码
export const ApiPostUserModifyPwd = params => { return axios.post("/user/modify_password", params).then(res => res.data) };

// 修改头像
export const ApiPostUserUpload = params => { return axios.post("/user/upload_avatar", params).then(res => res.data) };

