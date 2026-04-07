import type { SVGProps } from "react";
const AngleRight = (props: SVGProps<SVGSVGElement>) => {
  const { color = "#09090B", width = 8, height = 14 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z"
        fill={color}
      />
      <path
        d="M4 5C4.55228 5 5 4.55228 5 4C5 3.44772 4.55228 3 4 3C3.44772 3 3 3.44772 3 4C3 4.55228 3.44772 5 4 5Z"
        fill={color}
      />
      <path
        d="M7 8C7.55228 8 8 7.55228 8 7C8 6.44772 7.55228 6 7 6C6.44772 6 6 6.44772 6 7C6 7.55228 6.44772 8 7 8Z"
        fill={color}
      />
      <path
        d="M4 11C4.55228 11 5 10.5523 5 10C5 9.44772 4.55228 9 4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11Z"
        fill={color}
      />
      <path
        d="M1 14C1.55228 14 2 13.5523 2 13C2 12.4477 1.55228 12 1 12C0.447715 12 0 12.4477 0 13C0 13.5523 0.447715 14 1 14Z"
        fill={color}
      />
    </svg>
  );
}
export default AngleRight;
