import { Box, Container, VStack, Button, Input, HStack } from "@chakra-ui/react"
import Message from "./components/Message";
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot,query,orderBy } from "firebase/firestore"

import { app } from './firebase'
import { useEffect, useRef, useState } from "react";
// import { async } from "@firebase/util";
const auth = getAuth(app)
const db = getFirestore(app)

const loginHandler = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
}

const logoutHandler = () => {
  signOut(auth)
}


function App() {
  const [user, setuser] = useState(false)
  const [message, setmessage] = useState("")
  const [messages, setmessages] = useState([])
  const divForScroll = useRef(null)

  const submitHandler = async (e) => {
    e.preventDefault();

    setmessage("")
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL, // Note: 'photoURL' should be in lowercase
        createdAt: serverTimestamp()


      });
      
      divForScroll.current.scrollIntoView({behaviour:"smooth"})
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setuser(data)
    })
    const unsubscribeForMessages = onSnapshot(q, (snap) => {
      setmessages(
        snap.docs.map((item) => {
          const id = item.id
          return { id, ...item.data() }
        })
      )
    })
    return () => {
      unsubscribe()
      unsubscribeForMessages()
    }
  },[])


  return (
    <Box bg={"red.50"}>
      {
        user ? (<Container bg={"white"} h={"100vh"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button w={"full"} colorScheme="red" onClick={logoutHandler}>
              Logout
            </Button>
            <VStack h={"full"} w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
              display:"none"
            }}}>
              {
                messages.map(item => (

                  <Message key={item.id} user={item.uid === user.uid ? 'me' : "other"} text={item.text} uri={item.uri} />
                ))
              }
            <div ref={divForScroll}></div>
            </VStack>
              
            <form onSubmit={submitHandler} style={{
              // backgroundColor:"navy",
              width: "100%"
            }}>
              <HStack>
                <Input value={message} onChange={(e) => setmessage(e.target.value)} placeholder="Enter a message..." />
                <Button colorScheme="purple" type="submit">Send</Button>
              </HStack>
            </form>
          </VStack>

        </Container>) : <VStack justifyContent={"center"} h={"100vh"} bg={"blue.100"} >
          <Button onClick={loginHandler} colorScheme="red">Sign In with Google</Button>
        </VStack>
      }
    </Box>
  );
}

export default App;
