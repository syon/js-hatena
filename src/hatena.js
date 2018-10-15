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

  static async getEntryTotalCount(pageUrl) {
    return new Error("Not supported on AJAX. (Request Method: OPTIONS is 405 Method Not Allowed)")
  }
}

module.exports = {
  Bookmark
};
