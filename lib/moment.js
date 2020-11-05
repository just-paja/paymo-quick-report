require('moment-business-days')

const moment = require('moment-timezone')
const Holidays = require('date-holidays')

const { parseLocale } = require('./locale')

const isoDateFormat = 'YYYY-MM-DD'
const isoMonthFormat = 'YYYY-MM'

function getMonthBusinessDays (monthDate) {
  const start = moment(monthDate.format('YYYY-MM-DD')).startOf('month')
  const end = moment(monthDate.format('YYYY-MM-DD'))
    .endOf('month')
    .startOf('day')
  return end.businessDiff(start)
}

function getMonthBusinessHours (monthDate) {
  return getMonthBusinessDays(monthDate) * 8
}

function setupMoment (dateInput) {
  const locale = parseLocale()
  const monthDate = (dateInput ? moment(dateInput) : moment()).startOf('month')
  const hd = new Holidays()
  hd.init(locale.territory)
  const holidays = hd.getHolidays(monthDate.year())
  const holidayDates = holidays.map(holiday =>
    moment(holiday.date).format(isoDateFormat)
  )
  moment.updateLocale(locale.territorialLocale, {
    holidays: holidayDates,
    holidayFormat: isoDateFormat
  })
  return monthDate
}

module.exports = {
  getMonthBusinessDays,
  getMonthBusinessHours,
  isoDateFormat,
  isoMonthFormat,
  moment,
  setupMoment
}
