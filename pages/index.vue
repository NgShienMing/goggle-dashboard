<template>
    <div class="dark:bg-black">
        <div class="d-flex align-items-center justify-content-center" style="min-height: 100vh;">
            <div class="container">
                <div :class="{ 'dark-active': isDark, 'dark-inactive': !isDark }" class="sticky-top">
                    <!-- Title -->
                    <div class="row mt-3">
                        <div class="col-1"></div>
                        <div class="col-10 text-center dark:text-white">
                            <span class="title">{{ title }}</span>
                        </div>
                        <div class="col-1"></div>
                    </div>

                    <hr class="dark:border-white">

                    <!-- Measurements -->
                    <div class="row justify-content-center dark:text-white">
                        <MeasItem v-if="tempLoaded" name="Temperature" :value="latestTemperature" unit=" °C" />
                        <MeasItem v-if="humLoaded" name="Humidity" :value="latestHumidity" unit=" %" />
                        <MeasItem v-if="pressureLoaded" name="Pressure" :value="latestPressure" unit=" hPa" />
                        <MeasItem v-if="lumLoaded" name="Luminance" :value="latestLuminance" unit=" lux" />
                        <MeasItem v-if="uvLoaded" name="UV" :value="latestUV" unit=" mW/cm²" />
                        <MeasItem v-if="altitudeLoaded" name="Altitude" :value="latestAltitude" unit=" m" />
                    </div>
                    <hr class="dark:border-white">
                </div>
                
                
                <!-- Charts -->
                <div class="row justify-content-center">
                    <LineChart v-if="tempLoaded" :chartId="tempChartId" :chartData="tempChartData" :chartOptions="chartOptions"/>
                    <LineChart v-if="humLoaded" :chartId="humChartId" :chartData="humChartData" :chartOptions="chartOptions" />
                    <LineChart v-if="pressureLoaded" :chartId="pressureChartId" :chartData="pressureChartData" :chartOptions="chartOptions" />
                    <LineChart v-if="lumLoaded" :chartId="lumChartId" :chartData="lumChartData" :chartOptions="chartOptions" />
                    <LineChart v-if="uvLoaded" :chartId="uvChartId" :chartData="uvChartData" :chartOptions="chartOptions" />
                    <LineChart v-if="altitudeLoaded" :chartId="altitudeChartId" :chartData="altitudeChartData" :chartOptions="chartOptions" />
                </div>

                
                <!-- Buttons -->
                <div :class="{ 'dark-active': isDark, 'dark-inactive': !isDark }" class="sticky-bottom">
                    <hr class="dark:border-white">
                    <button type="button" class="btn btn-color" @click="togglePersonState">
                        <span style="color: #ffffff;">{{ personState }}</span>
                    </button>
                </div>
                <!-- <div style="min-height: 1vh;">
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
const title = 'A. I. M. Z. Goggles';
const personState = ref('Working . . .');
const btnColor = ref('#1b1b1b');
const isDark = ref(false);

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

const chartOptions = ref({
    responsive: true,
});

const paramMap = {
    uv_value: {
        table: 'uvs12sd',
        values: ['created_at', 'uv_value']
    },
    temperature: {
        table: 'bme280',
        values: ['created_at', 'temperature']
    },
    humidity: {
        table: 'bme280',
        values: ['created_at', 'humidity']
    },
    pressure: {
        table: 'bme280',
        values: ['created_at', 'pressure']
    },
    altitude: {
        table: 'bme280',
        values: ['created_at', 'altitude']
    },
    luminance: {
        table: 'temt6000',
        values: ['created_at', 'luminance']
    }
}

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

const queryRealtimeChange = (name, table, values, timeRange=8760, timeUnit='hour') => useAsyncData(
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
    useColorMode().preference = 'light';
});
onUnmounted(() => {
    dbChannel.unsubscribe()
});

const updateLatestAndChart = async (data, latest, chartData, chartId, loaded, param, label) => {
    if (data) {
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
                    backgroundColor: '#1DB954',
                    borderColor: '#1DB954',
                }
            ]
        };
    } else {
        const table = paramMap[param]['table'];
        const values = paramMap[param]['values'];
        const { data, error } = await supaClient
            .from(table)
            .select(values.join(', '))
            .order('created_at', { ascending: true });
        latest.value = !error ? data[data.length - 1][param] : 0;
        chartData.value = {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: label,
                    backgroundColor: '#1DB954',
                    borderColor: '#1DB954',
                }
            ]
        };
    }
    chartId.value = param + '-chart';
    loaded.value = true;
};

watch(uvData, (newValue, oldValue) => {
    newValue = newValue.length == 0 ? null : newValue;
    // if (newValue) {
    updateLatestAndChart(
        newValue,
        latestUV,
        uvChartData,
        uvChartId,
        uvLoaded,
        'uv_value',
        'UV'
    );
    // }
})
watch(bmeData, (newValue, oldValue) => {
    newValue = newValue.length == 0 ? null : newValue;
    // if (newValue) {
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
    // }
})
watch(temtData, (newValue, oldValue) => {
    newValue = newValue.length == 0 ? null : newValue;
    // if (newValue) {
    updateLatestAndChart(
        newValue,
        latestLuminance,
        lumChartData,
        lumChartId,
        lumLoaded,
        'luminance',
        'Luminance'
    );
    // }
})

const togglePersonState = () => {
    personState.value = personState.value === 'Resting . . .' ? 'Working . . .' : 'Resting . . .';
    btnColor.value = personState.value === 'Resting . . .' ? '#1DB954' : '#1B1B1B';
    chartOptions.value = personState.value === 'Resting . . .' ? {
        responsive: true,
        scales: {
            x: {
                grid: {
                    color: '#808080',
                }
            },
            y: {
                grid: {
                    color: '#808080',
                }
            }
        }
    } : {
        responsive: true,
        scales: {
            x: {
                grid: {
                    color: '#CECECE',
                }
            },
            y: {
                grid: {
                    color: '#CECECE',
                }
            }
        }
    };
    isDark.value = personState.value === 'Resting . . .';
    setColourTheme(personState.value === 'Resting . . .' ? 'dark' : 'light');
}
const setColourTheme = (newTheme) => {
    useColorMode().preference = newTheme;
}
</script>

<style lang="css" scoped>
.title {
    font-size: 32px;
}
.btn-color {
    background-color: v-bind(btnColor);
    width: 100%;
}
.dark-active {
    background-color: #000000;
}
.dark-inactive {
    background-color: #FFFFFF;
}
</style>
