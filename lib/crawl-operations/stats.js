import { stat } from "node:fs/promises"

const getStats = async (file) => {
  const { absolutePath } = file
  const stats = await stat(absolutePath)
  file.size = stats.size
  return file
}

export default {
  fn: getStats,
  name: "stats"
}
