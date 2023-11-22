import { HandThumbsUp, ChatLeftText, Share } from "react-bootstrap-icons";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import api from "../../axios";
import './postcard.css';



let PostCard = (props)=>{

    let doLikeHandler = (theLikedPost)=>{

        console.log("Current Post: " ,theLikedPost);
        console.log("Current User: " , props.theInteractor);

        let likeResponse = api.post('/api/v1/interaction/like', {

            theLikedPost: theLikedPost,
            theUser: props.theInteractor,
    })


    }



    return(
        <>
        

            <div className="maindiv">

            <div className='headdiv'>
            
                <div className="userImg">
                    <img src={props.image} alt={props.alt} />
                
                </div>

                <div className='d-t'>
                <Link to={props.userUrl}>
                    <h4 className='person-name'>{props.name}</h4>
                </Link>
                <p className="post--time">{props.time}</p>
                </div>


            </div>



            <div className="postdiv">



                <h1>{props.title}</h1>
                <p>{props.post}</p>
                {props.postImg? ( <img src={props?.postImg} />): (null)}
               


            </div>




            <hr />

            <div className="postFooter">


            <div className={`button ${ ((props?.isLikedByUser === true)? (`liked`):(null))}`} onClick={(e)=>{doLikeHandler(props?._id)}}>
                <HandThumbsUp />
                Like&nbsp;{(props?.LikesCount)? (`(${props.LikesCount})`):(null)}
            </div>
            <div className="button">
                <ChatLeftText /> Comment
            </div>
            <div className="button">
                <Share /> Share
            </div>


            </div>

            <hr />






            </div>
        
        
        </>
    )


}

export default PostCard