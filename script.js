//* 1 task
// function digitize(n) {
// return String(n).split('').reverse().map(Number);
// }

// function digitize(n) {
//   return [...String(n)].reverse().map(Number);
// }

// digitize(35231),[1,3,2,5,3];
// digitize(0),[0];

// console.log(digitize(35231),[1,3,2,5,3]);
// console.log(digitize(0),[0]);

//* 2 task

// function sumProduct(n) {
//   return (n * (n + 1)) / 2;
// }

// console.log(sumProduct(2));
//* СЛОВАРЬ ДЛЯ ЧИСЕЛ ТА СТЕПЕНЕЙ
const wordsMap = {
  units: ['', 'один', 'два', 'три', 'чотири', 'пʼять', 'шість', 'сім', 'вісім', 'девʼять'],
  unitsFem: ['', 'одна', 'дві', 'три', 'чотири', 'пʼять', 'шість', 'сім', 'вісім', 'девʼять'],
  teens: ['десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', 'пʼятнадцять', 'шістнадцять', 'сімнадцять', 'вісімнадцять', 'девʼятнадцять'],
  tens: ['', 'десять', 'двадцять', 'тридцять', 'сорок', 'пʼятдесят', 'шістдесят', 'сімдесят', 'вісімдесят', 'девʼяносто'],
  hundreds: ['', 'сто', 'двісті', 'триста', 'чотириста', 'пʼятсот', 'шістсот', 'сімсот', 'вісімсот', 'девʼятсот'],
};

const scales = [
  { words: 'тисяча|тисячі|тисяч', isFemale: true },
  { words: 'мільйон|мільйони|мільйонів' },
  { words: 'мільярд|мільярди|мільярдів' },
  { words: 'трильйон|трильйони|трильйонів' },
];

const currency = {
  hrn: 'гривня|гривні|гривень',
  kop: 'копійка|копійки|копійок',
};

//* ВЫБОР СЛОВОФОРМЫ
const getWordForm = (num, forms) => {
  const lastDigit = num % 10;
  const secondLastDigit = Math.floor((num % 100) / 10);
  
  if (secondLastDigit === 1) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
};

//* ПРЕОБРАЗОВАНИЕ ТРЕХ ЦИФР В СЛОВА
const threeDigitsToWords = (num, isFemale = false) => {
  const [hundreds, tens, units] = String(num).padStart(3, '0').split('').map(Number);

  const words = [
    wordsMap.hundreds[hundreds],
    tens === 1 ? wordsMap.teens[units] : wordsMap.tens[tens],
    tens !== 1 ? (isFemale ? wordsMap.unitsFem[units] : wordsMap.units[units]) : ''
  ];

  return words.filter(Boolean).join(' ');
};

//* ПРЕОБРАЗОВАНИЕ ЧИСЛА В СЛОВА
const numToWords = (num) => {
  if (num === 0) return 'нуль';
  if (num < 0) return `мінус ${numToWords(Math.abs(num))}`;

  const parts = String(num).split('').reverse().join('').match(/.{1,3}/g).reverse();
  const words = [];

  parts.forEach((part, index) => {
    if (+part === 0) return;
    const scale = scales[index - 1];
    const isFemale = scale?.isFemale;
    const word = threeDigitsToWords(part, isFemale);

    words.push(word);
    if (scale) words.push(getWordForm(+part, scale.words.split('|')));
  });

  return words.join(' ');
};

//* ОБРАБОТКА ВАЛЮТЫ
const numToCurrencyWords = (value) => {
  const [hrn, kop] = value.toFixed(2).split('.').map(Number);

  const hrnWords = `${numToWords(hrn)} ${getWordForm(hrn, currency.hrn.split('|'))}`;
  const kopWords = `${numToWords(kop)} ${getWordForm(kop, currency.kop.split('|'))}`;

  return `${hrnWords} ${kopWords}`;
};

//* ТЕСТИРОВАНИЕ
console.log(numToCurrencyWords(-111563.04)); // мінус сто одинадцять тисяч пʼятсот шістдесят три гривні чотири копійки
console.log(numToCurrencyWords(123456789.99)); // сто двадцять три мільйони чотириста пʼятдесят шість тисяч сімсот вісімдесят девʼять гривень девʼяносто девʼять копійок
console.log(numToCurrencyWords(1001.01)); // одна тисяча одна гривня одна копійка
console.log(numToCurrencyWords(0.25)); // нуль гривень двадцять пʼять копійок