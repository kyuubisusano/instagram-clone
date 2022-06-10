import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { collection, doc as Doc, getDoc, increment, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import LikeIcon from '../favorite_border_black.svg'
import { db } from '../firebase'

function Comment({postId,}) {

  const [comments,setComments] = useState([])
  const [owner,setOwner] = useState({});
  const [commentId,setCommentId] = useState('')
  useEffect(() =>{
    const commentRef = collection(db, "posts",`${postId}`,"comments")
    const q= query(commentRef,orderBy("likes","desc"),limit(3));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setComments([])
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const senderRef = Doc(db, "users",`${doc.data().senderId}`)
        setCommentId(doc.id)
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
  

  const handleLikeBtn = async () => {
    const commentRef = Doc(db, "posts",`${postId}`,"comments",`${commentId}`)
    await updateDoc(commentRef, {
      likes: increment(1)
  });

  }
  

  // render return
  return (
    <div>
   { comments.length ?comments.map(({ id,comment,sender}) => {

    if(comment.timeStamp && comment.text) 
    return (
      
      <div  key={id} style={{display: 'flex' ,}} className='post_comment'>
     <Avatar sx={{ml: 1, mr:1 ,width:20 ,height:20 }}
             alt={sender.userName}
             src={sender.photoUrl}
              />
     <div style={{width:'100%' ,maxWidth: 420, }} >
         <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: "nowrap", overflow:'hidden' , }}>
             
            <strong>{sender.userName}</strong> {comment.text}
         </div>
         <div style={{display: 'flex', alignItems:  'center'}}>
         <ReactTimeAgo date={comment.timeStamp.toDate()} locale="en-US" timeStyle="twitter" style={{fontSize: '12px'}}/>
         <p style={{marginInlineStart: 8, fontSize: '12px'}}>{comment.likes} likes</p>
         </div>
     </div>      
       <IconButton sx={{marginTop:0, marginBottom: 'auto', marginInlineEnd:0}} onClick={handleLikeBtn} > <FavoriteBorderOutlinedIcon/></IconButton>
       {/* <img  style={{marginInlineStart: 5,marginTop:0, marginBottom: 'auto', marginInlineEnd:0}} src={LikeIcon} onClick={handleLikeBtn}  /> */}
     
 </div>) 
  else
  return(<div></div>)
   }) : <div></div> 
   }
    </div>
  )
}

export default Comment