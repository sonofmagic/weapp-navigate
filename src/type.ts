export type AnimationOptions = {
  animationDuration?: number
}

export type CommonNavigateOptions = {
  type: 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch'
  url: string
  events?: any
  animationType:
    | 'auto'
    | 'none'
    | 'slide-in-right'
    | 'slide-in-left'
    | 'slide-in-top'
    | 'slide-in-bottom'
    | 'fade-in'
    | 'zoom-out'
    | 'zoom-fade-out'
    | 'pop-in'
  params: Record<string, any>
} & AnimationOptions

export type NavigateBackOptions = {
  type: 'navigateBack'
  delta: number
  animationType:
    | 'auto'
    | 'none'
    | 'slide-out-right'
    | 'slide-out-left'
    | 'slide-out-top'
    | 'slide-out-bottom'
    | 'fade-out'
    | 'zoom-in'
    | 'zoom-fade-in'
    | 'pop-out'
} & AnimationOptions

export type NavigateOptions = CommonNavigateOptions | NavigateBackOptions

// <navigator :url="'/pages/test/test?item='+ encodeURIComponent(JSON.stringify(item))"></navigator>
// const item = JSON.parse(decodeURIComponent(option.item));
// uni.navigateBack()
// uni.navigateTo()
// uni.reLaunch
// uni.redirectTo
// uni.switchTab

export interface IGlobalTarget {
  navigateBack: typeof wx.navigateBack
  navigateTo: typeof wx.navigateTo
  reLaunch: typeof wx.reLaunch
  redirectTo: typeof wx.redirectTo
  switchTab: typeof wx.switchTab
}

export interface ICreateNavigateOptions {
  globalTarget?: IGlobalTarget
}
