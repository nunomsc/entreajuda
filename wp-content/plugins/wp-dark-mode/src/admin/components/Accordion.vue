<script setup>
import { ref, computed, useSlots, defineProps } from 'vue'
import { Icon } from '@components';

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    },
    default: {
        type: [Number, Boolean],
        default: 0
    }
});

const slots = useSlots();
const items = computed(() => {
    const slotContent = slots.default ? slots.default() : [];
    return slotContent.filter(vnode => vnode.type && vnode.type.__name === 'AccordionItem');
});

const defaultItem = computed(() => {
    return props.default >= 0 ? props.default : -1;
});

const selectedIndex = ref( defaultItem.value );
</script>

<template>
    <section class="flex flex-col gap-3 w-full wp-dark-mode-accordion">
        <div v-if="items && items.length" v-for="(item, index) in items" :key="index"
            class="border-t border-gray-100 flex flex-col gap-2 pt-3.5">
            <div class="group flex items-center gap-2 cursor-pointer" @click.prevent="selectedIndex = index">
                <div class="flex sm:items-center gap-3 px-2 sm:px-0">
                    <div>
                        <div class="group-hover:bg-blue-600 transition text-sm duration-200 group-hover:text-white group-hover:border-blue-600 w-6 h-6 flex items-center justify-center border rounded-full"
                            :class="{
                                'bg-blue-600 text-white border-blue-600': selectedIndex === index,
                                'border-blue-600 bg-blue-50 text-gray-600': selectedIndex !== index
                            }"> {{ index + 1 }} </div>
                    </div>
                    <div class="text-sm sm:text-base font-normal leading-6 text-[#1F2937]" v-html="item.props.name"></div>
                </div>
                <div class="hidden sm:flex">
                    <Icon name="chevron" class="mt-1 transition  duration-200" :class="{
                        'rotate-180 text-blue-600': selectedIndex === index,
                        'text-gray-600' : selectedIndex !== index
                    }" width="w-4" />
                </div>
            </div>
            <transition name="slide-down">
                <div class="px-3 sm:px-9 py-4 text-sm text-gray-600" v-if="selectedIndex === index">
                    <component :is="item"></component> <!-- Render the AccordionItem component with its slot content -->
                </div>
            </transition>
        </div>
    </section>
</template>

<style scoped>
.slide-down-enter-active {
    transition: all 0.2s ease-out;
}

.slide-down-leave-active {
    transition: 0s;
    opacity: 0;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(10px);
    opacity: 0;
}
</style>