import { readdirSync, statSync, existsSync } from 'fs'
import { resolve } from 'path'

export default class FileUtils {
  static async requireDir ({ dir, filesOnly = ['js'], recursive = true }, callback) {
    if (!existsSync(dir)) return false

    const files = readdirSync(dir)

    for (const file of files) {
      const fullPath = resolve(dir, file)

      if (recursive && statSync(fullPath).isDirectory()) {
        this.requireDir({ dir: fullPath, filesOnly, recursive }, callback)
      }

      if (filesOnly.some(ext => new RegExp(`.${ext}$`).test(file))) {
        try {
          const required = await import('file://' + fullPath)
          callback(null, required.default)
        } catch (err) {
          callback(err, file)
        }
      }
    }
  }
}
