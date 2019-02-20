/*
 * @Author: chengshanshan 
 * @Date: 2018-08-06 14:03:20 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-03 13:41:06
 */

<template>
  <div class="tmf-wrapper">
    <el-tree ref="tree" :data="dirTreeData" node-key="id" :render-content="treeRender" show-checkbox :default-checked-keys="checkedList" @check="checkChange">
    </el-tree>

  </div>
</template>
<script>
import Split from "components/units/split";
import { resCode } from "common/js/code";
import { haveFiles } from "common/js/common";
import qs from "qs";
import { ApiGetTmfDir, ApiPutTmfDir } from "@/api/manage/dir-manage-api";
export default {
  components: {
    Split
  },
  data() {
    return {
      dirTreeData: [],
      checkedList: []
    };
  },
  methods: {
    init() {
      this.getTreeList();
    },
    checkChange(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKey) {
      ApiPutTmfDir(
        qs.stringify({
          id: checkedNodes.id,
          available: !checkedNodes.available
        })
      ).then(res => {
        this.getTreeList();
        if (res.code == "success") {
          // this.$refs.tree.setChecked(
          //   checkedNodes.id,
          //   !checkedNodes.available,
          //   true
          // );
        } else if (res.code == "have_files") {
          // this.$refs.tree.setChecked(
          //   checkedNodes.id,
          //   checkedNodes.available,
          //   true
          // );
          haveFiles(this, res.data);
        } else {
          // this.$refs.tree.setChecked(
          //   checkedNodes.id,
          //   checkedNodes.available,
          //   true
          // );
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    treeRender(h, { node, data, store }) {
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
          ])
        ]
      );
    },
    //获取目录列表
    getTreeList() {
      ApiGetTmfDir().then(res => {
        if (res.code == "success") {
          this.dirTreeData = res.data;
          //获取选中的目录list
          this.checkedList = this.findPathBFS(this.dirTreeData);
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //获取树结构中available为true的id，已数组的形式输出，用于选中树结构选中
    findPathBFS(source) {
      // 深拷贝原始数据
      let dataSource = JSON.parse(JSON.stringify(source));
      let res = [];
      let _checkedList = [];
      // 每一层的数据都 push 进 res
      res.push(...dataSource);
      // res 动态增加长度
      for (var i = 0; i < res.length; i++) {
        var curData = res[i];
        // 匹配成功
        if (curData.available) {
          // 返回当前对象及其父节点所组成的结果
          _checkedList.push(curData.id);
        }
        // 如果有 children 则 push 进 res 中待搜索
        if (curData.children) {
          res.push(...curData.children);
        }
      }
      // 没有搜索到结果，默认返回空数组
      return _checkedList;
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

<style lang="scss" scoped>
@import "../../../../common/css/mixin.scss";
.tmf-wrapper {
  height: 100%;
  overflow: auto;
  padding: 10px;
}
</style>


