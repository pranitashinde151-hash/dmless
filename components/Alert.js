export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = getStyles(type);

  return (
    <div style={styles.container}>
      <div style={styles.alert}>
        {message}
        {onClose && (
          <button
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function getStyles(type) {
  const baseAlert = {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const typeStyles = {
    success: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      borderLeft: '4px solid #10b981',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      borderLeft: '4px solid #ef4444',
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      borderLeft: '4px solid #f59e0b',
    },
    info: {
      backgroundColor: '#dbeafe',
      color: '#0c2d6b',
      borderLeft: '4px solid #3b82f6',
    },
  };

  return {
    container: {
      width: '100%',
    },
    alert: {
      ...baseAlert,
      ...(typeStyles[type] || typeStyles.info),
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      marginLeft: '12px',
      color: 'inherit',
    },
  };
}
