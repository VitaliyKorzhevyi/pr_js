const objWords = {
  o: {
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
  t: {
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
  h: {
    1: 'сто',
    2: 'двісті',
    3: 'триста',
    4: 'чотириста',
    5: 'пятсот',
    6: 'шістсот',
    7: 'сімсот',
    8: 'вісімсот',
    9: 'девʼятсот',
  },
};

const searchArr = [
  { 0: false, words: [], l_words: '' },
  {
    0: false,
    words: [],
    l_words: 'тисяча|тисячі|тисяч',
  },
  {
    0: true,
    words: [],
    l_words: 'мільйон|мільйони|мільйонів',
  },
  {
    0: true,
    words: [],
    l_words: 'мільярд|мільярди|мільярдів',
  },
  {
    0: true,
    words: [],
    l_words: 'трильйон|трильйони|трильйонів',
  },
];

const _bName = {
  kop: 'копійка|копійки|копійок',
  hrn: 'гривня|гривні|гривень',
};

//* УМОВИ РОЗДІЛУ СЛІВ
const wordSplit = (v, w) => {
  const _aS = w.split('|');
  return v == 1
    ? _aS[0]
    : v >= 2 && v <= 4
    ? _aS[1]
    : _aS[2];
};

//* УМОВА ДЛЯ СЛІВ ВАЛЮТ

const wordV = (v, w) => {
  let [o, d] = v.slice(-2).split('').reverse();

  const _aS = w.split('|');
  if (d == 1 && o > 0) {
    d = d + o;
    o = '';
  }

  return v == 1
    ? _aS[0]
    : v >= 2 && v <= 4
    ? _aS[1]
    : _aS[2];
};

//* ФУНКЦІЯ ЗШИВАННЯ СЛІВ ТА РЕЗУЛЬТАТУ
function numSplit(value) {
  const result = [];
  const v =
    value < 0
      ? (result.push('мінус'), Math.abs(value))
      : value;
  const fullValue = v.toLocaleString('en-us', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [hrn, kop] = fullValue.split('.');

  result.push(numToWords(hrn));
  result.push(wordV(hrn, _bName.hrn));
  result.push(numToWords(kop));
  result.push(wordV(kop, _bName.kop));

  return `${result.join(' ')}`;
}

//*  ФУНКЦІЯ ЧИСЕЛ
const numToWords = v => {
  if (v == 0) return 'нуль';

  const qArr = v.split(',').reverse();

  qArr.map((n, index) => {
    const wordsArr = searchArr[index].words;

    let [o, d, h] = n.split('').reverse();

    objWords.o[1] = wordsArr[0] ? 'один' : 'одна';
    objWords.o[2] = wordsArr[0] ? 'два' : 'дві';

    if (d == 1 && o > 0) {
      d = d + o;
      o = '';
    }

    if (h) wordsArr.push(objWords.h[h]);
    if (d) wordsArr.push(objWords.d[d]);
    if (o) wordsArr.push(objWords.o[o]);

    const rightWord =
      wordsArr[0] === ''
        ? null
        : wordSplit(o, searchArr[index].l_words);
    wordsArr.push(rightWord);
  });

  const output = searchArr
    .map(item => item.words)
    .reverse()
    .flat()
    .filter(w => w)
    .join(' ');

  searchArr.map(item => (item.words = []));

  return output;
};

console.log('result', numSplit(-111563.04));
