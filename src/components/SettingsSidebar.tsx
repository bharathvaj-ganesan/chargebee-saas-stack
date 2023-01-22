import NavLink from "@/components/ui/Navbar/NavLink";

export default function SettingsSidebar() {
  return (
    <nav className="space-y-1">
      <NavLink
        href="/settings/profile"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
      >
        <svg
          className="-ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="truncate">Profile</span>
      </NavLink>

      <NavLink
        href="#"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span className="truncate">Account</span>
      </NavLink>

      <NavLink
        href="#"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          ></path>
        </svg>
        <span className="truncate">Password</span>
      </NavLink>

      <NavLink
        href="#"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <span className="truncate">Notifications</span>
      </NavLink>

      <NavLink
        href="/settings/billing"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          ></path>
        </svg>
        <span className="truncate">Billing</span>
      </NavLink>

      <NavLink
        href="#"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
        data-todo-x-state-description='undefined: "bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-50 hover:text-orange-700", undefined: "border-transparent  "'
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          data-todo-x-state-description='undefined: "", undefined: " group-"'
          data-todo-x-description="Heroicon name: outline/view-grid-add"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
          ></path>
        </svg>
        <span className="truncate">Integrations</span>
      </NavLink>
      <NavLink
        href="/settings/webhooks"
        className="group flex items-center border-l-4 border-transparent px-3 py-2 text-sm font-medium  "
        data-todo-x-state-description='undefined: "bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-50 hover:text-orange-700", undefined: "border-transparent  "'
      >
        <svg
          className="group-hover: -ml-1 mr-3 h-6 w-6 flex-shrink-0 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>

        <span className="truncate">Webhooks</span>
      </NavLink>
    </nav>
  );
}
