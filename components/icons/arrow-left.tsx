import type { SVGProps } from "react";
const ArrowLeft = (props: SVGProps<SVGSVGElement>) => {
  const { color = "#FFFAE9", width = 9, height = 8 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.73146 7.47488L4.44646 6.77288L1.95046 4.28988H8.55446V3.18488H1.96346L4.43346 0.688879L3.71846 -0.000121534L0.000460863 3.74388L3.73146 7.47488Z"
        fill={color}
      />
    </svg>
  );
}
export default ArrowLeft;
