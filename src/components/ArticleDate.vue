<template>
    <div class="inline-div" v-text="convertToLocalDate(date)"/>
</template>

<script>
  export default {
    name: "ArticleDate",
    props: {
      date: String
    },
    methods: {
      convertToLocalDate(isoDate) {
        let dateObj;
        try {
          dateObj = new Date(`${isoDate}`);
          return dateObj.toLocaleString('en-US', {
            year: "numeric",
            hour12: true,
            month: "long",
            day: "numeric",
            hour: "numeric",
            timeZoneName: "short"
          })
        } catch (e) {
          return isoDate;
        }
      }
    }
  }
</script>

<style scoped>
    .inline-div {
        display: inline-block;
    }
</style>
