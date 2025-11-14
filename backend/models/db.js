// LOWDB v7 FIX

const { JSONFile } = require('lowdb/node')
const { Low } = require('lowdb')
const path = require('path')

const file = path.join(__dirname, '..', 'db.json')

const adapter = new JSONFile(file)
const db = new Low(adapter, { users: [] })

async function initDB() {
  await db.read()
  db.data ||= { users: [] }
  await db.write()
}

initDB()

module.exports = db
