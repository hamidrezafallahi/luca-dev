"use client";


export default function ToastBox({ message, title }:{ message:string, title:string }) {



  return(
    <div className={`font-IRANSans relative w-full min-w-0`}>
      <div className="-z-10 absolute -inset-9 bg-state-error7"></div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Long messages (e.g. a list of invalid fields) must wrap inside the toast,
              not run past it, so no fixed width here. */}
          <div className="w-full min-w-0 font-normal text-[12px] leading-6 whitespace-pre-line break-words [overflow-wrap:anywhere]">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
