module.exports = {
  msToTime(s) {
    const ms = s % 1000
    s = (s - ms) / 1000
    const secs = s % 60
    s = (s - secs) / 60
    const mins = s % 60
    const hrs = (s - mins) / 60

    return this.pad(hrs) + ':' + this.pad(mins) + ':' + this.pad(secs)
  },

  pad(n, z) {
    z = z || 2
    return ('00' + n).slice(-z)
  },

  progress({ length, total, current }) {
    const char = '─'.repeat(length)
    const index = current / total * length
    return char.slice(0, index) + '🔘' + char.slice(index)
  }
}