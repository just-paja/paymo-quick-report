require('dotenv').config()

const { getWorkedHours } = require('./paymo')
const {
  moment,
  getMonthBusinessDays,
  getMonthBusinessHours,
  setupMoment
} = require('./moment')

const salary = process.env.SALARY
const decimals = 2
const decimalPower = Math.pow(10, decimals)

function print (msg) {
  process.stdout.write(`${msg}\n`)
}

function round (number) {
  return Math.round(number * decimalPower) / decimalPower
}

function getSubtractionBlur (monthDate) {
  return (monthDate.year() / (12 + monthDate.month())) * 4
}

function getBlur (monthDate) {
  const month = monthDate.month()
  if (month % 4 === 0) {
    return -1 * getSubtractionBlur(monthDate.clone().add(3, 'month'))
  }
  if (month % 4 === 1) {
    return getSubtractionBlur(monthDate)
  }
  if (month % 4 === 2) {
    return getSubtractionBlur(monthDate.clone().add(1, 'month'))
  }
  if (month % 4 === 3) {
    return -1 * getSubtractionBlur(monthDate.clone().add(-2, 'month'))
  }
}

function getInvoiceAmount (monthDate, hourSalary) {
  const base = Math.min(salary, hourSalary)
  const schwarzOffset = getBlur(monthDate)
  const invoiceAmount = base + schwarzOffset
  return { invoiceAmount, schwarzOffset }
}

async function main () {
  const dateInput = process.argv[2]
  moment.tz.setDefault('UTC')
  const monthDate = setupMoment(dateInput)
  const businessDays = getMonthBusinessDays(monthDate)
  const businessHours = getMonthBusinessHours(monthDate)
  const workedHours = await getWorkedHours(monthDate)
  const hourSalary = (workedHours / businessHours) * salary
  const { invoiceAmount, schwarzOffset } = getInvoiceAmount(
    monthDate,
    hourSalary
  )

  print(`${monthDate.format('YYYY-MM')} report`)
  print('==============')
  print(`Business days: ${businessDays}`)
  print(`Business hours: ${businessHours}`)
  print(`Worked hours: ${round(workedHours)}`)
  print(`Neat invoice: ${round(hourSalary)}`)
  print(`Invoice: ${round(invoiceAmount)}`)
  print(
    `Schwarz offset: ${schwarzOffset > 0 ? '+' : ''}${round(schwarzOffset)}`
  )
}

main()
