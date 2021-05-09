/**
 *
 * add          - 递增指定日期
 * calcAge      - 计算年龄
 * format       - 格式化日期
 * getDayNum    - 获取该月天数
 * getUTCDayCN  - 获取星期中的第几天
 * isLeapYear   - 是否闰年
 * string2dtl   - 渲染日期字符串为显示用格式
 * string2date  - 字符串转换为Date对象
 */

/**
 * 递增指定日期（不会改动原实例）
 * @param {Date} date - Date对象
 * @param {String} v - 格式串，支持运算符+/-，支持单位Y/m/d/H/i/s(年/月/日/时/分/秒)
 * @param {String} [formatStr] - 返回的日期格式，如果指定则返回String类型
 * @return {Date|String} 运算后的Date对象或格式化结果（如果指定formatStr）
 * @example add(new Date('2012-02-29 16:04:00'), '1Y'); //"2013-02-28 16:04:00"
 *          add(new Date('2017-10-18 16:04:00'), '-2m'); //"2017-08-18 16:04:00"
 */
export function add(date, v, formatStr) {
  v = v.trim();
  let num = parseFloat(v), //数值
    unit = v.substr(-1), //单位
    time = date.getTime(),
    ret;
  if (unit == "Y" || unit == "m") {
    //年 || 月
    ret = new Date(time);
    let day = date.getDate();
    ret.setDate(1); //先把日置为1，避免计算错误
    unit == "Y"
      ? ret.setFullYear(ret.getFullYear() + num)
      : ret.setMonth(ret.getMonth() + num);
    ret.setDate(Math.min(day, getDayNum(ret))); //回填日，保证不超过当月最后一天
  } else {
    switch (unit) {
      case "d": //日
        time += num * 86400000;
        break;
      case "H": //时
        time += num * 3600000;
        break;
      case "i": //分
        time += num * 60000;
        break;
      case "s": //秒
        time += num * 1000;
        break;
    }
    ret = new Date(time);
  }
  return formatStr ? format(ret, formatStr) : ret;
}

/**
 * 计算时间差
 * @param {Date} startDate - Date对象
 * @param {Date} endDate - Date对象
 * @return {String} 计算后字符串
 * @example diffTime(new Date("2018-07-06 18:15:32"), new Date("2018-07-06 09:29:57")); //"15:14:25"
 */
export function diffTime(startDate, endDate) {
  let diff = (endDate.getTime() - startDate.getTime()) / 1000;
  if (diff < 0) return "";

  let hours = String(Math.floor(diff / 3600)).padStart(2, "0"),
    leaveSecond = diff % 3600,
    minutes = String(Math.floor(leaveSecond / 60)).padStart(2, "0"),
    seconds = String(leaveSecond % 60).padStart(2, "0");

  return hours + ":" + minutes + ":" + seconds;
}

/**
 * 计算年龄
 * @param {Date} now - 当前时间
 * @param {Date|String} birthday - 出生日期，Date对象或者合法的日期字符串
 * @return {Number} 年龄
 */
export function calcAge(now, birthday) {
  let timeNow = format(now, "YmdHis"), //当前时间，YmdHis
    birthdayTime = format(
      typeof birthday == "string" ? string2date(birthday) : birthday,
      "YmdHis"
    ), //生日时间，YmdHis
    diff = timeNow - birthdayTime; //相差时间，YmdHis
  return Math.floor(diff * Math.pow(10, -10));
}
/**
 * 格式化日期
 * @param {Date} date - Date对象。可略过
 * @param {String} [formatStr='Y-m-d'] - 需要输出的格式
 * @return {String} 格式化后的字符串
 * @example format(new Date()); //"2017-10-18 15:38:34"
 *          format(new Date(), 'Y年m月d日 星期N'); //"2017年10月18日 星期三"
 */
export function format(date, formatStr = "Y-m-d H:i:s") {
  let str = "";
  if (!date) {
    //没有传参
    date = new Date();
  } else if (typeof date === "string") {
    //省略了第一个参数
    formatStr = date;
    date = new Date();
  }
  for (let c of formatStr) {
    switch (c) {
      case "Y": //年，4位
        str += String(date.getFullYear());
        break;
      case "y": //年，2位
        str += String(date.getFullYear()).substr(2);
        break;
      case "m": //月，2位
        str += String(date.getMonth() + 1).padStart(2, "0");
        break;
      case "n": //月，没有前导0
        str += String(date.getMonth() + 1);
        break;
      case "d": //日，2位
        str += String(date.getDate()).padStart(2, "0");
        break;
      case "j": //日，没有前导0
        str += String(date.getDate());
        break;
      case "H": //小时，2位
        str += String(date.getHours()).padStart(2, "0");
        break;
      case "i": //分，2位
        str += String(date.getMinutes()).padStart(2, "0");
        break;
      case "s": //秒，2位
        str += String(date.getSeconds()).padStart(2, "0");
        break;
      case "M": //毫秒，3位
        str += String(date.getMilliseconds()).padStart(3, "0");
        break;
      case "N": //星期中的第几天，汉字，日、一、二等，1位
        str += dategetUTCDayCN();
        break;
      default:
        str += c;
    }
  }
  return str;
}
/**
 * 获取该月的天数
 * @param {Date} date - Date对象
 * @return {Number} 该月的天数
 */
export function getDayNum(date) {
  const m = date.getMonth() + 1;
  if (m == 2) {
    //2月
    return isLeapYear(date) ? 29 : 28;
  } else if (m == 4 || m == 6 || m == 9 || m == 11) {
    return 30;
  } else {
    return 31;
  }
}
/**
 * 获取星期中的第几天
 * @param {Date} date - Date对象
 * @returns (String)日、一、二、...六
 */
export function getUTCDayCN(date) {
  switch (
    date.getUTCDay() //0(周日)到6(周六)
  ) {
    case 0:
      return "日";
    case 1:
      return "一";
    case 2:
      return "二";
    case 3:
      return "三";
    case 4:
      return "四";
    case 5:
      return "五";
    case 6:
      return "六";
  }
}
/**
 * 是否闰年
 * @param {Date|Number} date - Date代表Date对象，Number代表年
 * @return {Boolean} 是true 否false
 */
export function isLeapYear(date) {
  let year = date instanceof Date ? date.getFullYear() : date;
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
/**
 * 字符串转换为Date对象
 * @param {String} v - 日期字符串，接受格式：YYYY-MM-DD、YYYY-MM-DD HH:II:SS、YYYYMMDD、YYYYMMDDHHIISS
 * @return {Date|Null} v对应的Date实例，转换失败则为null
 */
export function string2date(v) {
  let str = string2dtl(v);
  if (str.length < 10) {
    //日期不完整，不合法
    return null;
  }
  str = str.replace(/\-/g, "/");
  if (str.length < 19) {
    //钟点不完整
    str += " 00:00:00".substr(str.length - 19);
  }
  return new Date(str);
}
/**
 * 渲染日期字符串为显示用格式，转换为YYYY-MM-DD或YYYY-MM-DD HH:II:SS或HH:II:SS或HH:II
 * @param {String} v - 需要渲染的字符串，可接受YYYYMMDD或YYYYMMDDHHIISS或HHIISS或HHII
 * @return {String} 渲染结果
 */
export function string2dtl(v) {
  v = v.toString();
  let len = v.length;
  if (len == 17 || len == 14 || len == 12) {
    //转为YYYY-MM-DD HH:II:SS:MMM || YYYY-MM-DD HH:II:SS || YYYY-MM-DD HH:II
    let str = `${v.substr(0, 4)}-${v.substr(4, 2)}-${v.substr(6, 2)} ${v.substr(
      8,
      2
    )}:${v.substr(10, 2)}`;
    if (len >= 14) {
      str += ":" + v.substr(12, 2);
    }
    if (len >= 17) {
      str += ":" + v.substr(14, 3);
    }
    return str;
  } else if (len == 8) {
    //转为YYYY-MM-DD
    return `${v.substr(0, 4)}-${v.substr(4, 2)}-${v.substr(6, 2)}`;
  } else if (len == 6 || len == 4) {
    //转为HH:II:SS || HH:II
    return `${v.substr(0, 2)}-${v.substr(2, 2)}-${
      len == 6 ? ":" + v.substr(4, 2) : ""
    }`;
  }
  return v;
}

/**
 * 比较两个日期大小
 * @param {Date} dateTime1 - 日期字符串
 * @param {Date} dateTime2 - 日期字符串
 * @return {Boolean} true是大于，false是小于
 */
export function compareDateTime(dateTime1, dateTime2) {
  let diff =
    Date.parse(dateTime1.replace(/\-/g, "/")) -
    Date.parse(dateTime2.replace(/\-/g, "/"));
  if (diff > 0) {
    return true;
  } else {
    return false;
  }
}
