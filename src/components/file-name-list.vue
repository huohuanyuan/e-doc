<template>
    <div>
        <div>
            <FormItem :label="$t('file.name')" class="in-block-div dire">
                <Input v-model="fileData.fileName" @on-change="onChangeName"></Input>
            </FormItem>
            <FormItem :label="$t('file.code')" class="in-block-div">
                <Input v-model="fileData.fileCode" @on-change="onChangeCode"> </Input>
            </FormItem>
        </div>
    </div>
</template>

<script>
export default {
  name: "FileNameList",
  props: {
    fileSuccessData: {
      type: Object,
      default() {
        return {
          fileName: "",
          fileCode: "",
          fileOid: "",
          fileTypeId: ""
        };
      }
    }
  },
  data() {
    return {
      fileData: this.fileSuccessData
    };
  },
  methods: {
    onChangeName() {
      this.$emit("onChangeFun", this.changeData);
    },
    onChangeCode() {
      this.$emit("onChangeFun", this.changeData);
    }
  },
  computed: {
    changeData() {
      return {
        fileName: this.fileData.fileName,
        fileCode: this.fileData.fileCode,
        fileOid: this.fileData.fileOid,
        fileTypeId: this.fileData.fileTypeId
      };
    }
  }
};
</script>

<style scoped lang="scss">
</style>
