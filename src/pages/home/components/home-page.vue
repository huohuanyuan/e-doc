/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-23 09:06:16 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-18 14:50:58
 */
<template>
  <div class="home">
    <div class="home-left">
      <div class="home-left-top">

        <router-link to="/document/new-file" v-if="hasNewfilePriv">
          <div class="new-file">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xinjianwenjian"></use>
            </svg>
            <p>{{$t('file.newFile')}} </p>
          </div>
        </router-link>

        <div class="study-list">
          <router-link to="study">
            <span class="studys"> {{$t('file.more')}} </span>
          </router-link>
          <Table :columns="studyColumns" height="330" :data="studyData" :row-class-name="rowClassName"></Table>
        </div>
      </div>

      <div class="home-left-bottom" v-if="hasNewfilePriv">
        <div class="acceptance-list">
          <div class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-daijieshourenwu"></use>
            </svg> {{$t('file.goingTask')}}
            <router-link to="my-task">
              <span class="title-span"> {{$t('file.more')}} </span>
            </router-link>
          </div>
          <div class="content-lists" v-if="isMyTask">
            <div class="cell-list" v-for="item in myTaskData">
              <FileIcon :fileType="item.fileType" :fileName="item.fileName" :fileDir="item.folder" :view="item.view" :fileVersionId="item.fileVersionId" :fileId="item.fileId" :onlineView="item.onlineView"> </FileIcon>
              <div class="f-code">
                {{ item.fileCode }}
              </div>
              <div class="f-version">
                {{ item.versionNo }}
              </div>
              <div class="f-time">
                {{ item.updatedTime }}
              </div>
              <div class="f-status">
                {{ item.fileStatus }}
                <span v-show=" item.isReview == 2 ||
                 item.isQc == 2 ||
                  item.isApprove == 2">
                  <review-pop :failComments="item.failComments">

                  </review-pop>
                </span>
              </div>
              <div class="f-operate">
                <OperateDropdown :fileId="item.fileId" :fileName="item.fileName" :siteId="item.siteId" :fileVersionId="item.fileVersionId" :updatedTime="item.updatedTime" :view="item.view" :onlineView="item.onlineView" :fileType="item.fileType" :dropdownItems="dropdownItemFun(item)" @send-to="sendTo($event,'task')" @file-delete="fileDeleteFun($event,'task')"> </OperateDropdown>
              </div>
            </div>
          </div>
          <p class="content-none" v-else>
            {{$t('file.noGoingTask')}}
          </p>
        </div>
        <div class="conduct-list">
          <div class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinhangzhongrenwu"></use>
            </svg> {{$t('file.optionalTask')}}
            <router-link to="my-available">
              <span class="title-span" v-if="isMyAvailable"> {{$t('file.more')}} </span>
            </router-link>
          </div>
          <div class="content-lists" v-if="isMyAvailable">
            <div class="cell-list">
              <FileIcon :fileType="myAvailableData.fileType" :fileName="myAvailableData.fileName" :fileDir="myAvailableData.folder" :view="myAvailableData.view" :fileVersionId="myAvailableData.fileVersionId" :fileId="myAvailableData.fileId" :onlineView="myAvailableData.onlineView"> </FileIcon>
              <div class="f-code">
                {{ myAvailableData.fileCode }}
              </div>
              <div class="f-version">
                {{ myAvailableData.versionNo }}
              </div>
              <div class="f-time">
                {{ myAvailableData.updatedTime }}
              </div>
              <div class="f-status">
                {{ myAvailableData.fileStatus }}
                <span v-show=" myAvailableData.isReview == 2 ||
                 myAvailableData.isQc == 2 ||
                  myAvailableData.isApprove == 2">
                  <review-pop :failComments="myAvailableData.failComments">

                  </review-pop>
                </span>
              </div>
              <div class="f-operate">
                <OperateDropdown :dropdownItems="dropdownItemFun(myAvailableData)" :fileId="myAvailableData.fileId" :fileName="myAvailableData.fileName" :siteId="myAvailableData.siteId" :fileVersionId="myAvailableData.fileVersionId" :updatedTime="myAvailableData.updatedTime" :view="myAvailableData.view" :onlineView="myAvailableData.onlineView" :fileType="myAvailableData.fileType" @send-to="sendTo" @file-delete="fileDeleteFun" @accept-task="accpetTask"> </OperateDropdown>
              </div>
            </div>
          </div>
          <p class="content-none" v-else>
            {{$t('file.noOptionaTask')}}
          </p>
        </div>
      </div>
    </div>
    <div class="home-right" v-if="hasNewfilePriv">
      <router-link :to="{path:'my-available',query: {operationType:'receive'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.waitAccept')}}
          </div>
          <div class="num">
            {{taskCount.receiveNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="receiveIcon"></use>
          </svg>
        </div>
      </router-link>

      <router-link :to="{path:'my-task',query: {operationType:'edit'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.waitEdit')}}
          </div>
          <div class="num">
            {{taskCount.editNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="editIcon"></use>
          </svg>
        </div>
      </router-link>
      <router-link :to="{path:'my-task',query: {operationType:'fail'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.reject')}}
          </div>
          <div class="num">
            {{taskCount.failNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="failIcon"></use>
          </svg>
        </div>
      </router-link>
      <router-link :to="{path:'my-task',query: {operationType:'review'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.waitReview')}}
          </div>
          <div class="num">
            {{taskCount.reviewNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="reviewIcon"></use>
          </svg>
        </div>
      </router-link>
      <router-link :to="{path:'my-task',query: {operationType:'qc'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.waitQC')}}
          </div>
          <div class="num">
            {{taskCount.qcNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="qcIcon"></use>
          </svg>
        </div>
      </router-link>
      <router-link :to="{path:'my-task',query: {operationType:'approve'}}">
        <div class="right-list">
          <div class="status">
            {{$t('file.waitApprove')}}
          </div>
          <div class="num">
            {{taskCount.approveNum}}
          </div>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="approveIcon"></use>
          </svg>
        </div>
      </router-link>
    </div>
    <!-- 删除确认 -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="text-align:center">
        <p v-html="$t('operation.deleteNoRecover',{name:deleteData.fileName})"></p>
      </div>
      <div slot="footer">
        <Button type="error" long @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
    <file-history></file-history>
    <file-record></file-record>
    <!-- 不支持在线查看的文件的审阅审批流程model-->
    <file-flow @flow-save="flowSave"></file-flow>
  </div>
</template>

<script>
import {
  ApiGetCommonStudySiteList,
  ApiGetTaskCount,
  ApiGetMyTask,
  ApiGetMyavailable,
  ApiPostCommonStudy
} from "@/api/home/home";
import { resCode, fileStatus } from "@/common/js/code.js";
import {
  ApiGetFileDelete,
  ApiGetFileSendTo,
  ApiGetAcceptTask
} from "@/api/document/common-api";
import { ApiPostFlowSave } from "@/api/pdf-api";
import moment from "moment";
import qs from "qs";
import Util from "common/js/util";

import OperateDropdown from "components/units/operate-dropdown";
import FileIcon from "components/units/file-icon";
import FileHistory from "components/file-history";
import FileRecord from "components/file-record";
import FileFlow from "components/file-flow";
import ReviewPop from "components/units/review-pop";
const linkButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.postCommonStudy(params.row);
        }
      }
    },
    vm.$t("operation.enter")
  );
};

export default {
  components: {
    OperateDropdown,
    FileIcon,
    FileHistory,
    FileRecord,
    FileFlow,
    ReviewPop
  },
  data() {
    return {
      hasNewfilePriv: false,
      deleteModel: false,
      deleteData: {},
      isMyTask: Boolean,
      isMyAvailable: Boolean,
      receiveIcon: "#icon-no-receive",
      editIcon: "#icon-no-edit",
      failIcon: "#icon-no-fail",
      reviewIcon: "#icon-no-review",
      qcIcon: "#icon-no-qc",
      approveIcon: "#icon-no-approve",
      study: {
        pageNum: 1,
        pageSize: 6
      },
      studyColumns: [
        {
          type: "index",
          width: 80,
          align: "center",
          title: this.$t("title.numerical")
        },
        {
          title: this.$t("title.study"),
          key: "study_name",
          align: "center"
        },
        {
          title: this.$t("title.site"),
          key: "site_name",
          align: "center"
        },
        {
          title: " ",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [linkButton(this, h, params)]);
          }
        }
      ],
      studyData: [],
      taskCount: {},
      myTask: {
        pageNum: 1,
        pageSize: 2
      },
      myTaskData: [],
      myAvailable: {
        pageNum: 1,
        pageSize: 1
      },
      myAvailableData: {}
    };
  },
  methods: {
    rowClassName(row, index) {
      if (row.checked) {
        return "ivu-table-row-highlight";
      }
      return "";
    },
    // 数据处理
    dropdownItemFun(items) {
      let data = {
        edit: items.edit,
        delete: items.delete,
        record: items.record,
        history: items.history,
         download:params.row.download,
        sendReview: items.sendReview,
        sendQc: items.sendQc,
        sendApprove: items.sendApprove,
        toReview: items.toReview,
        toQc: items.toQc,
        toApprove: items.toApprove,
        acceptTask: items.acceptTask
      };
      return data;
    },
    // 请求 Study Site 列表
    getCommonStudySiteList() {
      ApiGetCommonStudySiteList(this.study).then(res => {
        if (res.code == "success") {
          this.studyData = res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].checked) {
              sessionStorage.setItem("studyId", res.data[i].study_id);
              sessionStorage.setItem("siteId", res.data[i].site_id);
              return;
            }
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    /**
     * 文件发送流程
     * @param {Object} param 发送请求参数
     */
    sendTo(param, val) {
      ApiGetFileSendTo(param).then(res => {
        if (res.code == "success") {
          if (val == "task") {
            this.getMyTask();
          } else {
            this.getMyavailable();
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击删除按钮
    fileDeleteFun(param, val) {
      this.deleteModel = true;
      this.deleteData = param;
      this.deleteData.type = val;
    },
    // 请求 当前用户创建的文件的状态数
    getTaskCount() {
      ApiGetTaskCount().then(res => {
        if (res.code == "success") {
          this.taskCount = res.data;
          if (res.data.receiveNum != 0) {
            this.receiveIcon = "#icon-receive";
          } else {
            this.receiveIcon = "#icon-no-receive";
          }
          if (res.data.editNum != 0) {
            this.editIcon = "#icon-edit";
          } else {
            this.editIcon = "#icon-no-edit";
          }
          if (res.data.failNum != 0) {
            this.failIcon = "#icon-fail";
          } else {
            this.failIcon = "#icon-no-fail";
          }
          if (res.data.reviewNum != 0) {
            this.reviewIcon = "#icon-review";
          } else {
            this.reviewIcon = "#icon-no-review";
          }
          if (res.data.qcNum != 0) {
            this.qcIcon = "#icon-qc";
          } else {
            this.qcIcon = "#icon-no-qc";
          }
          if (res.data.approveNum != 0) {
            this.approveIcon = "#icon-approve";
          } else {
            this.approveIcon = "#icon-no-approve";
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 请求 我的任务
    getMyTask() {
      ApiGetMyTask(this.myTask).then(res => {
        if (res.code == "success") {
          if (res.data.length > 0) {
            this.isMyTask = true;
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].fileStatus = fileStatus(this, res.data[i].fileStatus);
              res.data[i].updatedTime = moment(res.data[i].updatedTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            }
            this.myTaskData = res.data;
          } else {
            this.isMyTask = false;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 请求可接受任务
    getMyavailable() {
      ApiGetMyavailable(this.myAvailable).then(res => {
        if (res.code == "success") {
          if (res.data[0]) {
            this.isMyAvailable = true;
            res.data[0].fileStatus = fileStatus(this, res.data[0].fileStatus);
            res.data[0].updatedTime = moment(res.data[0].updatedTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            this.myAvailableData = res.data[0];
          } else {
            this.isMyAvailable = false;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击进入
    postCommonStudy(row) {
      let data = {
        studyId: row.study_id,
        siteId: row.site_id
      };
      ApiPostCommonStudy(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t("note.changeSucc"));
          sessionStorage["siteName"] = row.site_name;
          sessionStorage["studyName"] = row.study_name;
          // this.$store.commit("setStudyName", row.study_name);
          // this.$store.commit("setSiteName", row.site_name);
          Util.setPriMenuList(res.data.menu);
          //保存权限
          localStorage.setItem("privilege", JSON.stringify(res.data.privilege));
          location.reload();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },

    //删除保存
    deleleSave() {
      let _data = {
        fileId: this.deleteData.fileId,
        updatedTime: this.deleteData.updatedTime
      };
      ApiGetFileDelete(_data).then(res => {
        if (res.code == "success") {
          this.deleteModel = false;
          this.$Message.success(this.$t("note.delSucc"));
          if (this.deleteData.type == "task") {
            this.getMyTask();
          } else {
            this.getMyavailable();
          }
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //文件审阅审批保存
    flowSave(data) {
      ApiPostFlowSave(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$store.commit("flowModalToggle", false);
          this.$store.commit("signModalToggle", false);
          this.getMyTask();
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  computed: {
    menuList() {
      return JSON.parse(localStorage.getItem("menuList"));
    },
    privilege() {
      return JSON.parse(localStorage.getItem("privilege"));
    }
  },
  watch: {
    $route(to, from) {
      this.getTaskCount();
      this.getMyTask();
      this.getMyavailable();
    }
  },
  mounted() {
    this.getCommonStudySiteList();
    this.getTaskCount();
    this.getMyTask();
    this.getMyavailable();
    //判断是否有新建文件权限,如果没有新建文件的权限，则首页只展示site列表，其余模块均不显示
    let _menuList = this.menuList;
    let _list = _menuList.filter((currentVal, index) => {
      return currentVal.priv == "home";
    });
    if (_list[0].children && _list[0].children.length > 0) {
      for (let [index, elem] of _list[0].children.entries()) {
        if (elem.priv == "newFile") {
          this.hasNewfilePriv = true;
          break;
        }
      }
    } else {
      this.hasNewfilePriv = false;
    }
  }
};
</script>

<style lang="scss">
@import "../../../common/css/mixin.scss";
.home {
  .home-left {
    width: 70%;
    display: inline-block;
  }
  .home-right {
    display: inline-block;
    margin-left: 1%;
    width: 28.5%;
    vertical-align: top;
    a {
      color: #495060;
    }
    .right-list {
      @include commonStyle($width: 100%, $height: 100px, $borderRadius: 4px);
      margin-bottom: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      div {
        text-align: center;
      }
      .status {
        width: 45%;
        font-size: 17px;
      }
      .num {
        width: 10%;
        font-size: 27px;
      }
      .icon {
        width: 40%;
        font-size: 56px;
      }
    }
  }
  .new-file {
    text-align: center;
    @include commonStyle();
    .icon {
      font-size: 55px;
      margin-top: 100px;
    }
    p {
      font-size: 17px;
      margin-top: 10px;
    }
  }
  .study-list {
    max-height: 330px;
    overflow: hidden;
    margin-left: 1%;
    position: relative;
    @include commonStyle($width: 73%);
    .ivu-table th {
      border-top: none;
    }
    thead {
      font-size: 16px;
    }
    .studys {
      font-size: 14px;
      position: absolute;
      top: 12px;
      right: 20px;
      z-index: 10;
    }
  }
  .acceptance-list {
    margin-top: 10px;
    @include commonStyle($width: 100%, $height: 200px);
  }
  .conduct-list {
    margin-top: 10px;
    @include commonStyle($width: 100%, $height: 120px);
  }
  .content-none {
    padding: 10px 30px;
  }
  .title {
    font-size: 14px;
    margin: 0 20px;
    padding: 10px 0;
    .title-span {
      float: right;
      margin-top: 5px;
      cursor: pointer;
    }
  }
  .cell-list {
    @include cellList();
    div {
      text-align: center;
    }
    .wrapper {
      width: 40%;
      padding-left: 10px;
      .icon {
        font-size: 40px;
      }
      .info {
        text-align: left;
        overflow: hidden;
        .name,
        .dir {
          @include fontoVerflow();
        }
      }
    }
    .f-code {
      width: 10%;
      @include fontoVerflow();
    }
    .f-version {
      width: 10%;
      @include fontoVerflow();
    }
    .f-time {
      width: 10%;
    }
    .f-status {
      width: 20%;
    }
    .f-operate {
      width: 10%;
      .icon {
        font-size: 30px;
      }
    }
  }
}
</style>

