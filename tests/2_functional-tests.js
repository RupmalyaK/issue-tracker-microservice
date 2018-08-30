/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
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
          const doc = res.body.doc; 
          assert.equal(res.status, 200);
          assert.equal(res.body.status , "success");
          assert.equal(doc.issue_title,'Title'); 
          assert.equal(doc.created_by ,"Functional Test - Every field filled in" );
          assert.equal(doc.assigned_to, "Chai and Mocha");
          assert.equal(doc.status_text , "In QA" ); 

          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: "text",
          created_by: 'Functional Test - Every field filled in',
          assigned_to: null,
          status_text: null
        })
        .end((err , res) => {
            const doc = res.body.doc; 
          assert.equal(res.status, 200);
          assert.equal(res.body.status , "success");
          assert.equal(doc.issue_title,'Title'); 
          assert.equal(doc.created_by ,"Functional Test - Every field filled in" );
          assert.equal(doc.assigned_to, null);
          assert.equal(doc.status_text , null ); 
        done();  
        })
      });
      //
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: null,
          created_by: null,
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
        assert.equal(res.text,"missing input");
        done();  
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          "_id":"5b87f1f44be11471263c6831"
        })
        .end(function(err, res){
        assert.equal(res.text , "no update field sent");
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          "_id":"5b87f1f44be11471263c6831",
          "status_text":"textnew"
        })
        .end(function(err, res){
        assert.equal(res.text , "successfully updated");
          done();
        });
      });
      
     test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          "_id":"5b87f1f44be11471263c6831",
          issue_title: 'Title',
          issue_text: null,
          created_by: null,
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
        assert.equal(res.text , "successfully updated");
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
        .query({"assigned_to": "Chai and Mocha"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].assigned_to, "Chai and Mocha");
          done();
        });
      });
      
     test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
         chai.request(server)
        .get('/api/issues/test')
        .query({"assigned_to": "Chai and Mocha" ,
               "open":true
               })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].assigned_to, "Chai and Mocha");
           assert.equal(res.body[0].open, true);
          done();
        });
      });
      
    });
   
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
         .send({})
        .end(function(err, res){
         assert.equal(res.text ,"_id error");
          done();
        });
      });
     
      
     test('Valid _id', function(done) {
       const id = "5b87f1fd3fdb3871577b08c5";
       chai.request(server)
        .delete('/api/issues/test')
         .send({"_id":id})
        .end(function(err, res){
         assert.equal(res.text ,"deleted " + id);
          done();
        });
      });
      
    });

});

