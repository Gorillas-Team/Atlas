const { GorilinkManager } = require('gorilink')

module.exports = class AtlasMusicManager extends GorilinkManager {
  constructor(client, nodes, options){
    const nodesResumable = nodes.map(n => Object.assign({ resumeKey: Math.random().toString(36).slice(2) }, n))

    super(client, nodesResumable, options)
  }
}