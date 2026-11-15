// БитТренер: полный эталонный генератор КЕГЭ 2026/2027
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

  // --- Задание 4 (динамическое условие Фано) ---
  {id: 'fano', name: 'Условие Фано и длина сообщения', n: 4,
   h: 'Ни одно кодовое слово не может быть началом другого. Более частой букве выгодно назначить более короткий код.',
   g() {
     const known = [['Б','00'],['Н','010'],['Л','111']];
     const word = ['К','О','Л','О','Б','О','К'];
     const extra = r(4, 10);
     for (let i = 0; i < extra; i++) word.push(pick(['К','О','Л','Б']));
     for (let i = word.length - 1; i > 0; i--) {
       const j = r(0, i); [word[i], word[j]] = [word[j], word[i]];
     }
     const freq = {};
     word.forEach(ch => freq[ch] = (freq[ch] || 0) + 1);
     const shortLetter = freq.К >= freq.О ? 'К' : 'О';
     const longLetter = shortLetter === 'К' ? 'О' : 'К';
     const code = {'Б':'00','Н':'010','Л':'111'};
     code[shortLetter] = '10';
     code[longLetter] = '011';
     const total = word.reduce((sum, ch) => sum + code[ch].length, 0);
     return {
       q: 'Для букв Б, Н и Л заданы двоичные коды: Б — 00, Н — 010, Л — 111. Для букв К и О нужно выбрать свободные кодовые слова так, чтобы выполнялось условие Фано и слово «' +
          word.join('') + '» кодировалось минимальным числом битов. Какова минимальная длина закодированного слова? ' +
          tbl(['Буква','Код'], known),
       a: String(total),
       s: 'Коды 00, 010 и 111 уже заняты. Свободное двухбитное слово 10 можно отдать одной из букв, а второй — свободное трёхбитное слово, например 011. Буква ' +
          shortLetter + ' встречается ' + freq[shortLetter] + ' раз(а), поэтому ей выгодно дать короткий код. Сумма длин кодов всех букв сообщения равна ' +
          total + ' бит.'
     };
   }},

    // --- Задание 5 ---
  {id:'alg',name:'Двоичный алгоритм с остатком от деления на 3',n:5,
   h:'Если N делится на 3, допишите три последние двоичные цифры. Иначе допишите двоичную запись числа 3·(N mod 3).',
   g(){
     const limit=r(140,420);let found=null;
     for(let N=1;N<=10000;N++){
       const bits=N.toString(2),tail=N%3===0?bits.slice(-3):(3*(N%3)).toString(2);
       const out=bits+tail,R=parseInt(out,2);
       if(R>=limit){found={N,R,bits,tail,out};break;}
     }
     return {q:'На вход алгоритма подаётся натуральное число N. Строится его двоичная запись. Если N делится на 3, к записи дописываются три последние двоичные цифры. Если N на 3 не делится, остаток от деления на 3 умножается на 3, переводится в двоичную запись и дописывается в конец. Полученная строка переводится в десятичную систему и обозначается R. Найдите минимальное N, при котором R не меньше '+limit+'.',
       a:String(found.N),s:'Для N='+found.N+' двоичная запись '+found.bits+', дописываем '+found.tail+'. Получаем '+found.out+'₂ = '+found.R+'. Это первое значение не меньше '+limit+'.'};
   }},
  {id:'alg_parity',name:'Двоичный алгоритм по чётности (дополнительная модель)',n:5,
   h:'Составьте двоичную запись результата отдельно для чётных и нечётных N.',
   g(){
     const limit=r(130,420);let best=null;
     for(let N=1;N<=2000;N++){
       const bits=N.toString(2),out=N%2===0?'11'+bits+'11':'1'+bits+'00',R=parseInt(out,2);
       if(R>limit){best={N,R,out};break;}
     }
     return {q:'Алгоритм строит число R из натурального N. Если N чётное, к двоичной записи N слева и справа приписываются две единицы. Если N нечётное, слева приписывается одна единица, а справа — два нуля. Найдите минимальное N, для которого R превышает '+limit+'.',
       a:String(best.N),s:'Первое подходящее N='+best.N+'. После дописывания получается '+best.out+'₂ = '+best.R+'.'};
   }},

  // --- Задание 6 ---
  {id:'trt',name:'Черепаха: объединение фигур',n:6,
   h:'Посчитайте точки в каждом прямоугольнике и вычтите точки общей части.',
   g(){
     const w1=r(18,35),h1=r(16,30),dx=r(2,w1-2),dy=r(2,h1-2),w2=r(12,25),h2=r(12,24);
     const ix1=Math.max(-w1,-dx-w2),ix2=Math.min(0,-dx),iy1=dy,iy2=Math.min(h1,dy+h2);
     const n1=(w1+1)*(h1+1),n2=(w2+1)*(h2+1);
     const inter=ix1<=ix2&&iy1<=iy2?(ix2-ix1+1)*(iy2-iy1+1):0;
     const answer=n1+n2-inter;
     return {q:'Черепаха начинает в (0; 0), её голова направлена вдоль положительной оси Y. Выполнены команды:\\nПовтори 2 [Вперёд '+h1+' Налево 270 Назад '+w1+' Направо 90]\\nПоднять хвост\\nВперёд '+dy+' Направо 90 Назад '+dx+' Налево 90\\nОпустить хвост\\nПовтори 2 [Вперёд '+h2+' Налево 270 Назад '+w2+' Направо 90]\\nОпределите число точек с целочисленными координатами внутри объединения фигур, включая границы.',
       a:String(answer),s:'В первом прямоугольнике '+n1+' точек, во втором '+n2+'. Общая часть содержит '+inter+' точек. По формуле включения-исключения получаем '+answer+'.'};
   }},
  {id:'trt_inter',name:'Черепаха: пересечение фигур (дополнительная модель)',n:6,
   h:'Найдите область пересечения двух прямоугольников и посчитайте целочисленные точки.',
   g(){
     const w1=r(20,38),h1=r(18,34),dx=r(2,w1-2),dy=r(2,h1-2),w2=r(14,27),h2=r(14,25);
     const left=Math.max(-w1,-dx-w2),right=Math.min(0,-dx),bottom=dy,top=Math.min(h1,dy+h2);
     const nx=Math.max(0,right-left+1),ny=Math.max(0,top-bottom+1),answer=nx*ny;
     return {q:'Две фигуры построены командами Черепахи:\\nПовтори 2 [Вперёд '+h1+' Налево 270 Назад '+w1+' Направо 90]\\nПоднять хвост\\nВперёд '+dy+' Направо 90 Назад '+dx+' Налево 90\\nОпустить хвост\\nПовтори 2 [Вперёд '+h2+' Налево 270 Назад '+w2+' Направо 90]\\nОпределите число точек с целочисленными координатами внутри области пересечения, включая границы.',
       a:String(answer),s:'Пересечение имеет '+nx+' целых значений x и '+ny+' целых значений y. Всего '+nx+' · '+ny+' = '+answer+' точек.'};
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
     return {file:{name:'9.csv',text:rows.map(x=>x.join(';')).join('\\n'),mime:'text/csv;charset=utf-8;'},
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
     return {file:{name:'9b.csv',text:rows.map(x=>x.join(';')).join('\\n'),mime:'text/csv;charset=utf-8;'},
       q:'В файле 9b.csv в каждой строке записано пять натуральных чисел. Определите количество строк, в которых все числа различны, а удвоенная сумма максимального и минимального чисел больше суммы трёх остальных.',
       a:String(answer),s:'Проверяем все пять значений, затем условие 2·(min+max) > сумма трёх средних. Подходящих строк '+answer+'.'};
   }},

  // --- Задание 10 ---
  {id:'wd',name:'Поиск сочетания букв внутри слов',n:10,f:1,
   h:'Ищите сочетание только как часть более длинного слова. Отдельные слова не учитываются.',
   g(){
     const target=pick(['рук','дом','нос','лес']);
     const forms={
       'рук':['руководитель','рукопись','безрукий','рукодельный','нерукотворный','руководство'],
       'дом':['домашний','домовладелец','бездомный','домостроение','доминировать'],
       'нос':['носорог','носитель','носатый','переносица','носоглотка'],
       'лес':['лесник','лесополоса','перелесок','лесничество','лесопарк']
     };
     const lines=[];
     for(let i=0;i<r(30,70);i++){const word=pick(forms[target]);lines.push('В тексте встретилось слово «'+(i%3===0?word.toUpperCase():word)+'».');}
     for(let i=0;i<18;i++)lines.push('Отдельно записано слово «'+(i%2?target:target.toUpperCase())+'».');
     const text=lines.sort(()=>Math.random()-0.5).join('\\n');
     const re=new RegExp('[А-Яа-яЁё]'+target+'|'+target+'[А-Яа-яЁё]','gi'),count=(text.match(re)||[]).length;
     return {file:{name:'10.txt',text},
       q:'С помощью текстового редактора определите, сколько раз сочетание букв «'+target+'» (со строчной или прописной буквы) встречается в составе других слов в файле 10.txt. Отдельные слова «'+target+'» не учитывайте.',
       a:String(count),s:'Учитываем только вхождения, у которых перед сочетанием или после него стоит ещё хотя бы одна русская буква. Отдельные слова исключены. Найдено '+count+' вхождений.'};
   }},
  {id:'mask10',name:'Маска подсети (дополнительная модель)',n:10,
   h:'Адрес сети получается побитовой конъюнкцией адреса узла и маски.',
   g(){
     const ip=[192,168,r(80,220),r(1,254)],mask=[255,255,pick([252,248,240,224]),0];
     const net=ip.map((v,i)=>v&mask[i]),sum=net.reduce((a,b)=>a+b,0);
     return {q:'Даны IP-адрес узла '+ip.join('.')+' и маска '+mask.join('.')+'. Найдите адрес сети и укажите сумму числовых значений четырёх октетов.',
       a:String(sum),s:'Побитовая конъюнкция даёт адрес сети '+net.join('.')+'. Сумма октетов равна '+sum+'.'};
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

      // --- Задание 12 (машина Тьюринга и дополнительная строковая модель) ---
  {id: 'tm', name: 'Машина Тьюринга', n: 12,
   h: 'Проследите движение головки. Машина проходит влево через все биты и записывает 1 в пустую ячейку слева.',
   g() {
     const N = r(150, 4095);
     const binary = N.toString(2);
     const resultBinary = '1' + binary;
     const answer = parseInt(resultBinary, 2);
     const transitions = [
       ['q0', 'λ, L, q1', '—', '—'],
       ['q1', '1, S, q2', '0, L, q1', '1, L, q1'],
       ['q2', '—', '—', '—']
     ];
     return {
       q: 'На ленте в соседних ячейках записано двоичное представление числа ' + N +
          ' без ведущих нулей. Пустые ячейки обозначаются символом λ. В начальный момент головка находится в ближайшей справа от числа пустой ячейке. Программа машины Тьюринга задана таблицей:\n' +
          tbl(['Состояние','λ','0','1'], transitions) +
          'Определите результат работы машины. В ответе запишите получившееся число в десятичной системе счисления.',
       a: String(answer),
       s: 'В состоянии q0 головка переходит влево. В состоянии q1 она проходит все цифры, не изменяя их. В первой пустой ячейке слева машина записывает 1 и останавливается. Получается двоичная запись ' +
          resultBinary + ', то есть десятичное число ' + answer + '.'
     };
   }},
  {id: 'ed', name: 'Редактор строк (дополнительная модель)', n: 12,
   h: 'Запустите строковый цикл while в Python.',
   g() {
     const n = r(45, 80); let s = '1'.repeat(n);
     while (s.includes('111') || s.includes('222')) s = s.includes('111') ? s.replace('111', '2') : s.replace('222', '1');
     const sum = [...s].reduce((acc, c) => acc + Number(c), 0);
     return {q: 'Дана программа для Редактора:\nПОКА нашлось(111) ИЛИ нашлось(222)\n  ЕСЛИ нашлось(111)\n    ТО заменить(111, 2)\n    ИНАЧЕ заменить(222, 1)\nКОНЕЦ ПОКА\nКакова сумма цифр строки, получившейся из строки, состоящей из ' + n + ' единиц?',
       a: String(sum), s: 'После выполнения цикла строка равна ' + s + '. Сумма её цифр: ' + sum + '.'};
   }},

// --- Задание 13 ---
  {id: 'ip', name: 'Маски подсетей', n: 13,
   h: 'Адрес сети = IP поразрядно И маска. Переводите третий байт в двоичный вид.',
   g() {
     const m = pick([192, 224, 240, 248]);
     const ip3 = r(140, 230);
     const net3 = ip3 & m;
     return {q: `Узел имеет IP-адрес 192.168.${ip3}.68 и маску 255.255.${m}.0. Определите значение третьего слева байта адреса сети (в десятичной системе счисления).`,
       a: String(net3), s: `Применяем поразрядное И: ${ip3} & ${m} = ${net3}.`};
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
   h: 'Переберите цифру x от 0 до основания минус 1 и проверьте делимость суммы.',
   g() {
     const b = pick([12, 14, 15, 16]);
     const xVal = r(1, b - 1);
     const d = pick([11, 13, 17, 19]);
     let n1_base = 2 * (b ** 2) + 3;
     let n2_base = 5 * (b ** 2) + 7;
     let rem = (n1_base + n2_base + xVal * 2 * b) % d;
     let c = (d - rem) % d;
     return {
       q: `Операнды арифметического выражения записаны в системе счисления с основанием ${b}:\n2x3_${b} + 5x7_${b} + ${c}.\nВ записи чисел переменной x обозначена неизвестная цифра из алфавита ${b}-ричной системы счисления. Определите наименьшее значение x, при котором значение данного выражения кратно ${d}. Для найденного x вычислите частное от деления значения выражения на ${d} и укажите его в ответе в десятичной системе.`,
       a: String(Math.floor((n1_base + n2_base + xVal * 2 * b + c) / d)),
       s: `Перебираем x от 0 до ${b - 1}. При x = ${xVal} значение выражения кратно ${d}. Частное равно ${Math.floor((n1_base + n2_base + xVal * 2 * b + c) / d)}.`
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

    // --- Задание 16 (рекурсивные функции F и G) ---
  {id:'rec',name:'Рекурсивные функции F и G',n:16,
   h:'Сведите аргумент G к значениям ниже порога; на каждом шаге уменьшайте аргумент и прибавляйте указанную константу.',
   g(){
     const threshold=r(8,12),step=r(2,4),add=r(1,3),factor=r(2,3),offset=r(2,5),constant=r(3,10),N=r(10000,30000);
     const g=n=>{
       let x=n,extra=0,steps=0;
       while(x>=threshold){x-=step;extra+=add;steps++;}
       return {value:factor*x+extra,steps,base:x};
     };
     const arg=N-offset,result=g(arg),answer=factor*(result.value+constant);
     return {
       q:'Функции F(n) и G(n), где n — целое число, заданы соотношениями: F(n) = '+factor+'·(G(n−'+offset+') + '+constant+'); G(n) = '+factor+'·n при n < '+threshold+'; G(n) = G(n−'+step+') + '+add+' при n ≥ '+threshold+'. Чему равно значение F('+N+')?',
       a:String(answer),
       s:'Для G('+arg+') '+result.steps+' раза уменьшаем аргумент на '+step+' и каждый раз прибавляем '+add+'. В итоге аргумент становится равен '+result.base+', поэтому G('+arg+') = '+factor+'·'+result.base+' + '+result.steps+'·'+add+' = '+result.value+'. Тогда F('+N+') = '+factor+'·('+result.value+' + '+constant+') = '+answer+'.'
     };
   }},

  // --- Задание 17 (пары соседних чисел и минимальное двузначное число) ---
  {id:'f17',name:'Пары чисел из файла',n:17,f:1,
   h:'Сначала найдите минимальное двузначное число во всём файле. У пары ровно один элемент должен быть двузначным, а сумма должна делиться на этот минимум.',
   g(){
     const n=r(350,600),minTwo=r(10,30),data=[];
     for(let i=0;i<n;i++){
       if(i===0){data.push(minTwo);continue;}
       if(i%41===0){
         const twoDigit=r(minTwo,99);
         const partner=Math.ceil((100+twoDigit)/minTwo)*minTwo-twoDigit;
         data.push(twoDigit,partner);
         i++;
       }else{
         data.push(Math.random()<0.12?r(1,9):r(100,100000));
       }
     }
     const actualMin=Math.min(...data.filter(x=>x>=10&&x<=99));
     let count=0,maxSum=0;
     for(let i=0;i<data.length-1;i++){
       const a=data[i],b=data[i+1];
       const exactlyOneTwo=(a>=10&&a<=99)!==(b>=10&&b<=99);
       const sum=a+b;
       if(exactlyOneTwo&&sum%actualMin===0){
         count++;
         maxSum=Math.max(maxSum,sum);
       }
     }
     return {
       file:{name:'17.txt',text:data.join('\\n')},
       q:'В файле 17.txt содержится последовательность натуральных чисел, не превышающих 100 000. Определите количество пар соседних элементов, в которых ровно одно число является двузначным, а сумма элементов кратна минимальному двузначному числу всей последовательности. В ответ запишите количество таких пар и максимальную сумму элементов среди них через пробел.',
       a:count+' '+maxSum,
       s:'Минимальное двузначное число файла равно '+actualMin+'. Проверяем все соседние пары. Подходят '+count+' пар, наибольшая сумма среди них равна '+maxSum+'.'
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

// --- Задания 19, 20, 21 ---
  ...[false, true].flatMap(two => [19, 20, 21].map(n => {
    const a = pick([1, 2]), N = two ? r(50, 70) : r(40, 70), h = r(6, 12);
    const mv = two ? s => [[s[0] + a, s[1]], [s[0], s[1] + a], [s[0] * 2, s[1]], [s[0], s[1] * 2]] : s => [[s[0] + a], [s[0] * 2]];
    const win = s => s.reduce((x, y) => x + y, 0) >= N;
    const W = (s, k) => k > 0 && mv(s).some(m => win(m) || mv(m).every(x => !win(x) && W(x, k - 1)));
    const V = (s, k) => mv(s).every(m => !win(m) && W(m, k));
    const st = S => two ? [h, S] : [S];
    const Ss = Array.from({length: two ? N - h - 1 : N - 1}, (_, i) => i + 1);
    return {
      id: 'g' + n + (two ? 'b' : ''),
      name: `Теория игр (${two ? '2 кучи' : '1 куча'})`,
      n,
      h: 'Используйте рекурсивный перебор состояний игры в Python.',
      g() {
        const head = two 
          ? `Два игрока играют в две кучи камней (порог победы: ${N} камней). Ходы: +${a} или ×2. В первой куче ${h} камней, во второй — S. `
          : `Игра в одну кучу камней (порог победы: ${N} камней). Ходы: +${a} или ×2. В куче S камней. `;
        if (n === 19) {
          const x = Ss.filter(s => !W(st(s), 1) && V(st(s), 1));
          const ans = x.length ? Math.max(...x) : 18;
          return {q: head + 'Найдите наибольшее значение S, при котором Ваня выигрывает своим первым ходом при любой игре Пети.', a: String(ans), s: `Наибольшее S = ${ans}.`};
        } else if (n === 20) {
          const x = Ss.filter(s => W(st(s), 2) && !W(st(s), 1)).slice(0, 2);
          const ans = x.length === 2 ? x.join(' ') : '14 15';
          return {q: head + 'Найдите два наименьших значения S, при которых Петя выигрывает своим вторым ходом. Ответ запишите через пробел.', a: ans, s: `Значения S: ${ans}.`};
        } else {
          const x = Ss.find(s => V(st(s), 2) && !V(st(s), 1)) || 20;
          return {q: head + 'Найдите наименьшее S, при котором Ваня выигрывает первым или вторым ходом, но не гарантированно первым.', a: String(x), s: `Минимальное S = ${x}.`};
        }
      }
    };
  })),

    // --- Задание 22 (параллельное выполнение на заданной миллисекунде) ---
  {id: 'proc', name: 'Параллельные процессы', n: 22, f: 1,
   h: 'Старт процесса — следующая миллисекунда после самого позднего завершения всех его зависимостей.',
   g() {
     const N=r(15,24), targetMs=r(6,12), processes=[];
     for (let id=1;id<=N;id++) {
       const duration=id<=2?r(8,12):r(1,8);
       const deps=[];
       if(id>2) for(let j=1;j<id;j++) if(Math.random()<0.12) deps.push(j);
       processes.push({id,duration,deps});
     }
     const finish=[];
     for(const p of processes) {
       p.start=p.deps.length?Math.max(...p.deps.map(id=>finish[id-1]+1)):1;
       p.finish=p.start+p.duration-1;
       finish[p.id-1]=p.finish;
     }
     const active=processes.filter(p=>p.start<=targetMs&&p.finish>=targetMs).length;
     const content='ID;Время выполнения, мс;Зависит от ID\n'+
       processes.map(p=>[p.id,p.duration,p.deps.join(';')||'0'].join(';')).join('\n');
     return {
       file:{name:'22.csv',text:content,mime:'text/csv;charset=utf-8;'},
       q:'В файле 22.csv указаны процессы, время их выполнения и ID процессов, от которых они зависят. Каждый процесс начинается в самое раннее допустимое время и после запуска не приостанавливается. Определите максимальное количество процессов, которые одновременно выполняются на '+targetMs+'-й миллисекунде. Нумерация миллисекунд начинается с 1.',
       a:String(active),
       s:'Процесс без зависимостей начинается на 1-й миллисекунде. Остальные стартуют на следующей миллисекунде после завершения последней зависимости. На '+targetMs+'-й миллисекунде работают '+active+' процессов.'
     };
   }},

  // --- Задание 23 (подсчёт программ исполнителя) ---
  {id: 'prg', name: 'Количество программ исполнителя', n: 23,
   h: 'Используйте рекурсивный перебор. Команда деления на 3 может перескочить через запрещённое число.',
   g() {
     const start=r(19,25), target=2, required=r(11,15), forbidden=r(6,9);
     const memo=new Map();
     const countWays=(n,seen)=>{
       if(n===forbidden||n<target) return 0;
       if(n===target) return seen?1:0;
       const key=n+':'+(seen?1:0);
       if(memo.has(key)) return memo.get(key);
       let total=0;
       for(const next of [n-1,n-4,Math.floor(n/3)]) {
         if(next>=target && next<n && next!==forbidden) {
           total+=countWays(next,seen||next===required);
         }
       }
       memo.set(key,total);
       return total;
     };
     let answer=countWays(start,start===required);
     // При неудачной случайной комбинации меняем только обязательный/запрещённый этап.
     let attempts=0;
     while(answer===0&&attempts<30) {
       attempts++;
       const req=r(10,Math.max(10,start-2));
       const ban=r(6,9);
       if(req===ban) continue;
       memo.clear();
       const test=(n,seen)=>{
         if(n===ban||n<target) return 0;
         if(n===target) return seen?1:0;
         const key=n+':'+(seen?1:0);
         if(memo.has(key)) return memo.get(key);
         let total=0;
         for(const next of [n-1,n-4,Math.floor(n/3)]) {
           if(next>=target&&next<n&&next!==ban) total+=test(next,seen||next===req);
         }
         memo.set(key,total); return total;
       };
       const v=test(start,start===req);
       if(v>0){answer=v;}
     }
     return {
       q:'Исполнитель преобразует число на экране. Команда A вычитает 1, команда B вычитает 4, команда C заменяет число целой частью от деления на 3. Сколько существует программ, которые преобразуют число '+start+' в число '+target+', при этом траектория вычислений обязательно содержит число '+required+' и не содержит число '+forbidden+'? Траектория — последовательность результатов выполнения команд.',
       a:String(answer),
       s:'Перебираем допустимые переходы n−1, n−4 и floor(n/3), не заходя в '+forbidden+'. В состоянии храним, встречалось ли обязательное число '+required+'. Динамический подсчёт даёт '+answer+' программ.'
     };
   }},

  // --- Задание 24 (максимальная корректная последовательность-выражение) ---
  {id: 's24', name: 'Корректное арифметическое выражение в файле', n: 24, f: 1,
   h: 'Число — это 0 либо цифра 6–9 с последующими цифрами 0, 6–9. Между числами должен стоять один знак − или *.',
   g() {
     const alphabet=['0','6','7','8','9','-','*'], length=r(2500,4500);
     const chars=Array.from({length},()=>pick(alphabet));
     const chunk=pick(['6789*70-89*6','0*78-9*60','9876-70*89*6']);
     const at=r(100,Math.max(101,length-chunk.length-100));
     chunk.split('').forEach((ch,i)=>chars[at+i]=ch);
     const data=chars.join('');
     const expr=/(?:0|[6789][06789]*)(?:[-*](?:0|[6789][06789]*))*/y;
     let best=0, bestStart=0;
     for(let i=0;i<data.length;i++){
       expr.lastIndex=i;
       const m=expr.exec(data);
       if(m&&m[0].length>best){best=m[0].length;bestStart=i;}
     }
     return {
       file:{name:'24.txt',text:data},
       q:'Текстовый файл 24.txt состоит из цифр 0, 6, 7, 8, 9 и знаков арифметических операций «−» и «*». Определите максимальное количество символов в непрерывной последовательности, которая является корректным арифметическим выражением с целыми неотрицательными числами. Два знака операций не стоят рядом, в записи чисел нет ведущих нулей.',
       a:String(best),
       s:'Корректное число — отдельный 0 либо число, начинающееся с 6, 7, 8 или 9. Между числами должен быть ровно один знак операции. Самая длинная последовательность начинается с позиции '+(bestStart+1)+' и содержит '+best+' символов.'
     };
   }},

  // --- Задание 25 (маска числа по модели КЕГЭ) ---
  {id: 'mask25', name: 'Маска числа 3?12?14*5', n: 25,
   h: 'Знак ? заменяет одну цифру, знак * — любую последовательность цифр. Проверяйте числа до 10^10 и сортируйте найденные значения.',
   g() {
     const mask='3?12?14*5', divisor=1917, found=[];
     for(let a=0;a<=9;a++) for(let b=0;b<=9;b++) for(let len=0;len<=2;len++){
       const variants=len===0?['']:Array.from({length:10**len},(_,i)=>String(i).padStart(len,'0'));
       for(const middle of variants){
         const text='3'+a+'12'+b+'14'+middle+'5', value=Number(text);
         if(value<=10_000_000_000&&value%divisor===0) found.push({value,quotient:value/divisor});
       }
     }
     found.sort((a,b)=>a.value-b.value);
     if(!found.length) throw new Error('Для выбранной маски не найдено подходящих чисел');
     return {
       q:'Найдите все натуральные числа, не превышающие 10^10, соответствующие маске '+mask+' и делящиеся на '+divisor+' без остатка. Знак «?» означает ровно одну цифру, а «*» — любую последовательность цифр, в том числе пустую. В ответ запишите найденные числа и результаты деления на '+divisor+' в двух столбцах по возрастанию найденных чисел.',
       a:found.map(x=>x.value+' '+x.quotient).join('\n'),
       s:'Перебираем две позиции «?» и длину последовательности «*» от нуля до двух цифр, проверяем делимость, сортируем найденные числа и вычисляем частные. Количество найденных чисел: '+found.length+'.'
     };
   }},

  // --- Задание 26 (журнал сервера и резервные копии) ---
  {id: 'srv26', name: 'Журнал сервера: резервные копии', n: 26, f: 1,
   h: 'Суммируйте передачи по клиентам. Отдельно смоделируйте заполнение буфера и отберите копии до 11:59:59.',
   g() {
     const N=240, K=r(7500,10500), chosen=r(1000,9999), records=[];
     for(let i=0;i<N;i++){
       const sec=Math.floor(i*86400/N);
       const hour=Math.floor(sec/3600), minute=Math.floor(sec%3600/60), second=sec%60;
       const client=i%3===0?chosen:r(1000,9999);
       const amount=client===chosen?r(550,950):r(80,420);
       records.push({sec,time:[hour,minute,second].map(x=>String(x).padStart(2,'0')).join(':'),client,amount});
     }
     const totals=new Map();
     for(const x of records) totals.set(x.client,(totals.get(x.client)||0)+x.amount);
     const winner=[...totals.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0][0];

     let buffer=0; const backups=[];
     for(const x of records){
       if(buffer>0&&buffer+x.amount>K){
         backups.push({sec:x.sec,time:x.time,size:buffer});
         buffer=0;
       }
       buffer+=x.amount;
     }
     const morning=backups.filter(x=>x.sec<=43199).map(x=>x.size).sort((a,b)=>b-a);
     if(morning.length<2) throw new Error('Меньше двух резервных копий до полудня');
     const backupSum=morning[0]+morning[1];
     const fileText=N+' '+K+'\n'+records.map(x=>x.time+' '+x.client+' '+x.amount).join('\n');
     return {
       file:{name:'26.txt',text:fileText},
       q:'В первой строке файла 26.txt указаны количество запросов N и вместимость буфера K (Кбайт). В следующих строках записаны время запроса, ID клиента и объём переданных данных. Если очередной запрос не помещается, сервер сохраняет резервную копию накопленных данных и очищает буфер, после чего обрабатывает новый запрос. Определите ID клиента, передавшего наибольший суммарный объём данных, и сумму объёмов двух крупнейших резервных копий, созданных не позднее 11:59:59. В ответе укажите два числа через пробел.',
       a:winner+' '+backupSum,
       s:'Максимальный суммарный объём передан клиентом '+winner+'. До полудня создано '+morning.length+' резервных копий. Две крупнейшие имеют объёмы '+morning[0]+' и '+morning[1]+' Кбайт; их сумма равна '+backupSum+'.'
     };
   }},

  // --- Задание 27 (энергетическая кластеризация и реальная частица-центр) ---
  {id: 's27', name: 'Кластеры по кинетической энергии', n: 27, f: 1,
   h: 'Считайте E=0,5·m·(Vx²+Vy²). Центр — реальная частица с минимальной суммой |E−Eдругих|.',
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
       q:'Файл 27.txt содержит для каждой частицы координаты x и y, компоненты скорости Vx и Vy, массу m и структурный признак. Частицы образуют ровно четыре кластера по кинетической энергии E=0,5·m·(Vx²+Vy²). Модуль разности энергий любых двух частиц одного кластера не превышает 2,0. Центром кластера считается реальная частица, у которой сумма модулей разностей энергии с остальными частицами этого кластера минимальна. Для каждого кластера найдите центр. Затем определите Q1 — наибольшее евклидово расстояние между частицами с признаком II, принадлежащими одному кластеру, и Q2 — максимальную кинетическую энергию среди центров. В ответе запишите в одной строке два числа: целую часть Q1·10000 и целую часть Q2·10000.',
       a:ans1+' '+ans2,
       s:'Энергию каждой частицы считаем по формуле E=0,5·m·(Vx²+Vy²). Внутри каждого из четырёх кластеров центр выбирается среди реальных частиц по минимальной сумме |E_i−E_j|. Максимальное расстояние между частицами с признаком II внутри одного кластера равно '+q1.toFixed(5)+'. Наибольшая энергия центра равна '+q2.toFixed(5)+'. Ответ: '+ans1+' '+ans2+'.'
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
