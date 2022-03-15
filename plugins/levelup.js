let levelling = require('../lib/levelling')
let fetch = require('node-fetch')

let handler = async (m, { conn, usedPrefix }) => {
  let pp = './src/avatar_contact.png'
  let who = m.sender
  let discriminator = who.substring(9, 13)
  try {
    pp = await conn.getProfilePicture(who)
  } catch (e) {
  } finally {
    let user = global.db.data.users[m.sender]
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
      return { ...value, jid: key }
    })
    let sortedLevel = users.map(toNumber('level')).sort(sort('level'))
    let usersLevel = sortedLevel.map(enumGetKey)
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)
    if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
      let rank = await(await fetch(thumbfoto)).buffer()
        .then(async data => {
          await conn.sendButtonImg(m.chat, data, `@${who.split`@`[0]} Level *${user.level} (${user.exp - min}/${xp})*\nKurang *${max - user.exp}* lagi!`.trim(), watermark, 'Level Up', `${usedPrefix}levelup`, m, { thumbnail: data, height: 282, width: 934, contextInfo: { mentionedJid: [who]} })
        })
    }
    let before = user.level * 1
    while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    if (before !== user.level) {
      let rank = await(await fetch(thumbfoto)).buffer()
        .then(async data => {
          await conn.sendButtonImg(m.chat, data, `@${who.split`@`[0]} _*Level Up!*_\n_${before}_ -> _${user.level}_`.trim(), watermark, 'Level Up', `${usedPrefix}levelup`, m, { thumbnail: data, height: 282, width: 934, contextInfo: { mentionedJid: [who]} })
        })
    }
  }
}

handler.help = ['levelup']
handler.tags = ['xp']

handler.command = /^levelup$/i

module.exports = handler

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}