import axios from 'axios'
//多目录打包
export const ApiGetMultiFolderPackage = params => { return axios.get("/manage/download/batch", { params: params }).then(res => res.data) };

// 下载任务
export const ApiGetManageDownTask = params => { return axios.get("/manage/download/task", { params: params }).then(res => res.data) };

// 下载任务中的下载文件
export const ApiGetDownAll = (fileOid) => {
    return axios({
        method: "get",
        url: `/manage/download_all/package_file?fileOid=${fileOid}`,
    }).then(res => res.data)
};

//下载单个文件
export const ApiGetFileDown = (fileType,fileVersionId) => {
    return axios({
        method: "get",
        url: `/file/download_file?file_type=${
            fileType
            }&file_version_id=${fileVersionId}`,
        // responseType: "blob"
    }).then(res => res.data)
};

