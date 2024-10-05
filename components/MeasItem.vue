<template>
    <div class="col-sm-4 col-6">
        <div class="row">
            <div class="col-1 param text-start"></div>
            <div class="col-4 param text-start">{{ name }}</div>
            <div class="col-3 param text-end">{{ value }}</div>
            <div class="col-2 param text-start">{{ unit }}</div>
            <div class="col-1 param text-end"></div>
        </div>
    </div>
</template>

<script setup>
// import { defineProps } from 'vue';
const props = defineProps(['name', 'value', 'unit']);
</script>

<style lang="css" scoped>
.param {
    font-size: 15px;
}
</style>