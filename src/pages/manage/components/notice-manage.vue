<template>
  <div class="notice-wrapper">
    <split></split>
    <Form ref="noticeForm" :model="noticeForm" :rules="noticeRule" :label-width="110">
      <FormItem :label="$t('title.noticeName')" prop="noticeTittle">
        <Input v-model.trim="noticeForm.noticeTittle"></Input>
      </FormItem>
      <FormItem :label="$t('title.noticeInfo')">
        <div ref="editor" style="text-align:left">
        </div>
      </FormItem>
      <FormItem>
        <Button type="warning" @click="deleteNotice">{{$t('operation.doDelete')}}</Button>
        <Button type="primary" @click="publish('noticeForm')">{{$t('operation.save')}}</Button>
      </FormItem>
    </Form>

  </div>
</template>
<script>
import E from "wangeditor";
import Split from "components/units/split";
import {
  ApiGetNotice,
  ApiPostNotice,
  ApiDeleteNotice
} from "@/api/manage/notice-manage-api";
import { resCode } from "common/js/code";
import qs from "qs";
export default {
  components: {
    Split
  },
  data() {
    return {
      editorContent: "", //公告内容
      noticeId: "", //公告id
      noticeRule: {
        noticeTittle: [{ required: true, message: " ", trigger: "blur" }]
      },
      noticeForm: {
        noticeTittle: "" //公告标题
      }
    };
  },
  methods: {
    initEditer() {
      //富文本编辑器初始化
      let editor = new E(this.$refs.editor);
      // 自定义菜单配置
      editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote" // 引用
        //   "emoticon", // 表情
        //   "image", // 插入图片
        //   "table", // 表格
        //   "video", // 插入视频
        //   "code", // 插入代码
        //   "undo", // 撤销
        //   "redo" // 重复
      ];
      editor.customConfig.onchange = html => {
        this.editorContent = html;
      };
      editor.create();
      editor.txt.html(this.editorContent);
    },
    init() {
      this.getNotice();
    },

    getContent: function() {
      alert(this.editorContent);
    },
    getNotice() {
      ApiGetNotice().then(res => {
        if (res.code == "success") {
          if (res.data != null) {
            this.editorContent = res.data.noticeContent;
            this.noticeId = res.data.noticeId;
            this.noticeForm.noticeTittle = res.data.noticeTittle;
            this.initEditer();
          } else {
            this.initEditer();
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //公告发布
    publish(name) {
      this.$refs[name].validate(valid => {
        if (valid && this.editorContent) {
          ApiPostNotice(
            qs.stringify({
              noticeTittle: this.noticeForm.noticeTittle,
              noticeContent: this.editorContent
            })
          ).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t('note.noteSucc'));
              this.getNotice();
            } else {
             this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //公告删除
    deleteNotice() {
      ApiDeleteNotice({ noticeId: this.noticeId }).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t('note.delSucc'));
          this.noticeForm.noticeTittle = "";
          this.editorContent = "";
          this.initEditer();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.notice-wrapper {
  height: 100%;
  padding: 10px;
}
</style>
