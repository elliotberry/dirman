export default function log(message) {
  if (process.env.VERBOSE === "true") {
    console.log(message)
  }
}
