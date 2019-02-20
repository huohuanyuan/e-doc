import axios from 'axios'
//获取所有文件树列表
export const ApiGetAllDocTree =query=> { return axios.get("/document/all_document/folders_files", { params: query }).then(res => res.data) };
//获取文件目录下的文件list
export const ApiGetAllDocList = query => { return axios.get("/document/all_document/files", { params: query }).then(res => res.data) };
