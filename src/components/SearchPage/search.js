/**
 * @Description: 搜索框组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/18
 */
import React,{PureComponent} from 'react';
import { Input, Select  } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import router from 'umi/router';
import styles from './search.less'

const {Search, Group } = Input;
const InputGroup = Group;
const {Option} = Select;

@connect(({ searchModels, loading }) => ({
  searchModels,
  loading: loading.models.searchModels,
}))
@connect(({ searchPageModels, loading }) => ({
  searchPageModels,
  loading: loading.models.searchPageModels,
}))

@withRouter
class SearchInput extends PureComponent{

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'searchModels/getTypeData',
    });
    dispatch({
      type: 'searchModels/getMaxDate',
      payload:{dateType: "1"}
    });
  }

  /**
   * @date: 2019/1/19
   * @author liuxiuqian
   * @Description: 处理搜索结果
   * @method onSearchHandle
   * @param {string} value 输入的值
   */
  onSearchHandle = (value) => {
    const { dispatch, searchModels, history } = this.props;
    const {  selectType, maxDate } = searchModels;
    const pathUrl = history.location.pathname;
    // 当点击搜索后  搜素路径不在/search  跳转到/search
    if(pathUrl !== "/search"){
      // history.push("/search");
      router.push({
        pathname: '/search',
        state: {
          value
        }
      })
      return false;
    }
    // 清理数据
    dispatch({
      type: 'searchPageModels/getCleanData',
    });
    window.scrollTo(0,0);
    dispatch({
      type: 'searchPageModels/setSearchPage',
      payload: {page:1},
    });
    // 更新搜索内容
    dispatch({
      type: 'searchModels/upDataSelectName',
      payload: {
        selectName: value,
        searchType: 0
      }
    });
    // 请求搜索内容
    let params = {}
    if(selectType.id !== "1"){
      params = {
        searchType: selectType.id,
        search: value,
        tabId:"-1",
        numStart:1,
        num:"10",
      }
    }else {
      params = {
        area: "",
        date: maxDate,
        dayOrmonth: "-1",
        num: "10",
        numStart: 1,
        search: value,
        searchType: selectType.id,
      }
    }
    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
      sign: true, // 是否为点击查询
    });
  }

  /**
   * @date: 2019/1/19
   * @author liuxiuqian
   * @Description: 输入时触发搜索提醒功能
   * @method onChangeHandle
   * @param e 触发的e 对象
   */
  onChangeHandle = (e) =>{
    const { dispatch, searchModels } = this.props;
    const { selectType } = searchModels;
    const name = e.target.value
    dispatch({
      type: 'searchModels/getRecommendList',
      payload: {searchValue: name, selectedId: selectType.id}
    });
    dispatch({
      type: 'searchModels/upDataSelectName',
      payload: {
        selectName: name,
        searchType: 0
      }
    });
  }

  /**
   * @date: 2019/1/19
   * @author liuxiuqian
   * @Description: 选中类型保存数据
   * @method onChangeSelectHandle
   * @param  value 选中的id
   * @param  option 包含选中的name
   *
   */
  onChangeSelectHandle =(value, option) =>{
    const { dispatch } = this.props;
    // const { selectName, maxDate } = searchModels;
    // // 清理数据
    // dispatch({
    //   type: 'searchPageModels/getCleanData',
    // });
    dispatch({
      type: 'searchModels/updataSelectType',
      payload: {id: value, name: option.props.children},
    });
    // // 请求搜索内容
    // let params = {}
    // if(value !== "1"){
    //   params = {
    //     searchType: value,
    //     search: selectName,
    //     tabId:"-1",
    //     numStart:1,
    //     num:"10"
    //   }
    // }else {
    //   params = {
    //     area: "",
    //     date: maxDate,
    //     dayOrmonth: "-1",
    //     num: "10",
    //     numStart: 1,
    //     search: selectName,
    //     searchType: value,
    //   }
    // }
    // dispatch({
    //   type: 'searchPageModels/getSearchData',
    //   payload: params,
    //   sign: true, // 是否为点击查询
    // });
  }

  /**
   * @date: 2019/1/19
   * @author liuxiuqian
   * @Description: 鼠标离开时关闭提醒框
   * @method onMouseOutEven
   */
  onMouseOutEven(){
    const { dispatch } = this.props;
    dispatch({
      type: 'searchModels/updataDownUp',
      payload: false
    });
  }

  /**
   * @date: 2019/1/19
   * @author liuxiuqian
   * @Description: 选中搜索提醒数据
   * @method selectTipHandle
   * @param  item 选中的名字和id
   */
  selectTipHandle(item){
    const { dispatch } = this.props;
    dispatch({
      type: 'searchModels/upDataSelectName',
      payload: {
        selectName: item.name,
        searchType: 0
      }
    });
    dispatch({
      type: 'searchModels/updataDownUp',
      payload: false
    });
  }

  render(){
    const { searchModels } = this.props;
    const {downUp, downUpData ,searchContent, selectName, searchType, selectType, typeData } = searchModels;
    const typeDataDom = typeData.map((item) => <Option className={styles.dropdownMenuItem} key={`option+${item.id}`} value={item.id}>{item.name}</Option>);
    const downUpDataDom = downUpData.map((item) => <li key={`li+${item.id}`} onClick={()=>this.selectTipHandle(item)}>{item.name}</li>);
    return (
      <div className={styles.search}>
        <InputGroup compact>
          <Select
            className={styles.select}
            value={selectType.name}
            onChange={this.onChangeSelectHandle}
          >
            {typeDataDom}
          </Select>
          <Search
            placeholder="请输入搜索内容"
            value={searchType === 0 ? selectName : searchContent}
            onSearch={value => this.onSearchHandle(value)}
            onChange={this.onChangeHandle}
            className={styles.searchInput}
          />
        </InputGroup>
        { downUp ?
          (
            <div className={styles.downUp}>
              <ul className={styles.downUpUl} onMouseLeave={()=> this.onMouseOutEven()}>
                {downUpDataDom}
              </ul>
            </div>
          )
          :
          null
        }

      </div>
    )
  }
}
export default SearchInput;
