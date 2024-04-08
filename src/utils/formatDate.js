export function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
  const date = new Date(time)

  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份是从0开始的
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  const preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    return '0' + index
  })
  // 开个长度为10的数组 格式为 00 01 02 03

  return format.replace(/YY/g, year.toString())
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)
}
