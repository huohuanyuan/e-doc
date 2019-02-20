/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-24 11:09:03 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-22 17:27:31
 */

//ajax请求返回code
export function resCode(vm, key) {
    let _code = {
        password_error: vm.$t('note.passwordError'),
        duplicate_folder_name: vm.$t('note.folderNameIsExist'),
        fail: vm.$t('note.questionFail'),
        sys_exception: vm.$t('note.sysError'),
        user_not_exist: vm.$t('note.userNotExist'),
        user_review_change: vm.$t('note.userReviewChange'),
        user_qc_change: vm.$t('note.userQCChange'),
        user_approve_change: vm.$t('note.userApproveChange'),
        param_error: vm.$t('note.paramError'),
        none_file: vm.$t('note.noneFileInFolder'),
        expire_file: vm.$t('note.expireFile'),
        archived_file: vm.$t('note.archivedFile'),
        duplicate_file_name: vm.$t('note.duplicateFileName'),
        duplicate_study_code: vm.$t('note.duplicateStudyCode'),
        not_authorized: vm.$t('note.notAuthorized'),
        using: `${vm.$t('note.roleUsing')},${vm.$t('note.delFall')}`,
        have_temp_folders: `${vm.$t('note.haveFolders')},${vm.$t('note.delFall')}`,
        have_custom_folders: `${vm.$t('note.haveFolders')},${vm.$t('note.delFall')}`,
        file_already_received: vm.$t('note.fileAlreadyReceived'),
        file_data_exist: vm.$t('note.siteExistFile'),
        yourself: vm.$t('note.yourSelf'),
        no_change_file: vm.$t('note.fileNoChange')
    }
    return _code[key] ? _code[key] : vm.$t('note.unkownError')

};
//文件状态code
export function fileStatus(vm, key) {
    let _code = {
        processing: vm.$t('file.processing'),
        receiving: vm.$t('file.waitAccept'),
        reviewing: vm.$t('file.reviewing'),
        qcing: vm.$t('file.qcing'),
        approving: vm.$t('file.approving'),
        unactivated: vm.$t('file.unactivated'),
        archived: vm.$t('file.archived')
    }
    return _code[key] ? _code[key] : vm.$t('note.unkownError')

};
//支持在线查看的文件类型
export const onlineViewType = ["pdf", "xlsx", "xls", "doc", "docx"];

