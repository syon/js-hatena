const fetchJsonp = require('fetch-jsonp')
const axios = require('axios')

const isServer = !process.client
const isDev = !isServer && window.location.protocol === 'http:'

// https://bookmark.hatenastaff.com/entry/2019/08/26/111011
const B = {}
if (isServer || !isDev) {
  B.countOrigin = 'https://hatena.now.sh/api'
  B.entryOrigin = 'https://hatena.now.sh/api'
  B.profileOrigin = 'https://profile.hatena.ne.jp'
  B.starOrigin = 'https://s.hatena.com'
  B.starAddOrigin = 'https://s.hatena.ne.jp'
  B.starImageOrigin = 'https://s.st-hatena.com'
} else {
  B.countOrigin = 'https://hatena.now.sh/api'
  B.entryOrigin = 'https://hatena.now.sh/api'
  B.profileOrigin = 'http://profile.hatena.ne.jp'
  B.starOrigin = 'http://s.hatena.com'
  B.starAddOrigin = 'http://s.hatena.ne.jp'
  B.starImageOrigin = 'http://s.st-hatena.com'
}

class Util {
  static encodeURI(uri) {
    // decode the passed uri recursively.
    const decodedUri = Util.fullyDecodeURI(uri)
    return encodeURIComponent(decodedUri)
  }

  static isEncoded(uri) {
    const u = uri || ''
    return u !== decodeURIComponent(u)
  }

  static fullyDecodeURI(uri) {
    let u = uri
    while (Util.isEncoded(uri)) {
      u = decodeURIComponent(uri)
    }
    return u
  }
}

class User {
  static getProfileImageURL(user) {
    const apiUrl = `https://cdn.profile-image.st-hatena.com/users/${user}/profile.png`
    return apiUrl
  }

  static getFavorites(user) {
    const apiUrl = `${B.profileOrigin}/${user}/favorites.json`
    return fetchJsonp(apiUrl, { timeout: 30000 }).then((r) => {
      if (r.ok) return r.json()
      throw new Error(r)
    })
  }
}

class Bookmark {
  static getUserPageURL(user) {
    const apiUrl = `https://b.hatena.ne.jp/${user}/`
    return apiUrl
  }

  static async getEntryCount(rawPageUrl) {
    const apiUrl = `${B.countOrigin}/bookmark/getEntryCount`
    const config = {
      params: {
        url: rawPageUrl,
      },
      timeout: 30000,
    }
    return axios(apiUrl, config).then((res) => res.data)
  }

  static async getEntryLite(rawPageUrl) {
    const apiUrl = `${B.countOrigin}/bookmark/getEntryLite`
    const config = {
      params: {
        url: encodeURIComponent(rawPageUrl),
      },
      timeout: 30000,
    }
    return axios(apiUrl, config).then((res) => res.data)
  }

  static async getEntryTotalCount() {
    throw new Error("Not works because of 'CORB'.")
  }
}

class Star {
  static async getEntry({ user, yyyymmdd, eid }) {
    const uri = `https://b.hatena.ne.jp/${user}/${yyyymmdd}%23bookmark-${eid}`
    const encodedUri = Util.encodeURI(uri)
    const apiUrl = `${B.starOrigin}/entry.json?uri=${encodedUri}`
    return fetchJsonp(apiUrl, { timeout: 30000 }).then((r) => {
      if (r.ok) return r.json()
      throw new Error(r)
    })
  }

  static getTotalCount({ uri }) {
    const encodedUri = Util.encodeURI(uri)
    const apiUrl = `${B.starAddOrigin}/blog.json?uri=${encodedUri}`
    return fetchJsonp(apiUrl, { timeout: 30000 }).then((r) => {
      if (r.ok) return r.json()
      throw new Error(r)
    })
  }

  static getEntryCountImageURL({ user, yyyymmdd, eid }) {
    const uri = `https://b.hatena.ne.jp/${user}/${yyyymmdd}%23bookmark-${eid}`
    const encodedUri = Util.encodeURI(uri)
    const apiUrl = `${B.starImageOrigin}/entry.count.image?uri=${encodedUri}`
    return apiUrl
  }

  static async getArrangedStarSetByEntry(entry) {
    if (!entry || !entry.bookmarks) return {}
    const commentedOnly = entry.bookmarks.filter((x) => x.comment)
    const starEntries = await Promise.all(
      commentedOnly.map(async (b) => {
        const se = await Star.getStarEntry(entry.eid, b)
        se.user = b.user
        return se
      })
    )
    return Star.makeStarSet(starEntries)
  }

  static makeStarSet(starEntries) {
    const starSet = {}
    starEntries.forEach((x) => {
      starSet[x.user] = Star.makeStars(x.entries[0])
    })
    return starSet
  }

  static makeStars(entry) {
    const stars = {}
    if (entry) {
      // merge stars by same user (yellow only)
      const yellow = Array.from(new Set(entry.stars.map((x) => x.name))).length
      if (yellow > 0) {
        stars.yellow = yellow
      }
      if (entry.colored_stars) {
        entry.colored_stars.forEach((cs) => {
          stars[cs.color] = cs.stars.length
        })
      }
    }
    return stars
  }

  static async getStarEntry(eid, bookmark) {
    const ymd = bookmark.timestamp.match(/^(20..\/..\/..)/)[1]
    const yyyymmdd = ymd.replace(/\//g, '')
    const star = await Star.getEntry({
      user: bookmark.user,
      yyyymmdd,
      eid,
    })
    return star
  }

  static async getEntries(rawPageUrl) {
    const encodedUri = Util.encodeURI(rawPageUrl)
    const apiUrl = `${B.starAddOrigin}/entries.json?uri=${encodedUri}`
    return fetchJsonp(apiUrl, { timeout: 30000 }).then((r) => {
      if (r.ok) return r.json()
      throw new Error(r)
    })
  }

  static async getRKS(rawPageUrl) {
    const res = await Star.getEntries(rawPageUrl)
    return res.rks
  }

  static async addStar(rawPageUrl) {
    const encodedUri = Util.encodeURI(rawPageUrl)
    const rks = await Star.getRKS(rawPageUrl)
    const apiUrl = `${B.starAddOrigin}/star.add.json?uri=${encodedUri}&rks=${rks}`
    return fetchJsonp(apiUrl, { timeout: 30000 }).then((r) => {
      if (r.ok) return r.json()
      throw new Error(r)
    })
  }
}

module.exports = {
  User,
  Bookmark,
  Star,
}
