import React from 'react';

const FarmerConversationItem = React.memo(({ conv, selectedFarmer, onlineUsers = new Set(), formatTime, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition ${
        selectedFarmer?.farmerId === conv.farmerId
          ? 'bg-emerald-100 border-2 border-emerald-500'
          : 'bg-white hover:bg-slate-100 border border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {conv.farmerName?.charAt(0)?.toUpperCase() || 'F'}
              </div>
              {onlineUsers?.has?.(conv.farmerId) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {conv.farmerName || 'Farmer'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {conv.farmerEmail}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2 truncate">
            {conv.lastMessage || 'No messages yet'}
          </p>
        </div>
        {conv.unreadCount > 0 && (
          <span className="ml-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
            {conv.unreadCount}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-1">
        {formatTime(conv.lastMessageTime)}
      </p>
    </button>
  );
});

FarmerConversationItem.displayName = 'FarmerConversationItem';
export default FarmerConversationItem;
