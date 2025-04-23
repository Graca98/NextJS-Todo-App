"use client";
//! Není nikde použito!!

import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Sidebar({ openSide, setOpenSide }) {
  // const [openSide, setOpenSide] = useState(false);

  return (
    <>
      <div className="relative z-[90]">
        <div
          tabIndex="0"
          className={`${
            openSide
              ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]"
              : "hidden"
          } top-0 z-40 flex h-screen flex-col overflow-y-auto bg-white focus:outline-0 sm:max-w-[290px] duration-500`}
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
            <div className="flex">
              <div className="border rounded-full p-2 mr-2">
                <Image src="/next.svg" width={32} height={32} alt="user image"></Image>
              </div>
              <h2>User 1</h2> 
            </div>
            <ul className="mt-4 space-y-1">
              <li>Důležité</li>
              <li>Po splatnosti</li>
              <li>Splněné</li>
            </ul>
            <div className="divider"></div>
            <ul className="mt-4 space-y-1">
              <li>Kolekce 1</li>
              <li>Kolekce 2</li>
              <li>Kolekce 3</li>
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
