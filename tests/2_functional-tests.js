/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp   = require('chai-http');
var chai       = require('chai');
var assert     = chai.assert;
var expect     = require('chai').expect
var server     = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    let idFirstIssue;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
           .post('/api/issues/test')
           .send({
              issue_title:  'Title',
              issue_text:   'text',
              created_by:   'Functional Test - Every field filled in',
              assigned_to:  'Chai and Mocha',
              status_text:  'In QA'
           })
           .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'Title');
              assert.equal(res.body.issue_text,  'text');
              assert.equal(res.body.created_by,  'Functional Test - Every field filled in');
              assert.equal(res.body.assigned_to, 'Chai and Mocha');
              assert.equal(res.body.status_text, 'In QA');
              assert.equal(res.body.open, true);
              assert.isDefined(res.body._id);
              
              idFirstIssue = res.body._id;
              done();
          });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
               issue_title:  'Monitor failure',
               issue_text:   'Monitor can not be powered on',
               created_by:   'User'
            })
            .end(function(err, res){
               assert.equal(res.status, 200);
               assert.equal(res.body.issue_title, 'Monitor failure');
               assert.equal(res.body.issue_text,  'Monitor can not be powered on');
               assert.equal(res.body.created_by,  'User');
               assert.equal(res.body.open, true);
               done();
            });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
           .post('/api/issues/test')
           .send({
              issue_title:  'Title test',
              issue_text:   'Issue text test', 
              created_by:   ''
           })
           .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, '"issue_title", "issue_text" and "created_by" fields must be filled');
              done();
           });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
            })
            .end(function(err, res){ 
               assert.equal(res.status, 200);
               assert.equal(res.text, 'no updated field sent');
               done();
            });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
           .put('/api/issues/test')
           .send({
              _id:          idFirstIssue,
              status_text:  'In QA stage1'
           })
           .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'successfully updated');
             done();
           });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
           .put('/api/issues/test')
           .send({
              _id:          idFirstIssue,
              issue_title:  'updated_issue_title',
              issue_text:   'updated_issue_text',
              created_by:   'Functional Test - Updated',
              assigned_to:  'Updated Chai and Mocha',
              status_text:  'In QA updated'
           })
           .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'successfully updated');
              done();
           });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .send({
              issue_title:  'Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.equal(res.body[0].issue_title, 'Title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .send({
              issue_text: 'updated_issue_text',
              assigned_to: 'Updated Chai and Mocha'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.equal(res.body[0].issue_text, 'updated_issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.equal(res.body[0].assigned_to, 'Updated Chai and Mocha');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: idFirstIssue
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${idFirstIssue}`);
          done();
        });
      });
      
    });

});
