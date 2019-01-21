<template>
  <main>
    <h1>js-hatena</h1>

    <input type="text" v-model="rawUrl" style="width:100%;">

    <hr>

    <h3>User.getRKS</h3>
    <button @click="getRKS">getRKS</button>
    <button @click="addStar">addStar</button>

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
      rawUrl: "http://b.hatena.ne.jp/syonx/20190121#bookmark-36350794",
      lite: ""
    };
  },
  methods: {
    async getRKS() {
      const r = await Hatena.Star.getRKS(this.rawUrl);
      this.lite = JSON.stringify(r, null, 2);
    },
    async addStar() {
      const rks = await Hatena.Star.getRKS(this.rawUrl);
      const r = await Hatena.Star.addStar(this.rawUrl, rks);
      this.lite = JSON.stringify(r, null, 2);
    },
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
