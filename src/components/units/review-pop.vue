/*
 * @Author: chengshanshan 
 * @Date: 2018-08-29 16:59:14 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-07 10:49:14
 * @instrction:文件审阅审批不通过是提示
 */
<template>
  <Poptip popper-class="comment-pop">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-shibai"></use>
    </svg>
    <div slot="content" class="comment">
      <div class="cell" v-for="(item,index) of failComments" :key="index">
        <div class="note">
          <Tag color="yellow">{{ typeCode(item.type ) }}</Tag>{{item.comment}}</div>

      </div>
    </div>
  </Poptip>
</template>
<script>
import Split from "components/units/split";
export default {
  components: {
    Split
  },
  props: {
    failComments: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    typeCode(code) {
      let str = "";
      switch (code) {
        case 1:
          str = this.$t("file.reviewFail"); //审阅被驳回
          break;
        case 2:
          str = this.$t("file.qcFail"); //qc被驳回
          break;
        case 3:
          str = this.$t("file.approve"); //审批被驳回
      }
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
}
.comment-pop {
  .comment {
    white-space: normal;
    text-align: left;
  }
  .cell {
    margin-bottom: 5px;
    .note {
      max-width: 300px;
    }
  }
}
</style>

