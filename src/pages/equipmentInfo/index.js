/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  终端产品信息查询专题页面</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/13
 */

import React from 'react';
import { Icon, Input } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import SearchCondition from '../../components/EquipmentInfo/searchCondition';
import ProductList from '../../components/EquipmentInfo/productList'
import DetailsList from '../../components/EquipmentInfo/detailsList'
import styles from './index.less';
import img from "../../assets/image/equipmentInfo/zwsj2.png"

import iconFont from "../../icon/Icons/iconfont";


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(
  (
    {equipmentInfoModels, loading}
  )=>(
    {
      loading:loading.models.equipmentInfoModels,
      condition:equipmentInfoModels.condition,
      listContent:equipmentInfoModels.listContent,
      maxDate:equipmentInfoModels.maxDate
    }
  )
)
class EquipmentInfo extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      specialName: '终端产品信息查询',  //  专题名称
      searchValue: '',  //  搜索框的值
      upSelectType: {
        TYPE_ID: "",      //  手机类型
        BRAND_ID: "",     //  品牌
        DEVICE_TYPE: "",  //  型号
        RAM_ROM_ID: "",   //  内存
        COLOR_ID: "",     //  颜色
        minPrice: "",   //  最小价格
        maxPrice: "",   //  最大价格
        LAUNCHDATE: "",   //  发布时间
        PRODUCT_NAME: "", //  产品名称
      },
      productListShow: false, //  产品信息组件
      detailsListShow: false, //  详细信息组件
      detailsList: {}, //  详细信息组件数据
      productListDom: [],  //  产品列表dom数据
    };

  }


  componentDidMount() {
    this.initCondition()
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `equipmentInfoModels/updateCondition`,
      payload: {
        DEVICE_TYPE: [],  //  型号
        RAM_ROM_ID: [],   //  内存
        COLOR_ID: []      //  颜色
      }
    });
  }

  //  初始化请求筛选条件与产品列表数据
  initCondition = () => {
    const { dispatch } = this.props;
    const { upSelectType } = this.state;
    const params = {
      markType: 'TERMINAL_M',
      dateType: '2',
      LAUNCHDATE: '',
      BRAND_ID: '-1',
      TYPE_ID: '-1',
      minPrice: '',
      maxPrice: '',
      DEVICE_TYPE: '-1',
      RAM_ROM_ID: '-1',
      COLOR_ID: '-1',
      searchName: '',
      pageNum: '5',
      currentPage: '1',
    };
    //  请求手机类型与品牌筛选条件
    dispatch({
      type: `equipmentInfoModels/fetchCondition`,
      payload: {
        markType: 'TERMINAL_M',
        dateType: '2',
        selectType: 'TYPE_ID',
        upSelectType
      },
    });
    dispatch({
      type: `equipmentInfoModels/fetchCondition`,
      payload: {
        markType: 'TERMINAL_M',
        dateType: '2',
        selectType: 'BRAND_ID',
        upSelectType
      },
    });
    dispatch({
      type: `equipmentInfoModels/fetchListContent`,
      payload: params,
      callback: res => {
        const dataDom = res.list;
        this.setState({
          productListShow: true,
          productListDom: dataDom
        })
      }
    });
    //  请求最大账期数据
    dispatch({
      type: `equipmentInfoModels/fetchMaxDate`,
      payload: {
        markType: 'TERMINAL_M',
        dateType: '2',
      },
    });
  };

  //  搜索框searchValue改变
  onChange = e => {
    const { upSelectType } = this.state;
    const newUpSelectType = {...upSelectType}
    newUpSelectType.PRODUCT_NAME = e.target.value;
    this.setState({
      searchValue: e.target.value,
      upSelectType: newUpSelectType
    })
  }

  /** 点击搜索框的搜索图标,或点击查询按钮，或下拉刷新数据时触发
   *  type = 0 默认为点击查询时触发，productListDom中的数据替换为首次请求的五条
   *  type = 1为下拉刷新时触发，productListDom中的数据push请求回来的5条
   */
  handleSearch = (page, type = 0) => {
    const { searchValue } =this.state;
    const { dispatch } = this.props;
    const formValue = this.searchConditionRef.getFormValue()
    if(formValue && Object.keys(formValue).length !== 0) {
      const params = {
        markType: 'TERMINAL_M',
        dateType: '2',
        LAUNCHDATE: '',
        BRAND_ID: '-1',
        TYPE_ID: '-1',
        minPrice: '',
        maxPrice: '',
        DEVICE_TYPE: '-1',
        RAM_ROM_ID: '-1',
        COLOR_ID: '-1',
        searchName: searchValue,
        pageNum: '5',
        currentPage: page
      };
      dispatch({
        type: `equipmentInfoModels/fetchListContent`,
        payload: {
          ...params,
          ...formValue,
        },
        callback: res => {
          const { productListDom } = this.state;
          const dataDom = res.list;
          const dataListDom = productListDom;
          dataListDom.push(...dataDom)
          this.setState({
            productListShow: true,
            detailsListShow: false,
            productListDom: type ? dataListDom : dataDom
          })
        }
      });
    }
  }


  //  请求联动下拉框的数据
  getCondition = (values, id) => {
    const { dispatch } = this.props;
    const { upSelectType } = this.state;
    const formValues = {...values};
    let queryId
    switch(id) {
      case 'BRAND_ID' :
        queryId = 'DEVICE_TYPE';
        //  清除下级联动选中数据
        formValues.DEVICE_TYPE = '';
        formValues.RAM_ROM_ID = '';
        formValues.COLOR_ID = '';

        //  清除下级联动选择框数据
        dispatch({
          type: `equipmentInfoModels/updateCondition`,
          payload: {
            DEVICE_TYPE: [],  //  型号
            RAM_ROM_ID: [],   //  内存
            COLOR_ID: []      //  颜色
          }
        });
        break
      case 'DEVICE_TYPE' :
        queryId = 'RAM_ROM_ID';
        //  清除下级联动选中数据
        formValues.RAM_ROM_ID = '';
        formValues.COLOR_ID = '';
        //  清除下级联动选择框数据
        dispatch({
          type: `equipmentInfoModels/updateCondition`,
          payload: {
            RAM_ROM_ID: [],   //  内存
            COLOR_ID: []      //  颜色
          }
        });
        break
      case 'RAM_ROM_ID' :
        queryId = 'COLOR_ID';
        //  清除下级联动选中数据
        formValues.COLOR_ID = '';
        //  清除下级联动选择框数据
        dispatch({
          type: `equipmentInfoModels/updateCondition`,
          payload: {
            COLOR_ID: []      //  颜色
          }
        });
        break
      default :
        break
    }
    if(id !== 'COLOR_ID') {
      //  请求手机类型与品牌筛选条件
      dispatch({
        type: `equipmentInfoModels/fetchCondition`,
        payload: {
          selectType: queryId,
          markType: 'TERMINAL_M',
          dateType: '2',
          upSelectType : {
            ...upSelectType,
            ...formValues,
          }
        }
      });
    }
  }

  //  获取筛选条件组件this
  onRef = ref => {
    this.searchConditionRef = ref;
  }

  //  点击查看详情切换详细信息组件
  clickDetails = index => {
    const { productListDom } = this.state;
    this.setState({
      detailsList: productListDom[index],
      productListShow: false,
      detailsListShow: true,
    })
  }

  //  点击返回
  clickBack = () => {
    this.setState({
      productListShow: true,
      detailsListShow: false,
    })
  }

  //  改变日期回调
  dateChange = () => {
    const { dispatch } = this.props;
    //  清除下级联动选择框数据
    dispatch({
      type: `equipmentInfoModels/updateCondition`,
      payload: {
        DEVICE_TYPE: [],  //  型号
        RAM_ROM_ID: [],   //  内存
        COLOR_ID: []      //  颜色
      }
    });
  }

  render() {
    const { specialName, productListShow, detailsListShow, detailsList, productListDom } = this.state;
    const { condition, maxDate, listContent: { nextFlag }, loading } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.equipmentInfo}>
          {detailsListShow &&  <IconFont onClick={this.clickBack} className={styles.backBtn} type="icon-fanhuianniu" />}
          {productListShow &&
          <div className={styles.head}>
            {specialName}
            <Input
              className={styles.headSearch}
              placeholder="请输入产品名称"
              onChange={this.onChange}
              suffix={<Icon type="search" style={{ fontSize: 24 }} onClick={() => this.handleSearch('1')} />}
            />
          </div>}
          <div className={`${styles.conditionList} ${productListShow ? null : styles.conditionHidden} `}>
            <SearchCondition
              data={condition}
              maxDate={maxDate}
              getCondition={(values, id) => this.getCondition(values, id)}
              onSearch={() => this.handleSearch('1')}
              dateChange={this.dateChange}
              onRef={this.onRef}
            />
          </div>
          <div className={styles.listContent}>
            {productListShow && productListDom.length !==0 &&
              <InfiniteScroll
                className={styles.productScroll}
                initialLoad={false}
                pageStart={1}
                threshold={50}
                loadMore={page => {this.handleSearch(page, 1)}}
                hasMore={!loading && JSON.parse(nextFlag)}
              >
                <ProductList data={productListDom} clickDetails={index => {this.clickDetails(index)}} />
                <div className={styles.wholeTip}>{JSON.parse(nextFlag) ? "加载更多" : "已加载全部"}</div>
              </InfiniteScroll>
            }
            {detailsListShow && <DetailsList data={detailsList} />}
            { !productListDom.length && <img src={img} alt="" className={styles.imgNothing} />}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default EquipmentInfo;
