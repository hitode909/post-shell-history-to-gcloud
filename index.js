async function doPost(req, res) {
  const datastore = require('@google-cloud/datastore')();

  const entityToSave = createEntityToSave(datastore, req);

  const q = datastore.createQuery('History').order('timestamp', { descending: true, }).filter('pwd', '=', req.body.pwd);
  const knownCommands = {};
  knownCommands[req.body.command] = true;
  q.run(function (err, entities, info) {
    const keysToDelete = [];
    for (const entity of entities) {
      if (knownCommands[entity.command]) {
        keysToDelete.push(entity[datastore.KEY]);
        console.log(entity);
      }
      knownCommands[entity.command] = true;
      if (keysToDelete.length > 10) {
        break;
      }
    }
    console.log(keysToDelete);

    const transaction = datastore.transaction();
    transaction.run((error) => {
      if (error) {
        console.log(error);
        res.status(500).send(err);
        return;
      }
      console.log(`delete ${keysToDelete.length} items`);
      transaction.delete(keysToDelete);
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

async function doGet(req, res) {
  const datastore = require('@google-cloud/datastore')();

  let q = datastore.createQuery('History').order('timestamp', { descending: true, });
  const pwd = req.query.pwd;
  if (pwd) {
    q = q.filter('pwd', '=', pwd);
  }
  const data = await q.run();
  const entities = data[0];
  res.status(200).send(entities);
}

exports.accept = async (req, res) => {
  let apiKey = req.query.apikey;
  if (apiKey !== process.env.APIKEY) {
    res.status(401).send('apiKey required');
    return;
  }

  if (req.method === 'POST') {
    return await doPost(req, res);
  }
  if (req.method === 'GET') {
    return await doGet(req, res);
  }
};
