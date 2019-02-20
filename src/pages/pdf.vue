/*
 * @Author: chengshanshan 
 * @Date: 2018-08-27 10:05:43 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-12 15:46:21
 */

<template>
  <div class="wrapper" ref="outWrapprer">
    <Row>
      <Col :span="grid.left">
      <div class="left" ref="pdfWrapper">
        <iframe :src="url" width="100%" height="100%" id="pdfIframe"></iframe>
      </div>
      </Col>
      <Col :span="grid.right">
      <div class="right" v-if="!isHistoryView">
        <h3 class="title" ref="titleWrapper" v-if="isOperate"> {{signTypeMap.get(signTypeId)}}</h3>
        <div class="operate" ref="rightWrapper">
          <div class="flow" v-if="isOperate">
            <div v-for="(item,index) in operateList" :key="index">
              <Row>
                <Col :sm="10" :md="4"> {{item.signer}}
                <Tooltip v-if="item.allograph !=0" :content="$t('title.byAllograph',{username:item.allographName})" placement="right">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-daiqianqizhi"></use>
                  </svg>
                </Tooltip>
                </Col>
                <Col :sm="14" :md="9">{{item.signTime | timeFormat}}</Col>
                <Col :sm="12" :md="8">{{signTypeMap.get(item.signTypeId)}}&nbsp;{{item.success ? $t('operation.pass'):$t('operation.reject')}}</Col>
                <Col :sm="12" :md="3">
                <a v-if="item.isReapel" @click="repeal(item)">{{$t('operation.repeal')}}</a>
                </Col>
              </Row>
              <split></split>
            </div>
            <Form ref="processForm" :model="processForm" v-if="signaturePriv" class="process-form">
              <!-- 代签 -->
              <div v-if="isAllograph">
                <!--  不是指定人员，请选择被代签的人员:-->
                <p>{{$t("title.allographTitle")}}</p>
                <FormItem prop="allograph">
                  <RadioGroup v-model="processForm.allograph">
                    <Radio v-for="(item,index) of allographList" :key="index" :label="item.userId">{{item.username}}</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
              <FormItem prop="success">
                <Row type="flex" justify="space-between">
                  <Col span="16">
                  <RadioGroup v-model="processForm.success">
                    <Radio label="1">{{$t('operation.pass')}}</Radio>
                    <Radio label="0">{{$t('operation.reject')}}</Radio>
                  </RadioGroup>
                  </Col>
                  <Col span="8" class="text-r">
                  <Button v-if="processForm.success=='1'" shape="circle" size="small" @click="processSave('processForm')">{{$t('operation.save')}}</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="processForm.success=='0'" prop="common" :rules="{ required: true, message:' ', trigger: 'blur' }">
                <Input type="textarea" v-model="processForm.common"></Input>
              </FormItem>
              <div class="clear-float" v-if="processForm.success=='0'">
                <split></split>
                <Button class="f-right" shape="circle" size="small" @click="processSave('processForm')">{{$t('operation.save')}}</Button>
              </div>
            </Form>
          </div>
          <!-- 留言板 -->
          <div class="note">
            <p>{{$t('title.MessageBoard')}}</p>
            <split></split>
            <Form ref="noteForm" :model="noteForm" class="note-form">
              <FormItem prop="words">
                <Input type="textarea" v-model="noteForm.words" @on-focus="wordsFocus" @on-blur="wordsBlur"></Input>
              </FormItem>
              <split></split>
              <p class="clear-float">
                <Button class="f-right" shape="circle" size="small" @click="noteSave('noteForm')" v-show="noteSaveShow">{{$t('operation.save')}}</Button>
              </p>
            </Form>
            <ul class="list">
              <li class="cell" v-for="item in noteList">
                <div>
                  <label> {{ item.username }} : </label>
                  {{ item.words }}
                </div>
                <p class="time">
                  {{ item.createdTime | timeFormat }}
                  <Icon v-show="currentUserId == item.userId" type="ios-close-empty" size="25" @click="deletFileWord(item)"></Icon>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </Col>
    </Row>
    <Modal v-model="signModel" :title="$t('title.eSignature')">
      <div>
        <Form ref="signForm" :model="signForm" :label-width="80" :rules="signFormRule">
          <FormItem :label="$t('title.account')">
            {{email}}
          </FormItem>
          <!-- 电子签名 -->
          <FormItem :label="$t('title.password')" prop="password">
            <Input type="password" v-model="signForm.password"></Input>
          </FormItem>
          <FormItem prop="check">
            <CheckboxGroup v-model="signForm.check">
              <Checkbox label="checked">
                {{$t("title.signCheck")}}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button long type="success" @click="signProcessSave('signForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import md5 from "js-md5";
import Split from "components/units/split";
import qs from "qs";
import moment from "moment";
import { resCode } from "common/js/code";
import {
  ApiGetfileFlow,
  ApiPostFlowSave,
  ApiPostNoteSave,
  ApiGetNoteList,
  ApiDeletFileWord,
  ApiGetRepealFlow,
  ApiGetUrl
} from "@/api/pdf-api";
export default {
  components: {
    Split
  },
  data() {
    return {
      grid: {
        left: 18,
        right: 6
      },
      url: "", //iframe 的url
      noteSaveShow: false, // 批注提交按钮
      signTypeMap: new Map([
        [1, this.$t("file.processing")],
        [2, this.$t("title.review")],
        [3, this.$t("title.qc")],
        [4, this.$t("title.approve")]
      ]),
      signModel: false,
      noteForm: {
        words: "",
        fileVersionId: this.$route.params.fileVersionId
      },

      signFormRule: {
        password: [{ required: true, message: " ", trigger: "change" }],
        check: [
          {
            required: true,
            type: "array",
            min: 1,
            message: this.$t("note.checkConfirm"),
            trigger: "change"
          }
        ]
      },
      noteList: []
    };
  },

  computed: {
    isHistoryView() {
      //如果是历史版本查看，则不显示右边
      let _type = this.$route.query.type;
      if (_type == "history") {
        this.grid.left = 24;
        return true;
      } else {
        return false;
      }
    },
    fileId() {
      return this.$route.params.fileId;
    },
    fileVersionId() {
      return this.$route.params.fileVersionId;
    },
    currentUserId() {
      return this.$store.state.docDocument.flow.currentUserId;
    },
    signTypeId() {
      return this.$store.state.docDocument.flow.signTypeId;
    },
    updatedTime() {
      //文件更新时间
      return this.$store.state.docDocument.flow.updatedTime;
    },
    email() {
      return this.$store.state.docDocument.flow.email;
    },
    signaturePriv() {
      //是否有当前流程的操作权限
      return this.$store.state.docDocument.flow.signaturePriv;
    },
    isSign() {
      //是否电子签名
      return this.$store.state.docDocument.flow.isSign;
    },
    operateList() {
      return this.$store.state.docDocument.flow.operateList;
    },
    allographList() {
      //代签人员list
      return this.$store.state.docDocument.flow.allographList;
    },

    isOperate() {
      return this.$store.state.docDocument.flow.isOperate;
    }, //是否可以操作流程
    processForm() {
      return this.$store.state.docDocument.flow.processForm;
    },
    signForm() {
      return this.$store.state.docDocument.flow.signForm;
    },
    isAllograph() {
      //是否是代签
      let _arr = [];
      _arr = this.allographList.filter((currenval, index, arr) => {
        return currenval.userId == this.currentUserId;
      });
      if (_arr.length > 0 && this.signaturePriv) {
        return false;
      } else if (_arr.length == 0 && this.signaturePriv) {
        return true;
      }
    }
  },
  methods: {
    init() {
      if (!this.isHistoryView) {
        this.$store.commit("getFlowMsg", {
          vm: this,
          data: { fileId: this.fileId }
        });
        this.getNoteList();
      }
      this.getUrl();     
    },
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outWrapprer.offsetHeight;
        this.$refs.pdfWrapper.style.height = `${outH}px`;
        if (!this.isHistoryView && this.isOperate) {
          let titleH = this.$refs.titleWrapper.offsetHeight;
          this.$refs.rightWrapper.style.height = `${outH - titleH}px`;
        }
      });
    },
    getUrl() {
      ApiGetUrl(this.fileVersionId).then(res => {
        if (res.code == "success") {
          if (res.data.fileType == "pdf") {
            this.url = `/static/pdf/web/viewer.html?file=${res.data.filePath.replace(/http:\/\//,"https://")}`;
          } else {
            this.url = res.data.filePath;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 失去焦点和 聚焦方法
    wordsFocus() {
      this.noteSaveShow = true;
    },
    wordsBlur() {
      if (this.noteForm.words == "") {
        this.noteSaveShow = false;
      } else {
        this.noteSaveShow = true;
      }
    },

    processSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.isSign) {
            //需要签名弹出签名model
            this.signModel = true;
            this.signForm.password = "";
            this.signForm.check = false;
            this.$refs["signForm"].resetFields();
          } else {
            //不需要签名保存
            this.flowDataSave();
          }
        }
      });
    },
    //需要签名保存
    signProcessSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.processForm.password = this.signForm.password;
          this.flowDataSave();
        }
      });
    },
    // 文件审阅审批保存提交数据
    flowDataSave() {
      let data = {};
      data.updatedTime = moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss");
      data.fileId = this.fileId;
      data.signTypeId = this.signTypeId;
      data.sign = this.isSign;
      data.success = this.processForm.success;
      //驳回需要填写原因
      if (this.processForm.success == "0") {
        data.comment = this.processForm.common;
      }
      //需要签名
      if (this.isSign) {
        data.password = md5(this.signForm.password);
      }
      //代签时signerId是代签的人员的id，否则为当前用户的id
      if (this.isAllograph) {
        data.signerId = this.processForm.allograph;
        data.allograph = this.currentUserId;
      } else {
        data.signerId = this.currentUserId;
        data.allograph = 0;
      }
      //操作保存
      ApiPostFlowSave(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$store.commit("getFlowMsg", {
            vm: this,
            data: { fileId: this.fileId }
          });
          this.signModel = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //撤回
    repeal(params) {
      let _data = {
        fileId: this.fileId,
        signTypeId: params.signTypeId,
        userId: params.signerId,
        updateTime: moment(this.updatedTime).format("YYYY-MM-DD HH:mm:ss"),
        success: params.success
      };
      ApiGetRepealFlow(_data).then(res => {
        if (res.code == "success") {
          this.$store.commit("getFlowMsg", {
            vm: this,
            data: { fileId: this.fileId }
          });
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    getNoteList() {
      ApiGetNoteList(this.fileVersionId).then(res => {
        if (res.code == "success") {
          this.noteList = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    noteSave(name) {
      //备注保存
      if (this.noteForm.words != "") {
        ApiPostNoteSave(qs.stringify(this.noteForm)).then(res => {
          if (res.code == "success") {
            this.$refs[name].resetFields();
            this.noteSaveShow = false;
            this.getNoteList();
          } else {
            this.$Message.error(resCode(this, res.code));
          }
        });
      }
    },
    // 删除备注
    deletFileWord(data) {
      let id = data.leaveWordId + "/" + data.userId;
      ApiDeletFileWord(id).then(res => {
        if (res.code == "success") {
          this.getNoteList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  mounted() {
    this.init();
    this.computeHeight();
  },
  filters: {
    timeFormat: function(value) {
      if (!value) {
        return "";
      } else {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    proResult: function(value) {
      if (value) {
        return this.$t("operation.pass");
      } else {
        return this.$t("operation.reject");
      }
    }
  },
  watch: {
    $route(to, from) {
      this.computeHeight();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/css/variable.scss";
@import "../common/css/mixin.scss";
.f-right {
  float: right;
}
.clear-float {
  @include clearFlot();
}
.text-r {
  text-align: right;
}
.process-form,
.note-form {
  .ivu-form-item {
    margin-bottom: 0;
  }
}
.wrapper {
  height: 100%;
  overflow: hidden;
  .title {
    font-size: 20px;
    padding: 10px;
  }
  .operate {
    overflow: auto;
    .flow {
      background: #f7f7f7;
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 10px;
      .history {
        padding-bottom: 10px;
      }

      .cell {
        display: flex;
        justify-content: space-between;
      }
    }
    .note {
      background: #f7f7f7;
      border-radius: 5px;
      padding: 10px;
      @include clearFlot();
    }
    .list {
      margin-top: 10px;
      .cell {
        border-top: 1px solid $border-color;
        padding: 10px 5px;
        .ivu-icon {
          float: right;
          cursor: pointer;
          width: 20px;
          height: 20p;
        }
        label {
          font-weight: bold;
        }
        .time {
          color: $font-light-color;
        }
      }
    }
  }
}
</style>


