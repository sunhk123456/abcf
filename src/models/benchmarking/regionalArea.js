import { queryArea } from '@/services/benchmarking';

export default {
  namespace: 'regionalArea',
  state: {
    permissions: [], // 权限范围
    perType: '0', // 权限类型
    areaData: [
      [],
      [],
      [],
    ], // 每个权限省份、市对应的数据
    backDisplay: [], // 选中地域的回显
    areaTitle: '',
  },

  //
  effects: {
    * fetchCityData({ payload }, { put, call }) {
      const result = yield call(queryArea, payload);
      yield put({
        type: 'setCityArea',
        payload: result,
      });
      return result;
    },
  },

  //
  reducers: {
    setCityArea(state, action) {
      const { payload } = action;
      const { permissions, perType, areaData, backDisplay } = payload;

      function getAreaTitle(arr) {
        const len = arr.length;
        let areaTitle = '';
        if (len) {
          for (let i = 0; i < len; i++) {
            const { selectName } = arr[i];
            areaTitle += selectName;
          }
        }else {
         areaTitle = "请选择";
        }
        return areaTitle;
      }

      const areaTitle = getAreaTitle(backDisplay);
      return {
        ...state,
        permissions,
        perType,
        areaData,
        backDisplay,
        areaTitle,
      };
    },

    // 修改被选中的地域列表及回显的地域名称
    setCheckList(state, action) {
      const { payload } = action;
      const { backDisplay, areaTitle} = payload;
      return {
        ...state,
        backDisplay,
        areaTitle,
      };
    },
  },
};
