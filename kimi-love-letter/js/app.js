/**
 * ============================================================
 * 給阿嬤的情書 · 電影記憶館 — 应用交互逻辑
 * ============================================================
 * 
 * 【功能总结】
 * 本文件包含整个单页应用的所有JavaScript交互逻辑：
 * 
 * 1. SPA路由系统 — 基于hash的页面切换，支持前进/后退
 * 2. 滚动进度条 — 实时跟踪页面滚动百分比
 * 3. 展厅II 灯箱 — 8封信件图片的全屏预览，支持键盘导航
 * 4. 展厅V 百人千言 — 100人数据生成、三维筛选、详情弹窗（竖排信件+收藏）
 * 5. 展厅VI 银信局 — 表单交互、实时信纸/信封预览
 * 6. 我的收藏 — localStorage持久化，收藏/取消收藏
 * 7. 平面图弹窗 — SVG节点点击导航
 * 8. 全局键盘事件 — Escape关闭所有弹窗
 * 
 * 【技术要点】
 * - 纯原生JavaScript，无框架依赖
 * - localStorage用于收藏数据持久化
 * - 竖排信件内容使用writing-mode: vertical-rl实现
 * - 人物数据为程序生成的虚构数据（100人）
 * 
 * @version 2.0
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
   3. 展厅II 紙短情長 — 图片画廊 + 灯箱
   ============================================================ */

/**
 * 8封信件数据：包含图片路径和描述
 * 用于渲染画廊缩略图和灯箱大图
 */
var letterData = [
  { src: 'exhibits/letters/letter-1.jpg', alt: '影片起始所念信件' },
  { src: 'exhibits/letters/letter-2.jpg', alt: '木生開始跑船' },
  { src: 'exhibits/letters/letter-3.jpg', alt: '謝南枝代寫' },
  { src: 'exhibits/letters/letter-4.jpg', alt: '木生入獄時' },
  { src: 'exhibits/letters/letter-5.jpg', alt: '木生托狄功所寫' },
  { src: 'exhibits/letters/letter-6.jpg', alt: '狄功課上講解「相思」所拆信件' },
  { src: 'exhibits/letters/letter-7.jpg', alt: '木生去世·謝南枝海邊所燒' },
  { src: 'exhibits/letters/letter-8.jpg', alt: '走馬燈回憶' }
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
   4. 展厅V 百人千言 — 数据生成、筛选、详情弹窗、收藏
   ============================================================ */

/**
 * 【数据生成模块】
 * 程序化生成100个虚构的过番人物数据。
 * 每个人物包含：姓名、年代、类型、目的地、信件内容等。
 * 所有数据均为AI文学虚构创作，与真实历史人物无关。
 */

/** 年代列表 — 用于筛选器 */
var eras = ['晚清', '清末', '民國初', '民國中', '民國後'];

/** 信件类型 — 用于筛选器和人物卡片 */
var types = ['報平安', '思念', '匯款', '告別', '喜訊', '憂訊', '囑託', '求助'];

/** 目的地列表 — 南洋各城市 */
var destinations = ['檳城', '曼谷', '新加坡', '西貢', '馬尼拉', '吉隆坡', '仰光', '雅加達', '泗水', '巴達維亞'];

/** 姓氏库 — 潮汕/闽南常见姓氏 */
var surnames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊',
  '許', '鄭', '謝', '郭', '洪', '邱', '曾', '廖', '賴', '周',
  '蘇', '莊', '呂', '江', '何', '蕭', '羅', '潘', '簡', '朱'];

/** 名字库 — 带有时代感的名字 */
var givenNames = ['木生', '阿水', '阿火', '阿土', '阿金', '阿福', '阿貴', '阿財',
  '阿壽', '阿康', '阿寧', '阿安', '阿泰', '阿平', '阿和', '阿順',
  '阿旺', '阿昌', '阿盛', '阿興', '南枝', '秀英', '玉蘭', '阿蓮',
  '美珠', '淑芬', '秋霞', '春花', '冬梅', '夏荷'];

/** 身份/角色列表 — 对应不同类型的信件 */
var roles = ['學徒', '船員', '商人', '礦工', '教師', '醫生', '農夫', '漁夫'];

/** 收信关系 — 对应信件类型 */
var relations = ['寄予父親', '寄予母親', '寄予妻子', '寄予兒子', '寄予女兒', '寄予兄弟', '寄予友人', '寄予戀人'];

/**
 * 竖排信件模板 — 传统僑批格式
 * 每封信包含称谓、正文、落款，使用繁体中文
 * 实际展示时使用writing-mode: vertical-rl实现竖排效果
 */
var letterTemplates = [
  '父親大人膝下：\n\n兒在南洋一切安好，請勿掛念。\n工作雖然辛苦，但收入尚可。\n今隨信附上銀錢若干，\n望收妥。\n\n天氣漸涼，伏惟珍重。\n\n兒 {name} 叩上\n\n{name_era}年{month}月',
  '母親大人膝下：\n\n不孝兒遠渡重洋，\n心中萬分思念。\n近日身體尚好，\n工作也漸穩定。\n\n隨信附上布匹一件，\n望母親裁衣保暖。\n\n兒 {name} 敬稟\n\n{name_era}年{month}月',
  '吾妻如晤：\n\n一別數月，甚是想念。\n此處生活雖苦，\n然為了家計，不得不然。\n\n今寄回銀信一封，\n望妻善自保重。\n待來日歸家，再敘天倫。\n\n夫 {name} 手書\n\n{name_era}年{month}月',
  '父親大人安：\n\n兒在此處學藝，\n日漸精進。\n東家待人寬厚，\n同事亦多和睦。\n\n雖离家萬里，\n然心中無時不念家人。\n望父親保重身體。\n\n兒 {name} 叩\n\n{name_era}年{month}月'
];

/**
 * 生成单个人物数据
 * @param {number} i - 人物序号（0-99）
 * @returns {Object} 人物数据对象
 */
function generatePerson(i) {
  var surname = surnames[i % surnames.length];
  var given = givenNames[i % givenNames.length];
  var era = eras[i % eras.length];
  var type = types[i % types.length];
  var dest = destinations[i % destinations.length];
  var origins = ['汕頭', '潮州', '澄海', '饒平', '揭陽', '普寧', '惠來', '潮陽'];
  var origin = origins[i % origins.length];
  var role = roles[i % roles.length];
  var relation = relations[i % relations.length];
  var age = 16 + (i % 45);

  // 计算年号
  var yearBase = 1880 + (i % 66);
  var yearStr;
  if (yearBase < 1909) {
    yearStr = '光緒' + toChineseNum(yearBase - 1874) + '年';
  } else if (yearBase < 1912) {
    yearStr = '宣統' + toChineseNum(yearBase - 1908) + '年';
  } else {
    yearStr = '民國' + toChineseNum(yearBase - 1911) + '年';
  }

  // 生成信件内容
  var template = letterTemplates[i % letterTemplates.length];
  var letterContent = template
    .replace(/{name}/g, surname + given)
    .replace(/{name_era}/g, yearStr.replace('年', ''))
    .replace(/{month}/g, toChineseNum((i % 12) + 1));

  return {
    id: i + 1,
    num: String(i + 1).padStart(3, '0'),
    name: surname + given,
    era: era,
    yearStr: yearStr,
    type: type,
    dest: dest,
    origin: origin,
    role: role,
    age: age,
    relation: relation,
    meta: yearStr + ' · ' + origin + '→' + dest,
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
createFilterGroup('年代:', eras, 'era');
createFilterGroup('類型:', types, 'type');
createFilterGroup('目的地:', destinations, 'dest');

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
      '<div class="portrait-card-img"><img src="portraits/' + p.num + '.jpg" alt="' + p.name + '" loading="lazy"></div>' +
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

  // 左栏：肖像与基本信息
  var profilePanel = modal.querySelector('.person-profile-panel');
  var isFav = isFavorite(person.id);
  profilePanel.innerHTML =
    '<img class="person-profile-img" src="portraits/' + person.num + '.jpg" alt="' + person.name + '">' +
    '<h3 class="person-profile-name">' + person.name + '</h3>' +
    '<p class="person-profile-role">' + person.role + ' · ' + person.age + '歲</p>' +
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
    '<div class="letter-stamp">銀信</div>' +
    '<div class="letter-nav">' +
      '<button onclick="navPerson(-1)"' + (currentPersonIndex <= 0 ? ' disabled' : '') + '>← 上一封</button>' +
      '<span class="letter-nav-counter">第 ' + person.num + ' 封 · 共 ' + currentFilteredPeople.length + ' 封</span>' +
      '<button onclick="navPerson(1)"' + (currentPersonIndex >= currentFilteredPeople.length - 1 ? ' disabled' : '') + '>下一封 →</button>' +
    '</div>' +
    '<span class="letter-nav-back" onclick="closePersonModal()">↺ 返回百人牆</span>';
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
var FAVORITES_KEY = 'kimi-love-letter-favorites';

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
        '<p class="archive-empty-msg">還沒有人住進你的檔案。</p>' +
        '<button class="btn-back" onclick="navigate(\'/hall/5\')">↩ 回到百人牆</button>' +
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
   6. 展厅VI 銀信局 — 表单交互 + 实时预览
   ============================================================ */

/**
 * 【银信局表单模块】
 * 左侧为表单（寄信人/收信人/心意/附件/日期/配图），
 * 右侧为实时预览区（信纸+信封），随输入动态更新。
 */

/** 心意选项 — 每个标签对应6条具体语句 */
var moods = [
  { name: '平安', sentences: [
    '兒/孫在外，諸事順遂，伏惟釋念。',
    '此地天時和暖，飲食有節，身體安泰。',
    '月入足數，家中所寄之資已收，母庸掛慮。',
    '同行者皆好，鄉鄰互照，母須擔憂。',
    '番邦雖遠，神明庇佑，平安二字便是富貴。',
    '近日工事順遂，得長官嘉許，足堪自慰。'
  ]},
  { name: '思念', sentences: [
    '每念故鄉雨絲，便覺南洋日暖反成寒。',
    '阿嬤所烹之粿，夢中嘗之，醒來惟枕巾沁水。',
    '凡見白髮婦人，皆似阿嬤倚門之影。',
    '月夜獨坐，舉首見星，知此星亦照故鄉。',
    '鄉音久未入耳，每逢同鄉，便如見親人。',
    '夜深燈下，常憶幼時竈前烤芋之香。'
  ]},
  { name: '抱歉', sentences: [
    '此番遠行，未及拜別，跪請恕罪。',
    '久未付筆，非吾忘也，實乃工事繁忙，心緒難寧。',
    '上回所寄之數較往減少，皆因此地時局所累，望勿責怪。',
    '不能侍奉於膝下，是兒此生之憾。',
    '諾以歲末歸家，今恐難踐，懇求寬諒。',
    '未能護持，致使家中諸事勞煩，伏乞海涵。'
  ]},
  { name: '等待', sentences: [
    '歸期未定，唯望明年春暖，或可束裝。',
    '待此地工事告一段落，必先回家小住。',
    '屈指算來，離家已三載又七月，歸心日切。',
    '若秋風起時仍未得歸，當再寄銀信報安。',
    '唯願多保重，待我歸日，再共飲一杯熱茶。',
    '行李雖已束起三回，奈何船期屢改，望寬心等候。'
  ]},
  { name: '道別', sentences: [
    '此去南洋，山高水長，惟願此後家書不斷。',
    '男兒志在四方，請勿以遠別為憂。',
    '紅頭船將啟，書此一紙以代握別。',
    '來日若不能歸，望以此信代見面之顏。',
    '願以萬里之外，常承庇蔭。',
    '就此擱筆，珍重再珍重。'
  ]}
];

/** 附件选项列表 */
var attachments = ['二百元', '自行車', '咸豬肉', '木棉花', '青橄欖', '油柑', '獅頭鵝'];

/** 配图选项列表 — 8张插画 */
var illusts = [
  { src: 'exhibits/illust-redhead-boat.png', name: '紅頭船' },
  { src: 'exhibits/illust-kapok.png',        name: '木棉花' },
  { src: 'exhibits/illust-olive.png',        name: '油柑' },
  { src: 'exhibits/illust-goose.png',        name: '獅頭鵝' },
  { src: 'exhibits/illust-bridge.png',       name: '石板橋' },
  { src: 'exhibits/illust-tricycle.png',     name: '三輪車' },
  { src: 'exhibits/illust-miguo.png',        name: '無米粿' },
  { src: 'exhibits/illust-yingge.png',       name: '英歌' }
];

/** 当前选中的句子（跨分类汇总） */
var selectedSentences = [];

/** 当前展开的心意标签索引 */
var activeMoodIndex = 0;

/** 已选择的附件集合 */
var selectedAttachments = {};

/** 当前选中的配图 */
var selectedIllust = illusts[0]; // 默认选中第一张「红头船」

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
      if (isSelected) {
        // 取消选中
        selectedSentences = selectedSentences.filter(function(s) { return s !== text; });
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
  var greeting = (rRole ? rRole + ' ' : '') + rName + ' 大人，展信安康。';

  // 使用选中的句子作为正文
  var bodyHTML = '';
  if (selectedSentences.length > 0) {
    bodyHTML = selectedSentences.map(function(s) {
      return '<span class="letter-body">' + s + '</span>';
    }).join('');
  } else {
    bodyHTML = '<span class="letter-body">久違尊顏，不勝思念。</span>';
  }

  var attachText = '';
  if (attachList.length > 0 || customAttach) {
    var allAttach = attachList.slice();
    if (customAttach) allAttach.push(customAttach);
    attachText = '<span class="letter-body">今隨信附上 ' + allAttach.join('、') + '，聊表孝心。</span>';
  }

  var signText = (sRole ? sRole + ' ' : '') + sName + ' 叩上';

  // 配图水印（灰度半透明，贴在信纸底部）
  var illustWatermark = selectedIllust ? '<img class="letter-paper-illust" src="' + selectedIllust.src + '" alt="' + selectedIllust.name + '">' : '';

  var letterHTML =
    '<div class="letter-paper">' +
      illustWatermark +
      '<div class="letter-paper-inner">' +
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

  // ===== 信封预览（三栏布局：左收信人 + 中僑批 + 右寄信人） =====
  var receiverDisplay = rRole + rName;
  var senderDisplay = (sRole ? '自 ' + sRole + ' ' : '自 ') + sName + ' 寄';
  var sealText = rName ? rName + '之印' : '之印';

  var envelopeHTML =
    '<div class="envelope-display">' +
      // 左栏：收信人
      '<div class="envelope-left">' +
        '<span class="envelope-badge">銀信</span>' +
        '<span class="envelope-receiver">' + receiverDisplay + '</span>' +
        '<span class="envelope-receiver-sub">安啓</span>' +
        '<div class="envelope-seal">' +
          '<div class="envelope-seal-inner">' + sealText + '</div>' +
        '</div>' +
      '</div>' +
      // 中栏：红色僑批大字
      '<div class="envelope-center">' +
        '<span class="envelope-qiaopi">僑批</span>' +
      '</div>' +
      // 右栏：寄信人
      '<div class="envelope-right">' +
        '<span class="envelope-deco-text">紙短情長</span>' +
        '<span class="envelope-deco-text">伏惟珍重</span>' +
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
