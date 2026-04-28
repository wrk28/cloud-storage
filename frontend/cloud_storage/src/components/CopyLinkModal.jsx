const CopyLinkModal = ({ host, link, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(host+link);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Copy Link</h3>
        <input className="modal-input" type="text" value={host+link} readOnly/>
        <div className="modal-buttons">
          {/*<button onClick={handleCopy}>Copy</button>*/}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CopyLinkModal;