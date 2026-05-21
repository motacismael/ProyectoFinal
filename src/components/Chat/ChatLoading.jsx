export const ChatLoading = () => {
  return (
    <div className="flex w-full justify-start mb-5 animate-fade-in">
      <div className="flex items-end gap-2.5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-uasd-blue text-white flex items-center justify-center shadow-sm text-xs font-bold">
          U
        </div>

        {/* Typing bubble */}
        <div className="px-4 py-3.5 rounded-2xl rounded-bl-none bg-white border border-gray-100 shadow-sm flex items-center gap-2">
          <div className="flex space-x-1.5 items-center">
            <div
              className="w-2 h-2 bg-uasd-blue rounded-full animate-pulse-dot"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-uasd-blue rounded-full animate-pulse-dot"
              style={{ animationDelay: '250ms' }}
            />
            <div
              className="w-2 h-2 bg-uasd-blue rounded-full animate-pulse-dot"
              style={{ animationDelay: '500ms' }}
            />
          </div>
          <span className="text-xs text-gray-400 ml-1">Escribiendo…</span>
        </div>
      </div>
    </div>
  );
};
