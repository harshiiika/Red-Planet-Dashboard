 // --- Global Variables ---
        let currentSolDay = 3847;
        let currentEarthDate = new Date('2025-07-20');
        let temperatureChart, atmosphericChart;

        // --- Utility Functions ---
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // --- Star Generation ---
        function generateStars(count) {
            const starsContainer = document.querySelector('.stars');
            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                starsContainer.appendChild(star);
            }
        }

        // --- Alert System ---
        function showAlert(message, type = 'critical', duration = 5000) {
            const alertSystem = document.getElementById('alertSystem');
            const alertPanel = document.createElement('div');
            alertPanel.className = `alert-panel ${type}`;
            alertPanel.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <span>${message}</span>
                </div>
            `;
            alertSystem.prepend(alertPanel); // Add to top

            setTimeout(() => {
                alertPanel.style.opacity = '0';
                alertPanel.style.transform = 'translateX(100%)';
                alertPanel.addEventListener('transitionend', () => alertPanel.remove());
            }, duration);
        }

        // --- Data Simulation ---
        function getSimulatedMarsWeather() {
            const temp = getRandomInt(-70, -50); // Mars average temp range
            let description = "Clear Skies";
            let weatherIcon = "fas fa-sun";
            let windSpeed = getRandomArbitrary(5, 20).toFixed(1);
            let pressure = getRandomInt(600, 750);
            let humidity = getRandomArbitrary(0.1, 5.0).toFixed(1);
            let uvIndex = getRandomArbitrary(5.0, 10.0).toFixed(1);

            // Introduce random weather events
            const weatherRoll = Math.random();
            if (weatherRoll < 0.1) {
                description = "Dust Storm Approaching";
                weatherIcon = "fas fa-wind";
                windSpeed = getRandomArbitrary(25, 40).toFixed(1);
                pressure = getRandomInt(550, 600);
                showAlert("Warning: Significant Dust Storm Detected!", "warning");
            } else if (weatherRoll < 0.2) {
                description = "Light Dusting";
                weatherIcon = "fas fa-cloud";
                windSpeed = getRandomArbitrary(15, 25).toFixed(1);
            } else if (weatherRoll < 0.3) {
                description = "Partly Cloudy";
                weatherIcon = "fas fa-cloud-sun";
            } else if (weatherRoll < 0.05) { // Very rare critical event
                description = "Atmospheric Anomaly Detected!";
                weatherIcon = "fas fa-exclamation-triangle";
                showAlert("Critical: Unstable Atmospheric Conditions!", "critical");
            }

            // Simulate trends
            const windTrend = getRandomArbitrary(-5, 5).toFixed(1);
            const pressureTrend = getRandomInt(-20, 20);
            const humidityTrend = getRandomArbitrary(-1.0, 1.0).toFixed(1);
            const uvTrend = getRandomArbitrary(-2.0, 2.0).toFixed(1);

            return {
                temp: temp,
                description: description,
                weatherIcon: weatherIcon,
                windSpeed: windSpeed,
                pressure: pressure,
                humidity: humidity,
                uvIndex: uvIndex,
                windTrend: windTrend,
                pressureTrend: pressureTrend,
                humidityTrend: humidityTrend,
                uvTrend: uvTrend
            };
        }

        // --- Update UI Elements ---
        function updateDashboardUI() {
            const data = getSimulatedMarsWeather();

            document.getElementById('currentTemp').textContent = `${data.temp}°C`;
            document.getElementById('weatherDescription').textContent = data.description;
            document.getElementById('weatherIcon').className = data.weatherIcon;

            document.getElementById('windSpeed').textContent = `${data.windSpeed} m/s`;
            document.getElementById('pressure').textContent = `${data.pressure} Pa`;
            document.getElementById('humidity').textContent = `${data.humidity}%`;
            document.getElementById('uvIndex').textContent = `${data.uvIndex}`;

            // Update trends and apply color
            const updateTrend = (elementId, value, unit) => {
                const element = document.getElementById(elementId);
                element.textContent = `${value > 0 ? '+' : ''}${value}${unit}`;
                const parentPod = element.closest('.data-pod');
                const trendIcon = element.previousElementSibling;

                if (value > 0) {
                    parentPod.querySelector('.data-trend').classList.remove('trend-down');
                    parentPod.querySelector('.data-trend').classList.add('trend-up');
                    trendIcon.className = 'fas fa-arrow-up';
                } else if (value < 0) {
                    parentPod.querySelector('.data-trend').classList.remove('trend-up');
                    parentPod.querySelector('.data-trend').classList.add('trend-down');
                    trendIcon.className = 'fas fa-arrow-down';
                } else {
                    parentPod.querySelector('.data-trend').classList.remove('trend-up', 'trend-down');
                    trendIcon.className = 'fas fa-arrows-alt-h'; // Neutral icon
                }
            };

            updateTrend('windTrend', data.windTrend, ' m/s');
            updateTrend('pressureTrend', data.pressureTrend, ' Pa');
            updateTrend('humidityTrend', data.humidityTrend, '%');
            updateTrend('uvTrend', data.uvTrend, '');

            // Update Sol Day and Earth Date
            document.getElementById('solDay').textContent = currentSolDay;
            document.getElementById('earthDate').textContent = currentEarthDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Update charts
            updateCharts(data.temp, data.windSpeed, data.pressure);
        }

        // --- Chart.js Initialization and Update ---
        function initCharts() {
            const commonChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: { family: 'Rajdhani', size: 14 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: 'var(--neon-cyan)',
                        bodyColor: 'white',
                        borderColor: 'var(--neon-cyan)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        titleFont: { family: 'Orbitron', size: 14 },
                        bodyFont: { family: 'Rajdhani', size: 12 }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)',
                            borderColor: 'rgba(0, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { family: 'Rajdhani' }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)',
                            borderColor: 'rgba(0, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { family: 'Rajdhani' }
                        }
                    }
                }
            };

            // Temperature Chart
            const tempCtx = document.getElementById('temperatureChart').getContext('2d');
            temperatureChart = new Chart(tempCtx, {
                type: 'line',
                data: {
                    labels: [], // Will be populated dynamically
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: [], // Will be populated dynamically
                        borderColor: 'var(--mars-orange)',
                        backgroundColor: 'rgba(255, 107, 53, 0.2)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: 'var(--mars-orange)',
                        tension: 0.3,
                        fill: true,
                        shadowBlur: 20,
                        shadowColor: 'var(--mars-orange)'
                    }]
                },
                options: {
                    ...commonChartOptions,
                    scales: {
                        ...commonChartOptions.scales,
                        y: {
                            ...commonChartOptions.scales.y,
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: { family: 'Orbitron', size: 14 }
                            }
                        }
                    }
                }
            });

            // Atmospheric Chart
            const atmCtx = document.getElementById('atmosphericChart').getContext('2d');
            atmosphericChart = new Chart(atmCtx, {
                type: 'bar',
                data: {
                    labels: [], // Will be populated dynamically
                    datasets: [
                        {
                            label: 'Wind Speed (m/s)',
                            data: [],
                            backgroundColor: 'rgba(0, 255, 255, 0.5)',
                            borderColor: 'var(--neon-cyan)',
                            borderWidth: 1,
                            shadowBlur: 15,
                            shadowColor: 'var(--neon-cyan)'
                        },
                        {
                            label: 'Pressure (Pa)',
                            data: [],
                            backgroundColor: 'rgba(57, 255, 20, 0.5)',
                            borderColor: 'var(--neon-green)',
                            borderWidth: 1,
                            shadowBlur: 15,
                            shadowColor: 'var(--neon-green)'
                        }
                    ]
                },
                options: {
                    ...commonChartOptions,
                    scales: {
                        x: {
                            ...commonChartOptions.scales.x,
                            stacked: true
                        },
                        y: {
                            ...commonChartOptions.scales.y,
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Value',
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: { family: 'Orbitron', size: 14 }
                            }
                        }
                    }
                }
            });
        }

        function updateCharts(temp, wind, pressure) {
            const maxDataPoints = 10; // Keep last 10 data points

            // Update Temperature Chart
            temperatureChart.data.labels.push(currentSolDay);
            temperatureChart.data.datasets[0].data.push(temp);
            if (temperatureChart.data.labels.length > maxDataPoints) {
                temperatureChart.data.labels.shift();
                temperatureChart.data.datasets[0].data.shift();
            }
            temperatureChart.update();

            // Update Atmospheric Chart
            atmosphericChart.data.labels.push(currentSolDay);
            atmosphericChart.data.datasets[0].data.push(wind);
            atmosphericChart.data.datasets[1].data.push(pressure);
            if (atmosphericChart.data.labels.length > maxDataPoints) {
                atmosphericChart.data.labels.shift();
                atmosphericChart.data.datasets[0].data.shift();
                atmosphericChart.data.datasets[1].data.shift();
            }
            atmosphericChart.update();
        }

        // --- Main Update Loop ---
        function advanceTimeAndData() {
            currentSolDay++;
            currentEarthDate.setDate(currentEarthDate.getDate() + 1.027); // Mars day is slightly longer than Earth day
            updateDashboardUI();
        }

        // --- Initial Setup on Load ---
        document.addEventListener('DOMContentLoaded', () => {
            generateStars(100); // Generate 100 stars
            initCharts(); // Initialize charts
            updateDashboardUI(); // Initial data load

            // Set up interval for continuous updates (simulated live data)
            setInterval(advanceTimeAndData, 3000); // Update every 3 seconds

            // Trigger an initial alert
            setTimeout(() => {
                showAlert("Welcome, Commander! Mars Weather Data Online.", "success", 7000);
            }, 1000);
        });
    