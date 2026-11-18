export function InstagramIcon({ className = 'w-[22px] h-[22px]' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShopeeIcon({ className = 'w-[22px] h-[22px]' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 7.5h15l-1.1 12.2A2 2 0 0 1 16.4 21.5H7.6a2 2 0 0 1-2-1.8L4.5 7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.3 12.1c-.4-.5-1.2-.8-2.2-.8-1.3 0-2.1.6-2.1 1.5 0 1 .9 1.3 2.2 1.6 1.4.3 2.3.7 2.3 1.8 0 1.1-1 1.8-2.4 1.8-1.2 0-2.1-.4-2.6-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
