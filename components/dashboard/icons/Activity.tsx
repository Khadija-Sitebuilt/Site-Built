function Activity({
  className,
  height = 24,
  width = 24,
}: {
  className?: string;
  height?: number;
  width?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="Iconly/Curved/Light/Activity">
        <g id="Activity">
          <path
            id="Stroke 1"
            d="M6.91748 14.8542L9.91048 10.9652L13.3245 13.6452L16.2535 9.86523"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Stroke 2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.6671 2.3501C20.7291 2.3501 21.5891 3.2101 21.5891 4.2721C21.5891 5.3331 20.7291 6.1941 19.6671 6.1941C18.6051 6.1941 17.7451 5.3331 17.7451 4.2721C17.7451 3.2101 18.6051 2.3501 19.6671 2.3501Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Stroke 4"
            d="M20.7557 9.26922C20.8887 10.1642 20.9497 11.1722 20.9497 12.3032C20.9497 19.2412 18.6377 21.5532 11.6997 21.5532C4.76271 21.5532 2.44971 19.2412 2.44971 12.3032C2.44971 5.36622 4.76271 3.05322 11.6997 3.05322C12.8097 3.05322 13.8007 3.11222 14.6827 3.24022"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

export default Activity;
