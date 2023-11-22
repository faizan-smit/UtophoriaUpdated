import { useRef, useState, useEffect  } from "react";
import axios from "axios";
import './signup.css';
import api from "../../../axios";

import { useNavigate } from "react-router-dom";


let Signup = ()=>{


    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const userNameRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState("loading-msg-hide");
    const [loadingMessage, setLoadingMessage] = useState(null);

    const Navigate = useNavigate();

    useEffect(

        ()=>{

            // setTimeout(()=>{

            //     setAlertMessage(null)
            //     setErrorMessage(null)

            // }, 5000)




        }
        ,[alertMessage, errorMessage]


    );

    let signupHandler = async (e) => {
        e.preventDefault();
        setLoadingMessage("Loading...");
        setErrorMessage(null);
        setAlertMessage(null);
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await api.post('/api/v1/signup', {
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                username: userNameRef.current.value,
            });

            if(response.status === 200){
                setLoadingMessage(null);



                    setTimeout(()=>{
                        Navigate('/login')
                    },1500)


        
                }
            setAlertMessage(response.data.message)
    
            console.log(response.data);
        } catch (error) {
           
            console.error(error);
            setLoadingMessage(null)
            setErrorMessage(error.response.data.message)
        }
    };



    return(
        <>
        

        <div>This is Signup!</div>


            <div>


                <form className="signup-form" onSubmit={signupHandler}>

                    <input type="text" name="" id="firstName" ref={firstNameRef} placeholder="First Name" required autoFocus={true} autoComplete="off" />
                    <input type="text" name="" id="lastName" ref={lastNameRef} placeholder="Last Name" required autoComplete="off" />
                    <input type="email" name="" id="email" ref={emailRef} placeholder="Email" required autoComplete="off" />
                    <input type="text" name="" id="username" ref={userNameRef} placeholder="Username" required autoComplete="off" />
                    <input type="password" name="" id="password" ref={passwordRef} placeholder="Password" required autoComplete="off" />
                    <input type="password" name="" id="confirmPassword" ref={passwordConfirmRef} placeholder="Confirm Password" required autoComplete="off" />
                    <div className="loading-msg">{loadingMessage}</div>
                    <div className="alert-msg">{alertMessage}</div>
                    <div className="error-msg">{errorMessage}</div>
                    <button type="submit">Signup</button>



                </form>

            </div>
        
        
        </>
    )


}

export default Signup