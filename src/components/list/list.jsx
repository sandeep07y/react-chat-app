import "./list.css"
import ChatList from "./chatList/chatlist"
import UserInfo from "./userInfo/userinfo"

const List = () => {
    return (
        <div className="list">
            <UserInfo/>
            <ChatList/>
        </div>
    )
}

export default List