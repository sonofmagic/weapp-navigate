import { vi } from 'vitest'
import 'miniprogram-api-typings'
const WxMock = vi.fn(() => {
  return {
    navigateBack: vi.fn((params) => {
      params.success?.(true)
    }),
    navigateTo: vi.fn((params) => {
      params.success?.(true)
    }),
    redirectTo: vi.fn((params) => {
      params.success?.(true)
    }),
    reLaunch: vi.fn((params) => {
      params.success?.(true)
    }),
    switchTab: vi.fn((params) => {
      params.success?.(true)
    })
  } as Pick<
    typeof wx,
    'navigateTo' | 'navigateBack' | 'reLaunch' | 'redirectTo' | 'switchTab'
  >
})
const wx = new WxMock()
vi.stubGlobal('wx', wx)
// const IntersectionObserverMock = vi.fn(() => ({
//   disconnect: vi.fn(),
//   observe: vi.fn(),
//   takeRecords: vi.fn(),
//   unobserve: vi.fn()
// }))

// vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
