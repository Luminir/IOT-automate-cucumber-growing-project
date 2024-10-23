// Fetch past data from the server
fetch('/api/fetch_past_data')
  .then(response => response.json())
  .then(data => {
    // Check for errors
    if (data.error) {
      console.error(data.error);
      return;
    }

    // Process the fetched data
    const timestamps = [];
    const temperatures = [];
    const humidities = [];
    const moistureLevels = [];
    const lightLevels = [];

    // Loop through the fetched data to populate the arrays
    data.forEach(record => {
      const date = new Date(record.timestamp);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Format date as MM/DD
      timestamps.push(formattedDate);

      const sensorData = record.data.Data;

      // Extract relevant data for each sensor
      temperatures.push(sensorData.DHT11.temperature);
      humidities.push(sensorData.DHT11.humidity);
      moistureLevels.push(sensorData.Moisture_sensor.sensor_Average);
      lightLevels.push(sensorData.BH1750.lux);
    });

    // Create Temperature Chart
    createChart('tempPastChart', 'Temperature', 'Temperature (°C)', timestamps, temperatures);

    // Create Humidity Chart
    createChart('humPastChart', 'Humidity', 'Humidity (%)', timestamps, humidities);

    // Create Soil Moisture Chart
    createChart('soilPastChart', 'Soil Moisture Level', 'Moisture Level', timestamps, moistureLevels);

    // Create Light Level Chart
    createChart('lightPastChart', 'Light Level', 'Light (lux)', timestamps, lightLevels);
  })
  .catch(error => console.error('Error fetching data:', error));

// Function to create a chart
function createChart(chartId, label, yLabel, labels, data) {
  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: yLabel
          },
          beginAtZero: true
        }
      }
    }
  });
}




