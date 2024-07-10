"use client";
//! Není nikde použito!!

import { RxHamburgerMenu } from "react-icons/rx";

export default function Sidebar({ openSide, setOpenSide }) {
  // const [openSide, setOpenSide] = useState(false);


  return (
    <>
      <div className="relative z-[90]">
        <div
          tabIndex="0"
          className={`${openSide ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]" : "hidden"} top-0 z-40 flex h-screen flex-col overflow-y-auto bg-white focus:outline-0 sm:max-w-[290px] duration-500`}
        >
          <div className="flex-1 px-4 md:px-6">
            <div className="flex items-center mb-2 mt-4 h-10">
              <div className="">
                <RxHamburgerMenu
                  onClick={() => setOpenSide(false)}
                  className={`${!openSide && "hidden"} text-xl`}
                />
              </div>
            </div>
            <div>Todo...</div>
            <ul className="mt-4 space-y-1">
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
            <div className="divider"></div>
            <ul className="mt-4 space-y-1">
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
        </div>
        {/*<div
          className={`${openSide ? "fixed" : "hidden"} duration-500 inset-0 z-30 bg-gray-900 bg-opacity-50 dark:bg-opacity-80`}
        ></div>*/}
      </div >
    </>
  );
}
