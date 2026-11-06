<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
    // if route not found redirect to controls/frontend
    // if ( route.name === 'NotFound' ) {
    //     router.push('/settings/');
    // }
});
</script>
<template>
    <div>
        {{ route }}
        <h1>Not Found</h1>
    </div>
</template>