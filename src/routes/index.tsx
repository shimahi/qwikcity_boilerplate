import { css } from '@/styled-system/css'
import { container } from '@/styled-system/patterns'
import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

export const useLoader = routeLoader$(async (requestEvent) => {
  const environment = requestEvent.env.get('ENVIRONMENT')
  const bucketName = requestEvent.env.get('STORAGE_BUCKET_NAME')

  return {
    environment,
    bucketName,
  }
})

export default component$(() => {
  const {
    value: { environment, bucketName },
  } = useLoader()

  return (
    <>
      <Header />

      <div>{environment}</div>
      <div>{bucketName}</div>
    </>
  )
})

export const Header = component$(() => {
  return (
    <header
      class={css({
        display: 'flex',
        alignItems: 'center',
        px: 5,
        py: 3,
        position: 'fixed',
        width: '100%',
        height: '64px',
        bgColor: 'cyan.900',
        color: 'white',
        zIndex: 3,
        '& + *': {
          paddingTop: '64px',
        },
      })}
    >
      <div
        class={container({
          width: '100%',
        })}
      >
        <div>
          <h1
            class={css({
              textStyle: 'heading',
            })}
          >
            Qwik Summer
          </h1>
        </div>
      </div>
    </header>
  )
})
