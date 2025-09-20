import React, { useState } from 'react';
import './Components.css';

function AlternativeCreditReporting({ onClose }) {
  const [identityVerified, setIdentityVerified] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleVerifyIdentity = () => {
    // In a real application, this would integrate with Persona
    alert('Initiating Persona identity verification...');
    setIdentityVerified(true); // Simulate successful verification
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadBill = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('bill', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/upload-bill', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Bill uploaded and processed successfully!');
      } else {
        const errorData = await response.json();
        setUploadMessage(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading bill:', error);
      setUploadMessage('An error occurred during bill upload.');
    }
  };

  return (
    <div className="alternative-credit-reporting-container">
      <button onClick={onClose} className="close-button">x</button>
      <h2>alternative credit reporting</h2>

      {!identityVerified ? (
        <div>
          <h3>step 1: verify your identity</h3>
          <button onClick={handleVerifyIdentity}>verify with persona</button>
        </div>
      ) : (
        <div>
          <h3>identity verified!</h3>
          <h3>step 2: upload paid bills/receipts</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadBill} disabled={!selectedFile}>
            upload bill
          </button>
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default AlternativeCreditReporting;
