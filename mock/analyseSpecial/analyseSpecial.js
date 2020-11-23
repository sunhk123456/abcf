/**
 *  分析专题数据
 */

    const chartData = {
      "title":"柱形堆积图11111",
      "chartX": ["2019年1月", "2019年02月",],
      "chart": [
        {
          name:'邮件营销',
          data:[ "230", "210"],
          "unit":"%"
        },
        {
          name:'联盟广告',
          data:[ "330", "1,310"],
          "unit":"%"
        },
        {
          name:'邮件营销1',
          data:[ "230", "210"],
          "unit":"%"
        },
        {
          name:'联盟广告1',
          data:[ "330", "310"],
          "unit":"%"

        },
      ],
      "example": ["邮件营销","联盟广告","邮件营销1","联盟广告1"],
    }; // 堆叠柱状图数据



export default {
  'POST /api/IceCream/fetchFakerTable1111':chartData
}
