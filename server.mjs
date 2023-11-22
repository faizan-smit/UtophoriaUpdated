import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import authRouter from './routes/auth.mjs';
import postRouter from './routes/post.mjs';
import userProfileRouter from './unAuthRoutes/profile.mjs'
import interactionRouter from './routes/interactions.mjs';

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const app = express();
const corsOptions = {

    origin: 'http://localhost:3000',
    credentials: true,

}
const __dirname = path.resolve();

const myWebServer = express.static(path.join(__dirname, './web/build'))

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


////////////////////////////////////////////////////////////////
/* UnAUTH Routes */
////////////////////////////////////////////////////////////////

app.use('/api/v1', authRouter);
app.use('/api/v1', userProfileRouter);



////////////////////////////////////////////////////////////////
/* Authentication Barrier */
////////////////////////////////////////////////////////////////

app.use('/api/v1' ,(req, res, next)=>{

    const authenticationtoken = req.cookies.authenticationtoken;
    console.log("cookies: ", req.cookies);
    console.log("my cookies: ", req.cookies.authenticationtoken);

    if (!authenticationtoken) {
        res.status(401).send({ message: "missing token" });
        return;
    }


    try{

        const decoded = jwt.verify(authenticationtoken, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded =  {
            isAdmin: decoded.isAdmin,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            username: decoded.username,
            email: decoded.email,
            _id: decoded._id,};

        next();

    }catch(err){

        res.status(401).send({ message: "invalid token" });
        console.log(err);

    }

});


////////////////////////////////////////////////////////////////
/* AUTH Routes */
////////////////////////////////////////////////////////////////

app.use('/api/v1/authStatus',(req, res) => {
    res.status(200).send({
        message: "logged in",
        data: req.body.decoded,
    });

});

app.use('/api/v1', postRouter);
app.use('/api/v1', interactionRouter);


////////////////////////////////////////////////////////////////
/* WEB Server */
////////////////////////////////////////////////////////////////

app.use(myWebServer);
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/web/build', 'index.html'));
  });





////////////////////////////////////////////////////////////////
/* PORT Listener */
////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {

    console.log('Server Listening on port: *' + PORT + "* \nServer Started @ " + (new Date()).toLocaleString());

});
