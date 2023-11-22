import { useRef, useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context/context";
import './login.css';
import api from "../../../axios";


let Login = ()=>{


    let { state, dispatch } = useContext(GlobalContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState("loading-msg-hide");
    const [loadingMessage, setLoadingMessage] = useState(null)

    useEffect(

        ()=>{

            // setTimeout(()=>{

            //     setAlertMessage(null)
            //     setErrorMessage(null)

            // }, 5000)




        }
        ,[alertMessage, errorMessage]


    );


    let loginHandler = async(e)=>{

        e.preventDefault();
        setLoadingMessage("Loading...")
        setErrorMessage(null)


        try{
         let axiosresponse = await api.post('/api/v1/login', {

            email: emailRef.current.value,
            password: passwordRef.current.value,
        });
        if(axiosresponse.status === 200){
        setLoadingMessage(null)

        }
        setAlertMessage(axiosresponse.data.message)

        console.log(axiosresponse)

        dispatch({
            type: 'USER_LOGIN',
            payload: axiosresponse.data.data

            
        })


        }catch(e){
            console.log("Error: ", e);
            setLoadingMessage(null)
            setErrorMessage(e.response.data.message)


        }
    
    
    }





    return(
        <>
        

        <div>This is Login!</div>
        

         <div>


            <form className="login-form" onSubmit={loginHandler}>

                <input type="email" name="" id="email" ref={emailRef} placeholder="Email" required autoComplete="off" />
                <input type="password" name="" id="password" ref={passwordRef} placeholder="Password" required autoComplete="off" />
                <div className="loading-msg">{loadingMessage}</div>
                <div className="alert-msg">{alertMessage}</div>
                <div className="error-msg">{errorMessage}</div>
                <button type="submit">Login</button>



            </form>


        </div>
        
        </>
    )


}

export default Login