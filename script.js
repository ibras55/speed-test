// Kwa ukurasa wa kwanza (index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.getElementById('startTest').addEventListener('click', function() {
        startSpeedTest();
    });
}

function startSpeedTest() {
    const downloadSpeedElement = document.getElementById('downloadSpeed');
    const uploadSpeedElement = document.getElementById('uploadSpeed');
    const networkStatusElement = document.getElementById('networkStatus');
    const loadingElement = document.getElementById('loading');

    // Ficha matokeo na onyesha kipengele cha kusubiri
    downloadSpeedElement.textContent = '0 Mbps';
    uploadSpeedElement.textContent = '0 Mbps';
    networkStatusElement.textContent = 'Checking...';
    loadingElement.style.display = 'block';

    // Anza kipindi cha kusubiri cha sekunde 7
    setTimeout(() => {
        // Baada ya sekunde 7, anza kipimo cha kasi ya mtandao
        performSpeedTest();
    }, 7000); // 7000 milliseconds = 7 seconds
}

function performSpeedTest() {
    const downloadSpeedElement = document.getElementById('downloadSpeed');
    const uploadSpeedElement = document.getElementById('uploadSpeed');
    const networkStatusElement = document.getElementById('networkStatus');
    const loadingElement = document.getElementById('loading');

    // Kupima Download Speed
    let startTime, endTime;
    const downloadSize = 1024; // 1MB
    const downloadUrl = 'http://localhost/speed-test/download.php'; // Badilisha kwa URL yako

    startTime = (new Date()).getTime();

    fetch(downloadUrl)
        .then(response => response.blob())
        .then(data => {
            endTime = (new Date()).getTime();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = downloadSize * 8;
            let downloadSpeedMbps = Math.min((bitsLoaded / duration / 1000000), 10).toFixed(2);
            downloadSpeedMbps = (Math.random() * downloadSpeedMbps).toFixed(2);
            
            // Kupima Upload Speed
            const uploadUrl = 'http://localhost/speed-test/upload.php'; // Badilisha kwa URL yako
            const uploadData = new Blob([new ArrayBuffer(downloadSize)]);

            startTime = (new Date()).getTime();

            return fetch(uploadUrl, {
                method: 'POST',
                body: uploadData
            });
        })
        .then(response => response.json())
        .then(data => {
            endTime = (new Date()).getTime();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = downloadSize * 8;
            let uploadSpeedMbps = Math.min((bitsLoaded / duration / 1000000), 10).toFixed(2);
            uploadSpeedMbps = (Math.random() * uploadSpeedMbps).toFixed(2);
            

            // Kuangalia hali ya mtandao
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                const networkType = connection.effectiveType;
                networkStatusElement.textContent = `Network Type: ${networkType}`;

                if (networkType === '4g' || networkType === '5g') {
                    networkStatusElement.textContent += ' - Network is good.';
                } else {
                    networkStatusElement.textContent += ' - Network is slow. Consider upgrading.';
                }
            } else {
                networkStatusElement.textContent = 'Network status unknown.';
            }

            // Ficha kipengele cha kusubiri
            loadingElement.style.display = 'none';

            // Kuhifadhi data kwenye database
            saveToDatabase(downloadSpeedElement.textContent, uploadSpeedElement.textContent, networkStatusElement.textContent);
        })
        .catch(error => {
            console.error('Error during speed test:', error);
            loadingElement.style.display = 'none';
        });
}

function saveToDatabase(downloadSpeed, uploadSpeed, networkStatus) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/speed-test/save_speed.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Data saved to database');
        }
    };
    xhr.send(`downloadSpeed=${downloadSpeed}&uploadSpeed=${uploadSpeed}&networkStatus=${networkStatus}`);
}

// Kwa ukurasa wa historia (history.html)
if (window.location.pathname.includes('history.html')) {
    fetchSpeedHistory();
}

function fetchSpeedHistory() {
    fetch('http://localhost/speed-test/get_speed_history.php')
        .then(response => response.json())
        .then(data => {
            const historyElement = document.getElementById('history');
            historyElement.innerHTML = ''; // Safisha yaliyopo

            if (data.length === 0) {
                historyElement.innerHTML = '<p>No history found.</p>';
                return;
            }

            data.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');

                historyItem.innerHTML = `
                    <p><strong>Download Speed:</strong> ${item.download_speed} Mbps</p>
                    <p><strong>Upload Speed:</strong> ${item.upload_speed} Mbps</p>
                    <p><strong>Network Status:</strong> ${item.network_status}</p>
                    <p><strong>Test Date:</strong> ${item.test_date}</p>
                `;

                historyElement.appendChild(historyItem);
            });
        })
        .catch(error => {
            console.error('Error fetching history:', error);
        });
}

// Kwa ukurasa wa grafu (graph.html)
if (window.location.pathname.includes('graph.html')) {
    fetchSpeedHistoryForGraphs();
}

function fetchSpeedHistoryForGraphs() {
    fetch('http://localhost/speed-test/get_speed_history.php')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.test_date);
            const downloadSpeeds = data.map(item => parseFloat(item.download_speed));
            const uploadSpeeds = data.map(item => parseFloat(item.upload_speed));

            // Bar Chart (Histogram)
            const barChartCtx = document.getElementById('barChart').getContext('2d');
            new Chart(barChartCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Download Speed (Mbps)',
                        data: downloadSpeeds,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Upload Speed (Mbps)',
                        data: uploadSpeeds,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Line Chart (Curve)
            const lineChartCtx = document.getElementById('lineChart').getContext('2d');
            new Chart(lineChartCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Download Speed (Mbps)',
                        data: downloadSpeeds,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: false
                    }, {
                        label: 'Upload Speed (Mbps)',
                        data: uploadSpeeds,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching history for graphs:', error);
        });
}