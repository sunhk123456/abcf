import {queryNoteData} from '@/services/noticeBoard';

export default {
  namespace: 'notes',

  state: {
    noteData: [],
    showFlag:''
  },

  effects: {
    *fetchNoteData1({payload}, {call}) {
      return yield call(queryNoteData, payload);
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
  },

}
