import { Avatar, Box, Button, Input, InputBase } from '@mui/material';
import { addDoc, collection, doc as Doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import '../Post.css';
import Comment from './Comment';

const postStyle = {
  borderRadius: "8px"
}


function Post({postId,imageUrl,caption,ownerId}) {

  const [comments,setComments] = useState([])
  const [owner,setOwner] = useState({});
  const [postHover,setPostHover] = useState(false)

  const [commentValue,setCommentValue] = useState('')

  useEffect(() =>{
    const commentRef = collection(db, "posts",`${postId}`,"comments")
    const q= query(commentRef,orderBy("likes","desc"),limit(3));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setComments([])
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const senderRef = Doc(db, "users",`${doc.data().senderId}`)
        getDoc(senderRef).then(
          sender => {
              console.log(sender.data())
              setComments(comments => [...comments, {id: doc.id,comment: doc.data() ,sender: sender.data()}])
          }
        )
      });
     
    });

    return () =>unsubscribe()
  },[])

  useEffect(() => {
    const userRef = Doc(db,'users',`${ownerId}`)
    getDoc(userRef).then(
      doc => {
        setOwner({userName: doc.data().userName , photoUrl: doc.data().photoUrl})
      }
    )

  },[])

  const handleCommentPost = e => {
    const commentRef = collection(db, "posts",`${postId}`,"comments")
    const docRef = addDoc(commentRef,{
      text: commentValue,
      senderId: auth.currentUser.uid,
      timeStamp: serverTimestamp(),
      likes: 0,
    }).then(
      () => {
        setCommentValue('')
      }
    )
  }


  return (
    <Box sx={postStyle} className='post' onMouseEnter={() => setPostHover(true) } onMouseLeave={() => setPostHover(false)} >
       <div className='post__header'>
        <Avatar
        sx={{ width: 30, height: 30 }}
        className='post__avatar'
        alt={owner.userName}
        src={owner.photoUrl}/>
        <h4>{owner.userName}</h4>
        </div>

    <img className='post__img' src={imageUrl} />
    <div className='post__caption'>
       {caption} 
      </div> 
    
      { comments.length ? 
      <div className='post__commentSection' >
      
        {
        comments.map(({ id,comment,sender})=> {
            console.log(comment.text)
           return( 
            // <div key={id} className='post_comment'>
            //   <strong>{sender}</strong>{comment.text}
            //   </div>
            <Comment key={id} commentId={id} comment={comment} sender={sender}/>
           );  
           }) 
        }

        
      </div> :  null
      }

{postHover ?
        <div className='post__commentInput'>
          <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Add a comment"
          value={commentValue}
          onChange={e=> setCommentValue(e.target.value)}
          />
          <Button onClick={handleCommentPost} >Post</Button>
        </div> : <div></div>} 

    </Box>  
  )
}

export default Post