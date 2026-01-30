import React from 'react';

const MessageItem = React.memo(({ msg, formatTime, index }) => {
  return (
    <div className={`flex mb-2 ${msg.senderType === 'FARMER' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
          msg.senderType === 'FARMER'
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-all overflow-hidden">{msg.content}</p>
        <p
          className={`text-xs mt-1 ${
            msg.senderType === 'FARMER' ? 'text-emerald-100' : 'text-slate-500'
          }`}
        >
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return (
    prevProps.msg === nextProps.msg &&
    prevProps.index === nextProps.index
  );
});

MessageItem.displayName = 'MessageItem';
export default MessageItem;
