<template>
    <Bar id="my-chart-id" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { 
    Chart as ChartJS, 
    Title, 
    Tooltip, 
    Legend, 
    BarElement, 
    CategoryScale, 
    LinearScale 
} from 'chart.js'

ChartJS.register(
    Title, 
    Tooltip, 
    Legend, 
    BarElement, 
    CategoryScale, 
    LinearScale
)

export default {
    name: 'BarChart',
    components: { Bar },
    // props: {
    //     chartData: {
    //         type: Object,
    //         required: true
    //     },
    //     chartOptions: {
    //         type: Object,
    //         default: () => {}
    //     }
    // },
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March'],
                datasets: [
                    {
                        data: [40, 20, 12],
                        label: 'Data One',
                        backgroundColor: '#f87979'
                    }
                ]
            },
            chartOptions: {
                responsive: true
            }
        }
    }
}
</script>