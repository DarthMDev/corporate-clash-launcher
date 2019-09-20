<!--suppress CheckEmptyScriptTag -->
<template>
    <div class="inline-div" v-text="convertToLocalDate(date)"/>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component({
    name: "ArticleDate",
    props: {
      date: String,
    }
  })
  export default class ArticleDate extends Vue {
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
</script>

<style scoped>
    .inline-div {
        display: inline-block;
    }
</style>
