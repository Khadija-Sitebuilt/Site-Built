function Messages({
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5481 18.5229C16.693 20.3781 14.2512 21.2765 11.8247 21.2241C8.5295 21.1528 2.75 21.2046 2.75 21.2046L4.77533 17.9758C4.77533 17.9758 2.79819 15.0391 2.79819 12.0048C2.79644 9.64231 3.69595 7.28029 5.50162 5.47503C9.10096 1.87436 14.9487 1.87436 18.5481 5.4741C22.1539 9.08033 22.1474 14.9232 18.5481 18.5229Z"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.31455 12.3804H8.21581"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M12.0489 12.3814H11.9502"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M15.7833 12.3804H15.6846"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default Messages;
