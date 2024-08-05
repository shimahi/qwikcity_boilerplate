import { UserDomain } from '@/domains/user'
import { authorize } from '@/routes/plugin@auth'
import { StorageService } from '@/services/storage'
import { css } from '@/styled-system/css'
import { container } from '@/styled-system/patterns'
import { component$ } from '@builder.io/qwik'
import { routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city'

export const useLoader = routeLoader$(async (requestEvent) => {
  const userDomain = new UserDomain(requestEvent)
  // const users = await userDomain.paginate()
  const currentUser = await authorize(requestEvent)

  return {
    // users,
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
    return await userDomain.update(data.userId, data.inputs)
  },
  zod$({
    userId: z.string(),
    inputs: z.object({
      avatarUrl: z.string().nullable(),
    }),
  }),
)

export default component$(() => {
  const {
    value: { currentUser },
  } = useLoader()

  return (
    <>
      <div>
        {currentUser ? currentUser.displayName : 'ログインしていません'}
        <div class={css({})}>
          <div
            class={[
              container(),
              css({
                width: '100%',
              }),
            ]}
          >
            aaa
          </div>
        </div>
      </div>
    </>
  )
})
