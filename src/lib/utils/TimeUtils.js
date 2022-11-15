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
  msToHours (s) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = Math.floor(s % 60)

    return [h, m, ss].map(n => this.pad(n, 2)).join(':')
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
