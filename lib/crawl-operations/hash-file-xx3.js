import { open } from "node:fs/promises"
import pkg from "xxhash-addon"
const { XXHash3 } = pkg

const promiseToHash = (rs) => {
  return new Promise(function (resolve, rej) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]))
    rs.on("data", (data) => xxh3.update(data))
      .on("end", () => resolve(xxh3.digest().toString("hex")))
      .on("error", (error) => {
        rej(error)
      })
  })
}

// Hashes a file using XXHash3
const hashIt = async (fileObject) => {
  const { absolutePath } = fileObject
  let file = await open(absolutePath)
  let rs = file.createReadStream()
  let hash = await promiseToHash(rs)
  await file.close()
  fileObject.hash = hash
  return fileObject
}

export default {
  fn: hashIt,
  name: "hash"
}
