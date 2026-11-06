<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
    thumbnail: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    controls: {
        type: Boolean,
        default: true
    }
})

// Detect video host
const getVideoHost = url => {
     // Regular expression for YouTube URLs
     const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    // Regular expression for Vimeo URLs
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(video\/)?\d+/;
    // Regular expression for common video file extensions
    const videoFileRegex = /\.(mp4|avi|mov|flv|wmv|webm|m4v|mkv|mpg|mpeg|vob|asf|divx|ogv|3gp)$/i;


    if (youtubeRegex.test(url)) {
        return 'youtube';
    } else if (vimeoRegex.test(url)) {
        return 'vimeo';
    } else if (videoFileRegex.test(url)) {
        return 'file';
    } else {
        return false;
    }
}
/**
 * Get YouTube video ID
*/
const getYouTubeVideoID = url => {
    // Regular expression for extracting the YouTube video ID
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Get Vimeo video ID
const getVimeoVideoID = url => {
    // Regular expression for extracting the Vimeo video ID
    const regex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]+\/videos\/|album\/\d+\/video\/|video\/|)(\d+)|vimeo\.com\/(?:\w*\/)?(\d+))/i;
    
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
}
</script>

<template>
    <div class="w-full h-auto">
        <iframe v-if="'youtube' === getVideoHost(props.url)" class="w-full h-full" :src="`https://www.youtube.com/embed/${getYouTubeVideoID(props.url)}`" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" allowfullscreen></iframe>
        <iframe v-if="'vimeo' === getVideoHost(props.url)" class="w-full h-full" :src="`https://player.vimeo.com/video/${getVimeoVideoID(props.url)}`" frameborder="0" allow="fullscreen" allowfullscreen></iframe>
        <video v-if="'file' === getVideoHost(props.url)" controls :src="props.url" class="w-full" v-bind="$attrs"></video>
    </div>
</template>