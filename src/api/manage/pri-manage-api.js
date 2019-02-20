import axios from 'axios'
//获取角色-权限列表
export const ApiGetPrivilegeList = params => {return axios.get("/manage/privilege_role/find_all",{ params: params }).then(res => res.data)};
//新增角色
export const ApiPostRole = params => {return axios.post("/role_privilege/role",params ).then(res => res.data)};
//修改角色
export const ApiPutRole = params => {return axios.put("/role_privilege/role/update", params ).then(res => res.data)};
//删除角色
export const ApiDeleteRole = params => {return axios.delete("/role_privilege/role/"+params ).then(res => res.data)};
//保存权限--角色设定
export const ApiPutPriAndRole= params => {return axios.post("/manage/privilege_role/update",params ).then(res => res.data)};


//获取个人权限分配list
export const ApiGetUserPriList = params => {return axios.get("/manage/privilege_user/find_all",{ params: params }).then(res => res.data)};
//获取userlist
export const ApiGetUserSiteList = params => {return axios.get("/user/user_list",{ params: params }).then(res => res.data)};
//获取权限list
export const ApiGetPriList = params => {return axios.get("/manage/allot_privileges",{ params: params }).then(res => res.data)};
//分配个人权限 新建保存
export const ApiPostUserPri = params => {return axios.put("/manage/privilege_user/add",params ).then(res => res.data)};
//分配个人权限 修改保存
export const ApiPutUserPri = params => {return axios.put("/manage/privilege_user/update",params ).then(res => res.data)};
//个人权限 删除
export const ApiDeleteUserPri = params => {return axios.delete("/manage/privilege_user/delete",{ params: params }).then(res => res.data)};
