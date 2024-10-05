<template>
    <div class="col-md-4 col-sm-6 col-12">
        <div class="row">
            <div class="col-md-1 col-1 param text-start"></div>
            <div class="col-md-4 col-3 param text-start">{{ name }}</div>
            <div class="col-md-3 col-4 param text-end">{{ value }}</div>
            <div class="col-sm-3 col-3 param text-end">{{ unit }}</div>
            <div class="col-md-1 col-1 param text-end"></div>
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