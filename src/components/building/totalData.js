import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './totalData.less';
import img0 from '../../assets/image/building/img0.png';
import img1 from '../../assets/image/building/img1.png';
import img2 from '../../assets/image/building/img2.png';
import img3 from '../../assets/image/building/img3.png';

@connect(({ buildingModels }) => ({
  buildingModels
}))
class TotalData extends PureComponent{
  static defaultProps = {
      totalData:[
        {name:"转交楼宇数",value:"-",unit:"栋"},
        {name:"新增楼宇数",value:"-",unit:"栋"},
        {name:"业务规模",value:"-",unit:"户"},
        {name:"业务收入",value:"-",unit:"万元"}
      ],
    };

    constructor(props){
        super(props);
        this.state={
          imgList:[img0,img1,img2,img3],
          data:[
            {name:"转交楼宇数",value:"-",unit:"栋"},
            {name:"新增楼宇数",value:"-",unit:"栋"},
            {name:"业务规模",value:"-",unit:"户"},
            {name:"业务收入",value:"-",unit:"万元"}
          ],
        };
    };

  dataDisplay = (data)=>{
    const { imgList } = this.state;
    return data.map((item, index) => (
      <div className={styles.items} key={item+Math.random()}>
        <img src={imgList[index]} alt="" className={styles.img} style={index===data.length-2?{width:'55px',height:'55px',margin:'unset'}:null} />
        <div className={styles.number}>
          <div className={styles.title}>{item.name}</div>
          <div className={styles.data} style={index===data.length-1?null:{borderRight:' 1px solid #999999'}}>
            <div className={styles.value}>{item.value}</div>
            <div className={styles.unit} style={index===data.length-1?{width:'40px'}:null}>{item.unit}</div>
          </div>
        </div>
      </div>
    ))
  };

  render(){
    const {totalData}=this.props;
    const {data}=this.state;
    let dataDisplay;
    if(totalData.length>0){
      dataDisplay = this.dataDisplay(totalData);
    }else{
      dataDisplay = this.dataDisplay(data);
    }
    return (
      <div className={styles.contain}>{dataDisplay}</div>
    )
  }
}
export default TotalData;
