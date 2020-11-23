import {queryNoteData, queryAnomalyIndex, queryDelNotes, queryDelIndex, queryAddNotes, queryAddIndex} from '@/services/noticeBoard';

export default {
  namespace: 'noticeBoard',

  state: {
    noteData: [],
    showFlag:'',
    anomalyIndex: [],
    moduleId:'1',   // 切换按钮的id，默认是1，公告列表
    indexLists:[]
  },

  effects: {
    *fetchNoteData({payload}, {call, put}) {
      const res = yield call(queryNoteData, payload);
      yield put({
        type: 'getNoteData',
        payload: res,
      })
    },

    *fetchAnomalyIndex({payload}, {call, put}) {
      const res = yield call(queryAnomalyIndex, payload);
      yield put({
        type: 'getAnomalyIndex',
        payload: res,
      })
    },

    *selectorNote({payload},{put}){
      yield put({
        type:'getSelectorNote',
        payload:payload.key,
      })
    },

    *fetchDelNotes({payload},{call}){
      return yield call(queryDelNotes, payload)
    },

    *fetchDelIndex({payload},{call}){
      return yield call(queryDelIndex, payload)
    },

    *fetchAddNotes({payload},{call}){
      return yield call(queryAddNotes, payload)
    },

    *fetchAddIndex({payload},{call}){
      return yield call(queryAddIndex, payload)
    },

  },


  reducers: {
    // 公告信息
    getNoteData(state, action) {
      const ret = action.payload.noteList.map((data,index)=>{
        const res = data;
        res.title = Buffer.from(res.title,'base64').toString();
        res.content = Buffer.from(res.content,'base64').toString();
        res.key = index + 1;
        return res;
      })
      return {
        ...state,
        noteData: ret,
        showFlag:action.payload.showFlag
      }
    },

    // 异常指标信息
    getAnomalyIndex(state, action) {
      return {
        ...state,
        anomalyIndex: action.payload,
      }
    },


    getSelectorNote(state,action){
      return{
        ...state,
        moduleId:action.payload
      }
    },

  },

}
