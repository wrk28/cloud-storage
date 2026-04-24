const ChangeDescriptionModal = ({ description, setDescription, onSave, onCancel }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h3>Change Description</h3>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <div className="modal-buttons">
        <button onClick={onSave}>Change</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

export default ChangeDescriptionModal;