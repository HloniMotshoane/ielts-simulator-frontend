import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';

export default function Test() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcription, setTranscription] = useState("");
    const [currentPart, setCurrentPart] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isResponseReceived, setIsResponseReceived] = useState(false);
    const [userResponses, setUserResponses] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [part3AudioCount, setPart3AudioCount] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioRef = useRef();
    const navigate = useNavigate();

    const questionsPart1 = [
        "Where do you come from?",
        "Could you tell me a little about your hometown?",
        "What do you like to do in your free time?"
    ];

    const questionsPart2 = [
        "Describe a memorable trip you've taken.",
        "Describe a website that you find useful.",
        "Describe a time you had to solve a problem.",
        "Talk about a person who inspires you."
    ];

    const questionsPart3 = [
        "Which sport do you like and why?",
        "What are some challenges people face in urban areas?",
        "How do you think education will evolve in the next decade?",
        "What is your opinion on social media's role in modern life?"
    ];

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            setAudioBlob(blob);
            const url = URL.createObjectURL(blob);
            setAudioURL(url);
            setIsRecording(false);
        };

        recorder.start();
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        }
    };

    useEffect(() => {
        if (audioBlob) {
            uploadAudio(); // Trigger upload when audioBlob changes
        }
    }, [audioBlob]);

    const uploadAudio = async () => {
        if (audioBlob) {
            const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
            console.log("Audio file being sent to backend:", file);

            const formData = new FormData();
            formData.append("audio", file);

            try {
                const response = await axios.post(
                    "http://127.0.0.1:5001/transcribe",
                    formData
                );

                console.log("Transcription response:", response.data);
                setTranscription(response.data.transcript);

                // Save user response for grading in Part 1 and Part 2
                if (currentPart === 1 || currentPart === 2) {
                    setUserResponses((prevResponses) => [
                        ...prevResponses,
                        { part: currentPart, question: getCurrentQuestion(), response: response.data.transcript },
                    ]);
                }

                // Add user response to chat history in Part 3
                if (currentPart === 3) {
                    setChatHistory((prevHistory) => [
                        ...prevHistory,
                        { sender: "user", message: response.data.transcript },
                    ]);
                    setPart3AudioCount((prevCount) => prevCount + 1); // Increment audio count for Part 3
                    // Now, get follow-up question from the backend
                    getFollowUpQuestion(response.data.transcript);
                }

                setIsResponseReceived(true); // Enable "Next" button after response is received
            } catch (error) {
                console.error("Error uploading audio:", error);
            }
        } else {
            console.log("No audio file to upload.");
        }
    };

    const getFollowUpQuestion = async (userResponse) => {
        try {
            const response = await axios.post("http://127.0.0.1:5001/follow_up", {
                text: userResponse,
            });
            const aiResponse = response.data.conversation_history.at(-1).parts[0];
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { sender: "ai", message: aiResponse },
            ]);
        } catch (error) {
            console.error("Error getting follow-up question:", error);
        }
    };


    const nextQuestion = () => {
        if (currentPart === 1) {
            if (currentQuestionIndex < questionsPart1.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsResponseReceived(false); // Reset response status
            } else {
                setCurrentPart(2); // Move to Part 2
                setCurrentQuestionIndex(0); // Reset question index
                setIsResponseReceived(false);
            }
        } else if (currentPart === 2) {
            if (currentQuestionIndex < questionsPart2.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsResponseReceived(false); // Reset response status
            } else {
                setCurrentPart(3); // Move to Part 3
                setCurrentQuestionIndex(0); // Reset question index
                setIsResponseReceived(false);
                // Start the conversation by adding AI's initial message
                setChatHistory((prevHistory) => [
                    ...prevHistory,
                    { sender: "", message: "" },
                ]);
            }
        } else if (currentPart === 3) {
            if (currentQuestionIndex < questionsPart3.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsResponseReceived(false); // Reset response status
            } else {
                console.log("Finished Part 3!");
                setIsResponseReceived(true); // Allow submitting after last question
            }
        }
        // Clear audioUrl when changing parts
        setAudioURL("");
        setTranscription(""); // Clear transcription
    };

    const submitResponses = () => {
        // Generate random feedback
        const randomResults = {
            fluency: Math.floor(Math.random() * 5) + 5,
            grammar: Math.floor(Math.random() * 5) + 5,
            vocabulary: Math.floor(Math.random() * 5) + 5,
            pronunciation: Math.floor(Math.random() * 5) + 5,
        };

        const improvementAdvice = [
            "Practice speaking with a native speaker to improve fluency.",
            "Review basic grammar rules and apply them in your speech.",
            "Expand your vocabulary by reading more books and articles.",
            "Focus on pronunciation by listening to podcasts and repeating after the speaker."
        ];

        // Save feedback in localStorage or pass via state
        localStorage.setItem('feedback', JSON.stringify({ results: randomResults, advice: improvementAdvice }));

        // Navigate to Feedback page
        navigate("/feedback");
    };

    const getCurrentQuestion = () => {
        if (currentPart === 1) return questionsPart1[currentQuestionIndex];
        if (currentPart === 2) return questionsPart2[currentQuestionIndex];
        if (currentPart === 3) return questionsPart3[currentQuestionIndex];
        return "";
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 p-6">
            {/* Header and Navigation */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Home
                </button>
                <h2 className="text-2xl font-bold">IELTS Speaking Test</h2>
            </div>

            {/* Instructions */}
            <section className="bg-[#BDD7E7] p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Test Mode Instructions</h2>
                <p>Answer the questions for each part. Click the microphone to record your answer, then click 'Next' to proceed.</p>
            </section>

            {/* Question Section */}
            <section className="bg-white p-4 rounded-lg">
                <h3 className="font-bold mb-2">Part {currentPart} Question:</h3>
                <p className="mb-4">
                    {currentPart === 1 && (
                        <div>{currentQuestionIndex + 1}. {questionsPart1[currentQuestionIndex]}</div>
                    )}
                    {currentPart === 2 && (
                        <div>{currentQuestionIndex + 1}. {questionsPart2[currentQuestionIndex]}</div>
                    )}
                    {currentPart === 3 && (
                        <div>{currentQuestionIndex + 1}. {questionsPart3[currentQuestionIndex]}</div>
                    )}
                </p>

                {/* Chat Interface for Part 3 */}
                {currentPart === 3 && (
                    <div className="flex flex-col space-y-4">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`flex ${chat.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div
                                    className={`max-w-xs p-4 rounded-lg ${chat.sender === 'ai' ? 'bg-blue-200' : 'bg-green-200'}`}
                                >
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Transcription and Audio Playback for Part 1 and Part 2 */}
                {(currentPart === 1 || currentPart === 2) && (
                    <>
                        <section className="bg-white p-4 rounded-lg min-h-[100px]">
                            <h3 className="font-bold mb-2">Transcription:</h3>
                            <p>{transcription || "Your transcription will appear here..."}</p>
                        </section>

                        {audioURL && (
                            <section className="bg-white p-4 rounded-lg">
                                <h3 className="font-bold mb-2">Audio Playback:</h3>
                                <audio controls src={audioURL} className="w-full" />
                            </section>
                        )}
                    </>
                )}

                <div className="flex items-center space-x-4">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#2171B5] hover:bg-[#1a5a8e]"
                            }`}
                    >
                        <Mic className="w-8 h-8 text-white" />
                    </button>
                    {currentPart !== 3 && (
                        <button
                            onClick={nextQuestion}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded : ""
                                }`}
                        >
                            Next
                        </button>
                    )}
                    {currentPart === 3 && part3AudioCount >= 5 && (
                        <button
                            onClick={submitResponses}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}
