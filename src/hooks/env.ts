import { useSignal, useTask$ } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'

type PublicEnv = {
  name: string | undefined
}

/**
 * サーバー内の環境変数をブラウザ側で取得するためのフック
 * フロントエンドで公開して良い変数のみを扱うこと
 */
export function useEnv() {
  const envSignal = useSignal<PublicEnv>()

  useTask$(async () => {
    envSignal.value = await server$(function (): PublicEnv {
      return {
        name: this.env.get('ENVIRONMENT'),
      }
    })()
  })

  return envSignal.value
}
