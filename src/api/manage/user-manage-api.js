import axios from 'axios'
//获取用户列表
export const ApiGetUserList = query => {return axios.get("/user/all_user",{ params: query }).then(res => res.data)};
//获取机构list
export const ApiGetSiteList = query => {return axios.get("/manage/study/sites",{ params: query }).then(res => res.data)};

//获取角色list
export const ApiGetRoleList = query => {return axios.get("/manage/study/rolelist",{ params: query }).then(res => res.data)};
//新建用户保存
export const ApiPostUser = params => {return axios.post("/user/add",params).then(res => res.data)};
//修改用户保存
export const ApiPutUser = params => {return axios.put("/user/update/role",params).then(res => res.data)};

//获取管理员列表
export const  ApiGetAdminList= params => {return axios.get("/user/managers",params).then(res => res.data)};
//删除用户保存
export const  ApiDeleteUser = query => {return axios.delete("/user/delete",{ params: query }).then(res => res.data)};
