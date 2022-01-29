const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require("../models");

chai.use(chaiHttp);

let deleteId
suite('Functional Tests', function() {
  
    //3 Post request tests 
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          deleteId = res.body._id    
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //fill me in too!       
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
      });
      
    });

    //3 Get request tests 
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
          .query({open: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
             //fill me in too!    
            done();
          });
        });
        
        test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
          chai.request(server)
          .get('/api/issues/test')
          .query({open: true, status_text: 'In QA'})
          .end(function(err, res){
            assert.equal(res.status, 200);
             //fill me in too!    
            done();
          });
        });
        
      });
    
    //5 Put request tests
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: deleteId
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");

          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: deleteId,
          issue_text: '1'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: deleteId,
          issue_title: 'Title2',
          issue_text: '2'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated"); 
          done();
        });
      });

      test('Update an issue with missing _id', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Title2',
          issue_text: '2'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });

      test('Update an issue with an invalid _id', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
            _id: '61553dfa52beeaeacdae5a8',
          issue_title: 'me',
          issue_text: 'something'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
      });
      
    });
    
    //3 Delete request tests
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('missing _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:''})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");    
          done();
        });
      });
      
      test('invalid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:'61f553dfa52beeaeacdae5a'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");   
          done();
        });
      });

      test('valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: deleteId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");   
          done();
        });
      });
      
    });

});