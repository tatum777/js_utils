/**
 *
 * includeDoubleByte    - 校验一个字符串是否包含双字节字符
 * length       - 获取字符串长度（双字节字符按指定字节数计算）
 * trim         - 裁掉两边的空格或指定字符串
 * uppercaseFirstLetter - 把字符串首字母转为大写
 */

/**
 * 校验一个字符串是否包含双字节字符
 * @param {String} str - 需要校验的字符串
 * @return {Boolean} 是或否
 */
export function includeDoubleByte(str) {
  return /[^\x00-\xff]/.test(str);
}
/**
 * 获取字符串长度（双字节字符按指定字节数计算）
 * @param {String} str - 需要获取的字符串
 * @param {Number} [bytesEachZh=2] - 一个中文的字节数
 */
export function length(str, bytesEachZh = 2) {
  let bytes = 0;
  for (let c of str) {
    if (includeDoubleByte(c)) {
      bytes += bytesEachZh;
    } else {
      bytes++;
    }
  }
  return bytes;
}
/**
 * 裁掉两边的空格或指定字符串
 * @param {String} str - 需要操作的字符串
 * @param {String} [char] - 指定去掉的字符，默认空格
 * @param {String} [direction] - 裁切的方向，“l”-左、“r”-右，默认两端
 */
export function trim(str, char, direction) {
  char = char || "\\s";
  const regStr =
      direction == "l"
        ? `^${char}+`
        : direction == "r"
        ? `${char}+$`
        : `^${char}+|${char}+$`,
    reg = new RegExp(regStr, "g");
  return str.replace(reg, "");
}
/**
 * 把字符串首字母转为大写
 * @param {String} str - 原字符串
 * @return {String} 首字母大写的字符串
 * @example uppercaseFirstLetter('lucy'); //'Lucy'
 */
export function uppercaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
