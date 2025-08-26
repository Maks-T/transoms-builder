declare module 'vue' {
  export interface GlobalComponents {
    VStage: typeof import('vue-konva')['Stage']
    VLayer: typeof import('vue-konva')['Layer']
    VRect: typeof import('vue-konva')['Rect']
    VCircle: typeof import('vue-konva')['Circle']
    VLine: typeof import('vue-konva')['Line']
    VText: typeof import('vue-konva')['Text']
    VGroup: typeof import('vue-konva')['VGroup']
  }
}

export {}