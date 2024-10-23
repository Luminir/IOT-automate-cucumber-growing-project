let tempChart, soilChart, humChart, lightChart;
let dataFetchInterval;

// // Function to fetch temperature data and update the chart
// function fetchTemperatureData() {
//     $.ajax({
//         url: "/api/fetch_sensor_data",
//         type: "GET",
//         success: function(data) {
//             console.log("Fetched temperature data:", data);
//             // Check if the temperature data exists
//             if (data.DHT11 && data.DHT11.temperature) {
//                 const timeStamp = new Date().toLocaleTimeString();
//                 // Add timestamp to labels
//                 tempChart.data.labels.push(timeStamp);
//                 // Push the temperature data to the chart
//                 tempChart.data.datasets[0].data.push(data.DHT11.temperature);
//                 // Update the chart to reflect new data
//                 tempChart.update();
//             }
//         },
//         error: function(error) {
//             console.error("Error fetching temperature data:", error);
//         }
//     });
// }

// // Function to fetch soil moisture data and update the chart
// function fetchSoilMoistureData() {
//     $.ajax({
//         url: "/api/fetch_sensor_data",
//         type: "GET",
//         success: function(data) {
//             console.log("Fetched soil moisture data:", data);
//             // Check if the soil moisture data exists
//             if (data.Moisture_sensor) {
//                 const timeStamp = new Date().toLocaleTimeString();
//                 // Add timestamp to labels
//                 soilChart.data.labels.push(timeStamp);

//                 // Push the data from each sensor to the chart
//                 soilChart.data.datasets[0].data.push(data.Moisture_sensor.sensor_1);
//                 soilChart.data.datasets[1].data.push(data.Moisture_sensor.sensor_2);
//                 soilChart.data.datasets[2].data.push(data.Moisture_sensor.sensor_3);
//                 soilChart.data.datasets[3].data.push(data.Moisture_sensor.sensor_4);

//                 // Update the chart to reflect new data
//                 soilChart.update();
//             }
//         },
//         error: function(error) {
//             console.error("Error fetching soil moisture data:", error);
//         }
//     });
// }

// Function to fetch sensor data and update both charts
function fetchData() {
    $.ajax({
        url: "/api/fetch_sensor_data",
        type: "GET",
        success: function(data) {
            console.log("Fetched sensor data:", data);
            const timeStamp = new Date().toLocaleTimeString();

            // Check if the temperature data exists and update temperature chart
            if (data.DHT11 && data.DHT11.temperature) {
                // Add timestamp to labels
                tempChart.data.labels.push(timeStamp);
                // Push the temperature data to the chart
                tempChart.data.datasets[0].data.push(data.DHT11.temperature);
                // Update the temperature chart to reflect new data
                tempChart.update();
            }

            // Check if the humidity data exists and update the humidity chart
            if (data.DHT11 && data.DHT11.humidity) {
                humChart.data.labels.push(timeStamp); // Add timestamp to the table
                humChart.data.datasets[0].data.push(data.DHT11.humidity);
                humChart.update();
            }

            // Check if the soil moisture data exists and update soil moisture chart
            if (data.Moisture_sensor) {
                // Add timestamp to labels
                soilChart.data.labels.push(timeStamp);
                // Push the data from each soil moisture sensor to the chart
                soilChart.data.datasets[0].data.push(data.Moisture_sensor.sensor_1);
                soilChart.data.datasets[1].data.push(data.Moisture_sensor.sensor_2);
                soilChart.data.datasets[2].data.push(data.Moisture_sensor.sensor_3);
                soilChart.data.datasets[3].data.push(data.Moisture_sensor.sensor_4);
                // Update the soil moisture chart to reflect new data
                soilChart.update();
            }

            // Check if BH1750 exist and Sun Brightness in HTML
            if (data.BH1750 && data.BH1750.lux) {
                lightChart.data.labels.push(timeStamp);
                lightChart.data.datasets[0].data.push(data.BH1750.lux);
                lightChart.update();
            }
        },
        error: function(error) {
            console.error("Error fetching sensor data:", error);
        }
    });
}

// Call fetchTemperatureData and fetchSoilMoistureData functions periodically
function startFetchingData() {
    if (!dataFetchInterval) {
        dataFetchInterval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    }
}

// Initialize charts on document ready
$(document).ready(function() {
    // Temperature chart
    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [{
                label: 'Temperature',
                data: [],
                borderColor: 'orange',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    min: 0,
                    max: 50
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    }
                }
            }
        }
    });

    // Soil moisture chart
    const ctxSoil = document.getElementById('soilChart').getContext('2d');
    soilChart = new Chart(ctxSoil, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [
                {
                    label: 'Sensor 1',
                    data: [],
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Sensor 2',
                    data: [],
                    borderColor: 'orange',
                    fill: false
                },
                {
                    label: 'Sensor 3',
                    data: [],
                    borderColor: 'yellow',
                    fill: false
                },
                {
                    label: 'Sensor 4',
                    data: [],
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Moisture Level'
                    },
                    min: 0,
                    max: 5000 // Set y-axis from 0 to 5000
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    }
                }
            }
        }
    });

    const ctxHum = document.getElementById('humChart').getContext('2d');
    humChart = new Chart(ctxHum, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [{
                label: 'Humidity',
                data: [],
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    min: 0,
                    max: 100,
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    }
                }
            }
        }
    });

    const ctxLight =  document.getElementById('lightChart').getContext('2d');
    lightChart = new Chart(ctxLight, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [{
                label: 'Sun Brightness',
                data: [],
                borderColor: 'orange',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Lux (0 ~ 7,417)'
                    },
                    min: 0,
                    max: 7417,
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x',
                    }
                }
            }
        }
    });


    startFetchingData()

    $("#realTimeBtn").on("click", () => {
        // Show real-time data and start fetching if not already running
        realTimeData.style.display = 'block'; // Ensure the real-time data div is visible
        pastRecordsData.style.display = 'none'; // Hide past records
        startFetchingData(); // Ensure fetching continues
    });

    $("#pastRecordsBtn").on('click', () => {
        // Switch to past records view
        switchToPastRecords();
        pastRecordsData.style.display = 'block'; // Show past records
        realTimeData.style.display = 'none'; // Hide real-time data
    })
});


