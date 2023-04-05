// Define transportation lines with their name and url path
const Lines = {
    tramA_MPGLHR: {
        name: "TRAM A",
        urlPath: "/4587/A/route:TBT:59"
    },
    tramA_LGBCBFD: {
        name: "TRAM A",
        urlPath: "/4588/A/route:TBT:59_R"
    },
    bus11_Victoire: {
        name: "BUS 11",
        urlPath: "/400/11/route:TBC:11_R"
    }
};

// Create an empty array to hold transportation information, and define the base URL for TBM's real-time API
const ALL_INFO = [];
const BASE_URL_TBM_TRANSPORT_REALTIME = "https://ws.infotbm.com/ws/1.0/get-realtime-pass";

// Define a class to hold transportation information
class TBMVehicleInfo {
    constructor(line, destination_name, waittime) {
        this.line = line;
        this.destinationName = destination_name;
        this.waitTime = waittime;
    }
}

// Process the response from TBM's real-time API, and return an array of TBMVehicleInfo objects
function processTBMApiCirculationResponse(line, response) {
    const vehicles = [];
    for (const destinationIndex in response.destinations) {
        for (const vehicleIndex in response.destinations[destinationIndex]) {
            const vehicle = response.destinations[destinationIndex][vehicleIndex];
            vehicles.push(new TBMVehicleInfo(line, vehicle.destination_name, vehicle.waittime));
        }
    }
    return vehicles;
}

// Retrieve transportation information for a given line from TBM's real-time API
async function getTBMTransportInformation(line) {
    let response = await fetch(BASE_URL_TBM_TRANSPORT_REALTIME + line.urlPath, {
        "headers": {
            "accept": "*/*",
        },
        "method": "GET",
    });
    json = await response.json();
    const transportInformations = processTBMApiCirculationResponse(line.name, json);
    return transportInformations;
}


//TRAM A Incidents
// fetch("htatps://ws.infotbm.com/ws/1.0/alerts/by-transport/line:TBT:59", {
//     "headers": {
//         "accept": "*/*",
//     },
//     "method": "GET",
// }).then(response => response.json())
//     .then(json => console.log(json));

// // BUS 11 Incidents 
// fetch("httaps://ws.infotbm.com/ws/1.0/alerts/by-transport/line:TBC:11", {
//     "headers": {
//         "accept": "*/*",
//     },
//     "method": "GET",
// }).then(response => response.json())
//     .then(json => console.log(json));


// Define Vue application and its data
const { createApp } = Vue;
createApp({
    data() {
        return {
            data: null,
            transportTableCols: ['Ligne', 'Direction', 'Temps d\'attente']
        };
    },
    methods: {
        // Fetch transportation information for all lines and update the data object
        async fetchData() {
            ALL_INFO.push(await getTBMTransportInformation(Lines.tramA_MPGLHR));
            ALL_INFO.push(await getTBMTransportInformation(Lines.tramA_LGBCBFD));
            ALL_INFO.push(await getTBMTransportInformation(Lines.bus11_Victoire));
            console.log(ALL_INFO);
            this.data = ALL_INFO;
        },
    },
    mounted() {
        this.fetchData();
    },
}).mount('#app');
