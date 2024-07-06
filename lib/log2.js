const verbose = process.env.VERBOSE || false

const log = (message) => {
  if (verbose === true) {
    console.log(message)
  }
}

export default log