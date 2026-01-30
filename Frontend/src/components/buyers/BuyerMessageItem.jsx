import React from 'react';

const BuyerMessageItem = React.memo(({ msg, formatTime, index }) => {
  return (
    <div className={`flex mb-1.5 ${msg.senderType === 'BUYER' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
          msg.senderType === 'BUYER'
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-all overflow-hidden">{msg.content}</p>
        <p
          className={`text-xs mt-1 ${
            msg.senderType === 'BUYER' ? 'text-blue-100' : 'text-slate-500'
          }`}
        >
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.msg === nextProps.msg &&
    prevProps.index === nextProps.index
  );
});

BuyerMessageItem.displayName = 'BuyerMessageItem';
export default BuyerMessageItem;
