import { loadDirectory } from '../src/lib/utils/FileUtils.js'

const commands = await loadDirectory('./src/commands')

describe('Commands', () => {
  it('should have no duplicate names or aliases', (done) => {
    const aliases = commands.reduce((arr, cmd) => {
      const { name, aliases } = cmd
      return [...arr, name, ...(aliases || [])]
    }, [])

    const dupes = arrayDuplicates(aliases)

    if (dupes.length) {
      done(new Error(`Names or aliases where found more than once: ${dupes.join(', ')}`))
    } else {
      done()
    }
  })

  it('should have no duplicate class names', async (done) => {
    const cmds = commands.map(cmd => {
      return cmd.name
    })

    const dupes = arrayDuplicates(cmds)

    if (dupes.length) {
      done(new Error(`class name where found more than once: ${dupes.join(', ')}`))
    } else {
      done()
    }
  })
})

function arrayDuplicates (arr) {
  return arr.filter((value, index) => {
    return arr.indexOf(value) !== index
  })
}
