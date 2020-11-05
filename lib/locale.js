function getLocaleSource () {
  return process.env.LC_MESSAGES || process.env.LC_ALL || process.env.LANG
}

function parseLocale () {
  const src = getLocaleSource()
  const [territorialLocale, encoding] = src.split('.')
  const [language, territory] = territorialLocale.split('_')
  return { language, territory, territorialLocale, encoding }
}

module.exports = {
  parseLocale
}
