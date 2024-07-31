import { UserDomain } from '@/domains/user'
import { useEnv } from '@/hooks/env'
import { useUpload } from '@/hooks/storage'
import { authorize } from '@/routes/plugin@auth'
import { StorageService } from '@/services/storage'
import { css } from '@/styled-system/css'
import { $, Fragment, component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'

import { useAuthSignin, useAuthSignout } from '@/routes/plugin@auth'
export const useLoader = routeLoader$(async requestEvent => {
  const userDomain = new UserDomain(requestEvent)
  const users = await userDomain.paginate()
  const currentUser = await authorize(requestEvent)

  return {
    users,
    user: currentUser,
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
  })
)

export default component$(() => {
  const {
    value: { users, user },
  } = useLoader()
  const { tmpKey, upload } = useUpload()
  const save = useSave()
  const env = useEnv()
  const signIn = useAuthSignin()
  const signOut = useAuthSignout()

  const handleFileChange = $(async (file: File) => {
    await upload(file)
  })

  return (
    <div
      class={css({
        px: 10,
        py: 10,
        md: {
          px: 20,
          py: 30,
        },
      })}
    >
      {user ? (
        <button
          onClick$={() =>
            signOut.submit({
              callbackUrl: '/?logout=true',
            })
          }
        >
          {user.displayName}さん: ログアウト
        </button>
      ) : (
        <button
          onClick$={() =>
            signIn.submit({
              providerId: 'google',
            })
          }
        >
          ログイン
        </button>
      )}
      <div
        class={css({
          border: 'solid 2px #cff',
          px: 10,
          py: 20,
        })}
      >
        <input
          type='file'
          accept='.jpeg,.jpg,.png'
          onChange$={async e => {
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

      {users.map(user => {
        return (
          <Fragment key={user.id}>
            <small>@{user.accountId}</small>
            <div>{user.displayName}</div>
            <div>{user.googleProfileId}</div>
            <div>{user.createdAt.toString()}</div>
            <div>- - -</div>
          </Fragment>
        )
      })}
      <hr />
      {env?.name}
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
}
