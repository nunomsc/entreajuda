<script setup>
import { computed, defineProps } from 'vue'
import { Row, Button, Icon } from '@components';
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();


const props = defineProps({
    title: {
        type: [String, Boolean],
        default: '',
    },
    content: {
        type: [String, Boolean],
        default: '',
    },
    time: {
        type: [String, Boolean],
        default: '1:30'
    },
    button: {
        type: [String, Boolean],
        default: '',
    },
    YouTubeId: {
        type: [String, Boolean],
        default: 'eSKPcQfPC5w'
    },
});

const displayTitle = computed(() => props.title === '' ? t('watch_video_tutorial') : props.title);
const displayContent = computed(() => props.content === '' ? t('tutorial_description') : props.content);
const displayButton = computed(() => props.button === '' ? t('watch_video_tutorial') : props.button);


const YouTubeLInk = computed(() => {
    return `https://www.youtube.com/embed/${props.YouTubeId}?autoplay=0&mute=1&rel=0&showinfo=1&controls=1`
});

const OpenVideo = () => {
    window.open(`https://www.youtube.com/watch?v=${props.YouTubeId}`, '_blank');
}

</script>

<template>
    <!-- Tutorial Video -->
    <Row space dark class="rounded-xl justify-between flex-col sm:flex-row">
        <Row transparent>
            <Row inline transparent v-if="displayTitle || props.time">
                <Heading bold v-if="displayTitle">{{ displayTitle }}</Heading> 
                <span v-if="props.time" class="mt-0.5 text-sm rounded-md h-5 px-1 inline-flex items-center justify-center font-medium bg-blue-50 border border-blue-300 text-blue-600">{{ props.time }}</span>
            </Row>
            <Hints v-if="displayContent" class="w-full max-w-sm leading-5" v-html="displayContent">
            </Hints>
            <slot name="default" />
            <div v-if="displayButton">
                <Button class="bg-blue-600 font-normal" @click.prevent="OpenVideo">{{ displayButton }}<Icon name="chevron" width="w-4" class="rotate-[-90deg]" /></Button>
            </div>

        </Row>
        
        <div class="relative sm:h-36 w-auto flex items-center justify-center">
            <iframe :src="YouTubeLInk" class="rounded-md" frameborder="0"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
        </div>
    </Row>
</template>