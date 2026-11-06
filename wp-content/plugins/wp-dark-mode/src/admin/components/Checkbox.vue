<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <span class="cursor-pointer wp-dark-mode-ignore ring-1 w-[17px] h-[17px] rounded relative inline-flex items-center justify-center hover:shadow transition"
    :class="{
        'bg-blue-600 ring-blue-600' : props.modelValue,
        'bg-[#fff] ring-slate-400' : !props.modelValue
    }" @click.prevent="emit('update:modelValue', !props.modelValue)">
        <transition name="bounce2">
            <svg v-if="props.modelValue" xmlns="http://www.w3.org/2000/svg" class="fill-current text-white w-5" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
            </svg>
        </transition>
    </span>
</template>

<style scoped>
.bounce2-enter-active, .bounce2-leave-active {
    animation: bounce2 0.5s 1;
}
.bounce2-leave-active {
    animation: bounce2 0.5s 1 reverse;
}

@keyframes bounce2 {
    from {
        transform: scale(.8);
    }
    50% {
        transform: scale(1.2);
    }
    to {
        transform: scale(1);
    }
}
</style>