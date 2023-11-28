import express from 'express';
import mongoClient from './../mongodb.mjs'
import { ObjectId } from 'mongodb';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";
import { globalObject, socketUsers } from '../core.mjs';




////////////////////////////////////////////////////////////////
/* Sates */
////////////////////////////////////////////////////////////////

let router = express.Router();
let dbName = 'UtophoriaNetwork';
let db = mongoClient.db(dbName);
let userCollection = db.collection('registered-users');
let messageCollection = db.collection('all-messages');
let connectMessage = 'Mongo Atlas Connected Successfully';
let disconnectMessage = 'Mongo Atlas *Disconnected* Successfully';
//////////////////////////////////////////////////////////////////
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './imageUploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////
/* Message API  */
////////////////////////////////////////////////////////////////

router.post('/message/:chattingWith/:sender', upload.any(), async (req, res, next) => {

    try{

        let chattingWith = req.params.chattingWith;
        let sender = req.params.sender;
        let message = req.body.message;

        console.log("Decoded cookie username: " , req.decodedCookie.username);
        console.log("Sender: " , sender);
        console.log("Message: " , message);
        console.log("Request Body: " , req.body);

        if(req.decodedCookie.username !== req.params.sender){
            res.status(403).send({ message: "Forbidden" });
            return
        }

        await mongoClient.connect();
        console.log(connectMessage);

        let theMessage  = {
            chattingWith: chattingWith,
            sender: sender,
            message: message,
            isDeleted: [],
            time: new Date().getTime()
        }
        let sendingMessage = await messageCollection.insertOne(theMessage)

        res.status(200).send({ message: "Message sent successfully" });

        theMessage._id = sendingMessage.insertedId;
        
        if(socketUsers[chattingWith]){
            socketUsers[chattingWith].emit("NEW_MESSAGE", theMessage);
            socketUsers[chattingWith].emit(
                `NOTIFICATIONS`, `New message from ${sender}: ${message}`
            );
        }else{
            console.log("THIS USER IS NOT ONLINE");
        }



        await mongoClient.close();
        console.log(disconnectMessage);

    


    }catch(err){

        console.log(err);   
        res.status(500).send({ message: "Internal Server Error" });
        await mongoClient.close();
        console.log(disconnectMessage);

    }


})
//////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////
/* Chat Retrieve API  */
////////////////////////////////////////////////////////////////


router.get('/chat/:chattingWith/:sender', async (req, res, next) => {

    try{

        let chattingWith = req.params.chattingWith;
        let sender = req.params.sender;

        await mongoClient.connect();
        console.log(connectMessage);
        
        let conversation = await messageCollection.find(
            {$or: [

                {
                    chattingWith: chattingWith,
                    sender: sender
                },

                {
                    chattingWith: sender,
                    sender: chattingWith
                }

            ]}
        ).sort({time: 1}).toArray();

        res.status(200).send({chat: conversation});

    }catch (error){

        console.log("Error: ", error);
        res.status(500).send({ message: "Internal Server Error" });
        await mongoClient.close();
        console.log(disconnectMessage);

    }

})


////////////////////////////////////////////////////////////////
/* Exporting ROUTER   */
////////////////////////////////////////////////////////////////

export default router

////////////////////////////////////////////////////////////////
/* The END of Document  */
////////////////////////////////////////////////////////////////


