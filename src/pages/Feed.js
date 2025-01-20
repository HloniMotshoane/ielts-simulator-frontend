import React, { useEffect, useState } from "react";

export default function Feedback() {
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        // Retrieve feedback from localStorage
        const savedFeedback = JSON.parse(localStorage.getItem("feedback"));
        if (savedFeedback) {
            setFeedback(savedFeedback);
        }
    }, []);

    const downloadFeedback = () => {
        const blob = new Blob([JSON.stringify(feedback, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "feedback.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!feedback) return <div>Loading feedback...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 p-6">
            <h2 className="text-2xl font-bold">Feedback</h2>
            <section className="bg-[#BDD7E7] p-4 rounded-lg">
                <h3 className="font-bold mb-2">Your Results:</h3>
                <ul>
                    <li>Fluency: <strong>{feedback.results.fluency}/10</strong></li>
                    <li>Grammar: <strong>{feedback.results.grammar}/10</strong></li>
                    <li>Vocabulary: <strong>{feedback.results.vocabulary}/10</strong></li>
                    <li>Pronunciation: <strong>{feedback.results.pronunciation}/10</strong></li>
                </ul>
            </section>

            <section className="bg-[#BDD7E7] p-4 rounded-lg">
                <h3 className="font-bold mb-2">Improvement Advice:</h3>
                <ul className="list-disc ml-6">
                    {feedback.advice.map((advice, index) => (
                        <li key={index}>{advice}</li>
                    ))}
                </ul>
            </section>

            <button
                onClick={downloadFeedback}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Download Feedback
            </button>
        </div>
    );
}
