import axios from 'axios'

//自定义目录

//获取自定义目录模板列表
export const ApiGetTemlateDir = params => { return axios.get("/manage/folder/template_list", { params: params }).then(res => res.data) };
//获取自定义目录树
export const ApiGetCustomDir = params => { return axios.get("/manage/custom_folder/find", { params: params }).then(res => res.data) };
//添加子节点
export const ApiPostCustomAdd = params => { return axios.post("/manage/custom_folder/add", params).then(res => res.data) };
//删除子节点
export const ApiDelectCustom = params => { return axios.post("/manage/custom_folder/delete", params).then(res => res.data) };
//修改目录保存
export const ApiPutDir = params => { return axios.post("/manage/custom_folder/update", params).then(res => res.data) };
//获取自定义目录模板的树结构
export const ApiGetTemlateInfo = params => { return axios.get("/manage/folder/template_folder_list/" + params).then(res => res.data) };
//使用自定义目录模板
export const ApiPostUseTemp = params => { return axios.post("/manage/folder/template_add", params).then(res => res.data) };

// 检索自定义子目录可配置的人员:
export const ApiGetCustomRoles = params => { return axios.get("/manage/custom_folder/users",{ params: params }).then(res => res.data) };

// 检索单个自定义目录信息
export const ApiGetCustomInfo = params => { return axios.get("/manage/custom_folder/info/" + params).then(res => res.data) };


//TMF目录

//获取TMF目录
export const ApiGetTmfDir = params => { return axios.get("/manage/folder/tmf/info", { params: params }).then(res => res.data) };
//配置目录
export const ApiPutTmfDir = params => { return axios.put("/manage/folder/tmf",  params ).then(res => res.data) };

