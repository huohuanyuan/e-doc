/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-03 10:25:27 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-21 10:39:43
 * 修改页面
 */
<template>
  <div class="edit-div">
    <router-link to="#">
      <p class="back">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        <a href="javascript :;" onClick="javascript :history.back(-1);">{{$t('operation.return')}}</a>
      </p>
    </router-link>
    <div class="edit-info">
      <p class="p-text"> {{$t('title.editFile')}} </p>
      <Form ref="customizeForm" :model="customizeForm" :label-width="130" label-position="right" :rules="customizeValidate">
        <Row :gutter="16">
          <Col span="12">
          <FormItem prop="folderType" :label="$t('title.folderType')">
            <Select v-model="customizeForm.folderType" @on-change="folderTypeFun">
              <Option v-for="item in folderTypeList" :value="item.folderTypeId" :key="item.folderTypeId">{{ item.name }}</Option>
            </Select>
          </FormItem>
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
          <FormItem prop="siteId" :label="$t('title.belongSite')">
            <Select v-model="customizeForm.siteId" filterable>
              <Option v-for="item in manageStudySites" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
            </Select>
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
          <div class="review-wrap">
            <FormItem prop="reqReview" :label="$t('title.review')">
              <RadioGroup v-model="customizeForm.reqReview" @on-change="reqReviewFun">
                <Radio label="true"> {{$t('operation.yes')}} </Radio>
                <Radio label="false"> {{$t('operation.no')}} </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="reviewSign" :label="$t('title.reviewSign')" v-if="show.isReqReview">
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
            <div class="review-div" v-if="divShow.reviewShow"></div>
          </div>

          <div class="qc-wrap">
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
            <div class="qc-div" v-if="divShow.qcShow"></div>
          </div>
          <div class="approve-wrap">
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
            <div class="approve-div" v-if="divShow.approveShow"></div>
          </div>

          </Col>
          <Col span="12">
          <FormItem prop="fileName" :label="$t('file.name')">
            <Input v-model.trim="customizeForm.fileName"></Input>
          </FormItem>
          <FormItem prop="fileCode" :label="$t('file.code')">
            <Input v-model.trim="customizeForm.fileCode"></Input>
          </FormItem>
          <FormItem prop="vfIdName" :label="$t('file.versionType')">
            <Input v-model.trim="customizeForm.vfIdName" disabled></Input>
          </FormItem>
          <FormItem prop="versionNo" :label="$t('file.versionNo')" v-if="versionNoShow">
            <Input v-model.trim="customizeForm.versionNo" disabled></Input>
          </FormItem>
          <FormItem prop="effectiveDate" :label="$t('file.effectiveDate')">
            <DatePicker :editable='false' type="date" v-model="customizeForm.effectiveDate"></DatePicker>
          </FormItem>
          <FormItem prop="expirationDate" :label="$t('file.expirationDate')">
            <DatePicker :editable='false' type="date" v-model="customizeForm.expirationDate"></DatePicker>
          </FormItem>
          <FormItem prop="comment" :label="$t('file.comment')">
            <Input v-model="customizeForm.comment" type="textarea" :rows="2"></Input>
          </FormItem>
          <FormItem :label="$t('file.fileEntity')" v-show="fileShow">
            <p class="file-name">
              {{fileNameType}}
              <!-- <span @click="deleteFileName"> {{$t('operation.doDelete')}} </span> -->
            </p>
          </FormItem>
          <FormItem :label="$t('file.fileEntity')" v-show="newFileShow">
            <p class="file-name">
              {{newFileNameType}}
              <!-- <span @click="removeFile"> {{$t('operation.doDelete')}} </span> -->
            </p>
          </FormItem>
          <div class="update-div">
            <Upload ref="upload" type="drag" :action="actionSrc" :headers="header" :before-upload="handleUpload"  :on-success="uploadSuccess" :data="ossParams" :format="fileTypes" :on-format-error="handleFormatError">
              <div style="padding: 5px 0">
                <Icon type="ios-cloud-upload" size="40" style="color: #2dd6aa"></Icon>
                <p>{{$t('file.dragUploadFile')}}</p>
              </div>
            </Upload>
            <div class="file-list" v-if="file != null">
              <span class="file-span"> {{$t('file.fileUpload')}}</span>
              <div :class="[{exceeded:file.isExceededSize},'upload-list-file']">
                <span class="file-name-span">
                  <Icon type="document-text"></Icon> {{ file.name }}
                </span>
                <span class="close" @click="delectFile">
                  <Icon type="ios-close-empty"></Icon>
                </span>
                <p class="file-size">{{ file.size | formatFileSize}}
                  <span v-show="file.isExceededSize">{{$t('note.fileLarge')}}</span>
                </p>
              </div>
              <Button class="update-btn" type="ghost" icon="ios-cloud-upload-outline" @click="upload" long> {{$t('operation.upload')}} </Button>
            </div>         
          </div>
          </Col>
        </Row>
      </Form>
      <split></split>
      <div class="footer-btn">
        <Button type="primary" @click="postFileUpdateFile('customizeForm')">{{$t('operation.save')}}</Button>
      </div>
    </div>
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
  </div>
</template>

<script>
import axios from "axios";
import FileList from "components/file-list";
import Split from "components/units/split";
import { UUID, UUIDKey } from "@/common/js/common.js";
import {
  ApiGetFileTypes,
  ApiGetManageStudySites,
  ApiGetFileUserByPrivilege,
  ApiGetManageCustomFind,
  ApiGetFileFolders,
  ApiGetFileFindOne,
  ApiDeletFile,
  ApiPostFileUpdateFile,
  ApiGetFileFindArtifact,
  ApiGetOssParams
} from "@/api/file/file";
import { resCode, onlineViewType } from "@/common/js/code.js";
import moment from "moment";
import md5 from "js-md5";

export default {
  components: {
    FileList,
    Split
  },
  data() {
    return {
      pdfMaxSize: 50 * 1024, //PDF文件最大50M 单位：KB
      otherMaxSize: 10 * 1024, //PDF文件最大10M 单位：KB
      treeProps: {
        children: "folderList",
        label: "folderName"
      },
      folderTypeList: [
        {
          folderTypeId: 1,
          name: this.$t("title.customFolder")
        },
        {
          folderTypeId: 0,
          name: this.$t("title.tmfFolder")
        }
      ],
      header: {
        Authorization: sessionStorage.getItem("token")
      },
      file: null,
      fileEntity: {}, // 保存文件实体，为了删除
      newFileNameType: "", // 保存新的文件名
      fileShow: false,
      newFileShow: false,
      isFileSuccess: false,
      fileOldType: "", // 之上一次的文件类型
      actionSrc: "https://m-doc.oss-cn-beijing.aliyuncs.com", // 上传文件路径
      ossParams: {
        success_action_status: "200"
      },
      fileUuid: new Map(),
      isZoneDier: true,
      versionNoShow: false,
      customizeDireModal: false,
      versionNoShow: false,
      clientShow: true, // 是否显示自定义目录 文字提示
      fileNameType: "",
      divShow: {
        reviewShow: false,
        qcShow: false,
        approverShow: false
      },
      customizeDireNew: "",
      artifactIdNew: "",
      folderTypeId: "",
      customizeForm: {
        gsonFile: {},
        fileId: "",
        siteId: "",
        vfId: "",
        vfIdName: "",
        fileName: "",
        fileCode: "",
        customizeDire: "", // 显示已经选好的自定义目录
        folderType: 2,
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
        artifactId: "",
        fileOid: "",
        fileTypeId: "",
        updatedTime: 0
      },
      customizeValidate: {
        fileName: [{ required: true, message: " ", trigger: "blur" }],
        siteId: [
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
      // 是否显示
      show: {
        isReqReview: false,
        isAllReview: false,
        isReqQc: false,
        isAllQc: false,
        isAllApprove: false
      },
      fileTypes: [], // 可以上传的文件
      fileTypesName: "", //
      fileTypeIds: {}, //保存文件类型对应的id
      manageStudySites: [], // site list
      manageCustomFind: [], //自定义目录列表
      zoneCustomList: [], // 自定义目录面包屑数组
      zoneDataList: [],
      addFileList: [], // 拥有者list
      reviewList: [], // 审阅人 list
      qcReviewList: [], // qc人list
      approveList: [] // 批准人 list
    };
  },
  methods: {
    // 请求当前项目详情
    getFileFindOne() {
      let data = {
        file_id: this.$route.query.fileId
      };
      ApiGetFileFindOne(data).then(res => {
        if (res.code == "success") {
          if (res.data.folderType == 1) {
            this.isZoneDier = true;
            this.customizeForm.folderType = 1;

            let str = "";
            for (let i = 0; i < res.data.parentList.length; i++) {
              str += res.data.parentList[i].folderName + "/";
            }
            this.customizeForm.customizeDire = str;
          } else {
            this.isZoneDier = false;
            this.customizeForm.folderType = 0;
            this.getFileFindArtifact(res.data.artifactId);
          }
          this.folderTypeId = res.data.folderType;
          this.customizeForm.updatedTime = res.data.updatedTime;
          this.customizeForm.gsonFile = res.data.gsonFile;
          this.customizeForm.creatorId = res.data.creatorId;
          this.customizeForm.artifactId = res.data.artifactId;
          this.customizeForm.siteId = res.data.siteId;
          this.customizeForm.fileName = res.data.fileName;
          this.customizeForm.fileCode = res.data.fileCode;
          this.customizeForm.vfId = res.data.vfId;
          this.customizeForm.fileOid = res.data.fileOid;
          this.customizeForm.fileTypeId = res.data.fileTypeId;
          this.customizeForm.fileId = res.data.fileId;
          this.customizeForm.comment = res.data.comment ? res.data.comment : "";
          if (res.data.fileType) {
            this.fileNameType = res.data.fileName + "." + res.data.fileType;
            this.fileShow = true;
          } else {
            this.fileNameType = "";
            this.fileShow = false;
          }
          if (res.data.vfId == 0) {
            this.versionNoShow = true;
            this.customizeForm.vfIdName = this.$t("title.manualInput");
            this.customizeForm.versionNo = res.data.versionNo;
          } else if (res.data.vfId == 1) {
            this.customizeForm.vfIdName = this.$t("title.standardInput");
          } else {
            this.customizeForm.vfIdName = this.$t("title.format1");
          }
          if (res.data.central) {
            this.customizeForm.central = "true";
          } else {
            this.customizeForm.central = "false";
          }
          if (res.data.effectiveDate) {
            this.customizeForm.effectiveDate = moment(
              res.data.effectiveDate
            ).format("YYYY-MM-DD");
          }
          if (res.data.expirationDate) {
            this.customizeForm.expirationDate = moment(
              res.data.expirationDate
            ).format("YYYY-MM-DD");
          }
          // 是否显示遮罩层
          if (res.data.isReview == 0 && res.data.fileStatus == "reviewing") {
            this.divShow.reviewShow = true;
          } else if (
            res.data.isReview == 0 &&
            res.data.fileStatus == "approving"
          ) {
            this.divShow.reviewShow = true;
          } else if (res.data.isReview == 1 || res.data.isReview == 2) {
            this.divShow.reviewShow = true;
          } else {
            this.divShow.reviewShow = false;
          }
          if (res.data.isQc == 0 && res.data.fileStatus == "qcing") {
            this.divShow.qcShow = true;
          } else if (res.data.isQc == 0 && res.data.fileStatus == "approving") {
            this.divShow.qcShow = true;
          } else if (res.data.isQc == 1 || res.data.isQc == 2) {
            this.divShow.qcShow = true;
          } else {
            this.divShow.qcShow = false;
          }
          if (res.data.isApprove == 0 && res.data.fileStatus == "approving") {
            this.divShow.approverShow = true;
          } else if (res.data.isApprove == 0) {
            this.divShow.approverShow = false;
          } else if (res.data.isApprove == 1 || res.data.isApprove == 2) {
            this.divShow.approverShow = true;
          }

          // 审阅
          if (res.data.reqReview) {
            this.show.isReqReview = true;
            this.customizeForm.reqReview = "true";
            let reList = [];
            if  ( res.data.reviewList.length > 0) {
                if (res.data.reviewList[0].multiParty) {
                    this.customizeForm.isAllReview = "true";
                } else {
                    this.customizeForm.isAllReview = "false";
                }

                if (res.data.reviewList[0].sign) {
                    this.customizeForm.reviewSign = "true";
                } else {
                    this.customizeForm.reviewSign = "false";
                }
                if (res.data.reviewList.length > 1) {
                    this.show.isAllReview = true;
                } else {
                    this.show.isAllReview = false;
                }

                for (let i = 0; i < res.data.reviewList.length; i++) {
                    reList.push(res.data.reviewList[i].reviewerId);
                }

                this.customizeForm.review = reList;
            }
          } else {
            this.customizeForm.reqReview = "false";
            this.show.isReqReview = false;
          }
          // qc
          if (res.data.reqQc) {
            this.customizeForm.reqQc = "true";
            this.show.isReqQc = true;

            let qcList = [];
            if ( res.data.qcReviewList.length > 0 )  {
                if (res.data.qcReviewList[0].multiParty) {
                    this.customizeForm.isAllQc = "true";
                } else {
                    this.customizeForm.isAllQc = "false";
                }

                if (res.data.qcReviewList[0].sign) {
                    this.customizeForm.qcSign = "true";
                } else {
                    this.customizeForm.qcSign = "false";
                }
                if (res.data.qcReviewList.length > 1) {
                    this.show.isAllQc = true;
                } else {
                    this.show.isAllQc = false;
                }

                for (let i = 0; i < res.data.qcReviewList.length; i++) {
                    qcList.push(res.data.qcReviewList[i].qcreviewerId);
                }
                this.customizeForm.qc = qcList;
            }
          } else {
            this.customizeForm.reqQc = "false";
            this.show.isReqQc = false;
          }
          // 批准
          let apList = [];
          if ( res.data.approveList.length > 0 ) {
              for (let i = 0; i < res.data.approveList.length; i++) {
                  apList.push(res.data.approveList[i].approverId);
              }
              this.customizeForm.approve = apList;
              if (res.data.approveList[0].sign) {
                  this.customizeForm.approveSign = "true";
              } else {
                  this.customizeForm.approveSign = "false";
              }
              if (res.data.approveList[0].multiParty) {
                  this.customizeForm.isAllApprove = "true";
              } else {
                  this.customizeForm.isAllApprove = "false";
              }
              if (res.data.approveList.length > 1) {
                  this.show.isAllApprove = true;
              } else {
                  this.show.isAllApprove = false;
              }
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击删除 现有的文件实体
    deleteFileName() {
      this.fileNameType = "";
      this.fileShow = false;
      this.customizeForm.fileOid = "";
      this.customizeForm.fileTypeId = "";
    },
    // 点击选择目录
    showCustomizeDireModal() {
      this.getManageCustomFind("0");
      this.customizeDireModal = true;
      this.zoneCustomList = [];
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
      this.artifactIdNew = data.folderId;
      this.customizeDireNew = data.folderName;
    },
    // 点击切换文件类型
    folderTypeFun(value) {
      if (value == 0) {
        this.isZoneDier = false;
        this.customizeForm.folderType = 0;
      } else {
        this.isZoneDier = true;
        this.customizeForm.folderType = 1;
        if (this.folderTypeId == 0) {
          this.customizeForm.artifactId = "";
        }
      }
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
    zoneSelect(value) {
      this.getFileFolders("section", value);
    },
    sectionSelect(value) {
      this.getFileFolders("artifact", value);
    },
    artifactSelect(val, $event) {
      //   this.getFileFolders("artifact", value);
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
    // 请求自定义目录
    getManageCustomFind(parentId) {
      let _this = this;
      let data = {
        parentId: parentId
      };
      ApiGetManageCustomFind(data).then(function(res) {
        if (res.code == "success") {
          if (res.data.length > 0) {
            _this.clientShow = true;
            _this.manageCustomFind = res.data;
          } else {
            _this.clientShow = false;
          }
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 保存选择好的自定义目录
    saveCustomizeDire() {
      this.customizeDireModal = false;
      this.customizeForm.customizeDire = this.customizeDireNew;
      this.customizeForm.artifactId = this.artifactIdNew;
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
        this.show.isAllQc = false;
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
    // 请求当前 3级目录的前两级目录
    getFileFindArtifact(artifactId) {
      let data = {
        artifactId: artifactId
      };
      ApiGetFileFindArtifact(data).then(res => {
        if (res.code == "success") {
          this.customizeForm.zoneId = res.data.zoneId;
          this.customizeForm.sectionId = res.data.sectionId;
          this.getFileFolders("section", res.data.zoneId);
          this.getFileFolders("artifact", res.data.sectionId);
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 上传文件之前
    handleUpload(file) {
      let _type = file.name.slice(file.name.lastIndexOf(".") + 1);
      //支持在线查看的文件需要限制文件大小pdf30M 其他 10M
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
      this.file = file;
      return false;
    },
    // 上传文件
    upload() {
      let _path = "";
      //获取oss参数
      if (!this.file.isExceededSize) {
        ApiGetOssParams().then(res => {
          if (res.code == "success") {
            _path = res.data.path;
            this.ossParams.OSSAccessKeyId = res.data.accessid;
            this.ossParams.policy = res.data.policy;
            this.ossParams.signature = res.data.signature;
            this.ossParams["x-oss-security-token"] = res.data.token;
            let _type = this.file.name.slice(
              this.file.name.lastIndexOf(".") + 1
            );
            let _uuid = UUID();
            //文件名+文件大小MD5加密,将key与UUID一一对应存储
            let _key = UUIDKey(this.file.name, this.file.size);
            this.fileUuid.set(_key, _uuid);
            //上传oss上传
            this.ossParams.key = `${_path}${_uuid}.${_type}`;
            this.$refs.upload.post(this.file);
            // console.log(`${item.name}:${_uuid}`);
          } else {
            this.$Message.error(resCode(this, res.code));
          }
        });
      }
    },
    // 删除文件
    delectFile() {
      this.file = null;
    },
    // 上传文件类型验证方法
    handleFormatError(file) {
      this.$Message.warning(file.name + this.$t("note.formatError"));
    },
    // 文件上传成功后的回调
    uploadSuccess(res, file, fileList) {
      // if (this.isFileSuccess) {
      //   let id = this.customizeForm.fileOid + "." + this.fileOldType;
      //   this.previousFileRemove(id);
      // }

      this.$Message.success(file.name + this.$t("note.uploadSucc"));
      this.newFileNameType = file.name;

      let _key = UUIDKey(file.name, file.size);
      this.customizeForm.fileOid = this.fileUuid.get(_key);

      let _type = file.name.slice(file.name.lastIndexOf(".") + 1);
      this.customizeForm.fileTypeId = this.fileTypeIds[_type];

      this.fileOldType = _type;
      this.file = null;
      this.fileEntity = file;
      this.fileShow = false;
      this.newFileShow = true;
      this.isFileSuccess = true;
    },
    // 修改文件多次上传文件时，删除之前的文件方法
    previousFileRemove(id) {
      ApiDeletFile({ fileName: id }).then(res => {
        if (res.code == "success") {
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 删除已经上传的文件
    removeFile() {
      let type = this.fileEntity.name;
      let index = type.lastIndexOf(".");
      type = type.substring(index + 1, type.length);

      let id;
      if (this.fileEntity.response.code == "success") {
        id = this.fileEntity.response.data.fileOid + "." + type;
      }
      ApiDeletFile({ fileName: id }).then(res => {
        if (res.code == "success") {
          this.newFileShow = false;
          this.$Message.success(this.fileEntity.name + this.$t("noet.delSucc"));
          if (this.fileTypeId != "") {
            this.fileShow = true;
          } else {
            this.fileShow = false;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 处理新建文件的数据
    sortSaveData() {
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
        fileName: this.customizeForm.fileName,
        fileCode: this.customizeForm.fileCode,
        gsonFile: this.customizeForm.gsonFile,
        updatedTime: moment(this.customizeForm.updatedTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        fileOid: this.customizeForm.fileOid,
        fileId: this.customizeForm.fileId,
        fileTypeId: this.customizeForm.fileTypeId,
        siteId: this.customizeForm.siteId, // 所属site
        vfId: this.customizeForm.vfId, // 版本类型
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
        reviewList: reviewListVar, // 审阅list
        qcReviewList: qcListVar, // qc list
        approveList: approveListVar // 批准list
      };
      if (this.customizeForm.vfId == 0) {
        data.versionNo = this.customizeForm.versionNo;
      }
      return data;
    },
    // 修改文件保存提交
    postFileUpdateFile(name) {
      if (this.customizeForm.artifactId == "") {
        this.$Message.warning(this.$t("title.selectFloder"));
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let formData = this.sortSaveData();
          if (formData.effectiveDate && formData.expirationDate) {
            if (
              moment(formData.expirationDate).isBefore(formData.effectiveDate)
            ) {
              this.$Message.warning(this.$t("note.dateError"));
              return false;
            }
          }
        
          ApiPostFileUpdateFile(formData).then(res=>{
            if (res.code == "success") {
              this.$Message.success(this.$t("note.editSucc"));
            window.history.back(-1)
            } else if (res.code == "duplicate_file_name") {
              this.$Message.warning(res.data[0] + this.$t("note.reNameFile"));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
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
    this.getFileFindOne();
    this.getManageStudySites();
    this.getFileTypes();
    this.getFileUserByPrivilege("ADD_FILE", this.siteId);
    this.getFileUserByPrivilege("QC_REVIEW", this.siteId);
    this.getFileUserByPrivilege("REVIEW", this.siteId);
    this.getFileUserByPrivilege("APPROVE", this.siteId);
    this.getFileFolders("zone", this.studyId);
  }
};
</script>

<style lang="scss">
@import "../../common/css/variable.scss";
.edit-div {
  height: 100%;
  overflow: auto;
  padding: 10px;
  .back {
    padding: 5px 10px;
    color: #8c9996;
    a {
      color: #8c9996;
    }
  }
}
.edit-info {
  border: 1px solid $border-color;
  padding-top: 10px;
  padding: 10px;
  border-radius: 8px;
  .p-text {
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid $border-color;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .ivu-form-item {
    margin-bottom: 10px;
  }
  .ivu-date-picker {
    width: 100%;
  }
  .update-div {
    margin-left: 130px;
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

    .close {
      float: right;
      height: 20px;
      width: 15px;
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
  .file-name {
    margin-top: 1px;
    span {
      float: right;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .footer-btn {
    width: 100%;
    text-align: center;
    button {
      width: 30%;
    }
  }
  .review-wrap,
  .qc-wrap,
  .approve-wrap {
    position: relative;
  }
  .review-div,
  .qc-div,
  .approve-div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    opacity: 0.3;
    background: #fff;
    z-index: 100;
  }
}
</style>
