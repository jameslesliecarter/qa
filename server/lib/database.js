const mysql = require('mysql');

class Database {
  constructor( config ) {
    this.connection = mysql.createPool( {
      host: "localhost",
      user: "student",
      password: "student",
      database: "qanda"
    } );
  }
  query( sql, args ) {
    return new Promise( ( resolve, reject ) => {
      this.connection.query( sql, args, ( err, rows ) => {
        if ( err )
          return reject( err );
        resolve( rows );
      } );
    } );
  }
}

module.exports = new Database;
