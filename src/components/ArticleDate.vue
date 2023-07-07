<!--suppress CheckEmptyScriptTag -->
<template>
    <div class="inline-div" v-text="convertToLocalDate(date)"/>
</template>

<script>
  import { Component, Vue } from 'vue-facing-decorator'

  // create a decorator

  @Component({
    name: "ArticleDate",
    props: {
      date: String,
    }
  })
  class ArticleDate extends Vue {
    convertToLocalDate (isoDate) {
      let dateObj
      try {
        dateObj = new Date(`${isoDate}`)
        return dateObj.toLocaleString('en-US', {
          year: 'numeric',
          hour12: true,
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          timeZoneName: 'short',
        })
      } catch (e) {
        return isoDate
      }
    }
  }
  export default ArticleDate
</script>

<style scoped>
    .inline-div {
        display: inline-block;
    }
</style>
