
/**
 * @name pad
 * @param {number} num number of seconds
 * @param {number} size number of digits
 * @returns {string} formatted time
 */
export const pad = (num, size) => num.toString().padStart(size, '0')

/**
 * @name msToHours
 * @param {number} ms number of seconds
 * @returns {string}formatted time to hours, minutes and seconds (hh:mm:ss)
 */
export const msToHours = (ms) => {
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
}

/**
 * @name progress
 * @description Creates a progress bar
 * @param {number} length length of the bar
 * @param {number} total total of the bar
 * @param {number} current current state of the bar
 * @returns
 */
export const progress = (length, total, current) => {
  const char = '─'.repeat(length)
  const index = current / total * length
  return char.slice(0, index) + '🔘' + char.slice(index)
}
