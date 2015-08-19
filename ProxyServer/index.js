let http = require('http')
let request = require('request')
let argv = require('yargs')
  .default('host', '127.0.0.1')
  .argvs
let scheme = 'http://'
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = scheme+argv.host + ':' + port

http.createServer((req, res)=>
{
  for(let header in req.headers)
  {
    res.setHeader(header, req.headers[header])
  }
  req.pipe(res)
}).listen(8000)
console.log('listening at 8000')

http.createServer((req, res)=>{
  let options = {
    headers: req.headers,
    url:destinationUrl
  }
  req.pipe(request(options)).pipe(res)
}).listen(8001)
