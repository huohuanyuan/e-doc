import axios from 'axios'
//获取机构列表
export const ApiGetSiteList = params => {return axios.get("/manage/study/sites_page",{ params: params }).then(res => res.data)};
//新建机构
export const ApiPostSite = params => {return axios.post("/manage/study/site/add",params).then(res => res.data)};
//修改机构
export const ApiPutSite = params => {return axios.put("/manage/study/site/update",params).then(res => res.data)};
//删除机构
export const ApiDeleteSite = params => {return axios.delete("/manage/study/site/"+params).then(res => res.data)};