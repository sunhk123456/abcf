import { getRealtimeTitleData } from '../../services/5gRealtimeMonitor/5gRealtimeMonitoe';


export default {
  namespace: 'RealtimeModel',
  state: {
    titleData: {
      'titleName': '',
      'list': [
        { 'id': '01', 'name': '当日值', 'refresh': '页面实时数据刷新频率:1分钟/次' },
        { 'id': '02', 'name': '累计值', 'refresh': '页面实时数据刷新频率:1分钟/次' },
      ],
    },
    contentData:{
      'peopleData': {
        'name': '', 'value': '', 'unit': '',
      },
      'areaData': {
        'title': '地域分布',
        'chartX': ['北京', '天津', '内蒙古', '吉林', '河北'],
        'chart': ['-', '-', '-', '-', '-'],
        'unit': '万元',
        'xName': '',
        'yName': '',
        'download': {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
             ['-','-','-'],
             ['-','-','-'],
          ],
        },
      },
      'productData': {
        'title': '产品分布',
        'chartX': ['5G套餐129元', '5G套餐159元', '5G套餐199元', '5G套餐239元', '5G套餐299元'],
        'chart': ['100', '200', '100', '400', '600'],
        'unit': '万元',
        'xName': '账期',
        'yName': '出账用户数',
        'download': {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
            ['-', '-', '-'],
            ['-', '-', '-'],
          ],
        },
      },
    }
  },
  effects:{
    // 请求表格数据
    *getTitleData({payload={},callback},{call, put}){
      const response = yield call(getRealtimeTitleData,payload);
      yield put({
        type:'setTitleData',
        payload:response
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
  
    // *getContentData({payload={},callback},{call, put}){
    //   const response = yield call(getRealtimeContentData,payload);
    //   yield put({
    //     type:'setContentData',
    //     payload:response
    //   });
    //   if (response !== undefined) {
    //     if (callback) callback(response);
    //   }
    // }
  },
  reducers:{
    setTitleData(state,action){
      return {
        ...state,
        titleData:action.payload
      }
    },
    // setContentData(state,action){
    //   return {
    //     ...state,
    //     contentData:action.payload
    //   }
    // }
  }
}
