// Demo News Data สำหรับ News Intelligence
// *** ข่าวจริงจากเว็บข่าว Tech ต่างประเทศ ***

export interface NewsItem {
  id: string;
  title: string;
  title_th: string;
  summary: string;
  summary_th: string;
  url: string;
  image_url?: string;
  source: string;
  category: "apple" | "ev" | "tech" | "economy" | "gadgets";
  published_at: string;
  priority_score: number;
  priority_level: "hot" | "trending" | "normal" | "low";
  suggested_angle: string;
  keywords: string[];
  status: "available" | "claimed" | "writing" | "published" | "skipped";
  assigned_to?: string;
}

export const demoNews: NewsItem[] = [
  {
    id: "n1",
    title: "iPhone market share now bigger than Samsung, not just due to iPhone 17",
    title_th: "ส่วนแบ่งตลาด iPhone แซง Samsung แล้ว ไม่ใช่แค่เพราะ iPhone 17",
    summary: "After two years of Apple and Samsung being neck and neck in the smartphone market share stakes, iPhone market share beat out the Korean company by the end of last year.",
    summary_th: "หลังจากที่ Apple และ Samsung แข่งขันกันมา 2 ปี ในที่สุด iPhone ก็แซงหน้า Samsung ในส่วนแบ่งตลาดสมาร์ทโฟนเมื่อปลายปีที่แล้ว",
    url: "https://9to5mac.com/2026/01/12/iphone-market-share-now-bigger-than-samsung-not-just-due-to-iphone-17/",
    source: "9to5Mac",
    category: "apple",
    published_at: "2026-01-12T08:00:00Z",
    priority_score: 92,
    priority_level: "hot",
    suggested_angle: "วิเคราะห์ปัจจัยที่ทำให้ Apple แซง Samsung และแนวโน้มปี 2026",
    keywords: ["iPhone", "Samsung", "market share", "Apple"],
    status: "available",
  },
  {
    id: "n2",
    title: "Musk says Tesla could have 2 million robotaxis in a year",
    title_th: "Musk บอก Tesla อาจมี Robotaxi 2 ล้านคันภายในปีหน้า",
    summary: "On Tesla's Q4/FY2025 earnings call, Musk mused about the growth rate of its paid robotaxi service, which launched in Austin this year.",
    summary_th: "ในการประชุมผลประกอบการ Q4/2025 ของ Tesla Musk พูดถึงอัตราการเติบโตของบริการ Robotaxi ที่เปิดตัวในออสตินปีนี้",
    url: "https://electrek.co/2026/01/29/musk-says-tesla-could-have-2-million-robotaxis-in-a-year-more-than-it-can-build/",
    source: "Electrek",
    category: "ev",
    published_at: "2026-01-29T06:30:00Z",
    priority_score: 88,
    priority_level: "hot",
    suggested_angle: "วิเคราะห์ความเป็นไปได้และความท้าทายของ Tesla Robotaxi ในไทย",
    keywords: ["Tesla", "Robotaxi", "Musk", "autonomous"],
    status: "claimed",
    assigned_to: "content_team",
  },
  {
    id: "n3",
    title: "Apple Faces Lawsuit Over Continuity Camera Patent and Antitrust Claims",
    title_th: "Apple ถูกฟ้องเรื่องสิทธิบัตร Continuity Camera และการผูกขาดตลาด",
    summary: "Apple got sued in a New Jersey Federal court by the maker of mobile video app Camo, alleging Apple stole its technology when integrating Continuity Camera into iOS 16.",
    summary_th: "Apple ถูกฟ้องในศาลรัฐ New Jersey โดยผู้พัฒนาแอป Camo กล่าวหาว่า Apple ขโมยเทคโนโลยีของตนไปใช้ใน Continuity Camera",
    url: "https://www.macrumors.com/2026/01/29/apple-continuity-camera-antitrust-lawsuit/",
    source: "MacRumors",
    category: "apple",
    published_at: "2026-01-29T04:36:00Z",
    priority_score: 75,
    priority_level: "trending",
    suggested_angle: "อธิบาย Continuity Camera คืออะไร และผลกระทบถ้า Apple แพ้คดี",
    keywords: ["Apple", "Continuity Camera", "lawsuit", "Camo"],
    status: "available",
  },
  {
    id: "n4",
    title: "BYD's new flagship EV spotted in public for the first time",
    title_th: "รถยนต์ไฟฟ้า Flagship ใหม่ของ BYD ถูกพบเห็นในที่สาธารณะครั้งแรก",
    summary: "BYD is preparing to launch several new flagship EVs in early 2026, including a pair of electric SUVs and a sedan.",
    summary_th: "BYD เตรียมเปิดตัวรถยนต์ไฟฟ้า Flagship ใหม่หลายรุ่นต้นปี 2026 รวมถึง SUV ไฟฟ้า 2 รุ่นและซีดาน",
    url: "https://electrek.co/2026/01/28/byds-new-flagship-ev-spotted-in-public-first-time/",
    source: "Electrek",
    category: "ev",
    published_at: "2026-01-28T14:00:00Z",
    priority_score: 82,
    priority_level: "trending",
    suggested_angle: "รวมข้อมูลรถ BYD รุ่นใหม่ที่จะเข้าไทยปี 2026",
    keywords: ["BYD", "EV", "flagship", "SUV"],
    status: "available",
  },
  {
    id: "n5",
    title: "US DC fast charger deployment saw astounding growth in 2025",
    title_th: "การติดตั้งสถานีชาร์จเร็ว DC ในสหรัฐฯ เติบโตอย่างน่าทึ่งในปี 2025",
    summary: "According to Paren's new report, fast charging networks set records last year, with infrastructure buildout and charging demand both jumping about 30% year-over-year.",
    summary_th: "ตามรายงานของ Paren เครือข่ายชาร์จเร็วสร้างสถิติใหม่เมื่อปีที่แล้ว โครงสร้างพื้นฐานและความต้องการชาร์จเพิ่มขึ้น 30% YoY",
    url: "https://electrek.co/2026/01/28/us-dc-fast-charger-deployment-saw-astounding-growth-in-2025/",
    source: "Electrek",
    category: "ev",
    published_at: "2026-01-28T10:00:00Z",
    priority_score: 68,
    priority_level: "trending",
    suggested_angle: "เปรียบเทียบกับสถานการณ์สถานีชาร์จในไทย",
    keywords: ["EV", "charging", "DC fast charger", "infrastructure"],
    status: "available",
  },
  {
    id: "n6",
    title: "iPhone 16 Tops List of World's Best-Selling Smartphones in 2025",
    title_th: "iPhone 16 ครองอันดับ 1 สมาร์ทโฟนขายดีที่สุดในโลกปี 2025",
    summary: "Apple's iPhone 16 was the best-selling smartphone globally in 2025. Apple claimed seven of the top 10 spots, while Samsung captured the remaining three.",
    summary_th: "iPhone 16 ของ Apple เป็นสมาร์ทโฟนขายดีที่สุดในโลกปี 2025 โดย Apple ครอง 7 อันดับจาก 10 อันดับแรก Samsung ได้ 3 อันดับ",
    url: "https://www.macrumors.com/2026/01/29/iphone-16-worlds-best-selling-phone-2025/",
    source: "MacRumors",
    category: "gadgets",
    published_at: "2026-01-29T03:24:00Z",
    priority_score: 78,
    priority_level: "trending",
    suggested_angle: "วิเคราะห์ทำไม iPhone 16 ถึงขายดีกว่า Samsung และคู่แข่ง",
    keywords: ["iPhone 16", "best-selling", "smartphone", "Apple"],
    status: "writing",
    assigned_to: "writer_a",
  },
  {
    id: "n7",
    title: "Musk admits no Optimus robots are doing 'useful work' at Tesla",
    title_th: "Musk ยอมรับยังไม่มีหุ่นยนต์ Optimus ทำงานจริงที่ Tesla",
    summary: "Elon Musk admitted on Tesla's Q4 2025 earnings call that the company doesn't have any Optimus robots doing useful work in its factories right now.",
    summary_th: "Elon Musk ยอมรับในการประชุมผลประกอบการ Q4 2025 ว่า Tesla ยังไม่มีหุ่นยนต์ Optimus ทำงานที่เป็นประโยชน์ในโรงงานเลย",
    url: "https://electrek.co/2026/01/28/musk-admits-no-optimus-robots-are-doing-useful-work-at-tesla-after-claiming-otherwise/",
    source: "Electrek",
    category: "tech",
    published_at: "2026-01-28T16:00:00Z",
    priority_score: 72,
    priority_level: "trending",
    suggested_angle: "เปรียบเทียบกับความก้าวหน้าหุ่นยนต์ของบริษัทอื่นๆ",
    keywords: ["Tesla", "Optimus", "robot", "Musk"],
    status: "available",
  },
  {
    id: "n8",
    title: "Fun Apple ad touts the iPhone 17's scratch-resistant cover glass",
    title_th: "โฆษณาสนุกๆ ของ Apple โปรโมท Ceramic Shield 2 บน iPhone 17",
    summary: "The Apple Canada YouTube channel has published a fun new ad promoting the new Ceramic Shield 2 cover glass of the iPhone 17 line.",
    summary_th: "ช่อง YouTube ของ Apple Canada เผยแพร่โฆษณาสนุกๆ โปรโมทกระจก Ceramic Shield 2 ใหม่ของ iPhone 17",
    url: "https://9to5mac.com/2026/01/13/fun-apple-ad-touts-the-iphone-17-scratch-resistant-cover-glass/",
    source: "9to5Mac",
    category: "apple",
    published_at: "2026-01-13T10:00:00Z",
    priority_score: 55,
    priority_level: "normal",
    suggested_angle: "รีวิว Ceramic Shield 2 vs กระจกกันรอยรุ่นก่อน",
    keywords: ["iPhone 17", "Ceramic Shield", "Apple", "ad"],
    status: "available",
  },
  {
    id: "n9",
    title: "iPhone 17 is MKBHD's phone of the year",
    title_th: "iPhone 17 ได้รางวัล Phone of the Year จาก MKBHD",
    summary: "The winners for this year's edition of MKBHD's Smartphone Awards have been revealed. Apple scored four recognitions out of the 10 categories.",
    summary_th: "ผู้ชนะรางวัล Smartphone Awards ของ MKBHD ประจำปีนี้ประกาศแล้ว Apple ได้รางวัล 4 สาขาจาก 10 สาขา",
    url: "https://9to5mac.com/2025/12/08/iphone-17-best-smartphone-of-the-year-mkbhd-smartphone-awards/",
    source: "9to5Mac",
    category: "apple",
    published_at: "2025-12-08T12:00:00Z",
    priority_score: 65,
    priority_level: "normal",
    suggested_angle: "สรุปรางวัลทั้งหมดที่ iPhone 17 ได้รับในปีนี้",
    keywords: ["iPhone 17", "MKBHD", "award", "smartphone"],
    status: "available",
  },
  {
    id: "n10",
    title: "Musk says unsold Cybertrucks could be used for cargo delivery",
    title_th: "Musk บอก Cybertruck ที่ขายไม่ออกอาจใช้ส่งสินค้าแทน",
    summary: "On Tesla Q4 earnings call, Musk responded to a question about Cybertruck's failed design by stating that Cybertrucks could be used for intra-city autonomous deliveries.",
    summary_th: "ในการประชุมผลประกอบการ Q4 Musk ตอบคำถามเรื่องดีไซน์ Cybertruck ที่ล้มเหลวว่าอาจใช้ Cybertruck ส่งสินค้าอัตโนมัติในเมืองแทน",
    url: "https://electrek.co/2026/01/28/musk-says-unsold-cybertrucks-could-be-used-for-cargo-heres-why-it-wont-work/",
    source: "Electrek",
    category: "ev",
    published_at: "2026-01-28T18:00:00Z",
    priority_score: 58,
    priority_level: "normal",
    suggested_angle: "วิเคราะห์ปัญหาของ Cybertruck และอนาคตของรถกระบะไฟฟ้า",
    keywords: ["Tesla", "Cybertruck", "Musk", "delivery"],
    status: "available",
  },
];

// Config objects for UI
export const priorityConfig: Record<string, { label: string; color: string; textColor: string }> = {
  hot: { label: "🔴 Hot", color: "bg-red-600", textColor: "text-red-400" },
  trending: { label: "🟡 Trending", color: "bg-yellow-600", textColor: "text-yellow-400" },
  normal: { label: "🟢 Normal", color: "bg-green-600", textColor: "text-green-400" },
  low: { label: "⚪ Low", color: "bg-gray-600", textColor: "text-gray-400" },
};

export const categoryConfig: Record<string, { label: string; color: string }> = {
  apple: { label: "🍎 Apple", color: "bg-gray-700" },
  ev: { label: "⚡ EV", color: "bg-green-700" },
  tech: { label: "💻 Tech", color: "bg-blue-700" },
  economy: { label: "💰 เศรษฐกิจ", color: "bg-yellow-700" },
  gadgets: { label: "📱 Gadgets", color: "bg-purple-700" },
};

export const statusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "📝 ว่าง", color: "bg-green-600" },
  claimed: { label: "👤 มีคนรับแล้ว", color: "bg-blue-600" },
  writing: { label: "✍️ กำลังเขียน", color: "bg-yellow-600" },
  published: { label: "✅ เผยแพร่แล้ว", color: "bg-gray-600" },
  skipped: { label: "⏭️ ข้าม", color: "bg-gray-700" },
};
