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

class User {
  static getProfileImageURL(user) {
    const apiUrl = `https://cdn.profile-image.st-hatena.com/users/${user}/profile.png`;
    return apiUrl;
  }
}

class Bookmark {
  static getUserPageURL(user) {
    const apiUrl = `https://b.hatena.ne.jp/${user}/`;
    return apiUrl;
  }

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
  static async getEntry({ user, yyyymmdd, eid }) {
    const uri = `http://b.hatena.ne.jp/${user}/${yyyymmdd}%23bookmark-${eid}`;
    const apiUrl = `${B.starOrigin}/entry.json?uri=${uri}`;
    return fetchJsonp(apiUrl).then(r => {
      if (r.ok) return r.json();
      return null;
    });
  }

  static getEntryCountImageURL({ user, yyyymmdd, eid }) {
    const uri = `http://b.hatena.ne.jp/${user}/${yyyymmdd}%23bookmark-${eid}`;
    const apiUrl = `${B.starImageOrigin}/entry.count.image?uri=${uri}`;
    return apiUrl;
  }

  static async getArrangedStarSetByEntry(entry) {
    const starEntries = await Promise.all(
      entry.bookmarks.map(async b => {
        const se = await Star.getStarEntry(entry.eid, b);
        se.user = b.user;
        return se;
      })
    );
    return Star.makeStarSet(starEntries);
  }

  static makeStarSet(starEntries) {
    const starSet = {};
    starEntries.forEach(x => {
      starSet[x.user] = Star.makeStars(x.entries[0]);
    });
    return starSet;
  }

  static makeStars(entry) {
    const stars = {};
    if (entry) {
      // merge stars by same user (yellow only)
      const yellow = Array.from(new Set(entry.stars.map(x => x.name))).length;
      if (yellow > 0) {
        stars.yellow = yellow;
      }
      if (entry.colored_stars) {
        entry.colored_stars.forEach(cs => {
          stars[cs.color] = cs.stars.length;
        });
      }
    }
    return stars;
  }

  static async getStarEntry(eid, bookmark) {
    const ymd = bookmark.timestamp.match(/^(20..\/..\/..)/)[1];
    const yyyymmdd = ymd.replace(/\//g, "");
    const star = await Star.getEntry({
      user: bookmark.user,
      yyyymmdd,
      eid
    });
    return star;
  }
}

module.exports = {
  User,
  Bookmark,
  Star
};
