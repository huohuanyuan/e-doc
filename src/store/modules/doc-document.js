/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 11:05:40 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-06 17:46:50
 */

import { ApiGetHistoryVer, ApiGetFileRecord } from "@/api/document/common-api";
import {
    ApiGetfileFlow
} from "@/api/pdf-api";
import { resCode } from "common/js/code";
import iView from 'iview';

const docDocument = {
    state: {
        history: {
            modal: false,
            tableData: [],
            pageTotal: 0,
            params: {
                fileId: "",
                pageNum: 1,
                pageSize: 10
            }
        },
        record: {
            modal: false,
            tableData: [],
            pageTotal: 0,
            params: {
                fileId: "",
                pageNum: 1,
                pageSize: 10
            }
        },
        flow: {
            fileId: "",
            flowModel: false,
            signModel: false,
            currentUserId: "",
            signTypeId: "",
            updatedTime: "", //文件更新时间
            email: "",
            signaturePriv: false, //是否有当前流程的操作权限
            isSign: false, //是否电子签名
            operateList: [],
            allographList: [], //代签人员list
            signModal: false,//电子签名modal
            isOperate: false, //是否可以操作流程
            processForm: {
                success: 1,
                allograph: "",
                common: ""
            },
            signForm: {
                password: "",
                check: []
            }

        }
    },
    mutations: {
        /**
         * 请求文件历史版本数据
         * @param { Object } state
         * @param { Object } p  vm:指向vue实例，国际化使用，data：请求参数{ fileId: "", pageNum: 1, pageSize: 10}
         */
        getHistoryData(state, p) {
            for (let key in p.data) {
                state.history.params[key] = p.data[key];
            }
            ApiGetHistoryVer(state.history.params).then(function (res) {
                if (res.code == "success") {
                    state.history.tableData = res.data;
                    state.history.pageTotal = res.total;
                } else {
                    iView.Message.error(resCode(p.vm, res.code));

                }

            })
        },
        /**
         * 历史版本查看model打开/关闭
         * @param { Object } state
         * @param { Boolean } value ture:打开 false：关闭
         */
        historyModalToggle(state, value) {
            state.history.modal = value;
        },
        /**
         * 操作记录查看model打开/关闭
         * @param { Object } state
         * @param { Boolean } value ture:打开 false：关闭
         */
        recordModalToggle(state, value) {
            state.record.modal = value;
        },
        /**
         * 请求文件操作记录数据
         * @param { Object } state
         * @param { Object } p  vm:指向vue实例，国际化使用，data：请求参数{ fileId: "", pageNum: 1, pageSize: 10}
         */
        getRecordData(state, p) {
            for (let key in p.data) {
                state.record.params[key] = p.data[key];
            }
            ApiGetFileRecord(state.record.params).then(function (res) {
                if (res.code == "success") {
                    state.record.tableData = res.data;
                    state.record.pageTotal = res.total;
                } else {
                    iview.Message.error(resCode(p.vm, res.code));
                }
            })
        },
        /**
       * 不支持在线查看的文件 审阅/批准 model打开/关闭
       * @param { Object } state
       * @param { Boolean } value ture:打开 false：关闭
       */
        flowModalToggle(state, value) {
            state.flow.flowModel = value;
        },
        signModalToggle(state, value) {
            state.flow.signModel = value;
        },
        /**
         * 获取文件审阅审批流程数据 
         * @param { Object } state
         * @param { Object } p  vm:指向vue实例，国际化使用，data：请求参数{ fileId: ""}     
         */
        getFlowMsg(state, p) {
            state.flow.fileId = p.data.fileId;
            state.flow.operateList = [];
            state.flow.processForm.success = "1";
            state.flow.processForm.allograph = "";
            state.flow.processForm.common = "";
            ApiGetfileFlow(p.data.fileId).then(res => {
                if (res.code == "success") {
                    if (res.data) {
                        state.flow.isOperate = true;
                        state.flow.currentUserId = res.data.userId;
                        state.flow.isSign = res.data.sign;
                        state.flow.allographList = res.data.userMapList ? res.data.userMapList : [];
                        //默认选中第一个被代签人员
                        if (state.flow.allographList.length > 0) {
                            state.flow.processForm.allograph = state.flow.allographList[0].userId;
                        }
                        state.flow.signaturePriv = res.data.signaturePriv;
                        state.flow.updatedTime = res.data.updatedTime;
                        state.flow.email = res.data.email;
                        state.flow.signTypeId = res.data.signTypeId;
                        if (res.data.signatureList && res.data.signatureList.length > 0) {
                            for (let [index, elem] of res.data.signatureList.entries()) {
                                //从签字记录中过滤出 处于当前流程状态 或 进行中状态，且 签字人员或者代签人员为 当前登录用户的记录，保存在repealData中，用于渲染可撤销的操作
                                //其余数据保存在operateList中
                                if (
                                    (state.flow.signTypeId == 1 || state.flow.signTypeId == elem.signTypeId) &&
                                    (elem.signerId == state.flow.currentUserId ||
                                        elem.allograph == state.flow.currentUserId)
                                ) {
                                    elem.isReapel = true;
                                } else {
                                    elem.isReapel = false;
                                }
                                state.flow.operateList.push(elem);
                            }
                        }
                    } else {
                        state.flow.isOperate = false;
                    }
                } else {
                    iView.Message.error(resCode(p.vm, res.code));
                }
            });
        },


    }
}
export default docDocument;
