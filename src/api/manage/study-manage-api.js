import axios from 'axios'
//获取项目信息
export const ApiGetStudyInfo = query => { return axios.get("/manage/study/info", { params: query }).then(res => res.data) };
//修改项目信息
export const ApiPutStudyInfo = params => { return axios.put("/manage/study/update", params).then(res => res.data) };
