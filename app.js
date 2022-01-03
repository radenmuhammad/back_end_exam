const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const express_config = require('express');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile);
const appRoute = require('./src/routes/route-loginapp');
app.use('/', appRoute);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8080, ()=>{
    console.log('Server Berjalan di Port : 8080');
});