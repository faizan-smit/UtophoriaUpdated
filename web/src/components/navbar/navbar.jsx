import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../../context/context';
import axios from 'axios';
import api from '../../axios';
import './navbar.css'
import Home from './../pages/home/home';
import Profile from './../pages/profile/profile';
import Signup from './../pages/signup/signup';
import Login from './../pages/login/login';
import Chat from './../pages/chat/chat';



let Navbar = ()=>{

  let { state, dispatch } = useContext(GlobalContext);

  let logoutHandler = async ()=>{


    let axiosResponse = await api.post('/api/v1/logout');
    if(axiosResponse){dispatch({
        type: 'USER_LOGOUT',
    })
    }


  }



    return(
        <>
        
            <nav className="navbar">

            <ul>

                {(state?.isLogin)?(<>
                
                    <div>
                    <li>
                    <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                    <Link to={`/users/${state?.user?.username}`}>Profile</Link>
                    </li>
                    <li>
                    <Link to={'/chat'}>Chat</Link>
                    </li>
                    </div>
        <div className='app-name'>Utophoria</div>
                    <div>
                    <li className='right--side'>
                    <Link onClick={logoutHandler}>Logout</Link>
                    </li>
                    </div>

                
                </>):(<>
                
                    <div>
                    <li>
                    <Link to={'/'}>Home</Link>
                    </li>
                    </div>
        <div className='app-name'>Utophoria</div>
                    <div>
                    <li>
                    <Link to={'/signup'}>Signup</Link>
                    </li>
                    <li>
                    <Link to={'/login'}>Login</Link>
                    </li>
                    </div>

                   

                </>)}

                
            </ul>

         </nav>
        
        
        </>
    )


}

export default Navbar