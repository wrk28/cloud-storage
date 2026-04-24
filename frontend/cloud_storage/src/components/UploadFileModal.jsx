import { useState } from 'react';

const UploadFileModal = ({ onClose, onUpload }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onUpload({ file, description });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">Upload File</h2>
        <textarea
          className="modal-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-file-section">

          <input
            className="modal-file-input"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="modal-buttons">
          <button
            onClick={handleSubmit}
            disabled={!file}
          >
            Upload
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;