/*
 * @Author: chengshanshan 
 * @Date: 2018-08-27 11:01:43 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-12 15:46:47
 * @instraction: 文件审阅、 qc、批注流程组件
 */

<template>
  <div>
    <Modal v-model="flowModel" :mask-closable="false" :closable="false">
      <div slot="header">
        <div class="heade">
          <strong> {{signTypeMap.get(signTypeId)}}</strong>
          <Icon type="close-round" @click="cancel"></Icon>
        </div>
      </div>
      <div>
        <div v-for="(item,index) in operateList" :key="index">
          <Row>
            <Col :sm="10" :md="6">{{item.signer}}
            <Tooltip v-if="item.allograph !=0" :content="$t('title.byAllograph',{username:item.allographName})">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-daiqianqizhi"></use>
              </svg>
            </Tooltip>
            </Col>
            <Col :sm="14" :md="9">{{item.signTime | timeFormat}}</Col>
            <Col :sm="12" :md="6">{{signTypeMap.get(item.signTypeId)}}&nbsp;{{item.success ? $t('operation.pass'):$t('operation.reject')}}</Col>
            <Col :sm="12" :md="3">
            <Button shape="circle" size="small" v-if="item.isReapel" @click="repeal(item)">{{$t('operation.repeal')}}</Button>
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
            <RadioGroup v-model="processForm.success">
              <Radio label="1">{{$t('operation.pass')}}</Radio>
              <Radio label="0">{{$t('operation.reject')}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="processForm.success=='0'" prop="common" :rules="{ required: true, message:' ', trigger: 'blur' }">
            <Input type="textarea" v-model="processForm.common"></Input>
          </FormItem>
          <split></split>
        </Form>
      </div>
      <p slot="footer">
        <Button type="success" long @click="processSave('processForm')">{{$t('operation.save')}}</Button>
      </p>

    </Modal>
    <Modal v-model="signModel" :mask-closable="false" :closable="false">
      <div slot="header">
        <div class="heade">
          <strong> {{$t('title.eSignature')}}</strong>
          <Icon type="close-round" @click="signCancel"></Icon>
        </div>
      </div>
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
import Split from "components/units/split";
import md5 from "js-md5";
import qs from "qs";
import moment from "moment";
import { resCode } from "common/js/code";
import {
  ApiGetfileFlow,
  ApiPostFlowSave,
  ApiPostNoteSave,
  ApiGetNoteList,
  ApiDeletFileWord,
  ApiGetRepealFlow
} from "@/api/pdf-api";
export default {
  components: {
    Split
  },
  data() {
    return {
      signTypeMap: new Map([
        [1, this.$t("file.processing")],
        [2, this.$t("title.review")],
        [3, this.$t("title.qc")],
        [4, this.$t("title.approve")]
      ]),
      signModal: false,
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
      }
    };
  },

  computed: {
    flowModel() {
      return this.$store.state.docDocument.flow.flowModel;
    },
    signModel() {
      return this.$store.state.docDocument.flow.signModel;
    },
    fileId() {
      return this.$store.state.docDocument.flow.fileId;
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
    cancel() {
      this.$store.commit("flowModalToggle", false);
    },
    signCancel() {
      this.$store.commit("signModalToggle", false);
    },
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
    processSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.isSign) {
            //需要签名弹出签名model
            this.$store.commit("signModalToggle", true);
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
      this.$emit("flow-save", data);
    }
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
  }
};
</script>
<style lang="scss" scoped>
.heade {
  display: flex;
  justify-content: space-between;
  padding: 5px 16px;
  color: #1c2438;
}
.process-form {
  .ivu-form-item {
    margin-bottom: 0;
  }
}
</style>



