/**
 * base64前缀
 * @param type - base64的类型，支持：png、jpg、pdf
 */
export function base64Pre(type) {
  switch (type) {
    case "png":
      return "data:image/png;base64,";
    case "jpg":
      return "data:image/jpg;base64,";
    case "pdf":
      return "data:application/pdf;base64,";
  }
}

/**
 * 把参数拼接到url
 * @desc 由于url的参数值不能正确区分简单类型（Boolean、Number和String），因此简单类型的参数值都应该使用String
 * @param {String} [url=''] - url
 * @param {Object} [params={}] - 参数
 * @return {String} 拼接参数后的url
 * @example computedUrl('http://localhost:9082', {from:"home/more"}); //"http://localhost:9082?from=home%2Fmore"
 */
export function computedUrlParams(url = "", params = {}) {
  let paramsStr = "";
  for (let k in params) {
    let v = params[k];
    if (typeof v == "object") {
      v = JSON.stringify(v);
    }
    paramsStr += (paramsStr ? "&" : "") + `${k}=${encodeURIComponent(v)}`;
  }
  if (paramsStr) {
    url += (url.includes("?") ? "&" : "?") + paramsStr;
  }
  return url;
}

/**
 * 获取url中的参数
 * @param {String} [url=location.href] - 需要解释的url
 * @return {Object} 参数的键值对
 */
export function getUrlParams(url = location.href) {
  let params = {},
    matched = url.match(/\?(.*?)(#|$)/);
  if (matched) {
    matched[1].split("&").forEach(item => {
      let arr = item.split("="),
        v = decodeURIComponent(arr[1]);
      try {
        let tmp = JSON.parse(v);
        if (typeof tmp == "object") v = tmp;
      } catch (e) {}
      params[arr[0]] = v;
    });
  }
  return params;
}
