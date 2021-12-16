const { nanoid } = require('nanoid')

const userRoutes = (app, fs) => {
    const dataPath = './data/users.json';

    const readFile = (
      callback,
      returnJson = false,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
          throw err;
        }
  
        callback(returnJson ? JSON.parse(data) : data);
      });
    };
  
    const writeFile = (
      fileData,
      callback,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.writeFile(filePath, fileData, encoding, err => {
        if (err) {
          throw err;
        }
  
        callback();
      });
    };
    
    app.get('/users', (req, res) => {
      readFile(data => {
        res.send(data);
      }, true);
    });
  
    app.post('/users', (req, res) => {
      readFile(data => {
        const newUserId = nanoid();
        data[newUserId] = req.body;
    
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send('new user added');
        });
      }, true);
    });
    
    app.put('/users/:id', (req, res) => {
      readFile(data => {
        const userId = req.params['id'];

        if(!data[userId]) {
          res.status(400).send(`users id:${userId} not found`)
          return
        }
        
        data[userId] = req.body;

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`users id:${userId} updated`);
        });
      }, true);
    });

  };  
  
module.exports = userRoutes;