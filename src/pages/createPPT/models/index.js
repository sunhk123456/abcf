/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/5/5
 */
import {queryPPTTable} from '@/services/createPPT';


export default {
  namespace: 'createPPT',
  state: {
    reportTable:[{
      "reportId": "report001",
      "reportName": "市场经营分析报告1",
      "date": "2019-10",
      "pptPath":"",
      "pdfPath":""

    },
      {
        "reportId": "report002",
        "reportName": "市场经营分析报告2",
        "date": "2019-10",
        "pptPath":"",
        "pdfPath":""
      },
      {
        "reportId": "report003",
        "reportName": "市场经营分析报告3",
        "date": "2019-01",
        "pptPath":"",
        "pdfPath":""
      }
    ],
  },

  effects: {
    *fetchPPTable({payload}, {call,put}) {
      const res = yield call(queryPPTTable, payload);
      yield put({
        type:'getTableData',
        payload:res
      })
    },
  },


  reducers: {
    getTableData(state, action) {
      return {
        ...state,
        reportTable: action.payload,
      }
    },
  },

}
