import axios from 'axios'
//获取目录树
export const ApiGetLibraryFolder = query => {return axios.get("/library/folders",{ params: query }).then(res => res.data)};
//获取文件list
export const ApiGetLibraryFileList = query => {return axios.get("/library/files",{ params: query }).then(res => res.data)};
//下载签字页
export const ApiGetSignPageDown = fileVersionId => {
    return axios({
        method: "get",
        url: `/library/download/sign/${fileVersionId}`,
        responseType: "blob"
    }).then(res => res.data)
};
//归档文件撤回
export const ApiGetFileRepeal = query => {return axios.get("/file/recall",{ params: query }).then(res => res.data)};