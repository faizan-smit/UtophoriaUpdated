import logo from '../../../img/moon.jpg';
import PostCard from '../../postcard/postcard';
import PostForm from '../../form/postform';
import { GlobalContext } from '../../../context/context';
import { useState, useEffect, useContext } from 'react';
import api from '../../../axios';
import './home.css';



let Home = ()=>{


    let { state, dispatch } = useContext(GlobalContext);
    const [posts, setPosts] = useState([]);
    let formattedTime;

    useEffect(() => {
        let fetchPosts = async ()=> {
          try {
            const response = await api.get(`/api/v1/getPosts`);
            console.log(response.data);
            setPosts(response.data);
            console.log(posts);
          } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
              console.log(error.response.status);
            }
          }
        }
    
        fetchPosts();
      }, []);


    return(
        <>
        

    


      {state?.isLogin===true?(<PostForm />):(null)}
        

        {posts.map((data, index) => (

            
            formattedTime = new Date(data.createdOn).toLocaleString(),
            <PostCard key={index} LikesCount={data?.likes?.length} isLikedByUser={(data?.likes?.includes(state?.user?._id))? (true):(false)} theInteractor={state?.user?._id} name={data?.authorName} _id={data?._id} image={logo} userUrl={`/users/${data?.authorUserName}`} alt="React Logo" time={formattedTime} title={data?.heading} post={data.content} postImg={data?.img}/>


        ))}
        


        
        </>
    )


}

export default Home