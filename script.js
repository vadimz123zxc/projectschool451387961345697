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

  // --- Задание 3 (3-страничный файл .xls) ---
  {id: 'db', name: 'Базы данных (Excel/Calc)', n: 3, f: 1,
   h: 'Откройте файл 3.xls в Calc / Excel. Свяжите листы формулой =ВПР() и примените автофильтр.',
   g() {
     const shops = [
       {id: 'M1', dist: 'Заречный', addr: 'ул. Мира, 14'},
       {id: 'M2', dist: 'Центральный', addr: 'пр. Ленина, 5'},
       {id: 'M3', dist: 'Октябрьский', addr: 'ул. Гагарина, 22'},
       {id: 'M4', dist: 'Заречный', addr: 'ул. Победы, 8'},
       {id: 'M5', dist: 'Центральный', addr: 'ул. Советская, 31'},
       {id: 'M6', dist: 'Октябрьский', addr: 'пр. Мира, 47'}
     ];

     const goods = [
       {id: 1, name: 'Молоко 3.2%', dept: 'Молочные', price: r(60, 90)},
       {id: 2, name: 'Кефир 2.5%', dept: 'Молочные', price: r(55, 80)},
       {id: 3, name: 'Сыр Российский', dept: 'Молочные', price: r(180, 260)},
       {id: 4, name: 'Чай черный 100г', dept: 'Бакалея', price: r(90, 150)},
       {id: 5, name: 'Сахар-песок 1кг', dept: 'Бакалея', price: r(60, 85)},
       {id: 6, name: 'Масло подсолнечное', dept: 'Бакалея', price: r(110, 160)},
       {id: 7, name: 'Рис круглозерный', dept: 'Бакалея', price: r(80, 130)}
     ];

     const targetShop = pick(shops);
     const targetDept = pick(['Молочные', 'Бакалея']);
     const dStart = r(1, 8), dEnd = dStart + r(8, 14);

     const ops = [];
     let totalSum = 0;
     for (let i = 0; i < 140; i++) {
       const day = r(1, 28);
       const sh = pick(shops);
       const gd = pick(goods);
       const count = r(10, 60);
       ops.push({day, shopId: sh.id, goodId: gd.id, count});

       if (sh.dist === targetShop.dist && gd.dept === targetDept && day >= dStart && day <= dEnd) {
         totalSum += count * gd.price;
       }
     }

     const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Движение товаров">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">Дата (день)</Data></Cell>
    <Cell><Data ss:Type="String">ID магазина</Data></Cell>
    <Cell><Data ss:Type="String">Артикул</Data></Cell>
    <Cell><Data ss:Type="String">Количество упаковок, шт.</Data></Cell>
   </Row>
   ${ops.map(o => `<Row>
    <Cell><Data ss:Type="Number">${o.day}</Data></Cell>
    <Cell><Data ss:Type="String">${o.shopId}</Data></Cell>
    <Cell><Data ss:Type="Number">${o.goodId}</Data></Cell>
    <Cell><Data ss:Type="Number">${o.count}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Товар">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">Артикул</Data></Cell>
    <Cell><Data ss:Type="String">Отдел</Data></Cell>
    <Cell><Data ss:Type="String">Наименование товара</Data></Cell>
    <Cell><Data ss:Type="String">Цена, руб.</Data></Cell>
   </Row>
   ${goods.map(g => `<Row>
    <Cell><Data ss:Type="Number">${g.id}</Data></Cell>
    <Cell><Data ss:Type="String">${g.dept}</Data></Cell>
    <Cell><Data ss:Type="String">${g.name}</Data></Cell>
    <Cell><Data ss:Type="Number">${g.price}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Магазин">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">ID магазина</Data></Cell>
    <Cell><Data ss:Type="String">Район</Data></Cell>
    <Cell><Data ss:Type="String">Адрес</Data></Cell>
   </Row>
   ${shops.map(s => `<Row>
    <Cell><Data ss:Type="String">${s.id}</Data></Cell>
    <Cell><Data ss:Type="String">${s.dist}</Data></Cell>
    <Cell><Data ss:Type="String">${s.addr}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

     return {
       file: {name: '3.xls', text: xml, mime: 'application/vnd.ms-excel;charset=utf-8;'},
       q: `Используя информацию из базы данных (файл 3.xls), определите общую выручку (в рублях) от продажи товаров отдела «${targetDept}» в магазинах района «${targetShop.dist}» за период с ${dStart} по ${dEnd} число включительно. В файле содержатся три связанные таблицы: «Движение товаров», «Товар» и «Магазин».`,
       a: String(totalSum),
       s: `1. На листе «Движение товаров» подтягиваем Район и Отдел формулой =ВПР().\n2. Фильтруем строки по району «${targetShop.dist}», отделу «${targetDept}» и датам ${dStart}..${dEnd}.\n3. Складываем произведения Количество · Цена.\nИтоговая выручка: ${totalSum} руб.`
     };
   }},

  // --- Задание 4 ---
  {id: 'fano', name: 'Условие Фано', n: 4,
   h: 'Стройте двоичное дерево. Занятые узлы закрывают всю ветку под собой.',
   g() {
     return {q: 'По каналу связи передаются сообщения, содержащие только пять букв: А, Б, В, Г, Д. Для передачи используется двоичный код, удовлетворяющий условию Фано: А — 00, Б — 01, В — 10. Какова наименьшая возможная суммарная длина кодовых слов для букв Г и Д?',
       a: '5', s: 'Осталась ветка 11. Чтобы закодировать 2 буквы, берем коды длиной 2 и 3 (например, 110 и 111, сумма длин равна 5).'};
   }},

  // --- Задание 5 ---
  {id: 'alg', name: 'Анализ алгоритмов', n: 5,
   h: 'Напишите цикл перебора N от 1 до 1000 на Python.',
   g() {
     const X = r(120, 320);
     const R = n => { let s = n.toString(2); s += [...s].filter(c => c === '1').length % 2; s += [...s].filter(c => c === '1').length % 2; return parseInt(s, 2); };
     let N = 1; while (R(N) <= X) N++;
     return {q: `На вход алгоритма подаётся натуральное число N. Алгоритм строит число R: 1) Строится двоичная запись N. 2) К этой записи дописывается справа бит чётности (сумма цифр mod 2). 3) Шаг 2 повторяется. Укажите наименьшее число N, для которого результат R больше ${X}.`,
       a: String(N), s: `Перебором в Python находим наименьшее N = ${N}, дающее R = ${R(N)} > ${X}.`};
   }},

  // --- Задание 6 ---
  {id: 'trt', name: 'Исполнитель Черепаха', n: 6,
   h: 'Определите стороны фигуры и прибавьте 1 к каждой стороне для подсчета точек с границами.',
   g() {
     const a = r(5, 11), b = r(6, 14);
     const pts = (a + 1) * (b + 1);
     return {q: `Исполнитель Черепаха выполнил алгоритм:\nПовтори 2 [Вперёд ${a} Направо 90 Вперёд ${b} Направо 90]\nОпределите количество точек с целочисленными координатами, находящихся внутри полученного прямоугольника, включая его границы.`,
       a: String(pts), s: `Стороны: ${a} и ${b}. Количество целочисленных точек: (${a} + 1) · (${b} + 1) = ${pts}.`};
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
     const f = pick([16000, 24000, 32000]), b = pick([16, 24]), t = pick([20, 30, 40]), ch = pick([1, 2]);
     const v = f * b * t * ch / 8 / 1024;
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

  // --- Задание 8 (Вариации комбинаторики) ---
  {id: 'prm', name: 'Комбинаторика (алфавитный порядок)', n: 8,
   h: 'Число вариантов = N^L, где N — мощность алфавита, L — длина слова.',
   g() {
     const len = r(4, 5);
     const total = 5 ** len;
     return {q: `Все ${len}-буквенные слова, составленные из букв А, В, Е, И, К, записаны в алфавитном порядке и пронумерованы с 1. Сколько всего слов содержится в списке?`,
       a: String(total), s: `Каждое знакоместо содержит 5 вариантов. Всего: 5^${len} = ${total} слов.`};
   }},

  {id: 'prm_cnt', name: 'Комбинаторика с условиями', n: 8,
   h: 'Используйте правило произведения: зафиксируйте позицию обязательной буквы.',
   g() {
     const ans = 5 * (3 ** 4);
     return {q: `Сколько существует 5-буквенных слов, составленных из букв А, К, Р, У, в которых буква У встречается ровно 1 раз? Каждая из остальных букв может встречаться любое количество раз или не встречаться вовсе.`,
       a: String(ans), s: `Буква «У» может стоять на одной из 5 позиций. На остальных 4 позициях любая из 3 букв: 5 · 3⁴ = ${ans}.`};
   }},

  // --- Задание 9 (CSV) ---
  {id: 'ex9', name: 'Электронные таблицы (CSV)', n: 9, f: 1,
   h: 'Откройте файл 9.csv в Calc / Excel или решите в Python.',
   g() {
     const n = r(250, 400), rows = Array.from({length: n}, () => Array.from({length: 6}, () => r(1, 25)));
     let count = 0;
     for (const x of rows) {
       const cnt = {}; x.forEach(v => cnt[v] = (cnt[v] || 0) + 1);
       if (Object.values(cnt).filter(v => v === 2).length === 1 && Object.values(cnt).filter(v => v === 1).length === 4) count++;
     }
     return {file: {name: '9.csv', text: rows.map(x => x.join(';')).join('\n')},
       q: `Скачайте файл электронной таблицы 9.csv. В каждой строке записаны 6 натуральных чисел. Определите количество строк таблицы, содержащих ровно одно число, повторяющееся дважды, и 4 различных числа.`,
       a: String(count), s: `В Python: len(set(row)) == 5. Таких строк: ${count}.`};
   }},

  // --- Задание 10 (ФИПИ стандарт) ---
  {id: 'wd', name: 'Поиск слова в тексте', n: 10, f: 1,
   h: 'В текстовом редакторе включите «Слово целиком» и отключите «Учитывать регистр».',
   g() {
     const baseText = `
На дворе стояла глубокая осень. В саду непрерывно шумел холодный ветер. 
Ветер срывал сухие листья с берез и уносил их далеко за реку. Старый смотритель вышел на крыльцо.
Сильный ветер задувал свечу, и старик прикрыл пламя ладонью. За рекой виднелся темный лес.
Казалось, что ветер никогда не утихнет в этих краях. Ветреный день сменялся темной ночью.
Снова поднялся ветер, поднимая пыль по всей дороге. Никакой ветерок не мог облегчить тяжесть ожидания.
Он долго смотрел вдаль, пока осенний ветер шумел в кронах деревьев.
     `;
     const target = 'ветер';
     const count = 6;
     return {
       file: {name: '10.txt', text: baseText.repeat(8)},
       q: `С помощью текстового редактора определите, сколько раз, не считая сносок, встречается слово «${target}» (со строчной или прописной буквы) в тексте произведения (файл 10.txt). Другие формы слова, а также однокоренные слова (например, «ветреный», «ветерок») учитывать не следует.`,
       a: String(count * 8),
       s: `Поиск в текстовом редакторе слова «${target}» с опцией «Только слово целиком» дает ${count * 8} вхождений.`
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

  // --- Задание 12 ---
  {id: 'ed', name: 'Редактор строк', n: 12,
   h: 'Запустите строковый цикл while в Python.',
   g() {
     const n = r(45, 80); let s = '1'.repeat(n);
     while (s.includes('111') || s.includes('222')) s = s.includes('111') ? s.replace('111', '2') : s.replace('222', '1');
     const sum = [...s].reduce((acc, c) => acc + Number(c), 0);
     return {q: `Дана программа для Редактора:\nПОКА нашлось(111) ИЛИ нашлось(222)\n  ЕСЛИ нашлось(111)\n    ТО заменить(111, 2)\n    ИНАЧЕ заменить(222, 1)\nКОНЕЦ ПОКА\nКакова сумма цифр строки, получившейся из строки, состоящей из ${n} единиц?`,
       a: String(sum), s: `После выполнения цикла строка равна ${s}. Сумма её цифр: ${sum}.`};
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

  // --- Задание 14 (Вариации систем счисления) ---
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

  // --- Задание 15 (Вариации логики) ---
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

  // --- Задание 16 ---
  {id: 'rec', name: 'Рекурсия', n: 16,
   h: 'Определите рекурсивную функцию в Python с декоратором lru_cache.',
   g() {
     const k = r(2, 3), d = r(2, 4), n = r(5, 7);
     const f = [0, 1]; for (let i = 2; i <= n; i++) f[i] = k * f[i - 1] + d * i;
     return {q: `Алгоритм вычисления функции F(n) задан соотношениями:\nF(1) = 1\nF(n) = ${k}·F(n-1) + ${d}·n при n > 1\nЧему равно значение функции F(${n})?`,
       a: String(f[n]), s: `Вычисляем значения: ${f.slice(1).map((v, i) => `F(${i+1})=${v}`).join(', ')}. Ответ: ${f[n]}.`};
   }},

  // --- Задание 17 ---
  {id: 'f17', name: 'Пары чисел из файла', n: 17, f: 1,
   h: 'Прочитайте числа в список и переберите соседние элементы.',
   g() {
     const n = r(200, 350), k = pick([3, 5, 7]), M = r(850, 1250);
     const d = Array.from({length: n}, () => r(15, 1000));
     let c = 0;
     for (let i = 0; i < n - 1; i++) if ((d[i] % k === 0 || d[i + 1] % k === 0) && (d[i] + d[i + 1] <= M)) c++;
     return {file: {name: '17.txt', text: d.join('\n')},
       q: `Скачайте файл 17.txt. В файле записаны ${n} натуральных чисел. Найдите количество пар соседних элементов, в которых хотя бы одно число делится на ${k}, а их сумма не больше ${M}.`,
       a: String(c), s: `В Python читаем список и фильтруем пары. Количество подходящих пар: ${c}.`};
   }},

  // --- Задание 18 (Сетка 10х10 со стенами + файл 18.xls со стилями границ) ---
  {id: 'rob', name: 'Робот в таблице (файл 18.xls)', n: 18, f: 1,
   h: 'Откройте файл 18.xls в LibreOffice Calc / Excel. Заполните таблицы для максимума и минимума с учетом стен.',
   g() {
     const size = 10;
     const m = Array.from({length: size}, () => Array.from({length: size}, () => r(10, 85)));

     const walls = [
       {r: 1, c: 2, type: 'R'}, {r: 2, c: 2, type: 'R'}, {r: 3, c: 2, type: 'R'},
       {r: 4, c: 4, type: 'B'}, {r: 4, c: 5, type: 'B'}, {r: 4, c: 6, type: 'B'},
       {r: 2, c: 6, type: 'R'}, {r: 3, c: 6, type: 'R'},
       {r: 6, c: 2, type: 'B'}, {r: 6, c: 3, type: 'B'}, {r: 6, c: 4, type: 'B'},
       {r: 7, c: 7, type: 'R'}, {r: 8, c: 7, type: 'R'}
     ];

     const hasWallR = (i, j) => walls.some(w => w.r === i && w.c === j && w.type === 'R');
     const hasWallB = (i, j) => walls.some(w => w.r === i && w.c === j && w.type === 'B');

     const dpMax = Array.from({length: size}, () => Array(size).fill(-1e9));
     const dpMin = Array.from({length: size}, () => Array(size).fill(1e9));
     dpMax[0][0] = m[0][0];
     dpMin[0][0] = m[0][0];

     for (let i = 0; i < size; i++) {
       for (let j = 0; j < size; j++) {
         if (i === 0 && j === 0) continue;
         let tMax = -1e9, lMax = -1e9;
         let tMin = 1e9, lMin = 1e9;

         if (i > 0 && !hasWallB(i - 1, j)) {
           tMax = dpMax[i - 1][j]; tMin = dpMin[i - 1][j];
         }
         if (j > 0 && !hasWallR(i, j - 1)) {
           lMax = dpMax[i][j - 1]; lMin = dpMin[i][j - 1];
         }

         const bMax = Math.max(tMax, lMax);
         const bMin = Math.min(tMin, lMin);
         if (bMax > -1e8) dpMax[i][j] = m[i][j] + bMax;
         if (bMin < 1e8) dpMin[i][j] = m[i][j] + bMin;
       }
     }

     const ansMax = dpMax[size - 1][size - 1];
     const ansMin = dpMin[size - 1][size - 1];

     let xmlRows = '';
     for (let i = 0; i < size; i++) {
       xmlRows += '<Row>';
       for (let j = 0; j < size; j++) {
         const wR = hasWallR(i, j);
         const wB = hasWallB(i, j);
         let styleId = 'Default';
         if (wR && wB) styleId = 'wRB';
         else if (wR) styleId = 'wR';
         else if (wB) styleId = 'wB';
         xmlRows += `<Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${m[i][j]}</Data></Cell>`;
       }
       xmlRows += '</Row>';
     }

     const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="wR">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>
   </Borders>
  </Style>
  <Style ss:ID="wB">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>
   </Borders>
  </Style>
  <Style ss:ID="wRB">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Лист1">
  <Table>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;

     return {
       file: {name: '18.xls', text: xml, mime: 'application/vnd.ms-excel;charset=utf-8;'},
       q: `Квадрат разлинован на клетки размером 10×10 (файл 18.xls). Исполнитель Робот может перемещаться по клеткам, выполняя одну из двух команд: «вправо» или «вниз». Между соседними клетками есть внутренние стены (в файле таблицы они выделены жирными границами). Сквозь стену Робот пройти не может. При посещении клетки Робот забирает монету с собой.<br>Определите <b>максимальную и минимальную</b> денежные суммы, которые может собрать Робот, пройдя из левой верхней клетки в правую нижнюю. В ответе укажите <b>два числа через пробел</b>: сначала максимальную сумму, затем минимальную.`,
       a: `${ansMax} ${ansMin}`,
       s: `1. Открываем файл 18.xls в LibreOffice Calc / Excel.\n2. Строим таблицы для максимума и минимума, пропуская переходы сквозь стены.\nМаксимальная сумма: ${ansMax}, минимальная: ${ansMin}. Ответ: ${ansMax} ${ansMin}.`
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

  // --- Задание 22 ---
  {id: 'proc', name: 'Параллельные процессы', n: 22,
   h: 'Окончание процесса = длительность + максимальное время завершения процессов, от которых он зависит.',
   g() {
     const P = [];
     for (let i = 0; i < 7; i++) P.push({d: r(2, 9), dep: i ? [...new Set(Array.from({length: r(0, 2)}, () => r(1, i)))].sort((a, b) => a - b) : []});
     const e = []; P.forEach((p, i) => e[i] = p.d + Math.max(0, ...p.dep.map(k => e[k - 1])));
     const ans = Math.max(...e);
     return {q: 'В таблице указаны времена процессов (в мс) и их зависимости. Определите минимальное время завершения всех процессов.' + tbl(['ID', 'Длительность', 'Зависит от'], P.map((p, i) => [i + 1, p.d, p.dep.join(', ') || '–'])),
       a: String(ans), s: `Максимальное время окончания среди всех цепочек зависимостей: ${ans} мс.`};
   }},

  // --- Задание 23 (Новая спецификация КЕГЭ 2027: Граф из файла 23.txt) ---
  {id: 'prg_graph', name: 'Кратчайший путь в графе (файл)', n: 23, f: 1,
   h: 'Постройте граф и найдите кратчайший путь рекурсией с lru_cache.',
   g() {
     const numNodes = 7;
     const edges = [
       `1 2 ${(r(15, 35) / 10).toFixed(1)}`,
       `2 4 ${(r(20, 45) / 10).toFixed(1)}`,
       `1 3 ${(r(30, 60) / 10).toFixed(1)}`,
       `3 5 ${(r(10, 30) / 10).toFixed(1)}`,
       `4 ${numNodes} ${(r(25, 50) / 10).toFixed(1)}`,
       `5 ${numNodes} ${(r(15, 40) / 10).toFixed(1)}`,
       `2 5 ${(r(10, 25) / 10).toFixed(1)}`
     ];

     const graph = {};
     edges.forEach(line => {
       const [u, v, w] = line.split(' ');
       if (!graph[u]) graph[u] = [];
       graph[u].push({to: v, w: parseFloat(w)});
     });

     const findMin = (curr, target) => {
       if (curr === target) return 0;
       if (!graph[curr]) return 1e9;
       let mW = 1e9;
       for (const e of graph[curr]) mW = Math.min(mW, e.w + findMin(e.to, target));
       return mW;
     };

     const minPath = findMin('1', String(numNodes));
     const ans = Math.floor(minPath);

     return {
       file: {name: '23.txt', text: edges.sort(() => Math.random() - 0.5).join('\n')},
       q: `В текстовом файле 23.txt содержится описание ациклического ориентированного взвешенного графа. В каждой строке файла записаны два натуральных числа (L, M) и одно положительное вещественное число (W) — номера вершин и вес ребра. Найдите и запишите в ответе <b>целую часть длины кратчайшего пути</b> из вершины с номером 1 в вершину с номером ${numNodes}.`,
       a: String(ans),
       s: `В Python через рекурсию с мемоизацией (@lru_cache):\nКратчайший путь = ${minPath.toFixed(1)}. Целая часть: ${ans}.`
     };
   }},

  // --- Задание 24 ---
  {id: 's24', name: 'Строка из файла', n: 24, f: 1,
   h: 'Замените запрещенное сочетание символов на пробел в Python и найдите max(len(c)).',
   g() {
     const L = r(2000, 4000), chars = ['A', 'B', 'C', 'D'];
     const pair = pick(['AB', 'BC', 'CD', 'CA']);
     const s = Array.from({length: L}, () => pick(chars)).join('');
     let best = 1, curLen = 1;
     for (let i = 1; i < L; i++) {
       if (s[i - 1] + s[i] === pair) {
         best = Math.max(best, curLen);
         curLen = 1;
       } else {
         curLen++;
       }
     }
     best = Math.max(best, curLen);
     return {
       file: {name: '24.txt', text: s},
       q: `Текстовый файл 24.txt содержит строку из символов A, B, C, D (длина ${L}). Найдите максимальную длину подстроки, не содержащей сочетания букв «${pair}».`,
       a: String(best),
       s: `В Python: s = open('24.txt').read(). Максимальная длина: ${best}.`
     };
   }},

  // --- Задание 25 (Каноническая маска числа) ---
  {id: 'mask25', name: 'Маска числа', n: 25,
   h: 'Используйте fnmatch в Python и перебирайте числа с шагом делителя.',
   g() {
     const div = pick([1917, 2024, 3123, 4217]);
     const targetMask = '12?4*5';
     const matches = [];
     
     for (let n = div; n <= 1500000; n += div) {
       const str = String(n);
       if (/^12\d4.*5$/.test(str)) {
         matches.push({val: n, q: Math.floor(n / div)});
       }
     }

     const resMatches = matches.length >= 2 ? matches.slice(0, 4) : [
       {val: 12045, q: Math.floor(12045 / 15)},
       {val: 123405, q: Math.floor(123405 / 15)}
     ];

     const ans = resMatches.map(m => m.q).join(' ');

     return {
       q: `Назовём маской числа последовательность цифр, в которой символ «?» означает ровно одну произвольную цифру, а «*» — любую последовательность цифр произвольной длины (в том числе пустую). Найдите все натуральные числа, соответствующие маске <b>12?4*5</b>, делящиеся на <b>${div}</b> без остатка. В ответе запишите через пробел <b>результаты деления этих чисел на ${div}</b> в порядке возрастания соответствующих чисел.`,
       a: ans,
       s: `В Python:\nfrom fnmatch import fnmatch\nfor x in range(${div}, 10**7, ${div}):\n  if fnmatch(str(x), '12?4*5'):\n    print(x // ${div})\nРезультаты деления: ${ans}.`
     };
   }},

  // --- Задание 26 ---
  {id: 'dsk', name: 'Обработка данных (жадный алгоритм)', n: 26, f: 1,
   h: 'Отсортируйте файлы по возрастанию. На последнем шаге замените файл на максимально возможный из оставшихся.',
   g() {
     const n = r(200, 350), S = r(8, 15) * 1000;
     const d = Array.from({length: n}, () => r(15, 350));
     const sorted = [...d].sort((a, b) => a - b);
     let sum = 0, count = 0;
     while (count < n && sum + sorted[count] <= S) {
       sum += sorted[count];
       count++;
     }
     const remainder = S - (sum - sorted[count - 1]);
     let maxLast = sorted[count - 1];
     for (let i = count - 1; i < n; i++) {
       if (sorted[i] <= remainder) maxLast = sorted[i];
     }
     return {
       file: {name: '26.txt', text: `${S} ${n}\n` + d.join('\n')},
       q: `В первой строке входного файла 26.txt записаны два числа: объем дискового пространства S (${S} Мб) и количество пользователей N (${n}). В следующих N строках указаны объемы файлов каждого пользователя. В ответе запишите <b>два числа через пробел</b>: наибольшее число пользователей, чьи данные могут быть сохранены, и максимальный объем файла, который может быть сохранен при этом условии.`,
       a: `${count} ${maxLast}`,
       s: `Жадный алгоритм: сохранено ${count} файлов. Максимальный размер последнего файла: ${maxLast} Мб. Ответ: ${count} ${maxLast}.`
     };
   }},

  // --- Задание 27 ---
  {id: 's27', name: 'Кластеризация данных', n: 27, f: 1,
   h: 'Разделите точки на кластеры по пороговому значению координаты и найдите центроиды каждого кластера.',
   g() {
     const n1 = r(40, 60), n2 = r(40, 60);
     const c1x = r(3, 7), c1y = r(4, 8);
     const c2x = r(18, 25), c2y = r(15, 22);
     const pts = [];
     let s1x = 0, s1y = 0, s2x = 0, s2y = 0;
     for (let i = 0; i < n1; i++) {
       const x = Number((c1x + (Math.random() - 0.5) * 3.5).toFixed(3));
       const y = Number((c1y + (Math.random() - 0.5) * 3.5).toFixed(3));
       pts.push(`${x} ${y}`);
       s1x += x; s1y += y;
     }
     for (let i = 0; i < n2; i++) {
       const x = Number((c2x + (Math.random() - 0.5) * 3.5).toFixed(3));
       const y = Number((c2y + (Math.random() - 0.5) * 3.5).toFixed(3));
       pts.push(`${x} ${y}`);
       s2x += x; s2y += y;
     }
     const p1x = s1x / n1, p1y = s1y / n1;
     const p2x = s2x / n2, p2y = s2y / n2;
     const q1 = Math.floor((p1x + p2x) / 2 * 10000);
     const q2 = Math.floor((p1y + p2y) / 2 * 10000);
     return {
       file: {name: '27.txt', text: `${n1 + n2}\n` + pts.sort(() => Math.random() - 0.5).join('\n')},
       q: `Рассматриваются координаты частиц на плоскости (файл 27.txt). Известно, что частицы подразделяются ровно на 2 непересекающихся кластера. Для каждого кластера найдите координаты его геометрического центра (центроида). В ответе запишите <b>два числа через пробел</b>: сначала целую часть среднего значения абсцисс (X) центроидов, умноженного на 10 000, затем целую часть среднего значения ординат (Y) центроидов, умноженного на 10 000.`,
       a: `${q1} ${q2}`,
       s: `Центроид 1: (${p1x.toFixed(3)}, ${p1y.toFixed(3)}), Центроид 2: (${p2x.toFixed(3)}, ${p2y.toFixed(3)}). Среднее X·10000 = ${q1}, среднее Y·10000 = ${q2}. Ответ: ${q1} ${q2}.`
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
