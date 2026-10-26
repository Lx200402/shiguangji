const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Parse JSON bodies up to 20MB (for base64 images)
app.use(express.json({ limit: '20mb' }));

// Serve static files (website.html, images/)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// DEFAULT DATA
// ==========================================
var DEFAULT_POSTS = [
  {id:1,title:"柠檬树下的午后时光",cat:"scenery",sub:"山川湖海",cover:"images/lemon-terrace.jpg",excerpt:"阳光透过柠檬树叶洒在石板露台上，远处江面波光粼粼...",tags:["露台","柠檬","江景","午后"],date:"2024-11-15",location:"江畔露台",season:"夏季",content:"<p>偶然发现这个藏在江边的柠檬小院。</p><img src='images/lemon-terrace.jpg' alt='柠檬露台'><h3>偷得浮生半日闲</h3><p>远处的桥和城市天际线若隐若现。</p>"},
  {id:2,title:"成都地道老火锅指南",cat:"food",sub:"川菜",cover:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",excerpt:"牛油锅底、毛肚鸭肠黄喉...",tags:["火锅","川菜","成都"],date:"2024-11-12",content:"<p>来成都不吃一顿老火锅，等于白来。</p>"},
  {id:3,title:"霍格沃茨的魔法之夜",cat:"scenery",sub:"城市风光",cover:"images/hogwarts-castle.jpg",excerpt:"当灯光秀点亮城堡的那一刻...",tags:["城堡","灯光秀","魔法"],date:"2024-11-08",location:"主题乐园",content:"<p>夜幕降临，城堡在粉红色的灯光中苏醒。</p><img src='images/hogwarts-castle.jpg' alt='城堡'>"},
  {id:4,title:"周末Brunch：法式吐司配莓果",cat:"food",sub:"烘焙甜品",cover:"https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",excerpt:"外酥内软的法式吐司...",tags:["Brunch","甜品"],date:"2024-11-05",content:"<p>周末的仪式感从一份精致的Brunch开始。</p>"},
  {id:5,title:"独居生活的100个小确幸",cat:"life",sub:"日常随笔",cover:"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",excerpt:"一个人住第三年...",tags:["独居","生活方式"],date:"2024-11-01",content:"<p>独居第三年，从最初的不适应到现在的享受。</p>"},
  {id:6,title:"雨中天坛祈年殿",cat:"scenery",sub:"四季摄影",cover:"images/temple-of-heaven.jpg",excerpt:"细雨中的祈年殿...",tags:["天坛","北京","古建筑"],date:"2024-10-28",location:"北京·天坛",content:"<p>大多数人都选择在晴天游览天坛。</p><img src='images/temple-of-heaven.jpg' alt='天坛'>"},
  {id:7,title:"手工意面的正确打开方式",cat:"food",sub:"西餐料理",cover:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",excerpt:"从零开始做手工意面...",tags:["意面","西餐"],date:"2024-10-25",content:"<p>自从学会做手工意面，就再也回不去干面了。</p>"},
  {id:8,title:"大雁塔前的玄奘法师",cat:"scenery",sub:"旅行攻略",cover:"images/giant-pagoda-monk.jpg",excerpt:"千年古塔下，玄奘法师的铜像静静矗立...",tags:["大雁塔","西安","玄奘"],date:"2024-10-20",location:"西安·大雁塔",content:"<p>站在大雁塔前，仰望这座历经千年的古塔。</p><img src='images/giant-pagoda-monk.jpg' alt='大雁塔'>"},
  {id:9,title:"养了一只猫之后的变化",cat:"life",sub:"宠物日常",cover:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",excerpt:"它改变了我的作息...",tags:["猫咪","宠物"],date:"2024-10-15",content:"<p>去年冬天领养了一只橘猫，取名年糕。</p>"},
  {id:10,title:"大雁塔与佛像的对话",cat:"scenery",sub:"山川湖海",cover:"images/giant-pagoda-buddha.jpg",excerpt:"翠绿的松柏间，一尊佛像静坐莲台...",tags:["大雁塔","佛像","禅意"],date:"2024-10-10",location:"西安·大慈恩寺",content:"<p>在大慈恩寺的花园里，我发现了这个绝妙的构图。</p><img src='images/giant-pagoda-buddha.jpg' alt='佛像'>"},
  {id:11,title:"居家咖啡入门手册",cat:"food",sub:"饮品调制",cover:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",excerpt:"从速溶到手冲...",tags:["咖啡","手冲"],date:"2024-10-05",content:"<p>三年前我还是一个只喝速溶的人。</p>"},
  {id:12,title:"整理收纳：断舍离实践记",cat:"life",sub:"生活技巧",cover:"https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",excerpt:"花了一个月时间整理了整个家...",tags:["收纳","断舍离"],date:"2024-09-28",content:"<p>搬家三年，家里堆积了太多不需要的东西。</p>"},
  {id:13,title:"广仁寺的五彩经幡",cat:"scenery",sub:"旅行攻略",cover:"images/prayer-flags.jpg",excerpt:"成千上万面五彩经幡...",tags:["经幡","广仁寺","西安"],date:"2024-09-20",location:"西安·广仁寺",content:"<p>走进广仁寺的那一刻，我被头顶的景象震撼了。</p><img src='images/prayer-flags.jpg' alt='经幡'>"},
  {id:14,title:"莲花池中的锦鲤",cat:"scenery",sub:"四季摄影",cover:"images/lotus-koi-pond.jpg",excerpt:"石雕莲花喷泉中央，锦鲤在涟漪中游弋...",tags:["锦鲤","莲花","禅意"],date:"2024-09-15",location:"古寺庭院",content:"<p>古寺庭院中的一方石池。</p><img src='images/lotus-koi-pond.jpg' alt='锦鲤'>"},
  {id:15,title:"翠竹深处的古亭",cat:"scenery",sub:"山川湖海",cover:"images/forest-pavilion.jpg",excerpt:"茂密的绿荫中，一座覆满青苔的古亭...",tags:["竹林","古亭","园林"],date:"2024-09-08",location:"山中园林",content:"<p>沿着山间小路走了许久。</p><img src='images/forest-pavilion.jpg' alt='古亭'>"},
  {id:16,title:"天梯：通往云端的路",cat:"scenery",sub:"旅行攻略",cover:"images/heavenly-stairs.jpg",excerpt:"石狮守护的天梯直入云霄...",tags:["天梯","登山","石阶"],date:"2024-09-01",location:"山中古道",content:"<p>两块巨石之间，一条陡峭的石阶直通山顶。</p><img src='images/heavenly-stairs.jpg' alt='天梯'>"}
];

// ==========================================
// DATA HELPERS
// ==========================================
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) { console.error('Read error:', e.message); }
  return { posts: DEFAULT_POSTS };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
  saveData({ posts: DEFAULT_POSTS });
}

// ==========================================
// API ROUTES
// ==========================================

// Get all posts
app.get('/api/posts', (req, res) => {
  const data = loadData();
  res.json(data.posts);
});

// Add a new post
app.post('/api/posts', (req, res) => {
  const data = loadData();
  const post = req.body;
  if (!post.title) return res.status(400).json({ error: 'Title required' });
  // Assign ID
  var maxId = 0;
  data.posts.forEach(function(p) { if (p.id > maxId) maxId = p.id; });
  post.id = maxId + 1;
  if (!post.date) post.date = new Date().toISOString().slice(0, 10);
  data.posts.unshift(post);
  saveData(data);
  res.json(post);
});

// Update a post
app.put('/api/posts/:id', (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id);
  const idx = data.posts.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.posts[idx] = Object.assign(data.posts[idx], req.body, { id: id });
  saveData(data);
  res.json(data.posts[idx]);
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id);
  data.posts = data.posts.filter(p => p.id !== id);
  saveData(data);
  res.json({ success: true });
});

// Reset to defaults
app.post('/api/reset', (req, res) => {
  saveData({ posts: DEFAULT_POSTS });
  res.json({ success: true });
});

// ==========================================
// START
// ==========================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  拾光集服务器已启动');
  console.log('  地址: http://localhost:' + PORT);
  console.log('  数据: ' + DATA_FILE);
  console.log('========================================');
});
