const fetchJsonp = require("fetch-jsonp");

const B = {};
if (location.protocol === "https:") {
  B.apiOrigin = "https://b.hatena.ne.jp";
  B.starOrigin = "https://s.hatena.com";
} else {
  B.apiOrigin = "http://api.b.st-hatena.com";
  B.starOrigin = "http://s.hatena.com";
}

class Bookmark {
  static async getEntryCount(pageUrl) {
    const apiUrl = `http://api.b.st-hatena.com/entry.count?url=${pageUrl}`;
    return fetchJsonp(apiUrl).then(r => {
      if (r.ok) return r.json();
      return null;
    });
  }

  static async getEntryTotalCount(pageUrl) {
    return new Error("Not works because of 'CORB'.");
  }
}

class Star {
  static async get(pageUrl) {
    const url = encodeURIComponent(pageUrl);
    const apiUrl = `${B.apiOrigin}/entry/jsonlite/?url=${url}`;
    return fetchJsonp(apiUrl).then(r => {
      if (r.ok) return r.json();
      return null;
    });
  }
}

module.exports = {
  Bookmark,
  Star
};
