
import  {fetchPlamUsing}  from '@/services/plamUsingData/plamUsingData';

export default {
  namespace: 'dataecharts',

  state: {
    tableData:{
      data: {}
    }
  },

  effects: {

    * fetchdataechartsData({ payload, callback }, { call, put }) {
      const response = yield call(fetchPlamUsing, payload);
      console.log("response",response);
      yield put({
        type: 'savedataechartsData',
        payload: response
      });
      if (callback) callback(response);
    }
  },

  reducers: {
    savedataechartsData(state, action) {
      if (action.payload.data.departmentData){
        action.payload.data.departmentData.sort((a,b)=>(b.nature-a.nature))
        action.payload.data.departmentData.map(ele=>{
          if (ele.user){
            ele.user.sort((a,b)=>{
                if (a.uleader===b.uleader){
                  return   b.utotalVisit-a.utotalVisit
                }
                return   b.uleader-a.uleader
              }
            )
          }else{
            // eslint-disable-next-line no-param-reassign
            ele.user=[];
          }
          return ele.user;

        })
        console.log("payload.data.departmentData");
        console.log(action.payload.data);
        console.log(action.payload);

      }

      return {
        ...state,
        // ...{tableData:action.payload},
        tableData:action.payload
      };

    },
  },
};
