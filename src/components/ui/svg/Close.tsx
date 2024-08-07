import type { SVGProps } from '@builder.io/qwik'

export const Close = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-qwikest-icon=""
      fill="none"
      height="1em"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
