import express from 'express';
import mongoClient from './../mongodb.mjs'
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { stringToHash, varifyHash } from 'bcrypt-inzi';



////////////////////////////////////////////////////////////////
/* Sates */
////////////////////////////////////////////////////////////////



let router = express.Router();
let dbName = 'UtophoriaNetwork';
let db = mongoClient.db(dbName);
let userCollection = db.collection('registered-users');
let connectMessage = 'Mongo Atlas Connected Successfully';
let disconnectMessage = 'Mongo Atlas *Disconnected* Successfully';



////////////////////////////////////////////////////////////////
/* Profile API */
////////////////////////////////////////////////////////////////


router.get('/userProfile/:userName', async(req, res)=>{

    console.log("***************************\n//////////////////////////////")
    console.log("This is User Profile Request initiated at: ");
    console.log(new Date().toISOString());
    console.log(req.params.userName);

    try{

        if (!req.params.userName) {

            res.status(403);
            res.send(`required parameters missing, 
            example request :
            {
                
                users/userName

            } `);
            return;
        }

        await mongoClient.connect();
        console.log(connectMessage);
        let findUser = await userCollection.findOne({ username: req.params.userName });
        console.log(findUser);

        if(!findUser){

            res.status(404).send({
                message: "User does not exist",
                userFound: false,
            });

            return;

        }
        if(findUser){


                        res.status(200).send({
                            message: "User Profile Fetched Successfully",
                            userFound: true,
                            data: {
                                isAdmin: findUser.isAdmin,
                                firstName: findUser.firstName,
                                lastName: findUser.lastName,
                                username: findUser.username,
                                email: findUser.email,
                                _id: findUser._id,
                            }
                        });

                        // await mongoClient.close();
                        return;
                
                
                
                
                }else{

                    res.status(500).send({
                        message: "Internal Server Error",
                    })
                    await mongoClient.close();
                    console.log(disconnectMessage);
                    return;
                }


        



    }catch(e){

        console.log("Error: " + e)
        res.status(500).send({
            message: "Internal Server Error",
        });
        await mongoClient.close();
        console.log(disconnectMessage);



    }

});


////////////////////////////////////////////////////////////////
/* Exporting ROUTER */
////////////////////////////////////////////////////////////////


export default router;

