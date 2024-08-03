import { UserDomain } from '@/domains/user'

import type { User } from '@/schemas'
import type { AuthUser } from '@/services/kv'
import { css } from '@/styled-system/css'
import { container } from '@/styled-system/patterns'
import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { routeLoader$ } from '@builder.io/qwik-city'
import { Modal } from '@qwik-ui/headless'
import { LuMenu, LuX } from '@qwikest/icons/lucide'

export const useLoader = routeLoader$(async (requestEvent) => {
  const userDomain = new UserDomain(requestEvent)
  const users = await userDomain.paginate()

  return {
    users,
  }
})

export default component$(() => {
  const {
    value: { users },
  } = useLoader()

  return (
    <>
      <Header />
      <Menu currentUser={null} />
      <div>
        <div class={css({})}>
          <div
            class={[
              container(),
              css({
                width: '100%',
              }),
            ]}
          >
            <Contents users={users} />
          </div>
        </div>
      </div>
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

export const Contents = component$(({ users }: { users: User[] }) => {
  return (
    <div
      class={css({
        py: 8,
        md: {
          maxWidth: 'calc(100% - 300px)',
        },
      })}
    >
      <div
        class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        })}
      >
        {users?.map((user) => {
          return (
            <div
              key={user.id}
              class={css({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                bgColor: 'gray.100',
                maxWidth: '600px',
                px: 5,
                py: 5,
                borderRadius: '10px',
              })}
            >
              <div>
                <img
                  src={user.avatarUrl ?? 'https://picsum.photos/100/100'}
                  alt={`${user.displayName}`}
                  class={css({
                    width: '64px',
                    height: '64px',
                    borderRadius: '100%',
                    objectFit: 'cover',
                    mx: 'auto',
                  })}
                />
                <div
                  class={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    gap: 1,
                    width: '100%',
                    mt: 2,
                  })}
                >
                  <div class={css({ textStyle: 'subtitle1' })}>
                    {user.displayName}
                  </div>
                  <small
                    class={css({
                      textStyle: 'caption',
                      color: 'gray.500',
                    })}
                  >
                    @{user.accountId}
                  </small>
                </div>
                <div
                  class={css({
                    mt: 2,
                  })}
                >
                  <p
                    class={css({
                      textStyle: 'body',
                    })}
                  >
                    {user.bio}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export const Menu = component$(
  ({ currentUser }: { currentUser: AuthUser | null }) => {
    return (
      <>
        <Modal.Root
          class={css({
            md: {
              display: 'none',
            },
          })}
        >
          <Modal.Trigger
            class={css({
              position: 'fixed',
              top: 5,
              right: 5,
              zIndex: 3,
            })}
          >
            <LuMenu color="white" font-size={32} />
          </Modal.Trigger>
          <Modal.Panel>
            <div
              class={css({
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                width: '100%',
                backgroundColor: 'gray.100',
              })}
            >
              <Modal.Close
                class={css({
                  position: 'fixed',
                  top: 5,
                  right: 5,
                  zIndex: 3,
                })}
              >
                <LuX font-size={32} />
              </Modal.Close>
            </div>
          </Modal.Panel>
        </Modal.Root>
        <div
          class={css({
            paddingTop: '64px',
            backgroundColor: 'gray.100',
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            zIndex: 2,
            width: '300px',
            display: 'none',
            md: {
              display: 'block',
            },
          })}
        >
          いぬ
        </div>
      </>
    )
  },
)

export const head: DocumentHead = {
  title: 'Qwik Summer',
  meta: [
    {
      name: 'description',
      content: 'Sample App for Qwik City',
    },
  ],
}
