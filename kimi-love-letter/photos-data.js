/**
 * ============================================================
 * 时光相册 — 100张照片数据（手动填写版）
 * ============================================================
 * 
 * 【使用说明】
 * 1. 填写下方 photos 数组中每张照片的信息
 * 2. 填写完成后，将本文件中的 photos 数组复制到 app.js 中
 *    替换掉原来的 generatePerson 循环生成逻辑
 * 3. 照片文件名对应 portraits/001.jpg ~ portraits/100.jpg
 * 
 * 【字段说明】
 * - id       : 序号（1-100，不可修改）
 * - num      : 文件名编号（'001'-'100'，不可修改）
 * - name     : 照片标题（显示在卡片上，如"第一次约会"）
 * - era      : 年份标签，用于筛选器（只能是：'2023年'/'2024年'/'2025年'/'2026年'）
 * - yearStr  : 年份字符串（如'2024年'）
 * - type     : 照片类型，用于筛选器（只能是以下之一）
 *              '纪念日' / '生日' / '旅游' / '逛街' / '日常' / '节日' / '惊喜' / '美食'
 * - dest     : 目的地/地点，用于筛选器（只能是以下之一，如需新增请同步修改 destinations 数组）
 *              '成都' / '都江堰' / '青城山' / '川西竹海' / '西岭雪山' / '洛带' / '峨眉山' / '眉山' / '黄龙溪' / '三圣乡'
 * - origin   : 出发地（自由填写，如'成都'/'家里'/'学校'等）
 * - mood     : 心情标签（只能是以下之一）
 *              '开心' / '感动' / '想念' / '幸福' / '惊喜' / '温馨' / '浪漫' / '甜蜜'
 * - relation : 关联描述（如'和欢欢一起'/'想对欢欢说'/'给欢欢看'等）
 * - dateStr  : 完整日期（格式：'YYYY年M月D日'，如'2024年3月15日'）
 * - letter   : 信件内容（竖排显示在详情弹窗右侧，用 \n 换行）
 * 
 * 【信件内容格式示例】
 * '欢欢：\n\n今天是我们在一起的第一百天。\n每一天都很幸福。\n\n爱你的我\n2024年3月15日'
 * 
 * 【注意】
 * - letter 中的 {dateStr} 和 {sender} 是模板变量，会被自动替换
 *   你也可以直接写死具体日期和署名，不使用变量
 * - 如果新增地点(dest)，需要同步在 app.js 的 destinations 数组中添加
 * - 如果想新增类型(type)或心情(mood)，也需要同步修改对应数组
 */


// ============================================================
// 照片数据 — 请逐张填写
// ============================================================

var photos = [

// ──────────────────── 2023年 ────────────────────

{
  id: 1, num: '001',
  name: '',           // 照片标题
  era: '2023年',
  yearStr: '2023年',
  type: '',           // 纪念日/生日/旅游/逛街/日常/节日/惊喜/美食
  dest: '',           // 成都/都江堰/青城山/川西竹海/西岭雪山/洛带/峨眉山/眉山/黄龙溪/三圣乡
  origin: '',         // 出发地
  mood: '',           // 开心/感动/想念/幸福/惊喜/温馨/浪漫/甜蜜
  relation: '',       // 关联描述
  dateStr: '2023年12月3日',
  letter: ''          // 信件内容（用 \n 换行）
},

{
  id: 2, num: '002',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月4日',
  letter: ''
},

{
  id: 3, num: '003',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月5日',
  letter: ''
},

{
  id: 4, num: '004',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月10日',
  letter: ''
},

{
  id: 5, num: '005',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月15日',
  letter: ''
},

{
  id: 6, num: '006',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月20日',
  letter: ''
},

{
  id: 7, num: '007',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月25日',
  letter: ''
},

{
  id: 8, num: '008',
  name: '',
  era: '2023年',
  yearStr: '2023年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2023年12月31日',
  letter: ''
},

// ──────────────────── 2024年 ────────────────────

{
  id: 9, num: '009',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年1月1日',
  letter: ''
},

{
  id: 10, num: '010',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年1月10日',
  letter: ''
},

{
  id: 11, num: '011',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年1月20日',
  letter: ''
},

{
  id: 12, num: '012',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年2月1日',
  letter: ''
},

{
  id: 13, num: '013',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年2月10日',
  letter: ''
},

{
  id: 14, num: '014',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年2月14日',
  letter: ''
},

{
  id: 15, num: '015',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年2月25日',
  letter: ''
},

{
  id: 16, num: '016',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年3月5日',
  letter: ''
},

{
  id: 17, num: '017',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年3月15日',
  letter: ''
},

{
  id: 18, num: '018',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年3月25日',
  letter: ''
},

{
  id: 19, num: '019',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年4月5日',
  letter: ''
},

{
  id: 20, num: '020',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年4月15日',
  letter: ''
},

{
  id: 21, num: '021',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年4月25日',
  letter: ''
},

{
  id: 22, num: '022',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年5月1日',
  letter: ''
},

{
  id: 23, num: '023',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年5月10日',
  letter: ''
},

{
  id: 24, num: '024',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年5月20日',
  letter: ''
},

{
  id: 25, num: '025',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年6月1日',
  letter: ''
},

{
  id: 26, num: '026',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年6月15日',
  letter: ''
},

{
  id: 27, num: '027',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年7月1日',
  letter: ''
},

{
  id: 28, num: '028',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年7月15日',
  letter: ''
},

{
  id: 29, num: '029',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年8月1日',
  letter: ''
},

{
  id: 30, num: '030',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年8月15日',
  letter: ''
},

{
  id: 31, num: '031',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年9月1日',
  letter: ''
},

{
  id: 32, num: '032',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年9月15日',
  letter: ''
},

{
  id: 33, num: '033',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年10月1日',
  letter: ''
},

{
  id: 34, num: '034',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年10月15日',
  letter: ''
},

{
  id: 35, num: '035',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年11月1日',
  letter: ''
},

{
  id: 36, num: '036',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年11月15日',
  letter: ''
},

{
  id: 37, num: '037',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年12月3日',
  letter: ''
},

{
  id: 38, num: '038',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年12月15日',
  letter: ''
},

{
  id: 39, num: '039',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年12月25日',
  letter: ''
},

{
  id: 40, num: '040',
  name: '',
  era: '2024年',
  yearStr: '2024年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2024年12月31日',
  letter: ''
},

// ──────────────────── 2025年 ────────────────────

{
  id: 41, num: '041',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年1月1日',
  letter: ''
},

{
  id: 42, num: '042',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年1月15日',
  letter: ''
},

{
  id: 43, num: '043',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年1月28日',
  letter: ''
},

{
  id: 44, num: '044',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年2月1日',
  letter: ''
},

{
  id: 45, num: '045',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年2月14日',
  letter: ''
},

{
  id: 46, num: '046',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年2月28日',
  letter: ''
},

{
  id: 47, num: '047',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年3月8日',
  letter: ''
},

{
  id: 48, num: '048',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年3月20日',
  letter: ''
},

{
  id: 49, num: '049',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年4月1日',
  letter: ''
},

{
  id: 50, num: '050',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年4月15日',
  letter: ''
},

{
  id: 51, num: '051',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年5月1日',
  letter: ''
},

{
  id: 52, num: '052',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年5月15日',
  letter: ''
},

{
  id: 53, num: '053',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年5月25日',
  letter: ''
},

{
  id: 54, num: '054',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年6月1日',
  letter: ''
},

{
  id: 55, num: '055',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年6月15日',
  letter: ''
},

{
  id: 56, num: '056',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年7月1日',
  letter: ''
},

{
  id: 57, num: '057',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年7月15日',
  letter: ''
},

{
  id: 58, num: '058',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年8月1日',
  letter: ''
},

{
  id: 59, num: '059',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年8月15日',
  letter: ''
},

{
  id: 60, num: '060',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年8月28日',
  letter: ''
},

{
  id: 61, num: '061',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年9月1日',
  letter: ''
},

{
  id: 62, num: '062',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年9月15日',
  letter: ''
},

{
  id: 63, num: '063',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年10月1日',
  letter: ''
},

{
  id: 64, num: '064',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年10月15日',
  letter: ''
},

{
  id: 65, num: '065',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年10月28日',
  letter: ''
},

{
  id: 66, num: '066',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年11月1日',
  letter: ''
},

{
  id: 67, num: '067',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年11月15日',
  letter: ''
},

{
  id: 68, num: '068',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年11月28日',
  letter: ''
},

{
  id: 69, num: '069',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年12月3日',
  letter: ''
},

{
  id: 70, num: '070',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年12月15日',
  letter: ''
},

{
  id: 71, num: '071',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年12月25日',
  letter: ''
},

{
  id: 72, num: '072',
  name: '',
  era: '2025年',
  yearStr: '2025年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2025年12月31日',
  letter: ''
},

// ──────────────────── 2026年 ────────────────────

{
  id: 73, num: '073',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年1月1日',
  letter: ''
},

{
  id: 74, num: '074',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年1月15日',
  letter: ''
},

{
  id: 75, num: '075',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年1月28日',
  letter: ''
},

{
  id: 76, num: '076',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年2月1日',
  letter: ''
},

{
  id: 77, num: '077',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年2月14日',
  letter: ''
},

{
  id: 78, num: '078',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年2月28日',
  letter: ''
},

{
  id: 79, num: '079',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年3月8日',
  letter: ''
},

{
  id: 80, num: '080',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年3月20日',
  letter: ''
},

{
  id: 81, num: '081',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年4月1日',
  letter: ''
},

{
  id: 82, num: '082',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年4月15日',
  letter: ''
},

{
  id: 83, num: '083',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年5月1日',
  letter: ''
},

{
  id: 84, num: '084',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年5月15日',
  letter: ''
},

{
  id: 85, num: '085',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年5月25日',
  letter: ''
},

{
  id: 86, num: '086',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月1日',
  letter: ''
},

{
  id: 87, num: '087',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月5日',
  letter: ''
},

{
  id: 88, num: '088',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月8日',
  letter: ''
},

{
  id: 89, num: '089',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月10日',
  letter: ''
},

{
  id: 90, num: '090',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月12日',
  letter: ''
},

{
  id: 91, num: '091',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月13日',
  letter: ''
},

{
  id: 92, num: '092',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月14日',
  letter: ''
},

{
  id: 93, num: '093',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月15日',
  letter: ''
},

{
  id: 94, num: '094',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月16日',
  letter: ''
},

{
  id: 95, num: '095',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月17日',
  letter: ''
},

{
  id: 96, num: '096',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月18日',
  letter: ''
},

{
  id: 97, num: '097',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月19日',
  letter: ''
},

{
  id: 98, num: '098',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月20日',
  letter: ''
},

{
  id: 99, num: '099',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月21日',
  letter: ''
},

{
  id: 100, num: '100',
  name: '',
  era: '2026年',
  yearStr: '2026年',
  type: '',
  dest: '',
  origin: '',
  mood: '',
  relation: '',
  dateStr: '2026年6月22日',
  letter: ''
}

];


// ============================================================
// 【填写完成后的使用方法】
// ============================================================
// 
// 将以下代码复制到 app.js 中，替换掉原来的：
//   - photoTitles 数组（第504-526行）
//   - generatePerson 函数（第551-590行）
//   - people 数组生成循环（第610-613行）
//
// 替换为：
//
//   var people = photos.map(function(p) {
//     p.meta = p.dateStr + ' · ' + p.origin + '→' + p.dest;
//     return p;
//   });
//
// 同时确保 photos 数组也被复制到 app.js 中（放在 people 变量之前）。

