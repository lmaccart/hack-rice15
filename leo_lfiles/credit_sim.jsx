import React, { useState, useEffect } from 'react';

// NOTE: For the 'VT323' font to work, you'll need to add the following line
// to the <head> of your main index.html file:
// <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">

const CreditScoreSimulator = () => {
    // --- STATE MANAGEMENT ---
    // State for each of the five credit factors controlled by sliders.
    const [paymentHistory, setPaymentHistory] = useState(100);
    const [creditUtilization, setCreditUtilization] = useState(10);
    const [creditHistoryLength, setCreditHistoryLength] = useState(8);
    const [creditMix, setCreditMix] = useState(4);
    const [newCredit, setNewCredit] = useState(1);

    // State for the calculated score and its associated display properties.
    const [score, setScore] = useState(0);
    const [scoreInfo, setScoreInfo] = useState({
        category: '...',
        description: 'Adjust sliders to begin.',
        colorClass: 'bg-gray-200',
        textColorClass: 'text-gray-800'
    });

    // --- SCORE CALCULATION LOGIC ---
    // This effect hook recalculates the score whenever a slider's value changes.
    useEffect(() => {
        // FICO score constants
        const BASE_SCORE = 300;
        const MAX_SCORE = 850;
        const SCORE_RANGE = MAX_SCORE - BASE_SCORE; // 550 points available

        // Factor weights based on the FICO model
        const WEIGHTS = {
            paymentHistory: 0.35,
            creditUtilization: 0.30,
            creditHistoryLength: 0.15,
            creditMix: 0.10,
            newCredit: 0.10
        };

        // 1. Payment History (35%)
        const phScore = (paymentHistory - 50) / 50;

        // 2. Credit Utilization (30%)
        const cuScore = Math.pow(1 - (creditUtilization / 100), 2);

        // 3. Length of Credit History (15%)
        const chlScore = Math.min(creditHistoryLength / 15, 1);

        // 4. Credit Mix (10%)
        const cmScore = Math.min(creditMix / 5, 1);

        // 5. New Credit (10%)
        const ncScore = 1 - Math.min(newCredit / 5, 1);

        // Sum the weighted scores
        const totalWeightedScore =
            (phScore * WEIGHTS.paymentHistory) +
            (cuScore * WEIGHTS.creditUtilization) +
            (chlScore * WEIGHTS.creditHistoryLength) +
            (cmScore * WEIGHTS.creditMix) +
            (ncScore * WEIGHTS.newCredit);

        // Calculate the final score
        const finalScore = Math.round(BASE_SCORE + (totalWeightedScore * SCORE_RANGE));
        setScore(finalScore);
        updateDisplay(finalScore);

    }, [paymentHistory, creditUtilization, creditHistoryLength, creditMix, newCredit]);

    // --- UI UPDATE LOGIC ---
    // Updates the score category, description, and colors based on the score.
    const updateDisplay = (currentScore) => {
        let newInfo = {};
        if (currentScore >= 800) {
            newInfo = {
                category: 'Excellent',
                description: 'Exceptional score. You are likely to be offered the best interest rates and terms.',
                colorClass: 'bg-[#CAE7B9]',
                textColorClass: 'text-gray-800'
            };
        } else if (currentScore >= 740) {
            newInfo = {
                category: 'Very Good',
                description: 'Very strong score. You are considered a low-risk borrower.',
                colorClass: 'bg-[#CAE7B9]',
                textColorClass: 'text-gray-800'
            };
        } else if (currentScore >= 670) {
            newInfo = {
                category: 'Good',
                description: 'This score is good. Most lenders will approve loans at competitive rates.',
                colorClass: 'bg-[#7E7F9A]',
                textColorClass: 'text-white'
            };
        } else if (currentScore >= 580) {
            newInfo = {
                category: 'Fair',
                description: 'Subprime borrower. You may find it harder to get approved for credit.',
                colorClass: 'bg-[#F3DE8A]',
                textColorClass: 'text-gray-800'
            };
        } else {
            newInfo = {
                category: 'Poor',
                description: 'High credit risk. It may be difficult to obtain new credit.',
                colorClass: 'bg-[#EB9486]',
                textColorClass: 'text-gray-800'
            };
        }
        setScoreInfo(newInfo);
    };

    // --- RENDER ---
    return (
        <>
            <style>{`
                body { font-family: 'VT323', monospace; background-color: #97A7B3; }
                .gba-container { background-color: #CAE7B9; border: 4px solid #5a5b6d; padding: 8px; }
                .gba-title-bar { background-color: #7E7F9A; color: #F3DE8A; padding: 4px 8px; margin-bottom: 16px; text-align: center; border: 3px solid #5a5b6d; }
                .gba-box { border: 3px solid #5a5b6d; }
                input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 10px; background: #97A7B3; border: 2px solid #5a5b6d; cursor: pointer; }
                input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 28px; background: #7E7F9A; border: 2px solid #5a5b6d; }
                input[type='range']::-moz-range-thumb { width: 18px; height: 28px; background: #7E7F9A; border: 2px solid #5a5b6d; cursor: pointer; }
                .score-box { width: 220px; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: background-color 0.3s ease; }
                .score-text { font-size: 4rem; line-height: 1; }
                .score-label { font-size: 1.25rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
            `}</style>

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-4xl mx-auto gba-container">
                    <div className="gba-title-bar">
                        <h1 className="text-3xl">CREDIT SIMULATOR</h1>
                    </div>
                    <div className="p-2 md:p-4">
                        <p className="text-center text-xl mb-6 text-gray-800">Adjust the factors below to simulate a credit score.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                            {/* Sliders Column */}
                            <div className="space-y-2">
                                {/* Payment History Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1 text-xl text-gray-800">
                                        <label htmlFor="paymentHistory">Payment History</label>
                                        <span className="bg-[#F3DE8A] gba-box px-3 py-1">{paymentHistory}%</span>
                                    </div>
                                    <input id="paymentHistory" type="range" min="50" max="100" value={paymentHistory} onChange={(e) => setPaymentHistory(parseInt(e.target.value))} className="w-full" />
                                    <p className="text-sm text-gray-800/90 mt-1 px-1">Do you pay your bills on time? This is the most important factor in your score.</p>
                                </div>
                                {/* Credit Utilization Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1 text-xl text-gray-800">
                                        <label htmlFor="creditUtilization">Credit Utilization</label>
                                        <span className="bg-[#F3DE8A] gba-box px-3 py-1">{creditUtilization}%</span>
                                    </div>
                                    <input id="creditUtilization" type="range" min="0" max="100" value={creditUtilization} onChange={(e) => setCreditUtilization(parseInt(e.target.value))} className="w-full" />
                                    <p className="text-sm text-gray-800/90 mt-1 px-1">How much of your available credit are you using? Experts suggest keeping this below 30%.</p>
                                </div>
                                {/* Credit History Length Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1 text-xl text-gray-800">
                                        <label htmlFor="creditHistoryLength">History Length</label>
                                        <span className="bg-[#F3DE8A] gba-box px-3 py-1">{creditHistoryLength} {creditHistoryLength === 1 ? 'year' : 'years'}</span>
                                    </div>
                                    <input id="creditHistoryLength" type="range" min="0" max="25" value={creditHistoryLength} onChange={(e) => setCreditHistoryLength(parseInt(e.target.value))} className="w-full" />
                                    <p className="text-sm text-gray-800/90 mt-1 px-1">What is the average age of your accounts? A longer history is generally better.</p>
                                </div>
                                {/* Credit Mix Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1 text-xl text-gray-800">
                                        <label htmlFor="creditMix">Credit Mix</label>
                                        <span className="bg-[#F3DE8A] gba-box px-3 py-1">{creditMix} {creditMix === 1 ? 'type' : 'types'}</span>
                                    </div>
                                    <input id="creditMix" type="range" min="0" max="10" value={creditMix} onChange={(e) => setCreditMix(parseInt(e.target.value))} className="w-full" />
                                    <p className="text-sm text-gray-800/90 mt-1 px-1">A mix of different credit types, like credit cards and loans, can improve your score.</p>
                                </div>
                                {/* New Credit Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1 text-xl text-gray-800">
                                        <label htmlFor="newCredit">New Credit</label>
                                        <span className="bg-[#F3DE8A] gba-box px-3 py-1">{newCredit} {newCredit === 1 ? 'inquiry' : 'inquiries'}</span>
                                    </div>
                                    <input id="newCredit" type="range" min="0" max="10" value={newCredit} onChange={(e) => setNewCredit(parseInt(e.target.value))} className="w-full" />
                                    <p className="text-sm text-gray-800/90 mt-1 px-1">How many new accounts have you opened recently? Too many can indicate risk.</p>
                                </div>
                            </div>

                            {/* Score Display Column */}
                            <div className="flex flex-col items-center justify-center bg-white/30 p-4 gba-box">
                                <div className={`score-box gba-box ${scoreInfo.colorClass}`}>
                                    <span className={`score-text ${scoreInfo.textColorClass}`}>{score}</span>
                                    <span className={`score-label ${scoreInfo.textColorClass}`}>{scoreInfo.category}</span>
                                </div>
                                <p className="text-center text-gray-800 mt-4 max-w-xs text-lg h-20">{scoreInfo.description}</p>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-8 pt-2">
                            <p className="text-xs text-gray-800/80 text-center">
                                <strong>Disclaimer:</strong> This is an educational tool. The score is an approximation and not a real credit score. This is not financial advice. Consult a qualified professional for personalized advice.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreditScoreSimulator;
