/**
 * @Description: 当日趋势图models
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/29
 */
import { dayTrendEchartFetch } from '@/services/echart';

export default {
  namespace: 'dayTrendEchartModels',

  state: {
    condition: [ // 按钮条件
      { name: "七天", id: "7" },
      { name: "一月", id: "30" },
      { name: "三月", id: "90" },
      { name: "六月", id: "180" }
    ],
  },

  effects: {
    // 数据请求
    *getDayTrendEchartData({ payload }, { call}) {
      const response = yield call(dayTrendEchartFetch, payload);
      return response;
    },
  },

  reducers: {

  },
};
