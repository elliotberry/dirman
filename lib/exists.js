import { access } from "node:fs/promises"
const exists = async (filePath) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export default exists
