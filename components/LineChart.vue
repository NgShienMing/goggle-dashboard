<template>
    <div class="col-lg-4 col-sm-6 col-12">
        <Line :id="chartId" :data="data" :options="opts" />
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

const paramMap = {
    "uv_energy": "UV energy (mW/cm2)",
    "temperature": "Temperature (°C)",
    "humidity": "Humidity (%)",
    "pressure": "Pressure (hPa)",
    "altitude": "Altitude (m)",
    "luminance": "Luminance (lux)"
}
const opts = ref({});
const data = ref({});
const plotData = () => {
    const chartName = props.chartId.split('-')[0];
    const orgOpts = props.chartOptions;
    const orgData = props.chartData;
    opts.value = {
        ...orgOpts,
    };
    data.value = {
        labels: orgData.labels,
        datasets: orgData.datasets
    };
    const state = orgData.state;
    const color = state == "dark" ? "#808080" : "#CECECE"
    opts.value.scales = {
        x: {
            title: {
                display: true,
                text: 'Time'
            },
            grid: {
                color: color
            },
            border: {
                color: color
            }
        },
        y: {
            title: {
                display: true,
                text: paramMap[chartName]
            },
            grid: {
                color: color
            },
            border: {
                color: color
            }
        }
    }
}
watch(props.chartData, plotData, { immediate: true });
</script>