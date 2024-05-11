import { exec } from "node:child_process"

export const execa = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      resolve(stdout)
    })
  })
}
