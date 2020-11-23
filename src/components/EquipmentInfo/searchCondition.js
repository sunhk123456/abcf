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
 * @date: 2020/5/13
 */

import React from 'react';
import { Button, DatePicker, Form, InputNumber, Select, message } from 'antd';
import moment from 'moment';
import styles from './searchCondition.less';

@Form.create()
class SearchCondition extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      conditionList: [
        {
          name: '创建时间',
          id: 'LAUNCHDATE',
          type: 'date'
        },
        {
          name: '手机类型',
          id: 'TYPE_ID',
          type: 'select'
        },
        {
          name: '价格区间',
          id: 'date',
          type: 'input'
        },
        {
          name: '品牌',
          id: 'BRAND_ID',
          type: 'select'
        },
        {
          name: '型号',
          id: 'DEVICE_TYPE',
          type: 'select'
        },
        {
          name: '内存',
          id: 'RAM_ROM_ID',
          type: 'select'
        },
        {
          name: '颜色',
          id: 'COLOR_ID',
          type: 'select'
        }
      ],
    };

  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this)
  }

  //  禁选日期
  disabledDate = current => {
    const { maxDate } = this.props;
    return current && current >= moment(maxDate).add(1,'months');
  };

  //  下拉框选项改变时收集一次form的值传出到父组件请求筛选条件
  handleChange = (value,id) => {
    if(id !== 'TYPE_ID') {
      const { getCondition } = this.props;
      const values = this.getFormValue();
      //  将当前下拉框的值修改为选中的值
      values[id] = value;
      getCondition(values,id)
    }
  };

  //  获取Form表单所有值
  getFormValue = () => {
    const { form } = this.props;
    const values = form.getFieldsValue();
    //  最小价格为非负  且 小于最大价格  或    最小价格与最大价格都为null
    if(((( values.minPrice > 0) || (values.minPrice === 0)) && values.minPrice < values.maxPrice) || values.minPrice === null && values.maxPrice === null) {
      //  格式化时期
      values.LAUNCHDATE = values.LAUNCHDATE ? values.LAUNCHDATE.format('YYYY-MM') : '';
      //  价格字段转为字符串
      values.minPrice = values.minPrice ? `${values.minPrice}` : '';
      values.maxPrice = values.maxPrice ? `${values.maxPrice}` : '';
      return values
    }
    message.error('请输入完整的非负价格区间,且最大价格必须大于最小价格！');
    return false
  };

  //  点击高级查询按钮
  onSearch  = () => {
   const { onSearch } = this.props;
    onSearch();
  };

  //  点击日期的回调
  onChange = () => {
    const { dateChange } = this.props;
    dateChange();
  }

  render() {
    const { data, form: { getFieldDecorator } } = this.props;
    const { Option } = Select;
    const { MonthPicker } = DatePicker;
    const { conditionList } = this.state;
    const formDom = [];
    const layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    conditionList.forEach(item => {
      if(item.type === 'date') {
        formDom.push(
          <Form.Item label={item.name} key={item.id} {...layout}>
            {getFieldDecorator('LAUNCHDATE')(
              <MonthPicker
                //
                format="YYYY-MM"
                disabledDate={this.disabledDate}
                onChange={this.onChange}
              />
            )}
          </Form.Item>
        )
      } if (item.type === 'input') {
        formDom.push(
          <Form.Item label={item.name} key={item.id} {...layout}>
            {getFieldDecorator(`minPrice`, {initialValue: null})(
              <InputNumber formatter={value => `${value}`} />
            )}-
            {getFieldDecorator(`maxPrice`, {initialValue: null})(
              <InputNumber formatter={value => `${value}`} />
            )}
          </Form.Item>
        )
      } if (item.type === 'select') {
        if(Object.keys(data[item.id]).length !==0) {
          const optionDom = data[item.id].map(innerItem => (<Option key={innerItem.id} value={innerItem.id}>{innerItem.name}</Option>));
          formDom.push(
            <Form.Item label={item.name} key={item.id} {...layout}>
              {getFieldDecorator(`${item.id}`,{initialValue: data[item.id][0].id})(
                <Select onSelect={value => {this.handleChange(value, item.id)}}>
                  {optionDom}
                </Select>
              )}
            </Form.Item>
          )
        }
      }
    });
    return (
      <Form className={styles.equipmentCondition}>
        {formDom}
        <Button onClick={this.onSearch} className={styles.btn}>高级查询</Button>
      </Form>

    );
  }
}

export default SearchCondition;
