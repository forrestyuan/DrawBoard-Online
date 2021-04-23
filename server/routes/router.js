const router = require('express').Router();
const path = require('path');
router
  .get('/',(req, res)=>{
    res.sendFile(path.resolve(__dirname,'dist/index.html'))
  })
  .get('/test', (req, res) =>{
    res.send("<p>Hi, you test me, maybe you have loved me !!!</p>")
  })
  .get('/api',(req, res)=>{
    res.send("<h2>you request the api interface</h2>")
  })

module.exports = router;