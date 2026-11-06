<script setup>
import Header from './Header.vue';
</script>

<template>
    <Row transparent gap="6">
        <Header />
        <div class="flex flex-col gap-6 md:p-12 w-full bg-white">
            <RouterView />
        </div>
    </Row>
</template>
