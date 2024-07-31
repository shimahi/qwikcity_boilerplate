import { defineConfig, defineRecipe } from '@pandacss/dev'

export default defineConfig({
  jsxFramework: 'qwik',
  preflight: true,
  outdir: 'src/styled-system',
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  globalCss: {
    '*': {
      fontFamily:
        '"kanit", "Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
      whiteSpace: 'normal',
    },
    'button, a': {
      '&:hover': {
        cursor: 'pointer',
      },
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  theme: {
    extend: {
      recipes: {
        hover: defineRecipe({
          className: 'defaultHoverAction',
          description: 'a/button要素をホバーしたときの挙動',
          base: {
            '&:hover': {
              opacity: 0.5,
              transition: 'opacity 150ms ease-in-out',
            },
          },
        }),
      },
      textStyles: {
        heading: {
          description: 'ページの見出しの文字',
          value: {
            fontWeight: '500',
            fontSize: '28px',
            lineHeight: 1.46,
            letterSpacing: '0.05em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        title1: {
          description: 'セクションの見出しの文字',
          value: {
            fontSize: '24px',
            fontWeight: '500',
            lineHeight: '35.88px',
            letterSpacing: '0.05em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        new: {
          description: 'NEWマークの表示に使用',
          value: {
            fontWeight: '600',
            fontSize: '11px',
            lineHeight: '16.45px',
            letterSpacing: '0.15em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        subtitle1: {
          description: '大きめのサブタイトルの文字',
          value: {
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '23.17px',
            letterSpacing: '0.05em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        toggle: {
          description: '文字を選択して要素を切り替えるUIの文字に使用',
          value: {
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '20.93px',
            letterSpacing: '0.05em',
          },
        },
        subtitle2: {
          description: '小さめのサブタイトルの文字',
          value: {
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '20.27px',
            letterSpacing: '0.05em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        caption: {
          description: '日付など、補足に用いる小さい文字',
          value: {
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '17.94px',
            letterSpacing: '0.05em',
            textDecoration: 'None',
            textTransform: 'None',
          },
        },
        body: {
          description: '記事の文章などに用いる',
          value: {
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '18px',
            letterSpacing: '0.05em',
          },
        },
        footer: {
          description: 'フッターの文字',
          value: {
            fontFamily: 'Kanit',
            fontSize: '10px',
            fontWeight: 500,
            lineHeight: '14.95px',
            letterSpacing: '0.05em',
          },
        },
      },
    },
  },
  utilities: {},
})
