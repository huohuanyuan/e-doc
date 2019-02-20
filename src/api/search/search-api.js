import axios from 'axios'

// 获取搜索后的文件列表
export const ApiGetCommonSearchFile = query => { return axios.get("/common/search/file", { params: query }).then(res => res.data) };


// 获取搜索后的目录列表
export const ApiGetCommonSearchDir = query => { return axios.get("/common/search/dir", { params: query }).then(res => res.data) };
