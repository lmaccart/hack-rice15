import React, { useState, useCallback, useEffect } from 'react';

// This would typically be in your public/index.html file's <head>
const GlobalStyles = () => (
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
body {
font-family: 'Press Start 2P', cursive;
background-color: #DFD3C3;
/* A subtle pixelated background pattern */
background-image:
linear-gradient(45deg, #C7B9A9 25%, transparent 25%),
linear-gradient(-45deg, #C7B9A9 25%, transparent 25%),
linear-gradient(45deg, transparent 75%, #C7B9A9 75%),
linear-gradient(-45deg, transparent 75%, #C7B9A9 75%);
background-size: 4px 4px;
/* Antialiasing off for crisp fonts */
-webkit-font-smoothing: none;
-moz-osx-font-smoothing: grayscale;
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-crisp-edges;
image-rendering: pixelated;
image-rendering: crisp-edges;
}

/* Custom class for the pixelated shadow effect */
.pixel-border {
border: 4px solid #2c2c2c;
box-shadow: 6px 6px 0px #2c2c2c;
}

/* Custom styles for inputs to match the aesthetic */
.pixel-input {
border: 3px solid #2c2c2c;
border-radius: 0;
background-color: #f1f1f1;
padding: 10px;
font-family: 'Press Start 2P', cursive;
font-size: 0.75rem;
color: #2c2c2c;
width: 100%;
}
.pixel-input:focus {
outline: none;
background-color: #fff;
box-shadow: inset 3px 3px 0 #888;
}

/* Custom styles for buttons */
.pixel-button {
display: inline-block;
color: #ffffff;
text-align: center;
padding: 12px 16px;
font-size: 0.75rem;
border: 3px solid #2c2c2c;
box-shadow: 4px 4px 0px #2c2c2c;
position: relative;
transition: all 0.1s ease-in-out;
}
.pixel-button:hover {
box-shadow: 2px 2px 0px #2c2c2c;
top: 2px;
left: 2px;
}
.pixel-button:active {
box-shadow: 0px 0px 0px #2c2c2c;
top: 4px;
left: 4px;
}
.pixel-button:disabled {
background-color: #9E9E9E !important;
color: #D6D6D6;
cursor: not-allowed;
box-shadow: none;
top: 4px;
left: 4px;
}
.step-card {
transition: opacity 0.5s, transform 0.5s;
}
.hidden-step {
opacity: 0;
transform: scale(0.95);
pointer-events: none;
position: absolute;
width: 100%;
}
/* Piggy Bank Spinner */
.piggy-spinner {
width: 48px;
height: 48px;
overflow: hidden;
margin: 0 auto;
position: relative;
}

.piggy-spinner svg {
position: absolute;
top: 0;
left: 0;
width: 192px; /* 48px * 4 frames */
height: 48px;
animation: spin-piggy 1s steps(4) infinite;
}

@keyframes spin-piggy {
from { transform: translateX(0px); }
to { transform: translateX(-192px); }
}
`}</style>
);

// --- Child Components ---

const Header = () => (
<header className="text-center mb-10">
<h1 className="text-3xl font-bold text-gray-800 tracking-wider">CREDITRO IDENTITY SERVICE</h1>
<p className="text-gray-700 mt-3">Document Cross-Validation</p>
</header>
);

const Step1Details = ({ onFormSubmit }) => {
const handleSubmit = (e) => {
e.preventDefault();
const formData = new FormData(e.target);
const userData = {
fullName: formData.get('fullName'),
address: formData.get('address'),
dob: formData.get('dob')
};
onFormSubmit(userData);
};

return (
<div className="bg-white p-8 pixel-border">
<h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Step 1: Details</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
<input type="text" id="fullName" name="fullName" className="pixel-input" placeholder="Jane Doe" required />
</div>
<div>
<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
<input type="text" id="address" name="address" className="pixel-input" placeholder="123 Pixel Way" required />
</div>
<div>
<label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
<input type="date" id="dob" name="dob" className="pixel-input" required />
</div>
<button type="submit" className="w-full pixel-button mt-4" style={{ backgroundColor: '#4A5CFF' }}>Continue</button>
</form>
</div>
);
};

const Step2Upload = ({ onVerify, onBack, uploadedFile, setUploadedFile }) => {
const [previewUrl, setPreviewUrl] = useState(null);

useEffect(() => {
if (!uploadedFile) {
setPreviewUrl(null);
return;
}
const objectUrl = URL.createObjectURL(uploadedFile);
setPreviewUrl(objectUrl);
return () => URL.revokeObjectURL(objectUrl);
}, [uploadedFile]);

const handleFile = (file) => {
if (file && file.type.startsWith('image/')) {
setUploadedFile(file);
} else {
// In a real app, show a user-friendly error message
console.error('Invalid file type. Please upload an image.');
}
};

const preventDefaults = (e) => {
e.preventDefault();
e.stopPropagation();
};

const handleDrop = (e) => {
preventDefaults(e);
if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
handleFile(e.dataTransfer.files[0]);
e.dataTransfer.clearData();
}
};

return (
<div className="bg-white p-8 pixel-border">
<h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Step 2: Upload Doc</h2>
<div
onDragEnter={preventDefaults}
onDragOver={preventDefaults}
onDragLeave={preventDefaults}
onDrop={handleDrop}
>
<input
type="file"
id="document-upload"
className="hidden"
accept="image/*"
onChange={(e) => handleFile(e.target.files[0])}
/>
{!uploadedFile ? (
<label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-gray-400 bg-gray-50 hover:bg-gray-200 transition">
<svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
<path d="M11 15h2V9h3l-4-4-4 4h3v6zm-1 4H6v-2h4v2zm2-16H4v16h16V8h-2V2h-8z" fill="#888" />
</svg>
<p className="mt-2 text-gray-600"><span className="font-semibold">Click to upload</span></p>
<p className="text-xs text-gray-500 mt-1">or drag & drop</p>
</label>
) : (
<div className="mt-4 text-center">
<img src={previewUrl} alt="Image Preview" className="max-h-40 mx-auto border-4 border-gray-800" />
<p className="text-gray-700 mt-2 p-2 bg-gray-200 inline-block break-all">{uploadedFile.name}</p>
</div>
)}
</div>
<button onClick={onVerify} className="mt-6 w-full pixel-button" style={{ backgroundColor: '#1ED760' }} disabled={!uploadedFile}>Verify</button>
<button onClick={onBack} className="mt-2 w-full text-sm text-gray-600 hover:text-gray-800 underline">Back</button>
</div>
);
};

const ResultView = ({ status, userData, ocrText, onReset }) => {
const LoadingState = () => (
<div>
<div className="piggy-spinner">
<svg viewBox="0 0 192 48" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
{/* SVG content from original HTML */}
<g id="frame1" fill="#FFC0CB" stroke="#E6AEC1"><rect x="12" y="16" width="24" height="16"/><rect x="20" y="22" width="8" height="6" fill="#FFA9B9"/><rect x="16" y="12" width="4" height="4"/><rect x="28" y="12" width="4" height="4"/><rect x="22" y="10" width="4" height="2" fill="#2c2c2c"/><rect x="14" y="20" width="4" height="4" fill="#2c2c2c"/><rect x="30" y="20" width="4" height="4" fill="#2c2c2c"/><rect x="12" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="30" y="32" width="6" height="4" fill="#FFA9B9"/></g><g id="frame2" transform="translate(48, 0)" fill="#FFC0CB" stroke="#E6AEC1"><rect x="8" y="16" width="32" height="16"/><rect x="38" y="22" width="6" height="6" fill="#FFA9B9"/><rect x="16" y="12" width="4" height="4"/><rect x="28" y="12" width="4" height="4"/><rect x="22" y="10" width="4" height="2" fill="#2c2c2c"/><rect x="34" y="20" width="4" height="4" fill="#2c2c2c"/><rect x="12" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="30" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="4" y="18" width="4" height="2" fill="#FFA9B9"/><rect x="4" y="20" width="2" height="4" fill="#FFA9B9"/></g><g id="frame3" transform="translate(96, 0)" fill="#FFC0CB" stroke="#E6AEC1"><rect x="12" y="16" width="24" height="16"/><rect x="16" y="12" width="4" height="4"/><rect x="28" y="12" width="4" height="4"/><rect x="22" y="10" width="4" height="2" fill="#2c2c2c"/><rect x="12" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="30" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="8" y="18" width="4" height="2" fill="#FFA9B9"/><rect x="8" y="20" width="2" height="4" fill="#FFA9B9"/></g><g id="frame4" transform="translate(144, 0)" fill="#FFC0CB" stroke="#E6AEC1"><rect x="8" y="16" width="32" height="16"/><rect x="4" y="22" width="6" height="6" fill="#FFA9B9"/><rect x="16" y="12" width="4" height="4"/><rect x="28" y="12" width="4" height="4"/><rect x="22" y="10" width="4" height="2" fill="#2c2c2c"/><rect x="10" y="20" width="4" height="4" fill="#2c2c2c"/><rect x="12" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="30" y="32" width="6" height="4" fill="#FFA9B9"/><rect x="40" y="18" width="4" height="2" fill="#FFA9B9"/><rect x="42" y="20" width="2" height="4" fill="#FFA9B9"/></g>
</svg>
</div>
<p className="mt-4 text-gray-700 font-medium">Verifying...</p>
</div>
);

const SuccessState = () => (
<div>
<svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1ED760" />
<path d="M10 17l-5-5 2.82-2.82L10 11.34l7.18-7.18L20 6l-10 11z" fill="#ffffff" />
</svg>
<h2 className="text-xl font-bold text-gray-800 mt-4">Verified!</h2>
<p className="text-gray-600 mt-2">Record created.</p>
</div>
);

const FailureState = () => (
<div>
<svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D71E1E" />
<path d="M13 17h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ffffff" />
</svg>
<h2 className="text-xl font-bold text-gray-800 mt-4">Failed!</h2>
<p className="text-gray-600 mt-2">No match found. Try again.</p>
</div>
);

const ComparisonArea = () => (
<div className="text-left mb-6">
<h3 className="text-base font-semibold text-gray-800 mb-4 text-center">Verification Data</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="border-b-4 md:border-b-0 md:border-r-4 border-gray-800 pb-4 pr-4">
<h4 className="font-semibold text-gray-700 mb-2 underline">Your Details</h4>
<div className="space-y-2">
<div>
<p className="font-medium text-gray-500">Name:</p>
<p className="text-gray-800 break-words">{userData.fullName}</p>
</div>
<div>
<p className="font-medium text-gray-500">Address:</p>
<p className="text-gray-800 break-words">{userData.address}</p>
</div>
</div>
</div>
<div>
<h4 className="font-semibold text-gray-700 mb-2 underline">Doc Text</h4>
<pre className="text-xs bg-gray-200 p-2 border-2 border-gray-800 h-32 overflow-y-auto whitespace-pre-wrap break-words">{ocrText}</pre>
</div>
</div>
</div>
);

return (
<div className="bg-white p-8 pixel-border text-center">
{status === 'loading' && <LoadingState />}
{(status === 'success' || status === 'failure') && <ComparisonArea />}
{status === 'success' && <SuccessState />}
{status === 'failure' && <FailureState />}
<button onClick={onReset} className="mt-8 pixel-button" style={{ backgroundColor: '#4A5CFF' }}>Start Over</button>
</div>
);
};

// --- Main Component ---
const TownHall = ({ onClose }) => {
const [step, setStep] = useState(1); // 1: details, 2: upload, 3: result
const [userData, setUserData] = useState({});
const [uploadedFile, setUploadedFile] = useState(null);
const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, loading, success, failure
const [ocrText, setOcrText] = useState('');

// --- API and Logic Helpers ---
const toBase64 = file => new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result.split(',')[1]);
reader.onerror = error => reject(error);
});

const callGoogleVisionAPI = useCallback(async (base64ImageData, retryCount = 0) => {
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

const payload = {
contents: [{
role: "user",
parts: [
{ text: "Extract all text from this document. Provide only the raw text content." },
{ inlineData: { mimeType: uploadedFile?.type || "image/png", data: base64ImageData } }
]
}],
};

try {
const response = await fetch(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

const result = await response.json();
const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) throw new Error('Could not extract text from the API response.');
return text;

} catch (error) {
console.error(`API call failed (attempt ${retryCount + 1}):`, error);
if (retryCount < 3) {
const delay = Math.pow(2, retryCount) * 1000;
await new Promise(res => setTimeout(res, delay));
return callGoogleVisionAPI(base64ImageData, retryCount + 1);
} else {
throw new Error('API call failed after multiple retries.');
}
}
}, [uploadedFile]);

const validateDocument = (ocrText, user) => {
const normalizedOcrText = ocrText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
const normalizedUserName = user.fullName.toLowerCase();
const normalizedAddress = user.address.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

const nameParts = normalizedUserName.split(' ').filter(part => part.length > 1);
const firstName = nameParts[0];
const lastName = nameParts[nameParts.length - 1];

const isNameMatch = normalizedOcrText.includes(firstName) && normalizedOcrText.includes(lastName);
const addressParts = normalizedAddress.split(' ');
const streetNumber = addressParts[0];
const streetName = addressParts.slice(1).filter(p => isNaN(p)).join(' ');
const isAddressMatch = normalizedOcrText.includes(streetNumber) && normalizedOcrText.includes(streetName);

return isNameMatch && isAddressMatch;
};

// --- Event Handlers ---
const handleFormSubmit = (data) => {
setUserData(data);
setStep(2);
};

const handleVerify = async () => {
if (!uploadedFile) return;

setStep(3);
setVerificationStatus('loading');
setOcrText('');

try {
const base64Image = await toBase64(uploadedFile);
const extractedText = await callGoogleVisionAPI(base64Image);
setOcrText(extractedText);
const isValid = validateDocument(extractedText, userData);
setVerificationStatus(isValid ? 'success' : 'failure');
} catch (error) {
console.error('Verification failed:', error);
setVerificationStatus('failure');
}
};

const handleReset = () => {
setStep(1);
setUserData({});
setUploadedFile(null);
setVerificationStatus('idle');
setOcrText('');
};

const handleBack = () => setStep(1);

return (
<>
<GlobalStyles />
<div className="flex items-center justify-center min-h-screen p-4 text-xs">
<div className="w-full max-w-lg mx-auto">
<Header />
<main className="relative h-[450px]">
<div className={`step-card ${step !== 1 ? 'hidden-step' : ''}`}>
<Step1Details onFormSubmit={handleFormSubmit} />
</div>
<div className={`step-card ${step !== 2 ? 'hidden-step' : ''}`}>
<Step2Upload
onVerify={handleVerify}
onBack={handleBack}
uploadedFile={uploadedFile}
setUploadedFile={setUploadedFile}
/>
</div>
<div className={`step-card ${step !== 3 ? 'hidden-step' : ''}`}>
<ResultView
status={verificationStatus}
userData={userData}
ocrText={ocrText}
onReset={handleReset}
/>
</div>
</main>
</div>
</div>
</>
);
};

export default TownHall;