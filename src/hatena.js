const $ = require("jquery");

module.exports = async pageUrl => {
  var apiUrl = `http://api.b.st-hatena.com/entry.count?url=${pageUrl}`;

  $.ajax({
    dataType: "jsonp", // Needs on development
    url: apiUrl
  }).done(d => {
    console.log(d);
  });
};
