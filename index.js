const got = require('got');
const fs = require('fs');
const util = require('util');
const csv = require('csv-parse');
const capitalize = require('capitalize');

const CSV_OPTIONS = {
  columns: ['code', 'pref_ja', 'city_ja', 'area_ja', 'pref_en', 'city_en', 'area_en'],
};

const FLOOR_EN = /\((\d+)-K?A?I?\)?$/; // some descriptions are trimmed
const INCOMPLETE_FLOOR_EN = /\(\d*$/; // the number might not even be complete
const FLOOR_JA = /（([０-９]+階)）?$/; // truncated on the last bracket
// To convert nunmbers, full width 1 is x, shift to char code of 1 normal width
const SHIFT_NUMBERS = 65297 - 49;

async function readCsv(filePath, transform = (x) => x) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath).pipe(csv(CSV_OPTIONS, (err, data) => {
      if (err) reject(err);
      else resolve(transform(data));
    }));
  });
}

async function generate() {
  let invalid = 0;
  const codes = await readCsv('./input/zipcodes.csv');
  const data = codes.map((data) => {
    const areaJa = data.area_ja.replace(FLOOR_JA, '（$1）');
    let areaEn = data.area_en.replace(FLOOR_EN, ' (floor $1)');
    if (areaEn.includes('(') && !areaEn.includes(')')) {
      const jaFloor = data.area_ja.match(FLOOR_JA);
      if (jaFloor && INCOMPLETE_FLOOR_EN.test(areaEn)) {
        areaEn = areaEn.replace(INCOMPLETE_FLOOR_EN, ` (floor ${toNumber(jaFloor[1])})`);
      } else {
        invalid += 1;
        // just remove the last open bracket
        areaEn = areaEn.substring(0, areaEn.lastIndexOf('('));
      }
    }

    return {
      code: data.code,
      // Japanese
      pref_ja: data.pref_ja,
      city_ja: data.city_ja,
      area_ja: areaJa,
      // English
      pref_en: capitalize.words(data.pref_en.toLowerCase()),
      city_en: capitalize.words(data.city_en.toLowerCase()),
      area_en: capitalize(areaEn.toLowerCase()),
    }
  });
  console.log(`Processed ${data.length} zipcodes, ${invalid} seems to be invalid`);
  return util.promisify(fs.writeFile)('./codes.json', JSON.stringify(data, null, '  '));
}

function toHalfWidth(string) {
  return string.replace(/[０-９]/g, (num) => String.fromCharCode(num.charCodeAt(0) - SHIFT_NUMBERS));
}

function toNumber(string) {
  return parseInt(toHalfWidth(string), 10);
}

if (require.main === module) {
  generate();
}
