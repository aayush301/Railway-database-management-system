const express= require('express');
const con= require('../dbService');
const router=express.Router();


router.get('/', async function(req,res) {

    const query=`select train_id, train_name, s1.station_name as src_name, s2.station_name as dest_name,train_type from train,station s1,station s2 where train.src_id=s1.station_id and train.dest_id=s2.station_id order by train_id`;
    const result=await new Promise(function(resolve,reject){
        con.query(query, function(err,res){
            resolve(res);
        });
    });
    res.render('trains',{
        trains: result,
    });

});

router.get('/add', async function(req,res){
   
    const query1=`select station_id,station_name from station order by station_name asc`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });
    
    const query2=`select train_id from train`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });

    res.render('addTrain',{
        stations:result1,
        trains:result2
    });

});


router.post('/add', function(req,res){

    const id=req.body.id;
    const name=req.body.name;
    const src=req.body.src;
    const dest=req.body.dest;
    const seats=req.body.seats;
    const ttype=req.body.ttype;

    const query=`insert into train values (?,?,?,?,?,?)`;
    con.query(query, [id,name,src,dest,seats,ttype], function(err,result){
        if(err)throw err;
    });

    res.redirect('/trains');
    
});



router.get('/search', async function(req,res) {
    
    const train_info=req.query.train_info;
    var src=req.query.src;
    var dest=req.query.dest;
    const ttype=req.query.ttype;

    const query=`select train_id, train_name, s1.station_name as src_name, s2.station_name as dest_name,train_type from train,station s1,station s2 where train.src_id=s1.station_id and train.dest_id=s2.station_id order by train_id`;
    var result=await new Promise(function(resolve,reject){
        con.query(query, function(err,res){
            resolve(res);
        });
    });

    if(train_info.length>0)
    {    
        if(train_info[0]>='0' && train_info[0]<='9')
            result=result.filter(train=>train.train_id==train_info);            
        else
            result=result.filter(train=>train.train_name.toLowerCase().includes(train_info.toLowerCase()));
    }

    if(src.length>0)
        result=result.filter(train=>train.src_name.toLowerCase().includes(src.toLowerCase()));
    
    if(dest.length>0)
        result=result.filter(train=>train.dest_name.toLowerCase().includes(dest.toLowerCase()));
    
    if(ttype!='All types')
        result=result.filter(train=>train.train_type==ttype);

    res.render('trains',{
        trains: result,
    });

});


router.get('/:id/view', async function(req,res) {
    
    const query1=`select* from train where train_id='${req.params.id}'`;
    const result1= await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });
    const train=result1[0];
    
    const query2= `select station_name from station where station_id=${result1[0].src_id}`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });
    train.src_name=result2[0].station_name;

    const query3= `select station_name from station where station_id=${result1[0].dest_id}`;
    const result3=await new Promise(function(resolve,reject){
        con.query(query3, function(err,res){
            resolve(res);
        });
    });
    train.dest_name=result3[0].station_name;

    const query4=`select timetable_id, station_id, station_name, time_format(arrival_time,'%H:%i') as arrival_time, time_format(departure_time,'%H:%i') as departure_time from timetable natural join station where train_id=${req.params.id} order by timetable_id`;
    const result4=await new Promise(function(resolve,reject){
        con.query(query4, function(err,res){
            resolve(res);
        });
    });

    var sum=0;
    for(var i=0;i<result4.length-1;i++)
    {
        const query5=`select* from route where station_id=${result4[i].station_id} and next_station_id=${result4[i+1].station_id} or station_id=${result4[i+1].station_id} and next_station_id=${result4[i].station_id}`;
        const result5=await new Promise(function(resolve,reject){
            con.query(query5, function(err,res){
                resolve(res);
            });
        });
        if(result5.length!=0)
            sum+=result5[0].distance;
    }

    res.render('train',{
        train:train,
        totalLength: sum.toFixed(2),
        schedule: result4
    });

});


router.get('/:id/edit', function(req,res) {
    const query1=`select* from train where train_id='${req.params.id}';`;
    const query2=`select station_id,station_name from station order by station_name asc;`;
    const query3=`select train_id from train`;
    con.query(query1+query2+query3, function(err,results){
        if(err)throw err;
        res.render('editTrain',{
            train: results[0][0],
            stations: results[1],
            trains: results[2]
        });
    });
});


router.post('/update', function(req,res){
    const id=req.body.new_id;
    const name=req.body.name;
    const src=req.body.src;
    const dest=req.body.dest;
    const seats=req.body.seats;
    const ttype=req.body.ttype;

    const query=`update train set train_id=?,train_name=?,src_id=?,dest_id=?,total_seats=?,train_type=? where train_id=${req.query.old_id}`;
    con.query(query, [id,name,src,dest,seats,ttype], function(err,result){
        if(err)throw err;
    });
    res.redirect('/trains/'+id+'/view');
});


router.get('/delete', async function(req,res) {
    
    const query1=`delete from timetable where train_id=${req.query.id}`;
    const result1=await new Promise(function(resolve,reject){
        con.query(query1, function(err,res){
            resolve(res);
        });
    });

    const query2=`delete from train where train_id=${req.query.id}`;
    const result2=await new Promise(function(resolve,reject){
        con.query(query2, function(err,res){
            resolve(res);
        });
    });
    
    res.redirect('/trains');

});


module.exports=router;