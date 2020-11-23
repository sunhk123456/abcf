/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 家庭查询专题家庭详细信息</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: liutong
 * @date: 2020/1/1
 */

import React, { PureComponent } from 'react';
import FontSizeEchart from '../ProductView/fontSizeEchart';
import styles from './detailedInfo.less'

class DetailedInfo extends PureComponent {

  static defaultProps = {
    detailData:{
      "title":"家庭基本信息",
      "list":[
        {"name":"家庭ID","value":"1234567"},
        {"name":"联系人姓名","value":"北京市大兴区亦庄经济开发区天宝家园小区"},
        {"name":"联系人电话","value":"文本"},
        {"name":"家庭地址","value":"文本"},
        {"name":"客户类型","value":"文本"},
        {"name":"城镇类型","value":"文本"},
        {"name":"是否IPTV","value":"文本"},
        {"name":"电视","value":"文本"},
        {"name":"宽带速率","value":"文本"},
        {"name":"发展渠道","value":"文本"},
        {"name":"是否趸交","value":"文本"},
        {"name":"趸交费用","value":"文本"},
      ]
    }
  };

  /**
   * 初始化state，声明ref，绑定方法
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {};
    // this.ref = React.createRef(); // 创建ref
    // this.handleClick = this.handleClick.bind(this); 方法绑定
  }

  checkDetail=()=>{
    const {callback} = this.props;
    console.log("我查看了哈")
    callback()
  }


  render() {
    const{titleSize}=FontSizeEchart();
    const {check,detailData} = this.props;
    const detailedList=(detailData.list&&detailData.list.length>0)?
      detailData.list.map((item,index)=>(
        <div className={styles.list} key={`${item.name}_${index+1}`}>
          <div className={styles.name}>{item.name}：</div>
          <div className={styles.value} title={item.value}>{item.value}</div>
        </div>
      ))
      :null;
    const catDiv =
      <div className={styles.list}>
        <div className={styles.name}>家庭成员详情：</div>
        <div className={styles.cat} onClick={this.checkDetail}>查看</div>
      </div>

    return (
      <div className={styles.detailOuter}>
        <div className={styles.title} style={{fontSize:titleSize}}>{detailData.title}</div>
        <div className={styles.listOuter}>
          {detailedList}
          {check==="1"?catDiv:null}
        </div>
      </div>
    );
  }
}

export default DetailedInfo;
