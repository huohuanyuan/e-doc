/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-31 18:42:12 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-18 15:18:04
 * 新建文件
 */
<template>
  <div class="new-file">
    <Row :gutter="16">
      <Col span="5">
      <div class="templet-div" v-if="templetList.length > 0">
        <div class="templet-list" v-for="item in templetList">
          <div class="templet-name">
            {{ item.templateName }}
            <div class="temp-operation">
              <span @click="deletTmpl(item.tmplId)">
                <Icon type="ios-trash-outline" /> </span>
            </div>
          </div>
          <div class="templet-content">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wendang"></use>
            </svg>
          </div>
          <div class="templet-footer" @click="getTmplDetail(item.tmplId)">
            {{$t('title.userTemplate')}}
          </div>
        </div>
      </div>
      <div class="templet-no" v-else> {{$t('title.noTemplate')}} </div>
      </Col>
      <Col span="14">
      <div>
        <div class="file-type">
          <div :class="{ 'active': isActive}" @click="customizeFun('1')"> {{$t('title.customFolder')}}</div>
          <div :class="{ 'active': !isActive}" @click="customizeFun('0')"> {{$t('title.tmfFolder')}} </div>
        </div>
        <div>
          <Upload multiple ref="upload" type="drag" :on-remove="removeFile" :on-exceeded-size="exceededSize" :data="ossParams" :action="actionSrc" :headers="header" :before-upload="handleUpload" :show-upload-list="true" :on-success="uploadSuccess" :format="fileTypes" :on-format-error="handleFormatError">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="45" style="color: #2dd6aa"></Icon>
              <p>{{$t('file.dragUploadFile')}}</p>
            </div>
          </Upload>
          <div class="file-list" v-if="file.length > 0">
            <span class="file-span"> {{$t('file.fileUpload')}} </span>
            <p v-for="(item, index) in file" :class="[{exceeded:item.isExceededSize},'upload-list-file']">
              <span class="file-name">
                <Icon type="document-text"></Icon>{{ item.name }}
              </span>
              <span class="close" @click="delectFile(item)">
                <Icon type="ios-close-empty"></Icon>
              </span>
              <span class="file-size">{{ item.size | formatFileSize}}
                <span v-show="item.isExceededSize">{{$t('note.fileLarge')}}</span>
              </span>
            </p>
            <Button class="update-btn" type="ghost" icon="ios-cloud-upload-outline" @click="upload" long> {{$t('operation.upload')}} </Button>
          </div>

        </div>
        <div class="file-input">
          <Form ref="customizeForm" :model="customizeForm" :label-width="130" label-position="left" :rules="customizeValidate">
            <div v-if="fileNameShow">
              <FormItem prop="fileName" :label="$t('file.name')" class="dire">
                <Input v-model.trim="customizeForm.fileName"></Input>
              </FormItem>
              <FormItem prop="fileCode" :label="$t('file.code')">
                <Input v-model.trim="customizeForm.fileCode"></Input>
              </FormItem>
            </div>
            <!--  多文件上传  -->
            <div v-else>
              <FileNameList :fileSuccessData=(item) @onChangeFun="fileNameListFun" v-for="item in fileSuccessList" :key="item.fileOid"> </FileNameList>
            </div>

            <FormItem :label="$t('title.folder')" class="dire" v-if="isZoneDier">
              <span>{{customizeForm.customizeDire}}</span>
              <a class="leadership-a" @click="showCustomizeDireModal"> {{$t('title.selectFloder')}} </a>
            </FormItem>
            <div v-else>
              <FormItem prop="zoneId" :label="$t('title.zone')">
                <Select v-model="customizeForm.zoneId" filterable @on-change="zoneSelect" clearable ref="zoneId">
                  <Option v-for="item in zoneDataList[0]" :value="item.zoneId" :key="item.zoneId">{{ item.zoneName }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="sectionId" :label="$t('title.section')">
                <Select v-model="customizeForm.sectionId" filterable @on-change="sectionSelect" clearable ref="sectionId">
                  <Option v-for="item in zoneDataList[1]" :value="item.sectionId" :key="item.sectionId">{{ item.sectionName }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="artifactId" :label="$t('title.artifact')">
                <!-- @on-change="artifactSelect('123',$event)" -->
                <Select v-model="customizeForm.artifactId" filterable @on-change="artifactSelect" clearable ref="artifactId">
                  <Option v-for="item in zoneDataList[2]" :value="item.artifactId" :key="item.artifactId">{{ item.artifactName }}</Option>
                </Select>
              </FormItem>
            </div>
            <FormItem prop="effectiveDate" :label="$t('file.effectiveDate')">
              <DatePicker :editable='false' type="date" v-model="customizeForm.effectiveDate"></DatePicker>
            </FormItem>
            <FormItem prop="expirationDate" :label="$t('file.expirationDate')">
              <DatePicker :editable='false' type="date" v-model="customizeForm.expirationDate"></DatePicker>
            </FormItem>
            <FormItem prop="comment" :label="$t('file.comment')">
              <Input v-model="customizeForm.comment" type="textarea" :rows="2"></Input>
            </FormItem>
            <p class="excision-p"> {{$t('title.templateInfo')}} </p>
            <FormItem prop="siteId" :label="$t('title.belongSite')">
              <Select v-model="customizeForm.siteId" filterable>
                <Option v-for="item in manageStudySites" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="vfId" :label="$t('file.versionType')">
              <Select v-model="customizeForm.vfId" @on-change="vfIdFun">
                <Option v-for="item in fileVersionFormat" :value="item.vfId" :key="item.vfId">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="versionNo" :label="$t('file.versionNo')" v-if="versionNoShow">
              <Input v-model.trim="customizeForm.versionNo"></Input>
            </FormItem>

            <FormItem prop="central" :label="$t('title.libraryType')">
              <RadioGroup v-model="customizeForm.central">
                <Radio label="true"> {{$t('file.submitfile')}} </Radio>
                <Radio label="false"> {{$t('file.noSubmit')}} </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="creatorId" :label="$t('title.owner')">
              <Select v-model="customizeForm.creatorId" filterable>
                <Option v-for="item in addFileList" :value="item.user_id" :key="item.user_id">{{item.username}}</Option>
              </Select>
            </FormItem>
            <FormItem prop="reqReview" :label="$t('title.review')" class="in-block-div">
              <RadioGroup v-model="customizeForm.reqReview" @on-change="reqReviewFun">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>

            <FormItem prop="reviewSign" :label="$t('title.reviewSign')" v-if="show.isReqReview" class="in-block-div">
              <RadioGroup v-model="customizeForm.reviewSign">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="review" :label="$t('title.reviewer')" v-if="show.isReqReview">
              <Select v-model="customizeForm.review" multiple filterable @on-change="reviewAllShow">
                <Option v-for="item in reviewList" :value="item.user_id" :key="item.user_id">{{item.username}}</Option>
              </Select>
            </FormItem>

            <FormItem prop="isAllReview" :label="$t('title.reviewAll')" v-if="show.isAllReview">
              <RadioGroup v-model="customizeForm.isAllReview">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>
            <div>
              <FormItem prop="reqQc" :label="$t('title.qc')" class="in-block-div">
                <RadioGroup v-model="customizeForm.reqQc" @on-change="reqQcFun">
                  <Radio label="true"> {{$t('operation.yes')}} </Radio>
                  <Radio label="false"> {{$t('operation.no')}} </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem prop="qcSign" :label="$t('title.qcSign')" v-if="show.isReqQc" class="in-block-div">
                <RadioGroup v-model="customizeForm.qcSign">
                  <Radio label="true"> {{$t('operation.yes')}} </Radio>
                  <Radio label="false"> {{$t('operation.no')}} </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem prop="qc" :label="$t('title.qcer')" v-if="show.isReqQc">
                <Select v-model="customizeForm.qc" multiple filterable @on-change="qcAllShow">
                  <Option v-for="item in qcReviewList" :value="item.user_id" :key="item.user_id">{{item.username}}</Option>
                </Select>
              </FormItem>
              <FormItem prop="isAllQc" :label="$t('title.qcAll')" v-if="show.isAllQc">
                <RadioGroup v-model="customizeForm.isAllQc">
                  <Radio label="true"> {{$t('operation.yes')}} </Radio>
                  <Radio label="false"> {{$t('operation.no')}} </Radio>
                </RadioGroup>
              </FormItem>
            </div>

            <FormItem prop="approve" :label="$t('title.approveer')">
              <Select v-model="customizeForm.approve" multiple filterable @on-change="approveAllShow">
                <Option v-for="item in approveList" :value="item.user_id" :key="item.user_id">{{item.username}}</Option>
              </Select>
            </FormItem>
            <FormItem prop="approveSign" :label="$t('title.approveSing')" class="in-block-div">
              <RadioGroup v-model="customizeForm.approveSign">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="isAllApprove" :label="$t('title.approveAll')" v-show="show.isAllApprove" class="in-block-div">
              <RadioGroup v-model="customizeForm.isAllApprove">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>
            <div class="file-type">
              <div class="save-btn" @click="tmpShowFun('customizeForm')"> {{$t('operation.saveToTemplate')}} </div>
              <div class="active" @click="postSaveNewFile('customizeForm')"> {{$t('operation.save')}} </div>
            </div>
          </Form>
        </div>
      </div>
      </Col>

      <Col span="5">
      <div class="explain">
        <p> {{$t('explain.explain')}} </p>
        <ul>
          <li> {{$t('explain.line1')}} </li>
          <li> {{$t('explain.line2')}} </li>
          <li> {{$t('explain.line3')}}</li>
          <li> {{$t('explain.line4',{"list":fileTypesName})}}</li>
          <li> {{$t('explain.line5')}}</li>
          <li> {{$t('explain.line6')}}</li>

        </ul>
      </div>
      </Col>
    </Row>
    <!--  自定义目录模态框  -->
    <Modal v-model="customizeDireModal" :title="$t('title.selectFloder')" :width="680" :mask-closable="false">
      <div>
        <div class="nav-dir" v-if="clientShow">
          <el-tree :props="treeProps" :data="manageCustomFind" :render-content="renderContent" @node-click="currentCh">
          </el-tree>
        </div>
        <p v-else> {{$t('title.noFolderInfo')}} </p>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="saveCustomizeDire">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
    <!-- 保存模版名字模态框 -->
    <Modal v-model="tmpModal" :title="$t('title.editTemplate')" :mask-closable=false :width="500">
      <Form :model="newTmpFrom" ref="newTmpFrom" :rules="newTmpValidate" :label-width="100">
        <FormItem prop="templateName" :label="$t('title.templateName')">
          <Input v-model.trim="newTmpFrom.templateName"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="postTmpl('newTmpFrom')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";

import {
  ApiGetFileTypes,
  ApiGetFileVersionFormat,
  ApiGetManageStudySites,
  ApiGetFileUserByPrivilege,
  ApiGetManageCustomFind,
  ApiGetFileFolders,
  ApiPostSaveNewFile,
  ApiPostTmpl,
  ApiGetTmpl,
  ApiDeletTmpl,
  ApiDeletFile,
  ApiGetTmplDetail,
  ApiGetOssParams
} from "@/api/file/file";
import { resCode, onlineViewType } from "@/common/js/code.js";
import { UUID, UUIDKey } from "@/common/js/common.js";
import FileList from "components/file-list";
import FileNameList from "components/file-name-list";
import moment from "moment";
import md5 from "js-md5";
export default {
  components: {
    FileList,
    FileNameList
  },
  data() {
    return {
      pdfMaxSize: 50 * 1024, //PDF文件最大50M 单位：KB
      otherMaxSize: 10 * 1024, //其他类型支持在线查看的文件最大10M 单位：KB

      treeProps: {
        children: "folderList",
        label: "folderName"
      },
      header: {
        Authorization: sessionStorage.getItem("token")
      },
      actionSrc: "https://m-doc.oss-cn-beijing.aliyuncs.com", // 上传文件路径
      ossParams: {
        success_action_status: "200"
      },
      fileUuid: new Map(),
      file: [], // 文件
      templetList: [], // 模版list
      clientShow: true, // 是否显示自定义目录 文字提示
      fileNameShow: true, //  是否显示多个文件名
      fileSuccessList: [],
      loadingStatus: false,
      isActive: true,
      isZoneDier: true,
      customizeDireModal: false,
      versionNoShow: false, // 版本号是否显示
      tmpModal: false, // 新建模版模态框
      customizeForm: {
        siteId: "",
        vfId: "",
        fileName: "",
        fileCode: "",
        customizeDire: "", // 显示已经选好的自定义目录
        folderType: 1,
        versionNo: "",
        central: "true",
        reqReview: "false",
        reviewSign: "true",
        review: [],
        isAllReview: "true",
        reqQc: "false",
        qcSign: "true",
        qc: [],
        isAllQc: "true",
        approveSign: "false",
        approve: [],
        isAllApprove: "true",
        comment: "",
        artifactId: ""
      },
      show: {
        // 是否显示
        isReqReview: false,
        isAllReview: false,
        isReqQc: false,
        isAllQc: false,
        isAllApprove: false
      },
      customizeValidate: {
        // fileName: [{ required: true, message: " ", trigger: "blur" }],
        versionNo: [{ required: true, message: " ", trigger: "blur" }],
        siteId: [
          { required: true, message: " ", type: "number", trigger: "change" }
        ],
        vfId: [
          { required: true, message: " ", type: "number", trigger: "change" }
        ],
        central: [{ required: true, message: " ", trigger: "change" }],
        reqReview: [{ required: true, message: " ", trigger: "change" }],
        reviewSign: [{ required: true, message: " ", trigger: "change" }],
        creatorId: [
          { required: true, message: " ", type: "number", trigger: "change" }
        ],
        zoneId: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }
        ],
        sectionId: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }
        ],
        artifactId: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "change"
          }
        ],
        review: [
          {
            required: true,
            message: " ",
            type: "array",
            trigger: "change"
          }
        ],
        isAllReview: [{ required: true, message: " ", trigger: "change" }],
        reqQc: [{ required: true, message: " ", trigger: "change" }],
        qcSign: [{ required: true, message: " ", trigger: "change" }],
        qc: [
          {
            required: true,
            message: " ",
            type: "array",
            trigger: "change"
          }
        ],
        isAllQc: [{ required: true, message: " ", trigger: "change" }],
        approveSign: [{ required: true, message: " ", trigger: "change" }],
        approve: [
          {
            required: true,
            message: " ",
            type: "array",
            trigger: "change"
          }
        ],
        isAllApprove: [{ required: true, message: " ", trigger: "change" }]
      },
      fileTypes: [], // 可以上传的文件类型
      fileTypesName: "", //
      fileTypeIds: {}, //保存文件类型对应的id
      fileVersionFormat: [], // 版本类型
      manageStudySites: [], // 所有 site
      manageCustomFind: [], // 自定义目录
      zoneCustomList: [], // 自定义目录面包屑数组
      zoneDataList: [[], [], []], // 所有的tmf目录
      addFileList: [], // 拥有者list
      reviewList: [], // 审阅人 list
      qcReviewList: [], // qc人list
      approveList: [], // 批准人 list
      newTmpFrom: {
        templateName: ""
      },
      newTmpValidate: {
        templateName: [{ required: true, message: " ", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 点击切换 目录类型
    customizeFun(value) {
      this.isActive = !this.isActive;
      if (value == 0) {
        this.isZoneDier = false;
        this.customizeForm.folderType = 0;
      } else {
        this.isZoneDier = true;
        this.customizeForm.folderType = 1;
      }
    },
    // 请求可以上传的文件类型
    getFileTypes() {
      ApiGetFileTypes().then(res => {
        if (res.code == "success") {
          this.fileTypes = [];
          for (let [index, item] of res.data.entries()) {
            this.fileTypes.push(item.file_type_code);
            this.fileTypeIds[item.file_type_code] = item.file_type_id;
          }
          this.fileTypesName = this.fileTypes.join(" ");
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 请求版本类型列表
    getFileVersionFormat() {
      let _this = this;
      ApiGetFileVersionFormat().then(function(res) {
        if (res.code == "success") {
          _this.fileVersionFormat = res.data;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 请求当前study 下的所有 site
    getManageStudySites() {
      let _this = this;
      ApiGetManageStudySites().then(function(res) {
        if (res.code == "success") {
          if (_this.siteId == 0) {
            res.data.unshift({ siteId: 0, siteName: " -- " });
          }
          _this.manageStudySites = res.data;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 请求当前site 下的人员
    getFileUserByPrivilege(privilegeCode, siteId) {
      let data = {
        privilege_code: privilegeCode,
        site_id: siteId
      };
      let _this = this;
      ApiGetFileUserByPrivilege(data).then(function(res) {
        if (res.code == "success") {
          if (privilegeCode == "ADD_FILE") {
            _this.addFileList = res.data;
          } else if (privilegeCode == "REVIEW") {
            _this.reviewList = res.data;
          } else if (privilegeCode == "QC_REVIEW") {
            _this.qcReviewList = res.data;
          } else if (privilegeCode == "APPROVE") {
            _this.approveList = res.data;
          }
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 是否显示版本号
    vfIdFun(value) {
      if (value == 0) {
        this.versionNoShow = true;
      } else {
        this.versionNoShow = false;
      }
    },
    // 点击选择目录
    showCustomizeDireModal() {
      this.getManageCustomFind("0");
      this.customizeDireModal = true;
      this.zoneCustomList = [];
      this.customizeForm.customizeDire = "";
      this.customizeForm.artifactId = "";
    },
    renderContent(h, { node, data, store }) {
      return h(
        "p",
        {
          style: {
            display: "flex",
            "justify-content": "space-between",
            width: "100%",
            cursor: "pointer"
          }
        },
        [
          h("span", [
            h(
              "svg",
              {
                class: "icon",
                style: {
                  "font-size": "20px"
                },
                attrs: {
                  "aria-hidden": true
                }
              },
              [
                h("use", {
                  attrs: {
                    "xlink:href": "#icon-wenjianbao"
                  }
                })
              ]
            ),
            h(
              "span",
              {
                style: {
                  padding: "0 5px"
                }
              },
              data.folderName
            )
          ])
        ]
      );
    },
    currentCh(data, node, value) {
      this.customizeForm.artifactId = data.folderId;
      this.customizeForm.customizeDire = data.folderName;
    },
    // 请求自定义目录
    getManageCustomFind(parentId) {
      let data = {
        parentId: parentId
      };
      ApiGetManageCustomFind(data).then(res=> {
        if (res.code == "success") {
          if (res.data.length > 0) {
            this.clientShow = true;
            this.manageCustomFind = res.data;
          } else {
            this.clientShow = false;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 保存选择好的自定义目录
    saveCustomizeDire() {
      this.customizeDireModal = false;
    },
    // 请求tmf模版目录
    getFileFolders(folderGrade, studyId) {
      let data = {
        folderGrade: folderGrade,
        keyId: studyId
      };

      ApiGetFileFolders(data).then(res => {
        if (res.code == "success") {
          switch (folderGrade) {
            case "zone":
              this.$set(this.zoneDataList, 0, res.data);
              break;
            case "section":
              this.$set(this.zoneDataList, 1, res.data);
              this.$refs.sectionId.clearSingleSelect();
              this.$refs.artifactId.clearSingleSelect();
              break;
            case "artifact":
              this.$set(this.zoneDataList, 2, res.data);
              this.$refs.artifactId.clearSingleSelect();
              break;
            default:
              this.zoneDataList = [[], [], []];
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 选择 tmf模版目录后触发事件
    zoneSelect(value) {
      this.getFileFolders("section", value);
    },
    sectionSelect(value) {
      this.getFileFolders("artifact", value);
    },
    artifactSelect(val, $event) {
      //   this.getFileFolders("artifact", value);
    },
    // 是否审阅方法
    reqReviewFun() {
      if (this.customizeForm.reqReview == "false") {
        this.show.isReqReview = false;
        this.show.isAllReview = false;
      } else {
        this.show.isReqReview = true;
        this.show.isAllReview = true;
      }
    },
    // 是否显示 全是审阅
    reviewAllShow(value) {
      if (value.length > 1) {
        this.show.isAllReview = true;
      } else {
        this.show.isAllReview = false;
      }
    },
    // 是否qc方法
    reqQcFun() {
      if (this.customizeForm.reqQc == "false") {
        this.show.isReqQc = false;
        this.show.isAllQc = false;
      } else {
        this.show.isReqQc = true;
        this.show.isAllQc = true;
      }
    },
    // 是否显示全部qc
    qcAllShow(value) {
      if (value.length > 1) {
        this.show.isAllQc = true;
      } else {
        this.show.isAllQc = false;
      }
    },
    // 是否显示全部批准
    approveAllShow(value) {
      if (value.length > 1) {
        this.show.isAllApprove = true;
      } else {
        this.show.isAllApprove = false;
      }
    },
    // 上传文件之前
    handleUpload(file) {
      let _type = file.name.slice(file.name.lastIndexOf(".") + 1);
      //支持在线查看的文件需要限制文件大小pdf 50M 其他支持在线查看的文件上传不能超过10M
      if (onlineViewType.includes(_type)) {
        if (_type == "pdf" && file.size > this.pdfMaxSize * 1024) {
          file.isExceededSize = true;
        } else if (_type != "pdf" && file.size > this.otherMaxSize * 1024) {
          file.isExceededSize = true;
        } else {
          file.isExceededSize = false;
        }
      } else {
        file.isExceededSize = false;
      }
      //文件名+文件大小MD5加密
      let _key = UUIDKey(file.name, file.size);
      if (this.fileUuid.has(_key)) {
        this.$Message.error(`${file.name}已经选择，不能重复选择`);
      } else {
        this.fileUuid.set(_key, "");
        // 选择文件后 这里判断文件类型 保存文件 自定义一个keyid 值 方便后面删除操作
        let keyID = Math.random()
          .toString()
          .substr(2);
        file["keyID"] = keyID;
        // 保存文件到总展示文件数据里
        this.file.push(file); // 保存文件到需要上传的文件数组里
      }
      return false;
    },
    // 删除文件
    delectFile(file) {
      //从fileUuid中删除
      let _key = UUIDKey(file.name, file.size);
      this.fileUuid.delete(_key);
      // 删除总展示文件里的当前文件
      this.file = this.file.filter(function(item) {
        return item.keyID != file.keyID;
      });
    },
    exceededSize(file, fileList) {},
    // 上传文件
    upload() {
      let _path = "";
      //获取oss参数
      ApiGetOssParams().then(res => {
        if (res.code == "success") {
          _path = res.data.path;
          this.ossParams.OSSAccessKeyId = res.data.accessid;
          this.ossParams.policy = res.data.policy;
          this.ossParams.signature = res.data.signature;
          this.ossParams["x-oss-security-token"] = res.data.token;
          this.fileUuid = new Map();
          //过滤掉大小超出的文件
          let _uploadFiles = this.file.filter(item => {
            return !item.isExceededSize;
          });
          for (let i = 0; i < _uploadFiles.length; i++) {
            let item = _uploadFiles[i];
            let _type = item.name.slice(item.name.lastIndexOf(".") + 1);
            let _uuid = UUID();
            //文件名+文件大小MD5加密,将key与UUID一一对应存储
            let _key = UUIDKey(item.name, item.size);
            this.fileUuid.set(_key, _uuid);
            //上传oss上传
            this.ossParams.key = `${_path}${_uuid}.${_type}`;
            this.$refs.upload.post(item);
            // console.log(`${item.name}:${_uuid}`);
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 文件上传成功后的回调
    uploadSuccess(res, file, fileList) {
      let successData = {};
      this.$Message.success(file.name + this.$t("note.uploadSucc"));
      this.file = [];
      let lastIndex = file.name.lastIndexOf(".");
      let fileName = file.name.slice(0, lastIndex);
      successData.fileName = fileName;
      let _key = UUIDKey(file.name, file.size);
      successData.fileOid = this.fileUuid.get(_key);
      // console.log(`${file.name}:${successData.fileOid}`);
      let _type = file.name.slice(file.name.lastIndexOf(".") + 1);
      successData.fileTypeId = this.fileTypeIds[_type];
      this.fileSuccessList.push(successData);
      this.fileNameFun(this.fileSuccessList);
    },
    // 上传文件类型验证方法
    handleFormatError(file) {
      this.$Message.warning(file.name + this.$t("note.formatError"));
    },
    // 文件name list 数据处理
    fileNameFun(data) {
      if (data.length == 0) {
        this.fileNameShow = true;
        this.customizeForm.fileName = "";
      } else if (data.length == 1) {
        this.fileNameShow = true;
        this.customizeForm.fileName = data[0].fileName;
      } else {
        this.fileNameShow = false;
      }
    },
    // 多文件上传后文件名 和文件编码修改从子组件传过来的数据
    fileNameListFun(item) {
      for (let i = 0; i < this.fileSuccessList.length; i++) {
        if (item.fileOid == this.fileSuccessList[i].fileOid) {
          item.fileName = this.fileSuccessList[i].fileName;
          item.fielCode = this.fileSuccessList[i].fielCode;
        }
      }
    },
    // 删除已经上传的文件
    removeFile(file, fileList) {
      let type = file.name;
      let index = type.lastIndexOf(".");
      type = type.substring(index + 1, type.length);

      let id;
      if (file.response.code == "success") {
        id = file.response.data.fileOid + "." + type;

        // 删除存储已经上传的文件 name list
        this.fileSuccessList = this.fileSuccessList.filter(item => {
          return item.fileOid != file.response.data.fileOid;
        });
        this.fileNameFun(this.fileSuccessList);
        //从fileUuid中删除
        let _key = UUIDKey(file.name, file.size);
        this.fileUuid.delete(_key);
      }
      let _this = this;
      ApiDeletFile({
        fileName: id
      }).then(function(res) {
        if (res.code == "success") {
          _this.$Message.success(file.name + _this.$t("noet.delSucc"));
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 处理新建文件的数据
    sortSaveData(value) {
      let baseFileList = [];
      if (value == 0) {
        if (this.fileSuccessList.length == 0) {
          baseFileList.push({
            fileName: this.customizeForm.fileName,
            fileCode: this.customizeForm.fileCode
          });
        } else if (this.fileSuccessList.length == 1) {
          baseFileList.push({
            fileName: this.customizeForm.fileName,
            fileCode: this.customizeForm.fileCode,
            fileOid: this.fileSuccessList[0].fileOid,
            fileTypeId: this.fileSuccessList[0].fileTypeId
          });
        } else if (this.fileSuccessList.length > 1) {
          for (let i = 0; i < this.fileSuccessList.length; i++) {
            let data = {};
            data.fileName = this.fileSuccessList[i].fileName;
            data.fileCode = this.fileSuccessList[i].fileCode;
            data.fileOid = this.fileSuccessList[i].fileOid;
            data.fileTypeId = this.fileSuccessList[i].fileTypeId;
            baseFileList.push(data);
          }
        }
        if (this.customizeForm.effectiveDate) {
          this.customizeForm.effectiveDate = moment(
            this.customizeForm.effectiveDate
          ).format("YYYY-MM-DD");
        }

        if (this.customizeForm.expirationDate) {
          this.customizeForm.expirationDate = moment(
            this.customizeForm.expirationDate
          ).format("YYYY-MM-DD");
        }
      }

      let reviewListVar = [];
      if (this.customizeForm.review.length > 0) {
        for (let i = 0; i < this.customizeForm.review.length; i++) {
          var reviewObj = {};
          reviewObj.sign = this.customizeForm.reviewSign;
          reviewObj.multiParty = this.customizeForm.isAllReview;
          reviewObj.reviewerId = this.customizeForm.review[i];
          reviewListVar.push(reviewObj);
        }
      }

      let qcListVar = [];
      if (this.customizeForm.qc.length > 0) {
        for (let i = 0; i < this.customizeForm.qc.length; i++) {
          var qcObj = {};
          qcObj.sign = this.customizeForm.qcSign;
          qcObj.multiParty = this.customizeForm.isAllQc;
          qcObj.qcreviewerId = this.customizeForm.qc[i];
          qcListVar.push(qcObj);
        }
      }

      let approveListVar = [];
      if (this.customizeForm.approve.length > 0) {
        for (let i = 0; i < this.customizeForm.approve.length; i++) {
          var approveObj = {};
          approveObj.sign = this.customizeForm.approveSign;
          approveObj.multiParty = this.customizeForm.isAllApprove;
          approveObj.approverId = this.customizeForm.approve[i];
          approveListVar.push(approveObj);
        }
      }

      let data = {
        siteId: this.customizeForm.siteId, // 所属site
        vfId: this.customizeForm.vfId, // 版本类型
        versionNo: this.customizeForm.versionNo,
        folderType: this.customizeForm.folderType, // 文件类型
        central: this.customizeForm.central, // 是否 提交类型
        creatorId: this.customizeForm.creatorId, // 作者
        effectiveDate: this.customizeForm.effectiveDate, // 生效时间
        expirationDate: this.customizeForm.expirationDate, // 失效时间
        comment: this.customizeForm.comment, // 备注
        artifactId: this.customizeForm.artifactId, // 目录id
        reqReview: this.customizeForm.reqReview, // 是否审阅
        reqQc: this.customizeForm.reqQc, // 是否qc
        reqApprove: "true",
        baseFileList: baseFileList, // 文件名list
        reviewList: reviewListVar, // 审阅list
        qcReviewList: qcListVar, // qc list
        approveList: approveListVar // 批准list
      };
      return data;
    },
    // 新建文件保存
    postSaveNewFile(name) {
      if (this.customizeForm.fileName == "") {
        this.$Message.warning(this.$t("note.nameInput"));
        return false;
      }
      if (this.customizeForm.artifactId == "") {
        this.$Message.warning(this.$t("note.floderInput"));
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let formData = this.sortSaveData(0);
          if (formData.effectiveDate && formData.expirationDate) {
            if (
              moment(formData.expirationDate).isBefore(formData.effectiveDate)
            ) {
              this.$Message.warning(this.$t("note.dateError"));
              return false;
            }
          }

          ApiPostSaveNewFile(formData).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t("note.addSucc"));
              this.fileNameShow = true;
              this.customizeForm.fileName = "";
              this.customizeForm.fileCode = "";
              this.customizeForm.customizeDire = "";

              // 是否显示
              this.show.isReqReview = false;
              this.show.isAllReview = false;
              this.show.isReqQc = false;
              this.show.isAllQc = false;
              this.show.isAllApprove = false;

              this.fileSuccessList = [];
              this.$refs[name].resetFields();
              this.$refs.upload.clearFiles();
              this.fileUuid = new Map();
            } else if (res.code == "duplicate_file_name") {
              this.$Message.warning(res.data[0] + this.$t("note.reNameFile"));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //点击保存模版弹出模态框
    tmpShowFun(name) {
      if (this.templetList.length == 5) {
        this.$Message.warning(this.$t("note.templateLimt"));
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.tmpModal = true;
          this.$refs["newTmpFrom"].resetFields();
        }
      });
    },
    // 保存为模版
    postTmpl(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let formData = this.sortSaveData(1);
          formData.templateName = this.newTmpFrom.templateName;

          let _this = this;
          ApiPostTmpl(formData).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success(_this.$t("note.templateSucc"));
              _this.tmpModal = false;
              _this.getTmpl();
            } else {
              _this.$Message.error(resCode(_this, res.code));
            }
          });
        }
      });
    },
    // 请求模版列表
    getTmpl() {
      let _this = this;
      ApiGetTmpl().then(function(res) {
        if (res.code == "success") {
          _this.templetList = res.data;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 删除模版
    deletTmpl(id) {
      let _this = this;
      ApiDeletTmpl(id).then(function(res) {
        if (res.code == "success") {
          _this.$Message.success(_this.$t("note.templateDel"));
          _this.getTmpl();
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 请求模版详情
    getTmplDetail(id) {
      let _this = this;
      ApiGetTmplDetail(id).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t("note.templateUse"));
          let data = res.data.template;
          this.customizeForm.siteId = data.siteId;
          this.customizeForm.vfId = data.vfId;
          this.customizeForm.creatorId = data.creatorId;
          this.customizeForm.central = data.central ? "true" : "false";
          // 审阅
          if (data.reqReview) {
            this.show.isReqReview = true;
            this.customizeForm.reqReview = "true";
            let reList = [];
            if (data.reviewList.length > 0) {
              this.customizeForm.isAllReview = data.reviewList[0].multiParty
                ? "true"
                : "false";
              this.customizeForm.reviewSign = data.reviewList[0].sign
                ? "true"
                : "false";
              this.show.isAllReview = data.reviewList.length > 1 ? true : false;

              for (let [index, elem] of data.reviewList.entries()) {
                reList.push(elem.reviewerId);
              }
            }
            this.customizeForm.review = reList;
          } else {
            this.customizeForm.reqReview = "false";
            this.show.isReqReview = false;
          }

          // qc
          if (data.reqQc) {
            this.customizeForm.reqQc = "true";
            this.show.isReqQc = true;

            let qcList = [];
            if (data.qcReviewList.length > 0) {
              this.customizeForm.isAllQc = data.qcReviewList[0].multiParty
                ? "true"
                : "false";
              this.customizeForm.qcSign = data.qcReviewList[0].sign
                ? "true"
                : "false";
              this.show.isAllQc = data.qcReviewList.length > 1 ? true : false;

              for (let [index, elem] of data.qcReviewList.entries()) {
                qcList.push(elem.qcreviewerId);
              }
            }
            this.customizeForm.qc = qcList;
          } else {
            this.customizeForm.reqQc = "false";
            this.show.isReqQc = false;
          }

          // 批准
          let apList = [];
          if (data.approveList.length > 0) {
            for (let [index, elem] of data.approveList.entries()) {
              apList.push(elem.approverId);
            }
            this.customizeForm.approveSign = data.approveList[0].sign
              ? "true"
              : "false";
            this.customizeForm.isAllApprove = data.approveList[0].multiParty
              ? "true"
              : "false";
            this.show.isAllApprove =
              data.qcReviewList.length > 1 ? true : false;
          }
          this.customizeForm.approve = apList;
          //是否显示版本号
          this.vfIdFun(data.vfId);
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  filters: {
    formatFileSize(fileSize) {
      if (fileSize < 1024) {
        return fileSize + "B";
      } else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + "KB";
      } else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "MB";
      } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "GB";
      }
    }
  },
  computed: {
    studyId() {
      return sessionStorage.getItem("studyId");
    },
    siteId() {
      return sessionStorage.getItem("siteId");
    }
  },
  mounted() {
    this.getFileVersionFormat();
    this.getManageStudySites();
    this.getFileTypes();
    this.getFileUserByPrivilege("ADD_FILE", this.siteId);
    this.getFileUserByPrivilege("REVIEW", this.siteId);
    this.getFileUserByPrivilege("QC_REVIEW", this.siteId);
    this.getFileUserByPrivilege("APPROVE", this.siteId);

    this.getFileFolders("zone", this.studyId);
    this.getTmpl();
  }
};
</script>

<style lang="scss">
@import "../../common/css/variable.scss";

.new-file {
  height: 100%;
  overflow: auto;
  border-top: 1px solid $border-color;
  padding: 10px;
  .templet-list {
    text-align: center;
    border-radius: 4px;
    border: 1px solid $border-color;
    margin-bottom: 10px;
    .templet-name,
    .templet-footer {
      background: $bg-file-templet;
      padding: 8px 0;
    }
    .templet-footer {
      cursor: pointer;
    }
    .templet-name {
      position: relative;
      .temp-operation {
        position: absolute;
        top: 7px;
        right: 5px;
        .ivu-icon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
    .templet-content {
      padding: 10px 0;
      font-size: 40px;
    }
  }
  // 文件上传
  .ivu-upload {
    margin-top: 20px;
  }
  // 文件内容
  .file-type {
    text-align: center;
    width: 100%;
    height: 20px;
    .save-btn {
      background: #fff;
      border: 1px solid $theme-green;
    }
    :first-child {
      border-bottom-left-radius: 3px;
      border-top-left-radius: 3px;
    }
    :last-child {
      border-bottom-right-radius: 3px;
      border-top-right-radius: 3px;
    }
    div {
      width: 50%;
      padding: 5px 0;
      border: 1px solid $border-color;
      cursor: pointer;
      background: $border-color;
      float: left;
    }
    .active {
      background: $theme-green;
      color: $bg-color;
      border: 1px solid $theme-green;
    }
  }
  .file-input {
    margin-top: 15px;
    .ivu-form-item {
      margin-bottom: 8px;
    }
    .ivu-date-picker {
      width: 100%;
    }
    .excision-p {
      text-align: center;
      padding: 10px 0;
    }
  }
  .dire {
    .ivu-form-item-label:before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
  }
  .in-block-div {
    display: inline-block;
    width: 48%;
  }
  .file-list {
    position: relative;
    margin: 10px 0;
    .update-btn {
      margin-top: 10px;
    }
    .file-span {
      position: absolute;
      top: 5px;
    }
    .file-size {
      float: right;
      padding: 0 10px;
    }
    .close {
      height: 20px;
      width: 15px;
      float: right;
      margin-top: -5px;
      font-size: 20px;
    }
    .upload-list-file {
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s ease-in-out;
      overflow: hidden;
      position: relative;
      margin-left: 70px;
      transition: color 0.2s ease-in-out;
      &.exceeded {
        color: #ed3f14;
      }
    }
    .upload-list-file:hover {
      background: #f3f3f3;
      cursor: pointer;
    }
  }
}
.nav-dir {
  margin-bottom: 10px;
  .ivu-breadcrumb-item-link {
    cursor: pointer;
  }
}
.explain {
  padding: 5px;
  border: 1px solid $border-color;
  p {
    text-align: center;
    font-size: 16px;
  }
  ul {
    li {
      padding: 5px 0;
    }
  }
}
.templet-no {
  text-align: center;
  margin-top: 10px;
}
</style>

