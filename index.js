function doPost(req, res) {
  const datastore = require('@google-cloud/datastore')();

  const entityToSave = createEntityToSave(datastore, req);
  datastore.save(entityToSave).then(() => {
    res.status(200).send('OK');
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
}

function createEntityToSave(datastore, req) {
  const key = datastore.key('History');
  const data = [];
  req.body.timestamp = new Date();
  Object.keys(req.body).forEach(key => {
    data.push({
      name: key,
      value: req.body[key],
    });
  });
  return {
    key: key,
    data: req.body,
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
