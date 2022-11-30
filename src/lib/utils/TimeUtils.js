export default {
  /**
   *
   * @param {number} num number of seconds
   * @param {number} size number of digits
   * @returns {string} formatted time
   */
  pad (num, size) {
    return num.toString().padStart(size, '0')
  },

  /**
   *
   * @param {number} s number of seconds
   * @returns {string} formatted time to hours, minutes and seconds (hh:mm:ss)
   */
  msToHours (ms) {
    const { values, keys } = Object

    const time = {
      h: Math.floor(ms / 3600000),
      m: Math.floor((ms % 3600000) / 60000),
      s: Math.floor(((ms % 3600000) % 60000) / 1000)
    }

    const formattedTime = values(time)
      .reduce((acc, value, index) => {
        if (value !== 0) acc.push(`${this.pad(value)}${keys(time)[index]}`)
        return acc
      }, [])

    return formattedTime.length === 0 ? '0s' : formattedTime.join(':')
  },

  /**
   * Creates a progress bar
   * @param {number} length length of the bar
   * @param {number} total total of the bar
   * @param {number} current current state of the bar
   * @returns
   */
  progress (length, total, current) {
    const char = '─'.repeat(length)
    const index = current / total * length
    return char.slice(0, index) + '🔘' + char.slice(index)
  }
}
