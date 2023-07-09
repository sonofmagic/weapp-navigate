# weapp-navigate

[![codecov](https://codecov.io/gh/sonofmagic/weapp-navigate/branch/main/graph/badge.svg?token=EgsFF9UMt5)](https://codecov.io/gh/sonofmagic/weapp-navigate)

> 小程序框架路由跳转方法

- [weapp-navigate](#weapp-navigate)
  - [Features](#features)
  - [Usage](#usage)
    - [基础使用](#基础使用)
    - [进阶使用](#进阶使用)
      - [创建自定义hook](#创建自定义hook)
  - [Options](#options)
    - [`createNavigate`](#createnavigate)
    - [`navigate`](#navigate)
  - [License](#license)

## Features

- `promisify` 的 `api` 调用
- 创建拦截器控制路由跳转(用于鉴权等等)
- 多框架统一的 `api` 管理
- 参数组合

## Usage

```bash
<npm|yarn|pnpm> i weapp-navigate
```

### 基础使用

```js
import { navigate, createNavigate } from 'weapp-navigate'

async function main() {
  // 使用
  await navigate({
    url: '/pages/index/index',
    params: {
      id: '1',
      type: 'add'
    }
  })
  // 相当于
  await wx.navigateTo({
    url: '/pages/index/index?id=1&type=add'
  })

  await navigate({
    type: 'navigateBack'
  })
  // 相当于
  await wx.navigateBack()

  await navigate({
    type: 'reLaunch',
    url: '/pages/index/index'
  })
  // 相当于
  await wx.reLaunch({
    url: '/pages/index/index'
  })
  // 同样还有 redirectTo 和 switchTab
}
```

### 进阶使用

#### 创建自定义hook

```js
import { createNavigate } from 'weapp-navigate'

const navigate = createNavigate({
  // 默认情况下使用全局 wx 对象，你可以使用 uni / taro 这种对象
  globalTarget: uni,
  onBeforeExecute: async (options) => {
    // 这里你可以对参数进行修改
    if (options.type === 'navigateTo') {
      options.url = options.url + '54321'
    }
    // 或者你可以使用异步方法，进行远程调用
    const isAuth = await getPermission()
    
    if(isAuth){
      // 在这里抛出错误之后,不会去执行 navigateTo 那些方法，同时这个错误会被 onError 捕获
      throw new Error('no login !')
    }
  },
  onAfterExecute(result) {
    // onAfterExecute 可以对 result 返回值进行修改
    result.errMsg = '111'
    // 同样也可以在这里使用异步方法，或者抛出错误
    // throw new Error('no permission')
  },
  onError(error) {
    console.error(error)
  }
})
const result = await navigate({
  url
})
```

## Options

### `createNavigate`

[types](./src/type.ts)

```ts
export interface ICreateNavigateOptions {
  globalTarget?: IGlobalTarget
  onError?: (err: Error) => void
  onBeforeExecute?: (options: NavigateOptions) => void | Promise<void>
  onAfterExecute?: (result: CallbackResult) => void | Promise<void>
}

```

### `navigate`

[types](./src/type.ts)

```ts
NavigateOptions
```

## License

This project uses the [MIT license](./LICENSE).
