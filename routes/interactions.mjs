import express from 'express';
import mongoClient from './../mongodb.mjs'
import { ObjectId } from 'mongodb';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";




////////////////////////////////////////////////////////////////
/* Sates */
////////////////////////////////////////////////////////////////

let router = express.Router();
let dbName = 'UtophoriaNetwork';
let db = mongoClient.db(dbName);
let userCollection = db.collection('registered-users');
let postCollection = db.collection('all-posts');
let connectMessage = 'Mongo Atlas Connected Successfully';
let disconnectMessage = 'Mongo Atlas *Disconnected* Successfully';
//////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
/* Like API */
////////////////////////////////////////////////////////////////


router.post('/interaction/like', async (req, res, next) => {

    console.log("Like interaction initiated @ " , new Date().toLocaleString())
    

    if (!ObjectId.isValid(req.body.theLikedPost) ||!ObjectId.isValid(req.body.theUser)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    try {

        await mongoClient.connect();
        console.log(connectMessage);
        const doLikeResponse = await postCollection.updateOne(
            { _id: new ObjectId(req.body.theLikedPost) },
            {
                $addToSet: {
                    likes: new ObjectId(req.body.theUser)
                }
            }
        );
        console.log("doLikeResponse: ", doLikeResponse);
        res.status(200).send('like done');
        await mongoClient.close();
        console.log(disconnectMessage);
    } catch (e) {
        console.log("error like post mongodb: ", e);
        res.status(500).send('server error, please try later');
        await mongoClient.close();
        console.log(disconnectMessage);
    
    }
})



////////////////////////////////////////////////////////////////
/* Exporting ROUTER */
////////////////////////////////////////////////////////////////



export default router;