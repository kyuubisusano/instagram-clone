import { async } from '@firebase/util'
import { Button, createTheme, Input, InputBase } from '@mui/material'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable, uploadString } from 'firebase/storage'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import ReactImagePickerEditor from 'react-image-picker-editor'
import { auth, db, storage } from '../firebase'
import '../popup.css'
import 'react-image-picker-editor/dist/index.css'

function ImageUpload({setOpen}) {

    const [image,setImage] = useState(null)
    const [caption,setCaption] = useState('')
    const [progress,setProgress] = useState(0)
    const [imageSrc, setImageSrc] = useState('');
    const initialImage = ''
    const handlefileChange = async (e) => {
      e.target.files[0] ?
      await setImage(e.target.files[0]) : console.log("error selecting file")
      
    }

    const handleUpload = e => {
      console.log('rrr ',image)
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

    const config2 = {
      borderRadius: '8px',
      language: 'en',
      width: '330px',
      height: '250px',
      objectFit: 'contain',
      compressInitial: null,
      hideDownloadBtn: true,
      hideAddBtn: true,
      hideEditBtn: true,
    };

  return (
    <div>
        <form className='popup__form'>
            <Input type='file' onChange={handlefileChange} />
            {/* < ReactImagePickerEditor
            config={config2}
            imageSrcProp={initialImage}
            imageChanged={ async (newDataUri) => {
              // console.log('image')
           
              console.log('desperate effort ',initialImage)
              console.log('newdata ',newDataUri, " yes")
              
              setImage(newDataUri)
              // handlefileChange(newDataUri)
              // console.log('the image ',image)
              // setImage(newDataUri) 
              // console.log('new image ',image)  
              // newDataUri.target.files[0] ?
              // await setImage(newDataUri.target.files[0]) : console.log("error selecting file")
            }} 
            /> */}
            {/* <Input type='text' placeholder='Add a Caption..' onChange={e => {setCaption(e.target.value)} } value={caption}/> */}
            <InputBase
            type='text'
            sx={{ ml: 1, width: '100%' ,mt:2 ,}}
            multiline
            maxRows={4}
            placeholder="Add a Caption.."
            value={caption}
            onChange={ e => setCaption(e.target.value) }
            />
            { progress===0 ? null : <progress value={progress} max="100" /> }
            <Button sx={{mt: 1}} variant='contained' onClick={handleUpload}  >
                Upload
            </Button>
        </form>
        </div>
  )
}

export default ImageUpload