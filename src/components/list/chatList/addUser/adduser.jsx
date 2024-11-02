import { collection, where, getDocs, query, serverTimestamp, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import "./adduser.css"
import { useState } from "react"
import { db } from "../../../../lib/firebase"
import { useUserStore } from "../../../../lib/userStore"

const AddUser = () => {
    const [user, setUser] = useState(null)
    const {currentUser} = useUserStore() 

    const handleSearch = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("username")

        try {
            const userRef = collection(db, "users")

            const q = query(userRef, where("username", "==", username))

            const querySnapShot = await getDocs(q)

            if (!querySnapShot.empty) { 
                setUser(querySnapShot.docs[0].data())
            }
        } catch (err) {
            console.log(err)
        }

    }

    const handleAdd = async (e) => {
        e.preventDefault()

        const chatRef = collection(db, "chats")
        const userChatsRef = collection(db, "userchats")

        try {
            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(userChatsRef, user.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverID: currentUser.id,
                    updaedAt: Date.now(),
                })
            })

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverID: user.id,
                    updaedAt: Date.now(),
                })
            })

            
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="adduser">
            <form onSubmit={handleSearch}>
                <input type="text" name="username" placeholder="Username" />
                <button>Search</button>
            </form>
            { user && 
            <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"}/>
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div> 
            }
        </div>
    )
}

export default AddUser