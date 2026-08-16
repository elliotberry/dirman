import path from "node:path"

const globToRegExp = (pattern) => {
  const normalized = pattern.replaceAll("\\", "/")
  let regex = "^"

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index]
    const next = normalized[index + 1]

    if (character === "*" && next === "*") {
      const afterGlob = normalized[index + 2]
      if (afterGlob === "/") {
        regex += "(?:.*/)?"
        index += 2
      } else {
        regex += ".*"
        index += 1
      }
    } else if (character === "*") {
      regex += "[^/]*"
    } else if (character === "?") {
      regex += "[^/]"
    } else if (".$+()[]^{}|".includes(character)) {
      regex += `\\${character}`
    } else {
      regex += character
    }
  }

  return new RegExp(`${regex}$`)
}

const normalizePattern = (pattern) =>
  String(pattern).trim().replaceAll("\\", "/")

const isPlainName = (pattern) => !/[*?]/.test(pattern) && !pattern.includes("/")

/**
 * @param {string} directoryName
 * @param {string[]} patterns
 * @returns {boolean}
 */
export const directoryNameExcluded = (directoryName, patterns = []) =>
  patterns.some((pattern) => {
    const normalized = normalizePattern(pattern)
    return isPlainName(normalized) && directoryName === normalized
  })

/**
 * @param {string} absolutePath
 * @param {string} rootDirectory
 * @param {string[]} patterns
 * @returns {boolean}
 */
export const shouldIgnorePath = (
  absolutePath,
  rootDirectory,
  patterns = []
) => {
  if (patterns.length === 0) {
    return false
  }

  const relative = path
    .relative(rootDirectory, absolutePath)
    .split(path.sep)
    .join("/")
  const baseName = path.basename(absolutePath)
  const segments = new Set(relative.split("/"))

  return patterns.some((pattern) => {
    const normalized = normalizePattern(pattern)
    if (!normalized) {
      return false
    }

    if (isPlainName(normalized)) {
      return segments.has(normalized) || baseName === normalized
    }

    const expression = globToRegExp(
      normalized.startsWith("/") ? normalized.slice(1) : normalized
    )
    return expression.test(relative) || expression.test(baseName)
  })
}
