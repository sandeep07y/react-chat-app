import "./userinfo.css";
import { useUserStore } from "../../../lib/userStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import upload from "../../../lib/upload";

const UserInfo = () => {
    const { currentUser } = useUserStore();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        file: null,
        url: currentUser.avatar,
    });

    // const bgURL = 'https://fastly.picsum.photos/id/56/2880/1920.jpg?hmac=BIplhYgNZ9bsjPXYhD0xx6M1yPgmg4HtthKkCeJp6Fk'
    // const bgURL2 = 'https://fastly.picsum.photos/id/112/4200/2800.jpg?hmac=8Qhr0ehkFOnlKO__aKhLMQTu2qzcAten9LHpBO6uk-k'
    // const bgURL3 = avatar.url

    // console.log(bgURL3)
    // useEffect(() => {
    //     document.body.style.backgroundImage = `url(${bgURL3})`
    // }, [bgURL])

    // Handle edit form submission
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const { newUsername, oldPassword, newPassword } = Object.fromEntries(formData);

            if (oldPassword && newPassword) {
                await reauthenticateUser(oldPassword);
                await updateUserPassword(newPassword);
            }
            
            await updateUserProfile(newUsername);
            toast.success("Details Updated!");
        } catch (error) {
            console.error("Error updating user details:", error);
            toast.error("Failed to update details. Please try again.");
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    };

    // Re-authenticate the user with old password
    const reauthenticateUser = async (oldPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        console.log("User authenticated successfully");
    };

    // Update user password
    const updateUserPassword = async (newPassword) => {
        const user = auth.currentUser;
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
    };

    // Update username and avatar in Firestore
    const updateUserProfile = async (newUsername) => {
        const imgUrl = avatar.file ? await upload(avatar.file) : currentUser.avatar;
        await updateDoc(doc(db, "users", currentUser.id), {
            username: newUsername || currentUser.username,
            avatar: imgUrl,
        });
        console.log("Profile updated successfully");
    };

    // Handle avatar image selection
    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar({
                file: file,
                url: URL.createObjectURL(file),
            });
        }
    };

    return (
        <div className="userinfo">
            <UserProfile
                avatarUrl={currentUser.avatar}
                username={currentUser.username}
                onEditClick={() => setEditMode((prev) => !prev)}
            />
            {editMode && (
                <EditUserForm
                    avatarUrl={avatar.url}
                    loading={loading}
                    onSubmit={handleEdit}
                    onAvatarChange={handleAvatarChange}
                    onClose={() => setEditMode(false)}
                />
            )}
        </div>
    );
};

// Component to display user profile
const UserProfile = ({ avatarUrl, username, onEditClick }) => (
   <> 
        <div className="user">
            <img src={avatarUrl || "./avatar.png"} alt="User Avatar" />
            <h2>{username}</h2>
        </div>
        <div className="icons">
            <img src="./edit.png" alt="Edit Icon" onClick={onEditClick} />
        </div>
    </>
);

// Component for editing user form
const EditUserForm = ({ avatarUrl, loading, onSubmit, onAvatarChange, onClose }) => (
    <div className="edituser">
        <h2>Edit Your Account Details</h2>
        <img src="./cross.png" alt="Close" className="cross" onClick={onClose} />
        <form onSubmit={onSubmit}>
            <label htmlFor="file">
                <img src={avatarUrl || "./avatar.png"} alt="Avatar Preview" />
                Upload New Image
            </label>
            <input type="file" id="file" style={{ display: "none" }} onChange={onAvatarChange} />
            <input type="text" name="newUsername" placeholder="Username" />
            <input type="password" name="oldPassword" placeholder="Old Password" />
            <input type="password" name="newPassword" placeholder="New Password" />
            <button disabled={loading}>{loading ? "Loading..." : "Edit Details"}</button>
        </form>

        <button className="logout" onClick={()=>auth.signOut()}>LogOut</button>
    </div>
);

export default UserInfo;
