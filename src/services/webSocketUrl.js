/**
 * @date: 2019/11/8
 * @author 风信子
 * @Description: 请求api地址
 */

// 命名规范 APIURL_专题名_二级页签  如： APIURL_REALTIMEMONITOR_DAY  APIURL_5G套餐受理用户实时监控_当日值

// 5G套餐受理用户实时监控 当日地址 累计地址
// 正式环境
// export const APIURL_REALTIMEMONITOR_DAY = "ws://10.249.216.109:8789/webSocket/mainContent";
// 测试环境
export const APIURL_REALTIMEMONITOR_DAY = "ws://10.244.4.188:8789/webSocket/mainContent";
// 5G套餐受理用户实时监控
// export const APIURL_REALTIMEMONITOR_TOTAL = "";

// 测试环境
// 携号转网表格，日报地址表格二
export  const APIURL_NETTOWORK_TABLE = "ws://10.249.216.54:8026/webSocket/transferNetwork";
// 携号转网实时监控表格一
export const APIURL_NUMBERTONETWORKTABLE_NO = "ws://10.249.216.54:8026/webSocket/mainContent";
// 携号转网Echart
export  const APIURL_NETTOWORK_ECHART = "ws://10.244.4.188:8359/webSocket/moveMonitor";

// 正式环境
// 携号转网表格，日报地址表格二
// export  const APIURL_NETTOWORK_TABLE = "ws://10.249.216.53:8006/webSocket/transferNetwork";
// // 携号转网实时监控表格一
// export const APIURL_NUMBERTONETWORKTABLE_NO = "ws://10.249.216.53:8006/webSocket/mainContent";
// // 携号转网Echart
// export  const APIURL_NETTOWORK_ECHART = "ws://10.249.216.53:8768/webSocket/moveMonitor";

export const echartsMapJson = "http://10.244.4.182:8097/pptOnlineView/static";

// 测试环境
// 我的预警数字推送
export  const APIURL_WARNING_NUMBER = "ws://10.244.4.188:8790/webSocket/warningContent";

// // 我的预警数字推送
// export  const APIURL_WARNING_NUMBER = "ws://10.249.216.53:8185/webSocket/warningContent\n";

// 测试环境
// 报告生成
export  const APIURL_REPORT_PPT = "http://10.249.216.55:8288/pptEdit/login";
 // export  const APIURL_REPORT_PPT = "http://192.168.110.55:8000/pptEdit/login";
// // 正式环境
// // 报告生成
// export  const APIURL_REPORT_PPT = "http://10.249.216.55:8290/pptEdit/login";

//  我的工作台-驾驶舱-指标维度配置弹窗/模板类型选择弹窗  图片
export  const APIURL_MYSPECIALSUBJECT_IMG = "http://10.244.4.182:9104/picture/mySpecialSubject/";



// 本地环境 客户洞察
 export const APIURL_CUSTOMER_INSIGHT = "http://localhost:8000";
// 测试环境 客户洞察 http://10.244.4.185:6063/
export const APIURL_CUSTOMER_INSIGHT_TEST="http://10.125.1.52:8321";
