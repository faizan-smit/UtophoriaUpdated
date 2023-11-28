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
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './imageUploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//////////////////////////////////////////////////////////////////
let serviceAccount = {
    "type": "service_account",
    "project_id": "utophoria-multer",
    "private_key_id": "2e2e4226838bde8f59ee8fc164bb9c13b99e83ef",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO7F/ttNMLqM0e\n71skkugp+PXlGxbmLbMUu3RCHdPZU7EjFajd8Hgdg2j4yXi4AIyi3RJHdBPJGkYn\nAeepOi+i6QXF9LkA8SyG3FAH2dU1cUiaYN16nchgbRYaAm6UEvrHvtD9oGlsUvvR\n89GkDWLf8vBmIU5Tcu3No2HdPA+O0N+RMAle5B2aCQoy4Jf106z1sWts4mDbg/Iu\nMfPDpzgL811zQ0nV9L72z4E2YYZLYWjKi1UtZUCaqchbpIEPKTPynpkKyyscqTQe\nKWGjoHF7atmM5LGtp9OsJnmRRKEMGA0AV9WgUcMMmtj9XFyP8rxj057YyaDnBrmi\n/7aaMu9bAgMBAAECggEAYXh464kNDOXz0YmgXkcRM4xBkC1FiSGnxLFUXzybqTjC\nLSurwvfeLNDU5rRIuCwSEzmdvajRFR7aQs+j51QwUkX/4TKY3ve8KL6ouDoFM8ps\nD8RnL7YZSEq6aYARxJB4LxUUbxRb9JnWYxy9+NARbjqKwSEZOzfdCsvWcpczIOsr\naO2W+yNA29u+Pew/ui/mQ/zkCrnUysMJMNKCXz3OfBqcbAuoB5EzaYpseWoMt4BG\nc4BeyQAxW+RaSRqIZcDqCdc/D3O9Pidpw6GJIoYZZKtJosnjj9ldCDMmAHCm3+FR\nFCYPfTEsAAMOWlzbLm0ezSunSk2pR05TyXro4oItEQKBgQD7TZqZocz9CI0IaNyo\nA6IHb3B3SoNNKC6IazH4NymgLK+Bmh1na6YXvNT8Xdcr/GPXrOBmPVEHVisH5zPM\nRKIGTdKkdfHhSAiDhQojU+/7EzW3Eux5dEiGC44VXbjjaPUUFJlGnVoOH+DnIWMP\nskWkocO1OBEgai3ZFENLgWWRcwKBgQDSym3j1CAKsQp7GHviSvowvbaRJAXNmTal\n6K8SA/Owpqz+9jq5GY1g39s0v87B0fakmNSZ5PeWIqfQq9xsLdIaeSznmQenmpdA\n6dTHLgDAfI1IPXzOgRhpOGfpTxBA4z6x26OYHV+8R1jcT8thOMrcevdWgFjPIF0G\n3u+dGP4QeQKBgBdhC935GIn9zqkWoFidJejNLEhczURTVajpWBfAggXdwmIrRUsG\nz8frkGD+FfOIon1BHwtD7xLgqFYu4znAtNYjTVJxipQr0Gbz7JKGz4+rJNcoUomm\nEM0vrAM+2eGGNS6uD+hq4SLpQlIeYAnoyuPbDMsCMU2zsxo78VrH6fwTAoGAdM4v\nrrvxNXt9b1DV9UPO+Atoi20GujNYkP8rZDREaXMzEeWoDMIYEcJ6WfSfwc9zeSon\nRVAX0l5J19wkPN33OyxCseOe1kVX42Svv9/CEufx8kIAUv4+ZLAZBLQHMa27JBut\nv7EnR9HRb+PXs3whDaQmQwzEKaKpahFHfipHPyECgYEA4MaaGtoKKmwRR5omMAv8\nLDu1e2jiGo5CNKKN02Zv7GGDC/NtDkZddhIM9DHhcgH4gtR91HPCO+HRohY6sAzy\nUol9ANUctep8KXV77hjfWLam3QyX9/5w5ZWDDdyoVaCIMUDScfOGJFvhhflLd4IQ\nvDtLD/5PZ8yC0e0LiSZ44Kw=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-dtoz1@utophoria-multer.iam.gserviceaccount.com",
    "client_id": "117815770554791351119",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dtoz1%40utophoria-multer.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

////////////////////////////////////////////////////////////////
/* Firebase Bucket Initialization */
////////////////////////////////////////////////////////////////


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://smit-b9.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://utophoria-multer.appspot.com");



////////////////////////////////////////////////////////////////
/* Create Post API */
////////////////////////////////////////////////////////////////



// router.post('/post', async (req, res, next)=>{
    
//         console.log("req.body immediately on request : ", req.body);

//         req.decodedBody = { ...req.body.decoded }
//         console.log("req.file: ", req.files);

//         if (!req.files || req.files.length === 0) {
//             // Handle the case when no files are uploaded
//             res.status(403).send({ message: 'No files uploaded' });
//             console.log('No files uploaded \nExiting Post Request...');
//             return;
//         }
    
//         next();

//     },  upload.any(),
    
    

//     async (req, res, next) => {

    
//     console.log('Post request received @:' + new Date());
//     console.log("req.body after upload.any() middleware : ", req.body);

//     if (
//         !req.body ||
//         !req.body.heading ||
//         !req.body.content ||
//         !req.body.authorUserName ||
//         req.body.heading.trim().length === 0 ||
//         req.body.content.trim().length === 0 ||
//         req.body.authorUserName.trim().length === 0
//     ) {
//         res.status(403).send(`Required parameters missing, Example request body:
//         {
//             heading: "abc post title",
//             content: "some post text"
//         } `);

//         console.log(`Required parameters missing, Example request body:
//         {
//             heading: "abc post title",
//             content: "some post text"
//         } `);
//         return;
//     }

   
//     console.log("req.files: ", req.files);

//         if (req?.files[0]?.size > 2000000) { // size bytes, limit of 2MB
//             res.status(403).send({ message: 'File size limit exceed, max limit 2MB' });
//             return;
//         }
//         bucket.upload(
//             req.files[0].path,
//             {
//                 destination: `posts/images/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
//             }, function (err, file, apiResponse) {
//                 if (!err) {
//                     // console.log("api resp: ", apiResponse);

//                     // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
//                     file.getSignedUrl({
//                         action: 'read',
//                         expires: '03-09-2491'
//                     }).then(async (urlData, err) => {
//                         if (!err) {
//                             console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 


  
//         try{

//         await mongoClient.connect();
//         console.log(connectMessage);

//             let postDocument = {

//                 heading: req.body.heading,
//                 content: req.body.content,
//                 img: urlData[0],
//                 authorUserName: req.body.authorUserName,
//                 authorEmail: req.body.authorEmail,
//                 authorName: req.body.authorName,
//                 authorUserId: new ObjectId(req.body._id),
//                 createdOn: new Date(),

//             }

//             const insertResponse = await postCollection.insertOne(postDocument);

//             console.log("Post created: ", insertResponse);
//             res.status(200).send({
//                 message: "Post was successfully created",
//             });
//             await mongoClient.close();
//             console.log(disconnectMessage);


//         }catch(e){

//             console.log("ERROR: " + e);
//             res.status(500).send(`Internal Server Error`);
//             await mongoClient.close();
//             console.log(disconnectMessage);
    
    
    
//         }
        
//         try {
//             fs.unlinkSync(req.files[0].path)
//             //file removed
//         } catch (err) {
//             console.error(` fs.unlinkSync: `, err);
//         }



//         } else {
//             console.log("err: ", err)
//             res.status(500).send({
//                 message: "Internal Server Error"
//             });
//         }
//     });



// }})    



 


// });


////////////////////////////////////////////////////////////////
/* Create Post API of Sir Inzamam*/
////////////////////////////////////////////////////////////////


router.post('/post', upload.any(),

    async (req, res, next) => { 
        console.log("req.body: ", req.body);

        if (
            !req.body.heading
            || !req.body.content
        ) {
            res.status(403);
            res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
            return;
        }


        // TODO: save file in storage bucket and get public url

        console.log("req.files: ", req.files);

        if(req.files && req.files.length > 0) {
            if (req.files[0].size > 2000000) { // size bytes, limit of 2MB
                res.status(403).send({ message: 'File size limit exceed, max limit 2MB' });
                return;
            }

        bucket.upload(
            req.files[0].path,
            {
                destination: `profile/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // console.log("api resp: ", apiResponse);

                    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                            await mongoClient.connect();
                            console.log(connectMessage);
                            console.log("Attempting to create post")

                            try {
                                const insertResponse = await postCollection.insertOne({
                                    // _id: "7864972364724b4h2b4jhgh42",
                                    heading: req.body.heading,
                                    content: req.body.content,
                                    img: urlData[0],
                                    authorUserName: req.body.authorUserName,
                                    authorEmail: req.body.authorEmail,
                                    authorName: req.body.authorName,
                                    authorUserId: new ObjectId(req.body._id),
                                    createdOn: new Date(),
                                });
                                console.log("insertResponse: ", insertResponse);

                                res.send({ message: 'post created' });
                                await mongoClient.close();
                                console.log(disconnectMessage);
                            } catch (e) {
                                console.log("error inserting mongodb: ", e);
                                res.status(500).send({ message: 'server error, please try later' });
                                await mongoClient.close();
                                console.log(disconnectMessage);
                            }



                            // // delete file from folder before sending response back to client (optional but recommended)
                            // // optional because it is gonna delete automatically sooner or later
                            // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send({
                        message: "server error"
                    });
                }
            });




        } /// if condition ended successfully
        else {


            await mongoClient.connect();
            console.log(connectMessage);
            console.log("Attempting to create post")

            try {
                const insertResponse = await postCollection.insertOne({
                    // _id: "7864972364724b4h2b4jhgh42",
                    heading: req.body.heading,
                    content: req.body.content,
                    authorUserName: req.body.authorUserName,
                    authorEmail: req.body.authorEmail,
                    authorName: req.body.authorName,
                    authorUserId: new ObjectId(req.body._id),
                    createdOn: new Date(),
                });
                console.log("insertResponse: ", insertResponse);

                res.send({ message: 'post created' });
                await mongoClient.close();
                console.log(disconnectMessage);
            } catch (e) {
                console.log("error inserting mongodb: ", e);
                res.status(500).send({ message: 'server error, please try later' });
                await mongoClient.close();
                console.log(disconnectMessage);
            }

        }
    })


////////////////////////////////////////////////////////////////
/* Get All Post API */
////////////////////////////////////////////////////////////////


router.get('/getPosts', async(req, res) => {
    console.log('Get All Post request received @:' + new Date());

    try {
        await mongoClient.connect();
        console.log(connectMessage);

            const cursor = postCollection.find({}).sort({ _id: -1 });
            let results = await cursor.toArray()
            console.log("Results: ", results);
            res.status(200).send(results);
            // await mongoClient.close();
            // console.log(disconnectMessage);

    }
    catch(error){


        console.log("Error: ", error);
        console.log('Error in getting All posts');
        res.status(404).send("Error in getting All post")
        await mongoClient.close();
        console.log(disconnectMessage);

        
         }


})


////////////////////////////////////////////////////////////////
/* Get Single User Post API */
////////////////////////////////////////////////////////////////


router.get('/userSpecificPost/:username', async(req, res) => {
    console.log('Get User Specific Post request received @:' + new Date());


    try {

        if(!req.params.username){
            res.status(403).send(`required parameters missing`);
            console.log(req.params.username);
            console.log('Bad request');
            return;
        }

            await mongoClient.connect();
            console.log(connectMessage);
            // let findUser = await userCollection.findOne({ username: req.params.username });
            // console.log("FindUser: ",findUser);
            const cursor = postCollection.find({authorUserName: req.params.username}).sort({ _id: -1 });
            // console.log("Cursor:", cursor);
            let results = await cursor.toArray()
            console.log("Results: ", results);
            res.status(200).send(results);
            await mongoClient.close();
            console.log(disconnectMessage);
    }
    catch(error){


        console.log("Error: ", error);
        console.log('Error in getting User posts');
        res.status(404).send("Error in getting User posts")
        await mongoClient.close();
        console.log(disconnectMessage);
        
         }
})



////////////////////////////////////////////////////////////////
/* Exporting ROUTER */
////////////////////////////////////////////////////////////////



export default router;

