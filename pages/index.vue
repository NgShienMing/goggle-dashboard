<template>
    <div class="mode">
        <div class="d-flex align-items-center justify-content-center" style="min-height: 100vh;">
            <div class="container-md">
                <!-- Title -->
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10 text-center">
                        <span class="title">{{ title }}</span>
                    </div>
                    <div class="col-1"></div>
                </div>

                <hr>

                <!-- Measurements -->
                <div class="row justify-content-center">
                    <MeasItem v-if="tempLoaded" name="Temperature" :value="latestTemperature" unit=" °C" />
                    <MeasItem v-if="humLoaded" name="Humidity" :value="latestHumidity" unit=" %" />
                    <MeasItem v-if="pressureLoaded" name="Pressure" :value="latestPressure" unit=" hPa" />
                    <MeasItem v-if="lumLoaded" name="Luminance" :value="latestLuminance" unit=" lux" />
                    <MeasItem v-if="uvLoaded" name="UV" :value="latestUV" unit=" mW/cm²" />
                    <MeasItem v-if="altitudeLoaded" name="Altitude" :value="latestAltitude" unit=" m" />
                </div>
                
                <hr>
                
                <!-- Charts -->
                <div class="row">
                    <LineChart v-if="tempLoaded" :chartId="tempChartId" :chartData="tempChartData" />
                    <LineChart v-if="humLoaded" :chartId="humChartId" :chartData="humChartData" />
                    <LineChart v-if="pressureLoaded" :chartId="pressureChartId" :chartData="pressureChartData" />
                    <LineChart v-if="lumLoaded" :chartId="lumChartId" :chartData="lumChartData" />
                    <LineChart v-if="uvLoaded" :chartId="uvChartId" :chartData="uvChartData" />
                    <LineChart v-if="altitudeLoaded" :chartId="altitudeChartId" :chartData="altitudeChartData" />
                </div>

                <hr>

                <!-- Buttons -->
                <div class="d-grid my-3">
                    <button type="button" class="btn" @click="togglePersonState" style="background-color: #006dae;">
                        <span style="color: #ffffff;">{{ personState }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const title = 'A. I. M. Z. Goggles';
const personState = ref('Working . . .');
const mode = ref('#ffffff');

const latestTemperature = ref(0);
const latestHumidity = ref(0);
const latestPressure = ref(0);
const latestAltitude = ref(0);
const latestLuminance = ref(0);
const latestUV = ref(0);

const uvChartData = ref({});
const uvChartId = ref('');
const uvLoaded = ref(false);

const tempChartData = ref({});
const tempChartId = ref('');
const tempLoaded = ref(false);

const humChartData = ref({});
const humChartId = ref('');
const humLoaded = ref(false);

const pressureChartData = ref({});
const pressureChartId = ref('');
const pressureLoaded = ref(false);

const lumChartData = ref({});
const lumChartId = ref('');
const lumLoaded = ref(false);

const altitudeChartData = ref({});
const altitudeChartId = ref('');
const altitudeLoaded = ref(false);

const supaClient = useSupabaseClient();

const dbChannel = supaClient
    .channel('db-changes')
    .on(
        'postgres_changes',
        { 
            event: '*', 
            schema: 'public', 
            table: 'bme280' 
        },
        () => refreshBME()
    )
    .on(
        'postgres_changes',
        { 
            event: '*', 
            schema: 'public', 
            table: 'temt6000' 
        },
        () => refreshTEMT()
    )
    .on(
        'postgres_changes',
        { 
            event: '*', 
            schema: 'public', 
            table: 'uvs12sd' 
        },
        () => refreshUV()
    );

const queryRealtimeChange = (name, table, values, timeRange, timeUnit) => useAsyncData(
    name,
    async () => {
        // timeRange in minutes
        if (timeUnit === 'hour') {
            timeRange *= 60;
        }
        const previousTimestamp = new Date(new Date().getTime() - timeRange * 60000).toISOString();
        const { data, error } = await supaClient
            .from(table)
            .select(values.join(', '))
            .gte('created_at', previousTimestamp)
            .order('created_at', { ascending: true });
        if (error) {
            console.error(error);
            return;
        }
        return data;
    }
)

const { data: uvData, refresh: refreshUV } = queryRealtimeChange(
    'uv',
    'uvs12sd',
    ['created_at', 'uv_value'],
    24,
    'hour'
);
const { data: bmeData, refresh: refreshBME } = queryRealtimeChange(
    'bme',
    'bme280',
    ['created_at', 'temperature', 'humidity', 'pressure', 'altitude'],
    24,
    'hour'
);
const { data: temtData, refresh: refreshTEMT } = queryRealtimeChange(
    'temt',
    'temt6000',
    ['created_at', 'luminance'],
    24,
    'hour'
);

onMounted(() => {
    dbChannel.subscribe();
});
onUnmounted(() => {
    dbChannel.unsubscribe()
});

const updateLatestAndChart = (data, latest, chartData, chartId, loaded, param, label) => {
    // update latest values
    latest.value = data[data.length - 1][param]

    // update chart data
    chartData.value = {
        labels: data.map((item) => {
            const date = new Date(item.created_at);
            if (date.getMinutes() < 10) {
                return `${date.getHours()}:0${date.getMinutes()}`;
            }
            return `${date.getHours()}:${date.getMinutes()}`;
        }),
        datasets: [
            {
                data: data.map((item) => item[param]),
                label: label,
                backgroundColor: '#f87979'
            }
        ]
    };
    chartId.value = param + '-chart';
    loaded.value = true;
}

watch(uvData, (newValue, oldValue) => {
    if (newValue) {
        updateLatestAndChart(
            newValue,
            latestUV,
            uvChartData,
            uvChartId,
            uvLoaded,
            'uv_value',
            'UV'
        );
    }
})
watch(bmeData, (newValue, oldValue) => {
    if (newValue) {
        updateLatestAndChart(
            newValue,
            latestTemperature,
            tempChartData,
            tempChartId,
            tempLoaded,
            'temperature',
            'Temperature'
        );
        updateLatestAndChart(
            newValue,
            latestHumidity,
            humChartData,
            humChartId,
            humLoaded,
            'humidity',
            'Humidity'
        );
        updateLatestAndChart(
            newValue,
            latestPressure,
            pressureChartData,
            pressureChartId,
            pressureLoaded,
            'pressure',
            'Pressure'
        );
        updateLatestAndChart(
            newValue,
            latestAltitude,
            altitudeChartData,
            altitudeChartId,
            altitudeLoaded,
            'altitude',
            'Altitude'
        );
    }
})
watch(temtData, (newValue, oldValue) => {
    if (newValue) {
        updateLatestAndChart(
            newValue,
            latestLuminance,
            lumChartData,
            lumChartId,
            lumLoaded,
            'luminance',
            'Luminance'
        );
    }
})

const togglePersonState = () => {
    if (personState.value === 'Working . . .') {
        personState.value = 'Resting . . .';
        mode.value = 'grey';
    } else {
        personState.value = 'Working . . .';
        mode.value = '#ffffff';
    }
}
</script>

<script>
import Swal from 'sweetalert2';
import {
    doc,
    onSnapshot
} from 'firebase/firestore';
// import BarChart from '~/components/BarChart.vue';
// import LineChart from '~/components/LineChart.vue';

</script>

<style lang="css" scoped>
.title {
    font-size: 32px;
    color: #000000;
}
/* .mode {
    background-color: v-bind(mode);
} */
</style>
