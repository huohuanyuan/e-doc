/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:38 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-17 15:41:12
 */

<template>
  <div class="study-wrapper">
    <split></split>
    <split></split>
    <Row>
      <Col span="12">
      <Form ref="studyForm" :model="studyForm" :rules="studyFormRule" :label-width="80">
        <FormItem :label="$t('title.studyCode')">
          <Input v-model.trim="studyForm.protocol" disabled></Input>
        </FormItem>
        <FormItem :label="$t('title.studyName')" prop="studyName">
          <Input type="textarea" v-model.trim="studyForm.studyName"></Input>
        </FormItem>
        <FormItem :label="$t('title.studyPhase')" prop="phase">
          <Input v-model.trim="studyForm.phase"></Input>
        </FormItem>
        <FormItem :label="$t('title.folderType')" prop="folderType">
          <CheckboxGroup v-model="studyForm.folderType">
            <Checkbox :label="0">{{$t('title.tmfFolder')}}</Checkbox>
            <Checkbox :label="1">{{$t('title.customFolder')}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem :label="$t('title.studyInfo')" prop="description">
          <Input v-model.trim="studyForm.description" type="textarea"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="modifyLoading" @click="modifySave('studyForm')">{{$t('operation.sure')}}</Button>
        </FormItem>
      </Form>
      </Col>
    </Row>

  </div>
</template>
<script>
import {
  ApiGetStudyInfo,
  ApiPutStudyInfo
} from "@/api/manage/study-manage-api";
import { resCode } from "common/js/code";
import Split from "components/units/split";
import moment from "moment";
export default {
  components: {
    Split
  },
  data() {
    return {
      modifyLoading: false,
      studyForm: {
        protocol: "",
        studyName: "",
        folderType: [],
        phase: "",
        description: ""
      },
      studyFormRule: {
        studyName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:216}),
            max: 216,
            trigger: "blur"
          }
        ],
        folderType: [
          {
            required: true,
            type: "array",
            message: this.$t("note.selectOne"),
            min: 1,
            trigger: "change"
          }
        ],
        phase: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:16}),
            max: 16,
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:128}),
            max: 128,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    init() {
      this.getStudyInfo();
    },

    getStudyInfo() {
      ApiGetStudyInfo().then(res => {
        if (res.code == "success") {
          this.studyForm.protocol = res.data.protocol;
          this.studyForm.studyName = res.data.studyName;
          this.studyForm.phase = res.data.phase;
          if (res.data.folderType == 2) {
            this.studyForm.folderType = [0, 1];
          } else {
            this.studyForm.folderType = [res.data.folderType];
          }
          this.studyForm.description = res.data.description;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },

    //修改项目保存
    modifySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modifyLoading = true;
          let _folderType = "";
          if (this.studyForm.folderType.length == 1) {
            _folderType = this.studyForm.folderType[0];
          } else if (this.studyForm.folderType.length == 2) {
            _folderType = 2;
          }
          ApiPutStudyInfo({
            studyName: this.studyForm.studyName,
            phase: this.studyForm.phase,
            folderType: _folderType,
            description: this.studyForm.description
          }).then(res => {
            this.modifyLoading = false;
            if (res.code == "success") {
              this.getStudyInfo();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
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
.study-wrapper {
  height: 100%;
}
</style>

