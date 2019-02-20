import axios from 'axios'

// 新建公司
export const ApiPostSuperCompany = params => { return axios.post("/super/company", params).then(res => res.data) };

// 请求公司list
export const ApiGetSuperCompanyList = query => { return axios.get("/super/company/list", { params: query }).then(res => res.data) };

// 修改公司信息
export const ApiGetSuperCompany = query => { return axios.get("/super/company/" + query ).then(res => res.data) };

// 修改完成后保存
export const ApiPostSuperCompanyUpdate = params => { return axios.post("/super/company/update", params).then(res => res.data) };

// 激活和冻结公司
export const ApiPostSuperCompanyLock = params => { return axios.post("/super/company/lock", params).then(res => res.data) };

// 请求公司下的项目列表
export const ApiGetSuperCompanyStudy = (query1, query2)=> { return axios.get("/super/company/study/"+ query1, { params: query2 }).then(res => res.data) };

// 保存更新后的有效时间
export const ApiPostSuperStudyDeadline = params => { return axios.post("/super/study/deadline", params).then(res => res.data) };

// 公司增加内存
export const ApiPostSuperCompanyRecharge = params => { return axios.post("/super/company/recharge", params).then(res => res.data) };

// 请求超级管理员管理项目成员
export const ApiGetSuperStudyUser = query => { return axios.get("/super/study/users", { params: query }).then(res => res.data) };

// 获取当前study 下的所有 site
export const ApiGetSuperStudyRole = query => { return axios.get("/super/study/roles/" + query ).then(res => res.data) };

// 获取当前study 下的所有 role
export const ApiGetSuperStudysite = query => { return axios.get("/super/study/sites/" + query ).then(res => res.data) };

//添加人员
export const ApiPostSuperStudyUser = params => { return axios.post("/super/study/user", params).then(res => res.data) };

// 修改人员角色
export const ApiPostSuperStudyUserUpdate = params => { return axios.post("/super/study/update/role", params).then(res => res.data) };

// 检索指定study下所有管理员的id
export const ApiGetSuperManager = query => { return axios.get("/super/managers/" + query).then(res => res.data) };

// 删除保存
export const ApiDeletSuperUser = query => { return axios.delete("/super/study/user", { params: query }).then(res => res.data) };

// 新建项目
export const ApiPostSuperStudyAdd= params => { return axios.post("/super/study/add", params).then(res => res.data) };
