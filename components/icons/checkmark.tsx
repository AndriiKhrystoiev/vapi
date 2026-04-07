import type { SVGProps } from "react";
const Checkmark = (props: SVGProps<SVGSVGElement>) => {
  const { color = "#FFFAEB", width = 14, height = 10 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.0607 1.06066L4.53033 9.59099L0 5.06066L1.06066 4L4.53033 7.46967L12 0L13.0607 1.06066Z"
        fill={color}
      />
    </svg>
  );
}
export default Checkmark;
