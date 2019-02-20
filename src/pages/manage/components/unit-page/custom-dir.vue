/*
 * @Author: chengshanshan 
 * @Date: 2018-08-06 14:03:20 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-12-06 13:57:10
 */

<template>
  <div class="custom-dir">
    <div class="template-wrapper">
      <template-dir v-for="(item,index) in templateList" :key="index" :temData="item" @on-view="templateView(item,index)" @on-use="templateUse(item,index)"></template-dir>
    </div>
    <div class="tree-wrpaper">
      <span class="add-folder" @click="addCustomFun('0')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-muluxinjian"></use>
        </svg>
      </span>
      <el-tree :props="treeProps" :data="dirTreeData" default-expand-all :render-content="renderContent">
      </el-tree>
    </div>
    <!-- 查看目录模板 -->
    <Modal v-model="tempViewModel">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.templateDetail')}}</span>
      </p>
      <div style="text-align:center">
        <el-tree :data="tempViewData" node-key="id" :props="tempProps" default-expand-all :render-content="tempViewRender">
        </el-tree>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="templateViewUse" :disabled="!tempViewData.length>0 || currentTemp.using">{{$t('title.userTemplate')}}</Button>
      </div>
    </Modal>
    <!--  新建目录  -->
    <Modal v-model="customModel" :mask-closable="false" width="800">
      <p slot="header" style="text-align:center">
        <span> {{$t('title.newDir')}} </span>
      </p>
      <div>
        <split></split>
        <Form ref="customForm" :model="customForm" :rules="customFormRule" :label-width="120">
          <Row>
            <Col span="24">
            <FormItem :label="$t('title.DirName')" prop="folderName">
              <Input v-model.trim="customForm.folderName"></Input>
            </FormItem>
            </Col>
            <Col span="5" v-if="allRoleShow">
            <FormItem :label="$t('title.seleteAll')" prop="all">
              <i-switch v-model="customForm.all" @on-change="switchChange" />
            </FormItem>
            </Col>
            <Col :span="spanNum" v-if="roleIdShow">
            <FormItem :label="$t('title.peopleList')" prop="roleIdList">
              <Select v-model="customForm.roleIdList" multiple filterable>
                <Option v-for="item in roleListData" :value="item.userId" :key="item.userId">{{item.username}}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="addRoot('customForm')">{{$t('operation.sure')}} </Button>
      </div>
    </Modal>
    <!--  修改目录 -->
    <Modal v-model="editCustomModel" :mask-closable="false" width="800">
      <p slot="header" style="text-align:center">
        <span> {{$t('title.modifyDir')}} </span>
      </p>
      <div>
        <split></split>
        <Form ref="editCustomForm" :model="editCustomForm" :rules="editCustomFormRule" :label-width="120">
          <Row>
            <Col span="24">
            <FormItem :label="$t('title.DirName')" prop="folderName">
              <Input v-model.trim="editCustomForm.folderName"></Input>
            </FormItem>
            </Col>
            <Col span="5"  v-if="allRoleShow">
            <FormItem :label="$t('title.seleteAll')" prop="all">
              <i-switch v-model="editCustomForm.all" @on-change="editSwitchChange" />
            </FormItem>
            </Col>
            <Col :span="spanNum" v-if="editRoleIdShow">
            <FormItem :label="$t('title.peopleList')" prop="userIdList">
              <Select v-model="editCustomForm.userIdList" multiple filterable>
                <Option v-for="item in roleListData" :value="item.userId" :key="item.userId">{{item.username}}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="putDir('editCustomForm')">{{$t('operation.sure')}} </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import moment from "moment";
import TemplateDir from "components/units/template-dir.vue";
import Split from "components/units/split";
import InputChange from "components/units/input-change";
import { resCode } from "common/js/code";
import { haveFiles } from "common/js/common";
import qs from "qs";
import {
  ApiGetTemlateDir,
  ApiGetCustomDir,
  ApiPutDir,
  ApiGetTemlateInfo,
  ApiPostUseTemp,
  ApiPostCustomAdd,
  ApiDelectCustom,
  ApiGetCustomRoles,
  ApiGetCustomInfo
} from "@/api/manage/dir-manage-api";
export default {
  components: {
    TemplateDir,
    Split,
    InputChange
  },
  data() {
    return {
      spanNum:19,
      parentId: "", // 保存父级 id
      roleIdShow: false,
      allRoleShow: true,
      customModel: false,
      customForm: {
        folderName: "",
        all: true,
        roleIdList: []
      },
      customFormRule: {
        folderName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ]
      },
      editRoleIdShow: false,
      roleListData: [],
      editCustomModel: false,
      editCustomForm: {},
      editCustomFormRule: {
        folderName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          }
        ]
      },
      treeProps: {
        children: "folderList",
        label: "folderName"
      },
      tempProps: {
        children: "templateFolderList",
        label: "folderName"
      },
      templateTree: [], //模板目录树
      templateList: [], //自定义目录模板
      dirTreeData: [],

      tempViewModel: false, //查看模板
      tempViewData: [], //查看模板树
      isUsing: true, //当前模板是否已使用
      currentTemp: {
        //当前操作模板的状态
        using: false, //是否使用
        index: 0 //templateList中的ondex
      }
    };
  },
  methods: {
    init() {
      this.getTemlateList();
      this.getCustomList();
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
          //icon 文件名
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
              // 显示文件名
              "span",
              {
                style: {
                  padding: "0 5px"
                }
              },
              data.folderName
            )
          ]),
          //操作按钮
          h("span", [
            //添加 删除  修改
            h(
              "span",
              {
                style: {
                  padding: "0 15px"
                }
              },
              [
                h("Icon", {
                  style: {
                    "padding-right": "20px"
                  },
                  props: {
                    type: "edit",
                    size: "20"
                  },
                  on: {
                    click: event => {
                      event.stopPropagation();
                      this.editCustomFun(data);
                    }
                  }
                }),
                h("Icon", {
                  style: {
                    "padding-right": "10px"
                  },
                  props: {
                    type: "ios-plus-outline",
                    size: "20"
                  },
                  on: {
                    click: event => {
                      event.stopPropagation();
                      this.addCustomFun(data);
                    }
                  }
                }),
                h("Icon", {
                  style: {
                    "padding-left": "10px"
                  },
                  props: {
                    type: "ios-minus-outline",
                    size: "20"
                  },
                  on: {
                    click: event => {
                      event.stopPropagation();
                      this.remove(node, data);
                    }
                  }
                })
              ]
            ),
            h("span", [
              h(
                "label",
                {
                  style: {
                    "font-size": "13px",
                    padding: "0 5px"
                  }
                },
                this.$t("title.isSumbit")
              ),
              h("i-switch", {
                props: {
                  size: "default",
                  value: data.core
                },
                on: {
                  click: event => {
                    event.stopPropagation();
                  },
                  "on-change": value => {
                    event.stopPropagation();
                    let _data = {
                      folderId: data.id,
                      core: value
                    };
                    ApiPutDir(qs.stringify(_data)).then(res => {
                      if (res.code == "success") {
                        data.core = value;
                      } else {
                        this.$Message.error(resCode(this, res.code));
                      }
                    });
                  }
                }
              })
            ])
          ])
        ]
      );
    },
    tempViewRender(h, { node, data, store }) {
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
          //icon 文件名
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
          ]),
          //操作按钮

          h("span", [
            h(
              "label",
              {
                style: {
                  "font-size": "13px",
                  padding: "0 5px"
                }
              },
              "是否提交"
            ),
            h("i-switch", {
              props: {
                size: "default",
                disabled: true,
                value: data.core
              }
            })
          ])
        ]
      );
    },
    //获取模板列表
    getTemlateList() {
      ApiGetTemlateDir().then(res => {
        if (res.code == "success") {
          this.templateList = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //获取自定义目录列表
    getCustomList() {
      ApiGetCustomDir().then(res => {
        if (res.code == "success") {
          this.dirTreeData = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //获取指定模板树结构
    getTemlateInfo(id, type) {
      ApiGetTemlateInfo(id).then(res => {
        if (res.code == "success") {
          //给查看模板data赋值
          this.tempViewData = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //查看模板
    templateView(params, index) {
      this.tempViewModel = true;
      this.currentTemp = params;
      this.currentTemp.index = index;
      this.getTemlateInfo(params.templateId);
    },
    //查看使用模板
    templateViewUse() {
      ApiPostUseTemp(
        qs.stringify({ templateId: this.currentTemp.templateId })
      ).then(res => {
        if (res.code == "success") {
          this.tempViewModel = false;
          this.templateList[this.currentTemp.index].using = true;
          this.getCustomList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },

    //直接使用模板
    templateUse(params, index) {
      if (!params.using) {
        ApiPostUseTemp(qs.stringify({ templateId: params.templateId })).then(
          res => {
            if (res.code == "success") {
              this.templateList[index].using = true;
              this.getCustomList();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          }
        );
      }
    },
    // 是否权限角色
    switchChange(status) {
      this.customForm.all = status;
      if (status) {
        this.roleIdShow = false;
        this.customForm.roleIdList = [];
      } else {
        this.roleIdShow = true;
      }
    },
    // 修改点击 是否全选
    editSwitchChange(status) {
      this.editCustomForm.all = status;
      if (status) {
        this.editRoleIdShow = false;
      } else {
        this.editRoleIdShow = true;
      }
    },
    // 点击添加出现模态框
    addCustomFun(data) {
      if(data == 0){
        this.parentId = 0;
      }else{
        this.parentId = data.folderId;
      }
      this.customForm.all = false;
      this.$refs["customForm"].resetFields();
      this.getCustomRoles();
      this.customModel = true;
    },
    //添加树节点
    // append(data) {
    //   //生成100-999的三位随机数
    //   let _random = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    //   const newChild = {
    //     folderName: `new folder${_random}`,
    //     core: true,
    //     folderList: [],
    //     parentId: data.id
    //   };
    //   ApiPostCustomAdd(qs.stringify(newChild)).then(res => {
    //     if (res.code == "success") {
    //       if (!data.folderList) {
    //         this.$set(data, "folderList", []);
    //       }
    //       data.folderList.push(res.data);
    //     } else {
    //       this.$Message.error(resCode(this, res.code));
    //     }
    //   });
    // },
    // 检索自定义子目录可配置的人员
    getCustomRoles() {
      ApiGetCustomRoles().then(res => {
        if (res.code == "success") {
          this.roleListData = res.data;
          // if ( res.data.allRole ) {
            this.allRoleShow = true;
            this.roleIdShow = false;
            this.spanNum = 19;
          // } else {
            // this.allRoleShow = false;
            // this.roleIdShow = true;
            // this.spanNum = 24;
          // }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },

    //添加根节点 点击保存
    addRoot(name) {
      let roleIdList = [];
      if (this.roleIdShow) {
        roleIdList = this.customForm.roleIdList;
        if (roleIdList.length == 0) {
          this.$Message.error(this.$t("note.selectArole"));
          return false;
        }
      } else {
        roleIdList = [0];
      }
      let _data = {
        folderName: this.customForm.folderName,
        core: true,
        folderList: [],
        parentId: this.parentId,
        userIdList: roleIdList
      };
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPostCustomAdd(_data).then(res => {
            if (res.code == "success") {
              this.init();
              this.customModel = false;
              this.$Message.success(this.$t("note.addSucc"));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 点击 修改
    editCustomFun(data) {
      this.getCustomInfo(data.folderId);
      this.editCustomModel = true;
    },
    // 检索单个自定义目录信息
    getCustomInfo(id) {
      ApiGetCustomInfo(id).then(res => {
        if (res.code == "success") {
          this.editCustomForm = res.data;
            this.getCustomRoles();
          if (res.data.userIdList.length == 1 && res.data.userIdList[0] == 0) {
            this.editRoleIdShow = false;
            this.editCustomForm.all = true;
          } else {
            this.editRoleIdShow = true;
            this.editCustomForm.all = false;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 修改点击保存
    putDir(name) {
      let roleIdList = [];
      if (this.editRoleIdShow) {
        roleIdList = this.editCustomForm.userIdList;
        if (roleIdList.length == 0) {
          this.$Message.error(this.$t("note.selectArole"));
          return false;
        }
      } else {
        roleIdList = [0];
      }
      let _data = {
        folderId: this.editCustomForm.folderId,
        folderName: this.editCustomForm.folderName,
        userIdList: roleIdList
      };
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPutDir(_data).then(res => {
            if (res.code == "success") {
              this.init();
              this.editCustomModel = false;
              this.$Message.success(this.$t("note.editSucc"));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //删除树节点
    remove(node, data) {
      ApiDelectCustom(qs.stringify({ folderId: data.id })).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t("note.delSucc"));
          const parent = node.parent;
          const folderList = parent.data.folderList || parent.data;
          const index = folderList.findIndex(d => d.id === data.id);
          folderList.splice(index, 1);
        } else if (res.code == "have_files") {
          haveFiles(this, res.data);
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //nodeClick
    nameClick(data) {
      this.dirNameModal = true;
      this.dirNameForm.name = data.label;
      this.dirNameForm.id = data.id;
    }
  },

  watch: {
    $route(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
.ivu-switch {
  height: 20px;
  width: 40px;
  border-radius: 20px;
  &:after {
    height: 16px;
    width: 16px;
  }
}
.ivu-switch-checked {
  border-color: #2d8cf0;
  background-color: #2d8cf0;
  &:after {
    left: 21px;
  }
}
.dir-name {
  .ivu-modal-body {
    padding-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../../common/css/mixin.scss";
.custom-dir {
  display: flex;
  height: 100%;
  .template-wrapper {
    width: 20%;
    padding: 10px;
    overflow: auto;
  }
  .tree-wrpaper {
    width: 80%;
    padding: 20px 10px;
    border-left: 1px solid $border-color;
    overflow: auto;
    .add-folder {
      display: block;
      width: 50px;
      height: 50px;
      font-size: 30px;
      padding-left: 25px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

