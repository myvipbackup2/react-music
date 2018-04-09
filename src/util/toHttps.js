function toHttps(url = '') {
  return url.replace(/^http:/, 'https:')
}

export default toHttps