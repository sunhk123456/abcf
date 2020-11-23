/**
 * @date: 2019/8/13
 * @author 风信子
 * @Description: 工具类方法
 */

import router from 'umi/router';
import Cookie from '@/utils/cookie';



/**
 * @date: 2019/8/13
 * @author 风信子
 * @Description: 跳转页面传参数
 * @method routerState
 * @param {string} 参数：url 参数描述：跳转的地址
 * @param {object} 参数：state 参数描述：跳转的参数
 * @param {string} 参数：keyName 参数描述：key 名称
 * @return {返回值类型} 返回值说明
*/

export function routerState(url,state={},keyName="routerState") {
  sessionStorage.setItem(keyName,JSON.stringify(state));
  router.push({
    pathname:url,
    state
  })
}

/**
 * @date: 2019/8/13
 * @author 风信子
 * @Description: 获取路由参数  解决刷新页面后state丢失问题
 * @method getRouterState
 * @param {this} 参数：self 参数描述：页面的props
 * @return {any} 参数返回
 */
export function getRouterState(props,keyName="routerState") {
  const {location:{state}} = props;
  return state || JSON.parse(sessionStorage.getItem(keyName))
}

/**
 * @date: 2019/11/14
 * @author 风信子
 * @Description: 处理表格下载字段数据
 * @method handleDownloadTableValue
 * @param {object[]} 参数：data 参数描述：表格数据
 * @param {} 参数：data 参数描述：字段顺序
 * @return {返回值类型} 返回值说明
*/
export function handleDownloadTableValue(data,fieldOrder=Object.keys(data[0])) {
  const table = data.map((item)=>{
    const tableList = fieldOrder.map((itemList)=>item[itemList]);
    return tableList
  });
  return table
}

/**
 * @date: 2020/5/12
 * @author 风信子
 * @Description: 方法说明 处理表格数据 里边是对象的形式
 * @method 方法名 handleDownloadTableObjectValue
 * @param {object[]} 参数：data 参数描述：表格数据
 * @param {array} 参数：data 参数描述：字段顺序
 * @return {返回值类型} 返回值说明
 */
export function handleDownloadTableObjectValue(data,fieldOrder=Object.keys(data[0])) {
  const table = data.map((item)=>{
    const tableList = fieldOrder.map((itemList)=>item[itemList].value);
    return tableList
  });
  return table
}

/**
 * @date: 2020/3/27
 * @author 风信子
 * @Description: 方法说明 基站项目跳转公用方法
 * @method 方法名 JumpBaseStation
 * @param {string} 参数名 path 参数说明 跳转地址
 */
export function JumpBaseStation(path){
  const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
  const { hostname, protocol} = window.document.location;
  const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
  const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
  window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
}

