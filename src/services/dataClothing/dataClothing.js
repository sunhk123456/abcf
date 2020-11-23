/**
 * @Description: 数据管理
 *
 * @author: yuzihao
 *
 * @date: 2020/7/17
 */
import request from '../../utils/request';
import Url from '@/services/urls.json';

// 筛选条件接口
export async function queryClothing(params) {
  // return request(`${Url.urls[53].url}/condition`, {
  //   method: 'POST',
  //   body: params,
  // });
  // console.log(params);
  return new Promise((resolve)=>{
    const resData = {
      data: [
        {
          "name": "ad毛衣",
          "num": 45,
        },
        {
          "name": "ad毛裤",
          "num": 55,

        },
        {
          "name": "ad外套",
          "num": 35,


        },
        {
          "name": "ad棉袄",
          "num": 25,


        },
        {
          "name": "ad卫衣",
          "num": 28,


        },
      ]
    };
    resolve(resData)
  })

}
