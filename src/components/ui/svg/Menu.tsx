import type { SVGProps } from '@builder.io/qwik'

export const Menu = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      font-size="24"
      fill="none"
      height="1em"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      class="menu-button"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
