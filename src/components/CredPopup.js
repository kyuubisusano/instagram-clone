import { Modal ,Button, Input, Typography, Box} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import '../App.css';
import { auth } from '../firebase';
import logo from '../Instagram-Logo.png';
import ImageUpload from './ImageUpload';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function CredPopup({open, setOpen,mode}) {
    // const classes = useStyles();
    // const [style] = React.useState(getModalStyle);

    const [email,setEmail] = useState('');
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [bodyState,setBodyState] = useState(false);
    let body = null
    const handleSignup = e => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth , email ,password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: userName,
          })
          .then(() => {
            setOpen(false)
          })
          .catch((error) => {
            console.log("inside " + error.messsage);
            console.log("inside " + error.code);
          })
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
  style: {},
            })
            setOpen(false)
        })
         .catch((error) => {
    console.log("root "  + error.messsage);
    alert("root "  +error.code);
        });

    }

    // useEffect(() => {
    //     async function getMode() {switch (mode) {
    //         case 'signup':
    //             body = await signupBody
    //             setBodyState(true)
    //             break;
    //         case 'login':
    //             body = await loginBody
    //             setBodyState(true)
    //             console.log(body);
    //             console.log(`done`)
    //             break;
    //         case 'upload':
    //             body = await uploadBody
    //             setBodyState(true)
    //             break;
    //         default:

                
    //     }}

    //     getMode()
    // },[])

    const signupBody = (
        <Box sx={style}>
        <form className='app_credPopup'>
            <img className='app__formImg' src={logo}/>
            <Input type="text" placeholder='User Name' value={userName} onChange={e => setUserName(e.target.value)}/>
            <Input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            <Input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type='submit' onClick={handleSignup}>Sign Up</Button>
        </form>
      </Box>
    );
    const loginBody = (
        <Box sx={style}>
        <form className='app_credPopup'>
            <img className='app__formImg' src={logo}/>
            <Input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            <Input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <Button type='submit' onClick={handleLogin} >Login</Button>
        </form>
      </Box>
    );

    const uploadBody = (
        <Box sx={style} >
        <ImageUpload setOpen={setOpen} />
      </Box>
    );
  return (
    <div>
         <Modal
  open={open}
  onClose={() => setOpen(false)}
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

export default CredPopup