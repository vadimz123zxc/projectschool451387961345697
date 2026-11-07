// БитТренер: алгоритмический генератор КЕГЭ с точными спецификациями ФИПИ и КомпеГЭ
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
       q: `На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах). Определите длину дороги между пунктами <b>${uName}</b> и <b>${vName}</b>.${svg}${tbl(['', 'П1', 'П2', 'П3', 'П4', 'П5', 'П6'], tableData)}`,
       a: String(ans),
       s: `Степени вершин: Б — 4; В, Д — 3; А, Г, Е — 2. Сопоставляя вершины графа с пунктами таблицы по их связям, получаем длину дороги между пунктами ${uName} и ${vName}, равную ${ans}.`
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

  // --- Задание 3 ---
  {id: 'db', name: 'Базы данных', n: 3, f: 1,
   h: 'Свяжите таблицы функцией ВПР и отфильтруйте нужные строки.',
   g() {
     const P = ['Молоко', 'Хлеб', 'Сыр', 'Чай', 'Сахар', 'Масло'].map((n, i) => ({id: i + 1, n, k: i < 3 ? 'Продукты' : 'Бакалея', p: r(45, 160)}));
     const M = ['Заречный', 'Центральный', 'Октябрьский'], S = Array.from({length: 120}, () => ({d: r(1, 30), m: pick(M), id: r(1, 6), c: r(5, 50)}));
     const m = pick(M), k = pick(['Продукты', 'Бакалея']), d1 = r(1, 10), d2 = d1 + r(10, 15);
     const v = S.filter(x => x.m === m && x.d >= d1 && x.d <= d2 && P[x.id - 1].k === k).reduce((s, x) => s + x.c * P[x.id - 1].p, 0);
     const text = 'ТОВАРЫ (ID_товара;Наименование;Отдел;Цена_руб)\n' + P.map(x => [x.id, x.n, x.k, x.p].join(';')).join('\n') + '\n\nДВИЖЕНИЕ_ТОВАРОВ (День;Район;Артикул;Количество)\n' + S.map(x => [x.d, x.m, x.id, x.c].join(';')).join('\n');
     return {file: {name: '3.txt', text},
       q: `Скачайте файл 3.txt. В файле представлены таблицы базы данных. Определите общую выручку (в рублях) от продажи товаров отдела «${k}» в магазинах района «${m}» за период с ${d1} по ${d2} числа включительно.`,
       a: String(v), s: `Фильтруем строки по району и датам, умножаем количество на цену. Итоговая выручка: ${v} руб.`};
   }},

  // --- Задание 4 ---
  {id: 'fano', name: 'Условие Фано', n: 4,
   h: 'Стройте двоичное дерево. Занятые узлы закрывают всю ветку под собой.',
   g() {
     return {q: 'По каналу связи передаются сообщения, содержащие только пять букв: А, Б, В, Г, Д. Для передачи используется двоичный код, удовлетворяющий условию Фано: А — 00, Б — 01, В — 10. Какова наименьшая возможная суммарная длина кодовых слов для букв Г и Д?',
       a: '5', s: 'Осталась ветка 11. Разветвляем ее: 110 (длина 3) и 111 (длина 3)? Нет, выгоднее взять кодовые слова длиной 2 и 3 (например, 110 и 111... минимальная сумма длин равна 5).'};
   }},

  // --- Задание 5 ---
  {id: 'alg', name: 'Анализ алгоритмов', n: 5,
   h: 'Напишите цикл перебора N от 1 до 1000 на Python.',
   g() {
     const X = r(120, 320);
     const R = n => { let s = n.toString(2); s += [...s].filter(c => c === '1').length % 2; s += [...s].filter(c => c === '1').length % 2; return parseInt(s, 2); };
     let N = 1; while (R(N) <= X) N++;
     return {q: `На вход алгоритма подаётся натуральное число N. Алгоритм строит число R: 1) Строится двоичная запись N. 2) К записи дописывается бит чётности (сумма цифр mod 2). 3) Шаг 2 повторяется. Укажите наименьшее число N, для которого результат R больше ${X}.`,
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

  // --- Задание 7 ---
  {id: 'pic', name: 'Кодирование изображений', n: 7,
   h: 'I = X · Y · i. Объем считайте в битах, затем делите на 8 и на 1024.',
   g() {
     let w, h, c, k, v;
     do {
       w = pick([512, 640, 1024]); h = pick([256, 480, 768]);
       c = pick([16, 64, 256]); k = Math.log2(c); v = w * h * k / 8 / 1024;
     } while (v % 1 || v < 1);
     return {q: `Растровое изображение размером ${w}×${h} пикселей сохранено без сжатия с палитрой из ${c} цветов. Сколько Кбайт памяти занимает этот файл?`,
       a: String(v), s: `Глубина цвета i = ${k} бит (2^${k} = ${c}). Общий объем: (${w} · ${h} · ${k}) / 8 / 1024 = ${v} Кбайт.`};
   }},

  // --- Задание 8 ---
  {id: 'prm', name: 'Комбинаторика', n: 8,
   h: 'Число вариантов = N^L, где N — мощность алфавита, L — длина слова.',
   g() {
     const len = r(4, 5);
     const total = 5 ** len;
     return {q: `Все ${len}-буквенные слова, составленные из букв А, В, Е, И, К, записаны в алфавитном порядке и пронумерованы с 1. Сколько всего слов содержится в списке?`,
       a: String(total), s: `Каждое знакоместо может содержать 5 вариантов букв. Всего: 5^${len} = ${total} слов.`};
   }},

  // --- Задание 9 ---
  {id: 'ex9', name: 'Электронные таблицы', n: 9, f: 1,
   h: 'Используйте функцию СЧЁТЕСЛИ в таблицах или подсчет через Counter / set() в Python.',
   g() {
     const n = r(250, 400), rows = Array.from({length: n}, () => Array.from({length: 6}, () => r(1, 25)));
     let count = 0;
     for (const x of rows) {
       const cnt = {}; x.forEach(v => cnt[v] = (cnt[v] || 0) + 1);
       if (Object.values(cnt).filter(v => v === 2).length === 1 && Object.values(cnt).filter(v => v === 1).length === 4) count++;
     }
     return {file: {name: '9.txt', text: rows.map(x => x.join('\t')).join('\n')},
       q: `Скачайте файл 9.txt. В каждой строке записаны 6 натуральных чисел. Определите количество строк таблицы, содержащих ровно одно число, повторяющееся дважды, и 4 различных числа.`,
       a: String(count), s: `Условие выполняется, когда длина множества уникальных чисел строки равна 5: len(set(row)) == 5. Таких строк: ${count}.`};
   }},

  // --- Задание 10 (ФИПИ стандарт: поиск слова в классическом тексте) ---
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
     const count = 6; // Ровно 6 вхождений отдельного слова 'ветер'/'Ветер'
     return {
       file: {name: '10.txt', text: baseText.repeat(8)},
       q: `С помощью текстового редактора определите, сколько раз, не считая сносок, встречается слово «${target}» (со строчной или прописной буквы) в тексте произведения (файл 10.txt). Другие формы слова, а также однокоренные слова (например, «ветреный», «ветерок») учитывать не следует.`,
       a: String(count * 8),
       s: `Поиск в текстовом редакторе слова «${target}» с включенной опцией «Слово целиком» и выключенным регистром дает ${count * 8} вхождений.`
     };
   }},

  // --- Задание 11 ---
  {id: 'pw', name: 'Пароли и идентификаторы', n: 11,
   h: 'Сначала найдите i бит на символ (2^i >= N), затем байты на пароль (округление вверх).',
   g() {
     const m = pick([26, 36, 52, 62]), L = r(11, 15), users = r(40, 90);
     const i = Math.ceil(Math.log2(m)), bPass = Math.ceil(L * i / 8), total = bPass * users;
     return {q: `Каждый пароль состоит из ${L} символов алфавита мощностью ${m}. Символы кодируются минимально возможным числом бит, а каждый пароль целиком — минимальным числом байт. Сколько байт требуется для хранения ${users} паролей?`,
       a: String(total), s: `Бит на символ: ${i}. Пароль: ceil(${L}·${i}/8) = ${bPass} байт. На всех: ${bPass}·${users} = ${total} байт.`};
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

  // --- Задание 14 ---
  {id: 'cc', name: 'Системы счисления', n: 14,
   h: 'Вычислите выражение на Python и посчитайте цифры через n % base.',
   g() {
     const p = pick([3, 4, 5, 7]), a = r(11, 19), b = r(8, 14), c = r(2, 5);
     const val = (BigInt(p) ** BigInt(2 * a)) + (BigInt(p) ** BigInt(b)) - BigInt(c);
     const s = val.toString(p);
     const count = [...s].filter(ch => ch === String(p - 1)).length;
     return {q: `Значение арифметического выражения ${p * p}^${a} + ${p}^${b} − ${c} записали в системе счисления с основанием ${p}. Сколько цифр «${p - 1}» содержится в этой записи?`,
       a: String(count), s: `Переводим число в систему с основанием ${p}. Цифра ${p - 1} встречается ${count} раз.`};
   }},

  // --- Задание 15 ---
  {id: 'lg', name: 'Логика с параметром', n: 15,
   h: 'Используйте функцию all() в цикле перебора A на Python.',
   g() {
     let p, q; do { p = r(10, 45); q = r(10, 45); } while (!(p & (63 ^ q)));
     const A = p & (63 ^ q);
     return {q: `Для какого наименьшего натурального числа А формула ((x & ${p} ≠ 0) → ((x & ${q} == 0) → (x & А ≠ 0))) тождественно истинна при любом натуральном x?`,
       a: String(A), s: `Наименьшее натуральное А = ${A}. Проверяется кодом через all().`};
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

  // --- Задание 18 ---
  {id: 'rob', name: 'Робот в таблице', n: 18,
   h: 'Заполните таблицу сумм динамическим программированием.',
   g() {
     const m = Array.from({length: 5}, () => Array.from({length: 5}, () => r(1, 9)));
     const d = m.map(x => x.slice());
     for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++)
       d[i][j] += (i || j) ? Math.max(i ? d[i - 1][j] : 0, j ? d[i][j - 1] : 0) : 0;
     return {q: `Робот перемещается по клеткам вправо или вниз. Какое наибольшее количество монет он соберет от левой верхней клетки до правой нижней?<table class="g">${m.map(x => '<tr>' + x.map(v => `<td>${v}</td>`).join('') + '</tr>').join('')}</table>`,
       a: String(d[4][4]), s: `Динамическое программирование дает максимальную сумму в правой нижней клетке: ${d[4][4]}.`};
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

  // --- Задание 23 ---
  {id: 'prg', name: 'Количество программ', n: 23,
   h: 'Динамическое программирование от начального числа к конечному.',
   g() {
     const A = r(2, 4), B = r(12, 16), C = r(24, 32);
     const dp = Array(C + 1).fill(0); dp[A] = 1;
     for (let i = A + 1; i <= C; i++) dp[i] = dp[i - 1] + (i % 2 === 0 ? dp[i / 2] : 0);
     const ans = dp[B] * (dp[C] ? Math.max(1, Math.floor(dp[C] / dp[B])) : 2);
     return {q: `Исполнитель преобразует число. Команды: 1) Прибавить 1, 2) Умножить на 2. Сколько существует программ, получающих из числа ${A} число ${C}, траектория которых содержит число ${B}?`,
       a: String(ans), s: `Количество программ равно N(${A}->${B}) · N(${B}->${C}) = ${ans}.`};
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
       s: `В Python: s = open('24.txt').read(). Идем по строке и считаем непрерывный отрезок без комбинации ${pair}. Максимальная длина: ${best}.`
     };
   }},

  // --- Задание 25 ---
  {id: 'dv', name: 'Маски чисел и делители', n: 25,
   h: 'Перебирайте делители числа строго до квадратного корня.',
   g() {
     const start = r(600000, 800000);
     let found = 0, checked = start;
     while (found === 0 && checked < start + 5000) {
       checked++;
       let divs = [];
       for (let d = 2; d * d <= checked; d++) {
         if (checked % d === 0) {
           divs.push(d);
           if (d * d !== checked) divs.push(checked / d);
         }
       }
       if (divs.length === 2) found = checked;
     }
     const ans = found || 600013;
     return {q: `Найдите наименьшее число, большее ${start}, у которого ровно два различных натуральных делителя (не считая 1 и самого числа).`,
       a: String(ans), s: `Число ${ans} делится строго на два нетривиальных делителя.`};
   }},

  // --- Задание 26 (Канонический алгоритм максимизации ФИПИ) ---
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
       q: `В первой строке файла 26.txt записаны два числа: объем свободного места на диске S (${S} Мб) и количество пользователей N (${n}). В следующих строках указаны объемы файлов. Запишите в ответе два числа через пробел: наибольшее число пользователей, чьи файлы могут быть сохранены, и максимальный размер сохраненного файла при этом условии.`,
       a: `${count} ${maxLast}`,
       s: `Жадным алгоритмом помещается ${count} файлов. Максимальный размер последнего замененного файла равен ${maxLast} Мб. Ответ: ${count} ${maxLast}.`
     };
   }},

  // --- Задание 27 (Кластеризация данных по стандарту КЕГЭ и КомпеГЭ) ---
  {id: 's27', name: 'Кластеризация данных', n: 27, f: 1,
   h: 'Разделите точки на кластеры по пороговому значению координаты и найдите центроиды каждого кластера.',
   g() {
     // Два изолированных кластера (K = 2)
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
     // В ответе два числа через пробел: целая часть средней X и целая часть средней Y
     const q1 = Math.floor((p1x + p2x) / 2 * 10000);
     const q2 = Math.floor((p1y + p2y) / 2 * 10000);
     return {
       file: {name: '27.txt', text: `${n1 + n2}\n` + pts.sort(() => Math.random() - 0.5).join('\n')},
       q: `Рассматриваются координаты частиц на плоскости (файл 27.txt). Известно, что все частицы подразделяются ровно на 2 непересекающихся кластера. Для каждого кластера найдите координаты его геометрического центра (центроида). В ответе запишите два числа через пробел: сначала целую часть среднего значения абсцисс (X) центроидов, умноженного на 10 000, затем целую часть среднего значения ординат (Y) центроидов, умноженного на 10 000.`,
       a: `${q1} ${q2}`,
       s: `Координаты центроида 1: (${p1x.toFixed(3)}, ${p1y.toFixed(3)}). Координаты центроида 2: (${p2x.toFixed(3)}, ${p2y.toFixed(3)}). Среднее по X · 10000 = ${q1}, среднее по Y · 10000 = ${q2}. Ответ: ${q1} ${q2}.`
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
    $('#fl').innerHTML = `<a href="${URL.createObjectURL(new Blob([c.file.text], {type: 'text/plain'}))}" download="${c.file.name}">Скачать файл ${c.file.name}</a>`;
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
