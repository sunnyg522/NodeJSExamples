let fs = require('fs')
let path = require('path')
let express = require('express')
let morgan = require('morgan')
let nodeify = require('bluebird-nodeify')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
let bluebird = require('bluebird')
bluebird.longStackTraces()

require('songbird')

const NODE_ENV= process.env.NODE_ENV
const PORT = process.PORT || 8000
const ROOT_DIR = path.resolve(process.cwd())

let app = express()

if(NODE_ENV=='development')
{
  app.use(mogran('dev'))
}
app.listen(PORT, ()=> console.log('LISTENING @ htpp://127.0.0.1:${PORT}'))
app.get('*',setFileMeta,sendHeaders, (req, res)=>{
  if(res.body)
  {
    res.json(res.body)
    return
  }
    fs.createReadStream(filePath).pipe(res)
})
app.head('*',setFileMeta,sendHeaders, (req, res)=>res.end())

app.put('*', setFileMeta,setDirDetails,(req, res, next)=>
{
  async()=>{
    if(req.stat)return res.status(405).send('File exists')
    await mkdirp.promise(req.dirPath)
    if(!req.isDir) req.pipe(fs.createWriteStream(req.filePath))
    res.end()
  }().catch(next)
})
app.post('*', setFileMeta,setDirDetails,(req, res, next)=>
{
  async()=>{
    if(!req.stat)return res.status(405).send('File dosenot exists')
    if(req.isDir)return res.status(405).send('Path is a Directory')

    await fs.promise.truncate(req.filePath, 0)
    req.pipe(fs.createWriteStream(req.filePath))
    res.end()
  }().catch(next)
})
function setDirDetails(req,res,next)
{

  let filePath = req.filePath
  let endsWithSlash = filePath.charAt(filePath.length-1) === path.sep
  let hasExt = path.extname(filePath)!==''
  req.isDir = endsWithSlash || !hasExt
  req.dirPath = req.isDir ? filePath : path.dirname(filePath)
  next()
}

app.delete('*',setFileMeta, (req,res,next)=>{
  async()=>{
    if(!req.stat) return res.status(400).send('Invalid path')
    if(req.stat.isDirectory())
    {
      await rimraf.promise(req.filePath)
    }else fs.promise.unlink(req.filePath)
    res.end()
  }().catch(next)
})



function setFileMeta(req, res, next){
  req.filePath = path.resolve(path.join(ROOT_DIR,req.url))
  if(req.filePath.indexOf(ROOT_DIR)!==0)
  {
    res.send(400,'Invalid Path')
    return
  }
  fs.promise.stat(req.filePath)
    .then(stat => req.stat = stat, ()=>req.stat = null)
    .nodeify(next)
}

function sendHeaders(req, res, next)
{
  nodeify(async()=>{
    let filePath = req.filePath

  let stat = req.stat
  if(stat.isDirectory())
  {
    let files = await fs.promise.readdir(filePath)
    res.body = JSON.stringify(files.length)
    res.setHeader('Content-Length', res.body.length)
    res.setHeader('Content-Type', 'application/json')
    return
  }

  res.setHeader('Content-Length', stat.size)
  let contentType = mime.contentType(path.extname(filePath))

}(),next)
}
