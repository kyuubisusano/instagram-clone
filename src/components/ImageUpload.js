import { async } from '@firebase/util'
import { Button, createTheme, Input } from '@mui/material'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { auth, db, storage } from '../firebase'
import '../popup.css'

function ImageUpload({setOpen}) {

    const [image,setImage] = useState(null)
    const [caption,setCaption] = useState('')
    const [progress,setProgress] = useState(0)


    const handlefileChange = async e => {
      e.target.files[0] ?
          await setImage(e.target.files[0]) : console.log("error selecting file")
      
    }

    const handleUpload = e => {
        const imagesRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(imagesRef,image)
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress)
        },
        (error) => {
           console.log(error.code)
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);

              const docRef =  addDoc(collection(db,'posts'), {
                  imageUrl: downloadURL,
                  caption: caption,
                  ownerId: auth.currentUser.uid,
                  timestamp: serverTimestamp(),
                  likes: 0,

              })

              setProgress(0)
              setImage(null)
              setCaption('')
              setOpen(false)
              toast(`File uploaded`,{
                position: 'bottom-center',
  style: {
    
  },
            })
            });
            
          }
        )
        
    }

    const theme = createTheme({
      components: {
        // Name of the component
        Button: {
          styleOverrides: {
            // Name of the slot
            root: {
              // Some CSS
              color : "white"
            },
          },
        },
      },
    });

  return (
    <div>
        <form className='popup__form'>
            <Input type='file' onChange={handlefileChange} />
            <Input type='text' placeholder='Add a Caption..' onChange={e => {setCaption(e.target.value)} } value={caption}/>
            <progress value={progress} max="100" />
            <Button onClick={handleUpload}  >
                Upload
            </Button>
        </form>
        </div>
  )
}

export default ImageUpload