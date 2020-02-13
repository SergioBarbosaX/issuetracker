/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var   expect       = require('chai').expect;
var   MongoClient  = require('mongodb');
var   ObjectId     = require('mongodb').ObjectID;
const moment       = require('moment');

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query   = req.body;
      
      MongoClient.connect(CONNECTION_STRING)
                 .then ( db => {
                        let dbo = db.db( "issueTracker" );               
                        dbo.collection( "issues").find( query ).toArray()
                            .then ( doc => {
                                res.send( doc );
                             })
                             .catch ( err => console.log(err) );
                 } )
                 .catch ( err => console.log(err) );
                 
    })
    
    .post( (req, res) => {
      const project  = req.params.project;
      let newIssue = {
        issue_title   : req.body.issue_title,
        issue_text    : req.body.issue_text,
        assigned_to   : req.body.assigned_to || '',
        status_text   : req.body.status_text || '',
        created_by    : req.body.created_by,
        open          : true
      };
    
      newIssue.created_on = Date.now();
      newIssue.updated_on = Date.now();
    
      if ((newIssue.issue_title.length > 0) && (newIssue.issue_text.length > 0) && (newIssue.created_by.length > 0)) {
        MongoClient.connect(CONNECTION_STRING)
                   .then ( db => {
                      let dbo = db.db( "issueTracker" );
                      dbo.collection( "issues" ).insertOne( newIssue )
                         .then ( doc => {
                            res.json( doc.ops[0] );
                          } )
                          .catch ( err => console.log(err) );
                      db.close();
                   } )
                   .catch ( err => console.log(err) );
      }
      else
        res.send( '"issue_title", "issue_text" and "created_by" fields must be filled' );
    })
    
    .put(function (req, res){
      const project = req.params.project;
      
      let update = { $set: { } };
      let keys = Object.keys( req.body ).filter( key => key !== '_id' );
      
      keys.forEach((key) => {
        if ( req.body[key] !== '' ) {
          update.$set[key] = req.body[key];
        }
      });
      update.$set['updated_on'] = Date.now(); 
      
            
      if ( Object.entries(req.body).length === 0 )
        res.send( 'no updated field sent' );
      else if (req.body._id !== null && Object.entries(req.body).length >= 2) {
        let query = { _id: ObjectId(req.body._id) };
        
        MongoClient.connect(CONNECTION_STRING)
                   .then ( db => {
                        let dbo = db.db( "issueTracker" );
                        
                         dbo.collection('issues').findOneAndUpdate( query, update)
                          .then ( doc => {
                            res.send( 'successfully updated' );
                          })
                          .catch ( err => console.log(err) );
                        db.close();
                     } )
                     .catch ( err => console.log(err) );
      }
      else 
        res.send( "could not update `${req.body.id}`" );
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let keys    = Object.keys( req.body ).filter( key => key === '_id' );
      
      if (Object.entries(keys).length === 0)
        res.send( 'id error' );
      else {
        MongoClient.connect(CONNECTION_STRING)
                   .then ( db => {
                        let dbo = db.db( "issueTracker" );
                        dbo.collection( "issues").findOneAndDelete( { _id: ObjectId(req.body._id) } )
                             .then ( doc => {
                               res.send( `deleted ${req.body._id}`);
                             })
                             .catch ( err => console.log( err ))
                   } )
                   .catch ( 'could not delete ' + ObjectId(req.body._id) )
      }
    });
    
};
