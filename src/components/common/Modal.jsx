import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

function Modal({ onClose, title, children }) {
  const { t } = useTranslation();
  useEffect(() => {
    const body = document.body;
    const currentLocks = Number.parseInt(body.dataset.modalLockCount || "0", 10);
    const safeCurrentLocks = Number.isFinite(currentLocks) && currentLocks > 0 ? currentLocks : 0;

    if (safeCurrentLocks === 0) {
      body.dataset.modalLockPreviousOverflow = body.style.overflow || "";
    }

    body.dataset.modalLockCount = String(safeCurrentLocks + 1);
    body.style.overflow = "hidden";

    return () => {
      const lockCount = Number.parseInt(body.dataset.modalLockCount || "0", 10);
      const safeLockCount = Number.isFinite(lockCount) && lockCount > 0 ? lockCount : 0;
      const nextLockCount = Math.max(0, safeLockCount - 1);

      if (nextLockCount === 0) {
        body.style.overflow = body.dataset.modalLockPreviousOverflow || "";
        delete body.dataset.modalLockCount;
        delete body.dataset.modalLockPreviousOverflow;
        return;
      }

      body.dataset.modalLockCount = String(nextLockCount);
      body.style.overflow = "hidden";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay show"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("ariaClose")}
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
