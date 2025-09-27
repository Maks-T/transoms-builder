Проект
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── tsconfig.json
├── vite.config.js
├── structure.md                  # Этот файл со структурой проекта
│
├── public/
│   └── img/
│       └── transomTemplates/     # SVG-шаблоны фрамуг
│           ├── transom-1.svg
│           ├── transom-2.svg
│           ├── transom-3.svg
│           ├── transom-4.svg
│           ├── transom-5.svg
│           ├── transom-6.svg
│           ├── transom-7.svg
│           ├── transom-8.svg
│           ├── transom-9.svg
│           └── transom-10.svg
│
└── src/
    ├── App.vue                   # Корневой компонент приложения
    ├── main.js                   # Точка входа приложения
    ├── style.css                 # Глобальные стили
    │
    ├── assets/
    │   └── styles/
    │       ├── _variables.scss
    │       ├── index.scss
    │       └── mixins/
    │           ├── _functions.scss
    │           ├── _shared.scss
    │           └── index.scss
    │
    ├── components/
    │   ├── common/
    │   │   └── Step.vue
    │   │
    │   ├── sections/
    │   │   ├── Modeling/
    │   │   │   ├── SectionModeling.vue
    │   │   │   ├── FrameSettingsPanel.vue
    │   │   │   ├── FrameToolbar.vue
    │   │   │   ├── FrameBuilder/
    │   │   │   │   ├── FrameBuilder.vue
    │   │   │   │   ├── LeafElement.vue
    │   │   │   │   └── ProfileElement.vue
    │   │   │   └── DecorCreator/
    │   │   │       ├── DecorCreator.vue
    │   │   │       ├── DecorControls.vue
    │   │   │       ├── DecorList.vue
    │   │   │       └── DecorDraw/
    │   │   │           ├── DecorDraw.vue
    │   │   │           └── DecorLeafElement.vue
    │   │   │
    │   │   └── TempResults/
    │   │       ├── SectionMaterials.vue
    │   │       └── SectionTempResults.vue
    │   │
    │   └── ui/                   # Переиспользуемые UI-компоненты
    │       ├── index.js
    │       ├── InputText.vue
    │       ├── Modal.vue
    │       └── Select.vue
    │
    ├── composables/
    │   ├── index.js
    │   ├── useDebounce.js
    │   └── useTranslate.js
    │
    ├── configs/
    │   ├── index.js
    │   └── modules/
    │       ├── configs.js
    │       ├── decorPresets.js
    │       └── prices.js
    │
    ├── constants/
    │   └── index.js
    │
    ├── directives/
    │   └── clickOutside.js
    │
    ├── services/
    │   ├── index.js
    │   └── calculations/
    │       └── CalcDecorTemplate.js
    │
    ├── stores/
    │   ├── index.js
    │   └── modules/
    │       ├── configs.js
    │       ├── decor.js
    │       ├── materials.js
    │       └── modeling.js
    │
    ├── types/
    │   ├── calcProfiles.d._ts
    │   ├── configs.d.ts
    │   ├── decor.d.ts
    │   ├── materials.d.ts
    │   ├── modeling.d.ts
    │   └── vue-konva.d.ts
    │
    └── utils/
        └── index.js



