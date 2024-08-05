import { KVService } from '@/services/kv'
import { AuthError } from '@auth/core/errors'
import type { Provider } from '@auth/core/providers'
import Google from '@auth/core/providers/google'
import { QwikAuth$ } from '@auth/qwik'
import type { RequestEventCommon } from '@builder.io/qwik-city'

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  ({ env }) => ({
    secret: env.get('AUTH_SECRET') ?? '#',
    trustHost: true,
    providers: [
      Google({
        clientId: env.get('GOOGLE_AUTH_CLIENT_ID') ?? '#',
        clientSecret: env.get('GOOGLE_AUTH_CLIENT_SECRET') ?? '#',
      }),
    ] as Provider[],
  }),
)

/**
 * @description authorize
 * 認証を行い、ログインユーザーの情報を取得する
 * セッションの認証情報を元にKVに保存されたUserデータの一部を返す
 * @param RequestEventAction QwikCityサーバのリクエストイベント
 * @param {boolean} throwWhenUnauthenticated 認証されていない場合にエラーを投げるかどうか
 * @returns {AuthUser} 認証ユーザー情報
 */
export async function authorize(
  /** リクエストイベント */
  requestEvent: RequestEventCommon<QwikCityPlatform>,
  /** 認証されていない場合に例外をスローするかどうか  */
  throwWhenUnauthenticated = false,
) {
  // Auth.jsの"session"コールバックで付与されたセッション情報を取得する
  const session = requestEvent.sharedMap.get('session') as {
    kvAuthKey?: string
  } | null

  if (!session?.kvAuthKey) {
    if (throwWhenUnauthenticated) {
      throw new AuthError('Unauthorized')
    }
    return null
  }

  // セッションに保存されたkeyを元にKVからユーザー情報を取得する
  const kvSerice = new KVService(requestEvent)
  const stringifiedUser = await kvSerice.user.get()
  if (!stringifiedUser) {
    if (throwWhenUnauthenticated) {
      throw new AuthError('Unauthorized')
    }
    return null
  }

  return stringifiedUser
}
