var consign = require('consign');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.set('view engine', 'html');
app.use(express.static(__dirname + '/app/views'));

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

consign({cwd: 'app'})
    .include('routes')
    .into(app);

app.listen(3000, function(){
    console.log('Eu o maior, o melhor e mais lindo');
})