/**
 * Created by liuxiuqian on 2018/12/3.
 * cookie 封装
 *
 */
import router from 'umi/router';
const prefix = "_dw3_cookie_";

const cookieFun = {
  // 默认cookie的保存时间为24小时
  setCookie(key, value, time) {
    const newkey = prefix + key;
    if (time != null) {
      // 如果方法有time参数，则在cookie过期后清除信息
      const strsec = this.getsec(time);
      const exp = new Date();
      exp.setTime(exp.getTime() + strsec * 1);
      window.document.cookie =
        newkey +
        "=" +
        this.compile(JSON.stringify(value)) +
        ";expires=" +
        exp.toGMTString() +
        ";path=" +
        "/";
    } else {
      // 否则当用户关闭浏览器时cookie失效
      window.document.cookie =
        newkey + "=" + this.compile(JSON.stringify(value)) + ";path=" + "/";
    }
  },
  // 获取getCookie
  getCookie(key) {
    const newkey = prefix + key;
    let arr,
      reg = new RegExp("(^| )" + newkey + "=([^;]*)(;|$)");
    if (window.document.cookie.match(reg)) {
      arr = window.document.cookie.match(reg)
      const val = JSON.parse(this.uncompile(arr[2]));
      return val;
    } else {
      // router.push({
      //   pathname:"/login",
      // })
      return null;
      // return {key:null}; // 防止没有key 的时候报错
    }
  },
/*  remove(key) {
    const newkey = prefix + key;
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = this.getCookie(key);
    if (cval !== null)
      window.document.cookie =
        newkey + "=" + cval + ";expires=" + exp.toGMTString() + ";path=" + "/";
  },*/
  // 清除cookie以prefix开头的
  /**
   * ?= 使用的是正则表达式的正向肯定预查
   */
  clear() {
    // window.document.cookie = '';
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      keys.map(function(key) {
        document.cookie = key + "=0;expires=" + new Date(0).toUTCString();
      });
    }
  },

  // 加密
  compile(code) {
    return escape(code);
  },
  // 解密
  uncompile(code) {
    return unescape(code);
  },

  // 这是有设定过期时间的使用示例：
  // 20s是代表20秒
  // h是指小时，如12小时则是：12h
  // d是天数，30天则：30d
  getsec(str) {
    const str1 = str.substring(0, str.length - 1) * 1;
    const str2 = str.substring(str.length - 1, str.length);
    if (str2 === "s") {
      return str1 * 1000;
    } else if (str2 === "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 === "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  }
};

export default cookieFun;
