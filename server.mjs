import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import { Server as socketIo } from 'socket.io';
import cookie from 'cookie';
import authRouter from './routes/auth.mjs';
import postRouter from './routes/post.mjs';
import userProfileRouter from './unAuthRoutes/profile.mjs'
import interactionRouter from './routes/interactions.mjs';
import messageRouter from './routes/chat.mjs';
import { create } from 'domain';
import { createServer } from 'http';
import { globalObject, socketUsers } from './core.mjs';

////////////////////////////////////////////////////////////////
/* STATES */
////////////////////////////////////////////////////////////////

const app = express();
const server = createServer(app)
const io = new socketIo(server, {
    cors: {
        origin: ["*", "http://localhost:3000"],
        methods: "*",
        credentials: true,
    }
})

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

        req.decodedCookie =  {
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
        data: req.decodedCookie,
    });

});

app.use('/api/v1', postRouter);
app.use('/api/v1', interactionRouter);
app.use('/api/v1', messageRouter);


////////////////////////////////////////////////////////////////
/* WEB Server Serving Site */
////////////////////////////////////////////////////////////////

app.use(myWebServer);
app.use("*", myWebServer);
// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/web/build', 'index.html'));
//   });



////////////////////////////////////////////////////////////////
/* SOCKET IO */
////////////////////////////////////////////////////////////////

globalObject.io = io;

io.use((socket, next)=>{

    console.log("Socket-Middleware Started");
    const parsedCookies = cookie.parse(socket.request.headers.cookie || "");
    console.log("parsedCookies: ", parsedCookies);

    try{
        const decoded = jwt.verify(parsedCookies.authenticationtoken, process.env.SECRET);
        console.log("decoded: ", decoded);
        socketUsers[decoded.username] = socket;
        socket.on("disconnect", (reason, desc)=>{
            console.log("Socket Disconnected: ", reason, "desc: ", desc);

        });
        next();

    
    }catch(err){
        console.log("Invalid Token");
        return next(new Error("Invalid Token"));
        return;
    
    }

});


io.on("connection", (socket)=>{
    console.log("New user connected with id: ", socket.id);
}); 


////////////////////////////////////////////////////////////////
/* PORT Listener */
////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {

    console.log('Server Listening on port: *' + PORT + "* \nServer Started @ " + (new Date()).toLocaleString());

});
