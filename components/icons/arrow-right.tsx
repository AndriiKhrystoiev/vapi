import type { SVGProps } from "react";
const ArrowRight = (props: SVGProps<SVGSVGElement>) => {
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
        d="M4.82323 7.47488L4.10823 6.77288L6.60423 4.28988H0.000226591V3.18488H6.59123L4.12123 0.688879L4.83623 -0.000121534L8.55423 3.74388L4.82323 7.47488Z"
        fill={color}
      />
    </svg>
  );
}
export default ArrowRight;
