const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h3>Are you sure you want to delete the file?</h3>
      <div className="modal-buttons">
        <button onClick={onConfirm}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;