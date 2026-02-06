interface MessageCardProps {
  from: string;
  subject: string;
  message: string;
  timestamp: string;
  markedAsRead: boolean;
}

export default function MessageCard({
  from,
  subject,
  message,
  timestamp,
  markedAsRead,
}: MessageCardProps) {
  return (
    <div
      className={`flex border-2 border-black/10 rounded-[0.625rem] p-3.25 gap-3 ${markedAsRead && "border-blue-500 border-l-4"}`}
    >
      {/* sender's avatar */}
      <div className="flex size-10 shrink-0 rounded-full bg-blue-600 text-white items-center justify-center">
        AV&#40;
      </div>

      {/* sender's name and message content */}
      <div className="flex flex-col font-roboto text-[#1f2937] gap-1">
        {/* sender name */}
        <div className="flex justify-between items-center">
          <h2 className="leading-5.25 text-sm font-medium">{from}</h2>
          {markedAsRead && (
            <div className="top-0 right-0 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </div>

        {/* subject */}
        <span className="leading-4.5 font-roboto text-xs text-[#6b7280]">
          {subject}
        </span>

        {/* message preview */}
        <p className="text-[0.8125rem] max-h-9.75 overflow-clip">{message}</p>

        {/* timestamp */}
        <p className="leading-4.25 font-jetbrains-mono text-[0.6875rem] text-[#6b7280]">
          {timestamp}
        </p>
      </div>
    </div>
  );
}
