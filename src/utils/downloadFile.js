/**
 * @Description: 文件下载功能
 *
 * @author: liuxiuqian
 *
 * @date: 2019/3/5
 */
import {message} from 'antd';
import html2canvas from 'html2canvas';
import downloadUrl from '@/services/downloadUrl.json';
import { IEexcel } from '@/services/download';

export const Downer = (path)=>{
  // let sUrl=path;
  // const link = document.createElement('a');
  // link.href = sUrl;
  // if (link.download !== undefined) {
  //   // Set HTML5 download attribute. This will prevent file from opening if supported.
  //   const fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
  //   link.download = fileName;
  // }
  // if (document.createEvent) {
  //   const e = document.createEvent('MouseEvents');
  //   e.initEvent('click', true, true);
  //   link.dispatchEvent(e);
  //   return true;
  // }
  // if (sUrl.indexOf('?') === -1) {
  //   sUrl += '?download';
  // }
  // window.open(sUrl, '_self');
  window.open(path, '_self');
  return true;
};

const fetchFun = (paramJson) =>{
  IEexcel(paramJson).then((res)=>{
    if(Object.keys(res).length === 1 && res.path){window.open(res.path,"_self");
      // Downer(`${downloadUrl.urls[3].url}${res.path}`)
      Downer(res.path)
    }else {
      message.error("下载失败！")
    }
  })

};

const jsonData = (json, pic = "") =>{
  const newJson = json;
  newJson.path = downloadUrl.urls[2].url;
  if(pic){
    newJson.pic = {imageBase64: pic}
  }
  return newJson;
};

export default function DownloadFile(json, DomId = ""){
  if(DomId){
    const imgBase64 = html2canvas(document.getElementById(DomId), {
        allowTaint: true,// 允许跨域
        async:false, // 异步
        removeContaine:true, // 是否清理克隆的DOM元素html2canvas暂时创建
      }
    ).then((canvas) => canvas.toDataURL());
    imgBase64.then((res) =>{
      fetchFun(jsonData(json, res));
    })
  }else{
    fetchFun(jsonData(json));
  }
}



