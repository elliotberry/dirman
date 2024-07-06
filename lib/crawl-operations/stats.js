import { stat } from "node:fs/promises"

const getStats = async (file) => {
  const { absolutePath } = file
  const stats = await stat(absolutePath)
  file.stats = stats
  return file
}

export default {
  fn: getStats,
  name: "stats"
}
