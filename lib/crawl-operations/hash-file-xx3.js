import { open } from "node:fs/promises"

import pkg from "xxhash-addon"
const { XXHash3 } = pkg

const promiseToHash = (readStream) => {
  return new Promise(function (resolve, reject) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]))
    readStream
      .on("data", (data) => xxh3.update(data))
      .on("end", () => resolve(xxh3.digest().toString("hex")))
      .on("error", (error) => {
        reject(error)
      })
  })
}

export const hashString = (string) => {
  const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]))
  xxh3.update(string)
  return xxh3.digest().toString("hex")
}

const hashIt = async (fileObject) => {
  const { absolutePath } = fileObject
  const file = await open(absolutePath)
  const readStream = file.createReadStream()

  try {
    fileObject.hash = await promiseToHash(readStream)
    return fileObject
  } finally {
    readStream.destroy()
    try {
      await file.close()
    } catch {
      // FileHandle may already be closed after the stream ends.
    }
  }
}

export default {
  fn: hashIt,
  name: "hash"
}
