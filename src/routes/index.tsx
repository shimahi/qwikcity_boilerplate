import { UserDomain } from '@/domains/user'
import { useUpload } from '@/hooks/storage'
import { authorize } from '@/routes/plugin@auth'
import { useAuthSignin, useAuthSignout } from '@/routes/plugin@auth'
import type { User } from '@/schemas'
import type { AuthUser } from '@/services/kv'
import { StorageService } from '@/services/storage'
import { css } from '@/styled-system/css'
import { container } from '@/styled-system/patterns'
import { hover } from '@/styled-system/recipes'
import { $, component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'
import { Modal } from '@qwik-ui/headless'
import { LuMenu, LuX } from '@qwikest/icons/lucide'

export const useLoader = routeLoader$(async (requestEvent) => {
  const userDomain = new UserDomain(requestEvent)
  const users = await userDomain.paginate()
  const currentUser = await authorize(requestEvent)

  return {
    users,
    currentUser,
  }
})

export const useSave = routeAction$(
  async (data, requestEvent) => {
    const storageService = new StorageService(requestEvent)
    await storageService.save({
      tmpKey: data.tmpKey,
      object: {
        name: 'user',
        field: 'avatar',
        id: 'aiueo',
      },
    })

    return data.tmpKey
  },
  zod$({
    tmpKey: z.string(),
  }),
)

export default component$(() => {
  const {
    value: { users, currentUser },
  } = useLoader()

  return (
    <>
      <Header />
      <div>
        <Menu currentUser={currentUser} />
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
              <div class={css({})}>
                <img
                  src={
                    'https://images.unsplash.com/photo-1527841430192-32adc8530984?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt={`${user.displayName}のアバター`}
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
                    　山路やまみちを登りながら、こう考えた。
                    　智ちに働けば角かどが立つ。情じょうに棹さおさせば流される。意地を通とおせば窮屈きゅうくつだ。とかくに人の世は住みにくい。
                    　住みにくさが高こうじると、安い所へ引き越したくなる。どこへ越しても住みにくいと悟さとった時、詩が生れて、画えが出来る。
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
              <MenuContent currentUser={currentUser} />
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
          <MenuContent currentUser={currentUser} />
        </div>
      </>
    )
  },
)

export const MenuContent = component$(
  ({ currentUser }: { currentUser: AuthUser | null }) => {
    const signIn = useAuthSignin()
    const signOut = useAuthSignout()

    return currentUser ? (
      <>
        <div
          class={css({
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <div
            class={css({
              height: '100%',
              display: 'grid',
              placeItems: 'center',
            })}
          >
            <div
              class={css({
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
                height: 16,
                px: 5,
              })}
            >
              <div
                class={css({
                  width: 'auto',
                  height: '64px',
                  mx: 'auto',
                  objectFit: 'cover',
                  aspectRatio: 1,
                })}
              >
                <img
                  src="https://images.unsplash.com/photo-1489161587020-79aa193f04ff?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                  class={css({
                    objectFit: 'cover',
                    borderRadius: '100%',
                    width: '100%',
                    height: '100%',
                  })}
                />
              </div>
              <div>
                <div
                  class={css({
                    textStyle: 'subtitle1',
                  })}
                >
                  {currentUser.displayName}
                </div>
                <div
                  class={css({
                    textStyle: 'body',
                  })}
                >
                  @{currentUser.accountId}
                </div>
              </div>

              <p
                class={css({
                  textStyle: 'body',
                })}
              >
                　山路やまみちを登りながら、こう考えた。
                　智ちに働けば角かどが立つ。情じょうに棹さおさせば流される。意地を通とおせば窮屈きゅうくつだ。とかくに人の世は住みにくい。
                　住みにくさが高こうじると、安い所へ引き越したくなる。どこへ越しても住みにくいと悟さとった時、詩が生れて、画えが出来る。
              </p>
            </div>
          </div>

          <div
            class={css({
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              alignItems: 'center',
              height: 16,
            })}
          >
            <button
              onClick$={() =>
                signOut.submit({
                  callbackUrl: '/?logout=true',
                })
              }
              class={[
                css({
                  textStyle: 'button',
                }),
                hover(),
              ]}
            >
              ログアウト
            </button>
            <button
              onClick$={() => {}}
              class={[
                css({
                  textStyle: 'button',
                  color: 'red.600',
                }),
                hover(),
              ]}
            >
              アカウント削除
            </button>
          </div>
        </div>
      </>
    ) : (
      <div
        class={css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          pb: '64px',
        })}
      >
        <button
          onClick$={() =>
            signIn.submit({
              providerId: 'google',
            })
          }
          class={[
            css({
              padding: '10px 20px',
              bgColor: 'black',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 'bold',
              textStyle: 'button',
            }),
            hover(),
          ]}
        >
          ログイン
        </button>
      </div>
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

const ImageUploader = component$(() => {
  const { tmpKey, upload } = useUpload()
  const handleFileChange = $(async (file: File) => {
    await upload(file)
  })
  const save = useSave()

  return (
    <div
      class={css({
        border: 'solid 2px #cff',
        px: 10,
        py: 20,
      })}
    >
      <input
        type="file"
        accept=".jpeg,.jpg,.png"
        onChange$={async (e) => {
          if (!(e.target instanceof HTMLInputElement)) return

          const file = e.target.files?.[0]
          if (!file) return
          handleFileChange(file)
        }}
      />
      {tmpKey}

      <button
        class={css({
          px: 4,
          py: 2,
          bgColor: 'teal.800',
          cursor: 'pointer',
          color: 'white',
          '&:hover:not(:disabled)': {
            bgColor: 'teal.700',
          },
          '&:active:not(:disabled)': {
            bgColor: 'teal.900',
          },
          _disabled: {
            cursor: 'not-allowed',
          },
        })}
        disabled={!tmpKey}
        onClick$={() => save.submit({ tmpKey })}
      >
        Upload!!!
      </button>
    </div>
  )
})
