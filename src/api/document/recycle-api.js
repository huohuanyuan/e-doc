import axios from 'axios'

//回收站列表
export const ApiGetRecycleList = query => {return axios.get("/document/deleted",{ params: query }).then(res => res.data)};

// 恢复文件
export const ApiGetFileRecover = query => {return axios.get("/file/recover",{ params: query }).then(res => res.data)};
