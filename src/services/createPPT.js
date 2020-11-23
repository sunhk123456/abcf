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
 * @author  liutong
 * @date 2019/5/5
 */
import request from '../utils/request';
import Url from '@/services/urls.json';

export  async function queryPPTTable(params) {
  return request(`${Url.urls[31].url}/reportGeneration/reportable`,{
    method: 'POST',
    body: params,
  });
};
