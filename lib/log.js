const log = (message) => {
  if (process.env.VERBOSE === "true") {
    console.log(message)
  }
}

export default log
