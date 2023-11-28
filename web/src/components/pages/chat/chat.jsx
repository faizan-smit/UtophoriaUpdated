import { useState } from 'react';
import io from 'socket.io-client';
import { GlobalContext } from './../../../context/context';
import { useContext, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import api from '../../../axios';
import './chat.css'
import { baseUrl } from '../../../core.mjs';




let Chat = ()=>{


    let { state, dispatch } = useContext(GlobalContext);
    let {chattingWith} = useParams();
    let theMessage = useRef();
    let [allMessages, setAllMessages] = useState([]);

    const [toggleRefresh, setToggleRefresh] = useState(false);


    useEffect(()=> {

        const socket = io(baseUrl, {
          secure: true,
          withCredentials: true,
        });
  
        socket.on('connect', ()=>{
          console.log("Socket Connected in Chat.jsx");
        });
  
        socket.on('disconnect', (message)=>{
  
          console.log("Socket Disconnected in Chat.jsx: ", message);
  
        })

        socket.on("NEW_MESSAGE", (e) => {
            console.log("a new message for you: ", e);
            setAllMessages((prev) => {
                return [...prev, e];
            });

        })

        return () => {
            socket.close();
        }
  
    }, []);


    useEffect(()=>{

        let fetchMessages = async ()=>{

            try{
            let response = await api.get(`/api/v1/chat/${chattingWith}/${state.user.username}`);
            console.log(response.data);
            setAllMessages([...response.data.chat]);
            console.log( "All Messages State: " , allMessages);

            }catch(err){
                console.log("Error: ", err);
            }
        
        };

        fetchMessages();

        return () => {

        };

    }, [toggleRefresh])

    let sendMessage = async (e)=>{

        e.preventDefault();
        console.log(theMessage.current.value)

        try{
        let formData = new FormData();
        formData.append('message', theMessage.current.value);
        formData.append('to', chattingWith);
        formData.append('from', state.user.username);

        console.log("Form Data: ", formData);

        let sendResponse = await api.post(`/api/v1/message/${chattingWith}/${state.user.username}`, 
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        });


        console.log(sendResponse.data)
        setToggleRefresh(!toggleRefresh)
        theMessage.current.value = '';
    }catch(err){


        console.log("Error: ", err);

    }



    }
  


    return(
        <>
        

            <div className='main-chat'>

                <div className='chat-head'>

                    <h1>
                        @{chattingWith}
                    </h1>

                </div>

                <div className='chat-messages'>

                    {allMessages.map((message, index)=>{

                            return(
                            <div key={index} className={(state?.user.username === message.sender ? 'sent-messages': 'received-messages')}> {message.message} </div>)
                        

                    })}


                </div>

                <div className='message-send'>

                    <form id='writeMessageForm' onSubmit={sendMessage}>

                    <input type="text" ref={theMessage} name="" id="" />
                    <button >Send</button>
                    </form>
                </div>

            </div>
        
        </>
    )


}

export default Chat