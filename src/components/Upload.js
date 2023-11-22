import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DataCollectionIcon from '../assests/exploration.png';
import 'fontsource-roboto';
import Button from '@mui/material/Button';
import { Router, useNavigate} from 'react-router-dom';
import Nav from './Nav';


const Upload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]); 
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [status,setStatus]=useState(null)
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
  
    // Display modal with uploading status
    setUploadStatus('uploading');
    setModalOpen(true);
  
    fetch('http://localhost:5000/upload_csv', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((responseData) => {
        try { 
          
          const parsedData = JSON.parse(responseData.replace(/: NaN,/g, ': null,'));
          if(!parsedData.flag){
          setData(parsedData);
          navigate('/result', { state: { data: parsedData} });
          }else{
            setUploadStatus('validate');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setUploadStatus('error');
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setUploadStatus('error');
        setLoading(false);
      });
  };
  
  const handleGetResults = () => {
    
    navigate('/result', { state: { data } });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    
  };
  const handleValidateeModal = () => {
    window.location.reload();
    setModalOpen(false);
    
  };
 
  return (
    <div>
      <Nav/>
      <div className="dashboard-container" style={{ marginBottom: '20px' }}>
      <div className="background-image"></div>
        <h4>Upload your CSV File</h4>
        <div className="upload-section">
          <div className="input-button-container">
            <input type="file" onChange={handleFileChange} className="file-input" />
            <button onClick={handleUpload} className="upload-button">
              Upload
            </button>
          </div>
          
        </div>
      </div>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
          {loading && <CircularProgress />}
          {uploadStatus === 'success' && (
            <>
              <CheckCircleOutlineIcon style={{ color: 'green', fontSize: 40, marginBottom: '20px' }} />
              <Typography variant="h6">Upload Successful!</Typography>
              <Button variant="outlined" onClick={handleGetResults} style={{ marginTop: '20px', marginLeft: '5px' }}>
                Get Results
              </Button>
              <Button variant="outlined" onClick={handleCloseModal} style={{ marginTop: '20px' }}>
                Close
              </Button>
            </>
          )}
          {uploadStatus === 'error' && (
            <>
              <ErrorOutlineIcon style={{ color: 'red', fontSize: 40, marginBottom: '20px' }} />
              <Typography variant="h6">Upload Failed</Typography>
              <Typography variant="body1">An error occurred during the upload. Please try again.</Typography>
              <Button variant="outlined" onClick={handleValidateeModal} ref={fileInputRef} style={{ marginTop: '20px' }}>
                Close
              </Button>
            </>
          )}
          {uploadStatus === 'validate' && (
            <>
              <CheckCircleOutlineIcon style={{ color: 'green', fontSize: 40, marginBottom: '20px' }} />
              <Typography variant="h6">Uploaded Dataset Validated Successfully!</Typography>
              <Button variant="outlined" onClick={handleValidateeModal} style={{ marginTop: '20px' }}>
                Close
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </div>
    
   
  );
};

export default Upload;











