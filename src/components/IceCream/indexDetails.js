/**
 *指标解释组件
 * by:CaoRuining
 */

import React, { PureComponent } from 'react';
import {connect} from 'dva'
import classnames from 'classnames'
import yangshi from './indexDetails.less';


@connect(
  ({developingUserCom}) => ({
    indexDetailsData:developingUserCom.indexDetailsData,
  })
)

class IndexDetails extends PureComponent{
  constructor(props){
    super(props);
    this.state={
    }
  }


  closeDetails = ()=>{
    const {dispatch} = this.props;

    dispatch({
      type:'developingUserCom/fetchIndexDetailsStatus',
      payload:{
        indexDetailsShow:'none'
      }
    })
  };



  render(){
    const {indexDetailsData} = this.props;
    let noticeList;
    if(indexDetailsData!==undefined){
      if(indexDetailsData.length !== 0 && indexDetailsData.length !== undefined){
        noticeList=indexDetailsData.map((data,index)=>{
          const res = (
            <tr id={`tr${index}`} className={index%2 === 0?yangshi.details_buletr:yangshi.details_writetr} key={`tr${data}`}>
              <td id={`noteId${index}`} className={yangshi.details_one}><div className={classnames(yangshi.table_v,yangshi.details_noteId)}>{data[0]}</div></td>
              <td id={`title${index}`} className={yangshi.details_two}><div className={classnames(yangshi.table_v,yangshi.details_title)}>{data[1]}</div></td>
              <td id={`name${index}`} className={yangshi.details_three}><div className={classnames(yangshi.table_v,yangshi.details_name)}>{data[2]}</div></td>
              <td id={`data${index}`} className={yangshi.details_four}><div className={classnames(yangshi.table_v,yangshi.details_date)}>{data[3]}</div></td>
            </tr>
          );
          return res
        });
      }
    }
    return(
      <div className={yangshi.details_content}>
        <div className={yangshi.np_details_content}>
          <div className={yangshi.np_detailsTitle}>指标解释</div>
          <div className={yangshi.np_Content}>
            <div className={yangshi.notice_details_list}>
              <table className={yangshi.details_table}>
                <thead>
                  <tr className={yangshi.details_writetr}>
                    <td className={yangshi.details_one}><div className={classnames(yangshi.table_v,yangshi.details_number)}>序号</div></td>
                    <td className={yangshi.details_two}><div className={classnames(yangshi.table_v,yangshi.details_title)}>指标名称</div></td>
                    <td className={yangshi.details_three}><div className={classnames(yangshi.table_v,yangshi.details_name)}>标准名称</div></td>
                    <td className={yangshi.details_fours}><div className={classnames(yangshi.table_v,yangshi.details_date)}>说明</div></td>
                  </tr>
                </thead>
                <tbody>
                  {noticeList}
                </tbody>
              </table>
            </div>
          </div>
          <div className={yangshi.np_btns}>
            <div className={yangshi.details_close} onClick={()=>this.closeDetails()}>关闭</div>
          </div>
        </div>
      </div>
    )
  }

}


export default IndexDetails;
