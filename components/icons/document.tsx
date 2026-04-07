import type { SVGProps } from "react";
const Document = (props: SVGProps<SVGSVGElement>) => {
  const { width = 16, height = 16 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.7943 4.38234V14.9692C13.7943 15.5386 13.3325 16 12.7636 16H3.23677C2.66743 16 2.20605 15.5386 2.20605 14.9692V1.03072C2.20602 0.461375 2.6674 0 3.23677 0H9.41193L13.7943 4.38234Z"
        fill="#518EF8"
      />
      <path d="M10.9629 8.03296H5.03711V8.69143H10.9629V8.03296Z" fill="white" />
      <path d="M10.9629 9.50354H5.03711V10.162H10.9629V9.50354Z" fill="white" />
      <path d="M10.9629 10.9741H5.03711V11.6326H10.9629V10.9741Z" fill="white" />
      <path d="M9.25133 12.4447H5.03711V13.1032H9.25133V12.4447Z" fill="white" />
      <path
        d="M10.0098 4.28715L13.7942 5.84625V4.38237L11.6485 3.74884L10.0098 4.28715Z"
        fill="#3A5BBC"
      />
      <path
        d="M13.7945 4.38234H10.4428C9.87345 4.38234 9.41211 3.92097 9.41211 3.35162V0L13.7945 4.38234Z"
        fill="#ACD1FC"
      />
    </svg>
  );
}
export default Document;
