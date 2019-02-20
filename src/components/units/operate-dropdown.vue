/*
 * @Author: chengshanshan 
 * @Date: 2018-07-20 16:45:18 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-18 15:04:00
 * @instraction:文件操作下拉按钮组件
 */

 /**
 *edit: 修改
 *isView：查看
 *isEdit:编辑
 *isDelete：删除
 *isDownload：下载
 *isRecord：操作记录
 *isHistory:历史记录
 *sendReview：发送至审阅
 *sendQc：发送至QC
 *sendApprove:发送至审批
 *toReview：去审阅
 *toQc:去QC
 *toApprove：去批准
  */
 <template>
  <div class="operate-wrapper">
    <el-dropdown @command="clickItems" size="small">
      <span class="el-dropdown-link">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-caozuo"></use>
        </svg>
      </span>
      <el-dropdown-menu slot="dropdown" v-if="items.length>0">
        <el-dropdown-item v-for="(item,index) in items" :key="index" :command="item.params">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu slot="dropdown" v-else>
        <el-dropdown-item> {{$t("note.notAuthorized")}} </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import moment from "moment";
import {
  ApiGetFileDown
} from "@/api/manage/down-center-api";
export default {
  data() {
    return {
      keyNames: {
        edit: this.$t("operation.edit"),
        delete: this.$t("operation.doDelete"),
        download:this.$t("operation.down"),
        record: this.$t("title.record"),
        history: this.$t("title.history"),      
        sendReview: this.$t("operation.sendReview"),
        sendQc: this.$t("operation.sendQc"),
        sendApprove: this.$t("operation.sendApprove"),
        toReview: this.$t("operation.toReview"),
        toQc: this.$t("operation.toQC"),
        toApprove: this.$t("operation.toApprove"),
        acceptTask:  this.$t("operation.acceptTask"),
      }
    };
  },
  props: {
    dropdownItems: {
      type: Object,
      default() {
        return {
          edit: false,
          delete: false,
          record: false,
          history: false,
          download:false,
          sendReview: false,
          sendQc: false,
          sendApprove: false,
          toReview: false,
          toQc: false,
          toApprove: false,
          acceptTask: false //接收任务
        };
      }
    },
    fileId: {
      type: Number,
      default: 0
    },
    updatedTime: {
      type: [String, Number],
      default: 0
    },
    siteId: {
      type: Number,
      default: 0
    },
    fileVersionId: {
      type: Number,
      default: 0
    },
    fileName: {
      type: String,
      default: ""
    },
    view: {
      //是否有权限查看
      type: Boolean,
      default: false
    },
    onlineView: {
      //是否支持查看
      type: Boolean,
      default: false
    },
    fileType: {
      //文件类型
      type: String,
      default: ""
    }
  },
  computed: {
    items() {
      let _arr = [];
      for (let key in this.dropdownItems) {
        if (this.dropdownItems[key]) {
          _arr.push({
            name: this.keyNames[key],
            params: { fileId: this.fileId, name: key }
          });
        }
      }
      return _arr;
    }
  },
  methods: {
    clickItems(command) {
      const { href } = this.$router.resolve({
        path: `/pdf/${this.fileId}/${this.fileVersionId}`     
      });
      switch (command.name) {
        case "history": //获取文件历史版本信息
          this.$store.commit("historyModalToggle", true);
          this.$store.commit("getHistoryData", {
            vm: this,
            data: {
              fileId: command.fileId,
              pageSize: 10,
              pageNum: 1
            }
          });
          break;
        case "record": //获取文件操作记录
          this.$store.commit("recordModalToggle", true);
          this.$store.commit("getRecordData", {
            vm: this,
            data: {
              fileId: command.fileId,
              pageSize: 10,
              pageNum: 1
            }
          });
          break;
        case "download":
          this.siginFileDown({fileType:this.fileType, fileVersionId:this.fileVersionId})
    
          break;
        case "sendReview": //发送至审阅
          this.$emit("send-to", {
            fileId: this.fileId,
            updatedTime: moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss"),
            siteId: this.siteId,
            operationType: "review"
          });
          break;
        case "sendQc": //发送至QC
          this.$emit("send-to", {
            fileId: this.fileId,
            updatedTime: moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss"),
            siteId: this.siteId,
            operationType: "qc"
          });
          break;
        case "sendApprove": //发送至批准
          this.$emit("send-to", {
            fileId: this.fileId,
            updatedTime: moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss"),
            siteId: this.siteId,
            operationType: "approve"
          });
          break;
        case "toReview": //去审阅
          if (this.onlineView) {
            window.open(href, "_blank");
          } else {
            this.$store.commit("flowModalToggle", true);
            this.$store.commit("getFlowMsg", {
              vm: this,
              data: { fileId: this.fileId }
            });
          }
          break;
        case "toQc": //去qc
          if (this.onlineView) {
            window.open(href, "_blank");
          } else {
            this.$store.commit("flowModalToggle", true);
            this.$store.commit("getFlowMsg", {
              vm: this,
              data: { fileId: this.fileId }
            });
          }
          break;
        case "toApprove": //去批准
          if (this.onlineView) {
            window.open(href, "_blank");
          } else {
            this.$store.commit("flowModalToggle", true);
            this.$store.commit("getFlowMsg", {
              vm: this,
              data: { fileId: this.fileId }
            });
          }
          break;
        case "edit": //修改文件
          this.$router.push({
            name: "editFile",
            query: {
              fileId: command.fileId,
              t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
            }
          });
          break;
        case "delete": //删除文件
          this.$emit("file-delete", {
            fileId: this.fileId,
            updatedTime: moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss"),
            fileName: this.fileName
          });
          break;
        case "acceptTask": //接收任务
          this.$emit("accept-task", {
            fileId: this.fileId
          });
      }
    },
        /**
     * 下载单个文件
     */
    siginFileDown(params) {
      ApiGetFileDown(params.fileType, params.fileVersionId).then(res => {
        if (res.code == "success") {
          // let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = res.data;
          link.setAttribute(
            "download",
            `${params.fileName}.${params.fileType}`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../common/css/variable.scss";
.el-dropdown-menu--small {
  .el-dropdown-menu__item {
    font-size: 12px;
    &:hover {
      color: $theme-green;
    }
  }
}
</style>

 <style  lang="scss" scoped>
.operate-wrapper {
  .icon {
    font-size: 25px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>

