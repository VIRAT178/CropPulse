import React from 'react';

const FarmerItem = React.memo(({ farmer, onlineUsers, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {farmer.name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
          {onlineUsers.has(farmer.id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">
            {farmer.name || 'Farmer'}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {farmer.email}
          </p>
          {(farmer.village || farmer.state) && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>📍</span>
              <span>{[farmer.village, farmer.state].filter(Boolean).join(', ')}</span>
            </p>
          )}
        </div>
      </div>
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.farmer.id === nextProps.farmer.id &&
    prevProps.onlineUsers.has(prevProps.farmer.id) === nextProps.onlineUsers.has(nextProps.farmer.id)
  );
});

FarmerItem.displayName = 'FarmerItem';
export default FarmerItem;
