import _ from 'lodash';
import rimraf from 'rimraf';
import fs from 'fs';
import caolan from 'async';
import * as Utils from './utils';
import config from './config';

const loadWeb = async id => {
  console.log(`Crawling page ${id}`);
  const url = `${config.BASE_URL}/?page=${id}`;
  const $ = await Utils.loadUrl(url);
  if (!$) return null;
  const searchResults = $('.search-results');
  searchResults.each(async (i, element) => {
    const el = $(element);
    const link = el.children('a').attr('href');
    const page = await Utils.loadUrl(link);
    Utils.parsePage(i, page);
  });
  return 0;
};

const crawler = async () => {
  rimraf(config.IMG_DIST_PATH, err => {
    if (err) console.log(err);
  });
  fs.writeFileSync(config.DB_PATH, '', err => {
    if (err) console.log(err);
  });

  const recursive = id => {
    const parallelAsync = [];
    for (let i = 0; i < config.MAX_CONNECT; i += 1) {
      parallelAsync.push(loadWeb(id + i));
    }
    Promise.all(parallelAsync)
      .then(() => {
        recursive(id + config.MAX_CONNECT);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // const recursive = id => {
  //   console.log('id:', id);
  //   if (id > config.MAX_PAGE) return;
  //   let currentId = id;
  //   let finished = 0;
  //   let next = false;
  //   for (let i = 1; i <= config.MAX_CONNECT; i += 1) {
  //     if (currentId > config.MAX_PAGE) return;
  //     console.log(`Crawling page ${currentId}`);
  //     loadWeb(url)
  //       .then(() => {
  //         finished += 1;
  //         if (finished >= config.MAX_CONNECT - 5 && !next) {
  //           next = true;
  //           recursive(currentId);
  //         }
  //       })
  //       .catch(e => {
  //         console.log(e);
  //       });
  //     currentId += 1;
  //   }
  // };

  recursive(1);
};

crawler();

// loadWeb()
//   .then(() => {
//     // console.log(response);
//   })
//   .catch(e => {
//     throw e;
//   });
