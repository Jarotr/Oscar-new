import db from '../../lib/database.js'

export async function all(m) {
	if (m.fromMe || m.key.remoteJid.endsWith('status@broadcast')) return !1
	if (m.isGroup && db.data.chats[m.chat]?.isBanned) return !1
	if (db.data.users[m.sender]?.banned) return !1
	if (m.isBaileys) return !1
	let msgs = db.data.msgs
	if (!(m.text in msgs)) return
	let _m = this.serializeM(JSON.parse(JSON.stringify(msgs[m.text]), (_, v) => {
		if (
			v !== null &&
			typeof v === 'object' &&
			'type' in v &&
			v.type === 'Buffer' &&
			'data' in v &&
			Array.isArray(v.data)) {
			return Buffer.from(v.data)
		}
		return v
	}))
	await _m.copyNForward(m.chat, true)
}
