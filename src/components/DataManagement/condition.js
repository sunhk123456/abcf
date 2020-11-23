/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/7/17
 */

import React from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Button } from 'antd';
import styles from './condition.less';


@connect(
  (
    {dataManagementModels}
  )=>(
    {
      markType:dataManagementModels.markType,
      conditionSearchData:dataManagementModels.conditionSearchData,

    }
  )
)
@Form.create()
class Condition extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  creatFormDom = data => {
    if (Object.keys(data).length === 0) return;
    const { form: { getFieldDecorator } } = this.props;
    const { Option } = Select;
    const layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formDom = [];
    data.forEach(item => {
      if(item.type === 'input') {
        formDom.push(
          <Form.Item label={item.name} key={item.id} {...layout}>
            {getFieldDecorator(`${item.id}`)(<Input />)}
          </Form.Item>
        )
      } else if (item.type === 'select') {
        if(item.children.length !==0) {
          const optionDom = item.children.map(innerItem => (<Option key={innerItem.id} value={innerItem.id}>{innerItem.name}</Option>));
          formDom.push(
            <Form.Item label={item.name} key={item.id} {...layout}>
              {getFieldDecorator(`${item.id}`,{initialValue: item.children[0].id})(
                <Select>{optionDom}</Select>
              )}
            </Form.Item>
          )
        }
      }
    });
    // eslint-disable-next-line consistent-return
    return (
      <Form className={styles.conditionForm}>
        {formDom}
        <Button onClick={this.onSearch} className={styles.btn}>查询</Button>
        <div className={styles.download}>
          <div className={styles.text} onClick={()=>this.download()}>下载全部</div>
        </div>
      </Form>
    );
  };

  //  点击查询按钮
  onSearch  = () => {
    const { form: { validateFields }, dispatch, callbackOnSearch,data} = this.props;
    validateFields((err, fieldsValue)=>{
      const onSearchValue = data.map((itemData)=>{
        let obj = {}
        Object.keys(fieldsValue).forEach((item)=> {
            if(item === itemData.id){
              if(itemData.type === "select"){
                if(fieldsValue[item]){
                  const selectData = itemData.children.filter((itemFilter)=> itemFilter.id === fieldsValue[item])
                  obj = {
                    id: item,
                    selectId:selectData[0].id,
                    selectName:selectData[0].name,
                  }
                }else {
                  obj = {
                    id: item,
                    selectId:itemData.children[0].id,
                    selectName:itemData.children[0].name,
                  }
                }
              }else {
                obj = {
                  id: item,
                  selectId:fieldsValue[item] || "",
                  selectName:"",
                }
              }
            }
        })
        return obj;
      })
      dispatch({
        type:"dataManagementModels/updateSearchState",
        payload: onSearchValue
      });
      callbackOnSearch(onSearchValue);
    })
  };

  download = () =>{
    const { dispatch, markType, conditionSearchData} = this.props;
    const searchData = {};//
    conditionSearchData.forEach((item)=>{
      searchData[`${item.id}`] = item.selectId;
      searchData[`${item.id}_name`] = item.selectName;
    });
    dispatch({
      type: `dataManagementModels/fetchDownloadTable`,
      payload: {
        markType,
        currentPage:"1",
        pageSize:"10",
        condition:searchData,
        sortId:"",
        order:""
      },
      callback:(res)=>{
        if(res.code === "200"){
          window.open(res.data, '_self');
        }
      }
    });
  };

  render() {
    const { data } = this.props;
    return (
      <div className={styles.condition}>
        {this.creatFormDom(data)}
      </div>
    );
  }
}

export default Condition;
