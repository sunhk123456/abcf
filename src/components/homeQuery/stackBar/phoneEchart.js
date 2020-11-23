import React, { PureComponent,Fragment } from 'react';
import FontSizeEchart from '../../ProductView/fontSizeEchart';
import styles from './phoneEchart.less';
import PhoneticFeatureEchart from './phoneticFeatureEchart';



class PhoneEchart extends PureComponent{
  
  static defaultProps={
    'specialName': '家庭视图',
    "color":[
      "#F67373",
      "#91C7AD",
      "#5DB3E0",
      "#F67373",
      "#5DB3E0",
      "#F67373",
      "#91C7AD",
      "#5DB3E0",
      "#F67373",
      "#5DB3E0",
    ],
    "echartId":["firstEchart","secondEchart"],
    'chartData': [
      {
        "title":"语音特征",
        "subtitle":"时长",
        "xName":"",
        "yName":"分钟",
        "chartX":["家庭成员","本网","异网","本地","长途","漫游"],
        "chart":[
          {
            "value":["550","780","650","780","550"],
            "name":"时长",
            "unit":"min",
            "type":"bar"
          }]
      },
      {
        "title":"语音特征",
        "subtitle":"次数",
        "xName":"",
        "yName":"次",
        "chartX":["家庭成员","本网","异网","本地","长途","漫游"],
        "chart":[
          {
            "value":["550","780","650","780","550"],
            "name":"时长",
            "unit":"次",
            "type":"bar"
          }]
      },
    ]
  };
  
  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={};
  };
  
  render() {
    const{titleSize}=FontSizeEchart();
    const {chartData,color,echartId,specialName} = this.props;
    return (
      <div className={styles.page}>
        <div className={styles.title} style={{fontSize:titleSize}}>
          {chartData[0]?chartData[0].title:""}
        </div>
        {chartData[0] && chartData[0].chart && chartData[0].chart[0] && chartData[0].chart[0].value.length!==0 &&
        <Fragment>
          <div className={styles.item}>
            <PhoneticFeatureEchart
              titlePosition="center"
              specialName={specialName}
              color={color}
              echartId={echartId[0]}
              chartData={chartData[0]}
            />
          </div>
          <div className={styles.item}>
            <PhoneticFeatureEchart
              titlePosition="center"
              specialName={specialName}
              color={color}
              echartId={echartId[1]}
              chartData={chartData[1]}
            />
          </div>
        </Fragment>
        }
       
      </div>
    );
  }
}

export default PhoneEchart;
