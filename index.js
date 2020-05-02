function doPost(req, res) {
  const datastore = require('@google-cloud/datastore')();

  const entityToSave = createEntityToSave(datastore, req);

  const q = datastore.createQuery('History').filter('pwd', '=', req.body.pwd).filter('command', '=', req.body.command).select('__key__');
  q.run(function (err, entities, info) {
    const keys = entities.map((entity) => {
      return entity[datastore.KEY];
    });
    console.log(keys);

    const transaction = datastore.transaction();
    transaction.run((error) => {
      if (error) {
        console.log(error);
        res.status(500).send(err);
        return;
      }
      transaction.delete(keys);
      transaction.save(entityToSave);
      transaction.commit((err) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
          return;
        }
        res.status(200).send('OK');
      });
    });
  });
}

function createEntityToSave(datastore, req) {
  const key = datastore.key('History');
  return {
    key: key,
    data: {
      timestamp: new Date(),
      pwd: req.body.pwd,
      command: req.body.command,
    },
  };
}

function doGet(req, res) {
  const datastore = require('@google-cloud/datastore')();

  let q = datastore.createQuery('History').order('timestamp', { descending: true, });
  const pwd = req.query.pwd;
  if (pwd) {
    q = q.filter('pwd', '=', pwd);
  }
  q.run(function (err, entities, info) {
    console.log(err);
    res.status(200).send(entities);
  });
}

exports.accept = async (req, res) => {
  let apiKey = req.query.apikey;
  if (apiKey !== process.env.APIKEY) {
    res.status(401).send('apiKey required');
    return;
  }

  if (req.method === 'POST') {
    return doPost(req, res);
  }
  if (req.method === 'GET') {
    doGet(req, res);
  }
};
