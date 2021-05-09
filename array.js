/**
 *
 * last()       - 获取数组最后一项
 * removeOf()   - 删除指定元素
 * uniq()       - 创建一个去重后的数组副本
 * uniqBy()     - 根据数组元素中的一个字段，返回去重后的数组
 */

/**
 * 获取数组最后一项
 * @param {Array} arr - 要操作的数组
 * @return {*} 数组最后一项
 */
export function last(arr) {
  return arr[arr.length - 1];
}
/**
 * 删除指定元素
 * @param {*Array} arr - 要操作的数组
 * @param {*} item - 需要删除的变量
 * @return {Number} 元素下标，如果不存在则-1
 */
export function removeOf(arr, item) {
  let i = -1;
  for (let _i = 0; _i < arr.length; _i++) {
    if (arr[_i] === item) {
      arr.splice(_i, 1);
      if (i === -1) i = _i;
    }
  }
  return i;
}
/**
 * 创建一个去重后的数组副本
 * @param {Array} arr - 要操作的数组
 * @return {Array} 去重后的数组副本
 */
export function uniq(arr) {
  return [...new Set(arr)];
}
/**
 * 根据数组元素中的一个字段，返回去重后的数组
 * @param {Array} arr - 要操作的数组
 * @param {String} key - 不能重复元素的依据，字段对应的值在数组各元素中唯一
 * @return {Array} 去重后的数组副本
 * @example
 * uniqBy([{a:'110'},{a:'111'},{a:'113'},{a:'111'}],'a'); //[{a:'110'},{a:'111'},{a:'113'}]
 */
export function uniqBy(arr, key) {
  let set = new Set(),
    ret = [];
  for (let item of arr) {
    if (!set.has(item[key])) {
      set.add(item[key]);
      ret.push(item);
    }
  }
  return ret;
}
