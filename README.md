## List of Japanese zipcode

The list of Japanese zipcodes (post codes) is generated from the [post website](https://www.post.japanpost.jp/zipcode/dl/roman-zip.html) and exported as JSON, UTF-8.

### Usage

Just grab the file `codes.json` it has a list of objects with the structure


```json
{
  "code": "1631301",
  "pref_ja": "東京都",
  "city_ja": "新宿区",
  "area_ja": "西新宿　新宿アイランドタワー（１階）",
  "pref_en": "Tokyo To",
  "city_en": "Shinjuku Ku",
  "area_en": "Nishishinjuku shinjuku airandotawa (floor 1)"
}
```

Turns out that the post office trims the area description to 68 bytes, which is roughly 34 characters in Latin alphabets, 17 in full-width Japanese. Some effort was put in place to correct the most obvious mistakes due to trimming, but many are still left.
Also the names in romaji are a simple transliteration of the phonetic names, don't expect those to be very accurate either.

Prefecture and city name seems to be fairly accurate.
 

## Related links

More [open data repositories](https://github.com/piuccio?utf8=%E2%9C%93&tab=repositories&q=open-data-jp&type=&language=).
