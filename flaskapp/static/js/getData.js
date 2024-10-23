// Function to fetch sensor data (temperature and soil moisture)
function fetchData() {
    $.ajax({
        url: "/api/fetch_sensor_data", // API endpoint
        type: "GET",
        success: function(data) {
            console.log("Fetched data:", data);

            // Update temperature value in HTML
            if (data.DHT11 && data.DHT11.temperature) {
                $('#tempValue').text(data.DHT11.temperature);
            }

            // Update humidity value in HTML
            if (data.DHT11 && data.DHT11.humidity) {
                $('#humValue').text(data.DHT11.humidity);
            }

            // Update soil moisture average in HTML
            if (data.Moisture_sensor && data.Moisture_sensor.sensor_Average) {
                const sensorAverage = data.Moisture_sensor.sensor_Average;
                const moisturePercentage = sensorAverage; // Convert to percentage already
                $('#soilValue').text(moisturePercentage.toFixed(2)); // Display with 2 decimal places
            }

            // Update Sun Brightness in HTML
            if (data.BH1750 && data.BH1750.lux) {
                const sunBrightness = data.BH1750.lux;
                // The device captures the lux from 0 - 65,535 lux
                // For cucumber to grow 37,000 - 50,000 lux
                const sunBrightnessPercent = (sunBrightness / 65535) * 100;
                $('#lightValue').text(sunBrightnessPercent.toFixed(2));
            }

            // Check the WaterAuto on or not
            // Check the WaterAuto value and update the toggle button accordingly
            if (data.waterAuto) {
                // If WaterAuto is true, set toggle to ON
                $('#autoSwitch').prop('checked', true);
                $('.switch-label-water').attr('data-on', 'ON');
                $('#manualWaterSwitch').prop('checked', false);
                $('.switch-manual-water').attr('data-off', 'OFF');
                $('.manual-water-div').hide();
            } else {
                // If WaterAuto is false, set toggle to OFF
                $('#autoSwitch').prop('checked', false);
                $('.switch-label-water').attr('data-off', 'OFF');
            }
            
            // Check for lightAuto on or not
            if (data.ledAuto) {
                $('#autoSwitch2').prop('checked', true);
                $('.switch-label-led').attr('data-on', 'ON');
                $('#manualLedSwitch').prop('checked', false);
                $('.switch-manual-light').attr('data-off', 'OFF');
                $('.manual-light-div').hide();
            } else {
                // If light auto is false, set toggle to OFF
                $('#autoSwitch2').prop('checked', false);
                $('.switch-label-led').attr('data-off', 'OFF');
            }


            // Manual water
            if (data.manualWater) {
                $('#manualWaterSwitch').prop('checked', true);
                $('.switch-manual-water').attr('data-on', 'ON');
            } else {
                $('#manualWaterSwitch').prop('checked', false);
                $('.switch-manual-water').attr('data-off', 'OFF');
            }

            // Manual Led Light
            if (data.manualLed) {
                $('#manualLedSwitch').prop('checked', true);
                $('.switch-manual-light').attr('data-on', 'ON');
            } else {
                $('#manualLedSwitch').prop('checked', false);
                $('.switch-manual-light').attr('data-off', 'OFF');
            }
        },
        error: function(error) {
            console.error("Error fetching sensor data:", error);
        }
    });
}

// Function to toggle the automatic watering system
function auto() {
    // Check the current state of the switch
    const isChecked = $('#autoSwitch').is(':checked');  // Check for TRUE & FALSE

    // Send the updated WaterAuto status to the server
    $.ajax({
        url: '/api/update_water_auto', // New API endpoint for updating WaterAuto status
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ waterAuto: isChecked }), // Send true if ON, false if OFF
        success: function(response) {
            console.log("waterAuto updated successfully:", response);
            // Immediately update the UI based on the new state
            if (isChecked) {
                $('.manual-water-div').hide(); // Hide manual water controls

                // if manual still ON and we turn AUTO ON => set manual to false
                $('#manualWaterSwitch').prop('checked', false);
                $('.switch-manual-water').attr('data-off', 'OFF');
                $.ajax({
                    url: '/api/update_water_manual',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ manualWater: false }),
                    success: function(response) {
                        console.log("manualWater turned OFF successfully:", response);
                    },
                    error: function(error) {
                        console.error("Error turning OFF manualWater:", error);
                    }
                });
            } else {
                $('.manual-water-div').show(); // Show manual water controls
            }
            fetchData();
        },
        error: function(error) {
            console.error("Error updating waterAuto:", error);
        }
    });

    // if (isChecked) {
    //     console.log("Auto watering is ON");
    //     return true;
    // } else {
    //     console.log("Auto watering is OFF");
    //     return false;
    // }
}

function manual() {
    // Check the current state of the switch
    const isChecked = $('#manualWaterSwitch').is(':checked');  // Check for TRUE & FALSE

    // Send the updated manualWater status to the server
    $.ajax({
        url: '/api/update_water_manual', // New API endpoint for updating manualWater status
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ manualWater: isChecked }), // Send true if ON, false if OFF
        success: function(response) {
            console.log("manualWater updated successfully:", response);
            fetchData();
        },
        error: function(error) {
            console.error("Error updating manualWater:", error);
        }
    });
}

function auto2() {
    // Check the current state of the switch
    const isChecked = $('#autoSwitch2').is(':checked');  // Check for TRUE & FALSE

    // Send the updated WaterAuto status to the server
    $.ajax({
        url: '/api/update_led_auto', // New API endpoint for updating WaterAuto status
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ ledAuto: isChecked }), // Send true if ON, false if OFF
        success: function(response) {
            console.log("ledAuto updated successfully:", response);
            if (isChecked) {
                $('.manual-light-div').hide(); // Hide manual light controls

                $('#manualLedSwitch').prop('checked', false);
                $('.switch-manual-light').attr('data-off', 'OFF');
                $.ajax({
                    url: '/api/update_led_manual',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ manualLed: false }),
                    success: function(response) {
                        console.log("manualLed turned OFF successfully:", response);
                    },
                    error: function(error) {
                        console.error("Error turning OFF manualLed:", error);
                    }
                });
            } else {
                $('.manual-light-div').show(); // Show manual light controls
            }
            fetchData();
        },
        error: function(error) {
            console.error("Error updating ledAuto:", error);
        }
    });

    // if (isChecked) {
    //     console.log("Auto watering is ON");
    //     return true;
    // } else {
    //     console.log("Auto watering is OFF");
    //     return false;
    // }
}

function manual2() {
    // Check the current state of the switch
    const isChecked = $('#manualLedSwitch').is(':checked');  // Check for TRUE & FALSE

    // Send the updated manualLed status to the server
    $.ajax({
        url: '/api/update_led_manual', // New API endpoint for updating manualLed status
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ manualLed: isChecked }), // Send true if ON, false if OFF
        success: function(response) {
            console.log("manualLed updated successfully:", response);
            fetchData();
        },
        error: function(error) {
            console.error("Error updating manualLed:", error);
        }
    });

    // if (isChecked) {
    //     console.log("Auto watering is ON");
    //     return true;
    // } else {
    //     console.log("Auto watering is OFF");
    //     return false;
    // }
}

fetchData();

// Call fetchData function every 30 seconds (30000 ms)
setInterval(fetchData, 30000);

// Fetch data immediately when page loads
$(document).ready(function() {
    fetchData();
});
