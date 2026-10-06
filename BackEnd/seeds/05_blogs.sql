-- SEO-oriented bilingual blog seeds for a dental loupe storefront
-- Constraints respected: Intro<=1000, Conclusion<=2000, Excerpt/MetaDescription<=160
-- Safe re-seed for sample ids 1..5 (keeps other blog rows untouched)

DELETE FROM public."BlogTags" WHERE "BlogId" IN (1,2,3,4,5);
DELETE FROM public."Blogs" WHERE "Id" IN (1,2,3,4,5);

INSERT INTO public."Blogs"(
    "Id", "TitleFa", "IntroFa", "ContentFa", "ConclusionFa", "ExcerptFa",
    "TitleEn", "IntroEn", "ContentEn", "ConclusionEn", "ExcerptEn",
    "MetaDescriptionFa", "MetaDescriptionEn", "MetaKeywordsFa", "MetaKeywordsEn",
    "Slug", "ThumbnailFile", "AuthorId",
    "CreatedAt", "UpdatedAt", "DeletedAt", "IsDeleted", "IsActive",
    "CreatedBy", "UpdatedBy", "DeletedBy"
) VALUES
(
    1,
    'راهنمای انتخاب بزرگ‌نمایی لوپ دندان‌پزشکی',
    $blog_1_intro_fa$<p>انتخاب بزرگ‌نمایی مناسب مهم‌ترین تصمیم هنگام خرید لوپ دندان‌پزشکی است. بزرگ‌نمایی بیشتر همیشه بهتر نیست؛ هر چه بزرگ‌نمایی بالاتر می‌رود، میدان دید و عمق میدان کمتر می‌شود.</p><p>در این راهنما بزرگ‌نمایی‌های ۲.۵ تا ۶ برابر را با نوع کار بالینی مقایسه می‌کنیم.</p>$blog_1_intro_fa$,
    $blog_1_content_fa$<h2>بزرگ‌نمایی چه تأثیری روی کار بالینی دارد؟</h2>
<p>لوپ جزئیات ناحیه کار را بزرگ می‌کند، اما در برابر آن میدان دید و عمق میدان را کاهش می‌دهد. پس هدف پیدا کردن بزرگ‌نمایی «کافی» است، نه بیشینه.</p>
<h2>انتخاب بر اساس نوع کار</h2>
<table>
  <thead><tr><th>بزرگ‌نمایی</th><th>کاربرد رایج</th><th>مزیت</th></tr></thead>
  <tbody>
    <tr><td>۲.۵ برابر</td><td>معاینه، جرم‌گیری، کارهای عمومی</td><td>میدان دید وسیع و وزن کم</td></tr>
    <tr><td>۳.۵ برابر</td><td>ترمیمی، پروتز، اندو سطحی</td><td>تعادل میان جزئیات و میدان دید</td></tr>
    <tr><td>۴.۵ تا ۶ برابر</td><td>اندو، جراحی، کارهای بسیار دقیق</td><td>جزئیات بیشتر برای کارهای ظریف</td></tr>
  </tbody>
</table>
<h2>نکاتی که قبل از خرید باید بدانید</h2>
<ul>
  <li>برای شروع، بزرگ‌نمایی ۲.۵ تا ۳.۵ برابر معمولاً راحت‌تر تطبیق پیدا می‌کند.</li>
  <li>فاصله کاری را با قد و حالت نشستن خود تنظیم کنید.</li>
  <li>وزن لوپ را هم در نظر بگیرید؛ بزرگ‌نمایی بالاتر معمولاً سنگین‌تر است.</li>
</ul>
<h2>سؤالات پرتکرار</h2>
<h3>آیا بزرگ‌نمایی ۶ برابر برای همه مناسب است؟</h3>
<p>خیر. برای کارهای عمومی میدان دید را زیادی محدود می‌کند و تطبیق با آن زمان‌بر است.</p>
<h3>می‌توان بعداً لنز را ارتقا داد؟</h3>
<p>در بسیاری از مدل‌ها بله؛ هنگام خرید به سازگاری لنز جایگزین توجه کنید.</p>$blog_1_content_fa$,
    $blog_1_conclusion_fa$<p>بزرگ‌نمایی مناسب به نوع کار، فاصله کاری و تجربه شما بستگی دارد. اگر مطمئن نیستید، با ۳.۵ برابر شروع کنید و بعد از چند هفته کار، نیاز واقعی‌تان را بسنجید.</p>$blog_1_conclusion_fa$,
    'بزرگ‌نمایی ۲.۵ تا ۶ برابر لوپ دندان‌پزشکی را بر اساس نوع کار بالینی مقایسه و انتخاب کنید.',
    'How to Choose Dental Loupe Magnification',
    $blog_1_intro_en$<p>Choosing the right magnification is the most important decision when buying dental loupes. Higher is not always better: as magnification rises, field of view and depth of field shrink.</p><p>This guide compares 2.5x to 6x magnification against real clinical work.</p>$blog_1_intro_en$,
    $blog_1_content_en$<h2>How magnification affects clinical work</h2>
<p>Loupes enlarge the working area, but they trade away field of view and depth of field. The goal is “enough” magnification, not maximum.</p>
<h2>Choosing by type of work</h2>
<table>
  <thead><tr><th>Magnification</th><th>Typical use</th><th>Advantage</th></tr></thead>
  <tbody>
    <tr><td>2.5x</td><td>Examination, scaling, general work</td><td>Wide field and low weight</td></tr>
    <tr><td>3.5x</td><td>Restorative, prosthetics, shallow endo</td><td>Balance of detail and field</td></tr>
    <tr><td>4.5x to 6x</td><td>Endo, surgery, very fine work</td><td>More detail for delicate tasks</td></tr>
  </tbody>
</table>
<h2>What to know before buying</h2>
<ul>
  <li>For a first pair, 2.5x to 3.5x is usually easier to adapt to.</li>
  <li>Set the working distance for your height and seated posture.</li>
  <li>Consider weight; higher magnification is usually heavier.</li>
</ul>
<h2>Frequently asked questions</h2>
<h3>Is 6x right for everyone?</h3>
<p>No. For general work it narrows the field too much and takes longer to adapt to.</p>
<h3>Can I upgrade the lenses later?</h3>
<p>On many models, yes; check replacement-lens compatibility before you buy.</p>$blog_1_content_en$,
    $blog_1_conclusion_en$<p>The right magnification depends on your work, working distance and experience. If unsure, start with 3.5x and reassess your real needs after a few weeks of use.</p>$blog_1_conclusion_en$,
    'Compare 2.5x to 6x dental loupe magnification by clinical task and pick the one that fits your daily work.',
    'راهنمای انتخاب بزرگ‌نمایی لوپ دندان‌پزشکی: مقایسه ۲.۵، ۳.۵ و ۶ برابر بر اساس میدان دید، عمق میدان و نوع کار.',
    'Dental loupe magnification guide: compare 2.5x, 3.5x and 6x by field of view, depth of field and type of work.',
    'لوپ دندان‌پزشکی, بزرگ‌نمایی لوپ, لوپ ۳.۵ برابر, خرید لوپ, لوپ پریزماتیک',
    'dental loupes, loupe magnification, 3.5x loupes, buy dental loupes, prismatic loupes',
    'choosing-dental-loupe-magnification',
    'loupe-magnification.jpg',
    1,
    '2026-01-16 10:00:00', '2026-01-16 10:00:00', NULL, false, true, 1, 1, NULL
),
(
    2,
    'تفاوت لوپ گالیله‌ای و پریزماتیک چیست؟',
    $blog_2_intro_fa$<p>لوپ‌های دندان‌پزشکی از نظر ساختار اپتیکی به دو دسته گالیله‌ای و پریزماتیک تقسیم می‌شوند. هر کدام نقاط قوت و محدودیت‌های خودشان را دارند.</p><p>این مقایسه کمک می‌کند بر اساس بودجه و نوع کار تصمیم بگیرید.</p>$blog_2_intro_fa$,
    $blog_2_content_fa$<h2>ساختار اپتیکی</h2>
<p>لوپ گالیله‌ای از عدسی‌های ساده استفاده می‌کند و سبک‌تر است. لوپ پریزماتیک با منشور مسیر نور را تا می‌کند و تصویر روشن‌تر و بزرگ‌نمایی بالاتری ارائه می‌دهد.</p>
<h2>مقایسه سریع</h2>
<table>
  <thead><tr><th>معیار</th><th>گالیله‌ای</th><th>پریزماتیک</th></tr></thead>
  <tbody>
    <tr><td>وزن</td><td>کمتر</td><td>بیشتر</td></tr>
    <tr><td>بزرگ‌نمایی رایج</td><td>۲.۵ تا ۳.۵ برابر</td><td>۳.۵ تا ۶ برابر</td></tr>
    <tr><td>میدان دید و وضوح</td><td>مناسب</td><td>وسیع‌تر و شفاف‌تر</td></tr>
    <tr><td>قیمت</td><td>مقرون‌به‌صرفه‌تر</td><td>بالاتر</td></tr>
  </tbody>
</table>
<h2>کدام را انتخاب کنم؟</h2>
<ul>
  <li>برای شروع و کارهای عمومی: گالیله‌ای.</li>
  <li>برای اندو، ترمیمی دقیق و جراحی: پریزماتیک.</li>
</ul>
<h2>سؤال پرتکرار</h2>
<h3>آیا لوپ پریزماتیک خیلی سنگین است؟</h3>
<p>سنگین‌تر است، اما مدل‌های جدید با فریم تیتانیومی فشار را کم می‌کنند.</p>$blog_2_content_fa$,
    $blog_2_conclusion_fa$<p>اگر بودجه و وزن اولویت شماست، گالیله‌ای انتخاب خوبی است. اگر وضوح و بزرگ‌نمایی بالاتر لازم دارید، پریزماتیک سرمایه‌گذاری بهتری است.</p>$blog_2_conclusion_fa$,
    'تفاوت لوپ گالیله‌ای و پریزماتیک را از نظر وزن، بزرگ‌نمایی، وضوح و قیمت بشناسید.',
    'Galilean vs Prismatic Dental Loupes',
    $blog_2_intro_en$<p>Dental loupes fall into two optical designs: Galilean and prismatic. Each has its own strengths and limits.</p><p>This comparison helps you decide based on budget and type of work.</p>$blog_2_intro_en$,
    $blog_2_content_en$<h2>Optical design</h2>
<p>Galilean loupes use simple lenses and are lighter. Prismatic loupes fold the light path with prisms, giving a brighter image and higher magnification.</p>
<h2>Quick comparison</h2>
<table>
  <thead><tr><th>Criterion</th><th>Galilean</th><th>Prismatic</th></tr></thead>
  <tbody>
    <tr><td>Weight</td><td>Lower</td><td>Higher</td></tr>
    <tr><td>Common magnification</td><td>2.5x to 3.5x</td><td>3.5x to 6x</td></tr>
    <tr><td>Field and clarity</td><td>Good</td><td>Wider and sharper</td></tr>
    <tr><td>Price</td><td>More affordable</td><td>Higher</td></tr>
  </tbody>
</table>
<h2>Which should I choose?</h2>
<ul>
  <li>For a first pair and general work: Galilean.</li>
  <li>For endo, fine restorative and surgery: prismatic.</li>
</ul>
<h2>Frequently asked question</h2>
<h3>Are prismatic loupes too heavy?</h3>
<p>They are heavier, but newer models with titanium frames reduce the strain.</p>$blog_2_content_en$,
    $blog_2_conclusion_en$<p>If budget and weight are your priorities, Galilean is a good choice. If you need higher clarity and magnification, prismatic is the better investment.</p>$blog_2_conclusion_en$,
    'Understand the difference between Galilean and prismatic loupes in weight, magnification, clarity and price.',
    'مقایسه لوپ گالیله‌ای و پریزماتیک دندان‌پزشکی از نظر وزن، بزرگ‌نمایی، میدان دید و قیمت برای انتخاب بهتر.',
    'Galilean vs prismatic dental loupes compared by weight, magnification, field of view and price to help you choose.',
    'لوپ گالیله‌ای, لوپ پریزماتیک, مقایسه لوپ, لوپ دندان‌پزشکی, خرید لوپ',
    'galilean loupes, prismatic loupes, loupe comparison, dental loupes, buy loupes',
    'galilean-vs-prismatic-dental-loupes',
    'galilean-vs-prismatic.jpg',
    1,
    '2026-01-18 10:00:00', '2026-01-18 10:00:00', NULL, false, true, 1, 1, NULL
),
(
    3,
    'ارگونومی و فاصله کاری در لوپ دندان‌پزشکی',
    $blog_3_intro_fa$<p>لوپ فقط برای دیدن بهتر نیست؛ اگر درست تنظیم شود، فشار روی گردن و کمر را هم کم می‌کند. زاویه دید و فاصله کاری دو عامل کلیدی ارگونومی هستند.</p>$blog_3_intro_fa$,
    $blog_3_content_fa$<h2>فاصله کاری چیست؟</h2>
<p>فاصله بین چشم و ناحیه کار که تصویر در آن واضح‌ترین حالت را دارد. با قد و حالت نشستن شما تعیین می‌شود.</p>
<h2>زاویه دید (Declination)</h2>
<p>زاویه رو به پایین لنزها نسبت به راستای چشم. زاویه مناسب اجازه می‌دهد سر را کمتر خم کنید.</p>
<h2>چک‌لیست تنظیم</h2>
<ul>
  <li>پشت صاف و شانه‌ها آزاد باشد.</li>
  <li>بدون خم‌کردن زیاد گردن، ناحیه کار واضح باشد.</li>
  <li>فاصله مردمک‌ها (IPD) درست تنظیم شده باشد.</li>
</ul>
<h2>سؤال پرتکرار</h2>
<h3>آیا لوپ سفارشی بهتر است؟</h3>
<p>برای ارگونومی بله، چون با قد و حالت کاری شما تنظیم می‌شود.</p>$blog_3_content_fa$,
    $blog_3_conclusion_fa$<p>تنظیم درست فاصله کاری و زاویه دید، مزیت اصلی لوپ را برای سلامت ستون فقرات شما فراهم می‌کند. هنگام خرید حتماً این مقادیر را اندازه‌گیری کنید.</p>$blog_3_conclusion_fa$,
    'با تنظیم درست فاصله کاری و زاویه دید لوپ، فشار روی گردن و کمر را در کار بالینی کاهش دهید.',
    'Ergonomics and Working Distance in Dental Loupes',
    $blog_3_intro_en$<p>Loupes are not only for seeing better; set up correctly they also reduce strain on the neck and back. Declination angle and working distance are the two key ergonomic factors.</p>$blog_3_intro_en$,
    $blog_3_content_en$<h2>What is working distance?</h2>
<p>The distance between your eyes and the work area where the image is sharpest. It depends on your height and seated posture.</p>
<h2>Declination angle</h2>
<p>The downward tilt of the lenses relative to your eye line. A good angle lets you bend your head less.</p>
<h2>Setup checklist</h2>
<ul>
  <li>Back straight and shoulders relaxed.</li>
  <li>Work area sharp without bending the neck excessively.</li>
  <li>Interpupillary distance (IPD) set correctly.</li>
</ul>
<h2>Frequently asked question</h2>
<h3>Are custom loupes better?</h3>
<p>For ergonomics, yes, because they are set to your height and working posture.</p>$blog_3_content_en$,
    $blog_3_conclusion_en$<p>Correct working distance and declination deliver the main benefit of loupes for your spine health. Measure these values when you buy.</p>$blog_3_conclusion_en$,
    'Reduce neck and back strain by setting loupe working distance and declination angle correctly.',
    'ارگونومی لوپ دندان‌پزشکی: تنظیم فاصله کاری، زاویه دید و IPD برای کاهش فشار روی گردن و کمر.',
    'Dental loupe ergonomics: set working distance, declination angle and IPD to reduce neck and back strain.',
    'ارگونومی دندان‌پزشکی, فاصله کاری لوپ, زاویه دید لوپ, لوپ سفارشی, IPD',
    'dental ergonomics, loupe working distance, declination angle, custom loupes, IPD',
    'ergonomics-working-distance-dental-loupes',
    'loupe-ergonomics.jpg',
    1,
    '2026-01-20 10:00:00', '2026-01-20 10:00:00', NULL, false, true, 1, 1, NULL
),
(
    4,
    'راهنمای خرید هدلایت LED دندان‌پزشکی',
    $blog_4_intro_fa$<p>نور کافی در کنار لوپ، دقت کار را به‌طور محسوس بالا می‌برد. هدلایت LED مناسب باید روشن، یکنواخت و سبک باشد.</p><p>در این راهنما معیارهای اصلی انتخاب را مرور می‌کنیم.</p>$blog_4_intro_fa$,
    $blog_4_content_fa$<h2>معیارهای اصلی انتخاب</h2>
<table>
  <thead><tr><th>معیار</th><th>چرا مهم است؟</th></tr></thead>
  <tbody>
    <tr><td>شدت نور (لوکس)</td><td>نورپردازی کافی برای جزئیات ریز</td></tr>
    <tr><td>دمای رنگ</td><td>نور سفید طبیعی، تشخیص بهتر رنگ بافت</td></tr>
    <tr><td>اندازه لکه نوری</td><td>پوشش میدان کار بدون بازتاب اضافه</td></tr>
    <tr><td>وزن و باتری</td><td>راحتی در جلسات طولانی</td></tr>
  </tbody>
</table>
<h2>بی‌سیم یا سیم‌دار؟</h2>
<ul>
  <li>بی‌سیم: آزادی حرکت بیشتر، نیاز به شارژ و باتری رزرو.</li>
  <li>سیم‌دار: وزن کمتر روی سر، وابسته به کابل و منبع تغذیه.</li>
</ul>
<h2>سؤال پرتکرار</h2>
<h3>باتری یک روز کاری کامل را پوشش می‌دهد؟</h3>
<p>بسیاری از مدل‌ها بله؛ برای اطمینان یک باتری رزرو تهیه کنید.</p>$blog_4_content_fa$,
    $blog_4_conclusion_fa$<p>هدلایت مناسب باید نور یکنواخت، وزن کم و باتری قابل اعتماد داشته باشد. پیش از خرید از سازگاری آن با فریم لوپ خود مطمئن شوید.</p>$blog_4_conclusion_fa$,
    'معیارهای انتخاب هدلایت LED دندان‌پزشکی: شدت نور، دمای رنگ، اندازه لکه نوری، وزن و باتری.',
    'Dental LED Headlight Buying Guide',
    $blog_4_intro_en$<p>Good light alongside your loupes noticeably improves precision. A suitable LED headlight should be bright, even and light.</p><p>This guide reviews the main selection criteria.</p>$blog_4_intro_en$,
    $blog_4_content_en$<h2>Main selection criteria</h2>
<table>
  <thead><tr><th>Criterion</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>Brightness (lux)</td><td>Enough light for fine detail</td></tr>
    <tr><td>Color temperature</td><td>Natural white light for better tissue color judgment</td></tr>
    <tr><td>Spot size</td><td>Covers the field without extra glare</td></tr>
    <tr><td>Weight and battery</td><td>Comfort in long sessions</td></tr>
  </tbody>
</table>
<h2>Wireless or wired?</h2>
<ul>
  <li>Wireless: more freedom of movement, needs charging and a spare battery.</li>
  <li>Wired: less weight on the head, depends on a cable and power pack.</li>
</ul>
<h2>Frequently asked question</h2>
<h3>Does the battery last a full working day?</h3>
<p>Many models do; for peace of mind, keep a spare battery.</p>$blog_4_content_en$,
    $blog_4_conclusion_en$<p>A good headlight offers even light, low weight and a reliable battery. Confirm compatibility with your loupe frame before buying.</p>$blog_4_conclusion_en$,
    'Dental LED headlight criteria: brightness, color temperature, spot size, weight and battery.',
    'راهنمای خرید هدلایت LED دندان‌پزشکی: شدت نور، دمای رنگ، وزن، باتری و مقایسه مدل بی‌سیم و سیم‌دار.',
    'Dental LED headlight buying guide: brightness, color temperature, weight, battery and wireless vs wired.',
    'هدلایت دندان‌پزشکی, هدلایت LED, هدلایت بی‌سیم, نورپردازی لوپ, خرید هدلایت',
    'dental headlight, LED headlight, wireless headlight, loupe lighting, buy headlight',
    'dental-led-headlight-buying-guide',
    'led-headlight.jpg',
    1,
    '2026-01-22 10:00:00', '2026-01-22 10:00:00', NULL, false, true, 1, 1, NULL
),
(
    5,
    'نگهداری و تمیزکاری لوپ دندان‌پزشکی',
    $blog_5_intro_fa$<p>لنز لوپ سرمایه‌ای حساس است. تمیزکاری نادرست می‌تواند پوشش ضدبازتاب را خراب کند و تصویر را کدر کند.</p>$blog_5_intro_fa$,
    $blog_5_content_fa$<h2>تمیزکاری روزانه</h2>
<ol>
  <li>ابتدا گرد و غبار را با برس نرم یا دم‌کن بردارید.</li>
  <li>چند قطره مایع مخصوص لنز روی دستمال میکروفایبر بریزید، نه مستقیم روی لنز.</li>
  <li>با حرکت ملایم دایره‌ای پاک کنید.</li>
</ol>
<h2>اشتباهات رایج</h2>
<ul>
  <li>استفاده از دستمال کاغذی یا لباس.</li>
  <li>استفاده از الکل غلیظ یا مواد شوینده قوی.</li>
  <li>گذاشتن لوپ بدون کاور روی میز کار.</li>
</ul>
<h2>نگهداری</h2>
<p>پس از کار لوپ را در کیف محافظ بگذارید و از تماس با گرما و رطوبت دور نگه دارید.</p>
<h2>سؤال پرتکرار</h2>
<h3>هر چند وقت یک‌بار باید لوپ سرویس شود؟</h3>
<p>یک بررسی دوره‌ای سالانه برای تنظیم فریم و لنز توصیه می‌شود.</p>$blog_5_content_fa$,
    $blog_5_conclusion_fa$<p>تمیزکاری ملایم و نگهداری در کیف محافظ عمر لوپ را زیاد می‌کند. از کیت تمیزکاری مخصوص لنز استفاده کنید.</p>$blog_5_conclusion_fa$,
    'روش درست تمیزکاری و نگهداری لنز و فریم لوپ دندان‌پزشکی برای جلوگیری از خط‌وخش و کدری.',
    'Dental Loupe Care and Cleaning',
    $blog_5_intro_en$<p>Loupe lenses are a delicate investment. Improper cleaning can damage the anti-reflective coating and cloud the image.</p>$blog_5_intro_en$,
    $blog_5_content_en$<h2>Daily cleaning</h2>
<ol>
  <li>First remove dust with a soft brush or blower.</li>
  <li>Put a few drops of lens cleaner on a microfiber cloth, not directly on the lens.</li>
  <li>Wipe with gentle circular motions.</li>
</ol>
<h2>Common mistakes</h2>
<ul>
  <li>Using paper towels or clothing.</li>
  <li>Using strong alcohol or harsh detergents.</li>
  <li>Leaving loupes uncovered on the work counter.</li>
</ul>
<h2>Storage</h2>
<p>After work, keep loupes in a protective case, away from heat and humidity.</p>
<h2>Frequently asked question</h2>
<h3>How often should loupes be serviced?</h3>
<p>An annual check for frame and lens alignment is recommended.</p>$blog_5_content_en$,
    $blog_5_conclusion_en$<p>Gentle cleaning and storage in a protective case extend the life of your loupes. Use a dedicated lens cleaning kit.</p>$blog_5_conclusion_en$,
    'The right way to clean and store dental loupe lenses and frames to avoid scratches and haze.',
    'نگهداری و تمیزکاری لوپ دندان‌پزشکی: روش درست پاک‌کردن لنز، اشتباهات رایج و نکات نگهداری.',
    'Dental loupe care and cleaning: how to clean lenses correctly, common mistakes and storage tips.',
    'تمیزکاری لوپ, نگهداری لوپ, کیت تمیزکاری لنز, لوپ دندان‌پزشکی, مراقبت از لنز',
    'loupe cleaning, loupe care, lens cleaning kit, dental loupes, lens care',
    'dental-loupe-care-and-cleaning',
    'loupe-care.jpg',
    1,
    '2026-01-24 10:00:00', '2026-01-24 10:00:00', NULL, false, true, 1, 1, NULL
);
