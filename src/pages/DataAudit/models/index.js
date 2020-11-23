import {queryModuleTab, queryIndexName,queryProInfo,queryMaxDate,queryAuditTable} from '@/services/dataAudit';

export default {
  namespace: 'dataAudit',
  state: {
    tabId:[],
    auditDate:'',
    indexList:[],
    auditTable:{},
    proInfo:[],
    selectorProId:'111',
    selectorProName:'全国',
    selectorIndexId:'',
    selectorIndexUnit:'',
    selectorIndexName:'',
    selectorTabId:'',
  },

  effects: {
    *fetchModuleTab({payload}, {call,put}) {
      const res = yield call(queryModuleTab, payload);
      yield put({
        type:'getModuleTab',
        payload:res
      })
    },

    *fetchMaxDate({payload}, {call}) {
      return yield call(queryMaxDate, payload);
      // yield put({
      //   type:'getMaxDate',
      //   payload:res
      // })
    },

    *fetchIndexName({payload}, {call,put}) {
      const res =  yield call(queryIndexName, payload);
      yield put({
        type:'getIndexName',
        payload:res
      })
    },

    *fetchProInfo({payload}, {call,put}) {
      const res =  yield call(queryProInfo, payload);
      yield put({
        type:'getProInfo',
        payload:res
      })
    },


    *fetchAuditTable({payload}, {call,put}) {
      const res =  yield call(queryAuditTable, payload);
      yield put({
        type:'getAuditTable',
        payload:res
      })
    },

    *fetchSelectorIndex({payload}, {call}) {
      return  yield call(queryIndexName, payload);
    },


  },


  reducers: {
    getModuleTab(state, action) {
      return {
        ...state,
        tabId: action.payload,
        selectorTabId:action.payload[0].tabId
      }
    },

    getMaxDate(state, action) {
      return {
        ...state,
        auditDate: action.payload.date
      }
    },

    getIndexName(state,action){
      return{
        ...state,
        indexList:action.payload.data,
        selectorIndexId:action.payload.data[0].indexId,
        selectorIndexUnit:action.payload.data[0].indexUnit,
        selectorIndexName:action.payload.data[0].indexName
      }
    },

    getProInfo(state,action){
      return{
        ...state,
        proInfo:action.payload
      }
    },

    getSelectorPro(state,action){
      return{
        ...state,
        selectorProId:action.payload.proId,
        selectorProName:action.payload.proName
      }
    },

    getAuditTable(state,action){
      return{
        ...state,
        auditTable:action.payload
      }
    },

    getSelectorIndex(state,action){
      return{
        ...state,
        selectorIndexId:action.payload.selectorIndexId,
        selectorIndexName:action.payload.selectorIndexName,
        selectorIndexUnit:action.payload.selectorIndexUnit
      }
    },

    getChangeModule(state,action){
      return{
        ...state,
        selectorTabId:action.payload
      }
    }


  },

}
