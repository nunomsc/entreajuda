import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import API from '@o/API'

// Content Store
export default defineStore('useContents', () => {

	const isLoaded = ref(false)

	const data = ref({})

	const postTypes = computed(() => data.value.post_types || [])
	const posts = computed(() => data.value.posts || [])
	const terms = computed(() => data.value.terms || [])
	const taxonomies = computed(() => data.value.taxonomies || [])

	const products = computed(() => data.value.products || [])
	const productCategories = computed(() => data.value.product_categories || [])

	const fetchData = async () => {
		const response = await API.get('/contents')
		if( response.data ) data.value = response.data.contents
		isLoaded.value = true

		// Log('Contents', data.value);
	}

	// Initial fetch
	fetchData();

	// export all the functions and variables 
	return {
		postTypes,
		posts,
		taxonomies,
		terms,
		products,
		productCategories,
	}
})