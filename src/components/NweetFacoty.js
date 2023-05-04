import React from "react";
import { v4 } from 'uuid';
import { useState } from "react";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {target:{files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl="";

        if(attachment !== "")
        {
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };

        try {
            const docRef = await addDoc(collection(dbService, "nweets"), nweetObj); //db에 doc 저장 시도(addDoc)
            console.log("Document written with ID: ", docRef.id);
          } catch (error) {
            console.error("Error adding document: ", error);
          }
        setNweet("");
        setAttachment("");

    };


    return (
        <form onSubmit={onSubmit}>
                <input type="text" placeholder="What's on your email?" maxLength={120} onChange={onChange} value={nweet}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" alt="attached file img"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
    );

};

export default NweetFactory;