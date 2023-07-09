import { defu } from 'defu'
import qs from 'querystringify'
import 'miniprogram-api-typings'
import type {
  NavigateOptions,
  ICreateNavigateOptions,
  CallbackResult
} from './type'
export type * from './type'

function makeUrlOption(url: string, params: Record<string, any>) {
  return url + (params ? qs.stringify(params, true) : '')
}

export function createNavigate(p: ICreateNavigateOptions = {}) {
  const params = defu(p, {
    // uni, taro ....
    globalTarget: wx
  })

  const { globalTarget, onError, onBeforeExecute, onAfterExecute } = params

  return async function navigate(opt: Partial<NavigateOptions>) {
    try {
      const options = defu<NavigateOptions, Partial<NavigateOptions>[]>(opt, {
        animationDuration: 300,
        type: 'navigateTo'
      })
      await onBeforeExecute?.(options)
      let result: CallbackResult
      switch (options.type) {
        case 'navigateTo': {
          const {
            animationDuration,
            animationType = 'pop-in',
            params,
            url,
            events
          } = options
          result = await new Promise((resolve, reject) => {
            const targetUrl = makeUrlOption(url, params)
            // console.log(targetUrl)
            globalTarget.navigateTo({
              url: targetUrl,
              animationDuration,
              animationType,
              events,
              success: function (result) {
                resolve(result)
              },
              fail(result) {
                reject(result)
              }
            })
          })
          break
        }
        case 'navigateBack': {
          const {
            animationDuration,
            animationType = 'pop-out',
            delta = 1
          } = options
          result = await new Promise((resolve, reject) => {
            globalTarget.navigateBack({
              animationDuration,
              animationType,
              delta,
              success: function (result) {
                resolve(result)
              },
              fail(result) {
                reject(result)
              }
            })
          })
          break
        }
        case 'redirectTo': {
          const { url, params } = options
          result = await new Promise((resolve, reject) => {
            globalTarget.redirectTo({
              url: makeUrlOption(url, params),
              success: function (result) {
                resolve(result)
              },
              fail(result) {
                reject(result)
              }
            })
          })
          break
        }
        case 'switchTab': {
          const { url, params } = options
          result = await new Promise((resolve, reject) => {
            globalTarget.switchTab({
              url: makeUrlOption(url, params),
              success: function (result) {
                resolve(result)
              },
              fail(result) {
                reject(result)
              }
            })
          })
          break
        }
        case 'reLaunch': {
          const { url, params } = options
          result = await new Promise((resolve, reject) => {
            globalTarget.reLaunch({
              url: makeUrlOption(url, params),
              success: function (result) {
                resolve(result)
              },
              fail(result) {
                reject(result)
              }
            })
          })
          break
        }
      }
      await onAfterExecute?.(result)
      return result
    } catch (error) {
      onError?.(error as Error)
    }
  }
}

export const navigate = createNavigate()
