const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {  // don't print to console when testing
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {  // don't print to console when testing
    console.error(...params)
  }
}

module.exports = {
  info,
  error
}