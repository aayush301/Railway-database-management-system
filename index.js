const express= require('express');
const app=express();
const bodyParser= require("body-parser");
const path=require('path');
const hbs=require("hbs");
const con = require('./dbService');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname,"/views/partials"));


app.get('/', function(req,res){
    res.render('login');
});

app.post('/login', function (req,res) {
    const username=req.body.name;
    const password=req.body.password;
    const query="select* from admin where username=? and binary password=?";
    
    con.query(query,[username,password], function (err,result) {
        if(err) throw err;
        if(result.length==0)
        {
            res.render('login',{
                error:true
            });
        }
        else
            res.redirect('/trains');

    });
});

app.use('/trains', require('./routes/trains'));
app.use('/stations', require('./routes/stations'));
app.use('/routes', require('./routes/routes'));
app.use('/employees', require('./routes/employees'));
app.use('/timetable', require('./routes/timetable'));


app.listen(8080, function(){
    console.log("app is running");
});