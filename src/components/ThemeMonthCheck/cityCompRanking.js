/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: cityRanking/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/2/25/025
 */
import React, {PureComponent} from "react"
import styles from "./cityCompRanking.less"
import img1 from "../../assets/image/ThemeMonthCheck/u1832.png"
import img2 from "../../assets/image/ThemeMonthCheck/u1922.png"
import img3 from "../../assets/image/ThemeMonthCheck/u1834.png"

class CityCompRanking extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          "ranking": "1"
          ,
          "provId": "050"
          ,
          "prov": "海南"
          ,
          "grade": "85.3"

        },
        {
          "ranking": "2"
          ,
          "provId": "071"
          ,
          "prov": "湖北"
          ,
          "grade": "84.5"

        },
        {
          "ranking": "3"
          ,
          "provId": "030"
          ,
          "prov": "安徽"
          ,
          "grade": "83.6"
        },
        {
          "ranking": "4"
          ,
          "provId": "070"
          ,
          "prov": "青海"
          ,
          "grade": "82.0"

        },
        {
          "ranking": "5"
          ,
          "provId": "038"
          ,
          "prov": "福建"
          ,
          "grade": "80.9"

        }
        ,
        {
          "ranking": "6"
          ,
          "provId": "088"
          ,
          "prov": "宁夏"
          ,
          "grade": "79.4"

        }
        ,
        {
          "ranking": "7"
          ,
          "provId": "013"
          ,
          "prov": "天津"
          ,
          "grade": "78.1"

        }
        ,
        {
          "ranking": "8"
          ,
          "provId": "074"
          ,
          "prov": "湖南"
          ,
          "grade": "77.7"

        }
        ,
        {
          "ranking": "9"
          ,
          "provId": "031"
          ,
          "prov": "上海"
          ,
          "grade": "75.0"

        }
        ,
        {
          "ranking": "10"
          ,
          "provId": "036"
          ,
          "prov": "浙江"
          ,
          "grade": "71.8"

        }
        ,
        {
          "ranking": "11"
          ,
          "provId": "075"
          ,
          "prov": "江西"
          ,
          "grade": "70.4"

        }
        ,
        {
          "ranking": "12"
          ,
          "provId": "091"
          ,
          "prov": "辽宁"
          ,
          "grade": "67.6"

        }
        ,
        {
          "ranking": "13"
          ,
          "provId": "051"
          ,
          "prov": "广东"
          ,
          "grade": "67.3"

        }
        ,
        {
          "ranking": "14"
          ,
          "provId": "017"
          ,
          "prov": "山东"
          ,
          "grade": "64.9"

        }
        ,
        {
          "ranking": "15"
          ,
          "provId": "086"
          ,
          "prov": "云南"
          ,
          "grade": "64.0"

        }
        ,
        {
          "ranking": "16"
          ,
          "provId": "019"
          ,
          "prov": "山西"
          ,
          "grade": "63.5"

        }
        ,
        {
          "ranking": "17"
          ,
          "provId": "097"
          ,
          "prov": "黑龙江"
          ,
          "grade": "63.5"

        }
        ,
        {
          "ranking": "18"
          ,
          "provId": "111"
          ,
          "prov": "全国"
          ,
          "grade": "63.3"

        }
        ,
        {
          "ranking": "19"
          ,
          "provId": "011"
          ,
          "prov": "北京"
          ,
          "grade": "63.2"

        }
        ,
        {
          "ranking": "20"
          ,
          "provId": "084"
          ,
          "prov": "陕西"
          ,
          "grade": "62.6"

        }
        ,
        {
          "ranking": "21"
          ,
          "provId": "034"
          ,
          "prov": "江苏"
          ,
          "grade": "62.3"

        }
        ,
        {
          "ranking": "22"
          ,
          "provId": "085"
          ,
          "prov": "贵州"
          ,
          "grade": "60.9"

        }
        ,
        {
          "ranking": "23"
          ,
          "provId": "076"
          ,
          "prov": "河南"
          ,
          "grade": "60.9"

        }
        ,
        {
          "ranking": "24"
          ,
          "provId": "089"
          ,
          "prov": "新疆"
          ,
          "grade": "60.8"

        }
        ,
        {
          "ranking": "25"
          ,
          "provId": "010"
          ,
          "prov": "内蒙古"
          ,
          "grade": "60.1"

        }
        ,
        {
          "ranking": "26"
          ,
          "provId": "090"
          ,
          "prov": "吉林"
          ,
          "grade": "59.6"

        }
        ,
        {
          "ranking": "27"
          ,
          "provId": "079"
          ,
          "prov": "西藏"
          ,
          "grade": "56.1"

        },
        {
          "ranking": "28"
          ,
          "provId": "083"
          ,
          "prov": "重庆"
          ,
          "grade": "55.0"

        },
        {
          "ranking": "29"
          ,
          "provId": "018"
          ,
          "prov": "河北"
          ,
          "grade": "54.9"

        },
        {
          "ranking": "30"
          ,
          "provId": "059"
          ,
          "prov": "广西"
          ,
          "grade": "54.5"

        },
        {
          "ranking": "31"
          ,
          "provId": "087"
          ,
          "prov": "甘肃"
          ,
          "grade": "53.9"

        },
        {
          "ranking": "32"
          ,
          "provId": "081"
          ,
          "prov": "四川"
          ,
          "grade": "45.8"

        }
      ],
      // next:0,
      start: 0,
      cityId:""
    }
  }

  componentWillMount(){
    const {provTotalRankingData}=this.props
    if(provTotalRankingData.data!==undefined) {
      this.setState({
        data: provTotalRankingData.data
      })
    }
  }

  componentWillReceiveProps(nextProps){
    const {provTotalRankingData}=nextProps
    if(provTotalRankingData.data!==undefined) {
      this.setState({
        data: provTotalRankingData.data
      })
    }
  }

  autoArrange = () => {
    const s = this
    const {data, start} = this.state
    const {length} = data;
    const a = start;
    if (a > length) {
      this.setState({start: a - 32,})
    }
    if (a < 0) {
      this.setState({start: a + 32,})
    }
    return (
      <div className={styles.proTable}>
        <div className={styles.themeTitle}>省分综合排名总分数</div>
        <div className={styles.wsCityCompRankingContent}>
          <div className={styles.cityCompRankDiv}>
            {s.table(a, a + 16)}
          </div>
          <div className={styles.colMd6}>
            {s.table(a + 16, a + 32)}
          </div>
        </div>
      </div>
    )
  }

  table(start, end) {

    const {data} = this.state
    let endData=end
    const {length} = data;
    if (end > length) {
      endData=length
    }
    const maxGrade = 100;
    const data1 = data.slice(start, endData);
// const max=data.slice(0,2);
    return (
      <div className={styles.wsCityCompRanking}>
        <table className={styles.wsCityCompRankingTable}>
          <tbody>
            <tr className={styles.wsCityCompRankingTableTh}>
              <td className={styles.wsCityCompRankingTableTh1}>
                <img className={styles.wsCityCompRankingTableImg1} src={img1} alt="" />
                <p className={styles.wsCityCompRankingTableThText1}>排名</p>
              </td>
              <td className={styles.wsCityCompRankingTableTh2}>
                <img className={styles.wsCityCompRankingTableImg2} src={img2} alt="" />
                <p className={styles.wsCityCompRankingTableThText2}>省分</p>
              </td>
              <td className={styles.wsCityCompRankingTableTh3}>
                <img className={styles.wsCityCompRankingTableImg3} src={img3} alt="" />
                <p className={styles.wsCityCompRankingTableThText3}>综合得分</p>
              </td>
            </tr>
            {
            data1.map((idata) => {
              let colorRanking;
              let classname;
              let classflag = false;
              if (idata.ranking === "1") {
                colorRanking = '#FF0000'
              } else if (idata.ranking === "2") {
                colorRanking = '#F60'
              } else if (idata.ranking === "3") {
                colorRanking = '#096'
              }
              const grade = parseFloat(idata.grade) || 0;
              let {cityId}=this.state
              if (cityId === "112") {
                cityId = ["010", "011", "013", "017", "018", "019", "076", "090", "091", "097"]
              } else if (cityId === "113") {
                cityId = ["030", "031", "034", "036", "038", "050", "051", "059", "070", "071", "074", "075", "079", "081", "083", "084", "085", "086", "087", "088", "089"]
              } else {
                cityId = [cityId]
              }
              for (let i = 0; i < cityId.length; i += 1) {
                if (idata.provId === cityId[i]) {
                  classflag = true;
                }
              }
              if(classflag){
                classname='wsCityCompRankingTableTd3RectangularChange';
              }else {
                classname='wsCityCompRankingTableTd3Rectangular'
              }
                return (
                  <tr className={styles.wsCityCompRankingTableTr}>
                    <td>
                      <span style={{color: colorRanking}}>&nbsp;{idata.ranking}</span>
                    </td>
                    <td>
                      <span>{idata.prov}</span>
                    </td>
                    <td>
                      <div className={styles[classname]} style={{width: `${grade * 2 * 90 / parseInt(maxGrade, 10)}px`}} />
                      <div className={styles.wsCityCompRankingTableTd3Grade}>{idata.grade}分</div>
                    </td>
                  </tr>
                );
            })
          }
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const s = this
    const {selectPro}=this.props
    const {proId}=selectPro
    this.setState({
      cityId:proId
    })
    return (
      <div className={styles.CityCompRanking}>
        {s.autoArrange()}
      </div>
    )
  }
}

export default CityCompRanking
