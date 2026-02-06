import NoMessage from "./icon/NoMessage";

export interface MessageProps {
  from: string;
  markedAsRead: boolean;
  subject: string;
  message: string;
  timestamp: string;
}

export default function Message({ message }: { message: MessageProps | null }) {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center bg-white w-full border-2 border-black/10 rounded-[0.875rem]">
      {message ? (
        "text"
      ) : (
        <>
          <NoMessage className="fill-[#f3f4f6] text-[#6b7280]" />
          <h2 className="font-['Inter',sans-serif] text-[#1f2937] text-lg font-semibold leading-6.75">
            No conversation selected
          </h2>
          <p className="font-roboto text-sm text-[#6b7280] leading-5.25 w-90.75 text-center">
            Choose a conversation from the list to view messages and respond to
            your project manager
          </p>
        </>
      )}
    </div>
  );
}
