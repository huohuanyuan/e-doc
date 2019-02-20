import axios from 'axios'

// 请求可以上传的文件类型
export const ApiGetFileTypes = query => { return axios.get("/file/types", { params: query }).then(res => res.data) };

// 请求版本类型列表
export const ApiGetFileVersionFormat = query => { return axios.get("/file/version_format", { params: query }).then(res => res.data) };

// 请求当前study 下的所有 site
export const ApiGetManageStudySites = query => { return axios.get("/manage/study/sites", { params: query }).then(res => res.data) };

// 请求当前site 下的人员
export const ApiGetFileUserByPrivilege = query => { return axios.get("/file/user_by_privilege", { params: query }).then(res => res.data) };

// 请求自定义目录列表
export const ApiGetManageCustomFind = query => { return axios.get("/manage/custom_folder/find", { params: query }).then(res => res.data) };

// 请求tmf模版一级目录
export const ApiGetFileFolders = query => { return axios.get("/file/folders", { params: query }).then(res => res.data) };

// 新建文件保存
export const ApiPostSaveNewFile = params => { return axios.post("/file/save_new_file", params).then(res => res.data) };

// 保存为模版
export const ApiPostTmpl = params => { return axios.post("/tmpl", params).then(res => res.data) };

// 请求模版列表
export const ApiGetTmpl = query => { return axios.get("/tmpl", { params: query }).then(res => res.data) };

// 删除模版
export const ApiDeletTmpl = params =>{return axios.delete("/tmpl/"+ params).then(res=>res.data)};

// 删除已经上传的文件
export const ApiDeletFile = query =>{return axios.delete("/file/entity", { params: query }).then(res=>res.data)};

// 请求模版详情
export const ApiGetTmplDetail = query => { return axios.get("/tmpl/detail/" + query).then(res => res.data) };

// 请求文件详情
export const ApiGetFileFindOne = query => { return axios.get("/file/find_one_file", { params: query }).then(res => res.data) };

// 修改文件后保存
export const ApiPostFileUpdateFile = params => { return axios.post("/file/update_file", params).then(res => res.data) };

// 请求tmf模版下第三级目录的前两个目录
export const ApiGetFileFindArtifact = query => { return axios.get("/file/find_artifact", { params: query }).then(res => res.data) };

//获取oss上传文件参数
export const ApiGetOssParams= query => { return axios.get("/file/upload", { params: query }).then(res => res.data) };
