import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
import echarts from 'echarts';
import {DatePicker} from 'antd';
import moment from 'moment';
import styles from './index.less';
import light from 'echarts/src/theme/light';

const { MonthPicker} = DatePicker;
const monthFormat = 'YYYY/MM';


@connect(({ dataecharts }) => ({
    plamData: dataecharts.tableData,
  }
))
class Echarts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      year: null,
      month: null,
    };
  }

  componentDidMount() {
    this.sendData();
    this.initData();
    this.getDate();
  }

  componentDidUpdate() {
    this.initEcharts();
    this.initData();
  }


  // 将数据构造到表格中
  // eslint-disable-next-line react/sort-comp
  initData = () => {
    const { plamData } = this.props;
    console.log("initData",plamData.code);
    if (plamData.code === "200") {
      console.log('code');
      if (plamData.data.departmentData !== undefined) {
        const departmentData = plamData.data.departmentData.map((item) => (
          <React.Fragment key={item.id + 16}>
            {item.user.map((item01, index) => (
              <tr key={item01.uid + 14}>{index === 0 ?
                <td rowSpan={item.user.length} key={item01.uid + 15}>{item.name}</td> : <React.Fragment/>}
                <td key={item01.uid + 1}>{item01.uname}</td
                >
                <td key={item01.uid + 2}>{item01.utotalLogin}</td
                >
                <td key={item01.uid + 3}>{item01.utotalLoginChain}</td
                >
                <td key={item01.uid + 4}>{item01.uappLoginNum}</td
                >
                <td key={item01.uid + 5}>{item01.uappLoginChain}</td
                >
                <td key={item01.uid + 6}>{item01.uPCLoginNum}</td
                >
                <td key={item01.uid + 7}>{item01.uPCLoginChain}</td
                >
                <td key={item01.uid + 8}>{item01.utotalVisit}</td
                >
                <td key={item01.uid + 9}>{item01.utotalVisitChain}</td
                >
                <td key={item01.uid + 10}>{item01.uPCVisitNum}</td
                >
                <td key={item01.uid + 11}>{item01.uPCVisitChain}</td
                >
                <td key={item01.uid + 12}>{item01.uappVisitNum}</td
                >
                <td key={item01.uid + 13}>{item01.uappVisitChain}</td
                >
              </tr>
            ))}
          </React.Fragment>

        ));
        this.departmentData = departmentData;
      }

    }
  };


  // eslint-disable-next-line react/sort-comp
  getDate = () => {
    const date = new Date();
    this.setState(() => ({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      }),
    );
  };

  sendData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataecharts/fetchdataechartsData',
    });
  };



  initEcharts = () => {
    this.loginNumber();
    this.loginTime();
    this.visitNumber();
    this.visitTime();
  };

  month = (data) => {
    const month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return month[data - 1];
  };


  loginNumber = () => {
    const { plamData } = this.props;
    let APPLogin = 0;
    let PCLogin = 0;
    if (plamData.code === 200) {
      if (plamData.data.currentdata) {
        console.log("plamData.data.currentdata",plamData.data.currentdata[0]);
        APPLogin = plamData.data.currentdata.APPLogin;
        // eslint-disable-next-line prefer-destructuring
        PCLogin = plamData.data.currentdata.PCLogin;
      }
    }
    const MyChart = echarts.init(document.getElementById('lgnum'));
    MyChart.setOption({
      title: {
        text: '登录次数分布',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontFamily: '宋体',
        },
      },
      tooltip: {
        formatter: '{b} : {c}次 ({d}%)',

      },
      legend: {
        icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,

        left: 'center',
        data: ['PC', 'APP'],
      },
      series: [
        {
          label: false,
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          selectedMode: false,
          color: ['#5b9bd5', '#ed7d31'],
          data: [
            {
              value: APPLogin,
              name: 'PC',
            },
            { value: PCLogin, name: 'APP' },

          ],
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },

        },
      ],
    });
  };

  loginTime = () => {
    const { plamData } = this.props;
    const { data } = plamData;
    if (JSON.stringify(data) !== '{}') {
      this.APPLoginTimeMonth = data.APPLoginsMonth.map((ele) => this.month(ele.date.slice(-2)));
      this.APPLoginTimes = data.APPLoginsMonth.map((ele) => ele.number);
      this.PCLoginTimes = data.PCLoginsMonth.map((ele) => ele.number);
    }
    const MyChart = echarts.init(document.getElementById('lgtime'));
    MyChart.setOption({
      title: {
        text: '登录次数时间趋势',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontFamily: '宋体',
        },
      },
      grid: {
        containLabel: true,
      },
      legend: {
        x: 'center',
        y: 'bottom',
        icon: 'roundRect',
        itemWidth: 35,
        itemHeight: 4,
        itemGap: 3,
        data: ['APP', 'PC'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      xAxis: {
        splitLine: { show: false },
        axisTick: {
          show: false,
        }, axisLine: {
          show: false,
        },
        type: 'category',
        data: this.APPLoginTimeMonth,
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        type: 'value',
      },
      series: [{
        name: 'APP',
        data: this.APPLoginTimes,
        type: 'line',
        color: '#5b9bd5',
        symbol: 'none',
      }, {
        name: 'PC',
        data: this.PCLoginTimes,
        type: 'line',
        color: '#ed7d31',
        symbol: 'none',

      }],
    });
  };

  visitNumber = () => {
    const { plamData } = this.props;
    let APPVisit = 0;
    let PCVisit = 0;
    if (plamData.code === 200) {
      if (plamData.data.currentdata) {
        // eslint-disable-next-line prefer-destructuring
        APPVisit = plamData.data.currentdata.APPVisit;
        // eslint-disable-next-line prefer-destructuring
        PCVisit = plamData.data.currentdata.PCVisit;
      }
    }
    const MyChart = echarts.init(document.getElementById('vsnum'));
    MyChart.setOption({
      title: {
        text: '访问次数分布',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontFamily: '宋体',
        },
      },
      tooltip: {
        formatter: '{b} : {c}次 ({d}%)',

      },
      legend: {
        icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,

        left: 'center',
        data: ['PC', 'APP'],
      },
      series: [
        {
          label: false,
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          selectedMode: false,
          color: ['#5b9bd5', '#ed7d31'],
          data: [
            {
              value: APPVisit,
              name: 'PC',
            },
            { value: PCVisit, name: 'APP' },

          ],
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },

        },
      ],
    });
  };

  visitTime = () => {
    const { plamData } = this.props;
    const { data } = plamData;
    if (JSON.stringify(data) !== '{}') {
      this.APPVisitTimeMonth = data.APPVisitsMonth.map((ele) => this.month(ele.date.slice(-2)));
      this.APPVisitTimes = data.APPVisitsMonth.map((ele) => ele.number);
      this.PCVisitTimes = data.PCVisitsMonth.map((ele) => ele.number);
    }
    const MyChart = echarts.init(document.getElementById('vstime'));
    MyChart.setOption({
      title: {
        text: '访问次数时间趋势',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontFamily: '宋体',
        },
      },
      grid: {
        containLabel: true,
      },
      legend: {
        x: 'center',
        y: 'bottom',
        icon: 'roundRect',
        itemWidth: 35,
        itemHeight: 4,
        itemGap: 3,
        data: ['APP', 'PC'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      xAxis: {
        splitLine: { show: false },
        axisTick: {
          show: false,
        }, axisLine: {
          show: false,
        },
        type: 'category',
        data: this.APPVisitTimeMonth,
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        type: 'value',
      },
      series: [{
        name: 'APP',
        data: this.APPVisitTimes,
        type: 'line',
        color: '#5b9bd5',
        symbol: 'none',
      }, {
        name: 'PC',
        data: this.PCVisitTimes,
        type: 'line',
        color: '#ed7d31',
        symbol: 'none',

      }],
    });
  };

  getCurrentData=()=>new Date().toLocaleDateString();

  monthChage=(date,dataString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'dataecharts/fetchdataechartsData',
      payload: { "acct":dataString.replace('\/','') },
    })
    this.initEcharts();

  }

  render() {
    const { year, month } = this.state;
    const { plamData } = this.props;
    console.log("plamData",plamData);
    const { data } = plamData;
    let currentLoginNum = 0;
    let lastLoginNum = 0;
    let loginChain = 0;
    let currentVisitNum = 0;
    let lastVisitNum = 0;
    let visitChain = 0;

    if (JSON.stringify(data) !== '{}') {
      console.log(data.totalData);
      // eslint-disable-next-line prefer-destructuring
      currentLoginNum = data.totalData.currentLoginNum;
      lastLoginNum = data.totalData.lastLoginNum;
      loginChain = data.totalData.loginChain;
      currentVisitNum = data.totalData.currentVisitNum;
      lastVisitNum = data.totalData.lastVisitNum;
      visitChain = data.totalData.visitChain;
    }
    const { departmentData } = this;
    return (
      <div style={{ width: '87%' }}>
        <div className={styles.contenctMain}>
          <div className={styles.title}>集团政企BG经分-掌沃系统使⽤统计
          </div>
          <div className={styles.time}>时间: <MonthPicker defaultValue={moment(this.getCurrentData(),monthFormat)} format={monthFormat} onChange={this.monthChage} />
          </div>

          <div>
            <div className={styles.bgTitleTotal}>
              <span className={styles.textBold}>集团政企BG登录总次数</span>
              <span>本月{currentLoginNum}次  上月{lastLoginNum}次 环比{loginChain}</span>
            </div>
            <div className={styles.bgTitleTotal}>

              <span className={styles.textBold}> 集团政企BG访问总次数</span> <span>本月{currentVisitNum}次  上月{lastVisitNum}次 环比{visitChain}</span>
            </div>
            <div style={{ clear: 'both' }}/>

          </div>
          <div className={styles.echartsBox}>
            <div id="lgnum" style={{ width: 250, height: 350 }}/>
            <div id="lgtime" style={{ width: 400, height: 350 }} />
            <div id="vsnum" style={{ width: 250, height: 350 }}/>
            <div id="vstime" style={{ width: 400, height: 350 }}/>
          </div>
          <div className={styles.tableTitle}> 集团政企BG系统使用明细表</div>
          <div className={styles.overall}>
            <table>
              <thead>
              <tr>
                <th rowSpan="2" style={{ width: '15%' }}>部门</th>
                <th rowSpan="2" style={{ width: '8%' }}>姓名</th>
                <th colSpan="2">登录总次数</th>
                <th colSpan="2">APP登录次数</th>
                <th colSpan="2">PC登录次数</th>
                <th colSpan="2">访问总次数</th>
                <th colSpan="2">PC访问次数</th>
                <th colSpan="2">APP访问次数</th>
              </tr>
              <tr>
                <th>本月</th>
                <th>环比</th>
                <th>本月</th>
                <th>环比</th>
                <th>本月</th>
                <th>环比</th>
                <th>本月</th>
                <th>环比</th>
                <th>本月</th>
                <th>环比</th>
                <th>本月</th>
                <th>环比</th>
              </tr>
              </thead>
              <tbody>
              {departmentData}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}

export default Echarts;
