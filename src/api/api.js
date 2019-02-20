import axios from 'axios'

//登录
export const postLogin = params => {return axios.post("/login",params).then(res => res.data)};
//忘记密码
export const forgetPwdLogin = params => {return axios.post("/admin/reset_password",params).then(res => res.data)};
// 密码过期，修改密码
export const postUserPwd = params => {return axios.post("/user/modify_password",params).then(res => res.data)};
//语言切换
export const putLangChange = params => {return axios.put("/user/lang/"+params).then(res => res.data)};
