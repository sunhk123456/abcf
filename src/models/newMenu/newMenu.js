import {
  queryFirstMenuData,
  querySecondMenuData,
  queryDownData
} from '../../services/newMenu/newMenu';


export default {
  namespace: 'newMenuModel',
  state: {
    firstMenuData: [], // 一级菜单数据
    downData:[], // 查询下拉框数据
    secondMenuData:[], // 二级菜单数据
    hotContent:[], // 热门内容数据

  },
  effects:{
    // 请求一级菜单数据
    *getFirstMenuData({payload={},callback},{call, put}){
      console.log('请求一级菜单数据')
      const response = yield call(queryFirstMenuData,payload);
      console.log('请求一级菜单数据成功')
      yield put({
        type:'setFirstMenuData',
        payload:response.data
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
    // 请求二级菜单数据
    *getSecondMenuData({payload={},callback},{call, put}){
      const response = yield call(querySecondMenuData,payload);
      yield put({
        type:'setSecondMenuData',
        payload:response
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },

    // 请求搜索下拉
    *getDownData({payload={},callback},{call, put}){
      const response = yield call(queryDownData,payload);
      yield put({
        type:'setQueryDownData',
        payload:response.data
      });
      if (callback) callback(response);
      
    },
  },
  reducers:{
    setFirstMenuData(state,{payload}){
      return {
        ...state,
        firstMenuData:payload
      }
    },
    setQueryDownData(state,{payload}){
      console.log('setQueryDownData')
      console.log(payload)
      return {
        ...state,
        downData:payload
      }
    },
    setSecondMenuData(state,{payload}){
      return {
        ...state,
        secondMenuData:payload[0],
        hotContent:payload[1]
      }
    }
  }
}
