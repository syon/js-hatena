const $ = require("jquery");

const B = {}
if (location.protocol === 'https:') {
  B.apiOrigin = 'https://b.hatena.ne.jp'
  B.starOrigin = 'https://s.hatena.com'
} else {
  B.apiOrigin = 'http://api.b.st-hatena.com'
  B.starOrigin = 'http://s.hatena.com'
}

class Bookmark {
  static async getEntryCount(pageUrl) {
    console.log("hatena.js ---- #getEntryCount");
    var apiUrl = `http://api.b.st-hatena.com/entry.count?url=${pageUrl}`;

    // $.ajax returns Promise.
    return $.ajax({
      dataType: "jsonp", // Needs on development
      url: apiUrl
    });
  }

  static async getEntryTotalCount(pageUrl) {
    return new Error("Not works because of 'CORB'.");
  }
}

class Star {
  static async get(pageUrl) {
    return $.ajax({
      dataType: "jsonp", // Needs on development
      url: `${B.apiOrigin}/entry/jsonlite/?url=${encodeURIComponent(pageUrl)}`,
    });
  }
}

module.exports = {
  Bookmark,
  Star
};
