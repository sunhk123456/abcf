import {queryNotesChange, queryIndexChange} from '@/services/noticeBoard';

export default {
  namespace:'notesRevise',

  state: {
    notesOneData:[],
    isModify:false,
  },

  effects:{
    *fetchNotesOne({payload},{put}){
      yield put({
        type:'getNotesOne',
        payload:payload.data,
      })
    },

    *fetchIsModify({payload}, {put}){
      yield put({
        type:'getIsModify',
        payload:payload.isModify,
      })
    },

    *fetchNotesChange({payload},{call}){
      return yield call(queryNotesChange,payload);
    },

    *fetchIndexChange({payload},{call}){
      return yield call(queryIndexChange,payload);
    },
  },

  reducers:{
    getNotesOne(state,action){
      return{
        ...state,
        notesOneData:action.payload
      }
    },

    getIsModify(state,action){
      return{
        ...state,
        isModify:action.payload
      }
    },

  }
}
