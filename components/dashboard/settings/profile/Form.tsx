export default function Form() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex gap-x-3">
        <div className="flex flex-col gap-y-1 text-sm font-roboto">
          <label htmlFor="firstName" className="font-medium">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-68.25"
          />
        </div>

        <div className="flex flex-col gap-y-1 text-sm font-roboto">
          <label htmlFor="lastName" className="font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-68.25"
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1 text-sm font-roboto">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-full"
        ></input>
      </div>

      <div className="flex flex-col gap-y-1 text-sm font-roboto">
        <label htmlFor="email" className="font-medium">
          Phone
        </label>
        <input
          type="text"
          id="email"
          className="text-[#1f2937] bg-[#f3f4f6] rounded-lg px-3 py-2 w-full"
        ></input>
      </div>

      <div className="flex justify-end gap-x-3 text-sm font-roboto font-medium">
        <button className="px-4 py-2 border-2 border-black/10 rounded-lg text-[#1f2937]">
          Cancel
        </button>
        <button className="px-4 py-2 text-white bg-linear-[191deg,#0088ff,#6155f5_100%] rounded-lg">
          Save Changes
        </button>
      </div>
    </form>
  );
}
