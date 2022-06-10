import { Modal ,Button, Input,  Box, Backdrop, InputBase} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes,} from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import '../App.css';

import logo from '../Instagram-Logo.png';
import ImageUpload from './ImageUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { auth, db, storage } from '../firebase'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';


  const modalBaseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 8,
    p: 4,
  }


function ModalPopup
({open, setOpen,mode}) {


    const [email,setEmail] = useState('');
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [image,setImage] = useState(null)
    const [imageSelected,setImageSelected] = useState('');
    const [imageHover,setImageHover]  =useState(false)


    const handleSignup = e => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth , email ,password)
        .then((userCredential) => {
          const user = userCredential.user;
          const imagesRef = ref(storage, `users/${image.name}`);
          const uploadTask = uploadBytes(imagesRef,image)
          uploadTask.then(
            (snapshot) =>{
              console.log("worjing ")
              getDownloadURL(snapshot.ref).then((downloadURL) => {
                updateProfile(user, {
                  displayName: userName,
                  photoURL: downloadURL,
                })
                .then(() => {
                  console.log('user ui ',user.uid)
                  setDoc(doc(db,'users',`${user.uid}`), {
                    photoUrl: downloadURL,
                    email: email,
                    userName: userName,
                    dateCreated: serverTimestamp(),
                    likes: 0,
                    followers: 0,
                    following: 0
  
                })
                  setOpen(false)
                })
                .catch((error) => {
                  console.log("inside " + error.messsage);
                  console.log("inside " + error.code);
                })
              })
            }
          )
         
        })
        .catch((error) => {
            console.log("root "  + error.messsage);
            alert("root "  +error.code);
        })
    }

    const handleLogin = e =>{
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            toast(`welcome back ❤️ ${auth.currentUser.displayName} `,{
                position: 'top-center',
                // Styling
                modalBaseStyle: {},
            })
            setOpen(false)
        })
         .catch((error) => {
    console.log("root "  + error.messsage);
    alert("root "  +error.code);
        });

    }

    const handlefileChange = async (e) => {
      console.log(e.target.files[1] )
      e.target.files[0] ?
      await setImage(e.target.files[0]) : console.log("error selecting file")
      e.target.files[0] ? setImageSelected(URL.createObjectURL(e.target.files[0])) :setImageSelected('')
    
    }


    const signupBody = (
        <Box sx={modalBaseStyle}>
        <form className='app_credPopup'>
            <img className='app__formImg' src={logo} alt='Instagram'/>
            { !image ?<label style={{
              borderRadius: '50%',
              border: '1px solid #ccc',
              alignItems: 'center',
              cursor: 'pointer',
              width: 60,
              height: 60,
              alignSelf: 'center',
              display:'flex'
            }}>  
             <CameraAltIcon sx={{ color:'lightgray', fontSize: 50, ml: 'auto' , mr:'auto'}}/> 
             <InputBase sx={{display: 'none'}} type='file' onChange={handlefileChange} /> 
            </label> :
            <div style={
              {
                display:'flex',
                alignSelf: 'center'
              }
            
            }
            onMouseEnter={()=> setImageHover(true)}
            onMouseLeave={()=>setImageHover(false)}
            >
            <img 
            style={{    
              alignSelf:'center',
              borderRadius: '100%',
              width: '120px',
            height: '120px',
            // position: 'relative',
          }}
         
          alt={userName}
            src={imageSelected}/>
            { imageHover && <label style={{
          
              alignItems: 'center',
              cursor: 'pointer',
              width: 60,
              height: 60,
              alignSelf: 'center',
              display:'flex',
              position: 'absolute',
              left: '56%',
              right: '44%',
              marginLeft: 'auto',
              marginBRight: 'auto'
            }}>  
             <CameraAltIcon sx={{ color:'#B7B7B7', fontSize: 50, ml: 'auto' , mr:'auto'}}/> 
             <InputBase sx={{display: 'none'}} type='file' onChange={handlefileChange} /> 
            </label>}
            </div>
            }
            <Input type="text" placeholder='User Name' value={userName} onChange={e => setUserName(e.target.value)}/>
            <Input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            <Input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type='submit' onClick={handleSignup}>Sign Up</Button>
        </form>
      </Box>
    );
    const loginBody = (
        <Box sx={modalBaseStyle}>
        <form className='app_credPopup'>
            <img className='app__formImg' src={logo} alt='Instagram'/>
            <Input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            <Input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type='submit' onClick={handleLogin} >Login</Button>
        </form>
      </Box>
    );

    const uploadBody = (
        <Box sx={modalBaseStyle} >
        <ImageUpload setOpen={setOpen} />
      </Box>
    );
  return (
    <div>
         <Modal
  open={open}
  onClose={() => setOpen(false)}
  closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
>
      
      {
          ( () => {
              switch (mode) {
            case 'signup':
                return signupBody
            case 'login':
                return loginBody
            case 'upload':
                return uploadBody
            default:
                return <div></div>
                
        }
    })()
      }
</Modal>
    </div>
  )
}

export default ModalPopup
