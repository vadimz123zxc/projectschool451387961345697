// БитТренер: генераторы тренировочных заданий к КЕГЭ 2027
const $ = s => document.querySelector(s);
const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[r(0, a.length - 1)];
const b8 = n => n.toString(2).padStart(8, '0');
const esc = s => s.replace(/[&<>]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[c]));
const norm = s => String(s).trim().replace(',', '.').replace(/\s+/g, ' ').toLowerCase();
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const tbl = (head, rows) => `<table class="g"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(x => '<tr>' + x.map(v => `<td>${v}</td>`).join('') + '</tr>').join('')}</table>`;
const perms = a => a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
const LET = 'АБВГДЕЖИКЛМНОПРСТУ'.split('');

const T = [
  // --- Задание 1 (Схема и таблица) ---
  {id: 'dist', name: 'Графы и таблицы', n: 1,
   h: 'Сравните степени вершин (количество дорог) на графе и в таблице.',
   g() {
     const names = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];
     const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
     const weights = {};
     edges.forEach(([u, v]) => {
       const w = r(15, 55);
       weights[`${u}-${v}`] = w;
       weights[`${v}-${u}`] = w;
     });
     const pMap = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
     const tableData = Array.from({length: 6}, (_, i) => {
       const row = Array(6).fill('');
       for (let j = 0; j < 6; j++) {
         if (i !== j && weights[`${pMap[i]}-${pMap[j]}`]) row[j] = weights[`${pMap[i]}-${pMap[j]}`];
       }
       return [`<b>П${i + 1}</b>`, ...row];
     });
     const targetEdge = pick(edges);
     const uName = names[targetEdge[0]], vName = names[targetEdge[1]];
     const ans = weights[`${targetEdge[0]}-${targetEdge[1]}`];
     const coords = [[40, 70], [110, 30], [110, 120], [190, 30], [190, 120], [250, 70]];
     const svgLines = edges.map(([u, v]) => `<line x1="${coords[u][0]}" y1="${coords[u][1]}" x2="${coords[v][0]}" y2="${coords[v][1]}" stroke="#1b3a8a" stroke-width="2"/>`).join('');
     const svgNodes = coords.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="14" fill="#fff" stroke="#1b3a8a" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Consolas" font-weight="bold" font-size="14" fill="#1b3a8a">${names[i]}</text>`).join('');
     const svg = `<div style="text-align:center;margin:12px 0;"><svg width="290" height="150" viewBox="0 0 290 150">${svgLines}${svgNodes}</svg></div>`;
     return {
       q: `На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах). Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину дороги между пунктами <b>${uName}</b> и <b>${vName}</b>.${svg}${tbl(['', 'П1', 'П2', 'П3', 'П4', 'П5', 'П6'], tableData)}`,
       a: String(ans),
       s: `Степени вершин: Б — 4; В, Д — 3; А, Г, Е — 2. Сопоставляя граф с таблицей по связям, получаем длину дороги между пунктами ${uName} и ${vName}, равную ${ans}.`
     };
   }},

  // --- Задание 2 ---
  {id: 'tt', name: 'Таблицы истинности', n: 2,
   h: 'Напишите короткую программу перебора перестановок в Python.',
   g() {
     const O = {'∧': (a, b) => a & b, '∨': (a, b) => a | b, '→': (a, b) => (1 - a) | b, '≡': (a, b) => +(a === b)}, ok = Object.keys(O), cv = perms(['x', 'y', 'z', 'w']);
     for (let t = 0; t < 30000; t++) {
       const v = pick(cv), o = [pick(ok), pick(ok), pick(ok)], n1 = r(0, 1), n3 = r(0, 1), col = pick(cv);
       const F = e => O[o[1]](O[o[0]](n1 ? 1 - e[v[0]] : e[v[0]], e[v[1]]), O[o[2]](n3 ? 1 - e[v[2]] : e[v[2]], e[v[3]]));
       const val = (row, p) => { const e = {}; p.forEach((c, j) => e[c] = row[j]); return F(e); };
       const all = Array.from({length: 16}, (_, i) => [i >> 3 & 1, i >> 2 & 1, i >> 1 & 1, i & 1]);
       const rows = all.sort(() => Math.random() - .5).slice(0, 4).map(x => x.concat(val(x, col)));
       if (cv.filter(p => rows.every(x => val(x, p) === x[4])).length !== 1) continue;
       const ex = `(${n1 ? '¬' : ''}${v[0]} ${o[0]} ${v[1]}) ${o[1]} (${n3 ? '¬' : ''}${v[2]} ${o[2]} ${v[3]})`;
       return {q: `Логическая функция F задана выражением ${ex}. Дан фрагмент таблицы истинности функции F. Определите, какому столбцу соответствует каждая из переменных x, y, z, w.` + tbl(['Перем. 1', 'Перем. 2', 'Перем. 3', 'Перем. 4', 'F'], rows),
         a: col.join(''), s: `Единственная подходящая расстановка переменных: ${col.join('')}.`};
     }
   }},

    // --- Задание 3 (связанные таблицы, поступление товаров) ---
  {id: 'db', name: 'Базы данных: поступление товаров', n: 3, f: 1,
   h: 'Свяжите листы по ID магазина и товара. Отберите поступления по адресу, категории товара и датам.',
   g() {
     const streets = ['Прибрежная', 'Садовая', 'Лесная'];
     const stores = [];
     for (let i = 0; i < 9; i++) {
       stores.push({
         id: 'M' + (i + 1),
         street: streets[Math.floor(i / 3)],
         address: ['дом ' + (4 + i * 3), 'дом ' + (7 + i * 2), 'дом ' + (11 + i)][i % 3]
       });
     }
     const goods = [
       {id: 1, name: 'Зефир ванильный', kind: 'Зефир', mass: 500},
       {id: 2, name: 'Зефир в шоколаде', kind: 'Зефир', mass: 1000},
       {id: 3, name: 'Зефир ягодный', kind: 'Зефир', mass: 1500},
       {id: 4, name: 'Пастила яблочная', kind: 'Пастила', mass: 250},
       {id: 5, name: 'Мармелад', kind: 'Мармелад', mass: 300},
       {id: 6, name: 'Печенье овсяное', kind: 'Печенье', mass: 400}
     ];
     const targetStreet = pick(streets);
     const d1 = r(3, 8), d2 = d1 + r(7, 14);
     const ops = [];
     for (let i = 0; i < 180; i++) {
       const store = pick(stores), good = pick(goods);
       const dayNum = r(1, 30);
       const incoming = pick(['Поступление', 'Поступление', 'Продажа']);
       let qty = r(1, 30);
       if (good.kind === 'Зефир') qty *= 2;
       ops.push({day: dayNum, store: store.id, good: good.id, qty, op: incoming});
     }
     const forcedStore = pick(stores.filter(x => x.street === targetStreet));
     ops.push({day: d1, store: forcedStore.id, good: 1, qty: 8, op: 'Поступление'});
     let totalGrams = 0;
     const storeById = Object.fromEntries(stores.map(x => [x.id, x]));
     const goodById = Object.fromEntries(goods.map(x => [x.id, x]));
     for (const row of ops) {
       const store = storeById[row.store], good = goodById[row.good];
       if (store.street === targetStreet && good.kind === 'Зефир' &&
           row.op === 'Поступление' && row.day >= d1 && row.day <= d2) {
         totalGrams += row.qty * good.mass;
       }
     }
     const totalKg = totalGrams / 1000;
     const xmlRows = (headers, rows) =>
       '<Row>' + headers.map(x => '<Cell><Data ss:Type="String">' + x + '</Data></Cell>').join('') + '</Row>' +
       rows.map(row => '<Row>' + row.map(x => '<Cell><Data ss:Type="' +
         (typeof x === 'number' ? 'Number' : 'String') + '">' + x + '</Data></Cell>').join('') + '</Row>').join('');
     const xml = '<?xml version="1.0"?>\n' +
       '<?mso-application progid="Excel.Sheet"?>\n' +
       '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
       '<Worksheet ss:Name="Движение"><Table>' +
       xmlRows(['Дата','ID магазина','ID товара','Операция','Количество'], ops.map(x => [
         String(x.day).padStart(2,'0') + '.06.2025', x.store, x.good, x.op, x.qty
       ])) +
       '</Table></Worksheet><Worksheet ss:Name="Товары"><Table>' +
       xmlRows(['ID товара','Наименование','Категория','Масса упаковки, г'], goods.map(x => [x.id,x.name,x.kind,x.mass])) +
       '</Table></Worksheet><Worksheet ss:Name="Магазины"><Table>' +
       xmlRows(['ID магазина','Улица','Адрес'], stores.map(x => [x.id,x.street,x.address])) +
       '</Table></Worksheet></Workbook>';
     return {
       file: {name: '3.xls', text: xml, mime: 'application/vnd.ms-excel;charset=utf-8;'},
       q: 'В файле 3.xls находятся три связанные таблицы: «Движение», «Товары» и «Магазины». Определите массу в килограммах всех видов зефира, поступивших с ' +
          d1 + ' по ' + d2 + ' июня 2025 года включительно в магазины, расположенные на улице «' + targetStreet + '». Учитывайте только операцию «Поступление».',
       a: String(totalKg),
       s: 'Связываем таблицу движения с таблицей магазинов по ID магазина, а с таблицей товаров — по ID товара. Отбираем улицу «' +
          targetStreet + '», категорию «Зефир», операцию «Поступление» и даты с ' + d1 + ' по ' + d2 +
          ' июня. Сумма массы упаковок равна ' + totalGrams + ' г, или ' + totalKg + ' кг.'
     };
   }},

      // --- Задание 4 (условие Фано) ---
  {id:'fano',name:'Кодирование слова по условию Фано',n:4,
   h:'Для кода минимальной длины свободное двухбитное слово нужно назначить самой частой из двух неизвестных букв.',
   g(){
     const word='КОЛОБОК';
     const freq={К:0,О:0};
     for(const ch of word)if(ch in freq)freq[ch]++;
     const short=freq.К>freq.О?'К':'О',long=short==='К'?'О':'К';
     const codes={Б:'00',Н:'010',Л:'111',[short]:'10',[long]:'011'};
     const answer=[...word].reduce((sum,ch)=>sum+codes[ch].length,0);
     return {
       q:'Для передачи сообщений используются буквы Б, К, Л, О, Н. Двоичный код удовлетворяет условию Фано. Известны коды Б — 00, Н — 010, Л — 111. Для букв К и О кодовые слова неизвестны. Какое минимальное количество двоичных знаков требуется для кодирования слова «'+word+'»?',
       a:String(answer),
       s:'Свободное двухбитное кодовое слово 10 можно назначить одной из букв К или О. Второй букве назначаем свободное трёхбитное слово 011. В слове «КОЛОБОК» буква К встречается '+freq.К+' раза, О — '+freq.О+' раза, Л и Б — по одному разу. Поэтому короткий код 10 назначаем букве О, а К — код 011. Длина кодирования: Б — 1·2, Л — 1·3, К — 2·3, О — 3·2. Итого 2 + 3 + 6 + 6 = '+answer+' бит.'
     };
   }},
  {id:'fano_rand',name:'Условие Фано: другое сообщение (дополнительная модель)',n:4,
   h:'Посчитайте частоты букв и назначьте более часто встречающейся букве более короткий код.',
   g(){
     const word=Array.from({length:r(10,20)},()=>pick(['К','О','Л','Б']));
     const freq={К:0,О:0,Л:0,Б:0};for(const ch of word)freq[ch]++;
     const short=freq.К>freq.О?'К':'О',long=short==='К'?'О':'К';
     const codes={Б:'00',Н:'010',Л:'111',[short]:'10',[long]:'011'};
     const answer=word.reduce((sum,ch)=>sum+codes[ch].length,0);
     return {
       q:'Кодовые слова для букв Б, Н и Л заданы: 00, 010 и 111 соответственно. Для букв К и О выберите свободные кодовые слова с минимальной длиной сообщения. Определите минимальную длину двоичного кодирования сообщения «'+word.join('')+'».',
       a:String(answer),
       s:'Буква '+short+' встречается '+freq[short]+' раз(а), поэтому ей назначаем код 10 длиной 2 бита. Букве '+long+' назначаем свободный код 011 длиной 3 бита. Суммарная длина кодирования равна '+answer+' бит.'
     };
   }},

// --- Задание 5 (двоичный алгоритм по чётности) ---
  {id:'alg',name:'Двоичный алгоритм: наименьший результат R',n:5,
   h:'Постройте R для каждого N, затем минимизируйте именно R, а не исходное число N.',
   g(){
     const limit=95,results=[];
     for(let N=1;N<=10000;N++){
       const bits=N.toString(2);
       const out=N%2===0?'11'+bits+'11':'1'+bits+'00';
       const R=parseInt(out,2);
       if(R>limit)results.push({N,R,out});
     }
     results.sort((a,b)=>a.R-b.R||a.N-b.N);
     const best=results[0];
     return {
       q:'На вход алгоритма подаётся натуральное число N. Если N чётное, к его двоичной записи слева и справа дописываются по две единицы. Если N нечётное, справа дописываются два нуля, а слева — одна единица. Полученная строка является двоичной записью числа R. Найдите наименьшее число R, превышающее 95, которое может быть результатом работы алгоритма.',
       a:String(best.R),
       s:'Перебираем натуральные N, строим двоичную запись результата и переводим её в десятичную систему. Минимальный результат, превышающий 95, получен при N='+best.N+'. Двоичная запись результата '+best.out+', десятичное значение R='+best.R+'.'
     };
   }},
  {id:'alg_mod3',name:'Двоичный алгоритм с остатком от деления на 3 (дополнительная модель)',n:5,
   h:'Если N делится на 3, допишите три последние двоичные цифры. Иначе допишите двоичную запись числа 3·(N mod 3).',
   g(){
     const limit=r(140,420);let best=null;
     for(let N=1;N<=10000;N++){
       const bits=N.toString(2),tail=N%3===0?bits.slice(-3):(3*(N%3)).toString(2);
       const out=bits+tail,R=parseInt(out,2);
       if(R>=limit){best={N,R,bits,tail,out};break;}
     }
     return {
       q:'На вход алгоритма подаётся натуральное число N. Если N делится на 3, к двоичной записи дописываются три последние цифры. Иначе остаток от деления на 3 умножается на 3, переводится в двоичную систему и дописывается в конец. Найдите минимальное N, при котором R не меньше '+limit+'.',
       a:String(best.N),
       s:'Для N='+best.N+' получаем '+best.bits+best.tail+'₂ = '+best.R+'. Это первое подходящее значение N.'
     };
   }},

    // --- Задание 6 (пересечение фигур Черепахи) ---
  {id:'trt',name:'Черепаха: целочисленные точки пересечения',n:6,
   h:'После первого прямоугольника поднимите хвост и переместите Черепаху. Второй прямоугольник строится из новой точки.',
   g(){
     const h1=r(20,38),w1=r(20,40);
     const dx=r(1,Math.max(1,h1-2)),dy=r(2,Math.max(2,Math.floor(w1/2)));
     const h2=r(Math.max(2,h1-dx),h1+30),w2=r(Math.max(2,w1-dy),w1+30);
     const x1=0,x2=h1,y1=-w1,y2=0;
     const x3=dx,x4=dx+h2,y3=-(dy+w2),y4=-dy;
     const left=Math.max(x1,x3),right=Math.min(x2,x4);
     const bottom=Math.max(y1,y3),top=Math.min(y2,y4);
     const nx=right-left+1,ny=top-bottom+1,answer=nx*ny;
     const commands='Повтори 6 [Вперёд '+h1+' Направо 90 Вперёд '+w1+' Направо 90]\\nПоднять хвост\\nВперёд '+dx+' Направо 90 Вперёд '+dy+' Налево 90\\nОпустить хвост\\nПовтори 6 [Вперёд '+h2+' Направо 90 Вперёд '+w2+' Направо 90]';
     return {
       q:'Черепаха находится в начале координат, её голова направлена вдоль положительного направления оси X. Выполните алгоритм:\\n'+commands+'\\nОпределите количество точек с целочисленными координатами внутри области пересечения фигур, включая границы.',
       a:String(answer),
       s:'Первая фигура занимает x от '+x1+' до '+x2+' и y от '+y1+' до '+y2+'. После перемещения без рисования в точку ('+dx+'; −'+dy+') строится второй прямоугольник: x от '+x3+' до '+x4+', y от '+y3+' до '+y4+'. Пересечение содержит '+nx+' целых координат по X и '+ny+' по Y. Ответ: '+nx+'·'+ny+' = '+answer+'.'
     };
   }},
  {id:'trt_union',name:'Черепаха: объединение фигур (дополнительная модель)',n:6,
   h:'Посчитайте точки в каждом прямоугольнике и вычтите точки общей части.',
   g(){
     const h1=r(20,38),w1=r(20,40),dx=r(1,Math.max(1,h1-2)),dy=r(2,Math.max(2,Math.floor(w1/2)));
     const h2=r(Math.max(2,h1-dx),h1+30),w2=r(Math.max(2,w1-dy),w1+30);
     const left=Math.max(0,dx),right=Math.min(h1,dx+h2);
     const bottom=Math.max(-w1,-dy-w2),top=Math.min(0,-dy);
     const overlap=(right-left+1)*(top-bottom+1);
     const first=(h1+1)*(w1+1),second=(h2+1)*(w2+1),answer=first+second-overlap;
     return {
       q:'Две прямоугольные фигуры построены Черепахой. Первая занимает x от 0 до '+h1+' и y от −'+w1+' до 0. Вторая занимает x от '+dx+' до '+(dx+h2)+' и y от −'+(dy+w2)+' до −'+dy+'. Сколько целочисленных точек находится внутри объединения фигур, включая границы?',
       a:String(answer),
       s:'В первой фигуре '+first+' целочисленных точек, во второй '+second+'. Их пересечение содержит '+overlap+' точек. По формуле включения-исключения получаем '+first+' + '+second+' − '+overlap+' = '+answer+'.'
     };
   }},

// --- Задание 7 (5 подвидов) ---
  {id: 'pic_base', name: 'Изображения (базовое)', n: 7,
   h: 'I = X · Y · i. Бит на пиксель i находится из 2^i = C. Результат переведите в Кбайты.',
   g() {
     let w, h, c, k, v;
     do {
       w = pick([512, 640, 1024]); h = pick([256, 480, 768]);
       c = pick([16, 64, 256]); k = Math.log2(c); v = w * h * k / 8 / 1024;
     } while (v % 1 || v < 1);
     return {q: `Растровое изображение размером ${w}×${h} пикселей сохранено без сжатия с палитрой из ${c} цветов. Сколько Кбайт памяти занимает этот файл?`,
       a: String(v), s: `Глубина цвета: 2^i = ${c} => i = ${k} бит. I = (${w} · ${h} · ${k}) / 8 / 1024 = ${v} Кбайт.`};
   }},

  {id: 'snd_base', name: 'Аудиозапись (базовое)', n: 7,
   h: 'I = f · b · t · k. Частота в Гц (кГц умножать на 1000), время в секундах.',
   g() {
     let f,b,t,ch,v;
     do {
       f=pick([16000,24000,32000]);b=pick([16,24]);t=pick([20,30,40]);ch=pick([1,2]);
       v=f*b*t*ch/8/1024;
     } while(!Number.isInteger(v));
     return {q: `Производится ${ch === 1 ? 'одноканальная (моно)' : 'двухканальная (стерео)'} звукозапись с частотой дискретизации ${f / 1000} кГц и ${b}-битным разрешением. Запись длится ${t} секунд. Определите размер полученного несжатого файла в Кбайтах.`,
       a: String(v), s: `I = (${f} · ${b} · ${t} · ${ch}) / 8 / 1024 = ${v} Кбайт.`};
   }},

  {id: 'snd_ratio', name: 'Перезапись звука (сравнение)', n: 7,
   h: 'Стерео в моно уменьшает размер в 2 раза. Умножьте на коэффициент разрешения и разделите на коэффициент частоты.',
   g() {
     const origSize = r(30, 80);
     const fRatio = pick([2, 4]);
     const bRatio = pick([2, 3]);
     const newSize = (origSize / 2 / fRatio) * bRatio;
     return {q: `Музыкальный фрагмент был записан в формате стерео, оцифрован и сохранен в виде файла размером ${origSize} Мбайт без сжатия. Затем тот же фрагмент записали в формате моно с разрешением в ${bRatio} раза выше и частотой дискретизации в ${fRatio} раза ниже, чем в первый раз. Укажите размер полученного файла (в Мбайт).`,
       a: String(newSize), s: `Формула пересчета: ${origSize} / 2 / ${fRatio} · ${bRatio} = ${newSize} Мбайт.`};
   }},

  {id: 'dpi_scan', name: 'Сканирование (DPI)', n: 7,
   h: 'Количество пикселей пропорционально квадрату DPI: (DPI_2 / DPI_1)^2.',
   g() {
     const origDpi = 300, newDpi = 600;
     const origMb = r(15, 36) * 3;
     const newMb = (origMb * 4) / 3;
     return {q: `Документ был отсканирован с разрешением ${origDpi} dpi и 24-битной глубиной цвета. Размер полученного файла составил ${origMb} Мбайт. Затем тот же документ отсканировали с разрешением ${newDpi} dpi и палитрой из 256 цветов без сжатия. Определите размер полученного файла в Мбайтах.`,
       a: String(newMb), s: `Пиксели увеличились в (600/300)² = 4 раза. Глубина цвета уменьшилась с 24 до 8 бит (в 3 раза). Итог: ${origMb} · 4 / 3 = ${newMb} Мбайт.`};
   }},

  {id: 'net_trans', name: 'Передача по каналу связи', n: 7,
   h: 'Время = Объем / Скорость передачи. Следите за битами и Кбайтами.',
   g() {
     const speed = pick([64000, 128000, 256000]);
     const timeSec = r(15, 45);
     const totalBits = speed * timeSec;
     const totalKb = totalBits / 8 / 1024;
     return {q: `Файл объемом ${totalKb} Кбайт передается по каналу связи со скоростью ${speed} бит/с. Сколько секунд длилась передача файла?`,
       a: String(timeSec), s: `Объем в битах: ${totalKb} · 8 · 1024 = ${totalBits} бит. Время: ${totalBits} / ${speed} = ${timeSec} сек.`};
   }},

    // --- Задание 8 ---
  {id:'prm',name:'Алфавитный порядок: последнее слово',n:8,
   h:'Проверяйте номер, первую букву и точное количество заданных букв.',
   g(){
     const alphabet=['А','К','О','Р','С','Т'],total=6**5;let answer=0,example='';
     for(let index=0;index<total;index++){
       let value=index,word='';
       for(let pos=0;pos<5;pos++){word=alphabet[value%6]+word;value=Math.floor(value/6);}
       if(!['А','С','Т'].includes(word[0])&&[...word].filter(ch=>ch==='О').length===2&&(index+1)%2===0){answer=index+1;example=word;}
     }
     return {q:'Все пятибуквенные слова из букв А, К, О, Р, С, Т записаны в алфавитном порядке и пронумерованы с 1. Определите номер последнего слова с чётным номером, которое не начинается с А, С или Т и содержит ровно две буквы О.',
       a:String(answer),s:'Последнее подходящее слово — '+example+'. Его номер в списке: '+answer+'.'};
   }},
  {id:'prm_cnt',name:'Алфавитный порядок: первое слово (дополнительная модель)',n:8,
   h:'Переберите слова лексикографически и найдите первое подходящее.',
   g(){
     const alphabet=['А','Е','К','Н','Т','Ц'],total=6**5;let answer=0,example='';
     for(let index=0;index<total;index++){
       let value=index,word='';
       for(let pos=0;pos<5;pos++){word=alphabet[value%6]+word;value=Math.floor(value/6);}
       if(!['А','Е','К'].includes(word[0])&&word.includes('Т')&&(index+1)%2===0){answer=index+1;example=word;break;}
     }
     return {q:'Все пятибуквенные слова из букв А, Е, К, Н, Т, Ц записаны в алфавитном порядке и пронумерованы с 1. Определите номер первого слова с чётным номером, которое не начинается с А, Е или К и содержит хотя бы одну букву Т.',
       a:String(answer),s:'Первое подходящее слово — '+example+'. Его номер равен '+answer+'.'};
   }},

  // --- Задание 9 ---
  {id:'ex9',name:'Электронная таблица: повторяющееся число',n:9,f:1,
   h:'Найдите последнюю строку с одним числом, встречающимся трижды, и четырьмя различными числами.',
   g(){
     const rows=Array.from({length:r(250,400)},()=>Array.from({length:7},()=>r(1,60)));
     const triple=r(40,80),other=[];
     while(other.length<4){const v=r(1,triple-1);if(!other.includes(v))other.push(v);}
     const forced=[triple,triple,triple,...other];
     for(let i=forced.length-1;i>0;i--){const j=r(0,i);[forced[i],forced[j]]=[forced[j],forced[i]];}
     rows.push(forced);
     let answer=0,lastRow=0;
     rows.forEach((row,index)=>{
       const freq=new Map();row.forEach(v=>freq.set(v,(freq.get(v)||0)+1));
       const tripleCount=[...freq.values()].filter(v=>v===3).length;
       const singles=[...freq.entries()].filter(x=>x[1]===1).map(x=>x[0]);
       const repeated=[...freq.entries()].find(x=>x[1]===3)?.[0];
       if(tripleCount===1&&singles.length===4&&repeated!==undefined&&singles.reduce((a,b)=>a+b,0)/4<=repeated){
         answer=row.reduce((a,b)=>a+b,0);lastRow=index+1;
       }
     });
     return {file:{name:'9.csv',text:rows.map(x=>x.join(';')).join('\n'),mime:'text/csv;charset=utf-8;'},
       q:'В файле 9.csv в каждой строке записано семь натуральных чисел. Найдите сумму чисел в строке с наибольшим номером, где одно число повторяется трижды, остальные четыре числа различны, а среднее арифметическое четырёх неповторяющихся чисел не больше повторяющегося числа.',
       a:String(answer),s:'Последняя подходящая строка — '+lastRow+'. Сумма семи чисел этой строки равна '+answer+'.'};
   }},
  {id:'ex9_five',name:'Электронная таблица: пять различных чисел (дополнительная модель)',n:9,f:1,
   h:'Проверьте различность чисел и условие с удвоенной суммой минимума и максимума.',
   g(){
     const rows=Array.from({length:r(280,420)},()=>Array.from({length:5},()=>r(1,100)));
     rows.push([1,7,10,13,20]);let answer=0;
     for(const row of rows){
       if(new Set(row).size!==5)continue;
       const x=[...row].sort((a,b)=>a-b);
       if(2*(x[0]+x[4])>x[1]+x[2]+x[3])answer++;
     }
     return {file:{name:'9b.csv',text:rows.map(x=>x.join(';')).join('\n'),mime:'text/csv;charset=utf-8;'},
       q:'В файле 9b.csv в каждой строке записано пять натуральных чисел. Определите количество строк, в которых все числа различны, а удвоенная сумма максимального и минимального чисел больше суммы трёх остальных.',
       a:String(answer),s:'Проверяем все пять значений, затем условие 2·(min+max) > сумма трёх средних. Подходящих строк '+answer+'.'};
   }},

  // --- Задание 10 (маска подсети, актуальная модель КЕГЭ-2027) ---
  {id:'mask10',name:'Маска подсети: адрес сети',n:10,
   h:'Побитово примените маску к каждому октету IP-адреса. Затем сложите четыре октета адреса сети.',
   g(){
     const prefix=pick([20,21,22,23,24,25,26,27,28,29]);
     const mask=Array.from({length:4},(_,i)=>{
       const bits=Math.max(0,Math.min(8,prefix-i*8));
       return bits===0?0:256-2**(8-bits);
     });
     const address=mask.map((octet,i)=>octet===255?r(1,254):r(1,254));
     const network=address.map((octet,i)=>octet&mask[i]);
     const answer=network.reduce((sum,x)=>sum+x,0);
     return {
       q:'Узел имеет IP-адрес '+address.join('.')+' и маску подсети '+mask.join('.')+'. Определите сумму чисел, составляющих адрес сети.',
       a:String(answer),
       s:'Выполняем побитовое И отдельно для каждого октета. Адрес сети: '+network.join('.')+'. Сумма октетов: '+network.join(' + ')+' = '+answer+'.'
     };
   }},

// --- Задание 11 (Официальная формулировка ФИПИ) ---
  {id: 'pw', name: 'Объем памяти под пароли', n: 11,
   h: 'Бит на символ: 2^i >= N. Байт на пароль: округление вверх.',
   g() {
     const alpha = pick([26, 36, 52, 64]);
     const L = r(11, 16);
     const extra = r(15, 35);
     const users = r(50, 120);
     const i = Math.ceil(Math.log2(alpha));
     const bPass = Math.ceil(L * i / 8);
     const totalPerUser = bPass + extra;
     const total = totalPerUser * users;
     return {
       q: `При регистрации в компьютерной системе каждому объекту присваивается идентификатор, состоящий из ${L} символов и содержащий только символы из ${alpha}-символьного алфавита. В базе данных для хранения каждого идентификатора отведено одинаковое и минимально возможное целое число байт. При этом используется посимвольное кодирование идентификаторов, все символы кодируются одинаковым и минимально возможным количеством бит. Кроме собственно идентификатора, для каждого объекта в системе хранятся дополнительные сведения, для чего выделено ${extra} байт на один объект. Определите объем памяти (в байтах), необходимый для хранения сведений о ${users} объектах.`,
       a: String(total),
       s: `1) Бит на символ: 2^i ≥ ${alpha} => i = ${i} бит.\n2) Байт на пароль: ceil(${L}·${i} / 8) = ${bPass} байт.\n3) На один объект: ${bPass} + ${extra} = ${totalPerUser} байт.\n4) На ${users} объектов: ${totalPerUser} · ${users} = ${total} байт.`
     };
   }},

        // --- Задание 12 (машина Тьюринга) ---
  {id:'tm',name:'Машина Тьюринга: число 2025',n:12,
   h:'Головка проходит влево по всем битам, затем записывает 1 в первую пустую ячейку слева и останавливается на следующем пустом символе.',
   g(){
     const N=2025,binary=N.toString(2),resultBinary='1'+binary,answer=parseInt(resultBinary,2);
     const transitions=[
       ['q0','λ, L, q1','—','—'],
       ['q1','1, L, q2','0, L, q1','1, L, q1'],
       ['q2','λ, S, q2','—','—']
     ];
     return {
       q:'На ленте в соседних ячейках записано двоичное представление числа 2025 без ведущих нулей. Пустые ячейки обозначаются λ. В начальный момент головка находится в ближайшей справа от числа пустой ячейке. Программа машины Тьюринга задана таблицей:\\n'+
          tbl(['Состояние','λ','0','1'],transitions)+
          'Определите результат выполнения программы. В ответ запишите получившееся число в десятичной системе счисления.',
       a:String(answer),
       s:'В состоянии q0 головка сдвигается влево на правый край числа. В состоянии q1 машина проходит все биты влево, не меняя их. Когда встречается пустая ячейка слева, записывает туда 1 и переходит в q2. В состоянии q2 на следующей пустой ячейке машина останавливается. Получается '+resultBinary+'₂ = '+answer+'₁₀.'
     };
   }},
  {id:'tm_rand',name:'Машина Тьюринга: другое входное число (дополнительная модель)',n:12,
   h:'Проследите движение головки по ленте и определите, какой разряд будет дописан слева.',
   g(){
     const N=r(100,4095),binary=N.toString(2),resultBinary='1'+binary,answer=parseInt(resultBinary,2);
     const transitions=[
       ['q0','λ, L, q1','—','—'],
       ['q1','1, L, q2','0, L, q1','1, L, q1'],
       ['q2','λ, S, q2','—','—']
     ];
     return {
       q:'На ленте записано двоичное представление числа '+N+'. Головка находится в ближайшей справа пустой ячейке. По таблице переходов машина проходит влево по всем битам, записывает 1 в первую пустую ячейку слева и останавливается в следующей пустой ячейке. Таблица:\\n'+
          tbl(['Состояние','λ','0','1'],transitions)+
          'Определите результат работы машины в десятичной системе счисления.',
       a:String(answer),
       s:'К исходной двоичной записи '+binary+' слева дописывается единица. Получается '+resultBinary+'₂, что равно '+answer+' в десятичной системе.'
     };
   }},
  {id:'ed',name:'Редактор строк (дополнительная модель)',n:12,
   h:'Запустите строковый цикл while в Python.',
   g(){
     const n=r(45,80);let s='1'.repeat(n);
     while(s.includes('111')||s.includes('222'))s=s.includes('111')?s.replace('111','2'):s.replace('222','1');
     const sum=[...s].reduce((acc,c)=>acc+Number(c),0);
     return {
       q:'Дана программа для Редактора:\\nПОКА нашлось(111) ИЛИ нашлось(222)\\n  ЕСЛИ нашлось(111)\\n    ТО заменить(111, 2)\\n    ИНАЧЕ заменить(222, 1)\\nКОНЕЦ ПОКА\\nКакова сумма цифр строки, получившейся из строки, состоящей из '+n+' единиц?',
       a:String(sum),
       s:'После выполнения цикла строка равна '+s+'. Сумма её цифр: '+sum+'.'
     };
   }},

// --- Задание 13 (подсчёт программ исполнителя) ---
  {id:'trace13',name:'Исполнитель: прибавление и перестановка цифр',n:13,
   h:'Команда A увеличивает число на 1. Команда B меняет местами только цифры десятков и единиц и доступна, если десятки меньше единиц.',
   g(){
     let start,target,answer,ways;
     for(let attempt=0;attempt<300;attempt++){
       if(attempt===0){start=100;target=141;}
       else{start=r(100,240);target=start+r(20,100);}
       const memo=new Map();
       ways=n=>{
         if(n>target)return 0;
         if(n===target)return 1;
         if(memo.has(n))return memo.get(n);
         let total=ways(n+1);
         const tens=Math.floor(n/10)%10,units=n%10;
         if(tens<units)total+=ways(n+9*(units-tens));
         memo.set(n,total);
         return total;
       };
       answer=ways(start);
       if(answer>0)break;
     }
     return {
       q:'Исполнитель преобразует число на экране. Команда A увеличивает число на 1. Команда B применяется только тогда, когда цифра десятков меньше цифры единиц, и меняет местами две последние цифры числа. Сколько существует программ, переводящих число '+start+' в число '+target+'?',
       a:String(answer),
       s:'Для каждого промежуточного числа считаем количество способов достичь цели. Из n всегда можно перейти в n+1. Если цифра десятков меньше цифры единиц, можно также перейти к числу n+9·(единицы−десятки). Для '+start+' и '+target+' получаем '+answer+' программ.'
     };
   }},

// --- Задание 14 ---
  {id: 'cc', name: 'Выражение со степенями', n: 14,
   h: 'Вычислите выражение на Python и посчитайте цифры через n % base.',
   g() {
     const p = pick([3, 4, 5, 7]), a = r(11, 19), b = r(8, 14), c = r(2, 5);
     const val = (BigInt(p) ** BigInt(2 * a)) + (BigInt(p) ** BigInt(b)) - BigInt(c);
     const s = val.toString(p);
     const count = [...s].filter(ch => ch === String(p - 1)).length;
     return {q: `Значение арифметического выражения ${p * p}^${a} + ${p}^${b} − ${c} записали в системе счисления с основанием ${p}. Сколько цифр «${p - 1}» содержится в этой записи?`,
       a: String(count), s: `Переводим число в систему с основанием ${p}. Цифра ${p - 1} встречается ${count} раз.`};
   }},

  {id: 'cc_eq', name: 'Уравнение с неизвестной цифрой', n: 14,
   h: 'Переберите цифру x от 0 до основания минус 1 и найдите минимальную, при которой сумма делится на заданное число.',
   g() {
     let b,d,c,xVal,total,attempts=0;
     do {
       b=pick([12,14,15,16]);
       d=pick([11,13,17,19]);
       c=r(0,d-1);
       xVal=-1;
       for(let x=0;x<b;x++){
         const value=7*b*b+2*x*b+10+c;
         if(value%d===0){xVal=x;total=value;break;}
       }
       attempts++;
     } while(xVal<0&&attempts<100);
     if(xVal<0)throw new Error('Не найдено значение неизвестной цифры');
     const quotient=total/d;
     return {
       q:'Операнды арифметического выражения записаны в системе счисления с основанием '+b+':\n2x3_'+b+' + 5x7_'+b+' + '+c+'.\nВ записи чисел переменной x обозначена неизвестная цифра из алфавита '+b+'-ричной системы счисления. Определите наименьшее значение x, при котором значение выражения кратно '+d+'. Для найденного x вычислите частное от деления значения выражения на '+d+' и укажите его в ответе в десятичной системе.',
       a:String(quotient),
       s:'В десятичной системе значение выражения равно 7·'+b+'² + 2·x·'+b+' + 10 + '+c+'. Перебираем x от 0 до '+(b-1)+'. Наименьшее значение, при котором сумма делится на '+d+', равно '+xVal+'. Частное равно '+quotient+'.'
     };
   }},

  // --- Задание 15 ---
  {id: 'lg', name: 'Поразрядная конъюнкция', n: 15,
   h: 'Используйте функцию all() в цикле перебора A на Python.',
   g() {
     let p, q; do { p = r(10, 45); q = r(10, 45); } while (!(p & (63 ^ q)));
     const A = p & (63 ^ q);
     return {q: `Для какого наименьшего натурального числа А формула ((x & ${p} ≠ 0) → ((x & ${q} == 0) → (x & А ≠ 0))) тождественно истинна при любом натуральном x?`,
       a: String(A), s: `Наименьшее натуральное А = ${A}. Проверяется кодом через all().`};
   }},

  {id: 'lg_seg', name: 'Отрезки на прямой', n: 15,
   h: 'Отрезок A обязан перекрывать пересечение отрезков P и Q.',
   g() {
     const p1 = r(10, 25), p2 = p1 + r(15, 25);
     const q1 = r(20, 35), q2 = q1 + r(15, 25);
     const interLeft = Math.max(p1, q1);
     const interRight = Math.min(p2, q2);
     const len = interRight > interLeft ? interRight - interLeft : 0;
     return {
       q: `На числовой прямой даны два отрезка: P = [${p1}, ${p2}] и Q = [${q1}, ${q2}]. Укажите наименьшую возможную длину такого отрезка A, для которого логическое выражение\n(x ∈ P) → (((x ∈ Q) ∧ ¬(x ∈ A)) → ¬(x ∈ P))\nтождественно истинно при любом значении x.`,
       a: String(len),
       s: `Отрезок A обязан содержать пересечение P и Q: [${interLeft}, ${interRight}]. Длина = ${len}.`
     };
   }},

      // --- Задание 16 (рекурсивная функция факториала) ---
  {id:'rec',name:'Рекурсивная функция и отношение факториалов',n:16,
   h:'Не вычисляйте факториалы по отдельности. Сократите дроби, используя F(n)=n·F(n−1).',
   g(){
     const n=3038,k=5;
     const answer=(n-1)*(n+k);
     return {
       q:'Алгоритм вычисления значения функции F(n), где n — натуральное число, задан соотношениями: F(n)=1 при n=1; F(n)=n·F(n−1), если n>1. Чему равно значение выражения (F('+n+') + '+k+'·F('+(n-1)+')) / F('+(n-2)+')?',
       a:String(answer),
       s:'F(n)=n·(n−1)·F(n−2), а F(n−1)=(n−1)·F(n−2). После сокращения получаем n·(n−1)+k·(n−1)=(n−1)·(n+k)='+answer+'.'
     };
   }},

    // --- Задание 17 (соседние пары и остаток от деления на 33) ---
  {id:'f17',name:'Пары соседних чисел и минимальный элемент',n:17,f:1,
   h:'Найдите минимальный элемент всей последовательности. Для каждой соседней пары проверьте, равен ли остаток хотя бы одного числа этому минимуму.',
   g(){
     const n=r(500,900),minimum=r(1,30);
     const data=Array.from({length:n},()=>r(minimum,100000));
     data[0]=minimum;
     for(let i=25;i<n-1;i+=47){
       data[i]=minimum+33*r(1,2500);
       data[i+1]=r(minimum,100000);
     }
     let count=0,maxSum=0;
     for(let i=0;i<data.length-1;i++){
       const a=data[i],b=data[i+1];
       if(a%33===minimum||b%33===minimum){
         count++;
         maxSum=Math.max(maxSum,a+b);
       }
     }
     return {
       file:{name:'17.txt',text:data.join('\n')},
       q:'В файле 17.txt содержится последовательность натуральных чисел от 1 до 100 000. Определите количество пар соседних элементов, в которых остаток от деления на 33 хотя бы одного элемента равен минимальному элементу всей последовательности. В ответ запишите количество найденных пар, затем максимальную сумму элементов таких пар.',
       a:count+' '+maxSum,
       s:'Минимальный элемент всей последовательности равен '+minimum+'. Для каждой соседней пары проверяем условие a mod 33 = '+minimum+' или b mod 33 = '+minimum+'. Найдено '+count+' пар, максимальная сумма равна '+maxSum+'.'
     };
   }},

// --- Задание 18 (случайные стены и все конечные клетки) ---
  {id: 'rob', name: 'Робот: стены и конечные клетки', n: 18, f: 1,
   h: 'Постройте таблицы максимальных и минимальных сумм. Робот останавливается в клетке, из которой нельзя идти ни вправо, ни вниз.',
   g() {
     const size = r(10, 16);
     const coins = Array.from({length:size}, () => Array.from({length:size}, () => r(1,100)));
     const wallR = Array.from({length:size}, () => Array(size).fill(false));
     const wallB = Array.from({length:size}, () => Array(size).fill(false));
     const protectedR = new Set(), protectedB = new Set();

     // Гарантируем хотя бы один открытый маршрут из начала в правый нижний угол.
     let i = 0, j = 0;
     while (i < size-1 || j < size-1) {
       const right = j < size-1, down = i < size-1;
       if (right && (!down || Math.random() < 0.5)) {
         protectedR.add(i+':'+j); j++;
       } else {
         protectedB.add(i+':'+j); i++;
       }
     }
     for (i=0;i<size;i++) for (j=0;j<size;j++) {
       if (j<size-1 && !protectedR.has(i+':'+j)) wallR[i][j] = Math.random()<0.16;
       if (i<size-1 && !protectedB.has(i+':'+j)) wallB[i][j] = Math.random()<0.16;
     }

     const maxDp = Array.from({length:size},()=>Array(size).fill(-Infinity));
     const minDp = Array.from({length:size},()=>Array(size).fill(Infinity));
     maxDp[0][0] = minDp[0][0] = coins[0][0];
     for (i=0;i<size;i++) for (j=0;j<size;j++) {
       if (i===0 && j===0) continue;
       const mx=[], mn=[];
       if (i>0 && !wallB[i-1][j] && Number.isFinite(maxDp[i-1][j])) {
         mx.push(maxDp[i-1][j]); mn.push(minDp[i-1][j]);
       }
       if (j>0 && !wallR[i][j-1] && Number.isFinite(maxDp[i][j-1])) {
         mx.push(maxDp[i][j-1]); mn.push(minDp[i][j-1]);
       }
       if (mx.length) {
         maxDp[i][j] = coins[i][j] + Math.max(...mx);
         minDp[i][j] = coins[i][j] + Math.min(...mn);
       }
     }

     const terminal=[];
     for (i=0;i<size;i++) for (j=0;j<size;j++) {
       const noRight = j===size-1 || wallR[i][j];
       const noDown = i===size-1 || wallB[i][j];
       if (noRight && noDown && Number.isFinite(maxDp[i][j])) {
         terminal.push({i,j,max:maxDp[i][j],min:minDp[i][j]});
       }
     }
     if (!terminal.length) throw new Error('Нет достижимой конечной клетки');
     const answerMax = Math.max(...terminal.map(x=>x.max));
     const answerMin = Math.min(...terminal.map(x=>x.min));

     let html='<div style="overflow-x:auto"><table class="g" style="font-size:13px;margin:14px auto">';
     for (i=0;i<size;i++) {
       html+='<tr>';
       for (j=0;j<size;j++) {
         const b=[];
         if (j<size-1 && wallR[i][j]) b.push('border-right:4px solid #d02438');
         if (i<size-1 && wallB[i][j]) b.push('border-bottom:4px solid #d02438');
         html+='<td style="min-width:30px;height:30px;padding:2px;'+b.join(';')+'">'+coins[i][j]+'</td>';
       }
       html+='</tr>';
     }
     html+='</table></div>';

     let xmlRows='', styles='<Style ss:ID="Default"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>';
     for (i=0;i<size;i++) {
       xmlRows+='<Row>';
       for (j=0;j<size;j++) {
         const borders=[];
         if (j<size-1 && wallR[i][j]) borders.push('<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');
         if (i<size-1 && wallB[i][j]) borders.push('<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');
         const id='W'+i+'_'+j;
         if (borders.length) styles+='<Style ss:ID="'+id+'"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders>'+borders.join('')+'</Borders></Style>';
         xmlRows+='<Cell ss:StyleID="'+(borders.length?id:'Default')+'"><Data ss:Type="Number">'+coins[i][j]+'</Data></Cell>';
       }
       xmlRows+='</Row>';
     }
     const xml='<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n'+
       '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles>'+
       styles+'</Styles><Worksheet ss:Name="Поле"><Table>'+xmlRows+'</Table></Worksheet></Workbook>';
     return {
       file:{name:'18.xls',text:xml,mime:'application/vnd.ms-excel;charset=utf-8;'},
       q:'В файле 18.xls записано поле размером '+size+'×'+size+'. Робот начинает в левой верхней клетке и может двигаться только вправо или вниз. Внутренние стены обозначены утолщёнными красными границами. Посетив клетку, Робот забирает монету. Он останавливается в клетке, из которой нельзя сделать ни один допустимый ход. Найдите максимальную и минимальную суммы среди всех достижимых конечных клеток. В ответе укажите два числа через пробел: сначала максимум, затем минимум.'+html,
       a:answerMax+' '+answerMin,
       s:'Для каждой клетки считаем максимальную и минимальную сумму от старта. Переход вправо возможен, если справа нет стены, а переход вниз — если снизу нет стены. Конечные клетки имеют закрытые выходы вправо и вниз либо расположены на внешней границе. Максимальная сумма равна '+answerMax+', минимальная — '+answerMin+'.'
     };
   }},

    // --- Задания 19, 20, 21 (две кучи, увеличение на 4 или удвоение) ---
  ...[false,true].flatMap(extra=>[19,20,21].map(n=>{
    const spec=extra
      ? {first:r(12,22),goal:r(115,155),add:4,maxS:110}
      : {first:17,goal:133,add:4,maxS:115};
    const moves=s=>[[s[0]+spec.add,s[1]],[s[0],s[1]+spec.add],[s[0]*2,s[1]],[s[0],s[1]*2]];
    const win=s=>s[0]+s[1]>=spec.goal;
    const memo=new Map();
    const W=(s,k)=>{
      if(k<=0)return false;
      const key=s.join(',')+':'+k;if(memo.has(key))return memo.get(key);
      const answer=moves(s).some(m=>win(m)||moves(m).every(x=>!win(x)&&W(x,k-1)));
      memo.set(key,answer);return answer;
    };
    const V=(s,k)=>moves(s).every(m=>!win(m)&&W(m,k));
    const initial=S=>[spec.first,S];
    const values=Array.from({length:spec.maxS},(_,i)=>i+1);
    let answer;
    if(n===19){
      answer=values.find(S=>moves(initial(S)).some(m=>!win(m)&&moves(m).some(win)));
    }else if(n===20){
      answer=values.filter(S=>W(initial(S),2)&&!W(initial(S),1)).slice(0,2);
    }else{
      answer=values.find(S=>V(initial(S),2)&&!V(initial(S),1));
    }
    if(answer===undefined||(Array.isArray(answer)&&answer.length!==2))throw new Error('Не найдены подходящие значения S для задания '+n);
    const head='Два игрока, Петя и Ваня, играют в две кучи камней. Изначально в первой куче '+spec.first+' камней, во второй — S. За ход можно добавить '+spec.add+' камня к одной из куч или удвоить количество камней в одной из куч. Игра заканчивается, когда суммарно становится не менее '+spec.goal+' камней. ';
    return {
      id:'g'+n+(extra?'_extra':''),
      name:'Теория игр: две кучи ('+(extra?'дополнительные числа':'демоверсия')+')',
      n,
      h:'Смоделируйте ходы для всех четырёх возможных действий. Проверяйте, кто может гарантировать победу независимо от ходов соперника.',
      g(){
        if(n===19)return {q:head+'Известно, что Ваня выиграл своим первым ходом. Найдите минимальное значение S, при котором такая ситуация возможна.',a:String(answer),
          s:'Перебираем значения S. Достаточно найти ситуацию, когда существует невыигрышный ход Пети, после которого Ваня может немедленно выиграть одним из своих ходов. Минимальное S равно '+answer+'.'};
        if(n===20)return {q:head+'Найдите два наименьших значения S, при которых у Пети есть выигрышная стратегия, причём Петя не может выиграть за один ход, но может выиграть своим вторым ходом независимо от ходов Вани. Запишите два числа по возрастанию.',a:answer.join(' '),
          s:'Для каждого S проверяем, что Петя не выигрывает сразу, но может выбрать первый ход так, чтобы после любого ответа Вани у него оставался выигрышный ход. Два наименьших значения: '+answer.join(' и ')+'.'};
        return {q:head+'Найдите наименьшее S, при котором у Вани есть стратегия, позволяющая ему выиграть первым или вторым ходом при любой игре Пети, но нет стратегии гарантированного выигрыша первым ходом.',a:String(answer),
          s:'Проверяем все ответы Пети на первом ходу и все продолжения до второго хода Вани. Минимальное значение S, при котором Ваня гарантирует победу не позднее второго своего хода, но не может гарантировать победу первым ходом, равно '+answer+'.'};
      }
    };
  })),

  // --- Задание 22 (параллельные процессы на 7-й миллисекунде) ---
  {id:'proc',name:'Параллельные процессы на 7-й мс',n:22,f:1,
   h:'Независимые процессы стартуют на 1-й миллисекунде. Зависимый процесс стартует на следующей миллисекунде после завершения последней зависимости.',
   g(){
     const N=r(18,30),targetMs=7,processes=[];
     for(let id=1;id<=N;id++){
       const duration=r(1,9),deps=[];
       if(id>3)for(let j=1;j<id;j++)if(Math.random()<0.12)deps.push(j);
       processes.push({id,duration,deps});
     }
     const finish=[];
     for(const p of processes){
       p.start=p.deps.length?Math.max(...p.deps.map(id=>finish[id-1]+1)):1;
       p.finish=p.start+p.duration-1;
       finish[p.id-1]=p.finish;
     }
     const active=processes.filter(p=>p.start<=targetMs&&p.finish>=targetMs).length;
     const content='ID;Время выполнения, мс;ID зависимостей\n'+
       processes.map(p=>[p.id,p.duration,p.deps.join(',')||'0'].join(';')).join('\n');
     return {
       file:{name:'22.csv',text:content,mime:'text/csv;charset=utf-8;'},
       q:'В файле 22.csv записана информация о вычислительных процессах. В первом столбце указан ID процесса, во втором — время его выполнения в миллисекундах, в третьем — ID процессов, от которых он зависит. Для нескольких зависимостей ID перечислены через запятую. Независимый процесс имеет значение 0. Определите максимальное количество процессов, которые параллельно выполняются на 7-й миллисекунде. Каждый процесс начинается в самое раннее допустимое время и не приостанавливается. Нумерация миллисекунд начинается с 1.',
       a:String(active),
       s:'Вычисляем самое раннее время старта каждого процесса: независимые начинаются в момент 1, зависимые — на следующей миллисекунде после окончания самой поздней зависимости. Процесс выполняется на отрезке от '+ 'старта' +' до '+ 'старта + длительность − 1' +'. На 7-й миллисекунде одновременно выполняются '+active+' процессов.'
     };
   }},

  // --- Задание 23 (кратчайший путь в ориентированном взвешенном ациклическом графе) ---
  {id:'graph23',name:'Граф из файла: кратчайший путь',n:23,f:1,
   h:'Все рёбра направлены по топологическому порядку. Считайте кратчайшие расстояния от вершины 1, а в ответе оставьте целую часть.',
   g(){
     const middle=[...new Set(Array.from({length:r(10,16)},()=>r(2,999)))].filter(x=>x!==1&&x!==100);
     const nodes=[1,...middle,100];
     if(nodes[0]!==1)nodes.unshift(1);
     if(nodes[nodes.length-1]!==100)nodes.push(100);
     const edges=[],edgeSet=new Set();
     const weight=()=>Number((r(10,100000)/10).toFixed(1));
     for(let i=0;i<nodes.length-1;i++){
       const a=nodes[i],b=nodes[i+1];
       edges.push({a,b,w:weight()});edgeSet.add(a+':'+b);
     }
     for(let i=0;i<nodes.length;i++)for(let j=i+2;j<nodes.length;j++){
       if(edges.length<190&&Math.random()<0.24){
         const a=nodes[i],b=nodes[j];
         if(!edgeSet.has(a+':'+b)){edges.push({a,b,w:weight()});edgeSet.add(a+':'+b);}
       }
     }
     const distance=new Map(nodes.map(x=>[x,Infinity]));
     distance.set(1,0);
     const outgoing=new Map(nodes.map(x=>[x,[]]));
     for(const edge of edges)outgoing.get(edge.a).push(edge);
     for(const node of nodes){
       for(const edge of outgoing.get(node)){
         const candidate=distance.get(node)+edge.w;
         if(candidate<distance.get(edge.b))distance.set(edge.b,candidate);
       }
     }
     const answer=Math.floor(distance.get(100));
     const textFile=edges.map(e=>e.a+' '+e.b+' '+e.w.toFixed(1)).join('\n');
     return {
       file:{name:'23.txt',text:textFile},
       q:'В текстовом файле 23.txt содержится описание ациклического ориентированного взвешенного графа. В каждой строке записаны два натуральных числа L и M и одно положительное вещественное число W — вес ребра из L в M. Две вершины не соединены более чем одним ребром. Найдите целую часть длины кратчайшего пути из вершины 1 в вершину 100. Существование такого пути гарантируется. Номера вершин могут быть не подряд; L и M не превышают 1000. Числа разделены пробелами.',
       a:String(answer),
       s:'Все рёбра направлены от более ранней вершины топологического порядка к более поздней. Поэтому обрабатываем вершины по этому порядку и для каждого ребра обновляем кратчайшее расстояние до конечной вершины: dist[M]=min(dist[M],dist[L]+W). Длина кратчайшего пути равна '+distance.get(100).toFixed(1)+'. Её целая часть: '+answer+'.'
     };
   }},

  // --- Задание 24 (самое длинное корректное выражение) ---
  {id:'s24',name:'Поиск самого длинного арифметического выражения',n:24,f:1,
   h:'Число — это либо 0, либо цифра 6–9 с последующими цифрами 0, 6–9. Между числами стоит один оператор − или *.',
   g(){
     const allowed='06789-*';
     const randomText=len=>Array.from({length:len},()=>allowed[r(0,allowed.length-1)]).join('');
     const makeExpression=()=>{
       const parts=[];
       const terms=r(18,32);
       for(let i=0;i<terms;i++){
         const number=Math.random()<0.12?'0':String(r(6,9))+Array.from({length:r(1,4)},()=>pick(['0','6','7','8','9'])).join('');
         parts.push(number);
         if(i<terms-1)parts.push(pick(['-','*']));
       }
       return parts.join('');
     };
     const data=randomText(800)+makeExpression()+randomText(800);
     const expr=/(?:0|[6789][06789]*)(?:[-*](?:0|[6789][06789]*))*/y;
     let best=0,bestStart=0,bestText='';
     for(let i=0;i<data.length;i++){
       if(!/[06789]/.test(data[i]))continue;
       expr.lastIndex=i;
       const match=expr.exec(data);
       if(match&&match[0].length>best){best=match[0].length;bestStart=i;bestText=match[0];}
     }
     if(!best)throw new Error('Не удалось сгенерировать корректное выражение');
     return {
       file:{name:'24.txt',text:data},
       q:'Текстовый файл 24.txt состоит из цифр 0, 6, 7, 8, 9 и знаков арифметических операций «−» и «*». Определите максимальное количество символов в непрерывной последовательности, которая является корректным арифметическим выражением с целыми неотрицательными числами. В выражении никакие два знака операций не стоят рядом, в записи чисел отсутствуют ведущие нули, а число 0 не имеет знака.',
       a:String(best),
       s:'Корректное число — либо отдельный 0, либо число, начинающееся с 6, 7, 8 или 9 и продолжающееся допустимыми цифрами. Между числами стоит ровно один знак «−» или «*». Самый длинный корректный фрагмент начинается с позиции '+(bestStart+1)+', его длина — '+best+' символов.'
     };
   }},

  // --- Задание 25 (поиск чисел по маске) ---
  {id:'mask25',name:'Маска числа 3?12?14*5',n:25,
   h:'Знак ? заменяет одну цифру, знак * — произвольную последовательность цифр. Найдите все варианты и отсортируйте их.',
   g(){
     const mask='3?12?14*5',divisor=1917,found=[];
     for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)for(let len=0;len<=2;len++){
       const variants=len===0?['']:Array.from({length:10**len},(_,i)=>String(i).padStart(len,'0'));
       for(const middle of variants){
         const text='3'+a+'12'+b+'14'+middle+'5',value=Number(text);
         if(value<=10_000_000_000&&value%divisor===0)found.push({value,quotient:value/divisor});
       }
     }
     found.sort((a,b)=>a.value-b.value);
     if(!found.length)throw new Error('Для маски не найдено подходящих чисел');
     return {
       q:'Найдите все натуральные числа, не превышающие 10^10, соответствующие маске '+mask+' и делящиеся на '+divisor+' без остатка. Знак «?» означает ровно одну цифру, а «*» — любую последовательность цифр, в том числе пустую. В ответ запишите найденные числа и результаты деления на '+divisor+' в двух столбцах по возрастанию найденных чисел.',
       a:found.map(x=>x.value+' '+x.quotient).join('\n'),
       s:'Перебираем цифры на позициях «?» и длину последовательности «*» от нуля до двух цифр. Оставляем числа, кратные '+divisor+', сортируем их и вычисляем частные. Найдено '+found.length+' чисел.'
     };
   }},
  {id:'prime25',name:'Произведение двух простых множителей (дополнительная модель)',n:25,
   h:'Проверьте, что каждый множитель — простое число и содержит сочетание цифр 16 ровно один раз.',
   g(){
     const rows=[
       [1103299319,1693,651683],
       [1103309477,1693,651689],
       [1103322107,16187,68161],
       [1103323021,1693,651697],
       [1103328547,3169,348163]
     ];
     const isPrime=n=>{
       if(n<2)return false;
       for(let d=2;d*d<=n;d++)if(n%d===0)return false;
       return true;
     };
     for(const [value,p,q] of rows){
       if(p*q!==value||!isPrime(p)||!isPrime(q)||[p,q].some(x=>(String(x).match(/16/g)||[]).length!==1)){
         throw new Error('Ошибка в проверочной таблице простых множителей');
       }
     }
     return {
       q:'Переберите целые числа, большие 1 103 285 717, в порядке возрастания. Найдите числа, представимые в виде произведения ровно двух простых множителей (не обязательно различных), каждый из которых содержит в своей записи сочетание цифр «16» ровно один раз. В ответе запишите первые пять найденных чисел по возрастанию и для каждого — наименьший из двух простых множителей.',
       a:rows.map(([n,p,q])=>n+' '+Math.min(p,q)).join('\n'),
       s:'Для каждого найденного числа проверяем разложение на два простых множителя. В каждом множителе сочетание цифр «16» встречается ровно один раз. Строки ответа записываются по возрастанию произведения, справа указан меньший множитель.'
     };
   }},

// --- Задание 26 (рейтинг продуктов по срокам хранения) ---
  {id:'srv26',name:'Сервер: резервные копии буфера',n:26,f:1,
   h:'Суммируйте передачи по клиентам. Отдельно смоделируйте заполнение буфера и отберите копии до 11:59:59.',
   g(){
     const N=240,K=r(7500,10500),chosen=r(1000,9999),records=[];
     for(let i=0;i<N;i++){
       const sec=Math.floor(i*86400/N),hour=Math.floor(sec/3600),minute=Math.floor(sec%3600/60),second=sec%60;
       const client=i%3===0?chosen:r(1000,9999);
       const amount=client===chosen?r(550,950):r(80,420);
       records.push({sec,time:[hour,minute,second].map(x=>String(x).padStart(2,'0')).join(':'),client,amount});
     }
     const totals=new Map();
     for(const x of records)totals.set(x.client,(totals.get(x.client)||0)+x.amount);
     const winner=[...totals.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0][0];
     let buffer=0;const backups=[];
     for(const x of records){
       if(buffer>0&&buffer+x.amount>K){backups.push({sec:x.sec,size:buffer});buffer=0;}
       buffer+=x.amount;
     }
     const morning=backups.filter(x=>x.sec<=43199).map(x=>x.size).sort((a,b)=>b-a);
     const backupSum=morning[0]+morning[1];
     const fileText=N+' '+K+'\n'+records.map(x=>x.time+' '+x.client+' '+x.amount).join('\n');
     return {
       file:{name:'26-server.txt',text:fileText},
       q:'В файле 26-server.txt записаны время запроса, ID клиента и объём переданных данных. Если очередной запрос не помещается в буфере сервера вместимостью '+K+' Кбайт, создаётся резервная копия накопленных данных и буфер очищается. Определите ID клиента с наибольшим суммарным объёмом переданных данных и сумму объёмов двух крупнейших резервных копий, созданных до 12:00. Запишите два числа через пробел.',
       a:winner+' '+backupSum,
       s:'Максимальный суммарный объём передан клиентом '+winner+'. Две крупнейшие утренние резервные копии имеют общий объём '+backupSum+' Кбайт.'
     };
   }},


  {id:'rank26',name:'Рейтинг продуктов по срокам хранения (дополнительная модель)',n:26,f:1,
   h:'Отсортируйте все сроки. Если первым встретился срок хранения с момента изготовления, поставьте продукт на первое свободное место слева; если срок после вскрытия — справа.',
   g(){
     const N=r(150,260),used=new Set(),products=[];
     while(products.length<N){
       const shelf=r(1,5000),opened=r(1,5000);
       if(shelf===opened||used.has(shelf)||used.has(opened))continue;
       used.add(shelf);used.add(opened);
       products.push({id:products.length+1,shelf,opened});
     }
     const values=[];
     for(const p of products){
       values.push({value:p.shelf,id:p.id,kind:'shelf'});
       values.push({value:p.opened,id:p.id,kind:'opened'});
     }
     values.sort((a,b)=>a.value-b.value);
     const ranking=Array(N).fill(0),placed=new Set();
     let left=0,right=N-1,lastId=0,lastIndex=-1;
     for(const item of values){
       if(placed.has(item.id))continue;
       const index=item.kind==='shelf'?left++:right--;
       ranking[index]=item.id;
       placed.add(item.id);
       lastId=item.id;
       lastIndex=index;
     }
     const below=ranking.filter((id,index)=>index>lastIndex&&id!==0).length;
     const csv='ID;Срок хранения с даты изготовления;Срок после вскрытия\n'+
       products.map(p=>[p.id,p.shelf,p.opened].join(';')).join('\n');
     return {
       file:{name:'26.csv',text:csv,mime:'text/csv;charset=utf-8;'},
       q:'В файле 26.csv записаны сроки хранения продуктов с даты изготовления и сроки годности после вскрытия упаковки. Все значения различны. Обработайте сроки по возрастанию. Если очередное минимальное значение относится к сроку хранения с даты изготовления, поместите соответствующий продукт на первое свободное место рейтинга слева. Если оно относится к сроку после вскрытия, поместите продукт на первое свободное место справа. Если продукт уже попал в рейтинг, второе его значение пропустите. Определите ID продукта, который будет размещён последним, и количество продуктов, расположенных ниже него в рейтинге. В ответ запишите два числа через пробел.',
       a:lastId+' '+below,
       s:'Значения сортируются по возрастанию. Продукт занимает свободное место слева или справа по типу первого встретившегося срока. Последним размещён продукт с ID '+lastId+'. Ниже него находятся '+below+' продуктов.'
     };
   }},
// --- Задание 27 (энергетическая кластеризация и реальная частица-центр) ---
  {id: 's27', name: 'Кластеры по кинетической энергии', n: 27, f: 1,
   h: 'Считайте E=0,5·m·(Vx²+Vy²). Для каждого кластера центр — реальная частица с минимальной суммой модулей разностей кинетических энергий с остальными частицами.',
   g() {
     const bases=[4.2,12.2,20.2,28.2], groups=[], points=[];
     const tags=['II','II','II','IV','V','I','III','VI','VII','IV','V'];
     for(let c=0;c<4;c++){
       const group=[];
       for(let k=0;k<11;k++){
         const targetE=Number((bases[c]+Math.random()*1.4).toFixed(4));
         const mass=Number((1.2+Math.random()*3.8).toFixed(4));
         const speed=Math.sqrt(2*targetE/mass), angle=Math.random()*Math.PI*2;
         const vx=Number((speed*Math.cos(angle)).toFixed(5));
         const vy=Number((speed*Math.sin(angle)).toFixed(5));
         const x=Number((c*20+Math.random()*6).toFixed(4));
         const y=Number((Math.floor(k/4)*7+Math.random()*3).toFixed(4));
         const energy=0.5*mass*(vx*vx+vy*vy);
         const p={x,y,vx,vy,mass,tag:tags[k],energy};
         group.push(p); points.push(p);
       }
       groups.push(group);
     }
     const centers=groups.map(group=>{
       let best=group[0], bestSum=Infinity;
       for(const candidate of group){
         const sum=group.reduce((acc,p)=>acc+Math.abs(candidate.energy-p.energy),0);
         if(sum<bestSum){best=candidate;bestSum=sum;}
       }
       return best;
     });
     let q1=0;
     for(const group of groups){
       const special=group.filter(p=>p.tag==='II');
       for(let i=0;i<special.length;i++) for(let j=i+1;j<special.length;j++){
         q1=Math.max(q1,Math.hypot(special[i].x-special[j].x,special[i].y-special[j].y));
       }
     }
     const q2=Math.max(...centers.map(p=>p.energy));
     const ans1=Math.floor(q1*10000), ans2=Math.floor(q2*10000);
     const fileText=points.sort(()=>Math.random()-0.5).map(p=>[
       p.x.toFixed(4),p.y.toFixed(4),p.vx.toFixed(5),p.vy.toFixed(5),p.mass.toFixed(4),p.tag
     ].join(' ')).join('\n');
     return {
       file:{name:'27.txt',text:fileText},
       q:'Файл 27.txt содержит для каждой частицы координаты x и y, компоненты скорости Vx и Vy, массу m и структурный признак. Частицы образуют ровно четыре кластера по кинетической энергии E=0,5·m·(Vx²+Vy²). Модуль разности энергий любых двух частиц одного кластера не превышает 2,0. Центром кластера считается такая частица, для которой сумма модулей разностей её кинетической энергии с энергиями всех остальных частиц этого кластера минимальна. Для каждого кластера найдите центр. Затем определите Q1 — наибольшее евклидово расстояние между частицами с признаком II, принадлежащими одному кластеру, и Q2 — максимальную кинетическую энергию среди центров. В ответе запишите в одной строке два числа: целую часть Q1·10000 и целую часть Q2·10000.',
       a:ans1+' '+ans2,
       s:'Энергию каждой частицы считаем по формуле E=0,5·m·(Vx²+Vy²). Внутри каждого из четырёх кластеров центр выбирается среди реальных частиц по минимальной сумме модулей разностей кинетических энергий с остальными частицами. Максимальное расстояние между частицами с признаком II внутри одного кластера равно '+q1.toFixed(5)+'. Наибольшая энергия центра равна '+q2.toFixed(5)+'. Ответ: '+ans1+' '+ans2+'.'
     };
   }}

];

// Уровни
const LV = [[0, 'Бит'], [10, 'Байт'], [30, 'Килобайт'], [70, 'Мегабайт'], [120, 'Гигабайт'], [200, 'Терабайт']];

let S;
try { S = JSON.parse(localStorage.getItem('bt1')); } catch (e) { S = null; }
S = S || {st: {}, streak: 0, last: '', sp: 0, best: 0};
const save = () => { try { localStorage.setItem('bt1', JSON.stringify(S)); } catch (e) {} };
const day = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const total = () => Object.values(S.st).reduce((s, x) => s + x.ok, 0);

let mode = 'train', topic = 'all', cur = null, done = false, q = [], qi = 0, score = 0, left = 600, timer = null, miss = [];
let lastLv = '';

function toast(m) { 
  const t = document.createElement('div'); 
  t.className = 'toast'; 
  t.textContent = m; 
  document.body.append(t); 
  setTimeout(() => t.remove(), 3200); 
}

function head() {
  const n = total(); let i = LV.length - 1;
  while (LV[i][0] > n) i--;
  const nx = LV[i + 1];
  if (lastLv && lastLv !== LV[i][1]) toast('Новый уровень: ' + LV[i][1]);
  lastLv = LV[i][1];
  $('#lvn').textContent = 'Уровень: ' + LV[i][1];
  $('#xp').style.width = (nx ? (n - LV[i][0]) / (nx[0] - LV[i][0]) * 100 : 100) + '%';
  $('#lvt').textContent = nx ? `до уровня «${nx[1]}» осталось ${nx[0] - n}` : 'высший уровень';
  $('#stk').textContent = S.streak ? 'дней подряд: ' + S.streak : '';
}

function rec(id, ok) {
  const x = S.st[id] || (S.st[id] = {ok: 0, all: 0});
  x.all++; if (ok) x.ok++;
  const t = day(new Date());
  if (S.last !== t) { S.streak = S.last === day(new Date(Date.now() - 864e5)) ? S.streak + 1 : 1; S.last = t; }
  save(); head();
}

const gen = t => Object.assign({t}, t.g());
const pickTopic = () => topic === 'all' ? pick(T) : pick(T.filter(x => String(x.n) === topic));

function show(c) {
  cur = c; done = false;
  $('#tag').textContent = `Задание ${c.t.n} в КЕГЭ, ${c.t.name}`;
  $('#q').innerHTML = c.q;
  $('#fl').hidden = !c.file;
  if (c.file) {
    const mime = c.file.mime || (c.file.name.endsWith('.csv') ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;');
    $('#fl').innerHTML = `<a href="${URL.createObjectURL(new Blob([c.file.text], {type: mime}))}" download="${c.file.name}">Скачать файл ${c.file.name}</a>`;
  }
  const cd = $('#card'); cd.classList.remove('in', 'shake'); void cd.offsetWidth; cd.classList.add('in');
  $('#ans').value = ''; $('#ans').disabled = false; $('#chk').disabled = false;
  ['#hn', '#fb', '#sol'].forEach(s => $(s).hidden = true);
  $('#hint').hidden = mode !== 'train';
  $('#nxt').hidden = mode !== 'train';
  $('#nxt').textContent = 'Другое задание';
  $('#card').hidden = false;
  $('#ans').focus();
}

function check() {
  if (done) return;
  const v = $('#ans').value;
  if (!v.trim()) return;
  done = true;
  const ok = norm(v) === norm(cur.a);
  rec(cur.t.id, ok);
  if (mode === 'sprint') { if (ok) score++; else miss.push(cur.t.name); }
  if (!ok) $('#card').classList.add('shake');
  $('#fb').hidden = false;
  $('#fb').innerHTML = ok ? '<span class="tick">✓</span>Верно' : `<s>${esc(v)}</s> Неверно, должно быть ${esc(cur.a)}`;
  $('#sol').hidden = false;
  $('#sol').innerHTML = '<b>Как решать.</b> ' + cur.s;
  $('#ans').disabled = true; $('#chk').disabled = true;
  $('#nxt').hidden = false;
  $('#nxt').textContent = mode === 'train' ? 'Другое задание' : (qi >= 7 ? 'Показать оценку' : 'Дальше');
}

function next() {
  if (mode === 'train') {
    const o = T.filter(t => t !== cur.t && (topic === 'all' || t.n === cur.t.n));
    return show(gen(o.length ? pick(o) : cur.t));
  }
  qi++;
  if (qi >= 8) return fin();
  $('#cnt').textContent = `Задание ${qi + 1} из 8`;
  show(q[qi]);
}

function fin() {
  clearInterval(timer);
  $('#card').hidden = true; $('#bar').hidden = true;
  const g = score >= 7 ? 5 : score >= 5 ? 4 : score >= 3 ? 3 : 2;
  S.sp++; S.best = Math.max(S.best, score); save();
  const rep = miss.length ? `Стоит повторить: ${[...new Set(miss)].join(', ')}.` : 'Без ошибок, отлично.';
  $('#res').hidden = false;
  $('#res').innerHTML = `<div class="mark">${g}</div><p>Верно решено ${score} из 8. Времени потрачено ${fmt(600 - left)}.</p><p class="red">${rep}</p><button id="again">Ещё один спринт</button>`;
  $('#again').onclick = () => tab('sprint');
}

function stats() {
  const all = Object.values(S.st).reduce((s, x) => s + x.all, 0);
  const w = T.filter(t => S.st[t.id] && S.st[t.id].all >= 3)
    .sort((a, b) => S.st[a.id].ok / S.st[a.id].all - S.st[b.id].ok / S.st[b.id].all)[0];
  $('#stat').innerHTML = '<article class="sheet"><h2>Моя тетрадь</h2>' +
    `<p>Верно решено ${total()} из ${all}. Спринтов пройдено: ${S.sp}, лучший результат ${S.best} из 8.</p>` +
    (w ? `<p class="red">Хуже всего получается тема «${w.name}». Потренируйте её.</p>` : '') +
    Array.from({length: 27}, (_, i) => i + 1).map(n => {
      const x = T.filter(t => t.n === n).reduce((s, t) => { const y = S.st[t.id] || {ok: 0, all: 0}; return {ok: s.ok + y.ok, all: s.all + y.all}; }, {ok: 0, all: 0}), p = x.all ? Math.round(x.ok / x.all * 100) : 0;
      return `<div class="tp"><span>Задание ${n}</span><span class="bar"><i style="width:${p}%"></i></span><span>${x.all ? p + '% (' + x.ok + ' из ' + x.all + ')' : 'пока пусто'}</span></div>`;
    }).join('') + '<p><button id="rs" class="ghost">Стереть прогресс</button></p></article>';
  $('#rs').onclick = () => {
    if (confirm('Стереть весь прогресс?')) { S = {st: {}, streak: 0, last: '', sp: 0, best: 0}; lastLv = ''; save(); head(); stats(); }
  };
}

function tab(t) {
  clearInterval(timer); mode = t;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  $('#topics').hidden = t !== 'train'; $('#intro').hidden = t !== 'sprint';
  $('#stat').hidden = t !== 'stat';
  ['#bar', '#card', '#res', '#ng'].forEach(s => $(s).hidden = true);
  if (t === 'train') {
    topic = 'all';
    document.querySelectorAll('#topics button').forEach(x => x.classList.toggle('on', x.dataset.id === 'all'));
    show(gen(pickTopic()));
  }
  if (t === 'stat') stats();
}

$('#go').onclick = () => {
  q = [...new Set(T.filter(t => !t.f).map(t => t.n))].sort(() => Math.random() - .5).slice(0, 8).map(n => gen(pick(T.filter(t => t.n === n && !t.f))));
  qi = 0; score = 0; miss = []; left = 600;
  $('#intro').hidden = true; $('#bar').hidden = false;
  $('#cnt').textContent = 'Задание 1 из 8'; $('#tm').textContent = fmt(left);
  timer = setInterval(() => { left--; $('#tm').textContent = fmt(left); if (left <= 0) fin(); }, 1000);
  show(q[0]);
};

const FIPI = 'https://ege.fipi.ru/bank/index.php?proj=B9ACA5BBB2E19E434CD6BEC25284C67F';
$('#topics').innerHTML = '<button data-id="all" class="on">Все</button>' + Array.from({length: 27}, (_, i) => i + 1)
  .map(n => `<button data-id="${n}"${T.some(t => t.n === n) ? '' : ' class="fp" title="Генератора пока нет, задания этого номера есть в банке ФИПИ"'}>${n}</button>`).join('');

$('#topics').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  topic = b.dataset.id;
  document.querySelectorAll('#topics button').forEach(x => x.classList.toggle('on', x === b));
  const none = topic !== 'all' && !T.some(t => String(t.n) === topic);
  $('#ng').hidden = !none; $('#card').hidden = none;
  if (none) $('#ng').innerHTML = `Для задания ${topic} генератора в тренажёре пока нет. Реальные задания этого номера можно решать в <a href="${FIPI}" target="_blank" rel="noopener">открытом банке ФИПИ</a>.`;
  else show(gen(pickTopic()));
};

$('#tabs').onclick = e => { const b = e.target.closest('button'); if (b) tab(b.dataset.t); };
$('#chk').onclick = check;
$('#nxt').onclick = next;
$('#hint').onclick = () => { $('#hn').hidden = false; $('#hn').textContent = 'Подсказка: ' + cur.t.h; };
$('#ans').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && done && e.target.id !== 'ans' && e.target.tagName !== 'BUTTON') next(); });

head();
tab('train');
