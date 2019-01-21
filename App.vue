<template>
  <main>
    <h1>js-hatena</h1>

    <h3>Bookmark.getEntryLite</h3>
    <button @click="getEntryLite">getEntryLite</button>
    <pre>{{ lite }}</pre>
  </main>
</template>

<script>
import Hatena from "js-hatena";

export default {
  data() {
    return {
      lite: ""
    }
  },
  methods: {
    async getEntryLite() {
      const r = await Hatena.Bookmark.getEntryLite("https://example.com");
      this.lite = JSON.stringify(r, null, 2);
    }
  }
};
</script>
