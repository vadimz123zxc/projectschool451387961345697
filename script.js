// БитТренер: полный эталонный генератор КЕГЭ 2027 (вариативность по всем номерам)
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
  // --- Задание 1: 2 подвида ---
  {id:'dist_sym',name:'Графы: сумма двух дорог (симметрия)',n:1,
   h:'Сопоставьте степени вершин графа с количеством заполненных ячеек в строках таблицы.',
   g(){
     const names=['А','Б','В','Г','Д','Е'];
     const edges=[[2,1],[2,5],[5,0],[0,4],[4,1],[5,3],[3,1],[3,4]];
     const weights={};
     edges.forEach(([u,v])=>{const w=r(8,55);weights[u+'-'+v]=w;weights[v+'-'+u]=w;});
     const pMap=[0,1,2,3,4,5].sort(()=>Math.random()-0.5);
     const tableData=Array.from({length:6},(_,i)=>{
       const row=Array(6).fill('');
       for(let j=0;j<6;j++)if(i!==j&&weights[pMap[i]+'-'+pMap[j]])row[j]=weights[pMap[i]+'-'+pMap[j]];
       return ['П'+(i+1),...row];
     });
     const rowAD=pMap.indexOf(4),colAD=pMap.indexOf(0);
     const rowBV=pMap.indexOf(1),colBV=pMap.indexOf(2);
     const roadAD=tableData[rowAD][colAD+1],roadBV=tableData[rowBV][colBV+1];
     const answer=roadAD+roadBV;
     const coords=[[40,70],[110,30],[110,120],[190,30],[190,120],[250,70]];
     const lines=edges.map(([u,v])=>'<line x1="'+coords[u][0]+'" y1="'+coords[u][1]+'" x2="'+coords[v][0]+'" y2="'+coords[v][1]+'" stroke="#1b3a8a" stroke-width="2"/>').join('');
     const circles=coords.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="14" fill="#fff" stroke="#1b3a8a" stroke-width="2"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-family="Consolas" font-weight="bold" font-size="14" fill="#1b3a8a">'+names[i]+'</text>').join('');
     const svg='<div style="text-align:center;margin:12px 0"><svg width="290" height="150" viewBox="0 0 290 150">'+lines+circles+'</svg></div>';
     return {
       q:'На рисунке схема дорог N-ского района изображена в виде графа, а в таблице приведены длины этих дорог. Таблицу и схему рисовали независимо, поэтому нумерация пунктов в таблице не связана с буквенными обозначениями графа. Определите сумму протяжённостей дорог из пункта <b>Д</b> в пункт <b>А</b> и из пункта <b>Б</b> в пункт <b>В</b>.'+svg+tbl(['','П1','П2','П3','П4','П5','П6'],tableData),
       a:String(answer),
       s:'У вершин А и В степень 2, у Б, Г, Д и Е степень 3. По числу заполненных ячеек в строках таблицы сопоставляем симметричные пары пунктов. Длина дороги Д–А равна '+roadAD+' км, длина Б–В — '+roadBV+' км. Сумма: '+roadAD+' + '+roadBV+' = '+answer+'.'
     };
   }},
  {id:'dist_uniq',name:'Графы: длина конкретной дороги (асимметрия)',n:1,
   h:'Найдите уникальные степени вершин и определите остальных по связям их соседей.',
   g(){
     const names=['А','Б','В','Г','Д','Е'];
     const edges=[[0,1],[0,2],[0,4],[1,2],[1,3],[1,4],[2,5],[3,4],[4,5]];
     const weights={};
     edges.forEach(([u,v])=>{const w=r(10,49);weights[u+'-'+v]=w;weights[v+'-'+u]=w;});
     const pMap=[0,1,2,3,4,5].sort(()=>Math.random()-0.5);
     const tableData=Array.from({length:6},(_,i)=>{
       const row=Array(6).fill('');
       for(let j=0;j<6;j++)if(i!==j&&weights[pMap[i]+'-'+pMap[j]])row[j]=weights[pMap[i]+'-'+pMap[j]];
       return ['П'+(i+1),...row];
     });
     const eTarget=pick([[0,4],[2,5],[1,3],[3,4]]);
     const uName=names[eTarget[0]],vName=names[eTarget[1]];
     const ans=weights[eTarget[0]+'-'+eTarget[1]];
     const coords=[[40,40],[130,30],[40,130],[230,30],[150,95],[250,130]];
     const lines=edges.map(([u,v])=>'<line x1="'+coords[u][0]+'" y1="'+coords[u][1]+'" x2="'+coords[v][0]+'" y2="'+coords[v][1]+'" stroke="#1b3a8a" stroke-width="2"/>').join('');
     const circles=coords.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="14" fill="#fff" stroke="#1b3a8a" stroke-width="2"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-family="Consolas" font-weight="bold" font-size="14" fill="#1b3a8a">'+names[i]+'</text>').join('');
     const svg='<div style="text-align:center;margin:12px 0"><svg width="290" height="160" viewBox="0 0 290 160">'+lines+circles+'</svg></div>';
     return {
       q:'Схема дорог изображена на графе, длины дорог указаны в таблице. Определите длину дороги между пунктами <b>'+uName+'</b> и <b>'+vName+'</b>.'+svg+tbl(['','П1','П2','П3','П4','П5','П6'],tableData),
       a:String(ans),
       s:'Г (степень 2) связана только с двумя вершинами степени 4 (Б и Д). Е (степень 2) связана с В(3) и Д(4). Все 6 вершин определяются однозначно. Длина дороги '+uName+'–'+vName+' равна '+ans+'.'
     };
   }},

  // --- Задание 2: 2 подвида ---
  {id:'tt',name:'Таблицы истинности: полная строка',n:2,
   h:'Напишите перебор перестановок в Python через itertools.permutations.',
   g(){
     const O={'∧':(a,b)=>a&b,'∨':(a,b)=>a|b,'→':(a,b)=>(1-a)|b,'≡':(a,b)=>+(a===b)},ok=Object.keys(O),cv=perms(['x','y','z','w']);
     for(let t=0;t<30000;t++){
       const v=pick(cv),o=[pick(ok),pick(ok),pick(ok)],n1=r(0,1),n3=r(0,1),col=pick(cv);
       const F=e=>O[o[1]](O[o[0]](n1?1-e[v[0]]:e[v[0]],e[v[1]]),O[o[2]](n3?1-e[v[2]]:e[v[2]],e[v[3]]));
       const val=(row,p)=>{const e={};p.forEach((c,j)=>e[c]=row[j]);return F(e);};
       const all=Array.from({length:16},(_,i)=>[i>>3&1,i>>2&1,i>>1&1,i&1]);
       const rows=all.sort(()=>Math.random()-.5).slice(0,4).map(x=>x.concat(val(x,col)));
       if(cv.filter(p=>rows.every(x=>val(x,p)===x[4])).length!==1)continue;
       const ex=`(${n1?'¬':''}${v[0]} ${o[0]} ${v[1]}) ${o[1]} (${n3?'¬':''}${v[2]} ${o[2]} ${v[3]})`;
       return {q:`Логическая функция F задана выражением ${ex}. Дан фрагмент таблицы истинности функции F, содержащий неповторяющиеся строки. Определите, какому столбцу соответствует каждая из переменных x, y, z, w.`+tbl(['Перем. 1','Перем. 2','Перем. 3','Перем. 4','F'],rows),
         a:col.join(''),s:`Единственная подходящая расстановка переменных: ${col.join('')}.`};
     }
   }},
  {id:'tt_zero',name:'Таблицы истинности: строки ложности с пропусками',n:2,
   h:'Переберите пустые ячейки через product([0, 1], repeat=...) и расстановки через permutations.',
   g(){
     const O={'∧':(a,b)=>a&b,'∨':(a,b)=>a|b,'→':(a,b)=>(1-a)|b},ok=['∧','∨','→'],cv=perms(['x','y','z','w']);
     for(let t=0;t<30000;t++){
       const v=pick(cv),o=['∨','→',pick(ok)],col=pick(cv);
       const F=e=>O[o[1]](e[v[0]],O[o[2]](1-e[v[1]],O[o[0]](e[v[2]],e[v[3]])));
       const val=(row,p)=>{const e={};p.forEach((c,j)=>e[c]=row[j]);return F(e);};
       const all=Array.from({length:16},(_,i)=>[i>>3&1,i>>2&1,i>>1&1,i&1]);
       const zeroes=all.filter(x=>val(x,col)===0);
       if(zeroes.length<3)continue;
       const rows=zeroes.slice(0,3);
       if(cv.filter(p=>rows.every(x=>val(x,p)===0)).length!==1)continue;
       const masked=rows.map((row,idx)=>row.map((cell,j)=>((idx+j)%3===0?'':cell)).concat(0));
       const ex=`${v[0]} → (¬${v[1]} ${o[2]} (${v[2]} ∨ ${v[3]}))`;
       return {q:`Функция F задана выражением ${ex}. Дан фрагмент таблицы истинности с пустыми клетками (F = 0 во всех строках). Определите порядок столбцов переменных x, y, z, w.`+tbl(['?','?','?','?','F'],masked),
         a:col.join(''),s:`Перебором пустых ячеек и перестановок в Python находим единственный порядок: ${col.join('')}.`};
     }
   }},

  // --- Задание 3: 2 подвида (.xls 3 листа) ---
  {id:'db',name:'Базы данных: масса поступлений',n:3,f:1,
   h:'Свяжите листы по ID магазина и товара формулой =ВПР(). Учитывайте только «Поступление».',
   g(){
     const streets=['Прибрежная','Садовая','Лесная'],stores=[];
     for(let i=0;i<9;i++)stores.push({id:'M'+(i+1),street:streets[Math.floor(i/3)],address:'дом '+(4+i*3)});
     const goods=[
       {id:1,name:'Зефир ванильный',kind:'Зефир',mass:500,price:180},
       {id:2,name:'Зефир в шоколаде',kind:'Зефир',mass:1000,price:320},
       {id:3,name:'Зефир ягодный',kind:'Зефир',mass:1500,price:450},
       {id:4,name:'Пастила яблочная',kind:'Пастила',mass:250,price:120},
       {id:5,name:'Мармелад',kind:'Мармелад',mass:300,price:140}
     ];
     const targetStreet=pick(streets),d1=r(3,8),d2=d1+r(7,14),ops=[];
     for(let i=0;i<160;i++){
       const st=pick(stores),gd=pick(goods),dayNum=r(1,30),op=pick(['Поступление','Поступление','Продажа']),qty=r(1,30)*(gd.kind==='Зефир'?2:1);
       ops.push({day:dayNum,store:st.id,good:gd.id,qty,op});
     }
     ops.push({day:d1,store:pick(stores.filter(x=>x.street===targetStreet)).id,good:1,qty:8,op:'Поступление'});
     let totalGrams=0;
     const storeById=Object.fromEntries(stores.map(x=>[x.id,x])),goodById=Object.fromEntries(goods.map(x=>[x.id,x]));
     for(const row of ops){
       const s=storeById[row.store],g=goodById[row.good];
       if(s.street===targetStreet&&g.kind==='Зефир'&&row.op==='Поступление'&&row.day>=d1&&row.day<=d2)totalGrams+=row.qty*g.mass;
     }
     const totalKg=totalGrams/1000;
     const xmlRows=(h,rw)=>'<Row>'+h.map(x=>'<Cell><Data ss:Type="String">'+x+'</Data></Cell>').join('')+'</Row>'+rw.map(row=>'<Row>'+row.map(x=>'<Cell><Data ss:Type="'+(typeof x==='number'?'Number':'String')+'">'+x+'</Data></Cell>').join('')+'</Row>').join('');
     const xml='<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Движение"><Table>'+
       xmlRows(['Дата','ID магазина','ID товара','Операция','Количество'],ops.map(x=>[String(x.day).padStart(2,'0')+'.06.2025',x.store,x.good,x.op,x.qty]))+
       '</Table></Worksheet><Worksheet ss:Name="Товары"><Table>'+xmlRows(['ID товара','Наименование','Категория','Масса упаковки, г','Цена, руб.'],goods.map(x=>[x.id,x.name,x.kind,x.mass,x.price]))+
       '</Table></Worksheet><Worksheet ss:Name="Магазины"><Table>'+xmlRows(['ID магазина','Улица','Адрес'],stores.map(x=>[x.id,x.street,x.address]))+'</Table></Worksheet></Workbook>';
     return {
       file:{name:'3.xls',text:xml,mime:'application/vnd.ms-excel;charset=utf-8;'},
       q:'В файле 3.xls три таблицы: «Движение», «Товары», «Магазины». Определите массу в килограммах всех видов зефира, поступивших с '+d1+' по '+d2+' июня включительно в магазины на улице «'+targetStreet+'» (операция «Поступление»).',
       a:String(totalKg),s:'Связываем листы через =ВПР(), фильтруем улицу, категорию, даты и операцию. Масса: '+totalGrams+' г = '+totalKg+' кг.'
     };
   }},
  {id:'db_delta',name:'Базы данных: на сколько увеличилось количество (дополнительная модель)',n:3,f:1,
   h:'Найдите разницу: сумма упаковок по операции «Поступление» минус сумма упаковок по операции «Продажа».',
   g(){
     const streets=['Центральная','Ленина','Мира'],stores=[];
     for(let i=0;i<6;i++)stores.push({id:'M'+(i+1),street:streets[Math.floor(i/2)],address:'дом '+(10+i)});
     const goods=[{id:1,name:'Чай зеленый',kind:'Бакалея',price:150},{id:2,name:'Кофе зерновой',kind:'Бакалея',price:550},{id:3,name:'Сыр',kind:'Молочные',price:220}];
     const targetStreet=pick(streets),d1=r(1,10),d2=d1+r(10,15),ops=[];
     for(let i=0;i<150;i++){
       ops.push({day:r(1,28),store:pick(stores).id,good:pick(goods).id,qty:r(5,40),op:pick(['Поступление','Поступление','Продажа'])});
     }
     let inc=0,dec=0;
     const storeById=Object.fromEntries(stores.map(x=>[x.id,x])),goodById=Object.fromEntries(goods.map(x=>[x.id,x]));
     for(const row of ops){
       const s=storeById[row.store],g=goodById[row.good];
       if(s.street===targetStreet&&g.kind==='Бакалея'&&row.day>=d1&&row.day<=d2){
         if(row.op==='Поступление')inc+=row.qty;else dec+=row.qty;
       }
     }
     if(inc<dec){ops.push({day:d1,store:stores.find(x=>x.street===targetStreet).id,good:1,qty:dec-inc+40,op:'Поступление'});inc+=dec-inc+40;}
     const ans=inc-dec;
     const xmlRows=(h,rw)=>'<Row>'+h.map(x=>'<Cell><Data ss:Type="String">'+x+'</Data></Cell>').join('')+'</Row>'+rw.map(row=>'<Row>'+row.map(x=>'<Cell><Data ss:Type="'+(typeof x==='number'?'Number':'String')+'">'+x+'</Data></Cell>').join('')+'</Row>').join('');
     const xml='<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Движение"><Table>'+
       xmlRows(['Дата','ID магазина','ID товара','Операция','Количество'],ops.map(x=>[x.day,x.store,x.good,x.op,x.qty]))+
       '</Table></Worksheet><Worksheet ss:Name="Товары"><Table>'+xmlRows(['ID товара','Наименование','Категория','Цена'],goods.map(x=>[x.id,x.name,x.kind,x.price]))+
       '</Table></Worksheet><Worksheet ss:Name="Магазины"><Table>'+xmlRows(['ID магазина','Улица','Адрес'],stores.map(x=>[x.id,x.street,x.address]))+'</Table></Worksheet></Workbook>';
     return {
       file:{name:'3_delta.xls',text:xml,mime:'application/vnd.ms-excel;charset=utf-8;'},
       q:'В файле 3_delta.xls приведена база данных. На сколько упаковок увеличилось количество товаров отдела «Бакалея» в магазинах улицы «'+targetStreet+'» с '+d1+' по '+d2+' число включительно?',
       a:String(ans),s:'Поступило '+inc+' упаковок, продано '+dec+'. Увеличение составило: '+inc+' − '+dec+' = '+ans+'.'
     };
   }},

  // --- Задание 4: 2 подвида ---
  {id:'fano',name:'Кодирование слова по условию Фано',n:4,
   h:'Более частым буквам назначайте самые короткие свободные ветви дерева.',
   g(){
     const word='КОЛОБОК',freq={К:2,О:3},codes={Б:'00',Н:'010',Л:'111',О:'10',К:'011'};
     const answer=[...word].reduce((s,c)=>s+codes[c].length,0);
     return {q:'Для передачи используются буквы Б, К, Л, О, Н по условию Фано. Известны коды: Б — 00, Н — 010, Л — 111. Какое минимальное количество двоичных знаков требуется для кодирования слова «КОЛОБОК»?',
       a:String(answer),s:'О встречается 3 раза -> берем код 10 (2 бита). К (2 раза) -> свободный код 011 (3 бита). Итого: '+answer+' бит.'};
   }},
  {id:'fano_rand',name:'Условие Фано: случайное слово',n:4,
   h:'Посчитайте частоты букв и назначьте более частой букве свободный код длиной 2 бита.',
   g(){
     const word=Array.from({length:r(10,20)},()=>pick(['К','О','Л','Б']));
     const freq={К:0,О:0};word.forEach(c=>{if(c in freq)freq[c]++;});
     const short=freq.К>freq.О?'К':'О',long=short==='К'?'О':'К';
     const codes={Б:'00',Н:'010',Л:'111',[short]:'10',[long]:'011'};
     const answer=word.reduce((s,c)=>s+codes[c].length,0);
     return {q:'Заданы коды: Б — 00, Н — 010, Л — 111. Для букв К и О выберите свободные коды по условию Фано. Найдите минимальную длину кодирования слова «'+word.join('')+'».',
       a:String(answer),s:'Буква '+short+' встречается чаще, назначаем ей код 10 (2 бита), второй — 011 (3 бита). Длина равна '+answer+'.'};
   }},

  // --- Задание 5: 2 подвида ---
  {id:'alg',name:'Двоичный алгоритм: наименьший результат R',n:5,
   h:'Постройте R для каждого N, затем минимизируйте R.',
   g(){
     const limit=r(90,220),results=[];
     for(let N=1;N<=2000;N++){
       const bits=N.toString(2),out=N%2===0?'11'+bits+'11':'1'+bits+'00',R=parseInt(out,2);
       if(R>limit)results.push({N,R});
     }
     results.sort((a,b)=>a.R-b.R);
     return {q:'На вход алгоритма подаётся N. Если N чётное, к двоичной записи слева и справа дописываются по две 1. Если нечётное — справа два 0, слева 1. Найдите наименьшее R > '+limit+'.',
       a:String(results[0].R),s:'Перебор N в Python дает минимальное R = '+results[0].R+' при N = '+results[0].N+'.'};
   }},
  {id:'alg_mod3',name:'Двоичный алгоритм с остатком от 3',n:5,
   h:'Если N % 3 == 0, допишите 3 последние двоичные цифры, иначе допишите bin(3*(N%3)).',
   g(){
     const limit=r(140,420);let best=null;
     for(let N=1;N<=5000;N++){
       const bits=N.toString(2),tail=N%3===0?bits.slice(-3):(3*(N%3)).toString(2),R=parseInt(bits+tail,2);
       if(R>=limit){best={N,R};break;}
     }
     return {q:'На вход алгоритма подаётся N. Если N делится на 3, к двоичной записи справа дописываются 3 её последние цифры. Иначе остаток от деления на 3 умножается на 3, переводится в двоичную и дописывается справа. Найдите минимальное N, при котором R ≥ '+limit+'.',
       a:String(best.N),s:'При N = '+best.N+' получаем R = '+best.R+'.'};
   }},

  // --- Задание 6: 2 подвида ---
  {id:'trt',name:'Черепаха: точки пересечения фигур',n:6,
   h:'Нарисуйте оба прямоугольника на осях и найдите границы их общей области.',
   g(){
     const h1=r(20,38),w1=r(20,40),dx=r(1,h1-2),dy=r(2,Math.floor(w1/2));
     const h2=r(Math.max(2,h1-dx),h1+30),w2=r(Math.max(2,w1-dy),w1+30);
     const nx=Math.min(h1,dx+h2)-dx+1,ny=Math.min(0,-dy)-Math.max(-w1,-dy-w2)+1,answer=nx*ny;
     const cmds='Повтори 6 [Вперёд '+h1+' Направо 90 Вперёд '+w1+' Направо 90]\nПоднять хвост\nВперёд '+dx+' Направо 90 Вперёд '+dy+' Налево 90\nОпустить хвост\nПовтори 6 [Вперёд '+h2+' Направо 90 Вперёд '+w2+' Направо 90]';
     return {q:'Черепаха в начале координат смотрит вдоль +X. Выполните:\n'+cmds+'\nСколько целочисленных точек лежит в пересечении фигур (включая границы)?',
       a:String(answer),s:'Область пересечения имеет '+nx+' целых точек по X и '+ny+' по Y. Итого: '+answer+'.'};
   }},
  {id:'trt_union',name:'Черепаха: объединение фигур',n:6,
   h:'Сумма точек двух прямоугольников минус точки пересечения.',
   g(){
     const h1=r(20,38),w1=r(20,40),dx=r(1,h1-2),dy=r(2,Math.floor(w1/2));
     const h2=r(Math.max(2,h1-dx),h1+30),w2=r(Math.max(2,w1-dy),w1+30);
     const overlap=(Math.min(h1,dx+h2)-dx+1)*(Math.min(0,-dy)-Math.max(-w1,-dy-w2)+1);
     const ans=(h1+1)*(w1+1)+(h2+1)*(w2+1)-overlap;
     return {q:'Два прямоугольника: первый от (0,0) до ('+h1+', −'+w1+'), второй от ('+dx+', −'+dy+') до ('+(dx+h2)+', −'+(dy+w2)+'). Сколько целочисленных точек в их объединении (включая границы)?',
       a:String(ans),s:'По формуле включений-исключений: '+ans+'.'};
   }},

  // --- Задание 7: 5 подвидов ---
  {id:'pic_base',name:'Изображения (базовое)',n:7,
   h:'I = X · Y · i. Бит на пиксель i из 2^i = C.',
   g(){
     let w,h,c,k,v;
     do{w=pick([512,640,1024]);h=pick([256,480,768]);c=pick([16,64,256]);k=Math.log2(c);v=w*h*k/8/1024;}while(v%1||v<1);
     return {q:`Растровое изображение ${w}×${h} пикселей сохранено с палитрой из ${c} цветов без сжатия. Сколько Кбайт занимает файл?`,
       a:String(v),s:`i = ${k} бит. I = (${w}·${h}·${k})/8/1024 = ${v} Кбайт.`};
   }},
  {id:'snd_base',name:'Аудиозапись (базовое)',n:7,
   h:'I = f · b · t · k (частота в Гц, время в секундах).',
   g(){
     let f,b,t,ch,v;
     do{f=pick([16000,24000,32000]);b=pick([16,24]);t=pick([20,30,40]);ch=pick([1,2]);v=f*b*t*ch/8/1024;}while(!Number.isInteger(v));
     return {q:`${ch===1?'Моно':'Стерео'} запись с частотой ${f/1000} кГц и глубиной ${b} бит длится ${t} секунд. Сколько Кбайт занимает файл?`,
       a:String(v),s:`(${f}·${b}·${t}·${ch})/8/1024 = ${v} Кбайт.`};
   }},
  {id:'snd_ratio',name:'Перезапись звука (пропорции)',n:7,
   h:'Переход со стерео на моно уменьшает объем в 2 раза.',
   g(){
     const orig=r(30,80),fR=pick([2,4]),bR=pick([2,3]),ans=(orig/2/fR)*bR;
     return {q:`Стереофайл весит ${orig} Мбайт. Его перезаписали в моно с разрешением в ${bR} раза выше и частотой в ${fR} раза ниже. Укажите новый размер в Мбайт.`,
       a:String(ans),s:`${orig} / 2 / ${fR} · ${bR} = ${ans} Мбайт.`};
   }},
  {id:'dpi_scan',name:'Сканирование с DPI',n:7,
   h:'Количество пикселей растет как квадрат DPI.',
   g(){
     const origMb=r(15,36)*3,newMb=(origMb*4)/3;
     return {q:`Документ отсканировали при 300 dpi и 24-битном цвете — получилось ${origMb} Мбайт. Затем отсканировали при 600 dpi и 256 цветах (8 бит). Найдите новый размер в Мбайт.`,
       a:String(newMb),s:`(600/300)² = 4; 8/24 = 1/3. Ответ: ${origMb} · 4 / 3 = ${newMb} Мбайт.`};
   }},
  {id:'net_trans',name:'Передача по каналу связи',n:7,
   h:'Время = Объем в битах / Скорость в бит/с.',
   g(){
     const speed=pick([64000,128000,256000]),t=r(15,45),kb=(speed*t)/8/1024;
     return {q:`Файл объемом ${kb} Кбайт передается со скоростью ${speed} бит/с. Сколько секунд длилась передача?`,
       a:String(t),s:`(${kb} · 8 · 1024) / ${speed} = ${t} сек.`};
   }},

  // --- Задание 8: 2 подвида ---
  {id:'prm',name:'Алфавитный порядок: первое слово',n:8,
   h:'Идите с начала списка по индексам и проверьте условия.',
   g(){
     const al=['А','Е','К','Н','Т','Ц'];let ans=0,wf='';
     for(let i=0;i<6**5;i++){
       let v=i,w='';for(let p=0;p<5;p++){w=al[v%6]+w;v=Math.floor(v/6);}
       if(!['А','Е','К'].includes(w[0])&&w.includes('Т')&&(i+1)%2===0){ans=i+1;wf=w;break;}
     }
     return {q:'5-буквенные слова из букв А, К, Ц, Е, Н, Т записаны в алфавитном порядке и пронумерованы. Найдите номер первого четного слова, не начинающегося с А, Е, К и содержащего Т.',
       a:String(ans),s:'Первое слово: '+wf+' под номером '+ans+'.'};
   }},
  {id:'prm_last',name:'Алфавитный порядок: последнее слово',n:8,
   h:'Проверяйте номер, первую букву и точное число букв О.',
   g(){
     const al=['А','К','О','Р','С','Т'];let ans=0,wf='';
     for(let i=0;i<6**5;i++){
       let v=i,w='';for(let p=0;p<5;p++){w=al[v%6]+w;v=Math.floor(v/6);}
       if(!['А','С','Т'].includes(w[0])&&[...w].filter(c=>c==='О').length===2&&(i+1)%2===0){ans=i+1;wf=w;}
     }
     return {q:'5-буквенные слова из А, К, О, Р, С, Т в алфавитном порядке пронумерованы с 1. Найдите номер последнего четного слова, не начинающегося с А, С, Т и содержащего ровно две буквы О.',
       a:String(ans),s:'Последнее слово: '+wf+' под номером '+ans+'.'};
   }},

  // --- Задание 9: 2 подвида (.csv) ---
  {id:'ex9',name:'Таблицы: повторяющееся трижды число',n:9,f:1,
   h:'Найдите последнюю строку с одним числом, встречающимся трижды, и 4 уникальными.',
   g(){
     const rows=Array.from({length:r(250,380)},()=>Array.from({length:7},()=>r(1,60)));
     const tr=r(40,80),oth=[];while(oth.length<4){const v=r(1,tr-1);if(!oth.includes(v))oth.push(v);}
     rows.push([tr,tr,tr,...oth]);let ans=0;
     rows.forEach(rw=>{
       const m=new Map();rw.forEach(v=>m.set(v,(m.get(v)||0)+1));
       const tc=[...m.values()].filter(v=>v===3).length,sg=[...m.entries()].filter(x=>x[1]===1).map(x=>x[0]),rep=[...m.entries()].find(x=>x[1]===3)?.[0];
       if(tc===1&&sg.length===4&&sg.reduce((a,b)=>a+b,0)/4<=rep)ans=rw.reduce((a,b)=>a+b,0);
     });
     return {file:{name:'9.csv',text:rows.map(x=>x.join(';')).join('\n'),mime:'text/csv;charset=utf-8;'},
       q:'В файле 9.csv в каждой строке 7 чисел. Найдите сумму чисел в строке с наибольшим номером, где одно число повторяется 3 раза, 4 числа различны, и среднее неповторяющихся не больше повторяющегося.',
       a:String(ans),s:'Сумма чисел последней подходящей строки: '+ans+'.'};
   }},
  {id:'ex9_five',name:'Таблицы: пять различных чисел',n:9,f:1,
   h:'Проверьте различность всех 5 чисел и неравенство 2*(min+max) > сумма остальных.',
   g(){
     const rows=Array.from({length:r(250,400)},()=>Array.from({length:5},()=>r(1,100)));
     rows.push([1,7,10,13,20]);let ans=0;
     for(const rw of rows){if(new Set(rw).size!==5)continue;const x=[...rw].sort((a,b)=>a-b);if(2*(x[0]+x[4])>x[1]+x[2]+x[3])ans++;}
     return {file:{name:'9b.csv',text:rows.map(x=>x.join(';')).join('\n'),mime:'text/csv;charset=utf-8;'},
       q:'В файле 9b.csv в строках по 5 чисел. Найдите количество строк, где все числа различны, а удвоенная сумма min и max больше суммы трех средних чисел.',
       a:String(ans),s:'Подходящих строк: '+ans+'.'};
   }},

  // --- Задание 10 (Демо 2027 — Сети и маски, БЕЗ f:1!) ---
  {id:'mask10',name:'Маска подсети: адрес сети',n:10,
   h:'Побитово примените И между октетами адреса и маски. Сложите октеты.',
   g(){
     const prefix=pick([20,21,22,23,24,25,26,27,28,29]);
     const mask=Array.from({length:4},(_,i)=>{const b=Math.max(0,Math.min(8,prefix-i*8));return b===0?0:256-2**(8-b);});
     const ip=mask.map(()=>r(1,254)),net=ip.map((v,i)=>v&mask[i]),ans=net.reduce((s,v)=>s+v,0);
     return {q:'Даны IP-адрес узла '+ip.join('.')+' и маска сети '+mask.join('.')+'. Найдите адрес сети и запишите в ответ сумму его октетов.',
       a:String(ans),s:'Адрес сети: '+net.join('.')+'. Сумма октетов: '+ans+'.'};
   }},
  {id:'mask10_alt',name:'Маска подсети: количество хостов',n:10,
   h:'Подсчитайте число нулей в маске (k) и найдите 2^k − 2.',
   g(){
     const prefix=pick([20,21,22,23,24,25,26,27,28,29]);
     const mask=Array.from({length:4},(_,i)=>{const b=Math.max(0,Math.min(8,prefix-i*8));return b===0?0:256-2**(8-b);});
     const ip=mask.map(()=>r(1,254)),ans=2**(32-prefix)-2;
     return {q:'Заданы IP '+ip.join('.')+' и маска '+mask.join('.')+'. Определите количество допустимых адресов узлов в подсети (без адреса сети и широковещательного).',
       a:String(ans),s:'Нулей в маске: '+(32-prefix)+'. Число адресов: 2^'+(32-prefix)+' − 2 = '+ans+'.'};
   }},
  {id:'mask10_ones',name:'Сеть: количество IP с четным числом единиц',n:10,
   h:'Используйте модуль ipaddress в Python и проверьте count("1") % 2 == 0 для каждого ip в сети.',
   g(){
     const prefix=pick([24,25,26,27]);
     const ip=[192,168,r(1,200),r(1,200)];
     const hostBits=32-prefix,count=2**(hostBits-1);
     const mask=Array.from({length:4},(_,i)=>{const b=Math.max(0,Math.min(8,prefix-i*8));return b===0?0:256-2**(8-b);});
     return {q:'В сети с маской '+mask.join('.')+' и адресом '+ip.join('.')+' сколько всего IP-адресов имеют чётное количество единиц в двоичной записи?',
       a:String(count),s:'Среди '+2**hostBits+' адресов сети ровно половина имеет чётное число единиц: '+count+'.'};
   }},

  // --- Задание 11: 2 подвида ---
  {id:'pw_password',name:'Пароли и дополнительные сведения',n:11,
   h:'Бит на символ: 2^i >= N. Байт на пароль: округление вверх. Плюс доп. байты.',
   g(){
     const alpha=pick([26,36,52,64]),L=r(11,16),extra=r(15,35),users=r(50,120);
     const i=Math.ceil(Math.log2(alpha)),bPass=Math.ceil(L*i/8),total=(bPass+extra)*users;
     return {q:`При регистрации каждому объекту присваивается идентификатор из ${L} символов из ${alpha}-символьного алфавита. Каждый символ кодируется минимально возможным числом бит, а идентификатор — минимальным целым числом байт. Дополнительно на каждый объект выделено ${extra} байт. Определите объем памяти в байтах для ${users} объектов.`,
       a:String(total),s:`i = ${i} бит, пароль = ${bPass} байт, всего на объект = ${bPass+extra} байт. Итого: ${total}.`};
   }},
  {id:'pw_capacity',name:'Максимальная мощность алфавита по памяти',n:11,
   h:'Подберите максимальное i, при котором ceil(L*i/8) * records <= limit.',
   g(){
     const length=r(90,170),records=r(5000,12000),limitKB=r(700,1400),mem=limitKB*1024;
     let maxA=0,bits=0;
     for(let i=1;i<=16;i++)if(Math.ceil(length*i/8)*records<=mem){maxA=2**i;bits=i;}
     return {q:'Каждый серийный номер состоит из '+length+' символов. Для хранения '+records+' номеров отведено не более '+limitKB+' Кбайт (целое число байт на каждый номер). Определите максимально возможную мощность алфавита.',
       a:String(maxA),s:'Максимально допустимо i = '+bits+' бит на символ. Мощность: 2^'+bits+' = '+maxA+'.'};
   }},

  // --- Задание 12 (Демо 2027: 2 разных алгоритма МТ + Редактор) ---
  {id:'tm',name:'Машина Тьюринга: дописывание 1 слева',n:12,
   h:'Проследите первые 3 шага: головка проходит число влево и ставит 1 перед старшим битом.',
   g(){
     const N=r(100,4095),bin=N.toString(2),res='1'+bin,ans=parseInt(res,2);
     const transitions=[['q0','λ, L, q1','—','—'],['q1','1, L, q2','0, L, q1','1, L, q1'],['q2','λ, S, q2','—','—']];
     return {q:'На ленте записано двоичное число '+N+'. В начале головка на ближайшем справа пустом символе λ.'+tbl(['Сост.','λ','0','1'],transitions)+'Определите получившееся число в десятичной системе.',
       a:String(ans),s:'Слева дописывается 1: '+res+'₂ = '+ans+'.'};
   }},
  {id:'tm_inv',name:'Машина Тьюринга: инверсия битов',n:12,
   h:'В состоянии q1 каждый 0 меняется на 1, а 1 на 0 при движении влево.',
   g(){
     const N=r(50,1023),bin=N.toString(2),inv=[...bin].map(c=>c==='0'?'1':'0').join(''),ans=parseInt(inv,2);
     const transitions=[['q0','λ, L, q1','—','—'],['q1','λ, S, q1','1, L, q1','0, L, q1']];
     return {q:'На ленте записано двоичное представление числа '+N+'. Головка находится на ближайшем справа пустом символе λ.'+tbl(['Сост.','λ','0','1'],transitions)+'Определите десятичное значение числа после остановки машины.',
       a:String(ans),s:'Исходное число '+bin+'₂ инвертируется поразрядно в '+inv+'₂ = '+ans+'.'};
   }},
  {id:'ed',name:'Исполнитель Редактор строк',n:12,
   h:'Замените 111->2 и 222->1 в цикле while в Python.',
   g(){
     const n=r(45,80);let s='1'.repeat(n);
     while(s.includes('111')||s.includes('222'))s=s.includes('111')?s.replace('111','2'):s.replace('222','1');
     const sum=[...s].reduce((a,c)=>a+Number(c),0);
     return {q:'Программа: ПОКА нашлось(111) ИЛИ нашлось(222): ЕСЛИ нашлось(111) ТО заменить(111,2) ИНАЧЕ заменить(222,1). Вход: '+n+' единиц. Найти сумму цифр результата.',
       a:String(sum),s:'Итоговая строка: '+s+', сумма цифр: '+sum+'.'};
   }},

  // --- Задание 13 (Демо 2027: Исполнитель, 2 подвида) ---
  {id:'executor13',name:'Исполнитель: перестановка цифр и +1',n:13,
   h:'Динамическое программирование: переход +1 и перестановка десятков/единиц при условии.',
   g(){
     const ways=(st,tg)=>{
       const dp=Array(tg+1).fill(0);dp[st]=1;
       for(let n=st;n<=tg;n++){
         if(n+1<=tg)dp[n+1]+=dp[n];
         const t=Math.floor(n/10)%10,u=n%10,sw=n+9*(u-t);
         if(t<u&&sw<=tg)dp[sw]+=dp[n];
       }
       return dp[tg];
     };
     let start,target,cnt=0;
     for(let i=0;i<100;i++){start=r(100,140);target=start+r(20,50);cnt=ways(start,target);if(cnt>0)break;}
     return {q:'Команды исполнителя: A — «Прибавь 1», B — «Поменяй местами две последние цифры» (только если цифра десятков меньше цифры единиц). Сколько программ переводят число '+start+' в число '+target+'?',
       a:String(cnt),s:'Подсчет числа путей ДП дает '+cnt+' программ.'};
   }},
  {id:'executor13_ban',name:'Исполнитель: с запрещенным числом',n:13,
   h:'Зануляйте количество способов в запрещенном узле.',
   g(){
     const start=2,mid=r(8,12),ban=r(14,18),end=r(24,30);
     const cnt=(s,t)=>{
       const dp=Array(t+1).fill(0);dp[s]=s===ban?0:1;
       for(let i=s+1;i<=t;i++)dp[i]=i===ban?0:dp[i-1]+(i%2===0&&i/2>=s?dp[i/2]:0);
       return dp[t];
     };
     const ans=cnt(start,mid)*cnt(mid,end);
     return {q:'Команды: 1) Прибавить 1, 2) Умножить на 2. Сколько программ переводят '+start+' в '+end+', если траектория содержит '+mid+' и не содержит '+ban+'?',
       a:String(ans),s:'N('+start+'->'+mid+') · N('+mid+'->'+end+') = '+ans+'.'};
   }},

  // --- Задание 14: 3 подвида ---
  {id:'cc_power',name:'Выражение со степенями',n:14,
   h:'Вычислите выражение на Python и посчитайте цифры.',
   g(){
     const p=pick([3,4,5,7]),a=r(11,19),b=r(8,14),c=r(2,5);
     const s=((BigInt(p)**BigInt(2*a))+(BigInt(p)**BigInt(b))-BigInt(c)).toString(p);
     const cnt=[...s].filter(ch=>ch===String(p-1)).length;
     return {q:`Значение ${p*p}^${a} + ${p}^${b} − ${c} записали в системе с основанием ${p}. Сколько цифр «${p-1}» в этой записи?`,
       a:String(cnt),s:`В записи в системе ${p} цифра ${p-1} встречается ${cnt} раз.`};
   }},
  {id:'cc22',name:'Уравнение с неизвестной цифрой x',n:14,
   h:'Переберите x от 0 до основания минус 1 в Python.',
   g(){
     const b=pick([12,15,18,22]),div=b-1,xVal=r(1,b-1);
     const valBase=2*(b**2)+3+5*(b**2)+7,rem=(valBase+xVal*2*b)%div,c=(div-rem)%div;
     let xFound=0;for(let x=0;x<b;x++)if((valBase+x*2*b+c)%div===0){xFound=x;break;}
     const qVal=(valBase+xFound*2*b+c)/div;
     return {q:`В системе с основанием ${b} дано выражение: 2x3_${b} + 5x7_${b} + ${c}. Определите наименьшее x, при котором сумма кратна ${div}, и запишите в ответ частное от деления на ${div}.`,
       a:String(qVal),s:`При x = ${xFound} сумма кратна ${div}. Частное: ${qVal}.`};
   }},
  {id:'cc_zero',name:'Поиск максимального x по количеству нулей',n:14,
   h:'Переберите x циклом и переведите число в нужную систему счисления.',
   g(){
     const base=7n**170n+7n**100n;let ans=0;
     for(let x=1;x<=2030;x++){if([...(base-BigInt(x)).toString(7)].filter(c=>c==='0').length===71)ans=x;}
     return {q:'Выражение 7¹⁷⁰ + 7¹⁰⁰ − x (1 ≤ x ≤ 2030) записали в 7-ричной системе. Найдите наибольшее x, при котором в записи ровно 71 нуль.',
       a:String(ans),s:'Перебором находим максимальное x = '+ans+'.'};
   }},

  // --- Задание 15: 4 уникальных подвида (дубликат ID удален!) ---
  {id:'logic_bit',name:'Поразрядная конъюнкция',n:15,
   h:'Используйте цикл all() в Python.',
   g(){
     let p,q;do{p=r(10,45);q=r(10,45);}while(!(p&(63^q)));const A=p&(63^q);
     return {q:`Найдите наименьшее натуральное А, при котором ((x & ${p} ≠ 0) → ((x & ${q} == 0) → (x & А ≠ 0))) тождественно истинно.`,
       a:String(A),s:`A = ${A}.`};
   }},
  {id:'lg_seg',name:'Числовые отрезки',n:15,
   h:'Отрезок A должен перекрывать пересечение отрезков P и Q.',
   g(){
     const p1=r(10,25),p2=p1+r(15,25),q1=r(20,35),q2=q1+r(15,25);
     const len=Math.max(0,Math.min(p2,q2)-Math.max(p1,q1));
     return {q:`P=[${p1},${p2}], Q=[${q1},${q2}]. Найдите наименьшую длину отрезка A, чтобы (x∈P) → (((x∈Q) ∧ ¬(x∈A)) → ¬(x∈P)) всегда равнялось 1.`,
       a:String(len),s:`Пересечение P и Q имеет длину ${len}.`};
   }},
  {id:'lg_div',name:'Делимость и отрезок',n:15,
   h:'A должно делить все числа отрезка B, кратные делителю.',
   g(){
     let left,right,div,vals;
     do{left=r(20,90);right=left+r(15,35);div=r(6,25);vals=Array.from({length:right-left+1},(_,i)=>left+i).filter(x=>x%div===0);}while(!vals.length);
     const gcd=(a,b)=>b?gcd(b,a%b):a,ans=vals.reduce((a,b)=>gcd(a,b),vals[0]);
     return {q:`B=[${left},${right}]. Найдите наибольшее натуральное A, чтобы ДЕЛ(x,A) ИЛИ ((x∈B) → НЕ ДЕЛ(x,${div})) всегда истинно.`,
       a:String(ans),s:`Числа в B, кратные ${div}: ${vals.join(', ')}. НОД = ${ans}.`};
   }},
  {id:'lg_ineq',name:'Неравенства на плоскости (x, y)',n:15,
   h:'Напишите двойной генератор all(f(x,y,A) for x in range(100) for y in range(100)).',
   g(){
     const c=r(25,55),k=pick([2,3]);
     let ans=0;for(let A=0;A<200;A++){if(Array.from({length:80},(_,x)=>x).every(x=>Array.from({length:80},(_,y)=>y).every(y=>(x+k*y<c)||(y>A)||(x>A)))){ans=A;break;}}
     // Прямая постановка: (x + k*y > c) or (y < A) or (x < A) -> min A
     let minA=0;
     for(let A=0;A<200;A++){
       let ok=true;
       for(let x=0;x<80&&ok;x++)for(let y=0;y<80&&ok;y++)if(!((x+k*y>c)||(y<A)||(x<A)))ok=false;
       if(ok){minA=A;break;}
     }
     return {q:`Для какого наименьшего целого неотрицательного А выражение (x + ${k}y > ${c}) ∨ (y < A) ∨ (x < A) истинно при любых целых неотрицательных x и y?`,
       a:String(minA),s:`Минимальное А = ${minA}.`};
   }},

  // --- Задание 16: 2 подвида ---
  {id:'rec_linear',name:'Рекурсия: линейная',n:16,
   h:'Вычислите значения F(2), F(3)... последовательно.',
   g(){
     const k=r(2,3),d=r(2,4),n=r(5,7),f=[0,1];for(let i=2;i<=n;i++)f[i]=k*f[i-1]+d*i;
     return {q:`F(1)=1, F(n)=${k}·F(n-1)+${d}·n. Найдите F(${n}).`,a:String(f[n]),s:`Ответ: ${f[n]}.`};
   }},
  {id:'rec_fact',name:'Рекурсия: сокращение факториалов',n:16,
   h:'Сократите дробь, используя F(n)=n·F(n-1).',
   g(){
     const n=r(2050,3500),k=r(3,8),ans=(n-1)*(n+k);
     return {q:`F(1)=1; F(n)=n·F(n−1) при n>1. Найдите (F(${n}) + ${k}·F(${n-1})) / F(${n-2}).`,
       a:String(ans),s:`После сокращения: n·(n−1) + k·(n−1) = (n−1)·(n+k) = ${ans}.`};
   }},

  // --- Задание 17: 2 подвида ---
  {id:'f17_old',name:'Пары чисел: кратность и сумма',n:17,f:1,
   h:'Переберите пары соседних чисел в Python.',
   g(){
     const n=r(200,350),k=pick([3,5,7]),M=r(850,1250),d=Array.from({length:n},()=>r(15,1000));
     let c=0;for(let i=0;i<n-1;i++)if((d[i]%k===0||d[i+1]%k===0)&&d[i]+d[i+1]<=M)c++;
     return {file:{name:'17.txt',text:d.join('\n')},q:`Файл 17.txt (${n} чисел). Найдите количество пар соседних элементов, где хотя бы одно кратно ${k}, а сумма ≤ ${M}.`,
       a:String(c),s:`Подходит пар: ${c}.`};
   }},
  {id:'f17_mod33',name:'Пары чисел: остаток равен минимуму',n:17,f:1,
   h:'Сначала найдите min(data), затем проверьте остаток от деления на 33.',
   g(){
     const n=r(500,800),minV=r(1,30),d=Array.from({length:n},()=>r(minV,100000));
     d[0]=minV;for(let i=20;i<n-1;i+=40){d[i]=minV+33*r(1,2000);}
     let cnt=0,maxS=0;for(let i=0;i<n-1;i++)if(d[i]%33===minV||d[i+1]%33===minV){cnt++;maxS=Math.max(maxS,d[i]+d[i+1]);}
     return {file:{name:'17b.txt',text:d.join('\n')},q:`Файл 17b.txt. Найдите количество пар соседних элементов, где остаток от деления на 33 хотя бы одного элемента равен минимуму последовательности, и их максимальную сумму (через пробел).`,
       a:`${cnt} ${maxS}`,s:`Минимум: ${minV}. Пар: ${cnt}, макс. сумма: ${maxS}.`};
   }},

  // --- Задание 18: 2 подвида (.xls со стенами + углы) ---
  {id:'rob',name:'Робот: финиш в правом нижнем углу',n:18,f:1,
   h:'Откройте 18.xls в Calc/Excel. Постройте две таблицы для максимума и минимума, учитывая стены.',
   g(){
     const size=r(10,12),coins=Array.from({length:size},()=>Array.from({length:size},()=>r(10,85)));
     const wallR=Array.from({length:size},()=>Array(size).fill(false)),wallB=Array.from({length:size},()=>Array(size).fill(false));
     const safeR=new Set(),safeB=new Set();let i=0,j=0;
     while(i<size-1||j<size-1){if(j<size-1&&(i===size-1||Math.random()<0.5)){safeR.add(i+':'+j);j++;}else{safeB.add(i+':'+j);i++;}}
     for(i=0;i<size;i++)for(j=0;j<size;j++){if(j<size-1&&!safeR.has(i+':'+j))wallR[i][j]=Math.random()<0.18;if(i<size-1&&!safeB.has(i+':'+j))wallB[i][j]=Math.random()<0.18;}
     const maxDp=Array.from({length:size},()=>Array(size).fill(-Infinity)),minDp=Array.from({length:size},()=>Array(size).fill(Infinity));
     maxDp[0][0]=minDp[0][0]=coins[0][0];
     for(i=0;i<size;i++)for(j=0;j<size;j++){
       if(!i&&!j)continue;const pMax=[],pMin=[];
       if(i>0&&!wallB[i-1][j]&&Number.isFinite(maxDp[i-1][j])){pMax.push(maxDp[i-1][j]);pMin.push(minDp[i-1][j]);}
       if(j>0&&!wallR[i][j-1]&&Number.isFinite(maxDp[i][j-1])){pMax.push(maxDp[i][j-1]);pMin.push(minDp[i][j-1]);}
       if(pMax.length){maxDp[i][j]=coins[i][j]+Math.max(...pMax);minDp[i][j]=coins[i][j]+Math.min(...pMin);}
     }
     const aMax=maxDp[size-1][size-1],aMin=minDp[size-1][size-1];
     let html='<div style="overflow-x:auto"><table class="g" style="font-size:13px;margin:14px auto">';
     for(i=0;i<size;i++){html+='<tr>';for(j=0;j<size;j++){const b=[];if(j<size-1&&wallR[i][j])b.push('border-right:4px solid #d02438');if(i<size-1&&wallB[i][j])b.push('border-bottom:4px solid #d02438');html+='<td style="min-width:28px;height:28px;padding:2px;'+b.join(';')+'">'+coins[i][j]+'</td>';}html+='</tr>';}
     html+='</table></div>';
     let xr='',st='<Style ss:ID="Default"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>';
     for(i=0;i<size;i++){xr+='<Row>';for(j=0;j<size;j++){const b=[];if(j<size-1&&wallR[i][j])b.push('<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');if(i<size-1&&wallB[i][j])b.push('<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');const id='W'+i+'_'+j;if(b.length)st+='<Style ss:ID="'+id+'"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders>'+b.join('')+'</Borders></Style>';xr+='<Cell ss:StyleID="'+(b.length?id:'Default')+'"><Data ss:Type="Number">'+coins[i][j]+'</Data></Cell>';}xr+='</Row>';}
     const xml='<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles>'+st+'</Styles><Worksheet ss:Name="Поле"><Table>'+xr+'</Table></Worksheet></Workbook>';
     return {file:{name:'18.xls',text:xml,mime:'application/vnd.ms-excel;charset=utf-8;'},
       q:`Файл 18.xls, поле ${size}×${size}. Робот идет вправо или вниз, не проходя сквозь красные стены. Найдите максимальную и минимальную суммы в правой нижней клетке (через пробел).`+html,
       a:`${aMax} ${aMin}`,s:`Максимум: ${aMax}, минимум: ${aMin}.`};
   }},
  {id:'rob_corners',name:'Робот: все угловые конечные клетки (Демо)',n:18,f:1,
   h:'Угловая клетка — любая клетка, у которой справа И снизу находятся стены или края поля.',
   g(){
     const size=10,coins=Array.from({length:size},()=>Array.from({length:size},()=>r(10,80)));
     const wallR=Array.from({length:size},()=>Array(size).fill(false)),wallB=Array.from({length:size},()=>Array(size).fill(false));
     wallR[3][4]=true;wallB[3][4]=true; // Угловая клетка внутри поля (3,4)
     wallR[6][2]=true;wallB[6][2]=true; // Угловая клетка (6,2)
     const maxDp=Array.from({length:size},()=>Array(size).fill(-Infinity)),minDp=Array.from({length:size},()=>Array(size).fill(Infinity));
     maxDp[0][0]=minDp[0][0]=coins[0][0];
     let cMax=-Infinity,cMin=Infinity;
     for(let i=0;i<size;i++)for(let j=0;j<size;j++){
       if(i||j){
         const pm=[],pn=[];
         if(i>0&&!wallB[i-1][j]){pm.push(maxDp[i-1][j]);pn.push(minDp[i-1][j]);}
         if(j>0&&!wallR[i][j-1]){pm.push(maxDp[i][j-1]);pn.push(minDp[i][j-1]);}
         maxDp[i][j]=coins[i][j]+Math.max(...pm);minDp[i][j]=coins[i][j]+Math.min(...pn);
       }
       if((j===size-1||wallR[i][j])&&(i===size-1||wallB[i][j])){cMax=Math.max(cMax,maxDp[i][j]);cMin=Math.min(cMin,minDp[i][j]);}
     }
     let html='<div style="overflow-x:auto"><table class="g" style="font-size:13px;margin:14px auto">';
     for(let i=0;i<size;i++){html+='<tr>';for(let j=0;j<size;j++){const b=[];if(wallR[i][j])b.push('border-right:4px solid #d02438');if(wallB[i][j])b.push('border-bottom:4px solid #d02438');html+='<td style="min-width:28px;height:28px;padding:2px;'+b.join(';')+'">'+coins[i][j]+'</td>';}html+='</tr>';}
     html+='</table></div>';
     let xr='',st='<Style ss:ID="Default"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>';
     for(let i=0;i<size;i++){xr+='<Row>';for(let j=0;j<size;j++){const b=[];if(wallR[i][j])b.push('<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');if(wallB[i][j])b.push('<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#D02438"/>');const id='W'+i+'_'+j;if(b.length)st+='<Style ss:ID="'+id+'"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders>'+b.join('')+'</Borders></Style>';xr+='<Cell ss:StyleID="'+(b.length?id:'Default')+'"><Data ss:Type="Number">'+coins[i][j]+'</Data></Cell>';}xr+='</Row>';}
     const xml='<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles>'+st+'</Styles><Worksheet ss:Name="Поле"><Table>'+xr+'</Table></Worksheet></Workbook>';
     return {file:{name:'18_corners.xls',text:xml,mime:'application/vnd.ms-excel;charset=utf-8;'},
       q:'Файл 18_corners.xls, поле 10×10. Робот останавливается в любой угловой клетке, ограниченной справа и снизу стенами (или границами поля). Найдите максимальную и минимальную итоговые суммы среди всех возможных конечных клеток (два числа через пробел).'+html,
       a:`${cMax} ${cMin}`,s:`Среди всех угловых тупиков поля (включая правый нижний угол): макс = ${cMax}, мин = ${cMin}.`};
   }},

  // --- Задания 19, 20, 21 ---
  ...[false,true].flatMap(two=>[19,20,21].map(n=>({
    id:'g'+n+(two?'b':''),name:'Теория игр ('+(two?'две кучи':'одна куча')+')',n,
    h:'Используйте рекурсивный перебор состояний игры в Python.',
    g(){
      for(let attempt=0;attempt<400;attempt++){
        const a=pick([1,2]),N=two?r(50,70):r(40,70),h=r(6,12);
        const mv=two?s=>[[s[0]+a,s[1]],[s[0],s[1]+a],[s[0]*2,s[1]],[s[0],s[1]*2]]:s=>[[s[0]+a],[s[0]*2]];
        const win=s=>s.reduce((x,y)=>x+y,0)>=N,memo=new Map();
        const W=(s,k)=>{if(k<=0)return false;const key=s.join(',')+':'+k;if(memo.has(key))return memo.get(key);const res=mv(s).some(nx=>win(nx)||mv(nx).every(rp=>!win(rp)&&W(rp,k-1)));memo.set(key,res);return res;};
        const V=(s,k)=>mv(s).every(nx=>!win(nx)&&W(nx,k)),st=S=>two?[h,S]:[S],Ss=Array.from({length:two?N-h-1:N-1},(_,i)=>i+1);
        let ans;
        if(n===19){const c=Ss.filter(S=>!W(st(S),1)&&V(st(S),1));if(c.length)ans=Math.max(...c);}
        else if(n===20){const c=Ss.filter(S=>W(st(S),2)&&!W(st(S),1)).slice(0,2);if(c.length===2)ans=c;}
        else{const c=Ss.find(S=>V(st(S),2)&&!V(st(S),1));if(c!==undefined)ans=c;}
        if(ans===undefined)continue;
        const head=two?`Две кучи (${h} и S). Ходы: +${a} или ×2. Победа при сумме ≥ ${N}. `:`Одна куча (S). Ходы: +${a} или ×2. Победа при ≥ ${N}. `;
        if(n===19)return {q:head+'Найдите наибольшее S, при котором Ваня выигрывает первым ходом при любой игре Пети.',a:String(ans),s:'Ответ: '+ans+'.'};
        if(n===20)return {q:head+'Найдите два наименьших S, при которых Петя выигрывает вторым ходом. Запишите через пробел.',a:ans.join(' '),s:'Ответ: '+ans.join(' ')+'.'};
        return {q:head+'Найдите наименьшее S, при котором Ваня выигрывает первым или вторым ходом, но не гарантированно первым.',a:String(ans),s:'Ответ: '+ans+'.'};
      }
      throw new Error('Ошибка генерации игры');
    }
  }))),

  // --- Задание 22: 2 подвида ---
  {id:'proc_critical',name:'Параллельные процессы: общее время',n:22,
   h:'Окончание = длительность + максимум окончаний зависимостей.',
   g(){
     const P=[];for(let i=0;i<7;i++)P.push({d:r(2,9),dep:i?[...new Set(Array.from({length:r(0,2)},()=>r(1,i)))].sort((a,b)=>a-b):[]});
     const e=[];P.forEach((p,i)=>e[i]=p.d+Math.max(0,...p.dep.map(k=>e[k-1])));const ans=Math.max(...e);
     return {q:'Определите минимальное время завершения всех процессов.'+tbl(['ID','Длительность','Зависит от'],P.map((p,i)=>[i+1,p.d,p.dep.join(', ')||'–'])),
       a:String(ans),s:`Максимум среди окончаний: ${ans} мс.`};
   }},
  {id:'proc_file',name:'Параллельные процессы на 7-й мс (файл 22.csv)',n:22,f:1,
   h:'Найдите интервал работы [старт; финиш] каждого процесса и посчитайте активные на 7-й мс.',
   g(){
     const N=r(18,30),ms=7,procs=[];
     for(let id=1;id<=N;id++){const d=r(1,9),deps=[];if(id>3)for(let j=1;j<id;j++)if(Math.random()<0.14)deps.push(j);procs.push({id,d,deps});}
     const fin=[];for(const p of procs){p.s=p.deps.length?Math.max(...p.deps.map(i=>fin[i-1]+1)):1;p.f=p.s+p.d-1;fin[p.id-1]=p.f;}
     const active=procs.filter(p=>p.s<=ms&&p.f>=ms).length;
     const csv='ID;Время выполнения, мс;Зависимости\n'+procs.map(p=>[p.id,p.d,p.deps.join(',')||'0'].join(';')).join('\n');
     return {file:{name:'22.csv',text:csv,mime:'text/csv;charset=utf-8;'},
       q:'В файле 22.csv данные о процессах. Сколько процессов одновременно выполняется на 7-й миллисекунде (счет с 1-й мс)?',
       a:String(active),s:`На 7-й миллисекунде активны ${active} процессов.`};
   }},

  // --- Задание 23 (Демо 2027: Взвешенный граф из 23.txt, 2 подвида) ---
  {id:'graph23',name:'Граф из файла: кратчайший путь',n:23,f:1,
   h:'Словарь смежности и поиск минимума с мемоизацией (или обходом по возрастанию вершин).',
   g(){
     const mid=[...new Set(Array.from({length:r(8,14)},()=>r(2,8)))].filter(x=>x!==1&&x!==9).sort((a,b)=>a-b);
     const nodes=[1,...mid,9],edges=[],es=new Set(),w=()=>Number((r(10,500)/10).toFixed(1));
     for(let i=0;i<nodes.length-1;i++){edges.push({a:nodes[i],b:nodes[i+1],w:w()});es.add(nodes[i]+':'+nodes[i+1]);}
     for(let i=0;i<nodes.length;i++)for(let j=i+2;j<nodes.length;j++)if(Math.random()<0.3&&!es.has(nodes[i]+':'+nodes[j])){edges.push({a:nodes[i],b:nodes[j],w:w()});es.add(nodes[i]+':'+nodes[j]);}
     const out=new Map(nodes.map(v=>[v,[]])),dist=new Map(nodes.map(v=>[v,Infinity]));
     edges.forEach(e=>out.get(e.a).push(e));dist.set(1,0);
     for(const v of nodes)for(const e of out.get(v))dist.set(e.b,Math.min(dist.get(e.b),dist.get(v)+e.w));
     const ans=Math.floor(dist.get(9));
     return {file:{name:'23.txt',text:edges.sort(()=>Math.random()-0.5).map(e=>e.a+' '+e.b+' '+e.w.toFixed(1)).join('\n')},
       q:'Файл 23.txt содержит ребра ациклического ориентированного графа (L M W). Найдите целую часть длины кратчайшего пути из вершины 1 в вершину 9.',
       a:String(ans),s:'Кратчайший путь равен '+dist.get(9).toFixed(1)+'. Целая часть: '+ans+'.'};
   }},
  {id:'graph23_max',name:'Граф из файла: максимальный путь (дополнительная модель)',n:23,f:1,
   h:'Инициализируйте расстояния -Infinity и используйте max вместо min.',
   g(){
     const mid=[...new Set(Array.from({length:r(6,10)},()=>r(2,8)))].filter(x=>x!==1&&x!==9).sort((a,b)=>a-b);
     const nodes=[1,...mid,9],edges=[],es=new Set(),w=()=>Number((r(10,400)/10).toFixed(1));
     for(let i=0;i<nodes.length-1;i++){edges.push({a:nodes[i],b:nodes[i+1],w:w()});es.add(nodes[i]+':'+nodes[i+1]);}
     for(let i=0;i<nodes.length;i++)for(let j=i+2;j<nodes.length;j++)if(Math.random()<0.35&&!es.has(nodes[i]+':'+nodes[j])){edges.push({a:nodes[i],b:nodes[j],w:w()});es.add(nodes[i]+':'+nodes[j]);}
     const out=new Map(nodes.map(v=>[v,[]])),dist=new Map(nodes.map(v=>[v,-Infinity]));
     edges.forEach(e=>out.get(e.a).push(e));dist.set(1,0);
     for(const v of nodes)for(const e of out.get(v))dist.set(e.b,Math.max(dist.get(e.b),dist.get(v)+e.w));
     const ans=Math.floor(dist.get(9));
     return {file:{name:'23_max.txt',text:edges.sort(()=>Math.random()-0.5).map(e=>e.a+' '+e.b+' '+e.w.toFixed(1)).join('\n')},
       q:'Файл 23_max.txt содержит ребра ациклического ориентированного графа (L M W). Найдите целую часть длины самого длинного пути из вершины 1 в вершину 9.',
       a:String(ans),s:'Наибольший путь равен '+dist.get(9).toFixed(1)+'. Целая часть: '+ans+'.'};
   }},

  // --- Задание 24: 2 подвида ---
  {id:'s24',name:'Длиннейшее арифметическое выражение',n:24,f:1,
   h:'Регулярное выражение для корректных чисел без ведущих нулей и операторов - и *.',
   g(){
     const chars='06789-*',rnd=n=>Array.from({length:n},()=>chars[r(0,6)]).join('');
     const mk=()=>{const p=[];for(let i=0;i<r(18,30);i++){p.push(Math.random()<0.12?'0':String(r(6,9))+Array.from({length:r(1,3)},()=>pick(['0','6','7','8','9'])).join(''));if(i<17)p.push(pick(['-','*']));}return p.join('');};
     const data=rnd(600)+mk()+rnd(600),expr=/(?:0|[6789][06789]*)(?:[-*](?:0|[6789][06789]*))*/y;
     let best=0;for(let i=0;i<data.length;i++){if(!/[06789]/.test(data[i]))continue;expr.lastIndex=i;const m=expr.exec(data);if(m&&m[0].length>best)best=m[0].length;}
     return {file:{name:'24.txt',text:data},q:'Файл 24.txt из символов 0,6,7,8,9,-,*. Найдите максимальную длину корректного арифметического выражения без ведущих нулей и подряд идущих знаков.',
       a:String(best),s:'Максимальная длина корректного выражения: '+best+'.'};
   }},
  {id:'s24_pair',name:'Максимальная подстрока без запретной пары',n:24,f:1,
   h:'Используйте replace(pair, " ") и split() в Python.',
   g(){
     const L=r(2000,3500),pair=pick(['AB','BC','CD','CA']),s=Array.from({length:L},()=>pick(['A','B','C','D'])).join('');
     let best=1,cur=1;for(let i=1;i<L;i++){if(s[i-1]+s[i]===pair){best=Math.max(best,cur);cur=1;}else cur++;}
     best=Math.max(best,cur);
     return {file:{name:'24b.txt',text:s},q:`Файл 24b.txt (${L} символов A–D). Найдите макс. длину подстроки без сочетания «${pair}».`,
       a:String(best),s:'Ответ: '+best+'.'};
   }},

  // --- Задание 25: 3 подвида (ИСПРАВЛЕНО для однострочного input!) ---
  {id:'mask25',name:'Маска числа (пробел между числами)',n:25,
   h:'Используйте fnmatch в Python. Запишите все числа и их частные через пробел в одну строку.',
   g(){
     const mask='3?12?14*5',div=1917,found=[];
     for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)for(let len=0;len<=2;len++){
       const vars=len===0?['']:Array.from({length:10**len},(_,i)=>String(i).padStart(len,'0'));
       for(const mid of vars){const val=Number('3'+a+'12'+b+'14'+mid+'5');if(val<=10_000_000_000&&val%div===0)found.push({val,q:val/div});}
     }
     found.sort((a,b)=>a.val-b.val);
     const ans=found.map(x=>x.val+' '+x.q).join(' ');
     return {q:'Найдите все числа ≤ 10¹⁰ по маске '+mask+', кратные '+div+'. Запишите найденные числа по возрастанию и их частные от деления на '+div+' в одну строку через пробел.',
       a:ans,s:'Найдено '+found.length+' чисел. Ответ: '+ans+'.'};
   }},
  {id:'mask25_alt',name:'Маска числа (первые 4 результата)',n:25,
   h:'Используйте fnmatch в Python и выведите первые 4 найденных числа и частные.',
   g(){
     const mask='12?45*?',div=pick([37,43,53]),found=[];
     for(let a=0;a<=9;a++)for(let len=0;len<=2;len++){
       const mids=len===0?['']:Array.from({length:10**len},(_,i)=>String(i).padStart(len,'0'));
       for(const m of mids)for(let l=0;l<=9;l++){const v=Number('12'+a+'45'+m+l);if(v%div===0)found.push({v,q:v/div});}
     }
     found.sort((a,b)=>a.v-b.v);const rows=found.slice(0,4),ans=rows.map(x=>x.v+' '+x.q).join(' ');
     return {q:'Найдите все числа по маске '+mask+', кратные '+div+'. Запишите первые 4 числа по возрастанию и их частные в одну строку через пробел.',
       a:ans,s:'Первые 4 числа и частные: '+ans+'.'};
   }},
  {id:'div25_cnt',name:'Поиск чисел с 2 нетривиальными делителями',n:25,
   h:'Переберите делители от 2 до корня. Запишите число и больший делитель через пробел.',
   g(){
     const st=r(500000,700000);let ansN=0,ansD=0;
     for(let n=st+1;n<st+5000;n++){
       const divs=[];for(let d=2;d*d<=n;d++)if(n%d===0){divs.push(d);if(d*d!==n)divs.push(n/d);}
       if(divs.length===2){ansN=n;ansD=Math.max(...divs);break;}
     }
     return {q:`Найдите наименьшее число > ${st}, имеющее ровно 2 нетривиальных делителя (кроме 1 и самого числа). В ответ запишите число и его больший нетривиальный делитель через пробел.`,
       a:`${ansN} ${ansD}`,s:`Число ${ansN}, делители: ${ansN/ansD} и ${ansD}.`};
   }},

  // --- Задание 26: 2 подвида ---
  {id:'srv26',name:'Сервер: буфер и резервные копии',n:26,f:1,
   h:'Суммируйте объемы по ID клиентов, затем смоделируйте сбросы буфера до 11:59:59.',
   g(){
     const N=r(650,900),K=r(8000,15000),recs=[];
     for(let i=0;i<N;i++){
       const sec=Math.floor(i*86399/N),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
       recs.push({sec,time:[h,m,s].map(x=>String(x).padStart(2,'0')).join(':'),client:r(10000,10060),size:r(100,800)});
     }
     const tot=new Map();recs.forEach(p=>tot.set(p.client,(tot.get(p.client)||0)+p.size));
     const topTwo=[...tot.values()].sort((a,b)=>b-a).slice(0,2),topSum=topTwo[0]+topTwo[1];
     let buf=0;const bks=[];
     for(const p of recs){if(buf+p.size>K){bks.push({sec:p.sec,size:buf});buf=0;}buf+=p.size;}
     const morn=bks.filter(p=>p.sec<=43199),lastBk=morn[morn.length-1];
     return {file:{name:'26.txt',text:N+' '+K+'\n'+recs.map(p=>p.time+' '+p.client+' '+p.size).join('\n')},
       q:'Файл 26.txt: журнал сервера (N запросов, буфер K). При переполнении создается резервная копия. Найдите макс. сумму объемов от двух клиентов и объем последней копии до 11:59:59 (через пробел).',
       a:topSum+' '+lastBk.size,s:'Сумма двух макс. клиентов: '+topSum+'. Последняя копия до полудня: '+lastBk.size+'.'};
   }},
  {id:'rank26',name:'Рейтинг продуктов по срокам годности',n:26,f:1,
   h:'Отсортируйте все события сроков. Слева ставятся сроки хранения, справа — сроки после вскрытия.',
   g(){
     const N=r(150,250),used=new Set(),prods=[];
     while(prods.length<N){const s=r(1,5000),o=r(1,5000);if(s!==o&&!used.has(s)&&!used.has(o)){used.add(s);used.add(o);prods.push({id:prods.length+1,s,o});}}
     const vals=[];prods.forEach(p=>{vals.push({v:p.s,id:p.id,k:'s'},{v:p.o,id:p.id,k:'o'});});vals.sort((a,b)=>a.v-b.v);
     const rank=Array(N).fill(0),pl=new Set();let l=0,rt=N-1,lastId=0,lastIdx=-1;
     for(const it of vals){if(pl.has(it.id))continue;const idx=it.k==='s'?l++:rt--;rank[idx]=it.id;pl.add(it.id);lastId=it.id;lastIdx=idx;}
     const below=rank.filter((id,idx)=>idx>lastIdx&&id!==0).length;
     return {file:{name:'26-ranking.csv',text:'ID;Хранение;Вскрытие\n'+prods.map(p=>[p.id,p.s,p.o].join(';')).join('\n'),mime:'text/csv;charset=utf-8;'},
       q:'Файл 26-ranking.csv. Разместите продукты в рейтинге (хранение — в свободное место слева, вскрытие — справа). Найдите ID последнего размещенного продукта и число продуктов ниже него.',
       a:lastId+' '+below,s:'Последний ID: '+lastId+', ниже него: '+below+'.'};
   }},

  // --- Задание 27 (Демо 2027 + классическая 2D кластеризация) ---
  {id:'s27',name:'Кластеры по кинетической энергии (Демо 2027)',n:27,f:1,
   h:'E = 0.5*m*(Vx^2 + Vy^2). Центр — реальная частица с min суммой разностей энергий.',
   g(){
     const bases=[4.2,12.2,20.2,28.2],groups=[],points=[],tags=['II','II','II','IV','V','I','III','VI','VII','IV','V'];
     for(let c=0;c<4;c++){
       const gr=[];
       for(let k=0;k<11;k++){
         const tE=bases[c]+Math.random()*1.4,m=Number((1.2+Math.random()*3.8).toFixed(4)),sp=Math.sqrt(2*tE/m),an=Math.random()*Math.PI*2;
         const vx=Number((sp*Math.cos(an)).toFixed(5)),vy=Number((sp*Math.sin(an)).toFixed(5)),x=Number((c*20+Math.random()*6).toFixed(4)),y=Number((Math.floor(k/4)*7+Math.random()*3).toFixed(4));
         const e=0.5*m*(vx*vx+vy*vy),p={x,y,vx,vy,m,tag:tags[k],e};gr.push(p);points.push(p);
       }
       groups.push(gr);
     }
     const centers=groups.map(gr=>{let best=gr[0],bS=Infinity;for(const cand of gr){const s=gr.reduce((a,p)=>a+Math.abs(cand.e-p.e),0);if(s<bS){best=cand;bS=s;}}return best;});
     let q1=0;for(const gr of groups){const sp=gr.filter(p=>p.tag==='II');for(let i=0;i<sp.length;i++)for(let j=i+1;j<sp.length;j++)q1=Math.max(q1,Math.hypot(sp[i].x-sp[j].x,sp[i].y-sp[j].y));}
     const q2=Math.max(...centers.map(p=>p.e)),ans1=Math.floor(q1*10000),ans2=Math.floor(q2*10000);
     return {file:{name:'27.txt',text:points.sort(()=>Math.random()-0.5).map(p=>[p.x.toFixed(4),p.y.toFixed(4),p.vx.toFixed(5),p.vy.toFixed(5),p.m.toFixed(4),p.tag].join(' ')).join('\n')},
       q:'Файл 27.txt (x y Vx Vy m признак). 4 кластера по энергии E=0,5·m·(Vx²+Vy²), R=2,0. Найдите центры (min сумма разностей энергий). Укажите int(Q1·10000) и int(Q2·10000) через пробел, где Q1 — макс. расстояние между признаками II в одном кластере, Q2 — макс. энергия центра.',
       a:ans1+' '+ans2,s:'Ответ: '+ans1+' '+ans2+'.'};
   }},
  {id:'s27_2d',name:'Пространственная кластеризация на плоскости',n:27,f:1,
   h:'Разделите звезды на 2 кластера по координатам, найдите реальный медоид (min сумму евклидовых расстояний).',
   g(){
     const c1=[],c2=[],pts=[];
     for(let i=0;i<25;i++){const p={x:Number((2+Math.random()*3).toFixed(4)),y:Number((2+Math.random()*3).toFixed(4))};c1.push(p);pts.push(p);}
     for(let i=0;i<25;i++){const p={x:Number((12+Math.random()*3).toFixed(4)),y:Number((12+Math.random()*3).toFixed(4))};c2.push(p);pts.push(p);}
     const med=cl=>{let best=cl[0],bS=Infinity;for(const a of cl){const s=cl.reduce((acc,b)=>acc+Math.hypot(a.x-b.x,a.y-b.y),0);if(s<bS){best=a;bS=s;}}return best;};
     const m1=med(c1),m2=med(c2),px=Math.floor(((m1.x+m2.x)/2)*10000),py=Math.floor(((m1.y+m2.y)/2)*10000);
     return {file:{name:'27_2d.txt',text:pts.sort(()=>Math.random()-0.5).map(p=>p.x.toFixed(4)+' '+p.y.toFixed(4)).join('\n')},
       q:'Файл 27_2d.txt (координаты x y звезд, 2 кластера). Центроид — реальная звезда кластера с минимальной суммой расстояний до остальных звезд кластера. Запишите через пробел целые части средних значений Px и Py центроидов, умноженные на 10 000.',
       a:`${px} ${py}`,s:`Центроид 1: (${m1.x}, ${m1.y}), Центроид 2: (${m2.x}, ${m2.y}). Ответ: ${px} ${py}.`};
   }}
];

const LV=[[0,'Бит'],[10,'Байт'],[30,'Килобайт'],[70,'Мегабайт'],[120,'Гигабайт'],[200,'Терабайт']];
let S;try{S=JSON.parse(localStorage.getItem('bt1'));}catch(e){S=null;}
S=S||{st:{},streak:0,last:'',sp:0,best:0};
const save=()=>{try{localStorage.setItem('bt1',JSON.stringify(S));}catch(e){}};
const day=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const total=()=>Object.values(S.st).reduce((s,x)=>s+x.ok,0);
let mode='train',topic='all',cur=null,done=false,q=[],qi=0,score=0,left=600,timer=null,miss=[],lastLv='';

function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),3200);}
function head(){
  const n=total();let i=LV.length-1;while(LV[i][0]>n)i--;const nx=LV[i+1];
  if(lastLv&&lastLv!==LV[i][1])toast('Новый уровень: '+LV[i][1]);
  lastLv=LV[i][1];$('#lvn').textContent='Уровень: '+LV[i][1];
  $('#xp').style.width=(nx?(n-LV[i][0])/(nx[0]-LV[i][0])*100:100)+'%';
  $('#lvt').textContent=nx?`до уровня «${nx[1]}» осталось ${nx[0]-n}`:'высший уровень';
  $('#stk').textContent=S.streak?'дней подряд: '+S.streak:'';
}
function rec(id,ok){
  const x=S.st[id]||(S.st[id]={ok:0,all:0});x.all++;if(ok)x.ok++;
  const t=day(new Date());if(S.last!==t){S.streak=S.last===day(new Date(Date.now()-864e5))?S.streak+1:1;S.last=t;}
  save();head();
}
const gen=t=>Object.assign({t},t.g());
const pickTopic=()=>topic==='all'?pick(T):pick(T.filter(x=>String(x.n)===topic));

function show(c){
  cur=c;done=false;$('#tag').textContent=`Задание ${c.t.n} в КЕГЭ, ${c.t.name}`;$('#q').innerHTML=c.q;
  $('#fl').hidden=!c.file;
  if(c.file){
    const mime=c.file.mime||(c.file.name.endsWith('.csv')?'text/csv;charset=utf-8;':'text/plain;charset=utf-8;');
    $('#fl').innerHTML=`<a href="${URL.createObjectURL(new Blob([c.file.text],{type:mime}))}" download="${c.file.name}">Скачать файл ${c.file.name}</a>`;
  }
  const cd=$('#card');cd.classList.remove('in','shake');void cd.offsetWidth;cd.classList.add('in');
  $('#ans').value='';$('#ans').disabled=false;$('#chk').disabled=false;
  ['#hn','#fb','#sol'].forEach(s=>$(s).hidden=true);
  $('#hint').hidden=mode!=='train';$('#nxt').hidden=mode!=='train';$('#nxt').textContent='Другое задание';
  $('#card').hidden=false;$('#ans').focus();
}
function check(){
  if(done)return;const v=$('#ans').value;if(!v.trim())return;done=true;
  const ok=norm(v)===norm(cur.a);rec(cur.t.id,ok);
  if(mode==='sprint'){if(ok)score++;else miss.push(cur.t.name);}
  if(!ok)$('#card').classList.add('shake');
  $('#fb').hidden=false;$('#fb').innerHTML=ok?'<span class="tick">✓</span>Верно':`<s>${esc(v)}</s> Неверно, должно быть ${esc(cur.a)}`;
  $('#sol').hidden=false;$('#sol').innerHTML='<b>Как решать.</b> '+cur.s;
  $('#ans').disabled=true;$('#chk').disabled=true;$('#nxt').hidden=false;
  $('#nxt').textContent=mode==='train'?'Другое задание':(qi>=7?'Показать оценку':'Дальше');
}
function next(){
  if(mode==='train'){const o=T.filter(t=>t!==cur.t&&(topic==='all'||t.n===cur.t.n));return show(gen(o.length?pick(o):cur.t));}
  qi++;if(qi>=8)return fin();$('#cnt').textContent=`Задание ${qi+1} из 8`;show(q[qi]);
}
function fin(){
  clearInterval(timer);$('#card').hidden=true;$('#bar').hidden=true;
  const g=score>=7?5:score>=5?4:score>=3?3:2;S.sp++;S.best=Math.max(S.best,score);save();
  const rep=miss.length?`Стоит повторить: ${[...new Set(miss)].join(', ')}.`:'Без ошибок, отлично.';
  $('#res').hidden=false;$('#res').innerHTML=`<div class="mark">${g}</div><p>Верно решено ${score} из 8. Времени потрачено ${fmt(600-left)}.</p><p class="red">${rep}</p><button id="again">Ещё один спринт</button>`;
  $('#again').onclick=()=>tab('sprint');
}
function stats(){
  const all=Object.values(S.st).reduce((s,x)=>s+x.all,0);
  const w=T.filter(t=>S.st[t.id]&&S.st[t.id].all>=3).sort((a,b)=>S.st[a.id].ok/S.st[a.id].all-S.st[b.id].ok/S.st[b.id].all)[0];
  $('#stat').innerHTML='<article class="sheet"><h2>Моя тетрадь</h2>'+
    `<p>Верно решено ${total()} из ${all}. Спринтов пройдено: ${S.sp}, лучший результат ${S.best} из 8.</p>`+
    (w?`<p class="red">Хуже всего получается тема «${w.name}». Потренируйте её.</p>`:'')+
    Array.from({length:27},(_,i)=>i+1).map(n=>{
      const x=T.filter(t=>t.n===n).reduce((s,t)=>{const y=S.st[t.id]||{ok:0,all:0};return{ok:s.ok+y.ok,all:s.all+y.all};},{ok:0,all:0}),p=x.all?Math.round(x.ok/x.all*100):0;
      return `<div class="tp"><span>Задание ${n}</span><span class="bar"><i style="width:${p}%"></i></span><span>${x.all?p+'% ('+x.ok+' из '+x.all+')':'пока пусто'}</span></div>`;
    }).join('')+'<p><button id="rs" class="ghost">Стереть прогресс</button></p></article>';
  $('#rs').onclick=()=>{if(confirm('Стереть весь прогресс?')){S={st:{},streak:0,last:'',sp:0,best:0};lastLv='';save();head();stats();}};
}
function tab(t){
  clearInterval(timer);mode=t;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  $('#topics').hidden=t!=='train';$('#intro').hidden=t!=='sprint';$('#stat').hidden=t!=='stat';
  ['#bar','#card','#res','#ng'].forEach(s=>$(s).hidden=true);
  if(t==='train'){topic='all';document.querySelectorAll('#topics button').forEach(x=>x.classList.toggle('on',x.dataset.id==='all'));show(gen(pickTopic()));}
  if(t==='stat')stats();
}
$('#go').onclick=()=>{
  q=[...new Set(T.filter(t=>!t.f).map(t=>t.n))].sort(()=>Math.random()-.5).slice(0,8).map(n=>gen(pick(T.filter(t=>t.n===n&&!t.f))));
  qi=0;score=0;miss=[];left=600;$('#intro').hidden=true;$('#bar').hidden=false;$('#cnt').textContent='Задание 1 из 8';$('#tm').textContent=fmt(left);
  timer=setInterval(()=>{left--;$('#tm').textContent=fmt(left);if(left<=0)fin();},1000);show(q[0]);
};
const FIPI='https://ege.fipi.ru/bank/index.php?proj=B9ACA5BBB2E19E434CD6BEC25284C67F';
$('#topics').innerHTML='<button data-id="all" class="on">Все</button>'+Array.from({length:27},(_,i)=>i+1).map(n=>`<button data-id="${n}"${T.some(t=>t.n===n)?'':' class="fp"'}>${n}</button>`).join('');
$('#topics').onclick=e=>{
  const b=e.target.closest('button');if(!b)return;topic=b.dataset.id;
  document.querySelectorAll('#topics button').forEach(x=>x.classList.toggle('on',x===b));
  const none=topic!=='all'&&!T.some(t=>String(t.n)===topic);$('#ng').hidden=!none;$('#card').hidden=none;
  if(none)$('#ng').innerHTML=`Для задания ${topic} генератора пока нет.`;else show(gen(pickTopic()));
};
$('#tabs').onclick=e=>{const b=e.target.closest('button');if(b)tab(b.dataset.t);};
$('#chk').onclick=check;$('#nxt').onclick=next;$('#hint').onclick=()=>{$('#hn').hidden=false;$('#hn').textContent='Подсказка: '+cur.t.h;};
$('#ans').addEventListener('keydown',e=>{if(e.key==='Enter')check();});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&done&&e.target.id!=='ans'&&e.target.tagName!=='BUTTON')next();});
head();tab('train');
