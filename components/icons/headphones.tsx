const Headphones = (props) => {
  const { color = "#0E0E12", width = 14, height = 15 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1.5C3.96243 1.5 1.5 3.96243 1.5 7V8H5.5V15H3C1.34315 15 0 13.6569 0 12V7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7V12C14 13.6569 12.6569 15 11 15H8.5V8H12.5V7C12.5 3.96243 10.0376 1.5 7 1.5ZM4 9.5H1.5V12C1.5 12.8284 2.17157 13.5 3 13.5H4V9.5ZM10 9.5H12.5V12C12.5 12.8284 11.8284 13.5 11 13.5H10V9.5Z"
        fill={color}
      />
    </svg>
  );
}
export default Headphones;
