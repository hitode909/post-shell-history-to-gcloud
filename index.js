exports.accept = (req, res) => {
  let apiKey = req.query.apikey;
  if (apiKey !== process.env.APIKEY) {
    res.status(401).send('apiKey required');
    return;
  }

  const datastore = require('@google-cloud/datastore')({
    projectId: 'shell-history',
  });

  if (req.method === 'POST') {
    const key = datastore.key('History');
    const data = [];
    req.body.timestamp = new Date();
    Object.keys(req.body).forEach(key => {
      data.push({
        name: key,
        value: req.body[key],
      });
    });
    const entity = {
      key: key,
      data: req.body,
    };
    datastore.save(entity).then(() => {
      res.status(200).send(key.id);
    })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }
  if (req.method === 'GET') {
    req.param
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
};
