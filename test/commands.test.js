const { FileUtils } = require('../src/lib/utils/index')

const commands = []

FileUtils.requireDir({ dir: 'src/commands' }, (err, Command) => {
  if (err) console.err(err)
  commands.push(Command)
})

describe('Commands', () => {
  it('should have no duplicate names or aliases', (done) => {
    const aliases = commands.reduce((arr, Command) => {
      const { name, aliases } = new Command()
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
    const cmds = commands.map(Command => {
      const cmd = new Command()
      return cmd.constructor.name
    })

    const dupes = arrayDuplicates(cmds)

    if (dupes.length) {
      done(new Error(`class name where found more than once: ${dupes.join(', ')}`))
    } else {
      done()
    }
  })
})

function arrayDuplicates(arr) {
  return arr.filter((value, index) => {
    return arr.indexOf(value) !== index
  })
}