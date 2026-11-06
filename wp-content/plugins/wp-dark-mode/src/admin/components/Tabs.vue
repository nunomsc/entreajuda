<script setup>
import { ref, computed, useSlots, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    default: {
        type: String,
        default: null
    }
});

const slots = useSlots();

const items = computed(() => {
    const slotContent = slots.default ? slots.default() : [];
    return slotContent.filter(vnode => vnode.type && vnode.type.__name === 'Tab');
});

// Router.
const route = useRoute();

// Set default item if default prop is set, otherwise set to first item
const defaultTab = computed(() => {
    // If found from route query, use that.
    if ( route.query.tab ) {
        return route.query.tab;
    }

    // If default prop is set, use that.
    if ( props.default ) {
        return props.default;
    }

    // Otherwise, use the first item.
    if ( items.value.length ) {
        return items.value[0].props.id;
    }

    return null;
});

const selectedTab = ref( defaultTab.value );

// Returns the other slot with the name of the selected tab id
const selectedTabContent = computed(() => {
    if ( selectedTab.value in slots ) {
        return slots[selectedTab.value];
    }

    return null;
});

const names = ref(null);


const router = useRouter();
const setTab = (tab) => {
    selectedTab.value = tab;
    // Update the URL.
    router.push({ query: { tab } });
};


</script>

<template>
    <section class="flex flex-col gap-6 w-full">
        <!-- TabName  -->
        <div ref="names" v-if="items && items.length" class="flex items-center flex-wrap gap-2 gap-y-4 sm:gap-[35px] border-b border-gray-200 relative pb-[10px]">
            <div v-for="item in items" @click.prevent="setTab(item.props.id)" 
                class="text-xs sm:text-sm relative whitespace-nowrap cursor-pointer flex flex-row items-center justify-center py-2.5 px-3 gap-2 font-normal rounded-2xl"
                :class="{
                    'bg-[#E5E7EB] text-[#1F2937]' : selectedTab !== item.props.id,
                    'bg-[#2563EB] text-white' : selectedTab === item.props.id,
                }"
                >
                <component :is="item"></component>

                <div v-if="selectedTab === item.props.id" class="absolute bottom-[-11.4px] h-0.5 bg-blue-600 w-full rounded-full"></div>
            </div>
        </div>

        <!-- TabContent -->
        <div class="flex flex-col gap-6">
            <component :is="selectedTabContent"></component>
        </div>

    </section>
</template>