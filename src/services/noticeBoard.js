/* eslint-disable prefer-template */
import request from '../utils/request';
import Url from '@/services/urls.json';


export async function queryNoteData(params) {
  return request(Url.urls[11].url+"/notesList",{
    method: 'POST',
    body: params,
  });
};

export async function queryAnomalyIndex(params) {
  return request(Url.urls[22].url + "/promptList",{
    method:'POST',
    body:params,
  })
};

export async function queryIndexList(params) {
  return request(Url.urls[22].url + "/indexList",{
    method:'POST',
    body:params,
  })
}

export async function queryNotesChange(params) {
  return request(Url.urls[11].url + "/notesChange",{
    method:'POST',
    body:params,
  })
};

export async function queryIndexChange(params) {
  return request(Url.urls[22].url + "/promptChange",{
    method:'POST',
    body:params,
  })
};

export async function queryDelNotes(params) {
  return request(Url.urls[11].url + "/notesDel",{
    method:'POST',
    body:params,
  })
};

export async function queryDelIndex(params) {
  return request(Url.urls[22].url + "/promptDel",{
    method:'POST',
    body:params,
  })
};

export async function queryAddNotes(params) {
  return request(Url.urls[11].url + "/notesAdd",{
    method:'POST',
    body:params,
  })
};

export async function queryAddIndex(params) {
  return request(Url.urls[22].url + "/promptAdd",{
    method:'POST',
    body:params,
  })
}


// return(
//   [{"date":"20190116","indexName":"2I2C产品网上用户","name":"预发布1","indexId":"CKP_22893","content":"123"}]
// )



// return({
//     "showFlag":"0",
//     "noteList":
//       [
//         {
//           "name":"管理员",
//           "datetime":"2019-01-18",
//           "noteId":"22baad7276a74652a392b5678dd94f9e",
//           "title":"MjAxOTAxMTfotKbmnJ/mlbDmja7ms6Lliqjor7TmmI4=",
//           "content":"Me+8ieOAkOenu+WKqOS4muWKoeiuoei0ueaUtuWFpeOAkea5luWNl+W9k+aXpeWAvDEsMDcxLjE25LiH5YWD77yM5pio5pel5YC8ODc2Ljgx5LiH5YWD77yM546v5q+U5LiK5Y2HMjIuMTYlIO+8jOe7j+aguOafpeS4u+imgeaYr0NCU1PkuJrliqHorqHotLnmlLblhaXlop7lpJrlr7zoh7TvvIzkuI7mlbDmja7mupDkuIDoh7TjgIIKMu+8ieOAkOenu+WKqOS4muWKoeiuoei0ueaUtuWFpeOAkeS4iua1t+W9k+aXpeWAvDY1Ni40NeS4h+WFg++8jOaYqOaXpeWAvDUyNy4zNuS4h+WFg++8jOeOr+avlOS4iuWNhzI0LjQ4JSDvvIznu4/moLjmn6XkuLvopoHnlLFDQlNT5Lia5Yqh6K6h6LS55pS25YWl5aKe5aSa57qmNzfkuIflhYPlkoxCU1PkvqcyR+Wll+mkkOiuoei0ueaUtuWFpeWinuWkmue6pjQ35LiH5YWD77yINUflm73lhoXmtYHph4/mnIjljIXvvInlr7zoh7TvvIzkuI7mlbDmja7mupDkuIDoh7TjgIIKM++8ieOAkOenu+WKqOS4muWKoeemu+e9keeUqOaIt+OAkeaxn+iLj+W9k+aXpeWAvDIuODLkuIfmiLfvvIzmmKjml6XlgLwwLjA35LiH5oi377yM546v5q+U5LiK5Y2HMzc5OS4wMyXvvIznu4/moLjmn6XkuLvopoHmmK9CU1PkvqcyR+emu+e9kee6pjIuNuS4h+aIt++8jOecgeS7veehruiupOaVsOaNruato+ehruOAgg=="
//         },
//         {
//           "name":"刘家坤",
//           "datetime":"2019-01-17",
//           "noteId":"7f04b14188db473abdac2b9360a13c72",
//           "title":"MjAxOTAxMTbotKbmnJ/mlbDmja7lj5HluIPor7TmmI4=",
//           "content":"5Zug5rmW5Y2X77yM5bGx6KW/5o6l5Y+j6L+f5Lyg77yMMjAxOTAxMTbotKbmnJ/muZbljZfvvIzlsbHopb/lkK/nlKjlupTmgKXmm7/mjaLmlbDmja7jgII="
//         },
//         {
//           "name":"预发布1",
//           "datetime":"2019-01-17",
//           "noteId":"918de6a578c34520a670cf997daae02a",
//           "title":"MjAxOTAxMTXotKbmnJ/mlbDmja7ms6Lliqjor7TmmI4=",
//           "content":"MjAxOTAxMTXotKbmnJ/nlLHkuo7lm6BPRFPkvqdEMDYwMDEo5piO57uG6LSm5Y2V6KGoKeaVsOaNruaPkOS+m+acieivr++8jOaVsOaNrumHjeWIt+S4jeWFqO+8jDE25Y+35pma6YeN5Yi35a6B5aSP5pS25YWl5pWw5o2u77yM5b2x5ZON56e75Yqo5Lia5Yqh6K6h6LS55pS25YWl44CBQ0JTU+aJi+acuuiuoei0ueaUtuWFpeetieebuOWFs+aMh+agh+OAgg=="
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-15",
//           "noteId":"6d81dd23dd17497c8379c33631c98ef7",
//           "title":"MjAxOTAxMTTotKbmnJ/mlbDmja7ms6Lliqjor7TmmI4=",
//           "content":"MjAxOTAxMTTotKbmnJ/nlJjogoPlm7ror53nlKjmiLfotYTmlpnkuIrkvKDmnInor6/vvIzlr7zoh7Tlhajlm73lkoznlJjogoPlm7ror53nvZHkuIrnlKjmiLflh4/lsJEyLjbkuIfmiLfvvIzlm7ror53nlKjmiLfnsbvnm7jlhbPmjIfmoIfmmoLkuI3lj6/nlKjjgII="
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-11",
//           "noteId":"6ddccbf93d8545eda9221d8fcae65d90",
//           "title":"MjAxOTAxMTDotKbmnJ/mlbDmja7ms6Lliqjor7TmmI4=",
//           "content":"MSnjgJDnp7vliqjkuJrliqHorqHotLnmlLblhaXjgJHlhajlm73lvZPml6XlgLwxMCwxNTAuNjXkuIflhYPvvIzmmKjml6XlgLwxNiw5MTUuMjHkuIflhYPvvIznjq/mr5TkuIvpmY0zOS45OSXvvIznu4/moLjmn6XmmK/nlLHkuo5DQlNT5L6nMDExMOi0puacn+eJiOacrOWBnOaJueS7t+WvvOiHtOiuoei0ueaUtuWFpeWHj+WwkeOAggoyKeOAkOenu+WKqOS4muWKoeiuoei0ueaUtuWFpeOAkemHjeW6huW9k+aXpeWAvDU0Mi44MeS4h+WFg++8jOaYqOaXpeWAvDI5NS44NOS4h+WFg++8jOeOr+avlOS4iuWNhzgzLjQ4Je+8jOe7j+aguOafpeS4u+imgeeUseS6jkJTU+S+pzNH5omL5py66ZuG5Zui55+t5L+h6LS55aKe5Yqg5a+86Ie077yM55yB5Lu956Gu6K6k5pWw5o2u5q2j5bi444CCCjMp44CQ56e75Yqo5Lia5Yqh56a7572R55So5oi344CR5rmW5YyX5b2T5pel5YC8Ni4xNeS4h+WFg++8jOaYqOaXpeWAvDAuOTLkuIflhYPvvIznjq/mr5TkuIrljYc1NjguNzQl77yM57uP5qC45p+l5Li76KaB5piv55Sx5LqOQlNT5L6n5YWo55yB5om55ouG5a+86Ie077yM55yB5Lu956Gu6K6k5pWw5o2u5q2j5bi444CCCjQp44CQ5a695bim5o6l5YWl572R5LiK55So5oi344CR5bm/6KW/5b2T5pel5YC8MTA4Ljc35LiH5oi377yM5pio5pel5YC8MTEyLjU15LiH5oi377yM546v5q+U5LiL6ZmNMy4zNiXvvIznu4/moLjmn6XkuLvopoHmmK/nlLHkuo5CU1Pkvqflr7nmrKDotLnlgZzmnLrotoUz5Liq5pyI5Lul5LiK55qE55So5oi35YGa5ZCO5Y+w57O757uf5ouG5py677yM55yB5Lu956Gu6K6k5pWw5o2u5q2j5bi444CC"
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-09",
//           "noteId":"ff6ee3a080194701a85374e444b4ca46",
//           "title":"5a695bim5YiG6YCf546H5pWw5o2u5YeG56Gu5oCn6K+05piO",
//           "content":"55Sx5LqO5a695bim5Zyo572R55So5oi35o6l5YWl6YCf546H5pW05pS577yM5aSp5rSl5bCG5a6e6ZmF6YCf546H5Li6NTBN55So5oi35omT5oiQNUfvvIzlvbHlk40yMDE5MDEwMS0yMDE5MDEwOOi0puacnzM1OTPkuKrluKblrr3nlKjmiLfpgJ/njofkuI3lh4bjgII="
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-06",
//           "noteId":"77e935608ab944e889230057c3ffc9be",
//           "title":"MjAxOTAxMDXotKbmnJ/ml6XmlbDmja7lupTmgKXmm7/mjaLor7TmmI4=",
//           "content":"5ZugMzPlupPmlYXpmpzvvIwyMDE5MDEwNOi0puacn+ays+WMl+OAgei0teW3nuaVsOaNruWwmuacquWIt+aWsOWujOaIkO+8jOS4uuS/nemanOS7iuaXpeaVsOaNruato+W4uOWPkeW4g++8jDIwMTkwMTA16LSm5pyf5rKz5YyX44CB6LS15bee5Lik55yB57un57ut5ZCv55So5bqU5oCl5pu/5o2i"
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-05",
//           "noteId":"b6d952d11d99479e8b8dd2320822671c",
//           "title":"MjAxOTAxMDTotKbmnJ/ml6XmlbDmja7lupTmgKXmm7/mjaLor7TmmI4=",
//           "content":"5ZugMzPlupPmiqVPUkEtMDAzNzY6IGZpbGUgNTcwN+mUmeivr++8jOWvvOiHtDIwMTkwMTAz6LSm5pyf5pWw5o2u5pyq5Yi35paw77yM5Li65L+d6Zqc5LuK5pel5pel5oql5pWw5o2u5q2j5bi45Y+R5biD77yMMjAxOTAxMDTotKbmnJ/msrPljJfvvIzotLXlt57nu6fnu63lkK/nlKjlupTmgKXmm7/mjaLmlbDmja7jgII="
//         },
//         {
//           "name":"预发布1",
//           "datetime":"2019-01-04",
//           "noteId":"c8459d0bb0cb4006837a550234b09f90",
//           "title":"MjAxOTAxMDPotKbmnJ/ml6XmlbDmja7lupTmgKXmm7/mjaLor7TmmI4=",
//           "content":"5LuK5aSp5rKz5YyX5pWw5o2u5LiK5Lyg5bu26L+f77yM6LS15bee5pWw5o2u5LiK5Lyg5pyJ6K+v77yM5Li65L+d6Zqc5pWw5o2u5q2j5bi45Y+R5biD77yMMjAxOTAxMDPotKbmnJ/msrPljJfvvIzotLXlt57lkK/nlKjlupTmgKXmm7/mjaLmlbDmja7vvIzor7fnn6XmgonvvIE="
//         },
//         {
//           "name":"管理员",
//           "datetime":"2019-01-03",
//           "noteId":"c3bb8abe69a848f0a61dfe3ca8134be8",
//           "title":"6Ieq5Yqp5YiG5p6Q5qih5Z6L5LiK5paw6YCa55+l",
//           "content":"MjAxOOW5tDEy5pyIMjjml6XvvIzkuIrnur/np7vliqjkuJrliqHnmoTln7rnoYDkv6Hmga/jgIHlrZjph4/nlKjmiLfmi43nhafkv53mnInjgIHmlrDlop7nlKjmiLfmi43nhafkv53mnInjgIHov4Hovazmi43nhafkv53mnInmqKHlnovlj4rlrr3luKbkuJrliqHnmoTln7rnoYDkv6Hmga/jgIHlrZjph4/kv53mnInjgIHmlrDlj5HlsZXkv53mnInlhbE35Liq5qih5Z6L77yM5aKe5Yqg5LqG6J6N5ZCI57G75Z6L44CB5Li75Ymv5Y2h5qCH6K+G44CB5piv5ZCm5YWo5Zu9NEflpZfppJDjgIHlgZzmnLrnsbvlnovnrYnlhbPplK7nu7TluqbvvIzlubbnu4bljJbkuobliIbmoaPnsbvnu7TluqbjgILljp/lkIznsbvmqKHlnovlkI3np7DosIPmlbTkuLrigJ3ogIHmqKHlnovigJzjgII="
//         },
//         {
//           "name":"-",
//           "datetime":"2018-12-28",
//           "noteId":"504bd8bceb0849bb9696674965dc9c3d",
//           "title":"MjAxODEyMjfotKbmnJ/mlbDmja7ms6Lliqjor7TmmI4=",
//           "content":"MSnjgJDnp7vliqjkuJrliqHorqHotLnmlLblhaXjgJHlhajlm73lvZPml6XlgLwyMSwwOTQuNjcg5LiH5YWD77yM5pio5pel5YC8MjcsMTMwLjg25LiH5YWD77yM546v5q+U5LiL6ZmNMjIuMjUlIO+8jOe7j+aguOafpeS4u+imgeaYr+eUseS6jkNCU1PkvqcxMjI16LSm5pyf54mI5pys5Y+R5biD77yM5a+86Ie0MTIyNei0puacn+mDqOWIhuaUtuWFpeiuoeWFpTEyMjbotKbmnJ/vvIwxMjI36LSm5pyf5oGi5aSN5q2j5bi45a+86Ie0MTIyN+i0puacn+aUtuWFpeeOr+avlOS4i+mZjeOAggoyKeOAkOWbuuWumueUteivneiuoei0ueaUtuWFpeOAkea1meaxn+W9k+aXpeWAvDMuNzQg5LiH5YWD77yM5pio5pel5YC8NjUuMjgg5LiH5YWD77yM546v5q+U5LiL6ZmNOTQuMjclIO+8jOe7j+aguOafpeS4u+imgeaYr+eUseS6jkJTU+S+pzEyMjfotKbmnJ/mlbDmja7lupPljYfnuqflr7zoh7TmlLblhaXlh4/lsJHvvIznnIHku73noa7orqTmlbDmja7mraPluLjjgIIg"
//         },
//         {
//           "name":"-",
//           "datetime":"2018-10-19",
//           "noteId":"8bcc81ba55ac478ca587fdde2fc1bac2",
//           "title":"57O757uf57u05oqk6YCa55+l",
//           "content":"5Zug57uP5YiG57O757uf5q2j5byP546v5aKD56Gs5Lu25omp5a6577yM6YOo5YiG5pyN5Yqh6ZyA6KaB6YeN5ZCv77yM5bGK5pe26YOo5YiG5bqU55So5Y+v6IO95a2Y5Zyo5byC5bi477yM5b2x5ZON5pe25q615ZGo5YWtMTDmnIgyMOaXpe+8jOWRqOaXpeaBouWkjeato+W4uO+8jOeJueatpOmAmuefpeOAgg=="
//         },
//         {
//           "name":"-",
//           "datetime":"2018-08-24",
//           "noteId":"d03934c4e983491ea45a39922f4d033f",
//           "title":"57uf6K6h5oql6KGo5LiL6L296K+05piO",
//           "content":"5Zug5paw6ICB57uP5YiG5bm26KGM77yM6YOo5YiG6K6+5aSH5YWx55So5a+86Ie06YOo5YiG57uf6K6h5oql6KGo5pqC5Y+q6IO95Zyo6ICB57uP5YiG5LiL6L2977yM6L+R5pyf6Kej5Yaz5q2k6Zeu6aKY"
//         },
//         {
//           "name":"-",
//           "datetime":"2018-03-06",
//           "noteId":"701a5045cad8485eb9398978e6bca2e0",
//           "title":"MjAxODAzMDXotKbmnJ/mlbDmja7lj5HluIPor7TmmI4=",
//           "content":"5Zug5bGx5Lic5LiK5Lyg5pWw5o2u5bu26L+f77yM57uf5LiA5pWw5o2u5YiG5p6Q57O757uf5Li65L+d6Zqc5pWw5o2u5Y+K5pe25Y+R5biD77yMMjAxODAzMDXotKbmnJ/lsbHkuJzlkK/nlKjlupTmgKXmm7/mjaLmlbDmja7vvIzmlrDkuIDku6Pnu4/okKXliIbmnpDns7vnu5/lvoXph43kvKDjgIHliqDlt6XlrozmiJDlkI7lj5HluIPlh4bnoa7mlbDmja7vvIzkuKTns7vnu5/pobXpnaLpg6jliIbmjIfmoIfmmoLkuI3kuIDoh7TvvIzmlazor7fnn6XmgonjgII="
//         }
//       ]
//   }
//
//
//
// )
