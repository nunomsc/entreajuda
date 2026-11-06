<script setup>
import { defineProps, computed, ref, defineEmits } from 'vue';
import { getSlugColor } from '@o/helper';
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    items: {
        type: Array,
        default: () => [],
    },
    group: {
        type: [Boolean, String],
        default: false,
    },
    groups: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: '',
    },
})

const displayPlaceholder = computed(() => props.placeholder || t('enter_your_selected_posts'));


const isGrouped = computed(() => {
    return props.group !== false
})

// items 
const items = computed(() => {
    return props.items || []
})

// emit
const emit = defineEmits(['update:modelValue', 'change'])

const selected = ref( props.modelValue.map(item => Number(item)) )
const select = itemId => {

    itemId = Number(itemId)

    const index = selected.value.indexOf(itemId)
    if (index === -1) {
        selected.value.push(itemId)
        editable.value.focus()
    } else {
        selected.value.splice(index, 1)
    }
    emit('update:modelValue', selected.value)
}


const selectedItems = computed(() => {
    let _items = items.value.filter(item => selected.value.includes( Number(item.ID) ))
    // Unique
    return [...new Set(_items)]
})

const filteredItems = computed(() => {
    if (state.value.search.length) {
        return items.value.filter(item => item.title.toLowerCase().includes( state.value.search.toLowerCase()))
    }

    return items.value
})

// classifications 
const groups = computed(() => {
    return props.groups || []
})

const groupTitle = (groupSlug) => {
    return groups.value[groupSlug] || groupSlug
}

// DOM
const state = ref({
    search: '',
    showItems: false,
})

const editable = ref(null)

const showItems = () => {
    state.value.showItems = true
    state.value.search = ''
    editable.value.focus()
}

const hideItems = () => {
    state.value.showItems = false
    state.value.search = ''
    editable.value.innerText = ''
    editable.value.blur()
}

const removeLast = () => {
    if (!state.value.search.length) {
        selected.value.pop()
    }
}

const excerpt = (text, length = 20) => {
    return text.length > length ? text.substring(0, length) + '...' : text
}


</script>
<template>
    <div class="relative outline-none" :class="{ 'opacity-40 pointer-events-none': props.disabled }">
   
        <!-- display -->
        <div class="relative">
            <div @click.prevent="showItems"
                class="border border-gray-200 rounded bg-slate-100 absolute top-0 left-0 w-full h-full z-0 cursor-text">
            </div>
            <div class="flex justify-between p-2 w-ful"  @click.prevent="state.showItems = true">
                <div class="flex flex-wrap gap-2 p-2 items-center w-full z-10 cursor-text">
                    <div v-if="selectedItems.length" v-for="item in selectedItems"
                        class="inline-flex items-center gap-3 bg-gray-400 text-white text-sm rounded-full px-3 py-1"> 
                        {{ isGrouped ? groupTitle(item[group]) + ' : ' : '' }} {{ excerpt(item.title, 20) }} <svg @click.prevent="select(item.ID)"
                            class="fill-current w-2.5 cursor-pointer hover:text-white transition duration-75 text-gray-300"
                            viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M0.434266 0.433533C0.746685 0.121114 1.25322 0.121114 1.56564 0.433533L4.99995 3.86785L8.43427 0.433533C8.74669 0.121114 9.25322 0.121114 9.56564 0.433533C9.87806 0.745953 9.87806 1.25248 9.56564 1.5649L6.13132 4.99922L9.56564 8.43353C9.87806 8.74595 9.87806 9.25249 9.56564 9.5649C9.25322 9.87732 8.74669 9.87732 8.43427 9.5649L4.99995 6.13059L1.56564 9.5649C1.25322 9.87732 0.746685 9.87732 0.434266 9.5649C0.121846 9.25249 0.121846 8.74595 0.434266 8.43353L3.86858 4.99922L0.434266 1.5649C0.121846 1.25248 0.121846 0.745953 0.434266 0.433533Z"
                                fill="currentColor" />
                        </svg>
                    </div>
                    <div v-if="!selectedItems.length && !state.search" class="text-gray-400 absolute z-0 text-[14px]"
                        @click.prevent="showItems">{{ displayPlaceholder }}</div>
                    <div ref="editable" :disabled="props.disabled" class="outline-none z-20 h-6 text-gray-600"
                        :contenteditable="!props.disabled" @input="state.search = $event.target.innerText"
                        @keydown.delete="removeLast" @keydown.esc="hideItems">
                    </div>
                </div>
                <div class="w-5 z-10 h-6 flex items-center justify-center">
                    <svg class="fill-current w-3 text-gray-500 cursor-pointer"
                        @click.prevent="state.showItems = !state.showItems" viewBox="0 0 14 8" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M0.322237 0.279168C0.740247 -0.103625 1.40494 -0.0912127 1.80688 0.306892L7 5.55723L12.1931 0.306893C12.5951 -0.0912125 13.2598 -0.103625 13.6778 0.279168C14.0958 0.661961 14.1088 1.295 13.7069 1.69311L7.75687 7.69311C7.55891 7.88919 7.28562 8 7 8C6.71438 8 6.44109 7.88919 6.24313 7.69311L0.293126 1.69311C-0.108806 1.295 -0.0957732 0.661961 0.322237 0.279168Z"
                            fill="currentColor" />
                    </svg>
                </div>
            </div>
        </div>
        <!-- selector  -->
        <div v-if="state.showItems" class="fixed w-full h-full left-0 top-0 z-0 bg-gray-500 opacity-0" @click="hideItems">
        </div>
        <div v-if="state.showItems"
            class="bg-white shadow z-20 w-full scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-blue-400 absolute left-0 top-full mt-1 border-t border-gray-100 max-h-96 overflow-y-auto flex flex-col gap-0.5">
            <label 
            v-if="filteredItems.length" 
            v-for="item in filteredItems" 
            :key="item.ID" 
            @click.prevent="select( Number( item.ID ) ), state.currentItem =  Number( item.ID ) "
                :class="{ 'bg-blue-50': selected.includes( Number( item.ID ) ) }"
                class="flex py-3 px-3 flex-wrap items-center cursor-pointer gap-3 hover:bg-blue-50 transition duration-75">
                <input type="checkbox" class="pointer-events-none" :checked="selected.includes( Number( item.ID ) )">
                <span class="font-normal text-gray-600">{{ item.title }} </span>
                <span v-if="isGrouped" class="text-sm font-normal px-3.5 py-0.5 rounded-full" :class="getSlugColor(item[group])">{{
                    groupTitle(item[group]) }}</span>
            </label>
            <div v-else class="p-5 rounded text-gray-500">
                <div v-if="state.search">{{ t('no_result_found_for', { search: state.search }) }}</div>
                <div v-else>{{ t('no_result_found') }}</div>
            </div>
        </div>
    </div>
</template>