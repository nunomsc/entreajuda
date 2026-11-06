<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<template>
    <div class="inline-flex flex-col gap-2">
        <slot name="default" @click.prevent="isOpen = !isOpen"/>

        <div v-if="isOpen" class="bg-white shadow w-56 rounded">
            <slot name="content" />
        </div>        
    </div>
</template>