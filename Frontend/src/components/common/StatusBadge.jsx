import React from 'react';

const STATUS_MAP = {
  low: { label: 'Low Risk', emoji: '🟢', classes: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]' },
  medium: { label: 'Medium Risk', emoji: '🟡', classes: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]' },
  high: { label: 'High Risk', emoji: '🔴', classes: 'bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]' },
};

const StatusBadge = ({ level }) => {
  const key = (level || '').toLowerCase();
  const conf = STATUS_MAP[key] || { label: 'Unknown', emoji: '⚪', classes: 'bg-gray-100 text-gray-700 border-gray-300' };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${conf.classes}`}>
      <span>{conf.emoji}</span>
      <span>{conf.label}</span>
    </span>
  );
};

export default StatusBadge;
