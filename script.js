// Configuration
const surveyUrl = 'YOUR_CRACKREVENUE_LINK_HERE'; // Replace with your CrackRevenue link
const predictions = ['1.79x', '14.81x', '1.21x'];
let currentPredictionIndex = 0;
let connectedWebsite = '';
let connectedUsername = '';
let currentOnlineUsers = 150; // Starting value
const adminTelegramUsername = '@binarygodsupport'; // Updated Telegram username
const secretKeys = ['PROFITLOVER']; // Only valid secret key

// Indian names for notifications
const indianNames = [
    'Abhishek', 'Rohit', 'Ajay', 'Vikas', 'Suresh', 'Rahul', 'Amit', 'Rajesh', 'Vijay',
    'Deepak', 'Anil', 'Sanjay', 'Vikram', 'Nitin', 'Ravi', 'Ankit', 'Gaurav', 'Manish',
    'Pradeep', 'Naveen', 'Sachin', 'Sandeep', 'Rakesh', 'Arjun', 'Ramesh', 'Dinesh', 'Saurabh',
    'Priya', 'Neha', 'Pooja', 'Aarti', 'Swati', 'Nisha', 'Ritu', 'Divya', 'Kavita',
    'Anjali', 'Monika', 'Megha', 'Kirti', 'Ananya', 'Deepika', 'Jyoti', 'Shweta', 'Preeti'
];

// Notification messages
const notificationMessages = [
    'just purchased premium access! 🔥',
    'completed verification successfully! ✅',
    'made $12,000 in 1 hour using our tool! 💰',
    'is enjoying 93.7% prediction accuracy! 🎯',
    'says "Bhai ye tool ekdum mast hai!" 👌',
    'won 15 consecutive trades! 🚀',
    'says "100% working hai, thank you!" 🙏',
    'turned $40 into $5,000 in one day! 📈',
    'just got access to premium predictions! 🔑',
    'says "Isse accha tool nahi dekha!" 🌟',
    'is winning big with our predictions! 💯',
    'loves the Premium Algorithm! ❤️',
    'verified their Quotex account! 👨‍💻',
    'says "Ye prediction tool kamaal ka hai!" 💸',
    'joined our Telegram group! 📱'
];

// Feedback messages
const feedbackMessages = [
    '"Bhai kya mast app hai, 100% working!" - Rajesh S.',
    '"Maine $40 deposit kiya aur $2,000 kamaya ek din me!" - Amit K.',
    '"Best prediction tool I have ever used!" - Vikas M.',
    '"Ye tool sach me kaam karta hai, thanks!" - Rohit P.',
    '"Aviator ka game ab mere control me hai!" - Sandeep G.',
    '"First time koi prediction tool sahi nikla!" - Abhishek D.',
    '"Ekdum sahi predictions de raha hai!" - Suresh J.',
    '"Maine 10 me se 9 games jeete isse!" - Neha S.',
    '"Family ke saath vacation pe ja raha hu isse kamaye paise se!" - Rahul T.',
    '"Mera luck change ho gaya iss tool se!" - Priya R.'
];

// Testimonials with rich content for the slider
const testimonials = [
    {
        text: "Bhai ye tool kamaal ka hai! Maine $40 deposit kiya aur pehle hi din $3,500 jeet gaya. Ab main apne dosto ko bhi recommend kar raha hu.",
        name: "Abhishek Sharma",
        date: "2 days ago",
        initial: "A"
    },
    {
        text: "Mujhe laga tha ye scam hoga, lekin maine try kiya aur sach me kaam karta hai. 8/10 predictions sahi nikli! Best tool for Aviator.",
        name: "Rohit Patel",
        date: "1 week ago",
        initial: "R"
    },
    {
        text: "Main pichle 6 mahine se Aviator khel raha tha aur hamesha haarta tha. Is tool ke baad se mera luck change ho gaya. Already $12,000+ jeeta hu!",
        name: "Sandeep Gupta",
        date: "3 days ago",
        initial: "S" 
    },
    {
        text: "Premium version ki accuracy amazing hai. 93% sahi predictions! $199 ki investment best decision thi.",
        name: "Neha Singh",
        date: "Yesterday",
        initial: "N"
    },
    {
        text: "Thank you team for this amazing tool. Maine telegram group join kiya aur bahut help mili. Ab main daily $1,000-$2,000 kama leta hu.",
        name: "Vikram Malhotra",
        date: "4 days ago", 
        initial: "V"
    },
    {
        text: "Pehle main roj haarta tha. Ye tool use karne ke baad se meri life badal gayi. Last month maine $40,000 se zyada kamaya!",
        name: "Amit Kumar",
        date: "2 weeks ago",
        initial: "A"
    },
    {
        text: "100% working tool hai. Isme koi scam nahi hai. Maine verify kiya hai personally. Definitely worth the money!",
        name: "Deepika Joshi",
        date: "5 days ago",
        initial: "D"
    }
];

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
    startNotifications(); // Start showing notifications
    
    // Initialize testimonials if on step 5
    if (document.getElementById('step5').classList.contains('active')) {
        initTestimonials();
    }
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
        initTestimonials(); // Initialize testimonials
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
    const button = document.querySelector('.access-option button');
    const statusElement = document.getElementById('keyVerificationStatus');
    const progressContainer = document.querySelector('.key-verification-progress .progress-container');
    const progressBar = document.querySelector('.key-verification-progress .progress-bar');
    
    button.disabled = true;
    button.textContent = 'Verifying...';
    progressContainer.style.display = 'block';
    statusElement.textContent = 'Validating your access key...';
    
    // Simulate verification process with loading bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 2;
            progressBar.style.width = `${progress}%`;
            
            if (progress === 30) {
                statusElement.textContent = 'Checking key database...';
            } else if (progress === 60) {
                statusElement.textContent = 'Authenticating access level...';
            } else if (progress === 85) {
                statusElement.textContent = 'Preparing prediction algorithms...';
            }
        } else {
            clearInterval(progressInterval);
            
            // Check if the key is valid
            if (secretKeys.includes(secretKey)) {
                // Valid key
                statusElement.textContent = 'Access key verified successfully!';
                button.textContent = 'Access Granted!';
                
                // Store the key for potential use
                localStorage.setItem('secretAccessKey', secretKey);
                
                // Show success message
                const verificationMessage = document.querySelector('.access-option:first-child');
                verificationMessage.innerHTML = `
                    <div style="text-align: center;">
                        <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 48px;"></i>
                        <h3>Access Granted!</h3>
                        <p>Your premium access has been activated successfully.</p>
                        <p>You now have full access to the Aviator Prediction Tool.</p>
                        <button onclick="showStep(5)" class="start-button" style="margin-top: 20px;">
                            <i class="fas fa-rocket"></i> Launch Prediction Tool
                        </button>
                    </div>
                `;
            } else {
                // Invalid key
                progressBar.style.backgroundColor = '#f44336';
                statusElement.textContent = 'Invalid access key. Please try again or contact support.';
                button.disabled = false;
                button.textContent = 'Retry Verification';
            }
        }
    }, 50);
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

// Function to create and show a notification
function showNotification() {
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    const container = document.getElementById('notificationContainer');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="notification-content">
            <div class="notification-name">${name}</div>
            <div class="notification-message">${message}</div>
            <div class="notification-time">Just now</div>
        </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Remove notification after animation completes (5 seconds)
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Show a notification every 8-15 seconds
function startNotifications() {
    // Show first notification after a delay
    setTimeout(() => {
        showNotification();
        
        // Then show periodically
        setInterval(() => {
            showNotification();
        }, Math.random() * 7000 + 8000); // Random time between 8-15 seconds
    }, 3000); // Initial delay
}

// Initialize testimonials in the prediction page
function initTestimonials() {
    const sliderContainer = document.getElementById('testimonialSlider');
    if (!sliderContainer) return;
    
    // Clear existing content
    sliderContainer.innerHTML = '';
    
    // Add testimonials
    testimonials.forEach(testimonial => {
        const testimonialItem = document.createElement('div');
        testimonialItem.className = 'testimonial-item';
        
        testimonialItem.innerHTML = `
            <div class="testimonial-text">${testimonial.text}</div>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${testimonial.initial}</div>
                <div>
                    <div class="testimonial-name">${testimonial.name}</div>
                    <div class="testimonial-meta">${testimonial.date}</div>
                </div>
            </div>
        `;
        
        sliderContainer.appendChild(testimonialItem);
    });
    
    // Start rotation
    rotateTestimonials();
}

// Rotate testimonials
function rotateTestimonials() {
    const sliderContainer = document.getElementById('testimonialSlider');
    if (!sliderContainer) return;
    
    const items = sliderContainer.querySelectorAll('.testimonial-item');
    if (items.length < 2) return;
    
    let currentIndex = 0;
    
    // Initially hide all except first
    items.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
        }
    });
    
    // Rotate every 5 seconds
    setInterval(() => {
        items[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].style.display = 'block';
    }, 5000);
}
