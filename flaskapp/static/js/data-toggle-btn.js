// Get references to the buttons and data sections
const realTimeBtn = document.getElementById('realTimeBtn');
const pastRecordsBtn = document.getElementById('pastRecordsBtn');
const realTimeData = document.getElementById('realTimeData');
const pastRecordsData = document.getElementById('pastRecordsData');

// Function to switch views
function toggleView() {
    if (realTimeBtn.classList.contains('active')) {
        realTimeData.style.display = 'block';
        pastRecordsData.style.display = 'none';
    } else {
        realTimeData.style.display = 'none';
        pastRecordsData.style.display = 'block';
    }
}

// Event listeners for the buttons
realTimeBtn.addEventListener('click', function () {
    if (!realTimeBtn.classList.contains('active')) {
        realTimeBtn.classList.add('active');
        pastRecordsBtn.classList.remove('active');
        toggleView();
    }
});

pastRecordsBtn.addEventListener('click', function () {
    if (!pastRecordsBtn.classList.contains('active')) {
        pastRecordsBtn.classList.add('active');
        realTimeBtn.classList.remove('active');
        toggleView();
    }
});

// Initialize with real-time data visible
toggleView();
