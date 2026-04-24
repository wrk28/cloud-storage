const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h3>Are you sure you want to delete the file?</h3>
      <div className="modal-buttons">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;