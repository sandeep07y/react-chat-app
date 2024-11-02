import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useChatStore } from "../../lib/chatStore"
import { auth } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import "./detail.css"
import { db } from "../../lib/firebase"

const Detail = () => {

    const {currentUser} = useUserStore()

    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, 'users', currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id): arrayUnion(user.id),
            })
            changeBlock()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem, ducimus?</p>
            </div>

            <div className="info">
                {/* <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoitem">
                            <div className="photodetail">
                                <img src="https://fastly.picsum.photos/id/671/200/200.jpg?hmac=F8KUqkSzkLxagDZW5rOEHLjzFVxRZWnkrFPvq2BlnhE" alt="" />
                                <span>Lorem, ipsum.</span>
                            </div>
                            <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoitem">
                            <div className="photodetail">
                                <img src="https://fastly.picsum.photos/id/553/200/300.jpg?hmac=-A3VLW_dBmwUaXOe7bHhCt-lnmROrPFyTLslwNHVH1A" alt="" />
                                <span>Lorem, ipsum.</span>
                            </div>
                            <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoitem">
                            <div className="photodetail">
                                <img src="https://fastly.picsum.photos/id/250/200/300.jpg?hmac=igVdxs-AgITpHwPAZ80mpAfmhrGBvN_xThJlhp7vOqE" alt="" />
                                <span>Lorem, ipsum.</span>
                            </div>
                            <img src="./download.png" alt="" className="icon"/>
                        </div>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files </span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                </div> */}

                <button onClick={handleBlock}>
                    {
                        isCurrentUserBlocked? 'You are Blocked!' : isReceiverBlocked? 'User Blocked': 'Block User'
                    }
                </button>

                {/* <button className="logout" onClick={()=>auth.signOut()}>LogOut</button> */}
            </div>
            
        </div>
    )
}

export default Detail