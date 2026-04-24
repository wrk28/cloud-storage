const CopyLinkModal = ({ link, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Copy Link</h3>
        <input type="text" value={link} readOnly/>
        <div className="modal-buttons">
          <button onClick={handleCopy}>Copy</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CopyLinkModal;