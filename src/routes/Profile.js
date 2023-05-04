import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({userObj, refreshUser}) => {

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const navigate = useNavigate();
    
    const onLogOutClick = () => {
        signOut(authService);
        navigate("/");
    }

    const getMyNweets = async() => {
        const q = query(collection(dbService, "nweets"), where("creatorId","==",userObj.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id,"=>",doc.data());
        }); 
    };
    useEffect(() => {
        getMyNweets();
    }, [])

    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName)
        {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUser();
        }
    };

    const onChange = (event) => {
        setNewDisplayName(event.target.value);
    };

    return (
    <>
    <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
        <input type="submit" value="Update Profile" />
    </form>
    <button onClick={onLogOutClick}>Log Out</button>
    </>
    );
};
export default Profile;