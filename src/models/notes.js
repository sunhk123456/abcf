import {queryNoteData, } from '@/services/noticeBoard';

export default {
  namespace: 'notesData',

  state: {
    noteData: [],
    showFlag:'1',
    notesOneData:{},
    btn:'',
    hideNotes:true,
  },

  effects: {
    *fetchNoteData({payload}, {call, put}) {
      const res = yield call(queryNoteData, payload);
      yield put({
        type: 'getNoteData',
        payload: res,
      })
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

    getNoteOne(state,action){
      return {
        ...state,
        notesOneData:action.payload.params.data,
        btn:action.payload.params.btn
      }
    },

    getHideNotes(state,action){
      return {
        ...state,
        hideNotes:action.payload.hideNotes
      }
    },

    getShowFlag(state,action){
      return{
        ...state,
        showFlag:action.payload
      }
    }
  },

}
