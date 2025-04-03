const wordsMap = {
  uns: {
    1: '',
    2: '',
    3: 'три',
    4: 'чотири',
    5: 'пʼять',
    6: 'шість',
    7: 'сім',
    8: 'вісім',
    9: 'девʼять',
  },
  tns: {
    1: 'десять',
    2: 'двадцять',
    3: 'тридцять',
    4: 'сорок',
    5: 'пʼятдесят',
    6: 'шістдесят',
    7: 'сімдесят',
    8: 'вісімдесят',
    9: 'девʼяносто',
    11: 'одинадцять',
    12: 'дванадцять',
    13: 'тринадцять',
    14: 'чотирнадцять',
    15: 'пʼятнадцять',
    16: 'шістнадцять',
    17: 'сімнадцять',
    18: 'вісімнядцять',
    19: 'девʼятнадцять',
  },
  hndrs: {
    1: 'сто',
    2: 'двісті',
    3: 'триста',
    4: 'чотириста',
    5: 'пʼятсот',
    6: 'шістсот',
    7: 'сімсот',
    8: 'вісімсот',
    9: 'девʼятсот',
  },
};

//* КОНСТАНТИ І СЛОВНИКИ
const MIN_FRACTION_DIGITS = 2;
const MAX_FRACTION_DIGITS = 2;

const ONE = 1;
const VALUE_FROM = 2;
const VALUE_TO = 4;

const { uns, tns, hndrs } = wordsMap;

const selectWords = [
  { 0: false, l_words: '' },
  { 0: false, l_words: 'тисяча|тисячі|тисяч' },
  { 0: true, l_words: 'мільйон|мільйони|мільйонів' },
  { 0: true, l_words: 'мільярд|мільярди|мільярдів' },
  { 0: true, l_words: 'трильйон|трильйони|трильйонів' },
];

const cashName = {
  kop: 'копійка|копійки|копійок',
  hrn: 'гривня|гривні|гривень',
};

//* ГОЛОВНА ФУНКЦІЯ
const amountInWords = value => {
  const minus = value < 0 ? 'мінус ' : '';
  const fullValue = value.toLocaleString('en-us', {
    minimumFractionDigits: MIN_FRACTION_DIGITS,
    maximumFractionDigits: MAX_FRACTION_DIGITS,
  });

  let [hrn, kop] = fullValue.split('.');

  return `${minus}${numSplit(hrn, cashName.hrn)} ${numSplit(kop, cashName.kop)}`;
};

//* УМОВИ РОЗДІЛУ СЛІВ
const wordProv = (value, words) => {
  const choice = words.split('|');
  return value == ONE ? choice[0] : value >= VALUE_FROM && value <= VALUE_TO ? choice[1] : choice[2];
};

//* РОБОТА НАД ЧИСЛОВИМИ ГРУПАМИ
const wordSplit = (value, words) => {
  let [u, t, h] = value.split('').reverse();
  const result = [];

  h && result.push(hndrs[h]);

  t == 1 && u > 0 ? (result.push(tns[t + u]), (u = '')) : result.push(tns[t], uns[u]);
  result.push(wordProv(u, words));
  return result;
};

//* ФУНКЦІЯ СКЛЕЙКИ СЛІВ
const numSplit = (value, cashType) => {
  if (value == 0) return `нуль ${cashType.split('|')[2]}`;

  const words = [];
  const numGroups = value.split(',').reverse();
  selectWords[0].l_words = cashType;

  numGroups.forEach((numbers, index) => {
    if (numbers == '000') return;

    const wordsArr = selectWords[index];
    uns[1] = wordsArr[0] ? 'один' : 'одна';
    uns[2] = wordsArr[0] ? 'два' : 'дві';

    words.push(wordSplit(numbers, wordsArr.l_words));
  });

  return words
    .reverse()
    .flat()
    .filter(w => w)
    .join(' ');
};

console.log('Сума:', amountInWords(12345.99));

//! module.exports = amountInWords;
// module.exports = wordProv;
// module.exports = wordSplit;
// module.exports = numSplit;
