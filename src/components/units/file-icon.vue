/*
 * @Author: chengshanshan 
 * @Date: 2018-07-24 14:27:08 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-31 15:14:18
 * @instraction:文件名+文件icon + 文件目录
 */
<template>
  <div class="wrapper">
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="iconType"></use>
    </svg>
    <div class="info">
      <p class="name" @click.stop="fileView">{{fileName}}</p>
      <p class="dir">{{fileDir}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      viewTypes: ["pdf", "doc", "docx", ""]
    };
  },
  props: {
    fileType: {
      type: String,
      default: "pdf"
    },
    fileName: {
      type: String,
      default: ""
    },
    fileDir: {
      type: String,
      default: ""
    },
    view: {
      //是否有权限查看
      type: Boolean,
      default: false
    },
    onlineView: {
      //是否支持查看
      type: Boolean,
      default: false
    },
    fileVersionId: {
      type: Number,
      default: 0
    },
    fileId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    iconType() {
      let _fileType = this.fileType;
      switch (_fileType) {
        case "pptx":
          _fileType = "ppt";
          break;
        case "doc":
          _fileType = "docx";
          break;
        case "xls":
          _fileType = "xlsx";
          break;
        case "null":
          _fileType = "null";
          break;
        default:
      }
      return `#icon-${_fileType}`;
    }
  },
  methods: {
    fileView(event) {
      if (!this.view) {
        //无权限查看
        this.$Message.warning(this.$t("note.fileNoAccessReview"));
      } else if (!this.onlineView) {
        //不支持在线查看
        this.$Message.warning(this.$t("note.fileCannotReview"));
      } else {
        const { href } = this.$router.resolve({
          path: `/pdf/${this.fileId}/${this.fileVersionId}`
        });
        window.open(href, "_blank");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/css/mixin.scss";
.wrapper {
  display: flex;
  align-items: center;
  padding: 5px 0;
  .icon {
    font-size: 30px;
    flex-shrink: 0;
  }
  .info {
    margin-left: 10px;
    .name {
      color: #3c423f;

      transition: all 0.5s;
      &:hover {
        cursor: pointer;
        color: $theme-green;
      }
    }
    .dir {
      font-size: 12px;
      color: #8c9996;
    }
  }
}
</style>


