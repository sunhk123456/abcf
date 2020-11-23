import {queryConformityTable} from '@/services/dataAudit';

export default {
  namespace: 'consistent',
  state: {
    conformityTable:[]
  },

  effects: {
    *fetchConformityTable({payload}, {call,put}) {
      const res = yield call(queryConformityTable, payload);
      yield put({
        type:'getConformityTable',
        payload:res
      })
    },
  },


  reducers: {
    getConformityTable(state, action) {
      return {
        ...state,
        conformityTable: action.payload,
      }
    },
  },

}
