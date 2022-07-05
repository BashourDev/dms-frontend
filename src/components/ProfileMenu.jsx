import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdInfo } from "react-icons/md";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileMenu({
  setCategoriesOpen,
  setMyAccountOpen,
  logout,
  reminderCount,
  setIsReminderOpen,
}) {
  const options = [
    {
      id: 1,
      name: "المذكرة",
      onClick: () => {
        setIsReminderOpen(true);
      },
      additional: reminderCount !== 0 && (
        <span className="flex items-center justify-center absolute top-1 right-0 rounded-full text-white text-[10px] shadow-sm shadow-red-500 bg-red-400 w-4 h-4">
          {reminderCount}
        </span>
      ),
    },
    {
      id: 2,
      name: "التصنيفات",
      onClick: () => {
        setCategoriesOpen(true);
      },
    },
    {
      id: 3,
      name: "حسابي",
      onClick: () => {
        setMyAccountOpen(true);
      },
    },
    {
      id: 4,
      name: "تسجيل الخروج",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left md:hidden">
      <div>
        <Menu.Button className="group inline-flex justify-center text-xs font-medium text-gray-100 hover:text-gray-200">
          {reminderCount !== 0 && (
            <span className="flex items-center justify-center absolute -top-1 -right-3 rounded-full text-[10px] shadow-sm shadow-red-500 bg-red-400 w-4 h-4">
              {reminderCount}
            </span>
          )}
          خيارات
          <MdChevronLeft
            className="flex-shrink-0 -rotate-90 -mr-1 ml-1 h-5 w-5 text-gray-100 group-hover:text-gray-200"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-left absolute left-0 mt-2 z-[3000] w-32 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button
                    onClick={option.onClick}
                    className={classNames(
                      option.name
                        ? "font-medium text-gray-900"
                        : "text-gray-500",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm w-full text-right hover:bg-gray-100"
                    )}
                  >
                    {option?.additional}
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
