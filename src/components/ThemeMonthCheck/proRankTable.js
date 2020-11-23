/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: proRankTable/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/2/28/028
 */
import React, {PureComponent} from "react"
import styles from "./proRankTable.less"
import imgSort from "../../assets/image/ThemeMonthCheck/sort-def.png"

class ProRankTable extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      title: [
        "省分"
        ,
        "累计目标"
        ,
        "累计完成"
        ,
        "预算完成率"

      ],
      detail: [
        {
          "prov": "全国"
          ,
          "items":
            [
              "14,580,000.00"
              ,
              "14,084,717.98"
              ,
              "96.60%"

            ]

        }
        ,
        {
          "prov": "北十省"
          ,
          "items":
            [
              "6,260,000.00"
              ,
              "5,971,520.56"
              ,
              "95.39%"

            ]

        }
        ,
        {
          "prov": "南二十一省"
          ,
          "items":
            [
              "8,320,000.00"
              ,
              "7,928,627.22"
              ,
              "95.30%"

            ]

        }
        ,
        {
          "prov": "北京"
          ,
          "items":
            [
              "800,000.00"
              ,
              "722,094.32"
              ,
              "90.26%"

            ]

        }
        ,
        {
          "prov": "天津"
          ,
          "items":
            [
              "320,000.00"
              ,
              "298,131.03"
              ,
              "93.17%"

            ]

        }
        ,
        {
          "prov": "河北"
          ,
          "items":
            [
              "690,000.00"
              ,
              "663,685.55"
              ,
              "96.19%"

            ]

        }
        ,
        {
          "prov": "山西"
          ,
          "items":
            [
              "400,000.00"
              ,
              "386,432.21"
              ,
              "96.61%"

            ]

        }
        ,
        {
          "prov": "内蒙古"
          ,
          "items":
            [
              "330,000.00"
              ,
              "298,310.17"
              ,
              "90.40%"

            ]

        }
        ,
        {
          "prov": "辽宁"
          ,
          "items":
            [
              "610,000.00"
              ,
              "573,005.87"
              ,
              "93.94%"

            ]

        }
        ,
        {
          "prov": "吉林"
          ,
          "items":
            [
              "370,000.00"
              ,
              "357,379.79"
              ,
              "96.59%"

            ]

        }
        ,
        {
          "prov": "黑龙江"
          ,
          "items":
            [
              "380,000.00"
              ,
              "335,305.00"
              ,
              "88.24%"

            ]

        }
        ,
        {
          "prov": "山东"
          ,
          "items":
            [
              "1,230,000.00"
              ,
              "1,253,408.70"
              ,
              "101.90%"

            ]

        }
        ,
        {
          "prov": "河南"
          ,
          "items":
            [
              "1,130,000.00"
              ,
              "1,083,767.93"
              ,
              "95.91%"

            ]

        }
        ,
        {
          "prov": "上海"
          ,
          "items":
            [
              "460,000.00"
              ,
              "446,505.95"
              ,
              "97.07%"

            ]

        }
        ,
        {
          "prov": "江苏"
          ,
          "items":
            [
              "660,000.00"
              ,
              "650,632.86"
              ,
              "98.58%"

            ]

        }
        ,
        {
          "prov": "浙江"
          ,
          "items":
            [
              "510,000.00"
              ,
              "492,553.70"
              ,
              "96.58%"

            ]

        }
        ,
        {
          "prov": "安徽"
          ,
          "items":
            [
              "380,000.00"
              ,
              "366,373.61"
              ,
              "96.41%"

            ]

        }
        ,
        {
          "prov": "福建"
          ,
          "items":
            [
              "430,000.00"
              ,
              "421,554.07"
              ,
              "98.04%"

            ]

        }
        ,
        {
          "prov": "江西"
          ,
          "items":
            [
              "180,000.00"
              ,
              "168,904.37"
              ,
              "93.84%"

            ]

        }
        ,
        {
          "prov": "湖北"
          ,
          "items":
            [
              "610,000.00"
              ,
              "588,990.89"
              ,
              "96.56%"

            ]

        }
        ,
        {
          "prov": "湖南"
          ,
          "items":
            [
              "680,000.00"
              ,
              "655,195.63"
              ,
              "96.35%"

            ]

        }
        ,
        {
          "prov": "广东"
          ,
          "items":
            [
              "1,660,000.00"
              ,
              "1,521,859.70"
              ,
              "91.68%"

            ]

        }
        ,
        {
          "prov": "广西"
          ,
          "items":
            [
              "330,000.00"
              ,
              "295,260.21"
              ,
              "89.47%"

            ]

        }
        ,
        {
          "prov": "海南"
          ,
          "items":
            [
              "110,000.00"
              ,
              "107,471.98"
              ,
              "97.70%"

            ]

        }
        ,
        {
          "prov": "重庆"
          ,
          "items":
            [
              "310,000.00"
              ,
              "298,023.09"
              ,
              "96.14%"

            ]

        }
        ,
        {
          "prov": "四川"
          ,
          "items":
            [
              "480,000.00"
              ,
              "458,624.28"
              ,
              "95.55%"

            ]

        }
        ,
        {
          "prov": "贵州"
          ,
          "items":
            [
              "280,000.00"
              ,
              "272,119.88"
              ,
              "97.19%"

            ]

        }
        ,
        {
          "prov": "云南"
          ,
          "items":
            [
              "160,000.00"
              ,
              "156,542.08"
              ,
              "97.84%"

            ]

        }
        ,
        {
          "prov": "西藏"
          ,
          "items":
            [
              "20,000.00"
              ,
              "19,832.67"
              ,
              "99.16%"

            ]

        }
        ,
        {
          "prov": "陕西"
          ,
          "items":
            [
              "380,000.00"
              ,
              "369,223.24"
              ,
              "97.16%"

            ]

        }
        ,
        {
          "prov": "甘肃"
          ,
          "items":
            [
              "170,000.00"
              ,
              "138,664.22"
              ,
              "81.57%"

            ]

        }
        ,
        {
          "prov": "青海"
          ,
          "items":
            [
              "100,000.00"
              ,
              "86,385.06"
              ,
              "86.39%"

            ]

        }
        ,
        {
          "prov": "宁夏"
          ,
          "items":
            [
              "60,000.00"
              ,
              "66,784.29"
              ,
              "111.31%"

            ]

        }
        ,
        {
          "prov": "新疆"
          ,
          "items":
            [
              "350,000.00"
              ,
              "347,125.44"
              ,
              "99.18%"

            ]

        }

      ],
      left: [],
      right: [],
    }
  }

  componentWillMount() {
    const {ProRankTableData}=this.props
      this.setState({
        detail:ProRankTableData.data.detail,
        title:ProRankTableData.data.title
      })
    this.showTable(ProRankTableData.data.detail)
  }

  componentWillReceiveProps(nextProps){
    const {ProRankTableData}=nextProps
      this.setState({
        detail:ProRankTableData.data.detail,
        title:ProRankTableData.data.title
      })
      this.showTable(ProRankTableData.data.detail)
  }

// 处理数据格式
  formatData=(data)=>{
    const dataA =
      data.indexOf(",") === "-1"
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  }

  sortData=()=>{
    const {detail} = this.state
    const newData=detail.sort((a, b) => {
      const dataA = this.formatData(a.items[2])
      const dataB = this.formatData(b.items[2])
      return dataB-dataA
    })
    this.setState({
      detail:newData
    },()=>this.showTable(newData))
    }

  /**
   * 把data划分为两部分，分别显示在左右两个table中
   */
  showTable=(data)=>{
    const a = []
    const b = []
    data.map((item, index) => {
      if (index < Math.ceil(data.length / 2)) {
        a.push(data[index]);
      } else {
        b.push(data[index]);
      }
      return a
    });
    if (a.length !== b.length) {
      b.push({"prov": "", "items": ["", "", ""]})
    }
   this.setState({
      left: a,
      right: b
    });
  }

  render(){
    const {BarTitle}=this.props;
    const {title} = this.state
    const tableTitle = `${BarTitle.indexName}  单位：${BarTitle.indexUnit}`
    const {left} = this.state;
    const {right} = this.state;
    const trLeft = left.map((item, index) => {
      const colorStyle = `other${index % 2}`;
      return (
        <tr>
          <td title={item.prov} className={styles.prov}>{item.prov}</td>
          <td title={item.items[0]} className={styles[colorStyle]}>{item.items[0]}</td>
          <td title={item.items[1]} className={styles[colorStyle]}>{item.items[1]}</td>
          <td title={item.items[2]} className={styles[colorStyle]}>{item.items[2]}</td>
        </tr>
      )
    }); // 左边表格
    const trRight = right.map((item, index) => {
      const colorStyle = `other${index % 2}`;
      return (
        <tr>
          <td title={item.prov} className={styles.prov}>{item.prov}</td>
          <td title={item.items[0]} className={styles[colorStyle]}>{item.items[0]}</td>
          <td title={item.items[1]} className={styles[colorStyle]}>{item.items[1]}</td>
          <td title={item.items[2]} className={styles[colorStyle]}>{item.items[2]}</td>
        </tr>
      )
    }); // 右边表格
    return (
      <div className={styles.proRankTable}>
        <div className={styles.title}>{tableTitle}</div>
        <div className={styles.main}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{width: "10%"}}>{title[0]}</th>
                <th style={{width: "13%"}}>{title[1]}</th>
                <th style={{width: "13%"}}>{title[2]}</th>
                <th style={{width: "14%"}}>{title[3]}<img src={imgSort} style={{cursor: "pointer"}} onClick={this.sortData.bind(this)} alt="" /></th>
              </tr>
            </thead>
            <tbody>
              {trLeft}
            </tbody>
          </table>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{width: "10%"}}>{title[0]}</th>
                <th style={{width: "13%"}}>{title[1]}</th>
                <th style={{width: "13%"}}>{title[2]}</th>
                <th style={{width: "14%"}}>{title[3]}<img src={imgSort} onClick={this.sortData.bind(this)} alt="" /></th>
              </tr>
            </thead>
            <tbody>
              {trRight}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default ProRankTable

