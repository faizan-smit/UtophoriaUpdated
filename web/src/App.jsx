import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import './App.css';
import { GlobalContext } from './context/context';
import Navbar from './components/navbar/navbar';
import Home from './components/pages/home/home';
import Profile from './components/pages/profile/profile';
import Signup from './components/pages/signup/signup';
import Login from './components/pages/login/login';
import Chat from './components/pages/chat/chat';
import api from './axios';
import logoImage from './logo.svg'
import { baseUrl } from './core.mjs';


let App= ()=> {


  let { state, dispatch } = useContext(GlobalContext);

  
  useEffect(()=> {

      const socket = io(baseUrl, {
        secure: true,
        withCredentials: true,
      });

      socket.on('connect', ()=>{
        console.log("Socket Connected in App.jsx");
      });

      socket.on('disconnect', (message)=>{

        console.log("Socket Disconnected in App.jsx: ", message);

      })

  }, []);


  useEffect(()=>{
    let checkLoginStatus = async()=> {

      try{
  
        let axiosResponse = await api.post('/api/v1/authStatus');
        dispatch({
          type: "USER_LOGIN",
          payload: axiosResponse.data.data,
        })
        console.log(axiosResponse);
        
        console.log("User Logged In");
  
  
  
      }catch(e){
  
        dispatch({
          type: "USER_LOGOUT",
        })
        console.log("User not Logged In");
  
      }
  
    };
    checkLoginStatus();


    setTimeout(()=>{

      dispatch({
        type: "SPLASH_SCREEN",
      })


    }, 2000)

  },[]);




  return (
    <>

    <Navbar />
    <div className='spacer'></div>
    



    {   (state?.isLogin === true)? (<>
        <Routes>
              <Route path='/users/:username' element={<Profile />} />
              <Route path='/chat/:chattingWith' element={<Chat />} />
              <Route path='/' element={<Home />} />
              <Route path='*' element={<Navigate to='/' replace={true} />} />


              </Routes>
          </>)
          :(null)   }



    {   (state?.isLogin === false)?
        (
          <>
            <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/' element={<Home />} />
              <Route path='*' element={<Navigate to='/' replace={true} />} />


          
              </Routes>
          </>) 
          :(null)     }



 


    
{//Splash Screen
}

    {state.splashScreen === true ? (<>
        <div className='splash-screen'>
        <div className='app-name'>Utophoria</div>
          
        <span className='whiteText'>Loading...
        <img className='App-logo'
            src={logoImage}
            /* className="splashScreen" */
            alt=""
          />
          </span>
        </div>
        
        </>) : null}




    
    </>
  );
}

export default App;
