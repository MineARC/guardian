var db = require('./database');

// db.addUser('mitchell', 'password', 'a@a.a');

console.log(db.compareUsersPassword('mitchell', 'password'));