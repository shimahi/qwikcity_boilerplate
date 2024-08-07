import { css } from '@/styled-system/css'
import type { UtilityValues } from '@/styled-system/types/prop-type'
import type { ButtonHTMLAttributes, ClassList } from '@builder.io/qwik'
import { SVG } from './svg'

export const IconButton = ({
  icon,
  color = 'gray',
  class: classProp,
  ...props
}: {
  icon: keyof typeof SVG
  color: UtilityValues['colorPalette']
  class?: ClassList
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const Icon = SVG[icon]

  return (
    <button
      class={[
        css({
          width: 6,
          height: 6,
          border: '1px solid',
          borderColor: `${color}.200`,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '100%',
          cursor: 'pointer',
          '&:hover:not(:disabled)': {
            bgColor: `${color}.200`,
          },
          '&:active:not(:disabled)': {
            bgColor: `${color}.300`,
            borderColor: `${color}.300`,
          },
          _disabled: {
            cursor: 'not-allowed',
          },
        }),
        classProp,
      ]}
      {...props}
    >
      <Icon class={css({ color: `${color}.500`, width: 4, height: 4 })} />
    </button>
  )
}
