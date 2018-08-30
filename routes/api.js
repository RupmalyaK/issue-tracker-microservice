/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ObjectId = require('mongodb').ObjectID;



module.exports = (app , db) => {

  app.route('/api/issues/:project')
  
    .get((req, res) => {
      const project = req.params.project;
      const query = {};
      
    if (req.query.assigned_to)
      {
        query.assigned_to = req.query.assigned_to;
      }
      
      if(req.query.open)
      {
        query.assigned_to = req.query.assigned_to; 
      }
      
      db.collection(project).find(query)
      .toArray((err , docs) => {
      if (err) throw err; 
      res.status(200).json(docs);
    })
  })
    
    .post((req, res) => {
      const project = req.params.project;
      
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
      {
        res.status(422).send("missing input");
        return; 
      } 

    
      db.collection(project).insertOne({
      "issue_title":req.body.issue_title,
      "issue_text":req.body.issue_text,
      "created_by":req.body.created_by,
      "assigned_to":req.body.assigned_to,
      "status_text":req.body.status_text,
       "open":true,  
      "created_on":new Date(Date.now()).toISOString(),
      "updated_on":new Date(Date.now()).toISOString()
      })
      .then(doc => 
      res.status(200).json({
        "status":"success",
        "doc":doc.ops[0]})
      )
      .catch(err => {throw err;});
      
    })
    
    
    .put((req, res) => {
        const project = req.params.project;

        const query = {}; 
        let flag = false; 
       if(req.body.issue_title ) 
       {  
         flag = true; 
         query.issue_title = req.body.issue_title ;
       }
        
       if(req.body.issue_text)
       {
         flag = true; 
         query.issue_text = req.body.issue_text;
       } 
    
      if(req.body.created_by)
       {
         flag = true; 
         query.created_by = req.body.created_by;
       }
      
      if(req.body.assigned_to)
        {
          flag = true; 
          query.assigned_to = req.body.assigned_to;
        }
      
      if(req.body.status_text)
      {
        flag = true; 
        query.status_text = req.body.status_text; 
      }
    
      if(req.body.open != null)
      {
        flag = true;
        query.open = req.body.open; 
      }
      
     if (flag === false)
     {
       res.status(422).send("no update field sent");
       return; 
     }
    
    query.updated_on = new Date(Date.now()).toISOString();
    const _id = ObjectId(req.body._id);
       db.collection(project).findOneAndUpdate({_id},{"$set":query})
        .then(doc => {
           if(doc.value)
           {
             res.status(200).send("successfully updated");
             return;
           }
         res.status(200).send("could not update " + req.body._id );
       
       })
        .catch(err => {throw err;});
      
    })
    
    .delete((req, res) => {
      const project = req.params.project;
    
      if(!req.body._id)
      {
        res.status(422).send("_id error");
        return; 
      }
    
      const _id = ObjectId(req.body._id);
      
      db.collection(project).deleteOne({_id})
      .then(doc => {
     if(doc.result.n)
     {
       res.status(200).send("deleted " + req.body._id);
       return;
     }  
       res.status(423).send("could not delete " + req.body._id); 
      })
      .catch(err => {
      throw err;   
      }); 
    });
    
};

