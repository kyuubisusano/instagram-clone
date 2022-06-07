import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import { collection, doc, increment, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'
import LikeIcon from '../favorite_border_black.svg'
import { db } from '../firebase'

function Comment({postId,commentId,comment,sender}) {
  
  const handleLikeBtn = async () => {
    const commentRef = doc(db, "posts",`${postId}`,"comments",`${commentId}`)
    await updateDoc(commentRef, {
      likes: increment(1)
  });

  }

  if(comment.timeStamp && comment.text)  
  return (
    <div style={{display: 'flex' ,}} className='post_comment'>
        <Avatar sx={{ mr:1 ,width:20 ,height:20 }}
                alt={sender.userName}
                src={sender.photoUrl}
                 />
        <div style={{width:'100%' ,maxWidth: 420, }} >
            <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: "nowrap", overflow:'hidden' , }}>
                
               <strong>{sender.userName}</strong> {comment.text}
            </div>
            <div style={{display: 'flex', alignItems:  'center'}}>
            <ReactTimeAgo date={comment.timeStamp.toDate()} locale="en-US" timeStyle="twitter" style={{fontSize: '15px'}}/>
            <p style={{marginInlineStart: 8}}>{comment.likes} likes</p>
            </div>
        </div>      
        
          <img  style={{marginInlineStart: 5,marginTop:0, marginBottom: 'auto', marginInlineEnd:0}} src={LikeIcon} onClick={handleLikeBtn}  />
        
    </div>
  )
  return (<div></div>)
}

export default Comment