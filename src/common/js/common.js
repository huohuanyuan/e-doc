
import moment from 'moment';
import md5 from "js-md5";
/**
 * 当前目录下存在文件 无法删除提示
 */
export function haveFiles(vm, data) {
    vm.$Modal.warning({
        title: `${vm.$t('note.note')}:${vm.$t('note.folderExistFile')}`,
        closable: true,
        content: data,

    });
};
/**
 * 当前角色或用户下有任务 无法删除或修改 
 */
export function taskExist(vm, data) {
    const list = (h, params) => {
        let arr = [];
        for (let [index, elem] of params.entries()) {
            arr.push(h("li", elem.fileName))
        }
        return h("ul", [...arr])
    }
    vm.$Modal.warning({
        title: `${vm.$t('note.note')}:${vm.$t('note.folderExistFile')}`,
        closable: true,
        render: (h) => {
            return h("div", {
                style: {
                    margin: '10px',
                }
            }, [(function (vm) {
                if (data.review) {
                    return h("div", [h("strong", vm.$t('note.reviewTask')), list(h, data.review)])
                }
            })(vm), (function (vm) {
                if (data.qc) {
                    return h("div", [h("strong", vm.$t('note.qcTask')), list(h, data.qc)])
                }
            })(vm), (function (vm) {
                if (data.approve) {
                    return h("div", [h("strong", vm.$t('note.approveTask')), list(h, data.approve)])
                }
            })(vm)])
        }

    });

};

/**
 * 基于当前时间生成UUID
 */
export function UUID() {
    var s = [];
    var hexDigits = moment().format("x");
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**
 * 基于文件名和文件大小，进行MD5加密，作为存储文件uuid的key值
 * @param {String} name 文件名
 * @param {Numbrer} size 文件大小
 */
export function UUIDKey(name, size) {
    return md5(name + size);
}