import { GlobalContext } from './../../../context/context';
import { useContext } from "react";
let Chat = ()=>{


    let { state, dispatch } = useContext(GlobalContext);

    let changeName = ()=>{
        dispatch({
            type: "CHANGE_NAME",
            payload: 
              "New Name",
            
          })
    }



    return(
        <>
        

        <div>This is Chat! {state.name}</div>
        <br />
        <button onClick={changeName}>ChangeName</button>
        <br />
        <div>
            {JSON.stringify(state.user)}  
            <br />
            {JSON.stringify(state.isLogin)}   
        </div>
        
        </>
    )


}

export default Chat