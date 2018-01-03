import cheerio from 'cheerio';
import axios from 'axios';
import base64Img from 'base64-img';
import randomString from 'randomstring';
import db from './db';
import config from './config';

export const loadUrl = async url => {
  try {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  } catch (e) {
    return null;
  }
};

export const parsePage = (id, page) => {
  const jumbotron = page('.jumbotron').first();
  const text = jumbotron.text();
  // const title = texts[1].trim();
  // const address = texts[4].trim();
  // const moreInfo = texts[5].trim().split(/\s{2,}/);
  // const legalRepresentative = moreInfo[0].substr(20);

  // // fs.writeFile(`${__dirname}/address.txt`, texts[5].trim(), () => {});
  // console.log(title, legalRepresentative);

  // console.log(text);

  const imgs = jumbotron.find('img');
  let taxCode;
  let phoneNumber;
  imgs.each((i, img) => {
    // console.log(i, cheerio(img).attr('src'));
    if (i === 0) {
      taxCode = randomString.generate();
      return base64Img.imgSync(
        cheerio(img).attr('src'),
        config.IMG_DIST_PATH,
        taxCode,
      );
    }
    phoneNumber = randomString.generate();
    return base64Img.imgSync(
      cheerio(img).attr('src'),
      config.IMG_DIST_PATH,
      phoneNumber,
    );
  });
  const document = { text, taxCode };
  if (phoneNumber) {
    document.phoneNumber = phoneNumber;
  }
  db.insert(document);
  return page;
};
