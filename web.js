var http = require('http');
var express = require('express'),
    pub = __dirname + '/static/',
    views = __dirname + '/views',
    html2jade;

try {
    html2jade = require('html2jade');
} catch (err) {
    console.log('Failure to load \'html2jade\' module');
    html2jade = require('./node_modules/html2jade/lib/html2jade')
}

var app = express();

app.configure(function () {
  app.use(express.compress());
  app.enable('trust proxy');
  app.disable('x-powered-by');
  app.set('views', __dirname + '/views');
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(pub));
  app.use(express.errorHandler());
});

app.post('/convert', function (req, res) {
    var html = req.body.html;

    html2jade.convertHtml(html, {}, function (err, jade) {
        res.json({ jade: jade });
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

var ip = process.env.IP || '0.0.0.0';
var port = process.env.PORT || 80;
http.createServer(app).listen(port, ip, function () {
  console.log("Express server listening on port " + ip + ':'+ port + '. Node version: '+ process.version);
});