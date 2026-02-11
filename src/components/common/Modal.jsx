import Icon from "./Icon";

function Modal({ onClose, title, children }) {
  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
      >
        {/* Header */}
        <div className="modal-header">
          {title && (
            <h2 className="modal-title">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="close-btn"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
