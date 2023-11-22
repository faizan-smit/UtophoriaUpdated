import logo from '../../../img/moon.jpg';
import PostCard from '../../postcard/postcard';
import { GlobalContext } from '../../../context/context';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../axios';
import './profile.css';

let Profile = ()=>{


    let { state, dispatch } = useContext(GlobalContext);
    const [posts, setPosts] = useState([]);
    const [profileName, setProfileName] = useState("");
    const { username } = useParams();
    console.log(username);
    let formattedTime;

    useEffect(() => {
        let fetchPosts = async ()=> {
          try {
            const response = await api.get(`/api/v1/userSpecificPost/${username}`);
            console.log(response.data);
            setPosts(response.data);
            console.log(posts);
          } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
              console.log(error.response.status);
            }
          }

          try{

            const profileResponse = await api.get(`/api/v1/userProfile/${username}`);
            console.log(profileResponse.data)
            
              setProfileName(profileResponse.data.data.firstName + " " + profileResponse.data.data.lastName);
            
           

          } catch(profileErr){

            console.log(profileErr);
            setProfileName('User Does Not Exist')


          }
          
        }
    
        fetchPosts();
      }, []);


    return(
        <>
        

        {/* {(state.user)?( */}
        <h1 className='userprofile--name'>
            {profileName} </h1>
            {/* ):(<></>) */}

        {posts.map((data, index) => (

            
            formattedTime = new Date(data.createdOn).toLocaleString(),
            <PostCard key={index} name={data?.authorName} image={logo} userUrl={`/users/${data?.authorUserName}`} alt="React Logo" time={formattedTime} title={data?.heading} post={data.content} postImg={data?.imageURL}/>

        ))}

        
        
        </>
    )


}

export default Profile