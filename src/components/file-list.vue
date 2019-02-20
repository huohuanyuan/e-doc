<template>
    <div>
        <ul class="file-list">
            <li v-for="(item, index) in listData" :key="item.folderId" @click="getClient(item)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenjianbao"></use>
                </svg>
                {{item.folderName}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: "FileList",
  props: {
    listData: Array
  },
  data() {
    return {};
  },
  methods: {
    getClient(item) {
      this.$emit("getClient", item);
    }
  }
};
</script>

<style scoped lang="scss">
.file-list {
  li {
    padding: 5px;
    cursor: pointer;
  }
  .icon {
    font-size: 20px;
    margin-right: 10px;
  }
}
</style>
