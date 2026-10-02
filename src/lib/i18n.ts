export type Lang =
  | "en"
  | "tr"
  | "ru"
  | "zh"
  | "ar"
  | "fr"
  | "es"
  | "az";

export const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "az", label: "Azərbaycan" },
];

export type Dict = {
  brandSub: string;
  navDesk: string;
  navWallet: string;
  navAbout: string;
  language: string;
  themeLight: string;
  themeDark: string;
  tip: string;
  tipTitle: string;
  tipBody: string;
  tipCopy: string;
  tipCopied: string;
  tipClose: string;
  tipSend: string;
  connectWallet: string;
  connecting: string;
  chooseWallet: string;
  walletInstalled: string;
  walletNotFound: string;
  walletInstall: string;
  walletConnected: string;
  publicDemo: string;
  heroTitle: string;
  heroLead: string;
  ctaStart: string;
  ctaAbout: string;
  ctaSource: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
  deskEyebrow: string;
  deskTitle: string;
  promptLabel: string;
  promptPlaceholder: string;
  runDesk: string;
  running: string;
  toolManifest: string;
  groupNetwork: string;
  groupNetworkHint: string;
  groupProviders: string;
  groupProvidersHint: string;
  groupAccounts: string;
  groupAccountsHint: string;
  chipBriefing: string;
  chipHealth: string;
  chipSlot: string;
  chipVersion: string;
  chipBlockhash: string;
  chipRpcFast: string;
  chipSolami: string;
  chipPanta: string;
  chipPantaMarkets: string;
  chipBalance: string;
  chipActivity: string;
  productTitle: string;
  productBuilder: string;
  productBuilderBody: string;
  productEvidence: string;
  productEvidenceBody: string;
  productAgent: string;
  productAgentBody: string;
  productNote: string;
  walletEyebrow: string;
  walletTitle: string;
  walletLead: string;
  sender: string;
  recipient: string;
  amountSol: string;
  prepare: string;
  signSend: string;
  confirmReceipt: string;
  signatureLabel: string;
  signaturePlaceholder: string;
  amount: string;
  networkFee: string;
  blockhash: string;
  confirmation: string;
  openExplorer: string;
  outputEyebrow: string;
  outputTitle: string;
  nothingYet: string;
  contacting: string;
  evidence: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  aboutP3: string;
  contactTitle: string;
  contactLead: string;
  openX: string;
  openTelegram: string;
  openGitHub: string;
  contactHandle: string;
  footerBrand: string;
};

const en: Dict = {
  brandSub: "by KutluhanETH",
  navDesk: "DESK",
  navWallet: "WALLET",
  navAbout: "ABOUT",
  language: "Language",
  themeLight: "Light",
  themeDark: "Dark",
  tip: "Tip",
  tipTitle: "Send a tip",
  tipBody:
    "If this desk helped you, you can tip SOL to the builder wallet below. Copy the address, or open Wallet and send from your connected account.",
  tipCopy: "Copy address",
  tipCopied: "Copied",
  tipClose: "Close",
  tipSend: "Use in Wallet",
  connectWallet: "Connect wallet",
  connecting: "Connecting…",
  chooseWallet: "Choose a Solana wallet",
  walletInstalled: "Detected",
  walletNotFound: "Not installed",
  walletInstall: "Install",
  walletConnected: "Wallet connected",
  publicDemo: "Public product demo",
  heroTitle: "Solana Agent Desk",
  heroLead:
    "A clear builder console for Solana. Type a request or tap a tool, fetch live network data, and keep every RPC call visible as evidence.",
  ctaStart: "Start on the desk",
  ctaAbout: "About the builder",
  ctaSource: "View source",
  step1Title: "Ask or choose a tool",
  step1Body:
    "Write a plain request, or use the labeled buttons for briefing, health checks, providers, and accounts.",
  step2Title: "Run against Solana",
  step2Body:
    "The desk calls live RPC. Optional private keys for RPC Fast, Solami, or Panta stay on the server.",
  step3Title: "Keep the evidence",
  step3Body:
    "Each run stores the method, parameters, endpoint, status, and a response sample you can inspect.",
  deskEyebrow: "Desk",
  deskTitle: "Run a request",
  promptLabel: "What do you want to check?",
  promptPlaceholder: "Example: Network briefing",
  runDesk: "Run desk tools",
  running: "Running…",
  toolManifest: "Open tool manifest",
  groupNetwork: "Network status",
  groupNetworkHint: "Core Solana reads",
  groupProviders: "Provider pulses",
  groupProvidersHint: "Partner integrations",
  groupAccounts: "Account tools",
  groupAccountsHint: "Balance and activity",
  chipBriefing: "Full briefing",
  chipHealth: "Health check",
  chipSlot: "Current slot",
  chipVersion: "Node version",
  chipBlockhash: "Latest blockhash",
  chipRpcFast: "RPC Fast",
  chipSolami: "Solami",
  chipPanta: "Panta",
  chipPantaMarkets: "Panta markets",
  chipBalance: "System program balance",
  chipActivity: "Recent wallet activity",
  productTitle: "What this product is",
  productBuilder: "A builder desk",
  productBuilderBody:
    ", not a trading bot. Status reads, provider pulses, and wallet prepare with proof.",
  productEvidence: "Evidence first",
  productEvidenceBody:
    ". Every run keeps the method, parameters, RPC URL, and a response sample.",
  productAgent: "Agent ready",
  productAgentBody: ". Other agents can load the same tools from /api/tools.",
  productNote:
    "Public demo uses Solana mainnet when reachable. Optional provider keys never appear in the evidence panel.",
  walletEyebrow: "Wallet",
  walletTitle: "Prepare, sign, confirm",
  walletLead:
    "Build a SOL transfer with fee and blockhash evidence. Connect from the header, or paste a sender address below.",
  sender: "Sender address",
  recipient: "Recipient address",
  amountSol: "Amount (SOL)",
  prepare: "1. Prepare transfer",
  signSend: "2. Sign and send",
  confirmReceipt: "3. Confirm receipt",
  signatureLabel: "Transaction signature",
  signaturePlaceholder: "Paste signature to confirm receipt",
  amount: "Amount",
  networkFee: "Network fee",
  blockhash: "Blockhash",
  confirmation: "Confirmation",
  openExplorer: "Open in explorer",
  outputEyebrow: "Output",
  outputTitle: "Result and evidence",
  nothingYet: "Nothing yet. Use Run desk tools or tap a labeled tool above.",
  contacting: "Contacting Solana…",
  evidence: "RPC call evidence",
  aboutEyebrow: "About",
  aboutTitle: "Built by KutluhanETH",
  aboutP1:
    "I am a TypeScript and Solana focused builder based in Turkey, working remotely. I ship public product surfaces with live network evidence, wallet prepare and receipts, and reviewable upstream contributions.",
  aboutP2:
    "Solana Agent Desk is my Colosseum Crypto World's Fair and Superteam TR project: an open agent desk so builders can ask for network status, run provider pulses, and prove every RPC hop instead of trusting a black box.",
  aboutP3:
    "Beyond this desk I contribute reviewable pull requests on Circle Arc and Miden, and ship adjacent agent tooling. I am open to remote full-time, contract, and freelance Solana or TypeScript product work.",
  contactTitle: "Contact",
  contactLead:
    "Reach out for product roles, collaborations, or feedback on the desk.",
  openX: "Open X profile",
  openTelegram: "Open Telegram",
  openGitHub: "GitHub · kutluhaneth46",
  contactHandle: "@kutluhaneth on X and Telegram",
  footerBrand: "Solana Agent Desk · KutluhanETH",
};

const tr: Dict = {
  ...en,
  brandSub: "KutluhanETH",
  language: "Dil",
  themeLight: "Aydınlık",
  themeDark: "Karanlık",
  tip: "Bahşiş",
  tipTitle: "Bahşiş gönder",
  tipBody:
    "Bu masa işine yaradıysa aşağıdaki cüzdana SOL bahşiş gönderebilirsin. Adresi kopyala veya Cüzdan bölümünden gönder.",
  tipCopy: "Adresi kopyala",
  tipCopied: "Kopyalandı",
  tipClose: "Kapat",
  tipSend: "Cüzdanda kullan",
  connectWallet: "Cüzdan bağla",
  connecting: "Bağlanıyor…",
  chooseWallet: "Bir Solana cüzdanı seç",
  walletInstalled: "Algılandı",
  walletNotFound: "Yüklü değil",
  walletInstall: "Yükle",
  walletConnected: "Cüzdan bağlandı",
  publicDemo: "Herkese açık ürün demosu",
  heroLead:
    "Solana için net bir builder konsolu. İstek yaz veya araç seç, canlı ağ verisini çek ve her RPC çağrısını kanıt olarak gör.",
  ctaStart: "Masaya başla",
  ctaAbout: "Geliştirici hakkında",
  ctaSource: "Kaynağı gör",
  step1Title: "Sor veya araç seç",
  step1Body:
    "Düz bir istek yaz veya brifing, sağlık, sağlayıcı ve hesap düğmelerini kullan.",
  step2Title: "Solana üzerinde çalıştır",
  step2Body:
    "Masa canlı RPC çağırır. RPC Fast, Solami veya Panta anahtarları sunucuda kalır.",
  step3Title: "Kanıtı sakla",
  step3Body:
    "Her çalıştırma yöntem, parametre, uç nokta, durum ve yanıt örneğini saklar.",
  deskEyebrow: "Masa",
  deskTitle: "İstek çalıştır",
  promptLabel: "Ne kontrol etmek istiyorsun?",
  promptPlaceholder: "Örnek: Network briefing",
  runDesk: "Masa araçlarını çalıştır",
  running: "Çalışıyor…",
  toolManifest: "Araç listesini aç",
  groupNetwork: "Ağ durumu",
  groupNetworkHint: "Temel Solana okumaları",
  groupProviders: "Sağlayıcı nabızları",
  groupProvidersHint: "Partner entegrasyonları",
  groupAccounts: "Hesap araçları",
  groupAccountsHint: "Bakiye ve aktivite",
  chipBriefing: "Tam brifing",
  chipHealth: "Sağlık kontrolü",
  chipSlot: "Güncel slot",
  chipVersion: "Düğüm sürümü",
  chipBlockhash: "Son blockhash",
  chipBalance: "System program bakiyesi",
  chipActivity: "Son cüzdan aktivitesi",
  productTitle: "Bu ürün nedir",
  productBuilder: "Bir builder masası",
  productBuilderBody:
    "; trading bot değil. Durum okumaları, sağlayıcı nabızları ve kanıtlı cüzdan hazırlığı.",
  productEvidence: "Önce kanıt",
  productEvidenceBody:
    ". Her çalıştırma yöntem, parametre, RPC URL ve yanıt örneğini tutar.",
  productAgent: "Ajan hazır",
  productAgentBody: ". Diğer ajanlar aynı araçları /api/tools üzerinden yükleyebilir.",
  productNote:
    "Herkese açık demo erişilebilirse Solana mainnet kullanır. Sağlayıcı anahtarları kanıt panelinde görünmez.",
  walletEyebrow: "Cüzdan",
  walletTitle: "Hazırla, imzala, onayla",
  walletLead:
    "Ücret ve blockhash kanıtıyla SOL transferi hazırla. Üstten bağlan veya gönderen adresi yapıştır.",
  sender: "Gönderen adres",
  recipient: "Alıcı adres",
  amountSol: "Miktar (SOL)",
  prepare: "1. Transferi hazırla",
  signSend: "2. İmzala ve gönder",
  confirmReceipt: "3. Makbuzu onayla",
  signatureLabel: "İşlem imzası",
  signaturePlaceholder: "Makbuz için imzayı yapıştır",
  amount: "Miktar",
  networkFee: "Ağ ücreti",
  confirmation: "Onay",
  openExplorer: "Explorerda aç",
  outputEyebrow: "Çıktı",
  outputTitle: "Sonuç ve kanıt",
  nothingYet: "Henüz yok. Masa araçlarını çalıştır veya yukarıdan bir araç seç.",
  contacting: "Solana ile iletişim…",
  evidence: "RPC çağrı kanıtı",
  aboutEyebrow: "Hakkında",
  aboutTitle: "KutluhanETH tarafından",
  aboutP1:
    "Türkiye merkezli, uzaktan çalışan TypeScript ve Solana odaklı bir builderım. Canlı ağ kanıtı, cüzdan hazırlığı ve incelenebilir upstream katkılarla herkese açık ürün yüzeyleri yayınlıyorum.",
  aboutP2:
    "Solana Agent Desk, Colosseum Crypto World's Fair ve Superteam TR projem: builderların ağ durumu sorup sağlayıcı nabızları çalıştırabildiği ve her RPC adımını kanıtlayabildiği açık bir ajan masası.",
  aboutP3:
    "Bu masanın ötesinde Circle Arc ve Miden üzerinde incelenebilir PR'lar açıyor, yan ajan araçları da üretiyorum. Uzaktan tam zamanlı, sözleşme veya freelance Solana / TypeScript ürün işine açığım.",
  contactTitle: "İletişim",
  contactLead:
    "Ürün rolleri, işbirliği veya masa geri bildirimi için yaz.",
  openX: "X profilini aç",
  openTelegram: "Telegramı aç",
  contactHandle: "X ve Telegramda @kutluhaneth",
};

const ru: Dict = {
  ...en,
  brandSub: "от KutluhanETH",
  language: "Язык",
  themeLight: "Светлая",
  themeDark: "Тёмная",
  tip: "Чаевые",
  tipTitle: "Отправить чаевые",
  tipBody:
    "Если стол помог, отправьте SOL на кошелёк ниже. Скопируйте адрес или отправьте из раздела Wallet.",
  tipCopy: "Копировать адрес",
  tipCopied: "Скопировано",
  tipClose: "Закрыть",
  tipSend: "Использовать в Wallet",
  connectWallet: "Подключить кошелёк",
  connecting: "Подключение…",
  chooseWallet: "Выберите Solana-кошелёк",
  walletInstalled: "Найден",
  walletNotFound: "Не установлен",
  walletInstall: "Установить",
  walletConnected: "Кошелёк подключён",
  publicDemo: "Публичное демо",
  heroLead:
    "Понятная builder-консоль для Solana. Напишите запрос или выберите инструмент, получите живые данные сети и сохраните каждый RPC-вызов как доказательство.",
  ctaStart: "Открыть desk",
  ctaAbout: "О разработчике",
  ctaSource: "Исходный код",
  step1Title: "Спросите или выберите инструмент",
  step1Body:
    "Напишите обычный запрос или используйте кнопки для брифинга, проверки здоровья, провайдеров и аккаунтов.",
  step2Title: "Запуск против Solana",
  step2Body:
    "Стол вызывает живой RPC. Приватные ключи RPC Fast, Solami или Panta остаются на сервере.",
  step3Title: "Сохраняйте доказательства",
  step3Body:
    "Каждый запуск сохраняет метод, параметры, endpoint, статус и образец ответа.",
  deskEyebrow: "Desk",
  deskTitle: "Запустить запрос",
  promptLabel: "Что проверить?",
  promptPlaceholder: "Пример: Network briefing",
  runDesk: "Запустить инструменты",
  running: "Выполняется…",
  toolManifest: "Открыть манифест инструментов",
  groupNetwork: "Статус сети",
  groupNetworkHint: "Основные чтения Solana",
  groupProviders: "Пульсы провайдеров",
  groupProvidersHint: "Партнёрские интеграции",
  groupAccounts: "Инструменты аккаунта",
  groupAccountsHint: "Баланс и активность",
  chipBriefing: "Полный брифинг",
  chipHealth: "Проверка здоровья",
  chipSlot: "Текущий слот",
  chipVersion: "Версия узла",
  chipBlockhash: "Последний blockhash",
  chipBalance: "Баланс System Program",
  chipActivity: "Недавняя активность кошелька",
  productTitle: "Что это за продукт",
  productBuilder: "Стол для билдеров",
  productBuilderBody:
    ", а не торговый бот. Статус, пульсы провайдеров и подготовка кошелька с доказательством.",
  productEvidence: "Сначала доказательства",
  productEvidenceBody:
    ". Каждый запуск сохраняет метод, параметры, RPC URL и образец ответа.",
  productAgent: "Готово для агентов",
  productAgentBody: ". Другие агенты могут загрузить те же инструменты из /api/tools.",
  productNote:
    "Публичное демо использует Solana mainnet, когда он доступен. Ключи провайдеров не появляются в панели доказательств.",
  walletEyebrow: "Wallet",
  walletTitle: "Подготовить, подписать, подтвердить",
  walletLead:
    "Соберите перевод SOL с доказательствами комиссии и blockhash. Подключитесь из шапки или вставьте адрес отправителя.",
  sender: "Адрес отправителя",
  recipient: "Адрес получателя",
  amountSol: "Сумма (SOL)",
  prepare: "1. Подготовить перевод",
  signSend: "2. Подписать и отправить",
  confirmReceipt: "3. Подтвердить квитанцию",
  signatureLabel: "Подпись транзакции",
  signaturePlaceholder: "Вставьте подпись для подтверждения",
  amount: "Сумма",
  networkFee: "Сетевая комиссия",
  confirmation: "Подтверждение",
  openExplorer: "Открыть в explorer",
  outputEyebrow: "Вывод",
  outputTitle: "Результат и доказательства",
  nothingYet: "Пока ничего. Запустите инструменты или выберите инструмент выше.",
  contacting: "Связь с Solana…",
  evidence: "Доказательства RPC-вызова",
  aboutEyebrow: "О проекте",
  aboutTitle: "Создано KutluhanETH",
  aboutP1:
    "Я билдер, сосредоточенный на TypeScript и Solana, живу в Турции и работаю удалённо. Делаю публичные продуктовые поверхности с живыми сетевыми доказательствами, подготовкой кошелька и проверяемыми upstream-вкладами.",
  aboutP2:
    "Solana Agent Desk — мой проект для Colosseum Crypto World's Fair и Superteam TR: открытый агентный стол, где билдеры запрашивают статус сети, запускают пульсы провайдеров и доказывают каждый RPC-шаг.",
  aboutP3:
    "Помимо этого стола я открываю проверяемые PR в Circle Arc и Miden и делаю смежные агентные инструменты. Открыт к удалённой full-time, контрактной и freelance работе по Solana или TypeScript.",
  contactTitle: "Контакты",
  contactLead:
    "Пишите по продуктовым ролям, коллаборациям или отзывам о столе.",
  openX: "Открыть X",
  openTelegram: "Открыть Telegram",
  contactHandle: "@kutluhaneth в X и Telegram",
};

const zh: Dict = {
  ...en,
  brandSub: "由 KutluhanETH",
  language: "语言",
  themeLight: "浅色",
  themeDark: "深色",
  tip: "打赏",
  tipTitle: "发送打赏",
  tipBody: "如果这个控制台对你有帮助，可以向下方钱包发送 SOL。复制地址，或在 Wallet 中发送。",
  tipCopy: "复制地址",
  tipCopied: "已复制",
  tipClose: "关闭",
  tipSend: "在 Wallet 中使用",
  connectWallet: "连接钱包",
  connecting: "连接中…",
  chooseWallet: "选择 Solana 钱包",
  walletInstalled: "已检测到",
  walletNotFound: "未安装",
  walletInstall: "安装",
  walletConnected: "钱包已连接",
  publicDemo: "公开产品演示",
  heroLead:
    "清晰的 Solana 构建者控制台。输入请求或点选工具，获取实时网络数据，并把每次 RPC 调用保留为证据。",
  ctaStart: "开始使用",
  ctaAbout: "关于作者",
  ctaSource: "查看源码",
  step1Title: "提问或选择工具",
  step1Body: "用自然语言提问，或使用简报、健康检查、服务商与账户按钮。",
  step2Title: "对 Solana 运行",
  step2Body: "工作台调用实时 RPC。RPC Fast、Solami 或 Panta 的密钥留在服务器上。",
  step3Title: "保留证据",
  step3Body: "每次运行都会保存方法、参数、端点、状态与响应样本。",
  deskEyebrow: "工作台",
  deskTitle: "运行请求",
  promptLabel: "你想检查什么？",
  promptPlaceholder: "例如：Network briefing",
  runDesk: "运行工具",
  running: "运行中…",
  toolManifest: "打开工具清单",
  groupNetwork: "网络状态",
  groupNetworkHint: "核心 Solana 读取",
  groupProviders: "服务商脉搏",
  groupProvidersHint: "合作集成",
  groupAccounts: "账户工具",
  groupAccountsHint: "余额与活动",
  chipBriefing: "完整简报",
  chipHealth: "健康检查",
  chipSlot: "当前 slot",
  chipVersion: "节点版本",
  chipBlockhash: "最新 blockhash",
  chipBalance: "System Program 余额",
  chipActivity: "近期钱包活动",
  productTitle: "这是什么产品",
  productBuilder: "构建者工作台",
  productBuilderBody: "，不是交易机器人。状态读取、服务商脉搏，以及带证明的钱包准备。",
  productEvidence: "证据优先",
  productEvidenceBody: "。每次运行保留方法、参数、RPC URL 与响应样本。",
  productAgent: "面向 Agent",
  productAgentBody: "。其他 agent 可从 /api/tools 加载相同工具。",
  productNote: "公开演示在可访问时使用 Solana mainnet。服务商密钥不会出现在证据面板。",
  walletEyebrow: "钱包",
  walletTitle: "准备、签名、确认",
  walletLead: "用手续费与 blockhash 证据构建 SOL 转账。从页眉连接，或粘贴发送地址。",
  sender: "发送地址",
  recipient: "接收地址",
  amountSol: "数量 (SOL)",
  prepare: "1. 准备转账",
  signSend: "2. 签名并发送",
  confirmReceipt: "3. 确认回执",
  signatureLabel: "交易签名",
  signaturePlaceholder: "粘贴签名以确认回执",
  amount: "数量",
  networkFee: "网络费用",
  confirmation: "确认状态",
  openExplorer: "在浏览器中打开",
  outputEyebrow: "输出",
  outputTitle: "结果与证据",
  nothingYet: "还没有结果。请运行工具或点选上方标签。",
  contacting: "正在连接 Solana…",
  evidence: "RPC 调用证据",
  aboutEyebrow: "关于",
  aboutTitle: "由 KutluhanETH 构建",
  aboutP1:
    "我是一名专注 TypeScript 与 Solana 的构建者，常驻土耳其并远程工作。我交付带实时网络证据、钱包准备与可审查上游贡献的公开产品界面。",
  aboutP2:
    "Solana Agent Desk 是我的 Colosseum Crypto World's Fair 与 Superteam TR 项目：开放的 agent 工作台，让构建者查询网络状态、运行服务商脉搏，并证明每一次 RPC。",
  aboutP3:
    "除了这个工作台，我还在 Circle Arc 与 Miden 提交可审查 PR，并构建相关 agent 工具。欢迎远程全职、合同或自由职业的 Solana / TypeScript 产品工作。",
  contactTitle: "联系",
  contactLead: "欢迎就产品岗位、合作或工作台反馈联系我。",
  openX: "打开 X",
  openTelegram: "打开 Telegram",
  contactHandle: "X 与 Telegram：@kutluhaneth",
};

const ar: Dict = {
  ...en,
  brandSub: "بواسطة KutluhanETH",
  language: "اللغة",
  themeLight: "فاتح",
  themeDark: "داكن",
  tip: "إكرامية",
  tipTitle: "أرسل إكرامية",
  tipBody:
    "إذا ساعدك هذا المكتب، يمكنك إرسال SOL إلى المحفظة أدناه. انسخ العنوان أو أرسل من قسم المحفظة.",
  tipCopy: "نسخ العنوان",
  tipCopied: "تم النسخ",
  tipClose: "إغلاق",
  tipSend: "استخدم في المحفظة",
  connectWallet: "ربط المحفظة",
  connecting: "جارٍ الاتصال…",
  chooseWallet: "اختر محفظة Solana",
  walletInstalled: "مكتشفة",
  walletNotFound: "غير مثبتة",
  walletInstall: "تثبيت",
  walletConnected: "تم ربط المحفظة",
  publicDemo: "عرض عام للمنتج",
  heroLead:
    "وحدة تحكم واضحة لبناة Solana. اكتب طلباً أو اختر أداة، اجلب بيانات الشبكة الحية، واحتفظ بكل استدعاء RPC كدليل.",
  ctaStart: "ابدأ من المكتب",
  ctaAbout: "عن المطوّر",
  ctaSource: "عرض المصدر",
  step1Title: "اسأل أو اختر أداة",
  step1Body:
    "اكتب طلباً بسيطاً، أو استخدم الأزرار للتقرير والصحة والمزوّدين والحسابات.",
  step2Title: "شغّل على Solana",
  step2Body:
    "المكتب يستدعي RPC الحي. مفاتيح RPC Fast أو Solami أو Panta تبقى على الخادم.",
  step3Title: "احتفظ بالأدلة",
  step3Body:
    "كل تشغيل يخزّن الطريقة والمعاملات ونقطة النهاية والحالة وعينة من الاستجابة.",
  deskEyebrow: "المكتب",
  deskTitle: "تشغيل طلب",
  promptLabel: "ماذا تريد أن تفحص؟",
  promptPlaceholder: "مثال: Network briefing",
  runDesk: "تشغيل أدوات المكتب",
  running: "جارٍ التشغيل…",
  toolManifest: "افتح قائمة الأدوات",
  groupNetwork: "حالة الشبكة",
  groupNetworkHint: "قراءات Solana الأساسية",
  groupProviders: "نبضات المزوّدين",
  groupProvidersHint: "تكاملات الشركاء",
  groupAccounts: "أدوات الحساب",
  groupAccountsHint: "الرصيد والنشاط",
  chipBriefing: "تقرير كامل",
  chipHealth: "فحص الصحة",
  chipSlot: "الفتحة الحالية",
  chipVersion: "إصدار العقدة",
  chipBlockhash: "آخر blockhash",
  chipBalance: "رصيد System Program",
  chipActivity: "نشاط المحفظة الأخير",
  productTitle: "ما هذا المنتج",
  productBuilder: "مكتب للبنّائين",
  productBuilderBody:
    "، وليس بوت تداول. قراءات الحالة ونبضات المزوّدين وتحضير المحفظة مع الإثبات.",
  productEvidence: "الأدلة أولاً",
  productEvidenceBody:
    ". كل تشغيل يحتفظ بالطريقة والمعاملات ورابط RPC وعينة الاستجابة.",
  productAgent: "جاهز للوكلاء",
  productAgentBody: ". يمكن للوكلاء الآخرين تحميل الأدوات نفسها من /api/tools.",
  productNote:
    "العرض العام يستخدم Solana mainnet عند توفره. مفاتيح المزوّدين لا تظهر في لوحة الأدلة.",
  walletEyebrow: "المحفظة",
  walletTitle: "حضّر، وقّع، أكّد",
  walletLead:
    "أنشئ تحويل SOL مع أدلة الرسوم وblockhash. اتصل من الرأس أو الصق عنوان المرسل.",
  sender: "عنوان المرسل",
  recipient: "عنوان المستلم",
  amountSol: "المبلغ (SOL)",
  prepare: "1. حضّر التحويل",
  signSend: "2. وقّع وأرسل",
  confirmReceipt: "3. أكّد الإيصال",
  signatureLabel: "توقيع المعاملة",
  signaturePlaceholder: "الصق التوقيع لتأكيد الإيصال",
  amount: "المبلغ",
  networkFee: "رسوم الشبكة",
  confirmation: "التأكيد",
  openExplorer: "افتح في المستكشف",
  outputEyebrow: "المخرجات",
  outputTitle: "النتيجة والأدلة",
  nothingYet: "لا شيء بعد. شغّل أدوات المكتب أو اختر أداة أعلاه.",
  contacting: "الاتصال بـ Solana…",
  evidence: "أدلة استدعاء RPC",
  aboutEyebrow: "حول",
  aboutTitle: "بناه KutluhanETH",
  aboutP1:
    "أنا بنّاء يركز على TypeScript وSolana ومقيم في تركيا وأعمل عن بُعد. أنشر واجهات منتجات عامة مع أدلة شبكة حية وتحضير المحفظة ومساهمات قابلة للمراجعة.",
  aboutP2:
    "Solana Agent Desk مشروعي في Colosseum Crypto World's Fair وSuperteam TR: مكتب وكلاء مفتوح يتيح للبنّائين طلب حالة الشبكة وتشغيل نبضات المزوّدين وإثبات كل خطوة RPC.",
  aboutP3:
    "إلى جانب هذا المكتب أساهم بطلبات سحب قابلة للمراجعة في Circle Arc وMiden وأبني أدوات وكلاء مجاورة. أنا منفتح على عمل Solana أو TypeScript عن بُعد بدوام كامل أو بعقد أو حر.",
  contactTitle: "تواصل",
  contactLead: "تواصل لأدوار المنتج أو التعاون أو ملاحظات حول المكتب.",
  openX: "افتح X",
  openTelegram: "افتح Telegram",
  contactHandle: "@kutluhaneth على X وTelegram",
};

const fr: Dict = {
  ...en,
  brandSub: "par KutluhanETH",
  language: "Langue",
  themeLight: "Clair",
  themeDark: "Sombre",
  tip: "Pourboire",
  tipTitle: "Envoyer un pourboire",
  tipBody:
    "Si ce bureau vous a aidé, envoyez du SOL au portefeuille ci-dessous. Copiez l’adresse ou envoyez depuis Wallet.",
  tipCopy: "Copier l’adresse",
  tipCopied: "Copié",
  tipClose: "Fermer",
  tipSend: "Utiliser dans Wallet",
  connectWallet: "Connecter le portefeuille",
  connecting: "Connexion…",
  chooseWallet: "Choisir un portefeuille Solana",
  walletInstalled: "Détecté",
  walletNotFound: "Non installé",
  walletInstall: "Installer",
  walletConnected: "Portefeuille connecté",
  publicDemo: "Démo produit publique",
  heroLead:
    "Une console claire pour les builders Solana. Écrivez une demande ou choisissez un outil, récupérez les données réseau en direct et gardez chaque appel RPC comme preuve.",
  ctaStart: "Ouvrir le bureau",
  ctaAbout: "À propos du builder",
  ctaSource: "Voir le code",
  step1Title: "Demandez ou choisissez un outil",
  step1Body:
    "Écrivez une demande simple, ou utilisez les boutons pour le briefing, la santé, les fournisseurs et les comptes.",
  step2Title: "Exécuter sur Solana",
  step2Body:
    "Le bureau appelle le RPC en direct. Les clés RPC Fast, Solami ou Panta restent sur le serveur.",
  step3Title: "Garder les preuves",
  step3Body:
    "Chaque exécution stocke la méthode, les paramètres, l’endpoint, le statut et un échantillon de réponse.",
  deskEyebrow: "Bureau",
  deskTitle: "Lancer une requête",
  promptLabel: "Que voulez-vous vérifier ?",
  promptPlaceholder: "Exemple : Network briefing",
  runDesk: "Lancer les outils",
  running: "Exécution…",
  toolManifest: "Ouvrir le manifeste des outils",
  groupNetwork: "État du réseau",
  groupNetworkHint: "Lectures Solana essentielles",
  groupProviders: "Pulses fournisseurs",
  groupProvidersHint: "Intégrations partenaires",
  groupAccounts: "Outils de compte",
  groupAccountsHint: "Solde et activité",
  chipBriefing: "Briefing complet",
  chipHealth: "Contrôle santé",
  chipSlot: "Slot actuel",
  chipVersion: "Version du nœud",
  chipBlockhash: "Dernier blockhash",
  chipBalance: "Solde System Program",
  chipActivity: "Activité récente du portefeuille",
  productTitle: "Ce que c’est",
  productBuilder: "Un bureau pour builders",
  productBuilderBody:
    ", pas un bot de trading. Lectures d’état, pulses fournisseurs et préparation de portefeuille avec preuve.",
  productEvidence: "Preuves d’abord",
  productEvidenceBody:
    ". Chaque exécution garde la méthode, les paramètres, l’URL RPC et un échantillon.",
  productAgent: "Prêt pour les agents",
  productAgentBody: ". D’autres agents peuvent charger les mêmes outils depuis /api/tools.",
  productNote:
    "La démo publique utilise Solana mainnet lorsqu’il est joignable. Les clés fournisseurs n’apparaissent pas dans le panneau de preuves.",
  walletEyebrow: "Portefeuille",
  walletTitle: "Préparer, signer, confirmer",
  walletLead:
    "Construisez un transfert SOL avec preuves de frais et de blockhash. Connectez-vous depuis l’en-tête ou collez l’adresse de l’expéditeur.",
  sender: "Adresse de l’expéditeur",
  recipient: "Adresse du destinataire",
  amountSol: "Montant (SOL)",
  prepare: "1. Préparer le transfert",
  signSend: "2. Signer et envoyer",
  confirmReceipt: "3. Confirmer le reçu",
  signatureLabel: "Signature de transaction",
  signaturePlaceholder: "Collez la signature pour confirmer",
  amount: "Montant",
  networkFee: "Frais réseau",
  confirmation: "Confirmation",
  openExplorer: "Ouvrir dans l’explorateur",
  outputEyebrow: "Sortie",
  outputTitle: "Résultat et preuves",
  nothingYet: "Rien pour l’instant. Lancez les outils ou choisissez un outil ci-dessus.",
  contacting: "Contact de Solana…",
  evidence: "Preuves d’appel RPC",
  aboutEyebrow: "À propos",
  aboutTitle: "Créé par KutluhanETH",
  aboutP1:
    "Je suis un builder concentré sur TypeScript et Solana, basé en Turquie et en remote. Je livre des surfaces produit publiques avec preuves réseau en direct, préparation de portefeuille et contributions upstream vérifiables.",
  aboutP2:
    "Solana Agent Desk est mon projet Colosseum Crypto World's Fair et Superteam TR : un bureau d’agents ouvert pour demander l’état du réseau, lancer des pulses fournisseurs et prouver chaque hop RPC.",
  aboutP3:
    "Au-delà de ce bureau, j’ouvre des PR vérifiables sur Circle Arc et Miden, et je construis des outils agents adjacents. Ouvert au remote full-time, contrat et freelance Solana ou TypeScript.",
  contactTitle: "Contact",
  contactLead:
    "Contactez-moi pour des rôles produit, des collaborations ou des retours sur le bureau.",
  openX: "Ouvrir X",
  openTelegram: "Ouvrir Telegram",
  contactHandle: "@kutluhaneth sur X et Telegram",
};

const es: Dict = {
  ...en,
  brandSub: "por KutluhanETH",
  language: "Idioma",
  themeLight: "Claro",
  themeDark: "Oscuro",
  tip: "Propina",
  tipTitle: "Enviar propina",
  tipBody:
    "Si este escritorio te ayudó, envía SOL a la billetera de abajo. Copia la dirección o envía desde Wallet.",
  tipCopy: "Copiar dirección",
  tipCopied: "Copiado",
  tipClose: "Cerrar",
  tipSend: "Usar en Wallet",
  connectWallet: "Conectar billetera",
  connecting: "Conectando…",
  chooseWallet: "Elige una billetera Solana",
  walletInstalled: "Detectada",
  walletNotFound: "No instalada",
  walletInstall: "Instalar",
  walletConnected: "Billetera conectada",
  publicDemo: "Demo pública del producto",
  heroLead:
    "Una consola clara para builders de Solana. Escribe una solicitud o elige una herramienta, obtén datos de red en vivo y conserva cada llamada RPC como evidencia.",
  ctaStart: "Empezar en el desk",
  ctaAbout: "Sobre el builder",
  ctaSource: "Ver código",
  step1Title: "Pregunta o elige una herramienta",
  step1Body:
    "Escribe una solicitud sencilla o usa los botones de briefing, salud, proveedores y cuentas.",
  step2Title: "Ejecutar contra Solana",
  step2Body:
    "El desk llama al RPC en vivo. Las claves de RPC Fast, Solami o Panta se quedan en el servidor.",
  step3Title: "Conserva la evidencia",
  step3Body:
    "Cada ejecución guarda el método, parámetros, endpoint, estado y una muestra de respuesta.",
  deskEyebrow: "Desk",
  deskTitle: "Ejecutar una solicitud",
  promptLabel: "¿Qué quieres revisar?",
  promptPlaceholder: "Ejemplo: Network briefing",
  runDesk: "Ejecutar herramientas",
  running: "Ejecutando…",
  toolManifest: "Abrir manifiesto de herramientas",
  groupNetwork: "Estado de la red",
  groupNetworkHint: "Lecturas básicas de Solana",
  groupProviders: "Pulsos de proveedores",
  groupProvidersHint: "Integraciones partner",
  groupAccounts: "Herramientas de cuenta",
  groupAccountsHint: "Saldo y actividad",
  chipBriefing: "Briefing completo",
  chipHealth: "Chequeo de salud",
  chipSlot: "Slot actual",
  chipVersion: "Versión del nodo",
  chipBlockhash: "Último blockhash",
  chipBalance: "Saldo System Program",
  chipActivity: "Actividad reciente de billetera",
  productTitle: "Qué es este producto",
  productBuilder: "Un desk para builders",
  productBuilderBody:
    ", no un bot de trading. Lecturas de estado, pulsos de proveedores y preparación de billetera con prueba.",
  productEvidence: "Evidencia primero",
  productEvidenceBody:
    ". Cada ejecución guarda el método, parámetros, URL RPC y una muestra.",
  productAgent: "Listo para agentes",
  productAgentBody: ". Otros agentes pueden cargar las mismas herramientas desde /api/tools.",
  productNote:
    "La demo pública usa Solana mainnet cuando está disponible. Las claves de proveedores no aparecen en el panel de evidencia.",
  walletEyebrow: "Billetera",
  walletTitle: "Preparar, firmar, confirmar",
  walletLead:
    "Construye una transferencia SOL con evidencia de fee y blockhash. Conéctate desde el header o pega la dirección del remitente.",
  sender: "Dirección del remitente",
  recipient: "Dirección del destinatario",
  amountSol: "Cantidad (SOL)",
  prepare: "1. Preparar transferencia",
  signSend: "2. Firmar y enviar",
  confirmReceipt: "3. Confirmar recibo",
  signatureLabel: "Firma de transacción",
  signaturePlaceholder: "Pega la firma para confirmar el recibo",
  amount: "Cantidad",
  networkFee: "Tarifa de red",
  confirmation: "Confirmación",
  openExplorer: "Abrir en el explorer",
  outputEyebrow: "Salida",
  outputTitle: "Resultado y evidencia",
  nothingYet: "Nada aún. Ejecuta las herramientas o elige una arriba.",
  contacting: "Contactando Solana…",
  evidence: "Evidencia de llamada RPC",
  aboutEyebrow: "Acerca de",
  aboutTitle: "Hecho por KutluhanETH",
  aboutP1:
    "Soy un builder enfocado en TypeScript y Solana, basado en Turquía y trabajando en remoto. Entrego superficies de producto públicas con evidencia de red en vivo, preparación de billetera y contribuciones upstream revisables.",
  aboutP2:
    "Solana Agent Desk es mi proyecto de Colosseum Crypto World's Fair y Superteam TR: un desk de agentes abierto para pedir estado de red, lanzar pulsos de proveedores y probar cada hop RPC.",
  aboutP3:
    "Más allá de este desk contribuyo PRs revisables en Circle Arc y Miden, y construyo tooling de agentes adyacente. Abierto a trabajo remoto full-time, contrato o freelance en Solana o TypeScript.",
  contactTitle: "Contacto",
  contactLead:
    "Escríbeme por roles de producto, colaboraciones o feedback sobre el desk.",
  openX: "Abrir X",
  openTelegram: "Abrir Telegram",
  contactHandle: "@kutluhaneth en X y Telegram",
};

const az: Dict = {
  ...en,
  brandSub: "KutluhanETH",
  language: "Dil",
  themeLight: "İşıqlı",
  themeDark: "Qaranlıq",
  tip: "Bəxşiş",
  tipTitle: "Bəxşiş göndər",
  tipBody:
    "Bu masa kömək etdisə, aşağıdakı cüzdana SOL bəxşiş göndərə bilərsən. Ünvanı kopyala və ya Wallet bölməsindən göndər.",
  tipCopy: "Ünvanı kopyala",
  tipCopied: "Kopyalandı",
  tipClose: "Bağla",
  tipSend: "Walletdə istifadə et",
  connectWallet: "Cüzdan bağla",
  connecting: "Qoşulur…",
  chooseWallet: "Solana cüzdanı seç",
  walletInstalled: "Tapıldı",
  walletNotFound: "Quraşdırılmayıb",
  walletInstall: "Quraşdır",
  walletConnected: "Cüzdan bağlandı",
  publicDemo: "İctimai məhsul demosu",
  heroLead:
    "Solana üçün aydın builder konsolu. Sorğu yaz və ya alət seç, canlı şəbəkə məlumatını götür və hər RPC çağırışını sübut kimi saxla.",
  ctaStart: "Masaya başla",
  ctaAbout: "Builder haqqında",
  ctaSource: "Mənbəyə bax",
  step1Title: "Sor və ya alət seç",
  step1Body:
    "Sadə sorğu yaz və ya brifinq, sağlamlıq, provayder və hesab düymələrindən istifadə et.",
  step2Title: "Solana üzərində işlət",
  step2Body:
    "Masa canlı RPC çağırır. RPC Fast, Solami və ya Panta açarları serverdə qalır.",
  step3Title: "Sübutu saxla",
  step3Body:
    "Hər işlətmə metod, parametr, endpoint, status və cavab nümunəsini saxlayır.",
  deskEyebrow: "Masa",
  deskTitle: "Sorğu işlət",
  promptLabel: "Nəyi yoxlamaq istəyirsən?",
  promptPlaceholder: "Nümunə: Network briefing",
  runDesk: "Masa alətlərini işlət",
  running: "İşləyir…",
  toolManifest: "Alət siyahısını aç",
  groupNetwork: "Şəbəkə statusu",
  groupNetworkHint: "Əsas Solana oxumaları",
  groupProviders: "Provayder impulsları",
  groupProvidersHint: "Tərəfdaş inteqrasiyaları",
  groupAccounts: "Hesab alətləri",
  groupAccountsHint: "Balans və aktivlik",
  chipBriefing: "Tam brifinq",
  chipHealth: "Sağlamlıq yoxlaması",
  chipSlot: "Cari slot",
  chipVersion: "Düyün versiyası",
  chipBlockhash: "Son blockhash",
  chipBalance: "System Program balansı",
  chipActivity: "Son cüzdan aktivliyi",
  productTitle: "Bu məhsul nədir",
  productBuilder: "Builder masası",
  productBuilderBody:
    "; trading bot deyil. Status oxumaları, provayder impulsları və sübutlu cüzdan hazırlığı.",
  productEvidence: "Əvvəlcə sübut",
  productEvidenceBody:
    ". Hər işlətmə metod, parametr, RPC URL və cavab nümunəsini saxlayır.",
  productAgent: "Agent hazır",
  productAgentBody: ". Digər agentlər eyni alətləri /api/tools-dan yükləyə bilər.",
  productNote:
    "İctimai demo əlçatandırsa Solana mainnet istifadə edir. Provayder açarları sübut panelində görünmür.",
  walletEyebrow: "Cüzdan",
  walletTitle: "Hazırla, imzala, təsdiqlə",
  walletLead:
    "Komissiya və blockhash sübutu ilə SOL transferi hazırla. Üstdən bağlan və ya göndərən ünvanı yapışdır.",
  sender: "Göndərən ünvan",
  recipient: "Alan ünvan",
  amountSol: "Məbləğ (SOL)",
  prepare: "1. Transferi hazırla",
  signSend: "2. İmzala və göndər",
  confirmReceipt: "3. Qəbzi təsdiqlə",
  signatureLabel: "Tranzaksiya imzası",
  signaturePlaceholder: "Qəbz üçün imzanı yapışdır",
  amount: "Məbləğ",
  networkFee: "Şəbəkə haqqı",
  confirmation: "Təsdiq",
  openExplorer: "Explorerdə aç",
  outputEyebrow: "Çıxış",
  outputTitle: "Nəticə və sübut",
  nothingYet: "Hələ yoxdur. Masa alətlərini işlət və ya yuxarıdan alət seç.",
  contacting: "Solana ilə əlaqə…",
  evidence: "RPC çağırış sübutu",
  aboutEyebrow: "Haqqında",
  aboutTitle: "KutluhanETH tərəfindən",
  aboutP1:
    "Türkiyədə yaşayan, uzaqdan işləyən TypeScript və Solana yönümlü buildərəm. Canlı şəbəkə sübutu, cüzdan hazırlığı və yoxlanıla bilən upstream töhfələrlə ictimai məhsul səthləri çıxarıram.",
  aboutP2:
    "Solana Agent Desk Colosseum Crypto World's Fair və Superteam TR layihəmdir: builderlərin şəbəkə statusu soruşub provayder impulsları işlədə bildiyi və hər RPC addımını sübut etdiyi açıq agent masası.",
  aboutP3:
    "Bu masadan kənarda Circle Arc və Miden üzərində yoxlanıla bilən PR-lar açır, əlaqəli agent alətləri də qururam. Uzaqdan tam ştatlı, müqavilə və ya freelance Solana / TypeScript məhsul işinə açığam.",
  contactTitle: "Əlaqə",
  contactLead: "Məhsul rolları, əməkdaşlıq və ya masa rəyi üçün yaz.",
  openX: "X profilini aç",
  openTelegram: "Telegramı aç",
  contactHandle: "X və Telegramda @kutluhaneth",
};

export const DICTS: Record<Lang, Dict> = { en, tr, ru, zh, ar, fr, es, az };

export function t(lang: Lang): Dict {
  return DICTS[lang] || en;
}
