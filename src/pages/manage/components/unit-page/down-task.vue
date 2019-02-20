/*
 * @Author: liuhaosheng 
 * @Date: 2018-11-19 10:29:47 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-19 15:37:23
 * 下载任务 
 */
 <template>
    <div ref="outerWrapprer" class="down-task">
        <Table :height="tableHeight" :columns="fileTableCol" :data="downTaskData"></Table>
        <div class="page" ref="bottomWrapper">
            <Page :total="task.pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
    </div>
</template>
 <script>
import FileIcon from "components/units/file-icon";
import { resCode, fileStatus } from "common/js/code";
import {
  ApiGetManageDownTask,
  ApiGetDownAll
} from "@/api/manage/down-center-api";
import moment from "moment";
import qs from "qs";

// 下载按钮
const downButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.downFun(params.row.fileOid, params.row.taskName);
        }
      }
    },
    vm.$t("operation.down")
  );
};
export default {
  data() {
    return {
      tableHeight: 100,
      fileTableCol: [
        {
          key: "taskName",
          title: this.$t("title.taskName"),
          align: "center"
        },
        {
          key: "userName",
          title: this.$t("title.createStaff"),
          align: "center"
        },
        {
          key: "createdTime",
          title: this.$t("file.createTime"),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          key: "type",
          title: this.$t("title.affiliatedDoc"),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                switch (params.row.type) {
                  case 0:
                    return vm.$t("page.allFile");
                  case 1:
                    return vm.$t("file.submitfile");
                  case 2:
                    return vm.$t("file.noSubmit");
                }
              })(this)
            );
          }
        },
        {
          key: "status",
          title: this.$t("file.status"),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                switch (params.row.status) {
                  case 0:
                    return vm.$t("title.packed");
                  case 1:
                    return vm.$t("title.completed");;
                }
              })(this)
            );
          }
        },
        {
          key: "opreate",
          title: this.$t("operation.operation"),
          align: "center",
          render: (h, params) => {
            return h("div", [
              (function(vm) {
                if (params.row.status == 1) {
                  return downButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      downTaskData: [],
      task: {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 分页
    pageChange(value) {
      this.task.pageNum = value;
      this.getManageDownTask();
    },
    pageSizeChange(value) {
      this.task.pageSize = value;
      this.getManageDownTask();
    },
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outerWrapprer.offsetHeight;
        let bottomH = this.$refs.bottomWrapper.offsetHeight;
        let contentHeight = outH - bottomH;

        this.tableHeight = contentHeight;
      });
    },
    // 请求下载任务
    getManageDownTask() {
      ApiGetManageDownTask(this.task).then(res => {
        if (res.code == "success") {
          this.downTaskData = res.data;
          this.task.pageTotal = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode(this, res.code));
          }
        }
      });
    },
    // 点击下载文件
    downFun(fileOid, taskName) {
      ApiGetDownAll(fileOid).then(data => {
        if (!data) {
          return;
        }
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = data;
        link.setAttribute("download", `${taskName}.zip`);
        document.body.appendChild(link);
        link.click();
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getManageDownTask();
      this.computeHeight();
    }
  },
  mounted() {
    this.computeHeight();
    this.getManageDownTask();
  },
  updated() {
    this.computeHeight();
  }
};
</script>
<style lang="scss">
.down-task {
  height: 100%;
}
</style>

 
 
