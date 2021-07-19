const mysql= require('mysql');
require('dotenv').config();

const con= mysql.createConnection(
    {
        host:process.env.host,
        user:process.env.user,
        password:process.env.password,
        database:process.env.database,
        port:process.env.port,
        multipleStatements:true
    }
);

con.connect(function(){
    console.log('db '+ con.state);
})

// Tables used in MySQL
// 1. admin
// 2. employee
// 3. station
// 4. train
// 5. route
// 6. timetable

const query1='create table if not exists admin(username varchar(50), password varchar(30))';
con.query(query1, function (err) {
    if(err) throw err;
});

const query2=`create table if not exists employee(
    employee_id int primary key,
    employee_name varchar(50) not null
)`;
con.query(query2, function (err) {
    if(err) throw err;
});

const query3=`create table if not exists station(
    station_id int primary key,
    station_name varchar(50) not null,
    station_address varchar(100),
    station_city varchar(20),
    station_state varchar(20),
    station_master_id int,
    foreign key(station_master_id) references employee(employee_id)
)`;
con.query(query3, function (err) {
    if(err) throw err;
});

const query4=`create table if not exists train(
    train_id int primary key,
    train_name varchar(50) not null,
    src_id int,
    dest_id int,
    total_seats int,
    train_type varchar(20),
    foreign key(src_id) references station(station_id),
    foreign key(dest_id) references station(station_id)
)`;
con.query(query4, function (err) {
    if(err) throw err;
});

const query5=`create table if not exists route(
    route_id int primary key,
    station_id int not null,
    next_station_id int not null,
    distance float,
    foreign key(station_id) references station(station_id),
    foreign key(next_station_id) references station(station_id)
)`;
con.query(query5, function (err) {
    if(err) throw err;
});

const query6=`create table if not exists timetable(
    timetable_id int primary key,
    train_id int not null,
    station_id int not null,
    arrival_time time,
    departure_time time,
    foreign key(train_id) references train(train_id),
    foreign key(station_id) references station(station_id)
)`;
con.query(query6, function (err) {
    if(err) throw err;
});



module.exports= con;