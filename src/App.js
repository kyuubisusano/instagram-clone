import logo from './Instagram-Logo.png';
import './App.css';
import Post from './components/Post';
import React, { useState , useEffect } from 'react';
import { auth, db } from './firebase.js';
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { Button, getPopoverUtilityClass, Modal } from '@mui/material';
import CredPopup from './components/CredPopup';
import ImageUpload from './components/ImageUpload';
import { Toaster } from 'react-hot-toast';






function App() {

  const [posts,setPosts] = useState([])
  const [openSignup,setOpenSignup] = useState(false)
  const [openLogin,setOpenLogin] = useState(false)
  const [user,setUser] = useState(null)
  const [openUpload,setOpenUpload]  =useState(false)
  // const [comments,setComments] = useState([])

  useEffect( () => {
  // async function getPosts()
  // { 
    const postRef = collection(db, "posts")
    const postQuery= query(postRef,orderBy("timestamp"));
    const unsubscribe = onSnapshot(postQuery, (postQuerySnapshot) => {
      // console.log("data ")
      postQuerySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

      //   const commentRef = collection(db, "posts",`${doc.id}`,"comments")
      //   getDocs(commentRef).then(
      //   (commentQuerySnapshot) => {
      //     commentQuerySnapshot.forEach((doc) => {
      //       // doc.data() is never undefined for query doc snapshots
      //        console.log("data ")
      //       console.log(doc.id, " => ", doc.data())
      //        setComments(commentQuerySnapshot.docs.map(doc=> ({
      //       id: doc.id,
      //       comment: doc.data()
      //     }) ))
      //     });
      //   }
      // )
     

      setPosts(posts => [...posts,{id:doc.id,post:doc.data()}])

      });
      
      // setPosts(querySnapshot.docs.map(doc=> ({
      //   id: doc.id,
      //   post: doc.data()
      // }) ))
     
    });
  
// }

  //  getPosts()

  return () =>unsubscribe()

  },[])

  useEffect(() => {
    document.body.style.backgroundColor = '#EBEBEB'
  })

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
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
   { openSignup ? <CredPopup open= {openSignup} setOpen= {setOpenSignup} mode='signup'/> : null}
   { openLogin ? <CredPopup open= {openLogin} setOpen= {setOpenLogin} mode='login'/> : null}
   { openUpload ? <CredPopup open= {openUpload} setOpen= {setOpenUpload} mode='upload'/> : null}
    <div className='app__header'>
      <img className='app__headerImg' src={logo}/>

     { user ? 
       <div className='app__headerRightDiv'>
          <Button  onClick={() => setOpenUpload(true)}>
        Upload
       </Button>
         <Button onClick={() => {
        auth.signOut() 
       }}>
        Logout
      </Button></div> :
      <div className='app__headerRightDiv'>
       <Button  onClick={() => setOpenSignup(true)}>
        SignUp
       </Button>
       <Button onClick={() => setOpenLogin(true) } >
        Login
       </Button>
      </div>
      }
    </div>

    <div className='app__posts'>
    {
      posts ? posts.map( ({id,post}) => {
        console.log(post.userName)
       return( <Post key={id} postId={id} userName={post.userName} imageUrl={post.imageUrl} caption={post.caption}  />);  
      }) : <h1>loading...</h1>
      }
      </div>
     
    </div>
  );
}

export default App;
