const $ = require("jquery");

class Bookmark {
  static async getEntryCount(pageUrl) {
    console.log("hatena.js ---- #getEntryCount")
    var apiUrl = `http://api.b.st-hatena.com/entry.count?url=${pageUrl}`;

    // $.ajax returns Promise.
    return $.ajax({
      dataType: "jsonp", // Needs on development
      url: apiUrl
    });
  }
}

module.exports = {
  Bookmark
};
