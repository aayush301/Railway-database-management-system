const express= require('express');
const con= require('../dbService');
const router=express.Router();



router.get('/add', function(req,res){
   
    const query1=`select train_id,train_name from train order by train_name asc;`;
    const query2=`select station_id,station_name from station order by station_name asc`;
    con.query(query1+query2, function(err,results){
        if(err) throw err;
        res.render('addTimeTable',{
            trains:results[0],
            stations:results[1]
        });
    });

});


router.post('/add', function(req,res){
    
    const train_id=req.body.train;
    const num=req.query.num;

    for(i=1;i<=num;i++)
    {
        const id=req.body['id'+i];
        const station_id=req.body['station'+i];
        const arrival=req.body['arrival'+i];
        const departure=req.body['departure'+i];
        var query;
        if(arrival && departure)
            query=`insert into timetable values (${id},${train_id},${station_id},'${arrival}','${departure}')`;
        else if(!arrival)
            query=`insert into timetable values (${id},${train_id},${station_id},null,'${departure}')`;
        else
            query=`insert into timetable values (${id},${train_id},${station_id},'${arrival}',null)`;
        con.query(query, function(err,result){
            if(err)throw err;
            
        });
    }

    res.redirect('/trains');

});


module.exports=router;