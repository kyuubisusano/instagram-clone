import logo from './Instagram-Logo.png';
import './App.css';
import Post from './components/Post';
import React, { useState , useEffect } from 'react';
import { auth, db } from './firebase.js';
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { Button, Container, getPopoverUtilityClass, Modal } from '@mui/material';
import ModalPopup from './components/ModalPopup';
import ImageUpload from './components/ImageUpload';
import { Toaster } from 'react-hot-toast';


const buttonStyle = {
  color: "red"
}

function App() {

  const [posts,setPosts] = useState([])
  const [openSignup,setOpenSignup] = useState(false)
  const [openLogin,setOpenLogin] = useState(false)
  const [user,setUser] = useState(null)
  const [openUpload,setOpenUpload]  =useState(false)

  useEffect( () => {
    const postRef = collection(db, "posts")
    const postQuery= query(postRef,orderBy("timestamp"));
    const unsubscribe = onSnapshot(postQuery, (postQuerySnapshot) => {
      setPosts([])
      postQuerySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
      setPosts(posts => [...posts,{id:doc.id,post:doc.data()}])

      });
      
    });
  

  return () =>unsubscribe()

  },[])

  useEffect(() => {
    document.body.style.backgroundColor = '#EBEBEB'
  })

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null)
      }
    })
  },[user])

  return (
    <div className="App">
      <Toaster />
    { openSignup ? <ModalPopup open= {openSignup} setOpen= {setOpenSignup} mode='signup'/> : null}
    { openLogin ? <ModalPopup open= {openLogin} setOpen= {setOpenLogin} mode='login'/> : null}
    { openUpload ? <ModalPopup open= {openUpload} setOpen= {setOpenUpload} mode='upload'/> : null}
    <div className='app__header'>
      <img className='app__headerImg' alt= "instagram" src={logo}/>

     { user ? 
       <div className='app__headerRightDiv'>
          <Button  onClick={() => setOpenUpload(true)}>Upload</Button>
          <Button  sx={buttonStyle} onClick={() => { auth.signOut() }}>Logout</Button>
        </div> :
       <div className='app__headerRightDiv'>
           <Button  onClick={() => setOpenSignup(true)}>SignUp</Button>
          <Button onClick={() => setOpenLogin(true) } >Login</Button>
        </div>
      }
    </div>

    <Container maxWidth="sm" className='app__posts'>
    {
      posts ? posts.map( ({id,post}) => {
        console.log(post.userName)
        return( <Post key={id} postId={id} userName={post.userName} imageUrl={post.imageUrl} caption={post.caption} ownerId={post.ownerId} />);  
      }) : <h1>loading...</h1>
    }
    </Container>
     
    </div>
  );
}

export default App;
