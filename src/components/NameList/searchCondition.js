/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  名单制-筛选条件组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/27
 */

import React from 'react';
import { Button, DatePicker, Form, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './searchCondition.less';

@connect(({nameListModels})=>({ nameListModels }))
@Form.create()
class SearchCondition extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  //  禁选日期
  disabledDate = current => {
    const { maxDate } = this.props;
    return current > moment(maxDate)
  };

  //  点击高级查询按钮
  onSearch  = () => {
    const { onSearch } = this.props;
    const { form } = this.props;
    const values = form.getFieldsValue();
    values.date = values.date.format('YYYY-MM-DD');
    onSearch(values);
  };

  //  业务一onChange事件
  onChange = value => {
    const { data, dispatch, form } = this.props;
    data.forEach(item => {
      if(item.type === 'business') {
        item.selectList.forEach(innerItem => {
          if(innerItem.id === value) {
            data[2] = Object.assign(data[2], innerItem);
          }
        })
      }
    })
    dispatch({
      type: 'nameListModels/updateState',
      payload: {
        conditionData: data,
      },
    });
    form.resetFields(`childBusiness`,[]);
  }

  render() {
    const { data, maxDate, form: { getFieldDecorator } } = this.props;
    const { Option } = Select;
    const layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const dateTriangle = <i className={styles.dateTriangle} />;
    const selectTriangle = <i className={styles.selectTriangle} />;
    const formDom = [
      <Form.Item label='账期' {...layout} key='date'>
        {getFieldDecorator('date', { initialValue: moment(maxDate,'YYYY-MM-DD')})(
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={this.disabledDate}
            suffixIcon={dateTriangle}
            allowClear={false}
          />
        )}
      </Form.Item>
    ];
    if(Object.keys(data).length !== 0) {
      data.forEach(item => {
        const optionDom = item.selectList.map(innerItem => (<Option key={innerItem.id} value={innerItem.id}>{innerItem.name}</Option>))
        formDom.push(
          <Form.Item label={item.name} key={item.type} {...layout}>
            {getFieldDecorator(`${item.type}`,{initialValue: item.selectList[0].id})(
              <Select
                dropdownClassName={styles.select}
                suffixIcon={selectTriangle}
                onChange={item.type === 'business' ? this.onChange : null}
              >
                {optionDom}
              </Select>
            )}
          </Form.Item>
        )
      })
    }
    return (
      <Form className={styles.searchCondition}>
        {formDom}
        <Button onClick={this.onSearch} className={styles.btn}>查询</Button>
      </Form>
    );
  }
}

export default SearchCondition;
