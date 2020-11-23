import React, { PureComponent } from 'react';
import DownloadFile from '@/utils/downloadFile';

import styles from './timerShaft.less';


class TerminalTimerShaft extends PureComponent {

  static defaultProps = {
    'title': '终端换机轨迹',
    'list': [
      // { 'name': '型号名称', 'time': '2017-6-10' },
      // { 'name': '型号名称', 'time': '2017-6-10' },
      // { 'name': '型号名称', 'time': '2017-6-10' },
      // { 'name': '型号名称', 'time': '2017-6-10' },
      // { 'name': '型号名称', 'time': '2017-6-10' },
    ],
  };

  constructor(props) {
    super(props);
    this.state = {};
  };

  download = (e) => {
    const { echartId } = this.state;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(), echartId);
  };

  jsonHandle = () => {
    const { specialName, proName, cityName, date, chartData } = this.props;
    if (!chartData) {return null;}
    const { title, example, chartX, chart } = chartData;
    const tableTitle = [
      '账期', `${example[0]}(${chart[0].unit})`, `${example[1]}(${chart[1].unit})`,
    ];
    const tableValue = chartX.map((item, index) => (
      [item, chart[0].value[index], chart[1].value[index]]
    ));
    const condition = {
      name: `${title}`,
      value: [
        ['专题名称:', specialName],
        ['省份', proName],
        ['地市', cityName],
        ['日期', date],
      ],
    };
    const table = {
      title: [
        tableTitle,
      ],
      value: tableValue,

    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table,
    };
  };

  render() {
    const { title, list, isUse } = this.props;
    return (
      <div className={styles.page}>
        <div className={styles.titleName}>{title}</div>
        {list && list.length > 0 &&
          <div className={styles.content}>
            <div className={styles.line} />
            <div className={styles.rhombus} />
            <div className={styles.rhombus2} />
            {
            list[0] &&
            <div className={styles.itemTop1}>
              <div className={styles.circle} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
              <div className={styles.verticalLine} />
              <div className={styles.rect}>
                <div className={styles.triangle} />
                <div className={styles.triangle1} />
                <div className={styles.triangle2} />
                <div className={styles.rectText}>{list[0].name}</div>
              </div>
              <div className={styles.text}>
                {list[0].time}
              </div>
            </div>
          }
            {
            list[1] &&
            <div className={styles.itemBottom1}>
              <div className={styles.circle} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
              <div className={styles.verticalLine} />
              <div className={styles.rect}>
                <div className={styles.triangle} />
                <div className={styles.triangle1} />
                <div className={styles.triangle2} />
                <div className={styles.rectText}>{list[1].name}</div>
              </div>
              <div className={styles.text}>
                {list[1].time}
              </div>
            </div>
          }
            {
            list[2] &&
            <div className={styles.itemTop2}>
              <div className={styles.circle} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
              <div className={styles.verticalLine} />
              <div className={styles.rect}>
                <div className={styles.triangle} />
                <div className={styles.triangle1} />
                <div className={styles.triangle2} />
                <div className={styles.rectText}>{list[2].name}</div>
              </div>
              <div className={styles.text}>
                {list[2].time}
              </div>
            </div>
          }
            {
            list[3] &&
            <div className={styles.itemBottom2}>
              <div className={styles.circle} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
              <div className={styles.verticalLine} />
              <div className={styles.rect}>
                <div className={styles.triangle} />
                <div className={styles.triangle1} />
                <div className={styles.triangle2} />
                <div className={styles.rectText}>{list[3].name}</div>
              </div>
              <div className={styles.text}>
                {list[3].time}
              </div>
            </div>
          }
            {
            list[4] &&
            <div className={styles.itemTop3}>
              <div className={styles.circle} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
              <div className={styles.verticalLine} />
              <div className={styles.rect}>
                <div className={styles.triangle} />
                <div className={styles.triangle1} />
                <div className={styles.triangle2} />
                <div className={styles.rectText}>{list[4].name}</div>
              </div>
              <div className={styles.text}>
                {list[4].time}
              </div>
            </div>
          }
          </div>
        }
        {
          list.length === 0 && isUse &&
          <p className={styles.welcome}>抱歉!该账号没有匹配信息</p>
        }
      </div>
    );
  }
}

export default TerminalTimerShaft;
