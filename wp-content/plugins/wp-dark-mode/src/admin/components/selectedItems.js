import { computed } from 'vue';
import { selected } from './MultiSelect.vue';

export const selectedItems = computed(() => {
const items = items.value.filter(item => selected.value.includes(item.id));

//  unique 
});
