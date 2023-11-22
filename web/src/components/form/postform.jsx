import React from "react";
import './postform.css'
import axios from "axios";
import api from "../../axios";
import { useRef, useContext, useState } from "react";
import { GlobalContext } from "../../context/context";

let PostForm = ()=>{

    let { state, dispatch } = useContext(GlobalContext);
    const [selectedImage, setSelectedImage] = useState("");


    const postHead = useRef(null);
    const postBody = useRef(null);
    const postFileInputRef = useRef(null);

    let postSubmitHandler = async (e)=>{
        e.preventDefault();
        let postHeadValue = postHead.current.value;
        let postBodyValue = postBody.current.value;

        try{

            let formData = new FormData();

            formData.append("heading", postHeadValue);
            formData.append("content", postBodyValue);
            formData.append("image", postFileInputRef.current.files[0]);
            formData.append("authorName", state.user.firstName + " " + state.user.lastName);
            formData.append("authorEmail", state.user.email);
            formData.append("authorUserName", state.user.username);
            formData.append("_id", state.user._id);


        console.log(`Form data: `, formData);


        let postData = {
            heading: postHeadValue,
            content: postBodyValue,
            authorName: state.user.firstName + " " + state.user.lastName,
            authorEmail: state.user.email,
            authorUserName: state.user.username,
            _id: state.user._id,

        }

        let axiosResponse = await api.post('api/v1/post', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        console.log(axiosResponse.data.message)
        alert('Post Created Successfully');
        

        postHead.current.value = '';
        postBody.current.value = '';

        }catch(err){

            console.log(err)


        }  

        // window.location.reload();

        return;

    }
    



    return(


        <>
        
        <div>

        <form className="form-css" onSubmit={postSubmitHandler}>
            
            <div className="header">Create New Post</div>
            <br />
            <input placeholder="Heading" ref={postHead} type="text" name="" id="" />
            <textarea placeholder="Post Content" ref={postBody} name="" id="" cols="30" rows="10"></textarea>
            <div className="right">

                {selectedImage && <img height={220} src={selectedImage} alt="selected image" />}

            </div>
            <label className="fileLabel" htmlFor="postFileInput">Choose image to upload
            <input ref={postFileInputRef} id="postFileInput" type="file" name="image"
                accept="image/*" onChange={(e) => {
                  const base64Url = URL.createObjectURL(e.target.files[0]);
                  setSelectedImage(base64Url)
                }} />
                </label>
            <button type="submit">POST</button>

        </form>

        </div>
        
        </>


    )
}

export default PostForm