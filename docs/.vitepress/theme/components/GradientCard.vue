<template>
    <div class="gradient-card" :style="{ background: gradientBackground, '--total': total }">
        <div class="item" v-for="(color, index) in colors" :key="index">
            {{ color }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    colors: string[],
    direction?: string
}>();

const total = props.colors.length;
const gradientBackground = computed(() => {
    const direction = props.direction ?? '135deg'
    return `linear-gradient(${direction}, ${props.colors.reduce((prev, curr) =>
        [...prev, curr], [] as string[]
    ).join(', ')
        })`;
});
</script>

<style scoped>
.gradient-card {
    height: 6rem;
    border-radius: 1rem;
    margin: 1rem 0;
    display: grid;
    grid-template-columns: repeat(var(--total), 1fr);
    grid-template-rows: repeat(var(--total), 1fr);
}

.item {
    /* color: white;
    mix-blend-mode: difference; */
    justify-self: center;
    align-self: center;
    padding: 0.2rem 1rem;
    width: fit-content;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: calc(Infinity * 1px);
}

.item:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
}

.item:nth-child(2) {
    grid-column: 2;
    grid-row: 2;
}

.item:nth-child(3) {
    grid-column: 3;
    grid-row: 3;
}
</style>
