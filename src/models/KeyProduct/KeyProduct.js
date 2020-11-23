import { specialReportTable,fakerDownArrow,fakerDownArrow1,downArrow } from '@/services/KeyProduct/KeyProduct';

export default {
  namespace: 'KeyProductData',
  state: {
    tableData:{"thData":[],"tbodyData":[],"unitSwitch":{}},
    fakerDownArrowData:[],
    fakerDownArrowData1:[],
    downArrowData:[],
    currentLevel:"0",
    minLevel:"0",
    maxLevel:"0",
    defaultExpandedRowKeys:[], // 默认的表格展开行
    HandleTableData:[],  // 存放经过处理后的表格数据
    OldData:[], // 存放最初的表格数据
    allOpenKeys:[], // 全部展开的所有keys
  },

  effects: {
    *fetchTable({ payload}, { call, put }) {
      const response = yield call(specialReportTable, payload);
      yield put({
        type: 'table',
        payload: response,
      });
    },

    *fetchFakerDown({ payload, callback }, { call, put }) {
      const response = yield call(fakerDownArrow, payload);
      yield put({
        type: 'faker',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
    *fetchFakerDown1({ payload, callback }, { call, put }) {
      const response = yield call(fakerDownArrow1, payload);
      yield put({
        type: 'faker1',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
    *fetchDownArrow({ payload, callback }, { call, put }) {
      const response = yield call(downArrow, payload);
      yield put({
        type: 'down',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
  },

  reducers: {

    table(state, action) {
     const tableData = action.payload.data
      return {
        ...state,
        tableData,
        currentLevel:tableData.unitSwitch?tableData.unitSwitch.useUnit:"0",
        minLevel:tableData.unitSwitch?tableData.unitSwitch.minUnit:"0",
        maxLevel:tableData.unitSwitch?tableData.unitSwitch.maxUnit:"0",
      };
    },
    faker(state, action) {
      return {
        ...state,
        fakerDownArrowData: action.payload.data,
      };
    },
    faker1(state, action) {
      return {
        ...state,
        fakerDownArrowData1: action.payload.data,
      };
    },
    down(state, action) {
      return {
        ...state,
        downArrowData: action.payload.data,
      };
    },
    initTableData(state,{payload}){
      // 初始表格数据
      return {
        ...state,
        HandleTableData:payload.HandleTableData,
        OldData:payload.OldData,
        defaultExpandedRowKeys:payload.defaultExpandedRowKeys,
        allOpenKeys:payload.allOpenKeys
      }
    }
  },
};
