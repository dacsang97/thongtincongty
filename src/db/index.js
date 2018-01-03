import Datastore from 'nedb';
import config from '../config';

const db = new Datastore({
  filename: config.DB_PATH,
  autoload: true,
});

export default db;
