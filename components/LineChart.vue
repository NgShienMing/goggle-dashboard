<template>
    <div class="col-lg-4 col-sm-6 col-12">
        <Line :id="chartId" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { 
    Chart as ChartJS, 
    Title, 
    Tooltip, 
    Legend, 
    LineElement,
    PointElement,
    CategoryScale, 
    LinearScale, 
} from 'chart.js'

ChartJS.register(
    Title, 
    Tooltip, 
    Legend, 
    LineElement, 
    PointElement,
    CategoryScale, 
    LinearScale
)

const props = defineProps({
    chartId: {
        type: String,
        required: true,
    },
    chartData: {
        type: Object,
        required: true
    },
    chartOptions: {
        type: Object,
        default: {
            responsive: true,
        }
    }
})
</script>