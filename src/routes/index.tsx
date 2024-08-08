import { IconButton } from '@/components/ui/IconButton'
import { SVG } from '@/components/ui/svg'
import { authorize } from '@/domains/auth'
import { UserDomain } from '@/domains/user'
import { useUpload } from '@/hooks/storage'
import type { User } from '@/schemas'
import type { AuthUser } from '@/services/kv'
import { StorageService } from '@/services/storage'
import { css } from '@/styled-system/css'
import { container } from '@/styled-system/patterns'
import { hover } from '@/styled-system/recipes'
import { $, component$, useSignal } from '@builder.io/qwik'
import {
  type DocumentHead,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from '@builder.io/qwik-city'
import { Modal } from '@qwik-ui/headless'
import { useAuthSignin, useAuthSignout } from './plugin@auth'

export const useLoader = routeLoader$(async (requestEvent) => {
  const userDomain = new UserDomain(requestEvent)
  const users = await userDomain.paginate()
  const currentUser = await authorize(requestEvent)

  return {
    users,
    currentUser,
  }
})

export const useSaveImage = routeAction$(
  async (data, requestEvent) => {
    const storageService = new StorageService(requestEvent)
    return await storageService.save({
      tmpKey: data.tmpKey,
      object: {
        name: 'user',
        field: 'avatar',
        id: data.userId,
      },
    })
  },
  zod$({
    tmpKey: z.string(),
    userId: z.string(),
  }),
)

export const useUpdateUser = routeAction$(
  async (data, requestEvent) => {
    const userDomain = new UserDomain(requestEvent)
    const currentUser = await authorize(requestEvent)
    const inputs = {
      ...currentUser,
      ...data.inputs,
    }
    return await userDomain.update(data.userId, inputs)
  },
  zod$({
    userId: z.string(),
    inputs: z.object({
      avatarUrl: z.string().optional(),
      displayName: z.string().optional(),
      accountId: z.string().optional(),
      bio: z.string().optional(),
    }),
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
        <div
          class={[
            container(),
            css({
              width: '100%',
            }),
          ]}
        >
          <Contents users={users ?? []} />
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
        bgColor: 'cyan.600',
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
          class={[
            'Modal-wrapper',
            css({
              display: 'block',
              md: {
                display: 'none',
              },
            }),
          ]}
        >
          <Modal.Trigger
            class={[
              'Modal-trigger',
              css({
                position: 'fixed',
                top: 5,
                right: 5,
                zIndex: 3,
              }),
            ]}
          >
            <SVG.Menu color="white" class="menu-button" />
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
                class={[
                  'modal-Close',
                  css({
                    position: 'fixed',
                    top: 5,
                    right: 5,
                    zIndex: 3,
                  }),
                ]}
              >
                <SVG.Close />
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

    const handleSignIn = $(() => {
      signIn
        .submit({
          providerId: 'google',
        })
        .catch((e) => {
          console.log({ e })
        })
    })

    const handleSignOut = $(() => {
      signOut.submit({
        callbackUrl: '/?logout=true',
      })
    })

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
              <ImageUploader
                userId={currentUser.id}
                avatarUrl={
                  currentUser.avatarUrl ?? 'https://picsum.photos/100/100'
                }
              />
              <div
                class={css({
                  display: 'flex',
                  flexDirection: 'column',
                  pl: 8,
                  gap: 2,
                })}
              >
                <DisplayNameForm
                  displayName={currentUser.displayName}
                  userId={currentUser.id}
                />
                <AccountIdForm
                  accountId={currentUser.accountId}
                  userId={currentUser.id}
                />
              </div>
              <BioForm bio={currentUser.bio ?? ''} userId={currentUser.id} />
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
              onClick$={handleSignOut}
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
          onClick$={handleSignIn}
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

export const ImageUploader = component$(
  ({ avatarUrl, userId }: { avatarUrl: string; userId: string }) => {
    const ref = useSignal<HTMLInputElement>()
    const tmpAvatarUrl = useSignal<string>(avatarUrl)
    const { tmpKey, upload, reset } = useUpload()
    const save = useSaveImage()
    const updateUser = useUpdateUser()

    const handleImageClick = $(() => {
      ref.value?.click()
    })

    const handleFileChange = $(async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        const file = input.files[0]
        tmpAvatarUrl.value = URL.createObjectURL(file)

        await upload(file)
      }
    })

    return (
      <div>
        <button onClick$={handleImageClick} class={hover()}>
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
              src={tmpAvatarUrl.value}
              alt=""
              class={css({
                objectFit: 'cover',
                borderRadius: '100%',
                width: '100%',
                height: '100%',
              })}
            />
          </div>
        </button>

        <input
          ref={ref}
          type="file"
          accept=".jpeg,.jpg,.png"
          onChange$={handleFileChange}
          class={css({ display: 'none' })}
        />

        {!!tmpKey && (
          <div
            class={css({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
            })}
          >
            <IconButton
              icon={'Close'}
              color="red"
              onClick$={() => {
                reset()
                tmpAvatarUrl.value = avatarUrl
              }}
            />
            <IconButton
              icon={'Check'}
              color="teal"
              onClick$={async () => {
                const newAvatarUrl = await save.submit({
                  tmpKey,
                  userId: userId,
                })

                updateUser
                  .submit({
                    userId: userId,
                    inputs: {
                      avatarUrl: `${newAvatarUrl?.value}`,
                    },
                  })
                  .then(() => {
                    reset()
                  })
              }}
            />
          </div>
        )}
      </div>
    )
  },
)

export const DisplayNameForm = component$(
  ({ displayName, userId }: { displayName: string; userId: string }) => {
    const editingDisplayName = useSignal(false)
    const displayNameInput = useSignal(displayName)
    const updateUser = useUpdateUser()

    return (
      <div
        class={css({
          display: 'flex',
          gap: 2,
          alignItems: 'baseline',
        })}
      >
        {editingDisplayName.value ? (
          <div
            class={css({
              display: 'flex',
              alignItems: 'baseline',
              gap: 2,
            })}
          >
            <input
              type="text"
              value={displayNameInput.value}
              onInput$={(e) => {
                displayNameInput.value = (e.target as HTMLInputElement).value
              }}
              class={css({
                textStyle: 'body',
                borderBottom: '1px solid gray',
              })}
            />
            <div class={css({ display: 'flex', gap: 2 })}>
              <IconButton
                icon="Close"
                color="red"
                onClick$={() => {
                  editingDisplayName.value = false
                }}
              />
              <IconButton
                icon="Check"
                color="teal"
                onClick$={async () => {
                  editingDisplayName.value = false
                  await updateUser.submit({
                    userId,
                    inputs: {
                      displayName: displayNameInput.value,
                    },
                  })
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              class={css({
                textStyle: 'subtitle1',
              })}
            >
              {displayName}
            </div>
            <IconButton
              icon="Pencil"
              onClick$={() => {
                editingDisplayName.value = true
              }}
            />
          </>
        )}
      </div>
    )
  },
)

export const AccountIdForm = component$(
  ({ accountId, userId }: { accountId: string; userId: string }) => {
    const editingAccountId = useSignal(false)
    const accountIdInput = useSignal(accountId)
    const updateUser = useUpdateUser()

    return (
      <div
        class={css({
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        })}
      >
        {editingAccountId.value ? (
          <div
            class={css({
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            })}
          >
            <input
              type="text"
              value={accountIdInput.value}
              onInput$={(e) => {
                accountIdInput.value = (e.target as HTMLInputElement).value
              }}
              class={css({
                textStyle: 'body',
                borderBottom: '1px solid gray',
              })}
            />
            <div class={css({ display: 'flex', gap: 2 })}>
              <IconButton
                icon="Close"
                color="red"
                onClick$={() => {
                  editingAccountId.value = false
                }}
              />
              <IconButton
                icon="Check"
                color="teal"
                onClick$={async () => {
                  editingAccountId.value = false
                  await updateUser.submit({
                    userId,
                    inputs: {
                      accountId: accountIdInput.value,
                    },
                  })
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              class={css({
                textStyle: 'body',
                color: 'gray.500',
              })}
            >
              @{accountId}
            </div>
            <IconButton
              icon="Pencil"
              onClick$={() => {
                editingAccountId.value = true
              }}
            />
          </>
        )}
      </div>
    )
  },
)

export const BioForm = component$(
  ({ bio, userId }: { bio: string; userId: string }) => {
    const editingBio = useSignal(false)
    const bioInput = useSignal(bio)
    const updateUser = useUpdateUser()

    return (
      <div>
        <textarea
          rows={5}
          value={bioInput.value}
          placeholder="プロフィールを入力してください"
          onFocusIn$={() => {
            editingBio.value = true
          }}
          onFocus$={() => {
            editingBio.value = true
          }}
          onInput$={(e) => {
            bioInput.value = (e.target as HTMLInputElement).value
          }}
        />
        {editingBio.value && (
          <div class={css({ display: 'flex', gap: 2 })}>
            <IconButton
              icon="Close"
              color="red"
              onClick$={() => {
                editingBio.value = false
              }}
            />
            <IconButton
              icon="Check"
              color="teal"
              onClick$={async () => {
                editingBio.value = false
                await updateUser.submit({
                  userId,
                  inputs: {
                    bio: bioInput.value,
                  },
                })
              }}
            />
          </div>
        )}
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
