<template>
  <main>
    <h1>js-hatena</h1>

    <h3>Bookmark.getEntryLite</h3>
    <button @click="getEntryLite">getEntryLite</button>

    <h3>Star.getEntry</h3>
    <button @click="getEntry">getEntry</button>

    <hr />
    <pre>{{ lite }}</pre>
  </main>
</template>

<script>
import Hatena from "js-hatena";

export default {
  data() {
    return {
      lite: ""
    };
  },
  methods: {
    async getEntryLite() {
      const r = await Hatena.Bookmark.getEntryLite("http://example.com");
      this.lite = JSON.stringify(r, null, 2);
    },
    async getEntry() {
      // http://b.hatena.ne.jp/syonx/20190121#bookmark-36350794
      const arg = { user: "syonx", yyyymmdd: "20190121", eid: 36350794 };
      const r = await Hatena.Star.getEntry(arg);
      this.lite = JSON.stringify(r, null, 2);
    }
  }
};
</script>
