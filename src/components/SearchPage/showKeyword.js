/**
 * @Description: 搜索结果-关键词 组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/17
 */
import React,{PureComponent} from 'react';
import { Tag } from 'antd';

import styles from './showKeyword.less'


class ShowKeyword extends PureComponent{

  componentDidMount() {

  }

  render(){
    const { data } = this.props;
    if(JSON.stringify(data) !== "{}"){
      const { flag, keyString, keyData  } = data[0];
      let showKey = "";
      const tagDom = keyData.data.map((item, index) =>{
        if(keyData.order[index] !== "garbage"){
          // 1=渠道类型；2=产品类型；3=业务类型；4=客户类型；5=合约类型
          const colors = {
            colorprov: "#7B71A8",
            colorcity: "#7B71A8",
            color1: "#D0A164",
            color2: "#BC427E",
            color3: "#C1C57C",
            color4: "#6BB5CD",
            color5: "#999",
          };
          return <Tag key={keyData.order[index]} color={colors[`color${keyData.order[index]}`]}>{item}</Tag>
        }
        return null;
      })
      if(keyString.trim(0).length > 0){
        if(flag === "1"){
          showKey = <span>为您找到“ {keyString} ”相关的内容：</span> ;
        }else if(flag === "0"){
          showKey =
            <div>
              <div className={styles.topText}>很抱歉，没有找到“<span className={styles.nodata}>{keyString}</span>”相关的信息</div>
              <div className={styles.top5}>为您推荐 {tagDom} 相关内容：</div>
            </div>
        }else{
          showKey = <span>为您推荐</span>
        }
      }else {
        showKey = null;
      }

      return (
        <div className={styles.showKeyword}>
          <div className={styles.key}>
            {showKey}
          </div>
        </div>
      )
    }
    return null;
  }
}
export default ShowKeyword;
