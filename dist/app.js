'use strict';
const strings={
ru:{brand:'Библиотека арабского языка',title:'Библиотека Мединского курса',library:'Библиотека',eyebrow:'Учебные материалы',intro:'Четыре уровня. Все книги по порядку. Выберите уровень, чтобы перейти к материалам.',level:'Уровень',levels:['Первый уровень','Второй уровень','Третий уровень','Четвёртый уровень'],materials:'материалов',sourceBooks:'Основная программа',extra:'Дополнительные материалы',settings:'Настройки',close:'Закрыть настройки',language:'Язык интерфейса',scale:'Масштаб сайта',minus:'Уменьшить масштаб',plus:'Увеличить масштаб',reset:'Сбросить до 100%',scaleHelp:'Меняется размер материалов. Эта панель остаётся на месте.',search:'Найти материал',placeholder:'Название на русском, арабском или английском',open:'Открыть',download:'Скачать PDF',html:'Онлайн-книга · HTML',pdf:'PDF',pending:'PDF пока не добавлен',quranPending:'PDF Корана пока не добавлен.',dictPending:'Ожидается словарь этого уровня.',noResults:'Материалы не найдены.',notFound:'Материал не найден',back:'К библиотеке',source:'Исходный каталог',footer:'Состав и порядок основной программы:',original:'Материал на языке оригинала.',shared:'Один PDF для двух уровней',count:'Основная программа',rules:'Правила',dictionary:'Словарь'},
en:{brand:'Arabic Language Library',title:'Madinah course library',library:'Library',eyebrow:'Learning materials',intro:'Four levels. Every book in order. Choose a level to explore its materials.',level:'Level',levels:['First level','Second level','Third level','Fourth level'],materials:'materials',sourceBooks:'Core curriculum',extra:'Additional materials',settings:'Settings',close:'Close settings',language:'Interface language',scale:'Site scale',minus:'Decrease scale',plus:'Increase scale',reset:'Reset to 100%',scaleHelp:'Materials change size. This panel stays in place.',search:'Find a material',placeholder:'Title in English, Arabic or Russian',open:'Open',download:'Download PDF',html:'Online book · HTML',pdf:'PDF',pending:'PDF not yet added',quranPending:'Quran PDF has not been added yet.',dictPending:'Awaiting this level’s dictionary.',noResults:'No materials found.',notFound:'Material not found',back:'Back to library',source:'Original catalogue',footer:'Core curriculum and order from:',original:'Material in its original language.',shared:'One PDF for two levels',count:'Core curriculum',rules:'Rules',dictionary:'Dictionary'},
ar:{brand:'مكتبة اللغة العربية',title:'مكتبة دروس المدينة',library:'المكتبة',eyebrow:'المواد الدراسية',intro:'أربعة مستويات. جميع الكتب مرتبة. اختر المستوى للاطلاع على مواده.',level:'المستوى',levels:['المستوى الأول','المستوى الثاني','المستوى الثالث','المستوى الرابع'],materials:'مواد',sourceBooks:'المنهج الأساسي',extra:'مواد إضافية',settings:'الإعدادات',close:'إغلاق الإعدادات',language:'لغة الواجهة',scale:'حجم الموقع',minus:'تصغير الحجم',plus:'تكبير الحجم',reset:'إعادة إلى 100%',scaleHelp:'يتغير حجم المواد وتبقى هذه اللوحة في مكانها.',search:'البحث عن مادة',placeholder:'العنوان بالعربية أو الروسية أو الإنجليزية',open:'فتح',download:'تنزيل PDF',html:'كتاب إلكتروني · HTML',pdf:'PDF',pending:'لم يُضف ملف PDF بعد',quranPending:'لم يُضف ملف القرآن بعد.',dictPending:'بانتظار معجم هذا المستوى.',noResults:'لم يتم العثور على مواد.',notFound:'المادة غير موجودة',back:'العودة إلى المكتبة',source:'الفهرس الأصلي',footer:'المنهج الأساسي وترتيبه من:',original:'المادة بلغتها الأصلية.',shared:'ملف واحد لمستويين',count:'المنهج الأساسي',rules:'القواعد',dictionary:'المعجم'}
};
const $=id=>document.getElementById(id);const read=(k,d)=>{try{return localStorage.getItem(k)||d}catch{return d}};const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
let lang=read('medina-language','ru');if(!strings[lang])lang='ru';let scale=Number(read('medina-scale','100'));if(!Number.isFinite(scale))scale=100;scale=Math.max(80,Math.min(180,scale));let programs=[];let query='';const scrolls=new Map();let previous=location.hash||'#/';
const emptyMaterials=()=>({ru:'Материалы пока не добавлены',en:'No materials added yet',ar:'لم تُضف المواد بعد'}[lang]);
const t=k=>strings[lang][k];const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function anchor(){const els=[...document.querySelectorAll('[data-anchor]')];const el=els.find(e=>e.getBoundingClientRect().bottom>20);return el?{id:el.dataset.anchor,top:el.getBoundingClientRect().top}:null}
function restore(a){if(!a)return;const el=document.querySelector(`[data-anchor="${a.id}"]`);if(el)window.scrollBy(0,el.getBoundingClientRect().top-a.top)}
function setScale(value){const a=anchor();scale=Math.max(80,Math.min(180,value));$('main').style.fontSize=scale/100+'em';$('scale').textContent=scale+'%';$('minus').disabled=scale===80;$('plus').disabled=scale===180;save('medina-scale',scale);restore(a)}
function shell(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=t('brand');$('brand').textContent=t('brand');$('settings-toggle').textContent=t('settings');$('settings-title').textContent=t('settings');$('language-label').textContent=t('language');$('language').value=lang;$('scale-label').textContent=t('scale');$('scale-help').textContent=t('scaleHelp');$('close').setAttribute('aria-label',t('close'));$('minus').setAttribute('aria-label',t('minus'));$('plus').setAttribute('aria-label',t('plus'));$('reset').textContent=t('reset');$('source-label').textContent=t('source');$('footer-text').textContent=t('footer');document.querySelector('.skip').textContent=t('sourceBooks');document.querySelector('.brand').setAttribute('aria-label',t('library'));}
const levelTitle=level=>level.title?.[lang]||t('levels')[level.id-1]||t('level')+' '+level.id;
function crumb(level,book,program){return `<nav class="breadcrumbs" aria-label="${esc(t('library'))}"><a href="#/">${t('library')}</a>${level?`<span>/</span><a href="#/program/${program.id}">${esc(program.title[lang])}</a><span>/</span>${book?`<a href="#/program/${program.id}/level/${level.id}">${levelTitle(level)}</a>`:`<span>${levelTitle(level)}</span>`}`:''}${book?`<span>/</span><span>${esc(book.title[lang])}</span>`:''}</nav>`}
const meta=b=>b.pdf||b.sourceFormat==='pdf'?t('pdf'):b.sourceUrl?t('html'):t('pending');
function card(b,l,program,index){return `<a class="book-card" data-anchor="${b.id}" href="#/program/${program.id}/level/${l.id}/book/${b.id}"><h2 class="course-card-heading">${renderCourseBookIcon('',index)}<span>${esc(b.title[lang])}</span></h2>${lang!=='ar'?`<p class="original" lang="ar" dir="rtl">${esc(b.title.ar)}</p>`:''}${b.note?`<p class="meta">${esc(b.note[lang])}</p>`:''}<span class="tag">${meta(b)}</span></a>`}
function list(l,program){const books=l.books.filter(b=>Object.values(b.title).some(v=>v.toLowerCase().includes(query.toLowerCase())));let out='';for(const extra of [false,true]){const items=books.filter(b=>['rules','dictionary'].includes(b.kind)===extra);if(items.length)out+=`<section aria-label="${extra?t('extra'):t('sourceBooks')}"><h2 class="section-title">${extra?t('extra'):t('sourceBooks')}</h2><div class="books">${items.map((b,index)=>card(b,l,program,index)).join('')}</div></section>`}return out||`<p class="empty">${l.books.length?t('noResults'):emptyMaterials()}</p>`}
function renderMedinaCover(level) {
  const alt = level
    ? {ru:'Обложка курса Абу Аделя',en:'Cover of Abu Adel’s course',ar:'غلاف دورة أبي عادل'}[lang]
    : {ru:'Обложка Мединского курса',en:'Madinah Course cover',ar:'غلاف دروس المدينة'}[lang];
  const file = level ? 'abu-adel-cover.jpg' : 'medina-cover.jpg';
  const dimensions = level ? 'width="372" height="537"' : 'width="387" height="516"';
  return `<img class="program-cover" src="images/${file}" ${dimensions} alt="${alt}">`;
}
function renderSectionCover(program, level) {
  if (program.id === 'medina' && level.id === 5) return renderMedinaCover(level);
  if (program.id !== 'quran' || level.id !== 2) return '';
  const alt = {ru:'Три тома «Значения слов Благородного Корана»',en:'Three volumes of Meanings of the Words of the Noble Quran',ar:'المجلدات الثلاثة من معاني كلمات القرآن الكريم'}[lang];
  return renderCoverStage(`<img class="program-cover" src="images/quran-word-meanings.webp" width="1440" height="672" alt="${alt}">`);
}

function programCoverImage(program) {
  if (program.id === 'tuhfa-azhariyya') {
    return `<img class="program-cover" src="images/tuhfa-azhariyya.webp" width="2400" height="2080" alt="${esc(program.title[lang])}">`;
  }
  if (program.id === 'medina') return renderMedinaCover();
  if (program.id === 'attakallum') {
    const alt = {ru:'Комплект учебников «Ат-Такаллюм»',en:'At-Takallum textbook set',ar:'مجموعة كتب التكلم'}[lang];
    return `<img class="program-cover" src="images/takallum-cover.jpg" width="720" height="440" alt="${alt}">`;
  }
  if (program.id === 'arabic-between-your-hands') {
    const alt = {ru:'Учебники «Арабский перед тобой», тома 1–4',en:'Arabic Between Your Hands textbooks, volumes 1–4',ar:'كتب العربية بين يديك، المجلدات ١–٤'}[lang];
    return `<img class="program-cover" src="images/bayna-cover.jpg" width="1080" height="1080" alt="${alt}">`;
  }
  if (program.id !== 'miftah') return '';
  const alt = {ru:'Учебники «Мифтах аль-Арабия» от A0 до B2',en:'Miftah Al-Arabiyyah textbooks from A0 to B2',ar:'كتب مفتاح العربية من المستوى A0 إلى B2'}[lang];
  return `<img class="program-cover" src="images/miftah-levels.jpg" width="703" height="836" alt="${alt}">`;
}
function renderProgramCover(program) {
  const image = programCoverImage(program);
  const animate = lastCourseAnimationRoute !== location.hash;
  if (!image) return `<div class="program-neutral">${renderBookScene(animate)}</div>`;
  return renderCoverStage(image);
}

function renderCoverStage(image) {
  const animate = lastCourseAnimationRoute !== location.hash;
  const effect = animate ? ' program-cover-enter' : '';
  return `<div class="program-cover-stage${effect}">
    ${image}
    ${animate ? renderBookScene(true) : ''}
  </div>`;
}

function prepareProgramCover() {
  const stage = $('main').querySelector('.program-cover-enter');
  if (!stage || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const image = stage.querySelector('img');
  image.decode().then(() => {
    if (stage.isConnected) stage.classList.add('program-cover-ready');
  }).catch(() => {
    if (stage.isConnected) stage.classList.add('program-cover-fallback');
  });
}

function renderPdfLoadingNote() {
  const message = {
    ru: 'Большие PDF могут загружаться дольше. После открытия или скачивания подождите, пока файл загрузится на ваше устройство.',
    en: 'Large PDFs may take longer to load. After opening or downloading a file, allow time for it to load on your device.',
    ar: 'قد تستغرق ملفات PDF الكبيرة وقتًا أطول. بعد الفتح أو التنزيل، انتظر حتى يكتمل تحميل الملف على جهازك.'
  }[lang];
  return `<p class="note pdf-loading-note">${message}</p>`;
}
const bookCoverColors = ['#17463d', '#41665a', '#2f594b', '#31534d', '#507060', '#234b42'];
let hasPlayedLibraryIntro = false;

function renderBookScene(animate) {
  return `<div class="book-scene${animate ? ' book-scene-intro' : ''}" aria-hidden="true">
      <div class="book-shadow"></div>
      <div class="book-model">
        <div class="book-base"></div>
        <div class="book-page-stack"></div>
        <div class="book-spine"></div>
        <div class="book-turn book-jacket"><span></span><span></span></div>
        <div class="book-turn book-leaf book-leaf-first"><span></span><span></span></div>
        <div class="book-turn book-leaf book-leaf-second"><span></span><span></span></div>
      </div>
    </div>`;
}

function renderLibraryIntro(heading) {
  const description = {
    ru: 'Курсы арабского языка, учебники, рабочие тетради и словари.',
    en: 'Arabic courses, textbooks, workbooks, and dictionaries.',
    ar: 'دورات لتعلّم العربية وكتب دراسية وكتب تدريبات ومعاجم.'
  }[lang];
  const animate = !hasPlayedLibraryIntro;
  hasPlayedLibraryIntro = true;
  return `<header class="library-hero${animate ? ' library-hero-intro' : ''}">
    <div class="library-hero-copy">
      <h1 data-anchor="heading">${heading}</h1>
      <p>${description}</p>
    </div>
    ${renderBookScene(animate)}
    <blockquote class="library-wisdom">
      <p class="wisdom-arabic" lang="ar" dir="rtl">الْعِلْمُ مَا نَفَعَ، لَيْسَ الْعِلْمُ مَا حُفِظَ.</p>
      <p class="wisdom-translation" lang="ru" dir="ltr">Знание — то, что приносит пользу, а не то, что выучено наизусть</p>
      <cite lang="ru" dir="ltr">Имам аш-Шафи‘и</cite>
    </blockquote>
  </header>`;
}

function coverLabel(level) {
  if (level.coverLabel) return level.coverLabel;
  if (!level.title || /^Volume \d+$/.test(level.title.en)) return String(level.id);
  return /^[A-C][0-2]$/.test(level.title.en) ? level.title.en : '';
}

function renderCourseBookIcon(label = '', index = 0) {
  const color = bookCoverColors[index % bookCoverColors.length];
  return `<span class="course-card-book" aria-hidden="true" style="--cover:${color}"><span>${esc(label)}</span></span>`;
}

function renderLevels(program) {
  return `<div class="levels">${program.levels.map((level, index) => `
    <a class="level-card" href="#/program/${program.id}/level/${level.id}" data-anchor="level-${level.id}">
      <h2 class="course-card-heading">${renderCourseBookIcon(coverLabel(level), index)}<span>${esc(levelTitle(level))}</span></h2>
    </a>`).join('')}</div>`;
}

let lastCourseAnimationRoute;
let courseBookObserver;

function animateCourseBooks(route) {
  courseBookObserver?.disconnect();
  if (route === lastCourseAnimationRoute) return;
  lastCourseAnimationRoute = route;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const icons = [...document.querySelectorAll('#main .course-card-book')];
  if (!icons.length) return;
  courseBookObserver = new IntersectionObserver((entries, observer) => {
    const visible = entries.filter(entry => entry.isIntersecting)
      .sort((left, right) => icons.indexOf(left.target) - icons.indexOf(right.target));
    visible.forEach(({target}, index) => {
      target.style.setProperty('--course-book-delay', `${Math.min(index, 5) * 150}ms`);
      target.classList.add('course-card-book-enter');
      observer.unobserve(target);
    });
  }, {threshold: .15});
  icons.forEach(icon => courseBookObserver.observe(icon));
}

function render(){shell();const route=location.hash.replace(/^#\/?/,'').split('/');const program=programs.find(p=>p.id===(route[0]==='program'?route[1]:'medina'));const parts=route[2]==='level'?route.slice(2):route;const level=parts[0]==='level'?program?.levels.find(l=>l.id===Number(parts[1])):null;const book=level&&parts[2]==='book'?level.books.find(b=>b.id===parts[3]):null;let out='';if(parts[0]===''){
 const heading={ru:'Библиотека арабского языка',en:'Arabic Language Library',ar:'مكتبة اللغة العربية'}[lang];
 out=`${renderLibraryIntro(heading)}<div class="levels library-home-grid">${programs.map((program,index)=>`<a class="level-card" data-anchor="${program.id}" href="#/program/${program.id}"><h2><span class="library-course-icon book-cover-mark" aria-hidden="true" style="--cover:${bookCoverColors[index % bookCoverColors.length]};--book-order:${index}"></span>${esc(program.title[lang])}</h2></a>`).join('')}</div>`;
}
else if(parts[0]==='program'){
 const program=programs.find(item=>item.id===parts[1]);
 const empty={ru:'Материалы пока не добавлены',en:'No materials added yet',ar:'لم تُضف المواد بعد'}[lang];
 out=program?`${crumb()}<h1 data-anchor="heading">${esc(program.title[lang])}</h1>${renderProgramCover(program)}${program.levels.length?renderLevels(program):`<p class="empty">${empty}</p>`}`:`${crumb()}<h1>${t('notFound')}</h1>`;
}

else if(!level||(parts[2]&&!book)){out=`${crumb()}<h1>${t('notFound')}</h1><a href="#/">${t('back')}</a>`}
else if(book){out=`${crumb(level,book,program)}<p class="eyebrow">${levelTitle(level)}</p><h1 data-anchor="${book.id}">${esc(book.title[lang])}</h1><div class="detail">${lang!=='ar'?`<h2 lang="ar" dir="rtl">${esc(book.title.ar)}</h2>`:''}${book.note?`<p class="note">${esc(book.note[lang])}</p>`:''}${book.pdf||book.sourceUrl?`<div class="actions"><a class="action" id="open-book" href="${esc(book.pdf||book.sourceUrl)}" target="_blank" rel="noopener">${t('open')}</a>${book.pdf?`<a class="action secondary" id="download-book" href="${esc(book.pdf)}" download="${esc(book.pdf.split('/').pop())}">${t('download')}</a>`:''}${book.pdf&&book.sourceUrl?`<a class="action secondary" href="${esc(book.sourceUrl)}" target="_blank" rel="noopener">${{ru:'Открыть онлайн-версию',en:'Open online edition',ar:'فتح النسخة الإلكترونية'}[lang]}</a>`:''}</div>${book.pdf ? renderPdfLoadingNote() : ''}<p class="meta">${meta(book)} · ${t('original')}</p>`:`<p class="empty">${book.kind==='dictionary'?t('dictPending'):book.kind==='quran'?t('quranPending'):t('pending')}</p>`}</div>`}
else {out=`${crumb(level,null,program)}<p class="eyebrow">${t('eyebrow')}</p><h1 data-anchor="heading">${levelTitle(level)}</h1>${renderSectionCover(program, level)}<label class="search-label" for="search">${t('search')}</label><input class="search" type="search" id="search" value="${esc(query)}" placeholder="${esc(t('placeholder'))}"><div id="book-list">${list(level,program)}</div>`}
$('main').innerHTML=out;prepareProgramCover();animateCourseBooks(location.hash);const search=$('search');if(search)search.addEventListener('input',()=>{query=search.value;$('book-list').innerHTML=list(level,program)});}
function toggle(open){$('settings').hidden=!open;$('settings-toggle').setAttribute('aria-expanded',String(open));if(!open)$('settings-toggle').focus({preventScroll:true})}
$('settings-toggle').onclick=()=>toggle($('settings').hidden);$('close').onclick=()=>toggle(false);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('settings').hidden)toggle(false)});$('plus').onclick=()=>setScale(scale+10);$('minus').onclick=()=>setScale(scale-10);$('reset').onclick=()=>setScale(100);$('language').onchange=()=>{const a=anchor();lang=$('language').value;save('medina-language',lang);render();restore(a)};
window.addEventListener('hashchange',()=>{scrolls.set(previous,window.scrollY);previous=location.hash;query='';render();window.scrollTo(0,scrolls.get(previous)||0)});
fetch('catalog.json', { cache: 'no-cache' }).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(data=>{programs=data;render();setScale(scale)}).catch(e=>{console.error(e);$('error').hidden=false;$('error').textContent='Не удалось загрузить каталог. Обновите страницу. / Unable to load catalogue. / تعذر تحميل الفهرس'});
