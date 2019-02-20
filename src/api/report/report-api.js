import axios from 'axios'

// 请求系统报表数据
export const ApiGetreportSystem = query => { return axios.get("/report/system", { params: query }).then(res => res.data) };

//请求文件属性
export const ApiGetReportAttribute = query => { return axios.get("/report/file_attribute", { params: query }).then(res => res.data) };

// 请求自定义报表 
export const ApiGetReportCustom = query => { return axios.get("/report/custom", { params: query }).then(res => res.data) };

// 下载文件
// export const ApiGetReportDown = query => { return axios.get("/report/download_report", { params: query }).then(res => res.data) };
export const ApiGetReportDown = params => {
    return axios({
        method: "get",
        url: `/report/download_report?customQuery=${params.customQuery}&siteId=${params.siteId}&queryType=${params.queryType}&reportType=${params.reportType}`,
        responseType: "blob"
    }).then(res => res.data)
};

// 归档文件统计图 年
export const ApiGetreportSystemArchived = query => { return axios.get("/report/system/archived/" + query ).then(res => res.data) };

// 文件状态分布月历图
export const ApiGetreportSystemStatus = query => { return axios.get("/report/system/status/" + query ).then(res => res.data) };

// 同一项目下各机构的文件数量
export const ApiGetreportSystemSite = query => { return axios.get("/report/system/site/files/" + query ).then(res => res.data) };
