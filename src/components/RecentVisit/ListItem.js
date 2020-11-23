/* eslint-disable import/no-unresolved */
import React,{Component} from 'react';
import report from '../../assets/image/homePage/baogao.png';
import statement from '../../assets/image/homePage/baobiao.png';
import index from '../../assets/image/homePage/zhibiao.png';
import special from '../../assets/image/homePage/zhuanti.png';
import style from './recentVisitListItem.less';

class ListItem extends Component{
  constructor(props){
    super(props);
    this.state={}
  }

  itemClicked=()=>{
   console.log(1);
   // console.log(e.currentTarget.id)
  };

  render(){
    const {recentVisitList}=this.props;
    const listItems = recentVisitList.map(
      (item) =>{
        let image;
        let color;
        if(item.class==="专题"){
          image=special;
          color={color:"rgb(151, 191, 156)"}
        }else if(item.class==="指标"){
          image=index;
          color={color:"rgb(113, 132, 168)"}
        }else if(item.class==="报告"){
          image=report;
          color={color:"rgb(192, 153, 169)"}
        }else if(item.class==="报表"){
          image=statement;
          color={color:"rgb(138, 120, 86)"}
        }
        return(
          <li key={item.detailId} className={style.li}>
            <span className={style.left} style={color}>{item.class}</span>
            <span className={style.right}>
              <img src={image} alt="图片" />
              <div className={style.imageText} onClick={this.itemClicked} id={item.detailUrl}>{item.detailName}</div>
            </span>
          </li>)
      }
    );
    return(
      <ul className={style.ul}>
        {listItems}
      </ul>
    )
  }
}
export default ListItem
