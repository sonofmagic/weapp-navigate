// @ts-nocheck

import { navigate, createNavigate } from '@/index'

async function main() {
  await navigate({
    url: '/pages/index/index',
    params: {
      id: '1',
      type: 'add'
    }
  })
  await wx.navigateTo({
    url: '/pages/index/index?id=1&type=add'
  })

  await navigate({
    type: 'navigateBack'
  })

  await wx.navigateBack()

  await navigate({
    type: 'reLaunch',
    url: '/pages/index/index'
  })

  await wx.reLaunch({
    url: '/pages/index/index'
  })
}

async function execAll(fn: typeof navigate) {
  let res: unknown = false
  res = await fn({
    url: '/pages/index/index'
  })
  expect(res).toBeTruthy()

  res = await fn({
    type: 'navigateBack'
  })
  expect(res).toBeTruthy()

  res = await fn({
    type: 'reLaunch',
    url: '/pages/index/index'
  })
  expect(res).toBeTruthy()

  res = await fn({
    type: 'redirectTo',
    url: '/pages/index/index'
  })
  expect(res).toBeTruthy()

  res = await fn({
    type: 'switchTab',
    url: '/pages/index/index'
  })
  expect(res).toBeTruthy()
}
describe('[Default]', () => {
  it('navigate', async () => {
    await execAll(navigate)
  })

  it('custom globalTarget', async () => {
    const res: number[] = []
    const go = createNavigate({
      globalTarget: {
        navigateBack(option) {
          option?.success?.({ errMsg: '0' })
          res.push(0)
        },
        navigateTo(option) {
          option?.success?.({ errMsg: '0', eventChannel: {} })
          res.push(1)
        },
        redirectTo(option) {
          option?.success?.({ errMsg: '0' })
          res.push(2)
        },
        reLaunch(option) {
          option?.success?.({ errMsg: '0' })
          res.push(3)
        },
        switchTab(option) {
          option?.success?.({ errMsg: '0' })
          res.push(4)
        }
      }
    })
    await execAll(go)
    expect(res).toEqual([1, 0, 3, 2, 4])
  })

  it('onError', async () => {
    let err: Error | null = null
    const go = createNavigate({
      globalTarget: {
        navigateTo(option) {
          option?.fail?.({ errMsg: '0' })
        }
      },
      onError(error) {
        err = error
      }
    })
    await go({
      url: ''
    })
    expect(err).toBeTruthy()
    expect(err).toEqual({ errMsg: '0' })
  })

  it('onBeforeExecute change options', async () => {
    let err: Error | null = null
    const url = '12345'
    let thenUrl = ''
    const go = createNavigate({
      globalTarget: {
        navigateTo(option) {
          thenUrl = option.url
          option?.success?.({ errMsg: '0' })
        }
      },
      onBeforeExecute(options) {
        if (options.type === 'navigateTo') {
          options.url = '54321'
        }
      },
      onError(error) {
        err = error
      }
    })
    await go({
      url
    })

    expect(thenUrl).toBe('54321')
  })

  it('onBeforeExecute throw error', async () => {
    let err: Error | null = null
    const url = '12345'
    let thenUrl = ''
    const go = createNavigate({
      globalTarget: {
        navigateTo(option) {
          thenUrl = option.url
          option?.success?.({ errMsg: '0' })
        }
      },
      onBeforeExecute(options) {
        if (options.type === 'navigateTo') {
          throw new Error('no permission')
        }
      },
      onError(error) {
        err = error
      }
    })
    await go({
      url
    })
    expect(err).toBeTruthy()
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('no permission')
    expect(thenUrl).toBe('')
  })

  it('onAfterExecute throw error', async () => {
    let err: Error | null = null
    let errMsg = ''
    const go = createNavigate({
      globalTarget: {
        navigateTo(option) {
          option?.success?.({ errMsg: '0' })
        }
      },
      onAfterExecute(result) {
        errMsg = result.errMsg
        throw new Error('no permission')
      },
      onError(error) {
        err = error
      }
    })
    const res = await go({
      url: '1'
    })
    expect(res).toBe(undefined)
    expect(err).toBeTruthy()
    expect(err).toBeInstanceOf(Error)
    expect(errMsg).toBe('0')
  })
})
