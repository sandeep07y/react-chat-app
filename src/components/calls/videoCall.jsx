import { useEffect, useRef, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, onSnapshot, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import './videocall.css'
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from '../../lib/userStore';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const VideoCall = () => {
    const [callId, setCallId] = useState('');
    const [incomingCall, setIncomingCall] = useState(false);

    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
    const {currentUser} = useUserStore();

    const localStream = useRef(null);
    const remoteStream = useRef(null);
    const pc = useRef(new RTCPeerConnection(configuration));
    
    // Fetch current user ID (assuming authentication is set up)
    const currentUserId = currentUser;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localStream.current.srcObject = stream;
                stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
            });

        pc.current.ontrack = (event) => {
            remoteStream.current.srcObject = event.streams[0];
        };

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                const candidateData = event.candidate.toJSON();
                addDoc(collection(db, `calls/${callId}/candidates`), candidateData);
            }
        };

        // Listen for incoming calls
        const callsRef = collection(db, 'calls');
        const unsubscribe = onSnapshot(callsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const callData = change.doc.data();
                    if (callData.receiverId === currentUserId && !callData.answer) {
                        setIncomingCall(true); // Set state for incoming call
                        setCallId(change.doc.id); // Store the call ID
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [callId, currentUserId]);

    // Create a new call (host) 
    const initiateCall = async (receiverId) => {
        const callDoc = doc(collection(db, 'calls'));
        setCallId(callDoc.id);

        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

        await setDoc(callDoc, {
            callerId: currentUserId,
            receiverId: receiverId,
            offer: offerDescription,
        });

        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (data?.answer) {
                pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });
    };

    const joinCall = async (callData, callId) => {
        setCallId(callId);

        await pc.current.setRemoteDescription(new RTCSessionDescription(callData.offer));

        const answerDescription = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answerDescription);

        await updateDoc(doc(db, 'calls', callId), { answer: answerDescription });

        onSnapshot(collection(db, `calls/${callId}/candidates`), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current.addIceCandidate(candidate);
                }
            });
        });

        setIncomingCall(false);
    };

    return (
        <div className='videoContainer'>
            
            <h1>Video Call</h1>
            
            <div className="videos">
                <video ref={localStream} autoPlay playsInline muted />

                <video ref={remoteStream} autoPlay playsInline />
            </div>
            <div className="controls">
                {/* <button onClick={() => initiateCall(user)} className='mute'>
                    Initiate Call
                </button> */}
                {/* <button onClick={createCall} className='mute'>Create Call</button>
                <input value={callId} onChange={(e) => setCallId(e.target.value)} placeholder="Enter Call ID" />
                <button onClick={() => joinCall(callId)} className='join'>Join Call</button> */}
                {/* <button onClick={() => joinCall(callId)} className='end'>Join Call/Close</button> */}

                {incomingCall ? (
                <button onClick={joinCall} className='end'>Join Call</button>
                    ) : (
                        <button onClick={() => initiateCall(user)} className='end'>
                            Initiate Call
                        </button>
                    )}
            </div>
        </div>
    );
};

export default VideoCall;
