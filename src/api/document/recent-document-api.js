import axios from 'axios'
//最近操作列表
export const ApiGetRecentList = query => {return axios.get("/document/recent_document",{ params: query }).then(res => res.data)};