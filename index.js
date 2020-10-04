var express = require('express');
var app = express();
app.set('view engine', 'pug');
app.set('views','./views');

app.get('/', function(req, res){
   res.send("Hello world Pritam Mishra!");
});
app.get('/x', function(req, res){
   res.render('first_view', {
      name: "TutorialsPoint", 
      url:"http://www.tutorialspoint.com"
   });
});
app.get('*', function(req, res){
   res.send("Unavailable");
});


app.listen(3000);