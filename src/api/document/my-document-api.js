import axios from 'axios'
//我的文档列表
export const ApiGetMyDocList = query => {return axios.get("/document/my_document",{ params: query }).then(res => res.data)};