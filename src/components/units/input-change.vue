/*
 * @Author: chengshanshan 
 * @Date: 2018-08-27 10:59:28 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-27 10:59:48
 * @instraction:自定义目录双击修改目录名组件
 */

<template>
  <span>
    <span v-if="!editing" @dblclick="edit">{{folderName}}</span>
    <Input type="text" ref="input" size="small" v-if="editing" v-model.trim="value" autofocus @on-blur="save" @on-keydown.enter="editClose"></Input>
  </span>
</template>
<script>
export default {
  data() {
    return {
      value: this.folderName,
      editing: false
    };
  },
  props: {
    folderName: {
      type: String,
      default: "test"
    }
  },
  methods: {
    edit() {
      this.editing = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },
    editClose() {
      this.editing = false;
    },
    save() {
      this.editing = false;
      this.$emit("on-change", this.value);
    }
  }
};
</script>

