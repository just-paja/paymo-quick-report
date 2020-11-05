require('dotenv').config()

const fetch = require('node-fetch')

const { qsm } = require('query-string-manipulator')

async function fetchPaymo (endpoint, params) {
  const auth = `${process.env.PAYMO_API_KEY}:QUICK_REPORT`
  const baseUrl = `https://${auth}@app.paymoapp.com/api`
  const paymoUrl = qsm(`${baseUrl}/${endpoint}`, {
    set: params
  })
  const res = await fetch(paymoUrl)
  const data = await res.json()
  return data
}

async function getMonthTimeEntries (userId, monthDate) {
  const start = monthDate.clone().startOf('month')
  const end = monthDate.clone().endOf('month')
  const data = await fetchPaymo('entries', {
    where: [
      `time_interval in ("${start.format()}", "${end.format()}")`,
      `user_id = ${userId}`
    ].join(' and ')
  })
  return data.entries
}

async function getPaymoUserId () {
  const data = await fetchPaymo('me')
  const user = data.users[0]
  if (user) {
    return user.id
  }
  throw new Error('WTF: Could not determine Paymo user!')
}

async function getWorkedHours (monthDate) {
  const userId = await getPaymoUserId()
  const entries = await getMonthTimeEntries(userId, monthDate)
  const totalTime = entries.reduce((aggr, entry) => aggr + entry.duration, 0)
  return totalTime / 3600
}

module.exports = {
  fetchPaymo,
  getMonthTimeEntries,
  getPaymoUserId,
  getWorkedHours
}
