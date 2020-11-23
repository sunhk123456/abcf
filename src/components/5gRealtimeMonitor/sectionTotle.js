import React,{PureComponent} from 'react';
import { connect } from 'dva';
import Websocket from 'react-websocket';
import isEqual from 'lodash/isEqual';
import RealTimeEchart from './areaBar';
import TransverseBar from './transverseBar';
import NumberBrand from './numberBrand';
import Cookie from '@/utils/cookie';
import {APIURL_REALTIMEMONITOR_DAY} from '@/services/webSocketUrl';
import styles from './section.less';



@connect(
  ({
     RealtimeModel,
   }) => ({
    RealtimeModel,
  })
)
class SectionTotle extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      peopleData:{
        name: '5G全国受理用户',
        value: '000000000',
        unit:'户',
      },
      areaData: {
        'title': '地域分布',
        'chartX': ['北京', '天津', '内蒙古', '吉林', '河北'],
        'chart': ['-', '-', '-', '-', '-'],
        'unit': '万元',
        'xName': '',
        'yName': '',
        'download': {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
            ['-','-','-'],
            ['-','-','-'],
          ],
        },
      },
      productData: {
        'title': '产品分布',
        'chartX': ['5G套餐129元', '5G套餐159元', '5G套餐199元', '5G套餐239元', '5G套餐299元'],
        'chart': ['-', '-', '-', '-', '-'],
        'unit': '万元',
        'xName': '账期',
        'yName': '出账用户数',
        'download': {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
            ['-', '-', '-'],
            ['-', '-', '-'],
          ],
        },
      }
    };
  }

  componentDidMount(){

  }


  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const {tabId} = this.props;
    const parames = {
      token,
      userId,
      markType:"5G_REALTIME_D",
      selectId:tabId
    }
    this.sendMessage(JSON.stringify(parames))
  }

  handleClose = () =>{
    console.log("websocket close");
  }

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 发送消息
   * @method sendMessage
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  sendMessage = message => {
    this.refWebSocket.sendMessage(message);
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
  */
  // eslint-disable-next-line
  handleData(data) {
    const {peopleData, areaData, productData} = this.state;
    const result = JSON.parse(data);
    if(!isEqual(data.peopleData,peopleData) || !isEqual(data.areaData,areaData) || !isEqual(data.productData,productData)){
      this.setState({...result})
    }
  }

  render() {

    const {peopleData,areaData,productData}=this.state;
    const {titleName}=this.props;
    const downloadData={specialName:titleName};
    return (
      <div className={styles.page}>
        <div className={styles.number}>
          <NumberBrand peopleData={peopleData} />
        </div>
        <div className={styles.areaChart}>
          <RealTimeEchart chartData={areaData} downloadData={downloadData} />
        </div>
        <div>
          <TransverseBar data={productData} downloadData={downloadData} />
        </div>
        <Websocket
          url={APIURL_REALTIMEMONITOR_DAY}
          onMessage={(data)=>this.handleData(data)}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          ref={socket => {
            this.refWebSocket = socket;
          }}
        />
      </div>
    )
  }
}
export default SectionTotle
