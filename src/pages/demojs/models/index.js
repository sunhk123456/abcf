import {queryClothing} from '@/services/dataClothing/dataClothing';

export default {
  namespace: 'clothingModels',
  state: {
    clothingdata:[
    ],
    ab:"asd"
  },

  effects: {
    *fetchModuleClothing({payload={}}, {call,put}) {
      console.log('fetch');
      const res = yield call(queryClothing, payload);
      console.log(res);
      yield put({
        type:'getModuleTab',
        payload:res.data
      })
    },
  },

  reducers: {
    getModuleTab(state, action) {
      console.log("action:",action);
      return {
        ...state,
        clothingdata: action.payload,

      }
    },

  },

}
