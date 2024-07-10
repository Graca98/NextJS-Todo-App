"use client";
//! Není nikde použito!!

export default function Sidebar({openSide, setOpenSide}) {
  // const [openSide, setOpenSide] = useState(false);


  return (
    <>
      <div className="relative z-[90]">
        <div
          tabIndex="0"
          className={`top-0 z-40 flex h-screen w-full flex-col overflow-y-auto bg-white px-3 py-1.5 focus:outline-0 sm:max-w-[290px] duration-500 ${openSide ? "block w-[290px]" : "hidden"} sm:px-6 sm:py-3`}
        >
          <div className="flex-1">
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setOpenSide(false)}
                id="close-topic"
                className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x h-5 w-5"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <ul className="mt-6 space-y-1">
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
        </div>
        {/*<div
          className={`${openSide ? "fixed" : "hidden"} duration-500 inset-0 z-30 bg-gray-900 bg-opacity-50 dark:bg-opacity-80`}
        ></div>*/}
      </div>
    </>
  );
}
