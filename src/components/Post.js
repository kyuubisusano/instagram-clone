import { Avatar } from '@mui/material';
import { collection, doc as Doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import '../Post.css';

function Post({postId,userName,imageUrl,caption}) {

  const [comments,setComments] = useState([])

  useEffect(() =>{
    const commentRef = collection(db, "posts",`${postId}`,"comments")
    const q= query(commentRef,orderBy("likes","desc"),limit(3));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("data ")
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        
        const senderRef = Doc(db, "users",`${doc.data().senderID}`)
        getDoc(senderRef).then(
          sender => {
              console.log(sender.data())
              setComments(comments => [...comments, {id: doc.id,comment: doc.data() ,sender: sender.data().userName}])
          }
        )

      
       
      

      });
      // setComments(querySnapshot.docs.map(doc => ( {id: doc.id,comment: doc.data() })) )
     
    });

    return () =>unsubscribe()
  },[])


  return (
    <div className='post'>
       <div className='post__header'>
        <Avatar
        className='post__avatar'
        alt='user'
        src='https://images.panda.org/assets/images/pages/welcome/orangutan_1600x1000_279157.jpg'/>
        <h3>{userName}</h3>
        </div>

    <img className='post__img' src={imageUrl} />
    <div className='post__caption'>
      <strong>{userName}</strong> {caption} 
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
    </div>  
  )
}

export default Post