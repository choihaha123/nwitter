import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);


    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok){
            //delete nweet
            await deleteDoc(NweetTextRef);
            if(nweetObj.attachmentUrl)
            {
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
            text: newNweet,
        });
        setEditing(false);
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewNweet(value);
    };

    return (
    <div>
        {
            editing ? (
            <>
             <form onSubmit={onSubmit}>
                 <input onChange={onChange} type="text" value={newNweet} placeholder="edit your nweet" required/>
                 <input type="submit" value="Update Nweet" />
             </form>
             
             <button onClick={toggleEditing}>Cancel</button>
             
            </>
            ) : (
            <>
             <h4>{nweetObj.text}</h4>
             {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" />}
             {isOwner && (
                 <>
                 <button onClick={onDeleteClick}>Delete Nweet</button>
                 <button onClick={toggleEditing}>Edit Nweet</button>
                 </>
             )}
            </>)
        }
    </div>
    );
};

export default Nweet;