import { queryMaxDate, queryTemplatesTable, queryTemplatesTableDelete } from "../../../services/benchmarking";

export default {
  namespace:"benchMarking",
  state:{
    dateType:"2",
    markType: 'HXDB_M',
    templateId: '', // 默认为空，从模板页面跳转时传入模板id
    maxDate:'',// 最大账期
    date:'',// 选中的账期
    thData:["序号", "模板名称","账期", "指标名称", "省份","标杆", "操作"], // 表头数据
    tbodyData:[{
      "data": ["序号1", "20180235 测试模板","账期", "指标名称啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", "省份","标杆", "操作"],
      "id": "1" },
      {
        "data": ["序号2", "20180620 测试模板2","账期2", "指标名称2哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇", "省份2","标杆2", "操作"],
        "id": "2" },
      {
        "data": ["序号3", "20181120 测试模板3","账期3", "指标名称3呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃", "省份3","标杆3", "操作3"],
        "id": "3" },], // 表格数据
  },
  effects:{
    *fetchMaxDate({payload},{put, call}){
      const result = yield call(queryMaxDate,payload);
      yield put({
        type:"setMaxDate",
        payload:result
      })
    },

    // 请求模板表格数据
    *fetchTemplatesTable({payload}, {put, call}) {
      const result = yield call(queryTemplatesTable, payload);
      yield put({
        type: "setTemplateTable",
        payload: result
      })
    },
    // 删除模板数据
    *fetchTemplatesTableDelete({payload}, {put, call}) {
      const res = yield call(queryTemplatesTableDelete, payload);
      return res;
    }
  },
  reducers:{
    // 设置最大账期
    setMaxDate(state,action){
      let defaultDate;
      let defaultMaxDate;
      if (action.payload.backDate) {
        defaultDate = action.payload.backDate;
      } else {
        defaultDate = action.payload.maxdate;
      }
      if (action.payload.maxdate) {
        defaultMaxDate = action.payload.maxdate;
      } else {
        defaultMaxDate = '2019-03';
      }
      return {
        ...state,
        maxDate: defaultMaxDate,
        date: defaultDate,
      }
    },
    // 设置选中账期
    setSelectedDate(state,action){
      return {
        ...state,
        date:action.payload
      }
    },
    // 设置日月切换
    setDateType(state,action){
      return {
        ...state,
        dateType:action.payload,
        markType: action.payload==="1"?"HXDB_D":"HXDB_M",
      }
    },
    // 设置模板表格数据
    setTemplateTable(state, action) {
      const {thData,tbodyData } = action.payload;
      return {
        ...state,
        thData,
        tbodyData
      }
    },
    // 模板页跳入横向对标页修改模板id值
    setTemplateId(state, action) {
      return {
        ...state,
        templateId: action.payload
      }
    }
  }
}
