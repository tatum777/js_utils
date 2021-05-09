/**
 *
 * assignDeep       - 对象深度合并
 * assignDeepExists - 对象深度合并（与assignDeep的区别是目标对象仅接受自身本存在的属性）
 * assignDeepWithArray  - 对象深度合并（与assignDeep区别是数组替换对应下标的元素，而非直接替换整个数组）
 * getDeep          - 获取对象的若干个键后的值
 * invert           - 创建一个键值倒置后的对象副本。如果有重复的值，后面的值会覆盖前面的值
 * invertBy         - 创建一个键值倒置后的对象副本。副本的键名通过迭代函数处理
 * isEmpty          - 对象是否为null或没有属性
 * isPlain          - 检测一个变量是否纯粹的对象
 */

import { last } from "./array";

/**
 * 对象深度合并（与assignDeepWithArray区别是数组直接覆盖，而非替换元素）
 * @param {*Object} target - 接受属性的对象
 * @param {...Object} [source] - 源对象
 * @return 合并后的对象，同target
 * @example assignDeep({a:1, b:{x:1, y:'2'}}, {b:{x:'k'}}) => {a:1, b:{x:'k', y:'2'}}
 *          assignDeep({a:[1,2]}, {a:['k']}) => {a:['k']}
 */
export function assignDeep(target, ...source) {
  for (let item of source) {
    _assignDeep(target, item);
  }
  return target;
}
/**
 * 对象深度合并（与assignDeep的区别是目标对象仅接受自身本存在的属性）
 * @param {*Object} target - 接受属性的对象
 * @param {...Object} [source] - 源对象
 * @return 合并后的对象，同target
 * @example assignDeep({a:1, b:{x:1, y:'2'}}, {b:{x:'k'}}) => {a:1, b:{x:'k', y:'2'}}
 *          assignDeep({a:[1,2]}, {a:['k']}) => {a:['k']}
 */
export function assignDeepExists(target, ...source) {
  for (let item of source) {
    _assignDeep(target, item, true);
  }
  return target;
}
/**
 * 对象深度合并（与assignDeep区别是数组替换对应下标的元素，而非直接替换整个数组）
 * @param {Object} target - 接受属性的对象
 * @param {...Object} [source] - 源对象
 * @return 合并后的对象，同target
 * @example assignDeepWithArray({a:1, b:{x:1, y:'2'}}, {b:{x:'k'}}) => {a:1, b:{x:'k', y:'2'}}
 *          assignDeepWithArray({a:[1,2]}, {a:['k']}) => {a:['k',2]}
 */
export function assignDeepWithArray(target, ...source) {
  for (let item of source) {
    _assignDeep(target, item, false, true);
  }
  return target;
}
/**
 * 获取对象的若干个键后的值
 * @param {Object} obj - 对象
 * @param {...String} keys - 键名，若干
 * @return {*} 值 或 undefined
 * @example
 * if(getDeep(o, 'k1', 'k2')){ ... } 等同于 if(o && o.k1 && o.k1.k2){...}
 */
export function getDeep(obj, ...keys) {
  let v = obj;
  if (!v) return v;
  for (let item of keys) {
    v = v[item];
    if (v === null || v === undefined) return;
  }
  return v;
}
/**
 * 创建一个键值倒置后的对象副本。如果有重复的值，后面的值会覆盖前面的值
 * @param {Object} obj - 源对象
 * @return {Object} 倒置后的对象副本
 * @example invert({x: 'a', y: 'b', z: 'a'}) => {a: 'z', b: 'y'}
 */
export function invert(obj) {
  let duplicate = {};
  for (let k in obj) {
    duplicate[obj[k]] = k;
  }
  return duplicate;
}
/**
 * 创建一个键值倒置后的对象副本。副本的键名通过迭代函数处理
 * @param {Object} obj - 源对象
 * @param {Function} fn - 迭代函数，参数为源对象的值和键名，返回值为副本对象的键名
 * @return {Object} 倒置后的对象副本
 * @example invertBy({x: 'a', y: 'b'}, val=>'new_'+ val) => {new_a: 'x', new_b: 'y'}
 */
export function invertBy(obj, fn) {
  let duplicate = {};
  for (let k in obj) {
    duplicate[fn(obj[k], k)] = k;
  }
  return duplicate;
}
/**
 * 对象是否为null或没有属性
 * @param {Object} v - 需要检测的对象
 * @return {Boolean} null或没有属性则true，有属性或不为对象则false
 */
export function isEmpty(v) {
  if (typeof v == "object") {
    for (let k in v) return false;
    return true;
  }
  return false;
}
/**
 * 检测一个变量是否纯粹的对象
 * @param {*} v - 需要检测的变量
 * @return {Boolean} 是否纯粹对象
 * @example isPlain({k: 1}); //true
 *          isPlain({k: {k2: 1}}); //true
 *          isPlain([]); //false
 *          isPlain(document); //false
 */
export function isPlain(v) {
  if (v && Object.prototype.toString.call(v) == "[object Object]") {
    return true;
  }
  return false;
}
/**
 * 设置对象的若干个键后的值
 * @param {Object} obj - 对象
 * @param {Array} keys - 键名
 * @param {*} v - 值
 * @example
 *      setDeep(obj, ['k1', 'k2'], 'val');
 *      等同于
 *      if(!obj.k1) obj.k1 = {};
 *      obj.k1.k2 = 'val';
 */
export function setDeep(obj, keys, v) {
  let tmp = obj;
  for (let i = 0, item; i < keys.length - 1; i++) {
    item = keys[i];
    if (tmp[item] === null || tmp[item] === undefined) {
      tmp[item] = {};
    }
    tmp = tmp[item];
  }
  tmp[last(keys)] = v;
}
//深度合并对象
function _assignDeep(target, source, exists, withArray) {
  if (source && typeof source == "object") {
    for (let k in source) {
      if (exists) {
        //仅接受自身本存在的属性
        if (!target.hasOwnProperty(k)) continue; //自身不存在此属性
      }
      if (
        source[k] &&
        typeof source[k] == "object" &&
        isPlain(source[k]) &&
        target[k] &&
        typeof target[k] == "object" &&
        isPlain(target[k])
      ) {
        //源对象的值是对象 && 目标的值是对象
        if (withArray) {
          //保留数组的元素
          _assignDeep(target[k], source[k], exists, withArray);
        } else {
          if (Array.isArray(source[k])) {
            target[k] = source[k];
          } else {
            _assignDeep(target[k], source[k], exists, withArray);
          }
        }
      } else {
        target[k] = copy(source[k]);
      }
    }
  }
}

/**
 * 复制变量
 * @param {*} source - 源变量
 * @return {*} 复制后的变量
 */
function copy(source) {
  if (!source || typeof source != "object") {
    //source不为对象，则直接返回
    return source;
  }
  let target;
  if (Array.isArray(source)) {
    target = [];
  } else if (object.isPlain(source)) {
    target = {};
  } else {
    //不为数组或简单对象，则直接返回
    return source;
  }
  for (let k in source) {
    target[k] = this.copy(source[k]); //递归遍历
  }
  return target;
}
