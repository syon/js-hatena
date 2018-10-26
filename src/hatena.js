const fetchJsonp = require("fetch-jsonp");

const B = {};
if (location.protocol === "https:") {
  B.apiOrigin = "https://b.hatena.ne.jp";
  B.starOrigin = "https://s.hatena.com";
  B.starImageOrigin = "https://s.st-hatena.com";
} else {
  B.apiOrigin = "http://api.b.st-hatena.com";
  B.starOrigin = "http://s.hatena.com";
  B.starImageOrigin = "http://s.st-hatena.com";
}

class Bookmark {
  static async getEntryCount(pageUrl) {
    const apiUrl = `${B.apiOrigin}/entry.count?url=${pageUrl}`;
    return fetchJsonp(apiUrl).then(r => {
      if (r.ok) return r.json();
      return null;
    });
  }

  static async getEntryLite(pageUrl) {
    const url = encodeURIComponent(pageUrl);
    const apiUrl = `${B.apiOrigin}/entry/jsonlite/?url=${url}`;
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
  static async getEntry({ userId, yyyymmdd, eid }) {
    const uri = `http://b.hatena.ne.jp/${userId}/${yyyymmdd}%23bookmark-${eid}`;
    const apiUrl = `${B.starOrigin}/entry.json?uri=${uri}`;
    return fetchJsonp(apiUrl).then(r => {
      if (r.ok) return r.json();
      return null;
    });
  }

  static getEntryCountImageURL({ userId, yyyymmdd, eid }) {
    const uri = `http://b.hatena.ne.jp/${userId}/${yyyymmdd}%23bookmark-${eid}`;
    const apiUrl = `${B.starImageOrigin}/entry.count.image?uri=${uri}`;
    return apiUrl;
  }
}

module.exports = {
  Bookmark,
  Star
};
