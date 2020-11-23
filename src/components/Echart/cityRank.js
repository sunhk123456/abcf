/**
 * @Description: 地市排名双列组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/26
 */

import React, { PureComponent } from 'react';
import {Icon,Button} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import iconFont from '../../icon/Icons/iconfont';
import EchartFontSize from './echartFontSize';
import styles from './cityRank.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

class CityRank extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      page: 1, // 页码
      sortTableValue: [],
      sortIcon:["icon-sort-sheng","icon-sort-sheng"],
      selectIndex: 0 // 选中的同环比
    };
  }

  componentDidMount() {

  }

  // static getDerivedStateFromProps(nextProps,prevState){
  //   console.log(nextProps.data[0].chart[0].tableValue);
  //   console.log(prevState)
  // }

  componentDidUpdate(prevProps, prevState, snapshot){
    const self = this;
    if(snapshot){
      self.setState({selectIndex: 0,page:1})
    }
  }

  getSnapshotBeforeUpdate(prevProps){
    const {data} = this.props;
    return !isEqual(data.data[0].chart[0].tableValue, prevProps.data.data[0].chart[0].tableValue)
  }

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  };

  /*
   * 排序按钮事件
   * index  索引
   * */
  handleIconClick(event, index) {
    const {sortIcon} = this.state;
    let tableValue = [];
    if(sortIcon[index-2] === "icon-sort-sheng"){
      sortIcon.splice([index-2],1,'icon-sort-jiang');
      tableValue = this.sortFun(index, "down");
    }else {
      sortIcon.splice([index-2],1,'icon-sort-sheng');
      tableValue = this.sortFun(index, "up")
    }
    this.setState({
      sortIcon: [...sortIcon],
      sortTableValue : tableValue
    })

  }

  // 排序
  /*
   * index  要排序的数据
   * type 升序 降序
   *
   * */
  sortFun(index, type) {
    const {data} = this.props;
    const cityRankData = data;
    const {tableValue} = cityRankData.data[0].chart[0];

    // xingxiaodong 19.5.24 修改同环比切换，排序只排环比的bug.增加以下三行代码
    let {selectIndex}=this.state;
    if (index===2){
      selectIndex=0
    }
    // console.log('index,type');
    // console.log(index);
    // console.log(type);
    // console.log('排序tableValue');
    // console.log(tableValue);
    // console.log('selectIndex');
    // console.log(selectIndex);
    const sortNumber = (a, b) => {
      const AValue = this.formatData(b.value[index+ selectIndex- 2]);
      const BVlaue = this.formatData(a.value[index+ selectIndex - 2]);
      if (type === "up") {
        return (
          (AValue === "-" ? Infinity : AValue) -
          (BVlaue === "-" ? Infinity : BVlaue)
        );
      }
      return (
        (BVlaue === "-" ? -Infinity : BVlaue) -
        (AValue === "-" ? -Infinity : AValue)
      );
    };
    return tableValue.sort(sortNumber);
  }

  /*
   * 分页处理
   * type 上一页或者下一页
   * */
  handlePage(type,e) {
    let {page} = this.state;
    if (type === 1) {
      page -= 1;
    } else {
      page += 1 ;
    }
    this.setState({
      page
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"cityRank");
  }

  jsonHandle(){

    const {downloadData, data} = this.props;
    // console.log("downloadData");
    // console.log(downloadData);
    const {title, selectUnit, selectCity, selectPro, date, selectNameData} = downloadData;
    const {selectIndex} = this.state;
    const conditionVlue = [];
    selectNameData.forEach((item)=>{
      const valurNameArr = [];
      item.value.forEach((itemValue)=>{
        valurNameArr.push(itemValue.sname)
      });
      conditionVlue.push([item.screenTypeName, ...valurNameArr]);
    });
    const tableData = data.data[0].chart[0];
    const unit= data.data["0"].unit==="%"?"pp":"%";
    const {tableTitle} = tableData; // 表头
    const {tableValue} = tableData; // 表格数据

    const tableTitleDown = tableTitle.map((item, index)=>{
      if(index < tableTitle.length - 1){
        if(index < 3){
          return item;
        }
        return tableTitle[selectIndex+3]
      }
      return "";
    })

    const tableValueDown = tableValue.map((item) =>{
      const arrItem = [];
      arrItem.push(item.rank);
      arrItem.push(item.cityName);
      arrItem.push(item.value[0]);
      arrItem.push(`${item.value[selectIndex+1]}${unit}`);
      return arrItem
    })
    const condition = {
      name: "地市排名",
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
        ...conditionVlue,
      ],
    }
    const table = {
      title: [tableTitleDown],
      value: tableValueDown
    }


    const newJson = {
      fileName: `${title}-地市排名`,
      condition,
      table
    }
    return newJson;
  }

  conditionHandle (index,e){
    // console.log('环比同比被点击index');
    // console.log(index)
    this.setState({
        selectIndex: index
      });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  render() {
    const {data, pattern, btuVisible} = this.props;
    const cityRankData = data;
    const {sortIcon, page, sortTableValue, selectIndex} = this.state;
    if (JSON.stringify(cityRankData) !== "{}") {
      const cityRankDataValue = cityRankData.data[0];
      const unit=cityRankDataValue.unit==="%"?"pp":"%";
      const allTitle = cityRankDataValue.chart[0].tableTitle;
      const tableTitle = allTitle.slice(0,-2);
      tableTitle.push(allTitle.slice(-2)[selectIndex])
      const tableValue = sortTableValue.length === 0 ? cityRankData.data[0].chart[0].tableValue : sortTableValue;
      const endPage = Math.ceil(tableValue.length / 20);
      let titleFontSize = EchartFontSize().titleSize;
      const {downloadSize} = EchartFontSize();
      let titleSize = "title";
      let tableContainer = "tableContainer";
      if (pattern === "small") {
        titleSize = "smallTitle";
        titleFontSize = 12;
        tableContainer = "smallTableContainer";
      }
      // 左侧表头
      const leftTh = tableTitle.map((item, index) => {
        if (index < 2) {
          return <th className={styles[`th${index}`]} key={item}>{item}</th>;
        }
        return (
          <th className={styles.th} key={item}>
            {item}
            <IconFont
              className={styles.sortIcon}
              type={sortIcon[index-2]}
              onClick={event => {
                this.handleIconClick(event, index);
              }}
            />
          </th>
        );
      });
      // 右侧表头
      const rightTh = tableTitle.map((item, index) => {
        if (index < 2) {
          return <th key={item}>{item}</th>;
        }
        return (
          <th className={styles.th} key={item}>
            {item}
            <IconFont
              className={styles.sortIcon}
              type={sortIcon[index-2]}
              onClick={event => {this.handleIconClick(event, index);}}
            />
          </th>
        );
      });

      // 左侧表内容
      const leftTableTd = tableValue.map((item, index) => {
        let rankColor = "";
        let valueColor1 = "green";
        let valueColor0 = "green";

        if (index === 0) {
          rankColor = "rank-first";
        } else if (index === 1) {
          rankColor = "rank-secound";
        } else if (index === 2) {
          rankColor = "rank-third";
        }

        if (this.formatData(item.value[0]) < 0) {
          valueColor0 = "rank-first";
        }

        if (this.formatData(item.value[selectIndex + 1]) < 0) {
          valueColor1 = "rank-first";
        }

        if ((page - 1) * 20 <= index && (page - 1) * 20 + 10 > index) {
          const {cityName} = item;
          let cityNameText = "";
          if (pattern === "small") {
            cityNameText = `${cityName.substr(0, 3)}..`;
          } else if (cityName.length <= 6) {
            cityNameText = cityName;
          } else {
            cityNameText = cityName;
          }
          const value2 = item.value[selectIndex + 1] !== "-" ? `${item.value[selectIndex + 1]}${unit}` : item.value[selectIndex + 1];
          return (
            <tr key={item.rank}>
              <td className={styles[rankColor]}>{index + 1}</td>
              <td title={item.cityName}>
                <span className={styles.cityNameSpan}>{cityNameText}</span>
              </td>
              <td className={styles[valueColor0]}>{item.value[0]}</td>
              <td className={styles[valueColor1]}>{value2}</td>
            </tr>
          );
        }
        return null;
      });
      // 右侧表内容
      const rightTableTd = tableValue.map((item, index) => {
        let valueColor1 = "green";
        let valueColor0 = "green";

        if (this.formatData(item.value[0]) < 0) {
          valueColor0 = "rank-first";
        }

        if (this.formatData(item.value[selectIndex + 1]) < 0) {
          valueColor1 = "rank-first";
        }
        if ((page - 1) * 20 + 10 <= index && page * 20 > index) {
          const {cityName} = item;
          let cityNameText = "";
          if (pattern === "small") {
            cityNameText = `${cityName.substr(0, 3)}..`;
          } else if (cityName.length <= 6) {
            cityNameText = cityName;
          } else {
            cityNameText = cityName;
          }
          return (
            <tr key={item.rank}>
              <td>{index + 1}</td>
              <td title={item.cityName}>
                <span className={styles.cityNameSpan}>{cityNameText}</span>
              </td>
              <td className={styles[valueColor0]}>{item.value[0]}</td>
              <td className={styles[valueColor1]}>{item.value[selectIndex + 1] !== "-" ? `${item.value[selectIndex + 1]}${unit}` : item.value[selectIndex + 1]}</td>
            </tr>
          );
        }
        return null;
      });
      const condition = allTitle.slice(-2);
      // console.log("allTitle,condition")
      // console.log(allTitle)
      // console.log(condition)
      const conditionDom = condition.map((item, index) => {
        let select = "";
        if (selectIndex === index) {
          select = "select";
        }
        return (
          <li
            key={item}
            className={styles[select]}
            onClick={(e) => this.conditionHandle(index,e)}
          >
            {item.slice(-2)}
          </li>
        );
      });

      const {downloadData}=this.props; // 下载所需数据
      return (
        <div id="cityRank" className={styles.cityRankCon}>
          <div style={{fontSize: `${titleFontSize}px`}} className={styles[titleSize]}>地市排名</div>
          {pattern === "big" && btuVisible ? (<ul className={styles.btnUl}>{conditionDom}</ul>) : null}
          <div className={styles[tableContainer]}>
            <div className={styles.tableLeft}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {leftTh}
                  </tr>
                </thead>
                <tbody>
                  {leftTableTd}
                </tbody>
              </table>
            </div>
            <div className={styles.tableRight}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {rightTh}
                  </tr>
                </thead>
                <tbody>
                  {rightTableTd}
                </tbody>
              </table>
            </div>
            <div className={styles.clear} />
            {
              pattern === "small" ? null :
              <div className={styles.pageCon}>
                {page > 1 ? (
                  <span
                    onClick={(e) => {
                      this.handlePage(1,e);
                    }}
                    className={styles.upPage}
                  >
                    上一页
                  </span>
                ) : null}
                {page >= endPage ? null : (
                  <span
                    onClick={(e) => {
                      this.handlePage(2,e);
                    }}
                    className={styles.downPage}
                  >
                    下一页
                  </span>
                )}
              </div>
            }
          </div>
          {downloadData ? <div className={styles.downloadName}><Button size={downloadSize} icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
        </div>
      );
    }
    return null;
  }
}

export default CityRank;


