/**
 * ============================================================
 * 紙短情長 · 兩個人的博物館 — 应用交互逻辑
 * ============================================================
 * 
 * 【功能总结】
 * 本文件包含整个单页应用的所有JavaScript交互逻辑：
 * 
 * 1. SPA路由系统 — 基于hash的页面切换，支持前进/后退
 * 2. 滚动进度条 — 实时跟踪页面滚动百分比
 * 3. 展厅II 灯箱 — 8封信件图片的全屏预览，支持键盘导航
 * 4. 展厅V 时光相册 — 100张照片数据生成、三维筛选、详情弹窗（竖排信件+收藏）
 * 5. 展厅VI 情书局 — 表单交互、实时信纸/信封预览
 * 6. 我的收藏 — localStorage持久化，收藏/取消收藏
 * 7. 平面图弹窗 — SVG节点点击导航
 * 8. 全局键盘事件 — Escape关闭所有弹窗
 * 
 * 【技术要点】
 * - 纯原生JavaScript，无框架依赖
 * - localStorage用于收藏数据持久化
 * - 竖排信件内容使用writing-mode: vertical-rl实现
 * - 照片数据为程序生成的虚构数据（100张）
 * 
 * @version 3.0
 * @author 辜涛
 */


/* ============================================================
   1. SPA路由系统
   ============================================================ */

/**
 * 路由映射表：hash路径 → DOM元素ID
 * 每个路径对应一个页面容器，通过显示/隐藏实现页面切换
 */
const routeMap = {
  '/':        'page-home',
  '/hall/1':  'page-hall-1',
  '/hall/2':  'page-hall-2',
  '/hall/3':  'page-hall-3',
  '/hall/4':  'page-hall-4',
  '/hall/5':  'page-hall-5',
  '/hall/6':  'page-hall-6',
  '/archive': 'page-archive',
  '/about':   'page-about'
};

/**
 * 导航函数 — 修改hash触发路由变更
 * @param {string} path - 目标路径（不含#号）
 */
function navigate(path) {
  window.location.hash = '#' + path;
}

/**
 * 路由处理函数 — 监听hashchange事件
 * 负责：显示/隐藏页面、更新导航高亮、滚动到顶部
 */
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const targetId = routeMap[hash];

  // 隐藏所有页面容器
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  // 显示目标页面
  if (targetId) {
    document.getElementById(targetId).classList.add('active');
  } else {
    document.getElementById('page-home').classList.add('active');
  }

  // 更新导航栏高亮状态
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('data-route') === hash);
  });

  // 滚动到页面顶部
  window.scrollTo(0, 0);

  // 更新进度条
  updateProgress();

  // 如果进入收藏页面，刷新收藏列表
  if (hash === '/archive') {
    renderFavorites();
  }
}

// 监听路由变化与页面加载
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

// 为所有导航链接绑定点击事件
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    navigate(this.getAttribute('data-route'));
  });
});


/* ============================================================
   2. 滚动进度条
   ============================================================ */

/**
 * 根据当前滚动位置更新顶部进度条宽度
 * 进度 = 已滚动距离 / 总可滚动距离 × 100%
 */
function updateProgress() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  document.querySelector('.progress-bar-inner').style.width = progress + '%';
}
window.addEventListener('scroll', updateProgress);


/* ============================================================
   3. 展厅II 纸短情长 — 图片画廊 + 灯箱
   ============================================================ */

/**
 * 8封情书数据：包含图片路径和描述
 * 用于渲染画廊缩略图和灯箱大图
 */
var letterData = [
  { src: 'exhibits/letters/letter-1.jpg', alt: '第一封：相识那天' },
  { src: 'exhibits/letters/letter-2.jpg', alt: '第二封：心动瞬间' },
  { src: 'exhibits/letters/letter-3.jpg', alt: '第三封：思念成疾' },
  { src: 'exhibits/letters/letter-4.jpg', alt: '第四封：分别不舍' },
  { src: 'exhibits/letters/letter-5.jpg', alt: '第五封：重逢欢喜' },
  { src: 'exhibits/letters/letter-6.jpg', alt: '第六封：日常温柔' },
  { src: 'exhibits/letters/letter-7.jpg', alt: '第七封：未来期许' },
  { src: 'exhibits/letters/letter-8.jpg', alt: '第八封：三周年寄语' }
];

/** 渲染画廊网格 — 8张可点击的信件缩略图 */
(function renderGallery() {
  var galleryGrid = document.getElementById('gallery-grid');
  letterData.forEach(function(letter, i) {
    var div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = '<img src="' + letter.src + '" alt="' + letter.alt + '">';
    div.addEventListener('click', function() { openLightbox(i); });
    galleryGrid.appendChild(div);
  });
})();

/** 灯箱当前显示的图片索引 */
var currentLightbox = 0;

/**
 * 打开灯箱 — 显示指定索引的信件大图
 * @param {number} index - 信件索引（0-7）
 */
function openLightbox(index) {
  currentLightbox = index;
  var lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = letterData[index].src;
  document.getElementById('lightbox-counter').textContent = (index + 1) + ' / ' + letterData.length;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** 关闭灯箱 */
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * 灯箱翻页 — 支持左右切换
 * @param {number} dir - 方向：-1为上一张，1为下一张
 */
function lightboxNav(dir) {
  currentLightbox = (currentLightbox + dir + letterData.length) % letterData.length;
  document.getElementById('lightbox-img').src = letterData[currentLightbox].src;
  document.getElementById('lightbox-counter').textContent = (currentLightbox + 1) + ' / ' + letterData.length;
}


/* ============================================================
   4. 展厅V 时光相册 — 数据生成、筛选、详情弹窗、收藏
   ============================================================ */

/**
 * 【数据生成模块】
 * 程序化生成100张照片数据。
 * 每张照片包含：标题、年份、类型、地点、心情等。
 */

/** 年份列表 — 用于筛选器 */
var eras = ['2023年', '2024年', '2025年', '2026年'];

/** 照片类型 — 用于筛选器和卡片 */
var types = ['纪念日', '生日', '旅游', '逛街', '日常', '节日', '惊喜', '美食'];

/** 地点列表 */
var destinations = ['成都', '都江堰', '青城山', '川西竹海', '西岭雪山', '洛带', '峨眉山', '眉山', '黄龙溪', '三圣乡'];

/** 照片标题 */
var photoTitles = [
  '初遇那天', '第一次约会', '第一次旅行', '生日惊喜', '跨年夜',
  '情人节', '周年纪念', '春日出游', '夏夜散步', '秋日暖阳',
  '冬天第一杯奶茶', '一起看日落', '雨中漫步', '深夜长谈', '第一次做饭',
  '一起看电影', '周末懒觉', '你的笑容', '拥抱的温度', '手牵手逛街',
  '为你选的礼物', '烛光晚餐', '星空下', '海边散步', '山间小路',
  '第一次见家长', '你的生日', '我的生日', '十二月的初雪', '新年钟声',
  '樱花树下', '银杏叶落', '一起健身', '为你煮粥', '深夜电话',
  '你说想我', '我说爱你', '一起看剧', '逛超市', '试衣服',
  '冰淇淋', '火锅之夜', '烧烤摊', '路边小吃', '下午茶',
  '玫瑰花', '惊喜礼物', '纪念日蛋糕', '你的照片', '我的照片',
  '自驾游', '飞机上', '高铁站', '地铁里', '公交上',
  '我的女孩', '你的男孩', '最好的我们', '一起变好', '未来可期',
  '三周年', '每一天', '日日夜夜', '朝朝暮暮', '岁岁年年',
  '有你真好', '幸好有你', '永远一起', '不分离', '我爱你',
  '谢谢你', '对不起', '没关系', '我在呢', '别怕',
  '抱着你', '亲亲你', '哄你睡', '叫醒你', '等你',
  '照片76', '照片77', '照片78', '照片79', '照片80',
  '照片81', '照片82', '照片83', '照片84', '照片85',
  '照片86', '照片87', '照片88', '照片89', '照片90',
  '照片91', '照片92', '照片93', '照片94', '照片95',
  '照片96', '照片97', '照片98', '照片99', '照片100'
];

/** 心情列表 */
var moods = ['开心', '感动', '想念', '幸福', '惊喜', '温馨', '浪漫', '甜蜜'];

/** 关联描述 */
var relations = ['和欢欢一起', '想对欢欢说', '给欢欢看', '陪欢欢', '为欢欢', '等欢欢', '找欢欢', '抱欢欢'];

/**
 * 竖排情书模板
 * 每封信包含问候、正文、落款
 * 实际展示时使用writing-mode: vertical-rl实现竖排效果
 */
var letterTemplates = [
  '欢欢：\n\n今天又想你了。\n每一天都像是在倒计时，\n数着下次见面的日子。\n你笑起来的样子，\n我永远都看不够。\n\n爱你的人\n{dateStr}',
  '亲爱的欢欢：\n\n你知道吗，\n和你在一起的每一天，\n都值得被记住。\n那些平凡的日常，\n因为有你而闪闪发光。\n\n永远爱你\n{dateStr}',
  '欢欢宝贝：\n\n三周年快乐！\n感谢你出现在我的生命里，\n让每一天都有了意义。\n未来的路，\n我想和你一起走。\n\n你的{sender}\n{dateStr}',
  '欢欢：\n\n又是想你的夜晚。\n翻看我们的照片，\n每一张都是幸福的证据。\n希望以后的每一个三年，\n都有你在身边。\n\n爱你\n{dateStr}'
];

/**
 * 生成单张照片数据
 * @param {number} i - 照片序号（0-99）
 * @returns {Object} 照片数据对象
 */
function generatePerson(i) {
  var title = photoTitles[i % photoTitles.length];
  var era = eras[i % eras.length];
  var type = types[i % types.length];
  var dest = destinations[i % destinations.length];
  var origins = ['成都', '家里', '学校', '公司', '车站', '机场', '酒店', '公园'];
  var origin = origins[i % origins.length];
  var mood = moods[i % moods.length];
  var relation = relations[i % relations.length];

  // 日期：从2023年12月3日开始，每隔几天一张照片
  var baseDate = new Date(2023, 11, 3);
  var dayOffset = Math.floor(i * (1095 / 100));
  var photoDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  var yearStr = photoDate.getFullYear() + '年';
  var monthStr = (photoDate.getMonth() + 1) + '月';
  var dayStr = photoDate.getDate() + '日';
  var dateStr = yearStr + monthStr + dayStr;

  // 生成信件内容
  var template = letterTemplates[i % letterTemplates.length];
  var letterContent = template
    .replace(/{dateStr}/g, dateStr)
    .replace(/{sender}/g, '我');

  return {
    id: i + 1,
    num: String(i + 1).padStart(3, '0'),
    name: title,
    era: era,
    yearStr: yearStr,
    type: type,
    dest: dest,
    origin: origin,
    mood: mood,
    relation: relation,
    meta: dateStr + ' · ' + origin + '→' + dest,
    letter: letterContent
  };
}

/**
 * 阿拉伯数字转中文数字（简单版）
 * @param {number} n - 1-99的整数
 * @returns {string} 中文数字字符串
 */
function toChineseNum(n) {
  var cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (n <= 10) return cn[n];
  if (n < 20) return '十' + (n > 10 ? cn[n - 10] : '');
  if (n < 100) {
    var tens = Math.floor(n / 10);
    var ones = n % 10;
    return cn[tens] + '十' + (ones > 0 ? cn[ones] : '');
  }
  return String(n);
}

/** 生成全部100人数据 */
var people = [];
for (var i = 0; i < 100; i++) {
  people.push(generatePerson(i));
}

/**
 * 【筛选器模块】
 * 渲染三维筛选器（年代/类型/目的地），支持组合筛选
 */
var activeFilters = { era: '', type: '', dest: '' };

/**
 * 创建一组筛选按钮
 * @param {string} label - 筛选器标签名
 * @param {string[]} items - 选项列表
 * @param {string} filterKey - 对应的筛选维度（era/type/dest）
 */
function createFilterGroup(label, items, filterKey) {
  var filtersContainer = document.getElementById('filters-container');
  var group = document.createElement('div');
  group.className = 'filter-group';
  group.innerHTML = '<span class="filter-label">' + label + '</span>';

  // "全部"按钮
  var allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.textContent = '全部';
  allBtn.dataset.filter = filterKey;
  allBtn.dataset.value = '';
  allBtn.addEventListener('click', function() { setFilter(filterKey, '', this); });
  group.appendChild(allBtn);

  // 各选项按钮
  items.forEach(function(item) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = item;
    btn.dataset.filter = filterKey;
    btn.dataset.value = item;
    btn.addEventListener('click', function() { setFilter(filterKey, item, this); });
    group.appendChild(btn);
  });

  filtersContainer.appendChild(group);
}

// 初始化三组筛选器
createFilterGroup('年份:', eras, 'era');
createFilterGroup('类型:', types, 'type');
createFilterGroup('地点:', destinations, 'dest');

/**
 * 设置筛选条件并刷新肖像网格
 * @param {string} key - 筛选维度
 * @param {string} value - 筛选值（空字符串表示全部）
 * @param {HTMLElement} btn - 被点击的按钮元素
 */
function setFilter(key, value, btn) {
  activeFilters[key] = value;
  // 更新按钮激活状态
  document.querySelectorAll('.filter-btn[data-filter="' + key + '"]').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  renderPortraits();
}

/**
 * 渲染肖像卡片网格 — 根据当前筛选条件过滤
 * 每张卡片显示肖像图片、姓名、年代路线、信件类型
 */
function renderPortraits() {
  var grid = document.getElementById('portrait-grid');
  grid.innerHTML = '';

  // 应用筛选条件
  var filtered = people.filter(function(p) {
    if (activeFilters.era && p.era !== activeFilters.era) return false;
    if (activeFilters.type && p.type !== activeFilters.type) return false;
    if (activeFilters.dest && p.dest !== activeFilters.dest) return false;
    return true;
  });

  // 渲染每张肖像卡片
  filtered.forEach(function(p) {
    var card = document.createElement('div');
    card.className = 'portrait-card';
    card.innerHTML =
      '<div class="portrait-card-img"><img src="portraits/' + p.num + '.jpg" alt="' + p.name + '" loading="lazy" decoding="async"></div>' +
      '<div class="portrait-card-info">' +
        '<span class="portrait-name">' + p.name + '</span>' +
        '<span class="portrait-meta">' + p.meta + '</span>' +
        '<span class="portrait-type">' + p.type + '</span>' +
      '</div>';
    card.addEventListener('click', function() { openPersonModal(p); });
    grid.appendChild(card);
  });
}

// 初始渲染肖像网格
renderPortraits();


/**
 * 【人物详情弹窗模块】
 * 点击肖像后弹出双栏弹窗：
 * - 左栏：肖像卡片（含加入收藏按钮）
 * - 右栏：竖排信件内容 + 翻页导航
 * 参考原站的side-by-side布局效果
 */

/** 当前详情弹窗中显示的人物序号（用于翻页） */
var currentPersonIndex = 0;

/** 当前筛选后的人物列表（用于翻页导航） */
var currentFilteredPeople = [];

/**
 * 打开人物详情弹窗
 * @param {Object} person - 人物数据对象
 */
function openPersonModal(person) {
  // 获取当前筛选后的人物列表（用于翻页）
  currentFilteredPeople = people.filter(function(p) {
    if (activeFilters.era && p.era !== activeFilters.era) return false;
    if (activeFilters.type && p.type !== activeFilters.type) return false;
    if (activeFilters.dest && p.dest !== activeFilters.dest) return false;
    return true;
  });
  currentPersonIndex = currentFilteredPeople.findIndex(function(p) { return p.id === person.id; });

  renderPersonModal(person);

  document.getElementById('person-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * 渲染人物详情弹窗内容
 * @param {Object} person - 人物数据对象
 */
function renderPersonModal(person) {
  var modal = document.getElementById('person-modal');

  // 左栏：照片与基本信息
  var profilePanel = modal.querySelector('.person-profile-panel');
  var isFav = isFavorite(person.id);
  profilePanel.innerHTML =
    '<img class="person-profile-img" src="portraits/' + person.num + '.jpg" alt="' + person.name + '">' +
    '<h3 class="person-profile-name">' + person.name + '</h3>' +
    '<p class="person-profile-role">' + person.mood + '</p>' +
    '<p class="person-profile-meta">' + person.meta + '</p>' +
    '<p class="person-profile-to">' + person.relation + '</p>' +
    '<button class="btn-favorite' + (isFav ? ' favorited' : '') + '" onclick="toggleFavorite(' + person.id + ')">' +
      (isFav ? '✓ 已收藏' : '+ 加入收藏') +
    '</button>';

  // 右栏：竖排信件
  var letterPanel = modal.querySelector('.person-letter-panel');
  letterPanel.innerHTML =
    '<div class="letter-scroll">' +
      '<div class="letter-vertical">' + person.letter + '</div>' +
    '</div>' +
    '<div class="letter-stamp">情书</div>' +
    '<div class="letter-nav">' +
      '<button onclick="navPerson(-1)"' + (currentPersonIndex <= 0 ? ' disabled' : '') + '>← 上一张</button>' +
      '<span class="letter-nav-counter">第 ' + person.num + ' 张 · 共 ' + currentFilteredPeople.length + ' 张</span>' +
      '<button onclick="navPerson(1)"' + (currentPersonIndex >= currentFilteredPeople.length - 1 ? ' disabled' : '') + '>下一张 →</button>' +
    '</div>' +
    '<span class="letter-nav-back" onclick="closePersonModal()">↺ 返回时光相册</span>';
}

/**
 * 翻页切换人物
 * @param {number} dir - 方向：-1为上一人，1为下一人
 */
function navPerson(dir) {
  var newIndex = currentPersonIndex + dir;
  if (newIndex >= 0 && newIndex < currentFilteredPeople.length) {
    currentPersonIndex = newIndex;
    renderPersonModal(currentFilteredPeople[newIndex]);
  }
}

/** 关闭人物详情弹窗 */
function closePersonModal() {
  document.getElementById('person-modal').classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   5. 收藏系统 — localStorage持久化
   ============================================================ */

/**
 * 【收藏管理模块】
 * 使用localStorage存储收藏的人物ID列表。
 * 支持：添加收藏、移除收藏、检查是否已收藏、渲染收藏页面。
 */

/** localStorage键名 */
var FAVORITES_KEY = 'zhuhuan-love-letter-520';

/**
 * 获取所有收藏的人物ID
 * @returns {number[]} 已收藏的人物ID数组
 */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/**
 * 检查某人物是否已被收藏
 * @param {number} id - 人物ID
 * @returns {boolean}
 */
function isFavorite(id) {
  return getFavorites().indexOf(id) !== -1;
}

/**
 * 切换收藏状态 — 点击加入收藏/取消收藏
 * @param {number} id - 人物ID
 */
function toggleFavorite(id) {
  var favs = getFavorites();
  var idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));

  // 刷新弹窗中的收藏按钮状态
  var person = people.find(function(p) { return p.id === id; });
  if (person) {
    renderPersonModal(person);
  }

  // 如果当前在收藏页面，刷新列表
  if ((window.location.hash.slice(1) || '/') === '/archive') {
    renderFavorites();
  }
}

/**
 * 移除收藏
 * @param {number} id - 要移除的人物ID
 */
function removeFavorite(id) {
  var favs = getFavorites();
  var idx = favs.indexOf(id);
  if (idx !== -1) {
    favs.splice(idx, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    renderFavorites();
  }
}

/**
 * 渲染收藏页面 — 展示已收藏的人物卡片网格
 * 空状态时显示引导文案和返回按钮
 */
function renderFavorites() {
  var container = document.getElementById('favorites-container');
  var favIds = getFavorites();

  if (favIds.length === 0) {
    // 空状态
    container.innerHTML =
      '<div class="archive-empty">' +
        '<p class="archive-empty-msg">还没有收藏任何照片。</p>' +
        '<button class="btn-back" onclick="navigate(\'/hall/5\')">↩ 回到时光相册</button>' +
      '</div>';
    return;
  }

  // 获取已收藏的人物数据
  var favPeople = favIds.map(function(id) {
    return people.find(function(p) { return p.id === id; });
  }).filter(Boolean);

  // 渲染卡片网格
  var html = '<div class="favorites-grid">';
  favPeople.forEach(function(p) {
    html +=
      '<div class="fav-card">' +
        '<div class="fav-card-img" onclick="openPersonModal(people.find(function(x){return x.id===' + p.id + '}))">' +
          '<img src="portraits/' + p.num + '.jpg" alt="' + p.name + '">' +
        '</div>' +
        '<div class="fav-card-info">' +
          '<div class="fav-card-name">' + p.name + '</div>' +
          '<div class="fav-card-meta">' + p.meta + '</div>' +
          '<button class="fav-card-remove" onclick="removeFavorite(' + p.id + ')">取消收藏</button>' +
        '</div>' +
      '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}


/* ============================================================
   6. 展厅VI 情书局 — 表单交互 + 实时预览
   ============================================================ */

/**
 * 【情书局表单模块】
 * 左侧为表单（寄信人/收信人/心意/附件/日期/配图），
 * 右侧为实时预览区（信纸+信封），随输入动态更新。
 */

/** 心意选项 — 每个标签对应6条具体语句 */
var moods = [
  { name: '思念', sentences: [
    '每一天都在想你，从早安到晚安。',
    '你不在身边的日子，连空气都觉得寂寞。',
    '想你的笑容，想你的声音，想你的一切。',
    '手机里全是你的照片，翻来覆去看不够。',
    '距离再远，也远不过我对你的思念。',
    '想你的时候，就看看天空，知道你也在同一片天下。'
  ]},
  { name: '甜蜜', sentences: [
    '和你在一起的每一天，都是最好的日子。',
    '你的笑是我见过最美的风景。',
    '牵着你的手，走到哪里都是家。',
    '有你在的日子，连阳光都格外温柔。',
    '你是我这辈子最甜的意外。',
    '每天醒来最幸福的事，就是身边有你。'
  ]},
  { name: '感恩', sentences: [
    '谢谢你出现在我的生命里。',
    '感谢你一直陪在我身边，不离不弃。',
    '有你的包容和理解，我才是更好的自己。',
    '谢谢你让我知道，被爱是什么感觉。',
    '三年了，感谢你选择和我一起走过。',
    '遇见你，是我最大的幸运。'
  ]},
  { name: '期许', sentences: [
    '未来的每一天，我都想和你一起。',
    '下一个三年，下下个三年，都要和你在一起。',
    '等我们老了，还要一起看日落。',
    '以后的路很长，但只要你在，我什么都不怕。',
    '我想和你，走遍这个世界每一个角落。',
    '愿我们的故事，永远没有结局。'
  ]},
  { name: '告白', sentences: [
    '我爱你，不是因为你是谁，而是因为和你在一起时我是谁。',
    '你是我写过最美的情书，也是我余生最想守的人。',
    '如果世界只剩十分钟，我想和你一起度过。',
    '喜欢你，是我做过最对的事。',
    '我想用一辈子，去证明我爱你。',
    '你是我的今天，也是我所有的明天。'
  ]}
];

/** 附件选项列表 */
var attachments = ['玫瑰花', '巧克力', '手写信', '小蛋糕', '星星灯', '情侣手链', '惊喜礼物'];

/** 配图选项列表 — 8张插画 */
var illusts = [
  { src: 'exhibits/illust-redhead-boat.png', name: '爱心' },
  { src: 'exhibits/illust-kapok.png',        name: '花朵' },
  { src: 'exhibits/illust-olive.png',        name: '月亮' },
  { src: 'exhibits/illust-goose.png',        name: '星星' },
  { src: 'exhibits/illust-bridge.png',       name: '彩虹' },
  { src: 'exhibits/illust-tricycle.png',     name: '气球' },
  { src: 'exhibits/illust-miguo.png',        name: '蛋糕' },
  { src: 'exhibits/illust-yingge.png',       name: '戒指' }
];

/** 当前选中的句子（跨分类汇总） */
var selectedSentences = [];

/** 当前展开的心意标签索引 */
var activeMoodIndex = 0;

/** 已选择的附件集合 */
var selectedAttachments = {};

/** 当前选中的配图 */
var selectedIllust = illusts[0]; // 默认选中第一张配图「爱心」

/**
 * 渲染心意类别标签和句子列表
 * 点击标签展开对应句子，句子支持复选（最多5项）
 */
function renderMoodSection() {
  var tabsContainer = document.getElementById('mood-tabs');
  var sentencesContainer = document.getElementById('mood-sentences');

  // 渲染标签按钮
  moods.forEach(function(mood, i) {
    var btn = document.createElement('button');
    btn.className = 'mood-tab' + (i === activeMoodIndex ? ' active' : '');
    btn.innerHTML = '<span class="mood-tab-check"></span>' + mood.name;
    btn.addEventListener('click', function() {
      activeMoodIndex = i;
      document.querySelectorAll('.mood-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderSentences();
    });
    tabsContainer.appendChild(btn);
  });

  // 初始渲染句子
  renderSentences();
}

/**
 * 渲染当前标签的句子列表
 */
function renderSentences() {
  var sentencesContainer = document.getElementById('mood-sentences');
  sentencesContainer.innerHTML = '';
  var currentMood = moods[activeMoodIndex];

  currentMood.sentences.forEach(function(text) {
    var isSelected = selectedSentences.indexOf(text) !== -1;
    var div = document.createElement('div');
    div.className = 'mood-sentence' + (isSelected ? ' selected' : '');
    div.innerHTML =
      '<span class="sentence-checkbox"></span>' +
      '<span class="sentence-text">' + text + '</span>';
    div.addEventListener('click', function() {
      var idx = selectedSentences.indexOf(text);
      if (idx !== -1) {
        // 取消选中
        selectedSentences.splice(idx, 1);
        div.classList.remove('selected');
      } else {
        // 最多选5项
        if (selectedSentences.length >= 5) return;
        selectedSentences.push(text);
        div.classList.add('selected');
      }
      // 更新计数和复选框图标
      updateMoodCount();
      updateTabChecks();
      updateLivePreview();
    });
    sentencesContainer.appendChild(div);
  });

  // 自定义心意输入
  var customRow = document.createElement('div');
  customRow.className = 'mood-custom-row';
  customRow.innerHTML =
    '<span class="mood-custom-trigger">+ 自定义心意</span>' +
    '<div class="mood-custom-input-wrap" style="display:none;">' +
      '<input class="mood-custom-input" placeholder="输入你的心意..." maxlength="30">' +
      '<button class="mood-custom-confirm">✓</button>' +
      '<button class="mood-custom-cancel">✕</button>' +
    '</div>';
  sentencesContainer.appendChild(customRow);

  var trigger = customRow.querySelector('.mood-custom-trigger');
  var inputWrap = customRow.querySelector('.mood-custom-input-wrap');
  var input = customRow.querySelector('.mood-custom-input');
  var confirmBtn = customRow.querySelector('.mood-custom-confirm');
  var cancelBtn = customRow.querySelector('.mood-custom-cancel');

  trigger.addEventListener('click', function() {
    trigger.style.display = 'none';
    inputWrap.style.display = 'flex';
    input.focus();
  });

  function submitCustom() {
    var text = input.value.trim();
    if (!text) { cancelCustom(); return; }
    if (selectedSentences.length >= 5) { cancelCustom(); return; }
    selectedSentences.push(text);
    updateMoodCount();
    updateTabChecks();
    updateLivePreview();
    cancelCustom();
  }

  function cancelCustom() {
    input.value = '';
    inputWrap.style.display = 'none';
    trigger.style.display = 'inline';
  }

  confirmBtn.addEventListener('click', submitCustom);
  cancelBtn.addEventListener('click', cancelCustom);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); submitCustom(); }
    if (e.key === 'Escape') { e.preventDefault(); cancelCustom(); }
  });
}

/**
 * 更新心意已选计数显示
 */
function updateMoodCount() {
  var countEl = document.getElementById('mood-count');
  if (countEl) countEl.textContent = selectedSentences.length;
}

/**
 * 更新所有标签的复选框勾选状态（选中过该标签下的句子则打勾）
 */
function updateTabChecks() {
  var tabBtns = document.querySelectorAll('.mood-tab');
  moods.forEach(function(mood, i) {
    var hasSelected = mood.sentences.some(function(s) { return selectedSentences.indexOf(s) !== -1; });
    if (hasSelected) {
      tabBtns[i].classList.add('active');
    } else {
      tabBtns[i].classList.remove('active');
    }
  });
}

/**
 * 渲染附件选择切换组
 * 将附件列表渲染为可点击的切换按钮
 * @param {string} containerId - 容器元素ID
 * @param {string[]} items - 附件名称数组
 * @param {Object} storage - 存储选中状态的对象（键为附件名，值为true表示选中）
 */
function renderToggleGroup(containerId, items, storage) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  items.forEach(function(item) {
    var btn = document.createElement('button');
    btn.className = 'toggle-btn' + (storage[item] ? ' active' : '');
    btn.textContent = item;
    btn.addEventListener('click', function() {
      if (storage[item]) {
        delete storage[item];
        btn.classList.remove('active');
      } else {
        storage[item] = item;
        btn.classList.add('active');
      }
      updateLivePreview();
    });
    container.appendChild(btn);
  });
}

/**
 * 渲染配图选择网格
 * 每张配图为可点击的缩略图+名称
 */
function renderIllustGrid() {
  var grid = document.getElementById('illust-grid');
  illusts.forEach(function(il, i) {
    var div = document.createElement('div');
    div.className = 'illust-item' + (i === 0 ? ' active' : '');
    div.innerHTML = '<img src="' + il.src + '" alt="' + il.name + '"><span>' + il.name + '</span>';
    div.addEventListener('click', function() {
      document.querySelectorAll('.illust-item').forEach(function(d) { d.classList.remove('active'); });
      div.classList.add('active');
      selectedIllust = il;
      updateLivePreview();
    });
    grid.appendChild(div);
  });
}

// 初始化表单组件
renderMoodSection();
renderToggleGroup('attach-toggles', attachments, selectedAttachments);
renderIllustGrid();

/**
 * 日期自动填充 — 将当前日期转为中文格式
 * 如：二〇二六年 / 六月 / 十日
 */
function autoFillDate() {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();

  // 年份转中文：2026 → 二〇二六年
  var digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var yearStr = '';
  String(y).split('').forEach(function(ch) { yearStr += digits[parseInt(ch)] || ch; });
  yearStr += '年';

  // 月份转中文：6 → 六月
  var months = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  var monthStr = months[m] || m + '月';

  // 日期转中文：10 → 十日
  var dayStr = toChineseNum(d) + '日';

  var yearEl = document.getElementById('date-year');
  var monthEl = document.getElementById('date-month');
  var dayEl = document.getElementById('date-day');
  if (yearEl) yearEl.value = yearStr;
  if (monthEl) monthEl.value = monthStr;
  if (dayEl) dayEl.value = dayStr;
}
autoFillDate();

/**
 * 移动端点击"預覽信紙"按钮滚动到预览区
 */
function scrollToPreview() {
  var preview = document.getElementById('live-preview');
  if (preview) preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 实时更新右侧预览区
 * 监听所有表单输入，动态生成信纸和信封预览
 * 未填写姓名时显示默认提示语，填写后显示信纸+信封预览并启用下载按钮
 */
function updateLivePreview() {
  var senderRole = document.getElementById('sender-role').value;
  var senderName = document.getElementById('sender-name').value || '';
  var receiverRole = document.getElementById('receiver-role').value;
  var receiverName = document.getElementById('receiver-name').value || '';

  var previewDefault = document.getElementById('preview-default');
  var letterSection = document.getElementById('letter-preview-section');
  var envelopeSection = document.getElementById('envelope-preview-section');
  var btnLetter = document.getElementById('btn-dl-letter');
  var btnEnvelope = document.getElementById('btn-dl-envelope');

  // 未填写任何姓名时，显示默认提示语，隐藏预览
  if (!senderName && !receiverName) {
    if (previewDefault) previewDefault.style.display = 'block';
    if (letterSection) letterSection.style.display = 'none';
    if (envelopeSection) envelopeSection.style.display = 'none';
    if (btnLetter) btnLetter.disabled = true;
    if (btnEnvelope) btnEnvelope.disabled = true;
    return;
  }

  // 有姓名填写时，显示预览，启用下载按钮
  if (previewDefault) previewDefault.style.display = 'none';
  if (letterSection) letterSection.style.display = 'block';
  if (envelopeSection) envelopeSection.style.display = 'block';
  if (btnLetter) btnLetter.disabled = false;
  if (btnEnvelope) btnEnvelope.disabled = false;

  // 收集表单数据
  var attachList = Object.keys(selectedAttachments);
  var sName = senderName || '○○';
  var rName = receiverName || '○○';
  var sRole = senderRole !== '選擇身份' ? senderRole : '';
  var rRole = receiverRole !== '選擇身份' ? receiverRole : '';
  var dateYear = document.getElementById('date-year') ? document.getElementById('date-year').value : '';
  var dateMonth = document.getElementById('date-month') ? document.getElementById('date-month').value : '';
  var dateDay = document.getElementById('date-day') ? document.getElementById('date-day').value : '';
  var dateStr = dateYear + dateMonth + dateDay;
  var customAttach = document.getElementById('attach-custom') ? document.getElementById('attach-custom').value : '';

  // ===== 信纸预览（横排，红色边框，手写体） =====
  var greeting = (rRole ? rRole + ' ' : '') + rName + '，展信欢颜。';

  // 使用选中的句子作为正文
  var bodyHTML = '';
  if (selectedSentences.length > 0) {
    bodyHTML = selectedSentences.map(function(s) {
      return '<span class="letter-body">' + s + '</span>';
    }).join('');
  } else {
    bodyHTML = '<span class="letter-body">好久不见，甚是想念。</span>';
  }

  var attachText = '';
  if (attachList.length > 0 || customAttach) {
    var allAttach = attachList.slice();
    if (customAttach) allAttach.push(customAttach);
    attachText = '<span class="letter-body">随信附上 ' + allAttach.join('、') + '，聊表心意。</span>';
  }

  var signText = (sRole ? sRole + ' ' : '') + sName + ' 敬上';

  // 配图水印（灰度半透明，贴在信纸底部）
  var illustWatermark = selectedIllust ? '<img class="letter-paper-illust" src="' + selectedIllust.src + '" alt="' + selectedIllust.name + '">' : '';

  var letterHTML =
    '<div class="letter-paper">' +
      '<div class="letter-paper-inner">' +
        illustWatermark +
        '<div class="letter-text">' +
          '<span class="letter-greeting">' + greeting + '</span>' +
          bodyHTML +
          (attachText ? attachText : '') +
          '<span class="letter-sign">' + signText + '</span>' +
          (dateStr ? '<span class="letter-date">' + dateStr + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  document.getElementById('letter-live-content').innerHTML = letterHTML;

  // ===== 信封预览（三栏布局：左收信人 + 中情書 + 右寄信人） =====
  var receiverDisplay = rRole + rName;
  var senderDisplay = (sRole ? '自 ' + sRole + ' ' : '自 ') + sName + ' 寄';
  var sealText = rName ? '爱 ' + rName : '爱';

  var envelopeHTML =
    '<div class="envelope-display">' +
      // 左栏：收信人
      '<div class="envelope-left">' +
        '<span class="envelope-badge">情书</span>' +
        '<span class="envelope-receiver">' + receiverDisplay + '</span>' +
        '<span class="envelope-receiver-sub">亲启</span>' +
        '<div class="envelope-seal">' +
          '<div class="envelope-seal-inner">' + sealText + '</div>' +
        '</div>' +
      '</div>' +
      // 中栏：红色情書大字
      '<div class="envelope-center">' +
        '<span class="envelope-qiaopi">情書</span>' +
      '</div>' +
      // 右栏：寄信人
      '<div class="envelope-right">' +
        '<span class="envelope-deco-text">纸短情长</span>'
        '<span class="envelope-deco-text">此生珍重</span>' +
        '<span class="envelope-sender">' + senderDisplay + '</span>' +
      '</div>' +
    '</div>';
  document.getElementById('envelope-live-content').innerHTML = envelopeHTML;
}

// 为所有表单元素绑定 input/change 事件以触发实时更新
['sender-role', 'sender-name', 'receiver-role', 'receiver-name'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', updateLivePreview);
    el.addEventListener('change', updateLivePreview);
  }
});
// 日期输入也触发预览更新
['date-year', 'date-month', 'date-day', 'attach-custom'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', updateLivePreview);
  }
});

/**
 * 重置下载按钮状态
 * @param {string} btnId - 按钮元素ID
 * @param {string} text - 恢复后的按钮文字
 */
function resetDownloadBtn(btnId, text) {
  var btn = document.getElementById(btnId);
  if (btn) { btn.disabled = false; btn.textContent = text; }
}

/**
 * 将canvas转为PNG触发浏览器下载
 * 包含跨域安全兜底：toDataURL可能因canvas被污染抛出SecurityError
 * @param {HTMLCanvasElement} canvas - 要下载的canvas
 * @param {string} filename - 下载文件名
 * @param {string} btnId - 对应按钮ID，用于重置状态
 * @param {string} btnText - 按钮恢复文字
 */
function triggerCanvasDownload(canvas, filename, btnId, btnText) {
  try {
    var dataUrl = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    resetDownloadBtn(btnId, btnText);
  } catch (e) {
    resetDownloadBtn(btnId, btnText);
    alert('下载失败：图片生成出错，请重试');
  }
}

/**
 * 收集情书局表单数据，返回信纸绘制所需的全部信息
 * @returns {Object} 信纸数据对象
 */
function collectLetterData() {
  var senderRole = document.getElementById('sender-role').value;
  var senderName = document.getElementById('sender-name').value || '';
  var receiverRole = document.getElementById('receiver-role').value;
  var receiverName = document.getElementById('receiver-name').value || '';
  var dateYear = document.getElementById('date-year') ? document.getElementById('date-year').value : '';
  var dateMonth = document.getElementById('date-month') ? document.getElementById('date-month').value : '';
  var dateDay = document.getElementById('date-day') ? document.getElementById('date-day').value : '';
  var customAttach = document.getElementById('attach-custom') ? document.getElementById('attach-custom').value : '';
  var attachList = Object.keys(selectedAttachments);

  var sName = senderName || '○○';
  var rName = receiverName || '○○';
  var sRole = senderRole !== '选择身份' ? senderRole : '';
  var rRole = receiverRole !== '选择身份' ? receiverRole : '';

  /* 问候语 */
  var greeting = (rRole ? rRole + ' ' : '') + rName + '，展信欢颜。';

  /* 正文段落（选中的心意句子，默认一句） */
  var bodies = selectedSentences.length > 0 ? selectedSentences.slice() : ['好久不见，甚是想念。'];

  /* 附件附言 */
  var attachText = '';
  if (attachList.length > 0 || customAttach) {
    var allAttach = attachList.slice();
    if (customAttach) allAttach.push(customAttach);
    attachText = '随信附上 ' + allAttach.join('、') + '，聊表心意。';
  }

  /* 署名 */
  var signText = (sRole ? sRole + ' ' : '') + sName + ' 敬上';

  /* 日期 */
  var dateStr = dateYear + dateMonth + dateDay;

  return {
    greeting: greeting,
    bodies: bodies,
    attachText: attachText,
    signText: signText,
    dateStr: dateStr,
    illustSrc: selectedIllust ? selectedIllust.src : null
  };
}

/**
 * 中文自动换行绘制：逐字测量宽度，超出maxWidth时换行
 * @param {CanvasRenderingContext2D} ctx - canvas上下文
 * @param {string} text - 要绘制的文字
 * @param {number} x - 起始X坐标
 * @param {number} y - 起始Y坐标
 * @param {number} maxWidth - 最大行宽
 * @param {number} lineH - 行高
 * @param {number} indent - 首行缩进宽度（0表示不缩进）
 * @returns {number} 绘制结束后的Y坐标
 */
function drawWrappedText(ctx, text, x, y, maxWidth, lineH, indent) {
  var curX = x + indent;
  var curMaxW = maxWidth - indent;
  var isFirstLine = true;

  for (var ci = 0; ci < text.length;) {
    var lineW = 0;
    var lineEnd = ci;
    while (lineEnd < text.length) {
      var ch = text.charAt(lineEnd);
      var cw = ctx.measureText(ch).width;
      if (lineW + cw > curMaxW && lineEnd > ci) break;
      lineW += cw;
      lineEnd++;
    }
    ctx.fillText(text.substring(ci, lineEnd), curX, y);
    y += lineH;
    ci = lineEnd;
    /* 首行结束后，后续行回到正常起始位置 */
    if (isFirstLine) {
      curX = x;
      curMaxW = maxWidth;
      isFirstLine = false;
    }
  }
  return y;
}

/**
 * 使用Canvas 2D API绘制信纸图片（不依赖html2canvas，无跨域问题）
 * 布局与CSS .letter-paper / .letter-paper-inner 完全对应
 * @param {Object} data - collectLetterData()返回的数据
 * @param {Function} callback - 绘制完成回调，参数为canvas
 */
function generateLetterCanvas(data, callback) {
  /* 画布尺寸与缩放：CSS尺寸560×800，2倍清晰度 */
  var W = 560, H = 800, S = 2;
  var canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  var ctx = canvas.getContext('2d');
  ctx.scale(S, S);

  var fontStack = '"Ma Shan Zheng", "Long Cang", "Liu Jian Mao Cao", "LXGW WenKai TC", "KaiTi", "STKaiti", serif';

  /* 外层背景：斜向渐变，对应 .letter-paper background */
  var outerGrad = ctx.createLinearGradient(0, 0, W, H);
  outerGrad.addColorStop(0, '#e8dcc4');
  outerGrad.addColorStop(1, '#d4c4a0');
  ctx.fillStyle = outerGrad;
  ctx.fillRect(0, 0, W, H);

  /* 内层：古纸纹理渐变，对应 .letter-paper-inner background */
  var pad = 20; /* .letter-paper padding: 20px */
  var innerX = pad, innerY = pad;
  var innerW = W - pad * 2, innerH = H - pad * 2;
  var innerGrad = ctx.createLinearGradient(0, innerY, 0, innerY + innerH);
  innerGrad.addColorStop(0, '#f0e6d0');
  innerGrad.addColorStop(1, '#e4d8be');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(innerX, innerY, innerW, innerH);

  /* 红色内边框，对应 .letter-paper-inner::before { inset: 18px 16px; border: 3px solid vermilion } */
  var borderInsetY = 18, borderInsetX = 16;
  ctx.strokeStyle = '#b34a3a';
  ctx.lineWidth = 3;
  ctx.strokeRect(
    innerX + borderInsetX,
    innerY + borderInsetY,
    innerW - borderInsetX * 2,
    innerH - borderInsetY * 2
  );

  /* 文字区域参数，对应 .letter-paper-inner padding: 36px 28px */
  var textPadX = 28, textPadY = 36;
  var textX = innerX + textPadX;
  var textW = innerW - textPadX * 2;
  var fontSize = 18;
  var lineH = Math.round(fontSize * 2.2); /* line-height: 2.2 */
  var indentW = fontSize * 2; /* text-indent: 2em */

  ctx.font = fontSize + 'px ' + fontStack;
  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'top';
  var curY = innerY + textPadY;

  /* 问候语（不缩进，对应 .letter-greeting） */
  curY = drawWrappedText(ctx, data.greeting, textX, curY, textW, lineH, 0);
  curY += 16; /* margin-bottom: 16px */

  /* 正文段落（首行缩进2em，对应 .letter-body text-indent: 2em） */
  for (var bi = 0; bi < data.bodies.length; bi++) {
    curY = drawWrappedText(ctx, data.bodies[bi], textX, curY, textW, lineH, indentW);
    curY += 16; /* margin-bottom: 16px */
  }

  /* 附件附言（首行缩进2em） */
  if (data.attachText) {
    curY = drawWrappedText(ctx, data.attachText, textX, curY, textW, lineH, indentW);
    curY += 16;
  }

  /* 署名（右对齐，对应 .letter-sign text-align: right） */
  curY += 20; /* margin-top: 20px */
  ctx.textAlign = 'right';
  ctx.fillText(data.signText, textX + textW, curY);
  curY += lineH;

  /* 日期（右对齐，小字灰色，对应 .letter-date） */
  if (data.dateStr) {
    ctx.font = '14px ' + fontStack;
    ctx.fillStyle = '#4a4a4a';
    ctx.fillText(data.dateStr, textX + textW, curY);
  }
  ctx.textAlign = 'left';

  /* 配图水印：如果无配图，直接返回canvas */
  if (!data.illustSrc) { callback(canvas); return; }

  /* 安全加载配图：先加载到临时canvas转dataURL，避免污染主canvas */
  var img = new Image();
  img.onload = function() {
    var tmpC = document.createElement('canvas');
    tmpC.width = img.naturalWidth;
    tmpC.height = img.naturalHeight;
    tmpC.getContext('2d').drawImage(img, 0, 0);
    try {
      var dataUrl = tmpC.toDataURL('image/png');
      var safeImg = new Image();
      safeImg.onload = function() {
        try {
          /* 配图定位：对应 .letter-paper-illust { bottom: 36px; left: 28px; width: 160px; height: 160px } */
          var illustW = 160, illustH = 160;
          var illustX = innerX + textPadX;
          var illustY = innerY + innerH - 36 - illustH;
          ctx.save();
          ctx.globalAlpha = 0.38; /* opacity: 0.38 */
          ctx.translate(illustX + illustW / 2, illustY + illustH / 2);
          ctx.rotate(-3 * Math.PI / 180); /* transform: rotate(-3deg) */
          ctx.drawImage(safeImg, -illustW / 2, -illustH / 2, illustW, illustH);
          ctx.restore();
        } catch (e) { /* 配图合成失败不影响整体 */ }
        callback(canvas);
      };
      safeImg.onerror = function() { callback(canvas); };
      safeImg.src = dataUrl;
    } catch (e) {
      /* 临时canvas被污染，跳过配图 */
      callback(canvas);
    }
  };
  img.onerror = function() { callback(canvas); };
  img.src = data.illustSrc;
}

/**
 * 下载信纸
 * 流程：收集表单数据 → Canvas 2D API绘制 → 触发PNG下载
 */
function downloadLetter() {
  var btn = document.getElementById('btn-dl-letter');
  if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

  var data = collectLetterData();
  generateLetterCanvas(data, function(canvas) {
    triggerCanvasDownload(canvas, '情书-信纸.png', 'btn-dl-letter', '下载信纸');
  });
}

/**
 * 分享信纸 — 组合降级方案
 * 1. Web Share API（移动端优先）：调用系统原生分享面板
 * 2. 剪贴板复制（桌面端降级）：图片复制到剪贴板，提示粘贴分享
 * 3. 手动提示（都不支持）：引导用户使用下载功能
 */
function shareLetter() {
  var btn = document.getElementById('btn-share');
  if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

  var resetShareBtn = function() {
    if (btn) { btn.disabled = false; btn.textContent = '分享'; }
  };

  var data = collectLetterData();
  generateLetterCanvas(data, function(canvas) {
    /* 将canvas转为Blob，用于分享或剪贴板写入 */
    canvas.toBlob(function(blob) {
      if (!blob) {
        resetShareBtn();
        alert('图片生成失败，请重试');
        return;
      }

      /* 方案1：Web Share API — 移动端原生分享面板 */
      if (navigator.share && navigator.canShare) {
        var file = new File([blob], '情书-信纸.png', { type: 'image/png' });
        var shareData = { files: [file] };
        if (navigator.canShare(shareData)) {
          navigator.share(shareData).then(function() {
            resetShareBtn();
          }).catch(function() {
            resetShareBtn();
          });
          return;
        }
      }

      /* 方案2：复制图片到剪贴板 — 桌面端可直接Ctrl+V粘贴分享 */
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        var item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(function() {
          resetShareBtn();
          alert('信纸已复制到剪贴板，可直接粘贴分享');
        }).catch(function() {
          resetShareBtn();
          alert('复制失败，请使用「下载信纸」保存后手动分享');
        });
        return;
      }

      /* 方案3：都不支持，引导用户手动下载分享 */
      resetShareBtn();
      alert('当前浏览器不支持直接分享，请使用「下载信纸」保存后手动分享');
    }, 'image/png');
  });
}

/**
 * 下载信封 — 使用Canvas 2D API直接绘制（无跨域问题）
 * 信封为纯文字+几何图形，不涉及外部图片，因此无需html2canvas
 * 布局：左栏(22%)收信人+印章 | 中栏(50%)红色情書大字 | 右栏(28%)寄信人+装饰
 */
function downloadEnvelope() {
  var btn = document.getElementById('btn-dl-envelope');
  if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

  /* 收集表单数据 */
  var senderRole = document.getElementById('sender-role').value;
  var senderName = document.getElementById('sender-name').value || '';
  var receiverRole = document.getElementById('receiver-role').value;
  var receiverName = document.getElementById('receiver-name').value || '';

  var sName = senderName || '○○';
  var rName = receiverName || '○○';
  var sRole = senderRole !== '选择身份' ? senderRole : '';
  var rRole = receiverRole !== '选择身份' ? receiverRole : '';

  var receiverDisplay = rRole + rName;
  var senderDisplay = (sRole ? '自 ' + sRole + ' ' : '自 ') + sName + ' 寄';
  var sealText = rName ? '爱 ' + rName : '爱';

  /* 创建2倍分辨率canvas，确保下载图片清晰 */
  var W = 360, H = 560, S = 2;
  var canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  var ctx = canvas.getContext('2d');
  ctx.scale(S, S);

  var fontStack = '"Ma Shan Zheng", "Long Cang", "Liu Jian Mao Cao", "LXGW WenKai TC", "KaiTi", "STKaiti", serif';
  var fontKai = '"LXGW WenKai TC", "KaiTi", "STKaiti", serif';

  /* 整体背景：牛皮纸色渐变 */
  var grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
  grad.addColorStop(0, '#d4aa72');
  grad.addColorStop(0.6, '#c49a62');
  grad.addColorStop(1, '#ba9258');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  /* 三栏尺寸 */
  var leftW = W * 0.22;
  var centerW = W * 0.50;
  var rightW = W * 0.28;

  /* 左栏+右栏：米色渐变背景 */
  var leftGrad = ctx.createLinearGradient(0, 0, 0, H);
  leftGrad.addColorStop(0, '#f0e6d0');
  leftGrad.addColorStop(1, '#e4d8be');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, leftW, H);
  ctx.fillRect(W - rightW, 0, rightW, H);

  /* 中栏：红色渐变背景 */
  var centerGrad = ctx.createLinearGradient(0, 0, 0, H);
  centerGrad.addColorStop(0, '#c03525');
  centerGrad.addColorStop(1, '#9e2515');
  ctx.fillStyle = centerGrad;
  ctx.fillRect(leftW, 0, centerW, H);

  /* 左上角「情书」标签 — 金属质感小徽章 */
  ctx.font = '10px ' + fontStack;
  ctx.fillStyle = '#2a2a2a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var badgeW = 32, badgeH = 16;
  var badgeX = leftW / 2 - badgeW / 2;
  var badgeY = 12;
  ctx.fillStyle = '#c2c0ba';
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 1;
  ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
  ctx.fillStyle = '#2a2a2a';
  ctx.font = '9px ' + fontStack;
  ctx.fillText('情书', leftW / 2, badgeY + badgeH / 2);

  /* 左栏：收信人竖排大字 */
  ctx.fillStyle = '#1a1410';
  ctx.font = '24px ' + fontStack;
  ctx.textAlign = 'center';
  var recvChars = receiverDisplay.split('');
  var recvStartY = 60;
  var recvSpacing = 32;
  for (var ri = 0; ri < recvChars.length; ri++) {
    ctx.fillText(recvChars[ri], leftW / 2, recvStartY + ri * recvSpacing);
  }

  /* 左栏：「亲启」竖排小字 */
  ctx.font = '14px ' + fontKai;
  var subStartY = recvStartY + recvChars.length * recvSpacing + 8;
  var subChars = '亲启'.split('');
  for (var si = 0; si < subChars.length; si++) {
    ctx.fillText(subChars[si], leftW / 2, subStartY + si * 20);
  }

  /* 左下角：圆形印章（双圈+文字） */
  var sealCX = leftW / 2;
  var sealCY = H - 40;
  var sealR = 20;
  ctx.save();
  ctx.translate(sealCX, sealCY);
  ctx.rotate(-7 * Math.PI / 180); /* 印章微倾斜，模拟手工盖印效果 */
  ctx.beginPath();
  ctx.arc(0, 0, sealR, 0, Math.PI * 2);
  ctx.strokeStyle = '#c03525';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, sealR - 4, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#c03525';
  ctx.font = '8px ' + fontStack;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sealText, 0, 0);
  ctx.restore();

  /* 中栏：红色背景上「情書」竖排大字 */
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '48px ' + fontStack;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var qiaopiChars = '情書'.split('');
  var qiaopiX = leftW + centerW / 2;
  var qiaopiStartY = H / 2 - 30;
  for (var qi = 0; qi < qiaopiChars.length; qi++) {
    ctx.fillText(qiaopiChars[qi], qiaopiX, qiaopiStartY + qi * 60);
  }

  /* 右栏：「纸短情长」竖排装饰文字 */
  var decoChars = '纸短情长'.split('');
  ctx.fillStyle = '#1a1410';
  ctx.font = '18px ' + fontStack;
  var rightCX = W - rightW / 2;
  var decoStartY = 20;
  for (var di = 0; di < decoChars.length; di++) {
    ctx.fillText(decoChars[di], rightCX, decoStartY + di * 26);
  }

  /* 右栏：寄信人竖排信息 */
  ctx.fillStyle = '#1a1410';
  ctx.font = '16px ' + fontStack;
  var senderChars = senderDisplay.split('');
  var senderStartY = decoStartY + decoChars.length * 26 + 20;
  for (var ei = 0; ei < senderChars.length; ei++) {
    ctx.fillText(senderChars[ei], rightCX, senderStartY + ei * 22);
  }

  triggerCanvasDownload(canvas, '情书-信封.png', 'btn-dl-envelope', '下载信封');
}


/* ============================================================
   7. 平面图弹窗
   ============================================================ */

/** 打开平面图弹窗 */
function openFloorplan() {
  document.getElementById('floorplan-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** 关闭平面图弹窗 */
function closeFloorplan() {
  document.getElementById('floorplan-overlay').classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   8. 全局键盘事件
   ============================================================ */

/**
 * Escape键关闭所有弹窗/灯箱
 * 左右方向键在灯箱中翻页
 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    closeFloorplan();
    closePersonModal();
  }
  // 灯箱键盘导航
  var lb = document.getElementById('lightbox');
  if (lb.classList.contains('open')) {
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  }
});
