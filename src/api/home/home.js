import axios from 'axios'

// 请求 study 列表
export const ApiGetCommonStudySiteList = query => { return axios.get("/common/study_site_list", { params: query }).then(res => res.data) };

// 请求当前用户创建的文件的状态数
export const ApiGetTaskCount = query => { return axios.get("/home/task_count", { params: query }).then(res => res.data) };

// 请求我的任务
export const ApiGetMyTask = query => { return axios.get("/home/mytask", { params: query }).then(res => res.data) };

// 请求 可接受任务
export const ApiGetMyavailable = query => { return axios.get("/home/myavailable", { params: query }).then(res => res.data) };

// 请求可访问项目列表
export const ApiGetCommonStudy = query => { return axios.get("/common/study", { params: query }).then(res => res.data) };

// 请求可访问项目下的机构
export const ApiGetCommonStudySite = query => { return axios.get("/common/study/site", { params: query }).then(res => res.data) };

// 点击 进入site
export const ApiPostCommonStudy = params => { return axios.post("/common/set_operate_study", params).then(res => res.data) };
