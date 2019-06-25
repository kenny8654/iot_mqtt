var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
// view engine 
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port' , process.env.PORT || 80 );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getTxt',function(req,res){
   fs.readFile('./public/data/Team1.txt', function (err, data) {
      if (err) throw err;
      //console.log(data.toString());
      var lines = data.toString().split("\n");
      var r = ""
      for(var line in lines){
         if(line >= lines.length -51){
	   if(lines[line]!=""&&lines[line]!="\n"){
	       //console.log(lines.length - line + "  " + lines[line]);
	       r += lines[line] +"\n"
	    }
	 }
	 
      }
      //console.log(r)
      res.send(r)
      res.end()
   }); 
   //res.sendStatus(200);
});


//app.use('/',(req, res)=>{
//res.render('index')
//})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
});


module.exports = app;
