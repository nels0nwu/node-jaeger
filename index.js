routethis = require('./routethis.js');

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hello', (req, res) => {
  res.send('hello back!')
})

app.get('/request', (req, res) => {
  const target = process.env.TARGET_PATH || 'test';
  const hostname = process.env.TARGET_HOST || 'localhost';
  const port = process.env.TARGET_PORT || 3000;
  console.log(`Request headers: ${req.headers}`);



  res.send('make a request!');
  console.log(`make a request to ${hostname}:${port}/${target}`);
  const http = require('http')
  const options = {
    hostname,
    port,
    path: `/${target}`,
    method: 'GET'
  }

  const getrequest = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  getrequest.on('error', error => {
    console.error(error)
  })

  getrequest.end()
})

app.get('/test', (req, res) => {
  console.log(req.headers);
  res.send('testing')
})

app.get('/error', (req, res) => {
  console.log(req.headers);
  res.status(500).send('Something broke!')
})

app.use('/routethis', routethis);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
