import { defu } from 'defu'
import qs from 'querystringify'
import 'miniprogram-api-typings'
import type { NavigateOptions, ICreateNavigateOptions } from './type'
export type * from './type'

function makeUrlOption(url: string, params: Record<string, any>) {
  return url + (params ? qs.stringify(params, true) : '')
}

export function createNavigate(params: ICreateNavigateOptions = {}) {
  if (params.globalTarget === undefined) {
    // uni, taro ....
    params.globalTarget = wx
  }
  const { globalTarget } = params

  return function navigate(opt: Partial<NavigateOptions>) {
    const options = defu<NavigateOptions, Partial<NavigateOptions>[]>(opt, {
      animationDuration: 300,
      type: 'navigateTo'
    })
    switch (options.type) {
      case 'navigateTo': {
        const {
          animationDuration,
          animationType = 'pop-in',
          params,
          url,
          events
        } = options
        return new Promise((resolve, reject) => {
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
      }
      case 'navigateBack': {
        const {
          animationDuration,
          animationType = 'pop-out',
          delta = 1
        } = options
        return new Promise((resolve, reject) => {
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
      }
      case 'redirectTo': {
        const { url, params } = options
        return new Promise((resolve, reject) => {
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
      }
      case 'switchTab': {
        const { url, params } = options
        return new Promise((resolve, reject) => {
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
      }
      case 'reLaunch': {
        const { url, params } = options
        return new Promise((resolve, reject) => {
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
      }
    }
  }
}

export const navigate = createNavigate()
