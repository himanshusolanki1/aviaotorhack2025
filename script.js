// Configuration
const surveyUrl = 'YOUR_CRACKREVENUE_LINK_HERE'; // Replace with your CrackRevenue link
const predictions = ['1.79x', '14.81x', '1.21x'];
let currentPredictionIndex = 0;
let connectedWebsite = '';
let connectedUsername = '';
let currentOnlineUsers = 150; // Starting value
const adminTelegramUsername = '@binarygodsupport'; // Updated Telegram username
const secretKeys = ['PROFITLOVER']; // Only valid secret key

// State management
function saveState() {
    const state = {
        step: document.querySelector('.step.active')?.id || 'step1',
        website: connectedWebsite,
        username: connectedUsername,
        onlineUsers: currentOnlineUsers
    };
    localStorage.setItem('aviatorState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('aviatorState');
    if (savedState) {
        const state = JSON.parse(savedState);
        connectedWebsite = state.website;
        connectedUsername = state.username;
        currentOnlineUsers = state.onlineUsers;
        
        // If we were on the final step, restore all values
        if (state.step === 'step5') {
            document.getElementById('apiStatus').textContent = `Connected to ${state.website}`;
            document.getElementById('usernameDisplay').textContent = state.username;
            document.getElementById('onlineUsers').textContent = state.onlineUsers;
            showStep(5);
            startOnlineUsersUpdate();
        } else {
            showStep(1); // If not on final step, start over
        }
    } else {
        showStep(1);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    document.getElementById('adminUsername').textContent = adminTelegramUsername;
});

// Function to get random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to update online users
function updateOnlineUsers() {
    const onlineUsersElement = document.getElementById('onlineUsers');
    if (!onlineUsersElement) return;

    // Generate a random change between -5 and +5
    const change = getRandomNumber(-5, 5);
    let newValue = currentOnlineUsers + change;

    // Keep the value between 100 and 200
    if (newValue < 100) newValue = 100 + getRandomNumber(0, 10);
    if (newValue > 200) newValue = 200 - getRandomNumber(0, 10);

    // Update the current value
    currentOnlineUsers = newValue;
    onlineUsersElement.textContent = currentOnlineUsers;
    saveState(); // Save state after updating users
}

// Start updating online users when reaching step 5
function startOnlineUsersUpdate() {
    updateOnlineUsers(); // Initial update
    setInterval(updateOnlineUsers, 10000); // Update every 10 seconds
}

// Function to show a specific step and hide others
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // When showing step 5, update the connection info and start online users update
    if (stepNumber === 5) {
        document.getElementById('apiStatus').textContent = `Connected to ${connectedWebsite}`;
        document.getElementById('usernameDisplay').textContent = connectedUsername;
        startOnlineUsersUpdate();
    }
    saveState(); // Save state after changing steps
}

// Function to update progress bar
function updateProgress(percent, barElement) {
    barElement = barElement || document.querySelector('.progress-bar');
    barElement.style.width = `${percent}%`;
}

// Simulated delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Website verification
async function verifyWebsite() {
    const website = document.getElementById('websiteInput').value.trim();
    
    if (!website) {
        alert('Please enter the Aviator website URL');
        return;
    }

    connectedWebsite = website;
    showStep(2);
    const connectionStatus = document.getElementById('connectionStatus');
    
    // Simulate realistic API connection process with longer delays
    updateProgress(0);
    connectionStatus.textContent = `Attempting to connect to ${website}...`;
    
    let progress = 0;
    const progressInterval = setInterval(async () => {
        if (progress < 100) {
            progress += 1;
            updateProgress(progress);
            
            if (progress === 25) {
                connectionStatus.textContent = `Successfully established connection with ${website}`;
                await delay(4000); // 4 second delay
            } else if (progress === 50) {
                connectionStatus.textContent = `Connecting to ${website} API...`;
                await delay(4000); // 4 second delay
            } else if (progress === 75) {
                connectionStatus.textContent = `Finalizing API connection...`;
                await delay(4000); // 4 second delay
            }
        } else {
            clearInterval(progressInterval);
            connectionStatus.textContent = `✅ Successfully connected to ${website} API!`;
            
            await delay(2000); // 2 second delay before moving to next step
            showStep(3);
        }
    }, 100); // Slower progress updates
}

// Username verification
async function verifyUsername() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (!username) {
        alert('Please enter your username');
        return;
    }

    connectedUsername = username;
    showStep(3.5);
    const verificationStatus = document.getElementById('userVerificationStatus');
    
    let progress = 0;
    const progressBar = document.querySelector('#step3\\.5 .progress-bar');
    
    const interval = setInterval(async () => {
        if (progress < 100) {
            progress++;
            updateProgress(progress, progressBar);
            
            if (progress === 25) {
                verificationStatus.textContent = 'Checking user database...';
                await delay(4000); // 4 second delay
            } else if (progress === 50) {
                verificationStatus.textContent = 'Validating credentials...';
                await delay(4000); // 4 second delay
            } else if (progress === 75) {
                verificationStatus.textContent = 'Preparing secure session...';
                await delay(4000); // 4 second delay
            }
        } else {
            clearInterval(interval);
            verificationStatus.textContent = 'User verified successfully!';
            
            await delay(2000); // 2 second delay before moving to next step
            showStep(4); // Go to human verification
        }
    }, 100); // Slower progress updates
}

// Human verification
function verifyHuman() {
    const userAnswer = document.getElementById('captchaInput').value.trim();
    const correctAnswer = "11"; // Answer to "What is 7 + 4?"
    
    if (!userAnswer) {
        alert('Please enter your answer');
        return;
    }
    
    if (userAnswer === correctAnswer) {
        // Proceed to Telegram verification
        showStep(4.1);
    } else {
        alert('Incorrect answer. Please try again.');
    }
}

// Telegram verification
function confirmTelegram() {
    // Since we can't verify if they actually joined, we just proceed
    showStep(4.2);
}

// Quotex account verification
function confirmQuotex() {
    // Again, we can't verify if they created an account, so just proceed
    showStep(4.3);
}

// Deposit verification
function confirmDeposit() {
    // Proceed to Quotex ID verification
    showStep(4.4);
}

// Copy admin username to clipboard
function copyAdminUsername() {
    const username = document.getElementById('adminUsername').textContent;
    navigator.clipboard.writeText(username).then(() => {
        alert('Username copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Secret key verification
function verifySecretKey() {
    const secretKey = document.getElementById('secretKeyInput').value.trim().toUpperCase();
    
    if (!secretKey) {
        alert('Please enter your secret access key');
        return;
    }
    
    // Show verification in progress
    const button = document.querySelector('#step4\\.4 button');
    button.disabled = true;
    button.textContent = 'Verifying...';
    
    // Simulate verification process
    setTimeout(() => {
        // Check if the key is valid
        if (secretKeys.includes(secretKey)) {
            // Valid key
            button.textContent = 'Access Granted!';
            
            // Store the key for potential use
            localStorage.setItem('secretAccessKey', secretKey);
            
            // Show success message
            const verificationMessage = document.querySelector('#step4\\.4 .verification-message');
            verificationMessage.innerHTML = `
                <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 36px;"></i>
                <p>Your access key has been verified!</p>
                <p>You now have access to the Aviator Prediction Tool.</p>
            `;
            
            // Enable continue button
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Access Prediction Tool';
                button.onclick = function() {
                    showStep(5);
                };
            }, 1500);
        } else {
            // Invalid key
            button.disabled = false;
            button.textContent = 'Verify Access Key';
            alert('Invalid access key. Please contact the admin to receive a valid key.');
        }
    }, 2000);
}

// Handle prediction starts
function startPrediction() {
    const button = document.getElementById('startButton');
    const display = document.getElementById('predictionDisplay');
    
    // Show loading
    button.disabled = true;
    display.textContent = 'Calculating...';
    
    // Faster calculation time between 0.5-1.5 seconds
    const calculationTime = Math.random() * 1000 + 500;
    
    setTimeout(() => {
        // Show the prediction with a faster typing effect
        const prediction = predictions[currentPredictionIndex];
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i <= prediction.length) {
                display.textContent = prediction.substring(0, i);
                i++;
            } else {
                clearInterval(typingInterval);
                button.disabled = false;
                
                // Move to next prediction
                currentPredictionIndex = (currentPredictionIndex + 1) % predictions.length;
            }
        }, 50); // Faster typing speed (50ms instead of 100ms)
    }, calculationTime);
}
