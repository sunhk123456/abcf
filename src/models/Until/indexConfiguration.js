/**
 * @date: 2019/7/30
 *
 * @author 风信子
 *
 * @Description: 指标配置 model
 */

export default {
  namespace: 'IndexConfigModels',

  state: {
    indexConfigData:[
      {
        "indexId": "kpi_prd0003",

        "indexName": "网上用户"
      },
      {
        "indexId": "kpi_prd0005",

        "indexName": "离网用户"
      },
      {
        "indexId": "kpi_prd0006",

        "indexName": "出账收入"
      },
      {
        "indexId": "kpi_prd0007",

        "indexName": "上网流量"
      },
      {
        "indexId": "kpi_prd0008",

        "indexName": "计费时长"
      },
      {
        "indexId": "kpi_prd0002",

        "indexName": "出账用户"
      },
      {
        "indexId": "kpi_prd0050",

        "indexName": "户均出账收入"
      },
      {
        "indexId": "kpi_prd0051",

        "indexName": "户均流量"
      },
      {
        "indexId": "kpi_prd0052",

        "indexName": "户均计费时长"
      },
      {
        "indexId": "kpi_prd0013",

        "indexName": "套外流量"
      },
      {
        "indexId": "kpi_prd0014",

        "indexName": "套外计费时长"
      }
    ], // 指标配置数据,
    saveIndexConfig:[], // 用户选择后保存的指标配置参数
  },

  effects: {
    *getIndexConfig({payload},{put}){
      yield  put({
        type:"indexConfig",
        payload,
      })
    },
  },

  reducers: {
    indexConfig(state,{payload}){
      return{
        ...state,
        saveIndexConfig:payload
      }
    }
  },
};
