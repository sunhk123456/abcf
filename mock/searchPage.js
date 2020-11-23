/**
 * Created by liuxiuqian on 2019/1/7.
 */
const basicGoods = [
  {
    id: '1234561',
    name: '矿泉水 550ml',
    barcode: '12421432143214321',
    price: '2.00',
    num: '1',
    amount: '2.00',
  },
  {
    id: '1234562',
    name: '凉茶 300ml',
    barcode: '12421432143214322',
    price: '3.00',
    num: '2',
    amount: '6.00',
  },
  {
    id: '1234563',
    name: '好吃的薯片',
    barcode: '12421432143214323',
    price: '7.00',
    num: '4',
    amount: '28.00',
  },
  {
    id: '1234564',
    name: '特别好吃的蛋卷',
    barcode: '12421432143214324',
    price: '8.50',
    num: '3',
    amount: '25.50',
  },
  {
    id: '1234564',
    name: '特别好吃的蛋卷',
    barcode: '12421432143214324',
    price: '8.50',
    num: '3',
    amount: '25.50',
  },
];

const basicProgress = [
  {
    key: '1',
    time: '2017-10-01 14:10',
    rate: '联系客户',
    status: 'processing',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '2',
    time: '2017-10-01 14:05',
    rate: '取货员出发',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '1h',
  },
  {
    key: '3',
    time: '2017-10-01 13:05',
    rate: '取货员接单',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '4',
    time: '2017-10-01 13:00',
    rate: '申请审批通过',
    status: 'success',
    operator: '系统',
    cost: '1h',
  },
  {
    key: '5',
    time: '2017-10-01 12:00',
    rate: '发起退货申请',
    status: 'success',
    operator: '用户',
    cost: '5mins',
  },
];

const advancedOperation1 = [
  {
    key: 'op1',
    type: '订购关系生效',
    name: '曲丽丽',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
  {
    key: 'op2',
    type: '财务复审',
    name: '付小小',
    status: 'reject',
    updatedAt: '2017-10-03  19:23:12',
    memo: '不通过原因',
  },
  {
    key: 'op3',
    type: '部门初审',
    name: '周毛毛',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
  {
    key: 'op4',
    type: '提交订单',
    name: '林东东',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '很棒',
  },
  {
    key: 'op5',
    type: '创建订单',
    name: '汗牙牙',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
];

const advancedOperation2 = [
  {
    key: 'op1',
    type: '订购关系生效',
    name: '曲丽丽',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
];

const advancedOperation3 = [
  {
    key: 'op1',
    type: '创建订单',
    name: '汗牙牙',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
];

const getProfileBasicData = {
  basicGoods,
  basicProgress,
};

const getProfileAdvancedData = {
  advancedOperation1,
  advancedOperation2,
  advancedOperation3,
};

const getProCityArea = {
  areaDate: [
    {
      "proId": "111",
      "proName": "全国",
      "city":[
        {
          "cityId": "V0110000",
          "cityName": "北京市"
        },
        {
          "cityId": "V0120000",
          "cityName": "天津市"
        },
        {
          "cityId": "V0310000",
          "cityName": "上海市"
        },
        {
          "cityId": "V0500000",
          "cityName": "重庆市"
        },
        {
          "cityId": "V0460100",
          "cityName": "海口市"
        },
        {
          "cityId": "V0460200",
          "cityName": "三亚市"
        },
        {
          "cityId": "V04602003",
          "cityName": "保亭黎族苗族自治县"
        },
        {
          "cityId": "V04601006",
          "cityName": "澄迈县"
        },
        {
          "cityId": "V04601003",
          "cityName": "文昌市"
        },
        {
          "cityId": "V04600032",
          "cityName": "临高县"
        },
        {
          "cityId": "V04602004",
          "cityName": "五指山市"
        },
        {
          "cityId": "V04600033",
          "cityName": "昌江黎族自治县"
        },
        {
          "cityId": "V0460003",
          "cityName": "儋州市"
        },
        {
          "cityId": "V04602002",
          "cityName": "陵水黎族自治县"
        },
        {
          "cityId": "V04601008",
          "cityName": "琼中黎族苗族自治县"
        },
        {
          "cityId": "V04601007",
          "cityName": "屯昌县"
        },
        {
          "cityId": "V04601004",
          "cityName": "万宁市"
        },
        {
          "cityId": "V04601005",
          "cityName": "定安县"
        },
        {
          "cityId": "V04602001",
          "cityName": "乐东黎族自治县"
        },
        {
          "cityId": "V04601002",
          "cityName": "琼海市"
        },
        {
          "cityId": "V04600031",
          "cityName": "东方市"
        },
        {
          "cityId": "V04600034",
          "cityName": "白沙黎族自治县"
        },
        {
          "cityId": "V0440100",
          "cityName": "广州市"
        },
        {
          "cityId": "V0441500",
          "cityName": "汕尾市"
        },
        {
          "cityId": "V0441700",
          "cityName": "阳江市"
        },
        {
          "cityId": "V0445201",
          "cityName": "揭阳市"
        },
        {
          "cityId": "V0440901",
          "cityName": "茂名市"
        },
        {
          "cityId": "V0440700",
          "cityName": "江门市"
        },
        {
          "cityId": "V0440201",
          "cityName": "韶关市"
        },
        {
          "cityId": "V0441300",
          "cityName": "惠州市"
        },
        {
          "cityId": "V0441401",
          "cityName": "梅州市"
        },
        {
          "cityId": "V0440510",
          "cityName": "汕头市"
        },
        {
          "cityId": "V0440300",
          "cityName": "深圳市"
        },
        {
          "cityId": "V0440400",
          "cityName": "珠海市"
        },
        {
          "cityId": "V0440600",
          "cityName": "佛山市"
        },
        {
          "cityId": "V0441201",
          "cityName": "肇庆市"
        },
        {
          "cityId": "V0440800",
          "cityName": "湛江市"
        },
        {
          "cityId": "V0442000",
          "cityName": "中山市"
        },
        {
          "cityId": "V0441600",
          "cityName": "河源市"
        },
        {
          "cityId": "V0441800",
          "cityName": "清远市"
        },
        {
          "cityId": "V0441281",
          "cityName": "云浮市"
        },
        {
          "cityId": "V0445100",
          "cityName": "潮州市"
        },
        {
          "cityId": "V0441900",
          "cityName": "东莞市"
        },
        {
          "cityId": "V0420100",
          "cityName": "武汉市"
        },
        {
          "cityId": "V0420600",
          "cityName": "襄樊市"
        },
        {
          "cityId": "V0420700",
          "cityName": "鄂州市"
        },
        {
          "cityId": "V0420900",
          "cityName": "孝感市"
        },
        {
          "cityId": "V0422100",
          "cityName": "黄冈市"
        },
        {
          "cityId": "V0420200",
          "cityName": "黄石市"
        },
        {
          "cityId": "V0422300",
          "cityName": "咸宁市"
        },
        {
          "cityId": "V0422400",
          "cityName": "荆州市"
        },
        {
          "cityId": "V0420500",
          "cityName": "宜昌市"
        },
        {
          "cityId": "V0422800",
          "cityName": "恩施土家族苗族自治州"
        },
        {
          "cityId": "V0422600",
          "cityName": "十堰市"
        },
        {
          "cityId": "V0420681",
          "cityName": "随州市"
        },
        {
          "cityId": "V0420800",
          "cityName": "荆门市"
        },
        {
          "cityId": "V0422401",
          "cityName": "江汉市"
        },
        {
          "cityId": "V0210100",
          "cityName": "沈阳市"
        },
        {
          "cityId": "V0210200",
          "cityName": "大连市"
        },
        {
          "cityId": "V0210300",
          "cityName": "鞍山市"
        },
        {
          "cityId": "V0210400",
          "cityName": "抚顺市"
        },
        {
          "cityId": "V0210500",
          "cityName": "本溪市"
        },
        {
          "cityId": "V0210600",
          "cityName": "丹东市"
        },
        {
          "cityId": "V0210700",
          "cityName": "锦州市"
        },
        {
          "cityId": "V0210800",
          "cityName": "营口市"
        },
        {
          "cityId": "V0210900",
          "cityName": "阜新市"
        },
        {
          "cityId": "V0211000",
          "cityName": "辽阳市"
        },
        {
          "cityId": "V0211200",
          "cityName": "铁岭市"
        },
        {
          "cityId": "V0211300",
          "cityName": "朝阳市"
        },
        {
          "cityId": "V0211100",
          "cityName": "盘锦市"
        },
        {
          "cityId": "V0211400",
          "cityName": "葫芦岛市"
        },
        {
          "cityId": "V0533100",
          "cityName": "德宏傣族景颇族自治州"
        },
        {
          "cityId": "V0532600",
          "cityName": "文山壮族苗族自治州"
        },
        {
          "cityId": "V0533000",
          "cityName": "保山市"
        },
        {
          "cityId": "V0533500",
          "cityName": "临沧市"
        },
        {
          "cityId": "V0533300",
          "cityName": "怒江僳僳族自治州"
        },
        {
          "cityId": "V0533400",
          "cityName": "迪庆藏族普米族自治县"
        },
        {
          "cityId": "V0532100",
          "cityName": "昭通市"
        },
        {
          "cityId": "V0530100",
          "cityName": "昆明市"
        },
        {
          "cityId": "V0532500",
          "cityName": "红河哈尼族彝族自治州"
        },
        {
          "cityId": "V0532900",
          "cityName": "大理白族自治州"
        },
        {
          "cityId": "V0533200",
          "cityName": "丽江市"
        },
        {
          "cityId": "V0532300",
          "cityName": "楚雄彝族自治州"
        },
        {
          "cityId": "V0532400",
          "cityName": "玉溪市"
        },
        {
          "cityId": "V0532200",
          "cityName": "曲靖市"
        },
        {
          "cityId": "V0532800",
          "cityName": "西双版纳傣族自治州"
        },
        {
          "cityId": "V0533600",
          "cityName": "普洱市"
        },
        {
          "cityId": "V0622400",
          "cityName": "定西市"
        },
        {
          "cityId": "V0622700",
          "cityName": "平凉市"
        },
        {
          "cityId": "V0622800",
          "cityName": "庆阳市"
        },
        {
          "cityId": "V0622300",
          "cityName": "武威市"
        },
        {
          "cityId": "V0622201",
          "cityName": "张掖市"
        },
        {
          "cityId": "V0620200",
          "cityName": "嘉峪关市"
        },
        {
          "cityId": "V0620500",
          "cityName": "天水市"
        },
        {
          "cityId": "V0622901",
          "cityName": "临夏回族自治州"
        },
        {
          "cityId": "V0620400",
          "cityName": "白银市"
        },
        {
          "cityId": "V0620300",
          "cityName": "金昌市"
        },
        {
          "cityId": "V0622100",
          "cityName": "酒泉市"
        },
        {
          "cityId": "V0622600",
          "cityName": "陇南市"
        },
        {
          "cityId": "V0623000",
          "cityName": "甘南藏族自治州"
        },
        {
          "cityId": "V0620100",
          "cityName": "兰州市"
        },
        {
          "cityId": "V0150100",
          "cityName": "呼和浩特市"
        },
        {
          "cityId": "V0150200",
          "cityName": "包头市"
        },
        {
          "cityId": "V0150300",
          "cityName": "乌海市"
        },
        {
          "cityId": "V0150400",
          "cityName": "赤峰市"
        },
        {
          "cityId": "V0152200",
          "cityName": "兴安盟"
        },
        {
          "cityId": "V0152301",
          "cityName": "通辽市"
        },
        {
          "cityId": "V0152500",
          "cityName": "锡林郭勒盟"
        },
        {
          "cityId": "V0152600",
          "cityName": "乌兰察布市"
        },
        {
          "cityId": "V0152700",
          "cityName": "鄂尔多斯市"
        },
        {
          "cityId": "V0152800",
          "cityName": "巴彦淖尔市"
        },
        {
          "cityId": "V0152900",
          "cityName": "阿拉善盟"
        },
        {
          "cityId": "V0152302",
          "cityName": "呼伦贝尔市"
        },
        {
          "cityId": "V0520100",
          "cityName": "贵阳市"
        },
        {
          "cityId": "V0522100",
          "cityName": "遵义市"
        },
        {
          "cityId": "V0522500",
          "cityName": "安顺市"
        },
        {
          "cityId": "V0522200",
          "cityName": "铜仁市"
        },
        {
          "cityId": "V0522400",
          "cityName": "毕节市"
        },
        {
          "cityId": "V0520200",
          "cityName": "六盘水市"
        },
        {
          "cityId": "V0522900",
          "cityName": "黔西南布依族苗族自治州"
        },
        {
          "cityId": "V0523100",
          "cityName": "黔东南苗族侗族自治州"
        },
        {
          "cityId": "V0523200",
          "cityName": "黔南布依族苗族自治州"
        },
        {
          "cityId": "V0522800",
          "cityName": "贵安新区"
        },
        {
          "cityId": "V0410100",
          "cityName": "郑州市"
        },
        {
          "cityId": "V0410200",
          "cityName": "开封市"
        },
        {
          "cityId": "V0410300",
          "cityName": "洛阳市"
        },
        {
          "cityId": "V0410400",
          "cityName": "平顶山市"
        },
        {
          "cityId": "V0410500",
          "cityName": "安阳市"
        },
        {
          "cityId": "V0410600",
          "cityName": "鹤壁市"
        },
        {
          "cityId": "V0410700",
          "cityName": "新乡市"
        },
        {
          "cityId": "V0410800",
          "cityName": "焦作市"
        },
        {
          "cityId": "V0410900",
          "cityName": "濮阳市"
        },
        {
          "cityId": "V0411000",
          "cityName": "许昌市"
        },
        {
          "cityId": "V0411100",
          "cityName": "漯河市"
        },
        {
          "cityId": "V0411200",
          "cityName": "三门峡市"
        },
        {
          "cityId": "V0412300",
          "cityName": "商丘市"
        },
        {
          "cityId": "V0412700",
          "cityName": "周口市"
        },
        {
          "cityId": "V0412801",
          "cityName": "驻马店市"
        },
        {
          "cityId": "V0412901",
          "cityName": "南阳市"
        },
        {
          "cityId": "V0413000",
          "cityName": "信阳市"
        },
        {
          "cityId": "V0412800",
          "cityName": "济源市"
        },
        {
          "cityId": "V0330100",
          "cityName": "杭州市"
        },
        {
          "cityId": "V0330200",
          "cityName": "宁波市"
        },
        {
          "cityId": "V0330300",
          "cityName": "温州市"
        },
        {
          "cityId": "V0332600",
          "cityName": "台州市"
        },
        {
          "cityId": "V0330700",
          "cityName": "金华市"
        },
        {
          "cityId": "V0330400",
          "cityName": "嘉兴市"
        },
        {
          "cityId": "V0330600",
          "cityName": "绍兴市"
        },
        {
          "cityId": "V0330500",
          "cityName": "湖州市"
        },
        {
          "cityId": "V0332500",
          "cityName": "丽水市"
        },
        {
          "cityId": "V0330800",
          "cityName": "衢州市"
        },
        {
          "cityId": "V0330900",
          "cityName": "舟山市"
        },
        {
          "cityId": "V0320100",
          "cityName": "南京市"
        },
        {
          "cityId": "V0320500",
          "cityName": "苏州市"
        },
        {
          "cityId": "V0320200",
          "cityName": "无锡市"
        },
        {
          "cityId": "V0320400",
          "cityName": "常州市"
        },
        {
          "cityId": "V0321000",
          "cityName": "扬州市"
        },
        {
          "cityId": "V0321100",
          "cityName": "镇江市"
        },
        {
          "cityId": "V0320600",
          "cityName": "南通市"
        },
        {
          "cityId": "V0320300",
          "cityName": "徐州市"
        },
        {
          "cityId": "V0321082",
          "cityName": "泰州市"
        },
        {
          "cityId": "V0320900",
          "cityName": "盐城市"
        },
        {
          "cityId": "V0320800",
          "cityName": "淮安市"
        },
        {
          "cityId": "V0320700",
          "cityName": "连云港市"
        },
        {
          "cityId": "V0320881",
          "cityName": "宿迁市"
        },
        {
          "cityId": "V0220100",
          "cityName": "长春市"
        },
        {
          "cityId": "V0220200",
          "cityName": "吉林市"
        },
        {
          "cityId": "V0222400",
          "cityName": "延边朝鲜族自治州"
        },
        {
          "cityId": "V0220300",
          "cityName": "四平市"
        },
        {
          "cityId": "V0220500",
          "cityName": "通化市"
        },
        {
          "cityId": "V0220800",
          "cityName": "白城市"
        },
        {
          "cityId": "V0220400",
          "cityName": "辽源市"
        },
        {
          "cityId": "V0220700",
          "cityName": "松原市"
        },
        {
          "cityId": "V0220600",
          "cityName": "白山市"
        },
        {
          "cityId": "V0630100",
          "cityName": "西宁市"
        },
        {
          "cityId": "V0632100",
          "cityName": "海东地区"
        },
        {
          "cityId": "V0632801",
          "cityName": "格尔木市"
        },
        {
          "cityId": "V0632200",
          "cityName": "海北藏族自治州"
        },
        {
          "cityId": "V0632500",
          "cityName": "海南藏族自治州"
        },
        {
          "cityId": "V0632800",
          "cityName": "海西蒙古族藏族自治州"
        },
        {
          "cityId": "V0632600",
          "cityName": "果洛藏族自治州"
        },
        {
          "cityId": "V0632700",
          "cityName": "玉树藏族自治州"
        },
        {
          "cityId": "V0632300",
          "cityName": "黄南藏族自治州"
        },
        {
          "cityId": "V0540100",
          "cityName": "拉萨市"
        },
        {
          "cityId": "V0542300",
          "cityName": "日喀则地区"
        },
        {
          "cityId": "V0542200",
          "cityName": "山南地区"
        },
        {
          "cityId": "V0542600",
          "cityName": "林芝地区"
        },
        {
          "cityId": "V0542100",
          "cityName": "昌都地区"
        },
        {
          "cityId": "V0542400",
          "cityName": "那曲地区"
        },
        {
          "cityId": "V0542500",
          "cityName": "阿里地区"
        },
        {
          "cityId": "V0430100",
          "cityName": "长沙市"
        },
        {
          "cityId": "V0430200",
          "cityName": "株洲市"
        },
        {
          "cityId": "V0430300",
          "cityName": "湘潭市"
        },
        {
          "cityId": "V0430400",
          "cityName": "衡阳市"
        },
        {
          "cityId": "V0430600",
          "cityName": "岳阳市"
        },
        {
          "cityId": "V0430900",
          "cityName": "益阳市"
        },
        {
          "cityId": "V0431000",
          "cityName": "郴州市"
        },
        {
          "cityId": "V0430700",
          "cityName": "常德市"
        },
        {
          "cityId": "V0432500",
          "cityName": "娄底市"
        },
        {
          "cityId": "V0430500",
          "cityName": "邵阳市"
        },
        {
          "cityId": "V0433100",
          "cityName": "湘西土家族苗族自治州"
        },
        {
          "cityId": "V0430800",
          "cityName": "张家界市"
        },
        {
          "cityId": "V0431200",
          "cityName": "怀化市"
        },
        {
          "cityId": "V0431100",
          "cityName": "永州市"
        },
        {
          "cityId": "V0350100",
          "cityName": "福州市"
        },
        {
          "cityId": "V0350200",
          "cityName": "厦门市"
        },
        {
          "cityId": "V0350500",
          "cityName": "泉州市"
        },
        {
          "cityId": "V0350600",
          "cityName": "漳州市"
        },
        {
          "cityId": "V0352200",
          "cityName": "宁德市"
        },
        {
          "cityId": "V0350300",
          "cityName": "莆田市"
        },
        {
          "cityId": "V0352100",
          "cityName": "南平市"
        },
        {
          "cityId": "V0350400",
          "cityName": "三明市"
        },
        {
          "cityId": "V0352600",
          "cityName": "龙岩市"
        },
        {
          "cityId": "V0510100",
          "cityName": "成都市"
        },
        {
          "cityId": "V0510300",
          "cityName": "自贡市"
        },
        {
          "cityId": "V0510400",
          "cityName": "攀枝花市"
        },
        {
          "cityId": "V0510500",
          "cityName": "泸州市"
        },
        {
          "cityId": "V0510600",
          "cityName": "德阳市"
        },
        {
          "cityId": "V0510700",
          "cityName": "绵阳市"
        },
        {
          "cityId": "V0510800",
          "cityName": "广元市"
        },
        {
          "cityId": "V0510900",
          "cityName": "遂宁市"
        },
        {
          "cityId": "V0511000",
          "cityName": "内江市"
        },
        {
          "cityId": "V0511100",
          "cityName": "乐山市"
        },
        {
          "cityId": "V0511300",
          "cityName": "南充市"
        },
        {
          "cityId": "V0513800",
          "cityName": "眉山市"
        },
        {
          "cityId": "V0512500",
          "cityName": "宜宾市"
        },
        {
          "cityId": "V0513600",
          "cityName": "广安市"
        },
        {
          "cityId": "V0513000",
          "cityName": "达州市"
        },
        {
          "cityId": "V0513100",
          "cityName": "雅安市"
        },
        {
          "cityId": "V0513700",
          "cityName": "巴中市"
        },
        {
          "cityId": "V0513900",
          "cityName": "资阳市"
        },
        {
          "cityId": "V0513200",
          "cityName": "阿坝藏族羌族自治州"
        },
        {
          "cityId": "V0513300",
          "cityName": "甘孜藏族自治州"
        },
        {
          "cityId": "V0513400",
          "cityName": "凉山彝族自治州"
        },
        {
          "cityId": "V0650100",
          "cityName": "乌鲁木齐市"
        },
        {
          "cityId": "V0650200",
          "cityName": "克拉玛依市"
        },
        {
          "cityId": "V0652101",
          "cityName": "吐鲁番地区"
        },
        {
          "cityId": "V0652201",
          "cityName": "哈密地区"
        },
        {
          "cityId": "V0652301",
          "cityName": "昌吉回族自治州"
        },
        {
          "cityId": "V0650300",
          "cityName": "博尔塔拉蒙古自治州"
        },
        {
          "cityId": "V0650500",
          "cityName": "巴音郭楞蒙古自治州"
        },
        {
          "cityId": "V0652901",
          "cityName": "阿克苏地区"
        },
        {
          "cityId": "V0650600",
          "cityName": "克孜勒苏柯尔克孜自治州"
        },
        {
          "cityId": "V0653101",
          "cityName": "喀什地区"
        },
        {
          "cityId": "V0653201",
          "cityName": "和田地区"
        },
        {
          "cityId": "V0654001",
          "cityName": "奎屯市"
        },
        {
          "cityId": "V0650400",
          "cityName": "伊犁哈萨克自治州"
        },
        {
          "cityId": "V0654201",
          "cityName": "塔城市"
        },
        {
          "cityId": "V0654301",
          "cityName": "阿勒泰地区"
        },
        {
          "cityId": "V0659001",
          "cityName": "石河子市"
        },
        {
          "cityId": "V0360100",
          "cityName": "南昌市"
        },
        {
          "cityId": "V0360400",
          "cityName": "九江市"
        },
        {
          "cityId": "V0362233",
          "cityName": "上饶市"
        },
        {
          "cityId": "V0362500",
          "cityName": "抚州市"
        },
        {
          "cityId": "V0362200",
          "cityName": "宜春市"
        },
        {
          "cityId": "V0362400",
          "cityName": "吉安市"
        },
        {
          "cityId": "V0362100",
          "cityName": "赣州市"
        },
        {
          "cityId": "V0360200",
          "cityName": "景德镇市"
        },
        {
          "cityId": "V0360300",
          "cityName": "萍乡市"
        },
        {
          "cityId": "V0360500",
          "cityName": "新余市"
        },
        {
          "cityId": "V0360600",
          "cityName": "鹰潭市"
        },
        {
          "cityId": "V0340500",
          "cityName": "马鞍山市"
        },
        {
          "cityId": "V0340300",
          "cityName": "蚌埠市"
        },
        {
          "cityId": "V0340800",
          "cityName": "安庆市"
        },
        {
          "cityId": "V0340200",
          "cityName": "芜湖市"
        },
        {
          "cityId": "V0342400",
          "cityName": "六安市"
        },
        {
          "cityId": "V0340100",
          "cityName": "合肥市"
        },
        {
          "cityId": "V0342100",
          "cityName": "阜阳市"
        },
        {
          "cityId": "V0340400",
          "cityName": "淮南市"
        },
        {
          "cityId": "V0340700",
          "cityName": "铜陵市"
        },
        {
          "cityId": "V0342500",
          "cityName": "宣州市"
        },
        {
          "cityId": "V0341100",
          "cityName": "滁州市"
        },
        {
          "cityId": "V0342200",
          "cityName": "宿州市"
        },
        {
          "cityId": "V0340600",
          "cityName": "淮北市"
        },
        {
          "cityId": "V0341000",
          "cityName": "黄山市"
        },
        {
          "cityId": "V0342900",
          "cityName": "池州市"
        },
        {
          "cityId": "V0343000",
          "cityName": "亳州市"
        },
        {
          "cityId": "V0140600",
          "cityName": "朔州市"
        },
        {
          "cityId": "V0142200",
          "cityName": "忻州市"
        },
        {
          "cityId": "V0140100",
          "cityName": "太原市"
        },
        {
          "cityId": "V0140200",
          "cityName": "大同市"
        },
        {
          "cityId": "V0140300",
          "cityName": "阳泉市"
        },
        {
          "cityId": "V0142400",
          "cityName": "晋中市 "
        },
        {
          "cityId": "V0140400",
          "cityName": "长治市"
        },
        {
          "cityId": "V0140500",
          "cityName": "晋城市"
        },
        {
          "cityId": "V0142600",
          "cityName": "临汾市"
        },
        {
          "cityId": "V0142300",
          "cityName": "吕梁市"
        },
        {
          "cityId": "V0142700",
          "cityName": "运城市"
        },
        {
          "cityId": "V0130400",
          "cityName": "邯郸市"
        },
        {
          "cityId": "V0130600",
          "cityName": "保定市"
        },
        {
          "cityId": "V0130700",
          "cityName": "张家口市"
        },
        {
          "cityId": "V0130200",
          "cityName": "唐山市"
        },
        {
          "cityId": "V0130900",
          "cityName": "沧州市"
        },
        {
          "cityId": "V0130500",
          "cityName": "邢台市"
        },
        {
          "cityId": "V0130300",
          "cityName": "秦皇岛市"
        },
        {
          "cityId": "V0130100",
          "cityName": "石家庄市"
        },
        {
          "cityId": "V0130800",
          "cityName": "承德市"
        },
        {
          "cityId": "V0131000",
          "cityName": "廊坊市"
        },
        {
          "cityId": "V0133000",
          "cityName": "衡水市"
        },
        {
          "cityId": "V0132000",
          "cityName": "雄安新区"
        },
        {
          "cityId": "V0640100",
          "cityName": "银川市"
        },
        {
          "cityId": "V0642100",
          "cityName": "吴忠市"
        },
        {
          "cityId": "V0640200",
          "cityName": "石嘴山市"
        },
        {
          "cityId": "V0642200",
          "cityName": "固原市"
        },
        {
          "cityId": "V0642300",
          "cityName": "中卫市"
        },
        {
          "cityId": "V0610300",
          "cityName": "宝鸡市"
        },
        {
          "cityId": "V0610100",
          "cityName": "西安市"
        },
        {
          "cityId": "V0612601",
          "cityName": "延安市"
        },
        {
          "cityId": "V0612101",
          "cityName": "渭南市"
        },
        {
          "cityId": "V0610400",
          "cityName": "咸阳市"
        },
        {
          "cityId": "V0612701",
          "cityName": "榆林市"
        },
        {
          "cityId": "V0610200",
          "cityName": "铜川市"
        },
        {
          "cityId": "V0612501",
          "cityName": "商洛市"
        },
        {
          "cityId": "V0612401",
          "cityName": "安康市"
        },
        {
          "cityId": "V0612301",
          "cityName": "汉中市"
        },
        {
          "cityId": "V0450100",
          "cityName": "南宁市"
        },
        {
          "cityId": "V0450300",
          "cityName": "桂林市"
        },
        {
          "cityId": "V0450200",
          "cityName": "柳州市"
        },
        {
          "cityId": "V0450400",
          "cityName": "梧州市"
        },
        {
          "cityId": "V0452500",
          "cityName": "玉林市"
        },
        {
          "cityId": "V0452600",
          "cityName": "百色市"
        },
        {
          "cityId": "V0452800",
          "cityName": "钦州市"
        },
        {
          "cityId": "V0452700",
          "cityName": "河池市"
        },
        {
          "cityId": "V0450500",
          "cityName": "北海市"
        },
        {
          "cityId": "V0453200",
          "cityName": "崇左市"
        },
        {
          "cityId": "V0453000",
          "cityName": "贺州市"
        },
        {
          "cityId": "V0452900",
          "cityName": "贵港市"
        },
        {
          "cityId": "V0450600",
          "cityName": "防城港市"
        },
        {
          "cityId": "V0453100",
          "cityName": "来宾市"
        },
        {
          "cityId": "V0230100",
          "cityName": "哈尔滨市"
        },
        {
          "cityId": "V0230200",
          "cityName": "齐齐哈尔市"
        },
        {
          "cityId": "V0231000",
          "cityName": "牡丹江市"
        },
        {
          "cityId": "V0230800",
          "cityName": "佳木斯市"
        },
        {
          "cityId": "V0232300",
          "cityName": "绥化市"
        },
        {
          "cityId": "V0230600",
          "cityName": "大庆市"
        },
        {
          "cityId": "V0230300",
          "cityName": "鸡西市"
        },
        {
          "cityId": "V0231100",
          "cityName": "黑河市"
        },
        {
          "cityId": "V0230700",
          "cityName": "伊春市"
        },
        {
          "cityId": "V0230500",
          "cityName": "双鸭山市"
        },
        {
          "cityId": "V0230400",
          "cityName": "鹤岗市"
        },
        {
          "cityId": "V0230900",
          "cityName": "七台河市"
        },
        {
          "cityId": "V0232700",
          "cityName": "大兴安岭地区"
        },
        {
          "cityId": "V0370100",
          "cityName": "济南市"
        },
        {
          "cityId": "V0370200",
          "cityName": "青岛市"
        },
        {
          "cityId": "V0370300",
          "cityName": "淄博市"
        },
        {
          "cityId": "V0370400",
          "cityName": "枣庄市"
        },
        {
          "cityId": "V0370500",
          "cityName": "东营市"
        },
        {
          "cityId": "V0370600",
          "cityName": "烟台市"
        },
        {
          "cityId": "V0370700",
          "cityName": "潍坊市"
        },
        {
          "cityId": "V0370800",
          "cityName": "济宁市"
        },
        {
          "cityId": "V0370900",
          "cityName": "泰安市"
        },
        {
          "cityId": "V0371000",
          "cityName": "威海市"
        },
        {
          "cityId": "V0371100",
          "cityName": "日照市"
        },
        {
          "cityId": "V0371200",
          "cityName": "莱芜市"
        },
        {
          "cityId": "V0372801",
          "cityName": "临沂市"
        },
        {
          "cityId": "V0372401",
          "cityName": "德州市"
        },
        {
          "cityId": "V0372500",
          "cityName": "聊城市"
        },
        {
          "cityId": "V0372300",
          "cityName": "滨州市"
        },
        {
          "cityId": "V0372900",
          "cityName": "菏泽市"
        }
      ]
    },
    {
      "proId": "112",
      "proName": "北十省",
      "city":[
        {
          "cityId": "V0110000",
          "cityName": "北京市"
        },
        {
          "cityId": "V0120000",
          "cityName": "天津市"
        },
        {
          "cityId": "V0210100",
          "cityName": "沈阳市"
        },
        {
          "cityId": "V0210200",
          "cityName": "大连市"
        },
        {
          "cityId": "V0210300",
          "cityName": "鞍山市"
        },
        {
          "cityId": "V0210400",
          "cityName": "抚顺市"
        },
        {
          "cityId": "V0210500",
          "cityName": "本溪市"
        },
        {
          "cityId": "V0210600",
          "cityName": "丹东市"
        },
        {
          "cityId": "V0210700",
          "cityName": "锦州市"
        },
        {
          "cityId": "V0210800",
          "cityName": "营口市"
        },
        {
          "cityId": "V0210900",
          "cityName": "阜新市"
        },
        {
          "cityId": "V0211000",
          "cityName": "辽阳市"
        },
        {
          "cityId": "V0211200",
          "cityName": "铁岭市"
        },
        {
          "cityId": "V0211300",
          "cityName": "朝阳市"
        },
        {
          "cityId": "V0211100",
          "cityName": "盘锦市"
        },
        {
          "cityId": "V0211400",
          "cityName": "葫芦岛市"
        },
        {
          "cityId": "V0150100",
          "cityName": "呼和浩特市"
        },
        {
          "cityId": "V0150200",
          "cityName": "包头市"
        },
        {
          "cityId": "V0150300",
          "cityName": "乌海市"
        },
        {
          "cityId": "V0150400",
          "cityName": "赤峰市"
        },
        {
          "cityId": "V0152200",
          "cityName": "兴安盟"
        },
        {
          "cityId": "V0152301",
          "cityName": "通辽市"
        },
        {
          "cityId": "V0152500",
          "cityName": "锡林郭勒盟"
        },
        {
          "cityId": "V0152600",
          "cityName": "乌兰察布市"
        },
        {
          "cityId": "V0152700",
          "cityName": "鄂尔多斯市"
        },
        {
          "cityId": "V0152800",
          "cityName": "巴彦淖尔市"
        },
        {
          "cityId": "V0152900",
          "cityName": "阿拉善盟"
        },
        {
          "cityId": "V0152302",
          "cityName": "呼伦贝尔市"
        },
        {
          "cityId": "V0410100",
          "cityName": "郑州市"
        },
        {
          "cityId": "V0410200",
          "cityName": "开封市"
        },
        {
          "cityId": "V0410300",
          "cityName": "洛阳市"
        },
        {
          "cityId": "V0410400",
          "cityName": "平顶山市"
        },
        {
          "cityId": "V0410500",
          "cityName": "安阳市"
        },
        {
          "cityId": "V0410600",
          "cityName": "鹤壁市"
        },
        {
          "cityId": "V0410700",
          "cityName": "新乡市"
        },
        {
          "cityId": "V0410800",
          "cityName": "焦作市"
        },
        {
          "cityId": "V0410900",
          "cityName": "濮阳市"
        },
        {
          "cityId": "V0411000",
          "cityName": "许昌市"
        },
        {
          "cityId": "V0411100",
          "cityName": "漯河市"
        },
        {
          "cityId": "V0411200",
          "cityName": "三门峡市"
        },
        {
          "cityId": "V0412300",
          "cityName": "商丘市"
        },
        {
          "cityId": "V0412700",
          "cityName": "周口市"
        },
        {
          "cityId": "V0412801",
          "cityName": "驻马店市"
        },
        {
          "cityId": "V0412901",
          "cityName": "南阳市"
        },
        {
          "cityId": "V0413000",
          "cityName": "信阳市"
        },
        {
          "cityId": "V0412800",
          "cityName": "济源市"
        },
        {
          "cityId": "V0220100",
          "cityName": "长春市"
        },
        {
          "cityId": "V0220200",
          "cityName": "吉林市"
        },
        {
          "cityId": "V0222400",
          "cityName": "延边朝鲜族自治州"
        },
        {
          "cityId": "V0220300",
          "cityName": "四平市"
        },
        {
          "cityId": "V0220500",
          "cityName": "通化市"
        },
        {
          "cityId": "V0220800",
          "cityName": "白城市"
        },
        {
          "cityId": "V0220400",
          "cityName": "辽源市"
        },
        {
          "cityId": "V0220700",
          "cityName": "松原市"
        },
        {
          "cityId": "V0220600",
          "cityName": "白山市"
        },
        {
          "cityId": "V0140600",
          "cityName": "朔州市"
        },
        {
          "cityId": "V0142200",
          "cityName": "忻州市"
        },
        {
          "cityId": "V0140100",
          "cityName": "太原市"
        },
        {
          "cityId": "V0140200",
          "cityName": "大同市"
        },
        {
          "cityId": "V0140300",
          "cityName": "阳泉市"
        },
        {
          "cityId": "V0142400",
          "cityName": "晋中市 "
        },
        {
          "cityId": "V0140400",
          "cityName": "长治市"
        },
        {
          "cityId": "V0140500",
          "cityName": "晋城市"
        },
        {
          "cityId": "V0142600",
          "cityName": "临汾市"
        },
        {
          "cityId": "V0142300",
          "cityName": "吕梁市"
        },
        {
          "cityId": "V0142700",
          "cityName": "运城市"
        },
        {
          "cityId": "V0130400",
          "cityName": "邯郸市"
        },
        {
          "cityId": "V0130600",
          "cityName": "保定市"
        },
        {
          "cityId": "V0130700",
          "cityName": "张家口市"
        },
        {
          "cityId": "V0130200",
          "cityName": "唐山市"
        },
        {
          "cityId": "V0130900",
          "cityName": "沧州市"
        },
        {
          "cityId": "V0130500",
          "cityName": "邢台市"
        },
        {
          "cityId": "V0130300",
          "cityName": "秦皇岛市"
        },
        {
          "cityId": "V0130100",
          "cityName": "石家庄市"
        },
        {
          "cityId": "V0130800",
          "cityName": "承德市"
        },
        {
          "cityId": "V0131000",
          "cityName": "廊坊市"
        },
        {
          "cityId": "V0133000",
          "cityName": "衡水市"
        },
        {
          "cityId": "V0132000",
          "cityName": "雄安新区"
        },
        {
          "cityId": "V0230100",
          "cityName": "哈尔滨市"
        },
        {
          "cityId": "V0230200",
          "cityName": "齐齐哈尔市"
        },
        {
          "cityId": "V0231000",
          "cityName": "牡丹江市"
        },
        {
          "cityId": "V0230800",
          "cityName": "佳木斯市"
        },
        {
          "cityId": "V0232300",
          "cityName": "绥化市"
        },
        {
          "cityId": "V0230600",
          "cityName": "大庆市"
        },
        {
          "cityId": "V0230300",
          "cityName": "鸡西市"
        },
        {
          "cityId": "V0231100",
          "cityName": "黑河市"
        },
        {
          "cityId": "V0230700",
          "cityName": "伊春市"
        },
        {
          "cityId": "V0230500",
          "cityName": "双鸭山市"
        },
        {
          "cityId": "V0230400",
          "cityName": "鹤岗市"
        },
        {
          "cityId": "V0230900",
          "cityName": "七台河市"
        },
        {
          "cityId": "V0232700",
          "cityName": "大兴安岭地区"
        },
        {
          "cityId": "V0370100",
          "cityName": "济南市"
        },
        {
          "cityId": "V0370200",
          "cityName": "青岛市"
        },
        {
          "cityId": "V0370300",
          "cityName": "淄博市"
        },
        {
          "cityId": "V0370400",
          "cityName": "枣庄市"
        },
        {
          "cityId": "V0370500",
          "cityName": "东营市"
        },
        {
          "cityId": "V0370600",
          "cityName": "烟台市"
        },
        {
          "cityId": "V0370700",
          "cityName": "潍坊市"
        },
        {
          "cityId": "V0370800",
          "cityName": "济宁市"
        },
        {
          "cityId": "V0370900",
          "cityName": "泰安市"
        },
        {
          "cityId": "V0371000",
          "cityName": "威海市"
        },
        {
          "cityId": "V0371100",
          "cityName": "日照市"
        },
        {
          "cityId": "V0371200",
          "cityName": "莱芜市"
        },
        {
          "cityId": "V0372801",
          "cityName": "临沂市"
        },
        {
          "cityId": "V0372401",
          "cityName": "德州市"
        },
        {
          "cityId": "V0372500",
          "cityName": "聊城市"
        },
        {
          "cityId": "V0372300",
          "cityName": "滨州市"
        },
        {
          "cityId": "V0372900",
          "cityName": "菏泽市"
        }
      ]
    },
    {
      "proId": "113",
      "proName": "南二十一省",
      "city":[
        {
          "cityId": "V0310000",
          "cityName": "上海市"
        },
        {
          "cityId": "V0500000",
          "cityName": "重庆市"
        },
        {
          "cityId": "V0460100",
          "cityName": "海口市"
        },
        {
          "cityId": "V0460200",
          "cityName": "三亚市"
        },
        {
          "cityId": "V04602003",
          "cityName": "保亭黎族苗族自治县"
        },
        {
          "cityId": "V04601006",
          "cityName": "澄迈县"
        },
        {
          "cityId": "V04601003",
          "cityName": "文昌市"
        },
        {
          "cityId": "V04600032",
          "cityName": "临高县"
        },
        {
          "cityId": "V04602004",
          "cityName": "五指山市"
        },
        {
          "cityId": "V04600033",
          "cityName": "昌江黎族自治县"
        },
        {
          "cityId": "V0460003",
          "cityName": "儋州市"
        },
        {
          "cityId": "V04602002",
          "cityName": "陵水黎族自治县"
        },
        {
          "cityId": "V04601008",
          "cityName": "琼中黎族苗族自治县"
        },
        {
          "cityId": "V04601007",
          "cityName": "屯昌县"
        },
        {
          "cityId": "V04601004",
          "cityName": "万宁市"
        },
        {
          "cityId": "V04601005",
          "cityName": "定安县"
        },
        {
          "cityId": "V04602001",
          "cityName": "乐东黎族自治县"
        },
        {
          "cityId": "V04601002",
          "cityName": "琼海市"
        },
        {
          "cityId": "V04600031",
          "cityName": "东方市"
        },
        {
          "cityId": "V04600034",
          "cityName": "白沙黎族自治县"
        },
        {
          "cityId": "V0440100",
          "cityName": "广州市"
        },
        {
          "cityId": "V0441500",
          "cityName": "汕尾市"
        },
        {
          "cityId": "V0441700",
          "cityName": "阳江市"
        },
        {
          "cityId": "V0445201",
          "cityName": "揭阳市"
        },
        {
          "cityId": "V0440901",
          "cityName": "茂名市"
        },
        {
          "cityId": "V0440700",
          "cityName": "江门市"
        },
        {
          "cityId": "V0440201",
          "cityName": "韶关市"
        },
        {
          "cityId": "V0441300",
          "cityName": "惠州市"
        },
        {
          "cityId": "V0441401",
          "cityName": "梅州市"
        },
        {
          "cityId": "V0440510",
          "cityName": "汕头市"
        },
        {
          "cityId": "V0440300",
          "cityName": "深圳市"
        },
        {
          "cityId": "V0440400",
          "cityName": "珠海市"
        },
        {
          "cityId": "V0440600",
          "cityName": "佛山市"
        },
        {
          "cityId": "V0441201",
          "cityName": "肇庆市"
        },
        {
          "cityId": "V0440800",
          "cityName": "湛江市"
        },
        {
          "cityId": "V0442000",
          "cityName": "中山市"
        },
        {
          "cityId": "V0441600",
          "cityName": "河源市"
        },
        {
          "cityId": "V0441800",
          "cityName": "清远市"
        },
        {
          "cityId": "V0441281",
          "cityName": "云浮市"
        },
        {
          "cityId": "V0445100",
          "cityName": "潮州市"
        },
        {
          "cityId": "V0441900",
          "cityName": "东莞市"
        },
        {
          "cityId": "V0420100",
          "cityName": "武汉市"
        },
        {
          "cityId": "V0420600",
          "cityName": "襄樊市"
        },
        {
          "cityId": "V0420700",
          "cityName": "鄂州市"
        },
        {
          "cityId": "V0420900",
          "cityName": "孝感市"
        },
        {
          "cityId": "V0422100",
          "cityName": "黄冈市"
        },
        {
          "cityId": "V0420200",
          "cityName": "黄石市"
        },
        {
          "cityId": "V0422300",
          "cityName": "咸宁市"
        },
        {
          "cityId": "V0422400",
          "cityName": "荆州市"
        },
        {
          "cityId": "V0420500",
          "cityName": "宜昌市"
        },
        {
          "cityId": "V0422800",
          "cityName": "恩施土家族苗族自治州"
        },
        {
          "cityId": "V0422600",
          "cityName": "十堰市"
        },
        {
          "cityId": "V0420681",
          "cityName": "随州市"
        },
        {
          "cityId": "V0420800",
          "cityName": "荆门市"
        },
        {
          "cityId": "V0422401",
          "cityName": "江汉市"
        },
        {
          "cityId": "V0533100",
          "cityName": "德宏傣族景颇族自治州"
        },
        {
          "cityId": "V0532600",
          "cityName": "文山壮族苗族自治州"
        },
        {
          "cityId": "V0533000",
          "cityName": "保山市"
        },
        {
          "cityId": "V0533500",
          "cityName": "临沧市"
        },
        {
          "cityId": "V0533300",
          "cityName": "怒江僳僳族自治州"
        },
        {
          "cityId": "V0533400",
          "cityName": "迪庆藏族普米族自治县"
        },
        {
          "cityId": "V0532100",
          "cityName": "昭通市"
        },
        {
          "cityId": "V0530100",
          "cityName": "昆明市"
        },
        {
          "cityId": "V0532500",
          "cityName": "红河哈尼族彝族自治州"
        },
        {
          "cityId": "V0532900",
          "cityName": "大理白族自治州"
        },
        {
          "cityId": "V0533200",
          "cityName": "丽江市"
        },
        {
          "cityId": "V0532300",
          "cityName": "楚雄彝族自治州"
        },
        {
          "cityId": "V0532400",
          "cityName": "玉溪市"
        },
        {
          "cityId": "V0532200",
          "cityName": "曲靖市"
        },
        {
          "cityId": "V0532800",
          "cityName": "西双版纳傣族自治州"
        },
        {
          "cityId": "V0533600",
          "cityName": "普洱市"
        },
        {
          "cityId": "V0622400",
          "cityName": "定西市"
        },
        {
          "cityId": "V0622700",
          "cityName": "平凉市"
        },
        {
          "cityId": "V0622800",
          "cityName": "庆阳市"
        },
        {
          "cityId": "V0622300",
          "cityName": "武威市"
        },
        {
          "cityId": "V0622201",
          "cityName": "张掖市"
        },
        {
          "cityId": "V0620200",
          "cityName": "嘉峪关市"
        },
        {
          "cityId": "V0620500",
          "cityName": "天水市"
        },
        {
          "cityId": "V0622901",
          "cityName": "临夏回族自治州"
        },
        {
          "cityId": "V0620400",
          "cityName": "白银市"
        },
        {
          "cityId": "V0620300",
          "cityName": "金昌市"
        },
        {
          "cityId": "V0622100",
          "cityName": "酒泉市"
        },
        {
          "cityId": "V0622600",
          "cityName": "陇南市"
        },
        {
          "cityId": "V0623000",
          "cityName": "甘南藏族自治州"
        },
        {
          "cityId": "V0620100",
          "cityName": "兰州市"
        },
        {
          "cityId": "V0520100",
          "cityName": "贵阳市"
        },
        {
          "cityId": "V0522100",
          "cityName": "遵义市"
        },
        {
          "cityId": "V0522500",
          "cityName": "安顺市"
        },
        {
          "cityId": "V0522200",
          "cityName": "铜仁市"
        },
        {
          "cityId": "V0522400",
          "cityName": "毕节市"
        },
        {
          "cityId": "V0520200",
          "cityName": "六盘水市"
        },
        {
          "cityId": "V0522900",
          "cityName": "黔西南布依族苗族自治州"
        },
        {
          "cityId": "V0523100",
          "cityName": "黔东南苗族侗族自治州"
        },
        {
          "cityId": "V0523200",
          "cityName": "黔南布依族苗族自治州"
        },
        {
          "cityId": "V0522800",
          "cityName": "贵安新区"
        },
        {
          "cityId": "V0330100",
          "cityName": "杭州市"
        },
        {
          "cityId": "V0330200",
          "cityName": "宁波市"
        },
        {
          "cityId": "V0330300",
          "cityName": "温州市"
        },
        {
          "cityId": "V0332600",
          "cityName": "台州市"
        },
        {
          "cityId": "V0330700",
          "cityName": "金华市"
        },
        {
          "cityId": "V0330400",
          "cityName": "嘉兴市"
        },
        {
          "cityId": "V0330600",
          "cityName": "绍兴市"
        },
        {
          "cityId": "V0330500",
          "cityName": "湖州市"
        },
        {
          "cityId": "V0332500",
          "cityName": "丽水市"
        },
        {
          "cityId": "V0330800",
          "cityName": "衢州市"
        },
        {
          "cityId": "V0330900",
          "cityName": "舟山市"
        },
        {
          "cityId": "V0320100",
          "cityName": "南京市"
        },
        {
          "cityId": "V0320500",
          "cityName": "苏州市"
        },
        {
          "cityId": "V0320200",
          "cityName": "无锡市"
        },
        {
          "cityId": "V0320400",
          "cityName": "常州市"
        },
        {
          "cityId": "V0321000",
          "cityName": "扬州市"
        },
        {
          "cityId": "V0321100",
          "cityName": "镇江市"
        },
        {
          "cityId": "V0320600",
          "cityName": "南通市"
        },
        {
          "cityId": "V0320300",
          "cityName": "徐州市"
        },
        {
          "cityId": "V0321082",
          "cityName": "泰州市"
        },
        {
          "cityId": "V0320900",
          "cityName": "盐城市"
        },
        {
          "cityId": "V0320800",
          "cityName": "淮安市"
        },
        {
          "cityId": "V0320700",
          "cityName": "连云港市"
        },
        {
          "cityId": "V0320881",
          "cityName": "宿迁市"
        },
        {
          "cityId": "V0630100",
          "cityName": "西宁市"
        },
        {
          "cityId": "V0632100",
          "cityName": "海东地区"
        },
        {
          "cityId": "V0632801",
          "cityName": "格尔木市"
        },
        {
          "cityId": "V0632200",
          "cityName": "海北藏族自治州"
        },
        {
          "cityId": "V0632500",
          "cityName": "海南藏族自治州"
        },
        {
          "cityId": "V0632800",
          "cityName": "海西蒙古族藏族自治州"
        },
        {
          "cityId": "V0632600",
          "cityName": "果洛藏族自治州"
        },
        {
          "cityId": "V0632700",
          "cityName": "玉树藏族自治州"
        },
        {
          "cityId": "V0632300",
          "cityName": "黄南藏族自治州"
        },
        {
          "cityId": "V0540100",
          "cityName": "拉萨市"
        },
        {
          "cityId": "V0542300",
          "cityName": "日喀则地区"
        },
        {
          "cityId": "V0542200",
          "cityName": "山南地区"
        },
        {
          "cityId": "V0542600",
          "cityName": "林芝地区"
        },
        {
          "cityId": "V0542100",
          "cityName": "昌都地区"
        },
        {
          "cityId": "V0542400",
          "cityName": "那曲地区"
        },
        {
          "cityId": "V0542500",
          "cityName": "阿里地区"
        },
        {
          "cityId": "V0430100",
          "cityName": "长沙市"
        },
        {
          "cityId": "V0430200",
          "cityName": "株洲市"
        },
        {
          "cityId": "V0430300",
          "cityName": "湘潭市"
        },
        {
          "cityId": "V0430400",
          "cityName": "衡阳市"
        },
        {
          "cityId": "V0430600",
          "cityName": "岳阳市"
        },
        {
          "cityId": "V0430900",
          "cityName": "益阳市"
        },
        {
          "cityId": "V0431000",
          "cityName": "郴州市"
        },
        {
          "cityId": "V0430700",
          "cityName": "常德市"
        },
        {
          "cityId": "V0432500",
          "cityName": "娄底市"
        },
        {
          "cityId": "V0430500",
          "cityName": "邵阳市"
        },
        {
          "cityId": "V0433100",
          "cityName": "湘西土家族苗族自治州"
        },
        {
          "cityId": "V0430800",
          "cityName": "张家界市"
        },
        {
          "cityId": "V0431200",
          "cityName": "怀化市"
        },
        {
          "cityId": "V0431100",
          "cityName": "永州市"
        },
        {
          "cityId": "V0350100",
          "cityName": "福州市"
        },
        {
          "cityId": "V0350200",
          "cityName": "厦门市"
        },
        {
          "cityId": "V0350500",
          "cityName": "泉州市"
        },
        {
          "cityId": "V0350600",
          "cityName": "漳州市"
        },
        {
          "cityId": "V0352200",
          "cityName": "宁德市"
        },
        {
          "cityId": "V0350300",
          "cityName": "莆田市"
        },
        {
          "cityId": "V0352100",
          "cityName": "南平市"
        },
        {
          "cityId": "V0350400",
          "cityName": "三明市"
        },
        {
          "cityId": "V0352600",
          "cityName": "龙岩市"
        },
        {
          "cityId": "V0510100",
          "cityName": "成都市"
        },
        {
          "cityId": "V0510300",
          "cityName": "自贡市"
        },
        {
          "cityId": "V0510400",
          "cityName": "攀枝花市"
        },
        {
          "cityId": "V0510500",
          "cityName": "泸州市"
        },
        {
          "cityId": "V0510600",
          "cityName": "德阳市"
        },
        {
          "cityId": "V0510700",
          "cityName": "绵阳市"
        },
        {
          "cityId": "V0510800",
          "cityName": "广元市"
        },
        {
          "cityId": "V0510900",
          "cityName": "遂宁市"
        },
        {
          "cityId": "V0511000",
          "cityName": "内江市"
        },
        {
          "cityId": "V0511100",
          "cityName": "乐山市"
        },
        {
          "cityId": "V0511300",
          "cityName": "南充市"
        },
        {
          "cityId": "V0513800",
          "cityName": "眉山市"
        },
        {
          "cityId": "V0512500",
          "cityName": "宜宾市"
        },
        {
          "cityId": "V0513600",
          "cityName": "广安市"
        },
        {
          "cityId": "V0513000",
          "cityName": "达州市"
        },
        {
          "cityId": "V0513100",
          "cityName": "雅安市"
        },
        {
          "cityId": "V0513700",
          "cityName": "巴中市"
        },
        {
          "cityId": "V0513900",
          "cityName": "资阳市"
        },
        {
          "cityId": "V0513200",
          "cityName": "阿坝藏族羌族自治州"
        },
        {
          "cityId": "V0513300",
          "cityName": "甘孜藏族自治州"
        },
        {
          "cityId": "V0513400",
          "cityName": "凉山彝族自治州"
        },
        {
          "cityId": "V0650100",
          "cityName": "乌鲁木齐市"
        },
        {
          "cityId": "V0650200",
          "cityName": "克拉玛依市"
        },
        {
          "cityId": "V0652101",
          "cityName": "吐鲁番地区"
        },
        {
          "cityId": "V0652201",
          "cityName": "哈密地区"
        },
        {
          "cityId": "V0652301",
          "cityName": "昌吉回族自治州"
        },
        {
          "cityId": "V0650300",
          "cityName": "博尔塔拉蒙古自治州"
        },
        {
          "cityId": "V0650500",
          "cityName": "巴音郭楞蒙古自治州"
        },
        {
          "cityId": "V0652901",
          "cityName": "阿克苏地区"
        },
        {
          "cityId": "V0650600",
          "cityName": "克孜勒苏柯尔克孜自治州"
        },
        {
          "cityId": "V0653101",
          "cityName": "喀什地区"
        },
        {
          "cityId": "V0653201",
          "cityName": "和田地区"
        },
        {
          "cityId": "V0654001",
          "cityName": "奎屯市"
        },
        {
          "cityId": "V0650400",
          "cityName": "伊犁哈萨克自治州"
        },
        {
          "cityId": "V0654201",
          "cityName": "塔城市"
        },
        {
          "cityId": "V0654301",
          "cityName": "阿勒泰地区"
        },
        {
          "cityId": "V0659001",
          "cityName": "石河子市"
        },
        {
          "cityId": "V0360100",
          "cityName": "南昌市"
        },
        {
          "cityId": "V0360400",
          "cityName": "九江市"
        },
        {
          "cityId": "V0362233",
          "cityName": "上饶市"
        },
        {
          "cityId": "V0362500",
          "cityName": "抚州市"
        },
        {
          "cityId": "V0362200",
          "cityName": "宜春市"
        },
        {
          "cityId": "V0362400",
          "cityName": "吉安市"
        },
        {
          "cityId": "V0362100",
          "cityName": "赣州市"
        },
        {
          "cityId": "V0360200",
          "cityName": "景德镇市"
        },
        {
          "cityId": "V0360300",
          "cityName": "萍乡市"
        },
        {
          "cityId": "V0360500",
          "cityName": "新余市"
        },
        {
          "cityId": "V0360600",
          "cityName": "鹰潭市"
        },
        {
          "cityId": "V0340500",
          "cityName": "马鞍山市"
        },
        {
          "cityId": "V0340300",
          "cityName": "蚌埠市"
        },
        {
          "cityId": "V0340800",
          "cityName": "安庆市"
        },
        {
          "cityId": "V0340200",
          "cityName": "芜湖市"
        },
        {
          "cityId": "V0342400",
          "cityName": "六安市"
        },
        {
          "cityId": "V0340100",
          "cityName": "合肥市"
        },
        {
          "cityId": "V0342100",
          "cityName": "阜阳市"
        },
        {
          "cityId": "V0340400",
          "cityName": "淮南市"
        },
        {
          "cityId": "V0340700",
          "cityName": "铜陵市"
        },
        {
          "cityId": "V0342500",
          "cityName": "宣州市"
        },
        {
          "cityId": "V0341100",
          "cityName": "滁州市"
        },
        {
          "cityId": "V0342200",
          "cityName": "宿州市"
        },
        {
          "cityId": "V0340600",
          "cityName": "淮北市"
        },
        {
          "cityId": "V0341000",
          "cityName": "黄山市"
        },
        {
          "cityId": "V0342900",
          "cityName": "池州市"
        },
        {
          "cityId": "V0343000",
          "cityName": "亳州市"
        },
        {
          "cityId": "V0640100",
          "cityName": "银川市"
        },
        {
          "cityId": "V0642100",
          "cityName": "吴忠市"
        },
        {
          "cityId": "V0640200",
          "cityName": "石嘴山市"
        },
        {
          "cityId": "V0642200",
          "cityName": "固原市"
        },
        {
          "cityId": "V0642300",
          "cityName": "中卫市"
        },
        {
          "cityId": "V0610300",
          "cityName": "宝鸡市"
        },
        {
          "cityId": "V0610100",
          "cityName": "西安市"
        },
        {
          "cityId": "V0612601",
          "cityName": "延安市"
        },
        {
          "cityId": "V0612101",
          "cityName": "渭南市"
        },
        {
          "cityId": "V0610400",
          "cityName": "咸阳市"
        },
        {
          "cityId": "V0612701",
          "cityName": "榆林市"
        },
        {
          "cityId": "V0610200",
          "cityName": "铜川市"
        },
        {
          "cityId": "V0612501",
          "cityName": "商洛市"
        },
        {
          "cityId": "V0612401",
          "cityName": "安康市"
        },
        {
          "cityId": "V0612301",
          "cityName": "汉中市"
        },
        {
          "cityId": "V0450100",
          "cityName": "南宁市"
        },
        {
          "cityId": "V0450300",
          "cityName": "桂林市"
        },
        {
          "cityId": "V0450200",
          "cityName": "柳州市"
        },
        {
          "cityId": "V0450400",
          "cityName": "梧州市"
        },
        {
          "cityId": "V0452500",
          "cityName": "玉林市"
        },
        {
          "cityId": "V0452600",
          "cityName": "百色市"
        },
        {
          "cityId": "V0452800",
          "cityName": "钦州市"
        },
        {
          "cityId": "V0452700",
          "cityName": "河池市"
        },
        {
          "cityId": "V0450500",
          "cityName": "北海市"
        },
        {
          "cityId": "V0453200",
          "cityName": "崇左市"
        },
        {
          "cityId": "V0453000",
          "cityName": "贺州市"
        },
        {
          "cityId": "V0452900",
          "cityName": "贵港市"
        },
        {
          "cityId": "V0450600",
          "cityName": "防城港市"
        },
        {
          "cityId": "V0453100",
          "cityName": "来宾市"
        }
      ]
    },
    {
      "proId": "011",
      "proName": "北京",
      "city":[
        {
          "cityId": "V0110000",
          "cityName": "北京市"
        }
      ]
    },
    {
      "proId": "013",
      "proName": "天津",
      "city":[
        {
          "cityId": "V0120000",
          "cityName": "天津市"
        }
      ]
    },
    {
      "proId": "018",
      "proName": "河北",
      "city":[
        {
          "cityId": "V0130400",
          "cityName": "邯郸市"
        },
        {
          "cityId": "V0130600",
          "cityName": "保定市"
        },
        {
          "cityId": "V0130700",
          "cityName": "张家口市"
        },
        {
          "cityId": "V0130200",
          "cityName": "唐山市"
        },
        {
          "cityId": "V0130900",
          "cityName": "沧州市"
        },
        {
          "cityId": "V0130500",
          "cityName": "邢台市"
        },
        {
          "cityId": "V0130300",
          "cityName": "秦皇岛市"
        },
        {
          "cityId": "V0130100",
          "cityName": "石家庄市"
        },
        {
          "cityId": "V0130800",
          "cityName": "承德市"
        },
        {
          "cityId": "V0131000",
          "cityName": "廊坊市"
        },
        {
          "cityId": "V0133000",
          "cityName": "衡水市"
        },
        {
          "cityId": "V0132000",
          "cityName": "雄安新区"
        }
      ]
    },
    {
      "proId": "019",
      "proName": "山西",
      "city":[
        {
          "cityId": "V0140600",
          "cityName": "朔州市"
        },
        {
          "cityId": "V0142200",
          "cityName": "忻州市"
        },
        {
          "cityId": "V0140100",
          "cityName": "太原市"
        },
        {
          "cityId": "V0140200",
          "cityName": "大同市"
        },
        {
          "cityId": "V0140300",
          "cityName": "阳泉市"
        },
        {
          "cityId": "V0142400",
          "cityName": "晋中市 "
        },
        {
          "cityId": "V0140400",
          "cityName": "长治市"
        },
        {
          "cityId": "V0140500",
          "cityName": "晋城市"
        },
        {
          "cityId": "V0142600",
          "cityName": "临汾市"
        },
        {
          "cityId": "V0142300",
          "cityName": "吕梁市"
        },
        {
          "cityId": "V0142700",
          "cityName": "运城市"
        }
      ]
    },
    {
      "proId": "010",
      "proName": "内蒙古",
      "city":[
        {
          "cityId": "V0150100",
          "cityName": "呼和浩特市"
        },
        {
          "cityId": "V0150200",
          "cityName": "包头市"
        },
        {
          "cityId": "V0150300",
          "cityName": "乌海市"
        },
        {
          "cityId": "V0150400",
          "cityName": "赤峰市"
        },
        {
          "cityId": "V0152200",
          "cityName": "兴安盟"
        },
        {
          "cityId": "V0152301",
          "cityName": "通辽市"
        },
        {
          "cityId": "V0152500",
          "cityName": "锡林郭勒盟"
        },
        {
          "cityId": "V0152600",
          "cityName": "乌兰察布市"
        },
        {
          "cityId": "V0152700",
          "cityName": "鄂尔多斯市"
        },
        {
          "cityId": "V0152800",
          "cityName": "巴彦淖尔市"
        },
        {
          "cityId": "V0152900",
          "cityName": "阿拉善盟"
        },
        {
          "cityId": "V0152302",
          "cityName": "呼伦贝尔市"
        }
      ]
    },
    {
      "proId": "091",
      "proName": "辽宁",
      "city":[
        {
          "cityId": "V0210100",
          "cityName": "沈阳市"
        },
        {
          "cityId": "V0210200",
          "cityName": "大连市"
        },
        {
          "cityId": "V0210300",
          "cityName": "鞍山市"
        },
        {
          "cityId": "V0210400",
          "cityName": "抚顺市"
        },
        {
          "cityId": "V0210500",
          "cityName": "本溪市"
        },
        {
          "cityId": "V0210600",
          "cityName": "丹东市"
        },
        {
          "cityId": "V0210700",
          "cityName": "锦州市"
        },
        {
          "cityId": "V0210800",
          "cityName": "营口市"
        },
        {
          "cityId": "V0210900",
          "cityName": "阜新市"
        },
        {
          "cityId": "V0211000",
          "cityName": "辽阳市"
        },
        {
          "cityId": "V0211200",
          "cityName": "铁岭市"
        },
        {
          "cityId": "V0211300",
          "cityName": "朝阳市"
        },
        {
          "cityId": "V0211100",
          "cityName": "盘锦市"
        },
        {
          "cityId": "V0211400",
          "cityName": "葫芦岛市"
        }
      ]
    },
    {
      "proId": "090",
      "proName": "吉林",
      "city":[
        {
          "cityId": "V0220100",
          "cityName": "长春市"
        },
        {
          "cityId": "V0220200",
          "cityName": "吉林市"
        },
        {
          "cityId": "V0222400",
          "cityName": "延边朝鲜族自治州"
        },
        {
          "cityId": "V0220300",
          "cityName": "四平市"
        },
        {
          "cityId": "V0220500",
          "cityName": "通化市"
        },
        {
          "cityId": "V0220800",
          "cityName": "白城市"
        },
        {
          "cityId": "V0220400",
          "cityName": "辽源市"
        },
        {
          "cityId": "V0220700",
          "cityName": "松原市"
        },
        {
          "cityId": "V0220600",
          "cityName": "白山市"
        }
      ]
    },
    {
      "proId": "097",
      "proName": "黑龙江",
      "city":[
        {
          "cityId": "V0230100",
          "cityName": "哈尔滨市"
        },
        {
          "cityId": "V0230200",
          "cityName": "齐齐哈尔市"
        },
        {
          "cityId": "V0231000",
          "cityName": "牡丹江市"
        },
        {
          "cityId": "V0230800",
          "cityName": "佳木斯市"
        },
        {
          "cityId": "V0232300",
          "cityName": "绥化市"
        },
        {
          "cityId": "V0230600",
          "cityName": "大庆市"
        },
        {
          "cityId": "V0230300",
          "cityName": "鸡西市"
        },
        {
          "cityId": "V0231100",
          "cityName": "黑河市"
        },
        {
          "cityId": "V0230700",
          "cityName": "伊春市"
        },
        {
          "cityId": "V0230500",
          "cityName": "双鸭山市"
        },
        {
          "cityId": "V0230400",
          "cityName": "鹤岗市"
        },
        {
          "cityId": "V0230900",
          "cityName": "七台河市"
        },
        {
          "cityId": "V0232700",
          "cityName": "大兴安岭地区"
        }
      ]
    },
    {
      "proId": "017",
      "proName": "山东",
      "city":[
        {
          "cityId": "V0370100",
          "cityName": "济南市"
        },
        {
          "cityId": "V0370200",
          "cityName": "青岛市"
        },
        {
          "cityId": "V0370300",
          "cityName": "淄博市"
        },
        {
          "cityId": "V0370400",
          "cityName": "枣庄市"
        },
        {
          "cityId": "V0370500",
          "cityName": "东营市"
        },
        {
          "cityId": "V0370600",
          "cityName": "烟台市"
        },
        {
          "cityId": "V0370700",
          "cityName": "潍坊市"
        },
        {
          "cityId": "V0370800",
          "cityName": "济宁市"
        },
        {
          "cityId": "V0370900",
          "cityName": "泰安市"
        },
        {
          "cityId": "V0371000",
          "cityName": "威海市"
        },
        {
          "cityId": "V0371100",
          "cityName": "日照市"
        },
        {
          "cityId": "V0371200",
          "cityName": "莱芜市"
        },
        {
          "cityId": "V0372801",
          "cityName": "临沂市"
        },
        {
          "cityId": "V0372401",
          "cityName": "德州市"
        },
        {
          "cityId": "V0372500",
          "cityName": "聊城市"
        },
        {
          "cityId": "V0372300",
          "cityName": "滨州市"
        },
        {
          "cityId": "V0372900",
          "cityName": "菏泽市"
        }
      ]
    },
    {
      "proId": "076",
      "proName": "河南",
      "city":[
        {
          "cityId": "V0410100",
          "cityName": "郑州市"
        },
        {
          "cityId": "V0410200",
          "cityName": "开封市"
        },
        {
          "cityId": "V0410300",
          "cityName": "洛阳市"
        },
        {
          "cityId": "V0410400",
          "cityName": "平顶山市"
        },
        {
          "cityId": "V0410500",
          "cityName": "安阳市"
        },
        {
          "cityId": "V0410600",
          "cityName": "鹤壁市"
        },
        {
          "cityId": "V0410700",
          "cityName": "新乡市"
        },
        {
          "cityId": "V0410800",
          "cityName": "焦作市"
        },
        {
          "cityId": "V0410900",
          "cityName": "濮阳市"
        },
        {
          "cityId": "V0411000",
          "cityName": "许昌市"
        },
        {
          "cityId": "V0411100",
          "cityName": "漯河市"
        },
        {
          "cityId": "V0411200",
          "cityName": "三门峡市"
        },
        {
          "cityId": "V0412300",
          "cityName": "商丘市"
        },
        {
          "cityId": "V0412700",
          "cityName": "周口市"
        },
        {
          "cityId": "V0412801",
          "cityName": "驻马店市"
        },
        {
          "cityId": "V0412901",
          "cityName": "南阳市"
        },
        {
          "cityId": "V0413000",
          "cityName": "信阳市"
        },
        {
          "cityId": "V0412800",
          "cityName": "济源市"
        }
      ]
    },
    {
      "proId": "031",
      "proName": "上海",
      "city":[
        {
          "cityId": "V0310000",
          "cityName": "上海市"
        }
      ]
    },
    {
      "proId": "034",
      "proName": "江苏",
      "city":[
        {
          "cityId": "V0320100",
          "cityName": "南京市"
        },
        {
          "cityId": "V0320500",
          "cityName": "苏州市"
        },
        {
          "cityId": "V0320200",
          "cityName": "无锡市"
        },
        {
          "cityId": "V0320400",
          "cityName": "常州市"
        },
        {
          "cityId": "V0321000",
          "cityName": "扬州市"
        },
        {
          "cityId": "V0321100",
          "cityName": "镇江市"
        },
        {
          "cityId": "V0320600",
          "cityName": "南通市"
        },
        {
          "cityId": "V0320300",
          "cityName": "徐州市"
        },
        {
          "cityId": "V0321082",
          "cityName": "泰州市"
        },
        {
          "cityId": "V0320900",
          "cityName": "盐城市"
        },
        {
          "cityId": "V0320800",
          "cityName": "淮安市"
        },
        {
          "cityId": "V0320700",
          "cityName": "连云港市"
        },
        {
          "cityId": "V0320881",
          "cityName": "宿迁市"
        }
      ]
    },
    {
      "proId": "036",
      "proName": "浙江",
      "city":[
        {
          "cityId": "V0330100",
          "cityName": "杭州市"
        },
        {
          "cityId": "V0330200",
          "cityName": "宁波市"
        },
        {
          "cityId": "V0330300",
          "cityName": "温州市"
        },
        {
          "cityId": "V0332600",
          "cityName": "台州市"
        },
        {
          "cityId": "V0330700",
          "cityName": "金华市"
        },
        {
          "cityId": "V0330400",
          "cityName": "嘉兴市"
        },
        {
          "cityId": "V0330600",
          "cityName": "绍兴市"
        },
        {
          "cityId": "V0330500",
          "cityName": "湖州市"
        },
        {
          "cityId": "V0332500",
          "cityName": "丽水市"
        },
        {
          "cityId": "V0330800",
          "cityName": "衢州市"
        },
        {
          "cityId": "V0330900",
          "cityName": "舟山市"
        }
      ]
    },
    {
      "proId": "030",
      "proName": "安徽",
      "city":[
        {
          "cityId": "V0340500",
          "cityName": "马鞍山市"
        },
        {
          "cityId": "V0340300",
          "cityName": "蚌埠市"
        },
        {
          "cityId": "V0340800",
          "cityName": "安庆市"
        },
        {
          "cityId": "V0340200",
          "cityName": "芜湖市"
        },
        {
          "cityId": "V0342400",
          "cityName": "六安市"
        },
        {
          "cityId": "V0340100",
          "cityName": "合肥市"
        },
        {
          "cityId": "V0342100",
          "cityName": "阜阳市"
        },
        {
          "cityId": "V0340400",
          "cityName": "淮南市"
        },
        {
          "cityId": "V0340700",
          "cityName": "铜陵市"
        },
        {
          "cityId": "V0342500",
          "cityName": "宣州市"
        },
        {
          "cityId": "V0341100",
          "cityName": "滁州市"
        },
        {
          "cityId": "V0342200",
          "cityName": "宿州市"
        },
        {
          "cityId": "V0340600",
          "cityName": "淮北市"
        },
        {
          "cityId": "V0341000",
          "cityName": "黄山市"
        },
        {
          "cityId": "V0342900",
          "cityName": "池州市"
        },
        {
          "cityId": "V0343000",
          "cityName": "亳州市"
        }
      ]
    },
    {
      "proId": "038",
      "proName": "福建",
      "city":[
        {
          "cityId": "V0350100",
          "cityName": "福州市"
        },
        {
          "cityId": "V0350200",
          "cityName": "厦门市"
        },
        {
          "cityId": "V0350500",
          "cityName": "泉州市"
        },
        {
          "cityId": "V0350600",
          "cityName": "漳州市"
        },
        {
          "cityId": "V0352200",
          "cityName": "宁德市"
        },
        {
          "cityId": "V0350300",
          "cityName": "莆田市"
        },
        {
          "cityId": "V0352100",
          "cityName": "南平市"
        },
        {
          "cityId": "V0350400",
          "cityName": "三明市"
        },
        {
          "cityId": "V0352600",
          "cityName": "龙岩市"
        }
      ]
    },
    {
      "proId": "075",
      "proName": "江西",
      "city":[
        {
          "cityId": "V0360100",
          "cityName": "南昌市"
        },
        {
          "cityId": "V0360400",
          "cityName": "九江市"
        },
        {
          "cityId": "V0362233",
          "cityName": "上饶市"
        },
        {
          "cityId": "V0362500",
          "cityName": "抚州市"
        },
        {
          "cityId": "V0362200",
          "cityName": "宜春市"
        },
        {
          "cityId": "V0362400",
          "cityName": "吉安市"
        },
        {
          "cityId": "V0362100",
          "cityName": "赣州市"
        },
        {
          "cityId": "V0360200",
          "cityName": "景德镇市"
        },
        {
          "cityId": "V0360300",
          "cityName": "萍乡市"
        },
        {
          "cityId": "V0360500",
          "cityName": "新余市"
        },
        {
          "cityId": "V0360600",
          "cityName": "鹰潭市"
        }
      ]
    },
    {
      "proId": "071",
      "proName": "湖北",
      "city":[
        {
          "cityId": "V0420100",
          "cityName": "武汉市"
        },
        {
          "cityId": "V0420600",
          "cityName": "襄樊市"
        },
        {
          "cityId": "V0420700",
          "cityName": "鄂州市"
        },
        {
          "cityId": "V0420900",
          "cityName": "孝感市"
        },
        {
          "cityId": "V0422100",
          "cityName": "黄冈市"
        },
        {
          "cityId": "V0420200",
          "cityName": "黄石市"
        },
        {
          "cityId": "V0422300",
          "cityName": "咸宁市"
        },
        {
          "cityId": "V0422400",
          "cityName": "荆州市"
        },
        {
          "cityId": "V0420500",
          "cityName": "宜昌市"
        },
        {
          "cityId": "V0422800",
          "cityName": "恩施土家族苗族自治州"
        },
        {
          "cityId": "V0422600",
          "cityName": "十堰市"
        },
        {
          "cityId": "V0420681",
          "cityName": "随州市"
        },
        {
          "cityId": "V0420800",
          "cityName": "荆门市"
        },
        {
          "cityId": "V0422401",
          "cityName": "江汉市"
        }
      ]
    },
    {
      "proId": "074",
      "proName": "湖南",
      "city":[
        {
          "cityId": "V0430100",
          "cityName": "长沙市"
        },
        {
          "cityId": "V0430200",
          "cityName": "株洲市"
        },
        {
          "cityId": "V0430300",
          "cityName": "湘潭市"
        },
        {
          "cityId": "V0430400",
          "cityName": "衡阳市"
        },
        {
          "cityId": "V0430600",
          "cityName": "岳阳市"
        },
        {
          "cityId": "V0430900",
          "cityName": "益阳市"
        },
        {
          "cityId": "V0431000",
          "cityName": "郴州市"
        },
        {
          "cityId": "V0430700",
          "cityName": "常德市"
        },
        {
          "cityId": "V0432500",
          "cityName": "娄底市"
        },
        {
          "cityId": "V0430500",
          "cityName": "邵阳市"
        },
        {
          "cityId": "V0433100",
          "cityName": "湘西土家族苗族自治州"
        },
        {
          "cityId": "V0430800",
          "cityName": "张家界市"
        },
        {
          "cityId": "V0431200",
          "cityName": "怀化市"
        },
        {
          "cityId": "V0431100",
          "cityName": "永州市"
        }
      ]
    },
    {
      "proId": "051",
      "proName": "广东",
      "city":[
        {
          "cityId": "V0440100",
          "cityName": "广州市"
        },
        {
          "cityId": "V0441500",
          "cityName": "汕尾市"
        },
        {
          "cityId": "V0441700",
          "cityName": "阳江市"
        },
        {
          "cityId": "V0445201",
          "cityName": "揭阳市"
        },
        {
          "cityId": "V0440901",
          "cityName": "茂名市"
        },
        {
          "cityId": "V0440700",
          "cityName": "江门市"
        },
        {
          "cityId": "V0440201",
          "cityName": "韶关市"
        },
        {
          "cityId": "V0441300",
          "cityName": "惠州市"
        },
        {
          "cityId": "V0441401",
          "cityName": "梅州市"
        },
        {
          "cityId": "V0440510",
          "cityName": "汕头市"
        },
        {
          "cityId": "V0440300",
          "cityName": "深圳市"
        },
        {
          "cityId": "V0440400",
          "cityName": "珠海市"
        },
        {
          "cityId": "V0440600",
          "cityName": "佛山市"
        },
        {
          "cityId": "V0441201",
          "cityName": "肇庆市"
        },
        {
          "cityId": "V0440800",
          "cityName": "湛江市"
        },
        {
          "cityId": "V0442000",
          "cityName": "中山市"
        },
        {
          "cityId": "V0441600",
          "cityName": "河源市"
        },
        {
          "cityId": "V0441800",
          "cityName": "清远市"
        },
        {
          "cityId": "V0441281",
          "cityName": "云浮市"
        },
        {
          "cityId": "V0445100",
          "cityName": "潮州市"
        },
        {
          "cityId": "V0441900",
          "cityName": "东莞市"
        }
      ]
    },
    {
      "proId": "059",
      "proName": "广西",
      "city":[
        {
          "cityId": "V0450100",
          "cityName": "南宁市"
        },
        {
          "cityId": "V0450300",
          "cityName": "桂林市"
        },
        {
          "cityId": "V0450200",
          "cityName": "柳州市"
        },
        {
          "cityId": "V0450400",
          "cityName": "梧州市"
        },
        {
          "cityId": "V0452500",
          "cityName": "玉林市"
        },
        {
          "cityId": "V0452600",
          "cityName": "百色市"
        },
        {
          "cityId": "V0452800",
          "cityName": "钦州市"
        },
        {
          "cityId": "V0452700",
          "cityName": "河池市"
        },
        {
          "cityId": "V0450500",
          "cityName": "北海市"
        },
        {
          "cityId": "V0453200",
          "cityName": "崇左市"
        },
        {
          "cityId": "V0453000",
          "cityName": "贺州市"
        },
        {
          "cityId": "V0452900",
          "cityName": "贵港市"
        },
        {
          "cityId": "V0450600",
          "cityName": "防城港市"
        },
        {
          "cityId": "V0453100",
          "cityName": "来宾市"
        }
      ]
    },
    {
      "proId": "050",
      "proName": "海南",
      "city":[
        {
          "cityId": "V0460100",
          "cityName": "海口市"
        },
        {
          "cityId": "V0460200",
          "cityName": "三亚市"
        },
        {
          "cityId": "V04602003",
          "cityName": "保亭黎族苗族自治县"
        },
        {
          "cityId": "V04601006",
          "cityName": "澄迈县"
        },
        {
          "cityId": "V04601003",
          "cityName": "文昌市"
        },
        {
          "cityId": "V04600032",
          "cityName": "临高县"
        },
        {
          "cityId": "V04602004",
          "cityName": "五指山市"
        },
        {
          "cityId": "V04600033",
          "cityName": "昌江黎族自治县"
        },
        {
          "cityId": "V0460003",
          "cityName": "儋州市"
        },
        {
          "cityId": "V04602002",
          "cityName": "陵水黎族自治县"
        },
        {
          "cityId": "V04601008",
          "cityName": "琼中黎族苗族自治县"
        },
        {
          "cityId": "V04601007",
          "cityName": "屯昌县"
        },
        {
          "cityId": "V04601004",
          "cityName": "万宁市"
        },
        {
          "cityId": "V04601005",
          "cityName": "定安县"
        },
        {
          "cityId": "V04602001",
          "cityName": "乐东黎族自治县"
        },
        {
          "cityId": "V04601002",
          "cityName": "琼海市"
        },
        {
          "cityId": "V04600031",
          "cityName": "东方市"
        },
        {
          "cityId": "V04600034",
          "cityName": "白沙黎族自治县"
        }
      ]
    },
    {
      "proId": "083",
      "proName": "重庆",
      "city":[
        {
          "cityId": "V0500000",
          "cityName": "重庆市"
        }
      ]
    },
    {
      "proId": "081",
      "proName": "四川",
      "city":[
        {
          "cityId": "V0510100",
          "cityName": "成都市"
        },
        {
          "cityId": "V0510300",
          "cityName": "自贡市"
        },
        {
          "cityId": "V0510400",
          "cityName": "攀枝花市"
        },
        {
          "cityId": "V0510500",
          "cityName": "泸州市"
        },
        {
          "cityId": "V0510600",
          "cityName": "德阳市"
        },
        {
          "cityId": "V0510700",
          "cityName": "绵阳市"
        },
        {
          "cityId": "V0510800",
          "cityName": "广元市"
        },
        {
          "cityId": "V0510900",
          "cityName": "遂宁市"
        },
        {
          "cityId": "V0511000",
          "cityName": "内江市"
        },
        {
          "cityId": "V0511100",
          "cityName": "乐山市"
        },
        {
          "cityId": "V0511300",
          "cityName": "南充市"
        },
        {
          "cityId": "V0513800",
          "cityName": "眉山市"
        },
        {
          "cityId": "V0512500",
          "cityName": "宜宾市"
        },
        {
          "cityId": "V0513600",
          "cityName": "广安市"
        },
        {
          "cityId": "V0513000",
          "cityName": "达州市"
        },
        {
          "cityId": "V0513100",
          "cityName": "雅安市"
        },
        {
          "cityId": "V0513700",
          "cityName": "巴中市"
        },
        {
          "cityId": "V0513900",
          "cityName": "资阳市"
        },
        {
          "cityId": "V0513200",
          "cityName": "阿坝藏族羌族自治州"
        },
        {
          "cityId": "V0513300",
          "cityName": "甘孜藏族自治州"
        },
        {
          "cityId": "V0513400",
          "cityName": "凉山彝族自治州"
        }
      ]
    },
    {
      "proId": "085",
      "proName": "贵州",
      "city":[
        {
          "cityId": "V0520100",
          "cityName": "贵阳市"
        },
        {
          "cityId": "V0522100",
          "cityName": "遵义市"
        },
        {
          "cityId": "V0522500",
          "cityName": "安顺市"
        },
        {
          "cityId": "V0522200",
          "cityName": "铜仁市"
        },
        {
          "cityId": "V0522400",
          "cityName": "毕节市"
        },
        {
          "cityId": "V0520200",
          "cityName": "六盘水市"
        },
        {
          "cityId": "V0522900",
          "cityName": "黔西南布依族苗族自治州"
        },
        {
          "cityId": "V0523100",
          "cityName": "黔东南苗族侗族自治州"
        },
        {
          "cityId": "V0523200",
          "cityName": "黔南布依族苗族自治州"
        },
        {
          "cityId": "V0522800",
          "cityName": "贵安新区"
        }
      ]
    },
    {
      "proId": "086",
      "proName": "云南",
      "city":[
        {
          "cityId": "V0533100",
          "cityName": "德宏傣族景颇族自治州"
        },
        {
          "cityId": "V0532600",
          "cityName": "文山壮族苗族自治州"
        },
        {
          "cityId": "V0533000",
          "cityName": "保山市"
        },
        {
          "cityId": "V0533500",
          "cityName": "临沧市"
        },
        {
          "cityId": "V0533300",
          "cityName": "怒江僳僳族自治州"
        },
        {
          "cityId": "V0533400",
          "cityName": "迪庆藏族普米族自治县"
        },
        {
          "cityId": "V0532100",
          "cityName": "昭通市"
        },
        {
          "cityId": "V0530100",
          "cityName": "昆明市"
        },
        {
          "cityId": "V0532500",
          "cityName": "红河哈尼族彝族自治州"
        },
        {
          "cityId": "V0532900",
          "cityName": "大理白族自治州"
        },
        {
          "cityId": "V0533200",
          "cityName": "丽江市"
        },
        {
          "cityId": "V0532300",
          "cityName": "楚雄彝族自治州"
        },
        {
          "cityId": "V0532400",
          "cityName": "玉溪市"
        },
        {
          "cityId": "V0532200",
          "cityName": "曲靖市"
        },
        {
          "cityId": "V0532800",
          "cityName": "西双版纳傣族自治州"
        },
        {
          "cityId": "V0533600",
          "cityName": "普洱市"
        }
      ]
    },
    {
      "proId": "079",
      "proName": "西藏",
      "city":[
        {
          "cityId": "V0540100",
          "cityName": "拉萨市"
        },
        {
          "cityId": "V0542300",
          "cityName": "日喀则地区"
        },
        {
          "cityId": "V0542200",
          "cityName": "山南地区"
        },
        {
          "cityId": "V0542600",
          "cityName": "林芝地区"
        },
        {
          "cityId": "V0542100",
          "cityName": "昌都地区"
        },
        {
          "cityId": "V0542400",
          "cityName": "那曲地区"
        },
        {
          "cityId": "V0542500",
          "cityName": "阿里地区"
        }
      ]
    },
    {
      "proId": "084",
      "proName": "陕西",
      "city":[
        {
          "cityId": "V0610300",
          "cityName": "宝鸡市"
        },
        {
          "cityId": "V0610100",
          "cityName": "西安市"
        },
        {
          "cityId": "V0612601",
          "cityName": "延安市"
        },
        {
          "cityId": "V0612101",
          "cityName": "渭南市"
        },
        {
          "cityId": "V0610400",
          "cityName": "咸阳市"
        },
        {
          "cityId": "V0612701",
          "cityName": "榆林市"
        },
        {
          "cityId": "V0610200",
          "cityName": "铜川市"
        },
        {
          "cityId": "V0612501",
          "cityName": "商洛市"
        },
        {
          "cityId": "V0612401",
          "cityName": "安康市"
        },
        {
          "cityId": "V0612301",
          "cityName": "汉中市"
        }
      ]
    },
    {
      "proId": "087",
      "proName": "甘肃",
      "city":[
        {
          "cityId": "V0622400",
          "cityName": "定西市"
        },
        {
          "cityId": "V0622700",
          "cityName": "平凉市"
        },
        {
          "cityId": "V0622800",
          "cityName": "庆阳市"
        },
        {
          "cityId": "V0622300",
          "cityName": "武威市"
        },
        {
          "cityId": "V0622201",
          "cityName": "张掖市"
        },
        {
          "cityId": "V0620200",
          "cityName": "嘉峪关市"
        },
        {
          "cityId": "V0620500",
          "cityName": "天水市"
        },
        {
          "cityId": "V0622901",
          "cityName": "临夏回族自治州"
        },
        {
          "cityId": "V0620400",
          "cityName": "白银市"
        },
        {
          "cityId": "V0620300",
          "cityName": "金昌市"
        },
        {
          "cityId": "V0622100",
          "cityName": "酒泉市"
        },
        {
          "cityId": "V0622600",
          "cityName": "陇南市"
        },
        {
          "cityId": "V0623000",
          "cityName": "甘南藏族自治州"
        },
        {
          "cityId": "V0620100",
          "cityName": "兰州市"
        }
      ]
    },
    {
      "proId": "070",
      "proName": "青海",
      "city":[
        {
          "cityId": "V0630100",
          "cityName": "西宁市"
        },
        {
          "cityId": "V0632100",
          "cityName": "海东地区"
        },
        {
          "cityId": "V0632801",
          "cityName": "格尔木市"
        },
        {
          "cityId": "V0632200",
          "cityName": "海北藏族自治州"
        },
        {
          "cityId": "V0632500",
          "cityName": "海南藏族自治州"
        },
        {
          "cityId": "V0632800",
          "cityName": "海西蒙古族藏族自治州"
        },
        {
          "cityId": "V0632600",
          "cityName": "果洛藏族自治州"
        },
        {
          "cityId": "V0632700",
          "cityName": "玉树藏族自治州"
        },
        {
          "cityId": "V0632300",
          "cityName": "黄南藏族自治州"
        }
      ]
    },
    {
      "proId": "088",
      "proName": "宁夏",
      "city":[
        {
          "cityId": "V0640100",
          "cityName": "银川市"
        },
        {
          "cityId": "V0642100",
          "cityName": "吴忠市"
        },
        {
          "cityId": "V0640200",
          "cityName": "石嘴山市"
        },
        {
          "cityId": "V0642200",
          "cityName": "固原市"
        },
        {
          "cityId": "V0642300",
          "cityName": "中卫市"
        }
      ]
    },
    {
      "proId": "089",
      "proName": "新疆",
      "city":[
        {
          "cityId": "V0650100",
          "cityName": "乌鲁木齐市"
        },
        {
          "cityId": "V0650200",
          "cityName": "克拉玛依市"
        },
        {
          "cityId": "V0652101",
          "cityName": "吐鲁番地区"
        },
        {
          "cityId": "V0652201",
          "cityName": "哈密地区"
        },
        {
          "cityId": "V0652301",
          "cityName": "昌吉回族自治州"
        },
        {
          "cityId": "V0650300",
          "cityName": "博尔塔拉蒙古自治州"
        },
        {
          "cityId": "V0650500",
          "cityName": "巴音郭楞蒙古自治州"
        },
        {
          "cityId": "V0652901",
          "cityName": "阿克苏地区"
        },
        {
          "cityId": "V0650600",
          "cityName": "克孜勒苏柯尔克孜自治州"
        },
        {
          "cityId": "V0653101",
          "cityName": "喀什地区"
        },
        {
          "cityId": "V0653201",
          "cityName": "和田地区"
        },
        {
          "cityId": "V0654001",
          "cityName": "奎屯市"
        },
        {
          "cityId": "V0650400",
          "cityName": "伊犁哈萨克自治州"
        },
        {
          "cityId": "V0654201",
          "cityName": "塔城市"
        },
        {
          "cityId": "V0654301",
          "cityName": "阿勒泰地区"
        },
        {
          "cityId": "V0659001",
          "cityName": "石河子市"
        }
      ]
    }
  ],
}

export default {
  'POST /api/searchPage/advanced': getProfileAdvancedData,
  'POST /api/searchPage/basic': getProfileBasicData,
  'POST /api/proCity/area': getProCityArea,
};
