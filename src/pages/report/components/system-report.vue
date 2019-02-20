/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-03 14:46:26 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-12 17:41:42
 * 系统报表
 */
<template>
  <div class="system-wrap" ref="outWrapper">
    <div class="system-header" ref="topWrapper">
      <router-link class="btn" v-for="(item,index) of childrenRouter" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>
    </div>
    <div class="content" ref="contentWrapper">
      <Row :gutter="32">
        <Col span="12">
        <div class="chart">
          <!-- 归档文件统计图(总数量)  -->
          <p> {{$t('report.reportTitle1')}}</p>
          <mChart :option="option1" height="300px"></mChart>
        </div>
        </Col>
        <!-- <Col span="12">
        <div class="chart">      
         
          <p> 归档文件统计图(年数量)
            <DatePicker :editable='false' type="year" :clearable="false" size="small" style="width: 100px" v-model="archivedYear" @on-change="onChangeArchived"></DatePicker>
          </p>
          <div v-if="archivedShow">
            <mChart :option="option2" height="300px"></mChart>
          </div>
          <div style="height: 300px" v-else> 暂无数据！</div>
        </div>
        </Col> -->
        <Col span="12">
        <div class="chart">
          <!--  文件状态分布图-->
          <p> {{$t('report.reportTitle3')}} </p>
          <mChart :option="option3" height="300px"></mChart>
        </div>
        </Col>
        <!-- <Col span="12">
        <div class="chart">
          <p> 文件状态分布图(年数量)
            <DatePicker :editable='false' type="year" :clearable="false" size="small" style="width: 100px" v-model="statusYear" @on-change="onChangeStatus"></DatePicker>
          </p>
          <div v-if="statusShow">
            <mChart :option="option4" height="300px"></mChart>
          </div>
          <div style="height: 300px" v-else> 暂无数据！</div>
        </div>
        </Col> -->
        <Col span="12">
        <div class="chart" v-if="siteChartShow">
          <!-- 文件数量统计图 -->
          <p> {{$t('report.reportTitle5')}} </p>
          <mChart :option="option5" height="300px"></mChart>
        </div>
        </Col>
        <!-- <Col span="12">
        <div class="chart" v-if="siteChartShow">
          <p> 文件数量统计图 (年数量)
            <DatePicker :editable='false' type="year" :clearable="false" size="small" style="width: 100px" v-model="siteYear" @on-change="onChangeSite"></DatePicker>
          </p>
          <div v-if="siteShow">
            <mChart :option="option6" height="300px"></mChart>
          </div>
          <div style="height: 300px" v-else> 暂无数据！</div>
        </div>
        </Col> -->
      </Row>
    </div>

  </div>
</template>
<script>
import {
  ApiGetreportSystem,
  ApiGetreportSystemArchived,
  ApiGetreportSystemStatus,
  ApiGetreportSystemSite
} from "@/api/report/report-api.js";
import { resCode } from "@/common/js/code.js";

import mChart from "components/m-chart";
import moment from "moment";

export default {
  components: {
    mChart
  },
  data() {
    return {
      pageCode: {
        systemReport:  this.$t("page.systemReport"),
        customReport: this.$t("page.customReport")
      },
      childrenRouter: [], //子路由列表
      siteChartShow: false,
      archivedShow: false,
      statusShow: false,
      siteShow: false,
      option1: {},
      option2: {},
      option3: {},
      option4: {},
      option5: {},
      option6: {},
      archivedYear: moment().format("YYYY"),
      statusYear: moment().format("YYYY"),
      siteYear: moment().format("YYYY")
    };
  },
  methods: {
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - topH - 22; //padding + border：20
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
      });
    },
    getReportSystem() {
      ApiGetreportSystem().then(res => {
        if (res.code == "success") {
          this.option1 = {
            color: ["#4591ff", "#ff5543", "#08b2bf"],
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: [this.$t('report.unarchived'), this.$t('file.noSubmit'), this.$t('file.submitfile')]
            },
            series: [
              {
                name: this.$t('report.fileStat'),
                type: "pie",
                radius: ["50%", "70%"],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: "center"
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: "30",
                      fontWeight: "bold"
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value:
                      res.data.report_file_num.fileNum -
                      res.data.report_file_num.core -
                      res.data.report_file_num.recom,
                    name: this.$t('report.unarchived')
                  },
                  { value: res.data.report_file_num.recom, name: this.$t('file.noSubmit') },
                  { value: res.data.report_file_num.core, name: this.$t('file.submitfile') }
                ]
              }
            ]
          };
          let optionXdata2 = [];//
       
          let _statusNum={
            processing:0,
            reviewing:0,
            qcing:0,
            approving:0,
            archived:0,
            unactivated:0
          };       
          for(let [index,item] of res.data.report_file_status.entries()){
            _statusNum[item.status_code] = item.num;          
          }
         optionXdata2 = Object.values(_statusNum);
          this.option3 = {
            color: ["#37a2da"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985"
                }
              }
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                // data: ["处理中", "审阅中", "QC中", "批准", "已归档", "待激活"]
                 data:  [this.$t('file.processing'), this.$t('file.reviewing'), this.$t('file.qcing'),  this.$t('file.approving'), this.$t('file.archived'),this.$t('file.unactivated')]
              }
            ],
            yAxis: [
              {
                type: "value"
              }
            ],
            series: [
              {
                type: "line",
                smooth: true,
                areaStyle: { normal: {} },
                data: optionXdata2
              }
            ]
          };
          let optionXdata5 = [];
          let optionYdata5 = [];
          if (res.data.reprot_study_site) {
            for (let i = 0; i < res.data.reprot_study_site.length; i++) {
              optionYdata5.push(res.data.reprot_study_site[i].site_name);
              optionXdata5.push(res.data.reprot_study_site[i].num);
            }
            this.option5 = {
              color: ["#25ce51"],
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow"
                }
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              xAxis: {
                type: "value",
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: "category",
                data: optionYdata5
              },
              series: [
                {
                  type: "bar",
                  data: optionXdata5
                }
              ]
            };
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 归档文件统计图.
    getreportSystemArchived(year) {
      ApiGetreportSystemArchived(year).then(res => {
        if (res.code == "success") {
          if (res.data.length > 0) {
            let unarchXdata = [];
            let coreXdata = [];
            let recoXdata = [];
            let optionYdata2 = [];

            this.archivedShow = true;
            for (let i = 0; i < res.data.length; i++) {
              optionYdata2.push(res.data[i].month);
              unarchXdata.push(res.data[i].unarchivedNum);
              coreXdata.push(res.data[i].coreNum);
              recoXdata.push(res.data[i].recomNum);
            }
            this.option2 = {
              color: ["#4591ff", "#ff5543", "#08b2bf"],
              tooltip: {
                trigger: "axis"
              },
              legend: {
                data: [this.$t('report.unarchived'), this.$t('file.noSubmit'), this.$t('file.submitfile')]
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: optionYdata2
              },
              yAxis: {
                type: "value"
              },
              series: [
                {
                  name: this.$t('report.unarchived'),//未归档
                  smooth: true,
                  type: "line",
                  stack: this.$t('report.sum'),//总量
                  data: unarchXdata
                },
                {
                  name: this.$t('file.noSubmit'),//非提交文件
                  type: "line",
                  smooth: true,
                  stack:  this.$t('report.sum'),//总量
                  data: recoXdata
                },
                {
                  name: this.$t('file.submitfile'),//提交文件
                  type: "line",
                  smooth: true,
                  stack:  this.$t('report.sum'),//总量
                  data: coreXdata
                }
              ]
            };
          } else {
            this.archivedShow = false;
            this.option2 = {};
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //文件状态分布月历图
    getreportSystemStatus(year) {
      ApiGetreportSystemStatus(year).then(res => {
        if (res.code == "success") {
          let optionXdata4 = [];
          let processingList = []; // 处理中
          let reviewingList = []; // 审阅中
          let qcingList = []; // qc中
          let approvingList = []; // 批准中
          let receivingList = []; // 待激活
          let archivedList = []; // 已归档
          if (res.data.length > 0) {
            this.statusShow = true;
            for (let i = 0; i < res.data.length; i++) {
              optionXdata4.push(res.data[i].month);
              processingList.push(res.data[i].processingNum);
              reviewingList.push(res.data[i].reviewingNum);
              qcingList.push(res.data[i].qcingNum);
              approvingList.push(res.data[i].approvingNum);
              receivingList.push(res.data[i].receivingNum);
              archivedList.push(res.data[i].archivedNum);
            }
            this.option4 = {
              tooltip: {
                trigger: "axis"
              },
              legend: {
                // data: ["处理中", "审阅中", "QC中", "批准中", "已归档", "待激活"]
              data: [this.$t('file.processing'), this.$t('file.reviewing'), this.$t('file.qcing'),  this.$t('file.approving'), this.$t('file.archived'),this.$t('file.unactivated')]
         
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: optionXdata4
              },
              yAxis: {
                type: "value"
              },
              series: [
                {
                  name: this.$t('file.processing'),//"处理中",
                  type: "line",
                  data: processingList
                },
                {
                  name: this.$t('file.reviewing'),//"审阅中",
                  type: "line",
                  data: reviewingList
                },
                {
                  name: this.$t('file.qcing'),//"QC中",
                  type: "line",
                  data: qcingList
                },
                {
                  name: this.$t('file.approving'),//"批准中",
                  type: "line",
                  data: approvingList
                },
                {
                  name: this.$t('file.archived'),//"已归档",
                  type: "line",
                  data: archivedList
                },
                {
                  name: this.$t('file.unactivated'),//"待激活",
                  type: "line",
                  data: receivingList
                }
              ]
            };
          } else {
            this.statusShow = false;
            this.option4 = {};
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 同一项目下各机构的文件数量
    getreportSystemSite(year) {
      ApiGetreportSystemSite(year).then(res => {
        if (res.code == "success") {
          var arr = Object.keys(res.data);
          if (arr != 0) {
            this.siteShow = true;
            let optionXdata6 = [];
            let series6 = [];
            for (var index in res.data) {
              let data1 = new Map();
              let _arr = [];
              optionXdata6.push(index);
              for (let i = 0; i < res.data[index].length; i++) {
                data1.set(
                  res.data[index][i].month,
                  res.data[index][i].totalNum
                );
              }
              for (let k = 1; k < 13; k++) {
                if (data1.has(k)) {
                  _arr.push(data1.get(k));
                } else {
                  _arr.push("");
                }
              }
              series6.push({
                name: index,
                type: "line",
                data: _arr
              });
            }
            this.option6 = {
              tooltip: {
                trigger: "axis"
              },
              legend: {
                data: optionXdata6
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12"
                ]
              },
              yAxis: {
                type: "value"
              },
              series: series6
            };
          } else {
            this.siteShow = false;
            this.option6 = {};
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    onChangeArchived(val1, val2) {
      // this.getreportSystemArchived(val1);
    },
    onChangeStatus(val1) {
      // this.getreportSystemArchived(val1);
    },
    onChangeSite(val1) {
      // this.getreportSystemSite(val1);
    },
    siteChartShowFun() {
      if (this.siteId == 0) {
        this.siteChartShow = true;
      } else {
        this.siteChartShow = false;
      }
    },
    init() {
      this.archivedYear = moment(this.archivedYear).format("YYYY");
      this.statusYear = moment(this.statusYear).format("YYYY");
      this.siteYear = moment(this.siteYear).format("YYYY");
      // this.getreportSystemArchived(this.archivedYear);
      // this.getreportSystemStatus(this.statusYear);
      if (this.siteId == 0) {
        // this.getreportSystemSite(this.siteYear);
      }
      this.computeHeight();
    }
  },
  computed: {
    siteId() {
      return sessionStorage.getItem("siteId");
    },
    privilege() {
      return JSON.parse(localStorage.getItem("privilege"));
    }
  },
  mounted() {
    this.siteChartShowFun();
    this.getReportSystem();
    this.init();
    let _menuList = JSON.parse(localStorage.getItem("menuList"));
    let currentPageList = _menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });

    this.childrenRouter = currentPageList[0].children;
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/variable.scss";
@import "../../../common/css/mixin.scss";

.system-wrap {
  height: 100%;
  overflow: hidden;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid $border-color;
  .system-header {
    padding: 5px 0 15px 0;
    border-bottom: 1px solid $border-color;
  }
  .content {
    overflow: auto;
    padding: 0 20px;
  }
  .btn {
    margin-right: 10px;
    @include btn();
  }
  .active {
    background-color: $theme-green;
    color: #fff;
  }
  .ivu-col-span-12 {
    margin-top: 15px;
  }
  .chart {
    background: #f7f7f7;
    padding: 15px;
    border-radius: 6px;
    p {
      color: #9ea7b3;
      font-size: 14px;
      font-weight: normal;
      padding: 0 0 20px 8px;
    }
    .ivu-date-picker {
      float: right;
    }
  }
}
</style>
