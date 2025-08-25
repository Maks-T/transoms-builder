import { defineStore } from 'pinia'
import { cloneObjectDeep } from '@utils'

const LEAF_TYPES = {
    ACTIVE_LEAF: 'active-leaf',
    INACTIVE_LEAF: 'inactive-leaf',
    INACTIVE_LEAF_SMALL: 'inactive-leaf-small',
    ACTIVE_LEAF_SMALL: 'active-leaf-small',
}

const PROFILE_TYPE = 'profile'


const PROFILES_TYPES = {
    'modulasg': {
        id: 'modulasg',
        name: 'Modula',
        width: 39,
        height: 41,
        imgSrc: ''
    },
    'spaziosg': {
        id: 'spaziosg',
        name: 'Spazio',
        width: 39,
        height: 41,
        imgSrc: ''
    },
    'spazioltsl': {
        id: 'spazioltsl',
        name: 'Spazio Light',
        width: 39,
        height: 41,
        imgSrc: ''
    },
};


const TRANSOM_TEMPLATES = {
    'transoms-type-9': {
        id: 'transoms-type-9',
        name: 'Фрамуга 9',
        width: 1667,
        height: 3000,
        minWidth: 1000,
        minHeight: 1000,
        maxWidth: 1667,
        maxHeight: 3000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 815],
        rowHeights: [42, 948, 2010],
        imgSrc: '',
        cells: [
            {
                row: 1,
                col: 1,
                rowSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 3, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
        ]
    },
    'transoms-type-8': {
        id: 'transoms-type-8',
        name: 'Фрамуга 8',
        width: 1667,
        height: 3000,
        minWidth: 1000,
        minHeight: 1000,
        maxWidth: 1667,
        maxHeight: 3200,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 815],
        rowHeights: [42, 948, 2010],
        imgSrc: '',
        cells: [
            {
                row: 1,
                col: 1,
                rowSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 3, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
        ]
    }
};

export const useModelingStore = defineStore('modeling', {
    state: () => ({
        transomTemplates: cloneObjectDeep(TRANSOM_TEMPLATES),
        profileTypes: cloneObjectDeep(PROFILES_TYPES),
        transoms: [],
        activeTransomId: null,
        selectedProfileId: null,
        selectedTemplateId: null,
    }),

    getters: {
        activeTransom: (state) => {
            return state.transoms.find(transom => transom.id === state.activeTransomId)
        },
        profileTypesArray: (state) => {
            return Object.values(state.profileTypes)
        },
        transomTemplatesArray: (state) => {
            return Object.values(state.transomTemplates)
        },
        selectedProfile: (state) => {
            return state.profileTypes[state.selectedProfileId]
        },
        selectedTemplate: (state) => {
            return state.transomTemplates[state.selectedTemplateId]
        }
    },

    actions: {
        // Создание новой фрамуги
        createTransom() {
            const template = this.transomTemplates[this.selectedTemplateId]
            const profile = this.profileTypes[this.selectedProfileId]

            if (!template || !profile) {
                console.warn('Не выбран template или profile')
                return
            }

            const transomId = `transom-${Date.now()}`
            const newTransom = {
                ...cloneObjectDeep(template),
                id: transomId,
                name: `${template.name} #${this.transoms.length + 1}`,
                profileId: this.selectedProfileId,
                profile: cloneObjectDeep(profile),
            }

            this.transoms.push(newTransom)
            this.activeTransomId = transomId

            this.logActiveTransom()
            return transomId
        },

        // Установка активной фрамуги
        setActiveTransom(transomId) {
            if (this.transoms.some(transom => transom.id === transomId)) {
                this.activeTransomId = transomId
                this.logActiveTransom()
            }
        },

        // Изменение типа профиля
        setProfileType(profileId) {
            if (this.profileTypes[profileId]) {
                this.selectedProfileId = profileId

                // Если есть активная фрамуга - обновляем ее профиль
                if (this.activeTransom) {
                    this.updateActiveTransomProfile(profileId)
                }

                this.logActiveTransom()
            }
        },

        // Изменение шаблона фрамуги
        setTransomTemplate(templateId) {
            if (this.transomTemplates[templateId]) {
                this.selectedTemplateId = templateId

                if (this.transoms.length === 0) {
                    // Если фрамуг нет - создаем новую с выбранным шаблоном
                    this.createTransom()
                } else if (this.activeTransom) {
                    // Если есть активная фрамуга - меняем ее шаблон
                    this.updateActiveTransomTemplate(templateId)
                } /*else {
                    // Если есть фрамуги, но нет активной - делаем первую активной и меняем шаблон
                    this.activeTransomId = this.transoms[0].id
                    this.updateActiveTransomTemplate(templateId)
                }*/

                this.logActiveTransom()
            }
        },

        // Обновление профиля активной фрамуги
        updateActiveTransomProfile(profileId) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex !== -1) {
                const profile = this.profileTypes[profileId]
                if (profile) {
                    this.transoms[transomIndex].profileId = profileId
                    this.transoms[transomIndex].profile = cloneObjectDeep(profile)
                }
            }
        },

        // Обновление шаблона активной фрамуги
        updateActiveTransomTemplate(templateId) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex !== -1) {
                const template = this.transomTemplates[templateId]
                const profile = this.profileTypes[this.selectedProfileId]

                if (template && profile) {
                    // Сохраняем ID и имя оригинальной фрамуги
                    const originalId = this.transoms[transomIndex].id
                    const originalName = this.transoms[transomIndex].name

                    // Обновляем фрамугу новым шаблоном
                    this.transoms[transomIndex] = {
                        ...cloneObjectDeep(template),
                        id: originalId, //ToDo подумать о наложении
                        name: originalName,
                        profileId: this.selectedProfileId,
                        profile: cloneObjectDeep(profile),
                        templateId: templateId
                    }
                }
            }
        },

        // Логирование активной фрамуги
        logActiveTransom() {
            if (this.activeTransom) {
                console.log('=== АКТИВНАЯ ФРАМУГА ===')
                console.log('ID:', this.activeTransom.id)
                console.log('Название:', this.activeTransom.name)
                console.log('Профиль:', this.activeTransom.profileId)
                console.log('Шаблон:', this.activeTransom.id)
                console.log('Размеры:', `${this.activeTransom.width}×${this.activeTransom.height}${this.activeTransom.unit}`)
                console.log('Ячеек:', this.activeTransom.cells.length)
                console.log('Объект:', this.activeTransom)
                console.log('=========================')
            } else {
                console.log('Нет активной фрамуги')
            }
        }
    }
})