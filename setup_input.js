const got = require('got');
const fs = require('fs');
const unzip = require('unzip-stream');
const { Iconv } = require('iconv');

async function generate() {
  const iconv = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');
  got
    .stream('https://www.post.japanpost.jp/zipcode/dl/roman/ken_all_rome.zip')
    .pipe(unzip.Parse())
    .on('entry', (entry) => {
      // There's only one file in the zip archive
      entry
        .pipe(iconv)
        .pipe(fs.createWriteStream('./input/zipcodes.csv'));
    });
}

if (require.main === module) {
  generate();
}
