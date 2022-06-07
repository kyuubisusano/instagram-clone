import { Avatar, Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'

function Comment({id,comment,sender}) {

  if(comment.timeStamp && comment.text)  
  return (
    <Box sx={{display: 'flex' }} className='post_comment'>
        <Avatar sx={{ mr:1 ,width:20 ,height:20 }}
                alt={sender.userName}
                src={sender.photoUrl}
                 />
        <Box >
            <Box sx={{alignItems: 'center',display: 'flex' }}>
                
               <strong>{sender.userName}</strong> {comment.text}
            </Box>
            <ReactTimeAgo date={comment.timeStamp.toDate()} locale="en-US" timeStyle="twitter" style={{fontSize: '15px'}}/>
            <Button>like</Button>
        </Box>      
    </Box>
  )
  return (<div></div>)
}

export default Comment