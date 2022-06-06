import { Avatar, Box } from '@mui/material';
import { collection, doc as Doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import '../Post.css';

const postStyle = {
  borderRadius: "10px"
}


function Post({postId,imageUrl,caption,ownerId}) {

  const [comments,setComments] = useState([])
  const [owner,setOwner] = useState({});
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
              setComments(comments => [...comments, {id: doc.id,comment: doc.data() ,sender: sender.data().userName}])
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


  return (
    <Box sx={postStyle} className='post'>
       <div className='post__header'>
        <Avatar
        className='post__avatar'
        alt={owner.userName}
        src={owner.photoUrl}/>
        <h3>{owner.userName}</h3>
        </div>

    <img className='post__img' src={imageUrl} />
    <div className='post__caption'>
       {caption} 
      </div> 
    
    <div className='post_commentSection'>
      {
          comments ? comments.map(({ id,comment,sender})=> {
            console.log(comment.text)
           return( 
            <div key={id} className='post_comment'>
              <strong>{sender}</strong>{comment.text}
              </div>
           );  
          }) :  null
      }
    </div>
    </Box>  
  )
}

export default Post