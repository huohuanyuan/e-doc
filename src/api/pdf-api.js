import axios from './https'
//  请求在线显示文件的url
export const ApiGetUrl= params => { return axios.get("/file/office_view/page/" + params).then(res => res.data) };

// 请求文件流程数据
export const ApiGetfileFlow= params => { return axios.get("/file/flow/"+params).then(res => res.data) };
//审阅审批保存
export const ApiPostFlowSave= params => { return axios.post("/file/operation/receiver",params).then(res => res.data) };
//撤回
export const ApiGetRepealFlow= params => { return axios.get("/file/undo_record/signature",{params:params}).then(res => res.data) };

//留言保存
export const ApiPostNoteSave= params => { return axios.post("/file/words", params).then(res => res.data) };

//获取留言list
export const ApiGetNoteList= params => { return axios.get("/file/words/" + params).then(res => res.data) };

//删除留言
export const ApiDeletFileWord = params =>{return axios.delete("/file/words/" + params).then(res=>res.data)};
