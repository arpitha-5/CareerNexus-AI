/* ========================================
   CareerNexus AI - Frontend JavaScript
   API Integration and UI Logic
   ======================================== */

// Configuration
const API_BASE = 'http://localhost:5002/api';
let currentAssessmentData = null;
let currentCareer = null;

// ========================================
// SIDEBAR NAVIGATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            sidebar.classList.toggle('collapsed');
        });
    }

    // Close sidebar on mobile when nav item is clicked
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after clicking
            if (window.innerWidth <= 768) {
                document.body.classList.remove('sidebar-collapsed');
                sidebar.classList.remove('collapsed');
            }
        });
    });

    // Set active nav item on scroll
    window.addEventListener('scroll', function() {
        const sections = ['assess', 'results', 'roadmap'];
        let currentSection = '';
        
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 200) {
                    currentSection = section;
                }
            }
        });

        if (currentSection) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.section === currentSection) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Sidebar smooth scroll on nav click
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ========================================
// PROGRESS TRACKING
// ========================================

/**
 * Update progress bar based on form completion
 */
function updateProgressBar() {
    const form = document.getElementById('assessmentForm');
    if (!form) return;

    const sliders = form.querySelectorAll('input[type="range"]');
    const totalInputs = sliders.length;
    let filledInputs = 0;

    sliders.forEach(input => {
        if (input.value > 0) {
            filledInputs++;
        }
    });

    const progress = Math.round((filledInputs / totalInputs) * 100);
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');

    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (progressPercent) {
        progressPercent.textContent = progress + '%';
    }
}

// Add progress tracking to sliders
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateProgressBar);
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Show loading spinner
 */
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

/**
 * Scroll to assessment section
 */
function scrollToAssess() {
    document.getElementById('assess').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show results section
 */
function showResults() {
    document.getElementById('results').style.display = 'block';
    document.getElementById('roadmap').style.display = 'none';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show roadmap section
 */
function showRoadmap() {
    document.getElementById('roadmap').style.display = 'block';
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Open chat modal
 */
function openChat() {
    document.getElementById('chatModal').style.display = 'flex';
}

/**
 * Close chat modal
 */
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
}

/**
 * Reset assessment form
 */
function resetAssessment() {
    document.getElementById('assessmentForm').reset();
    document.getElementById('results').style.display = 'none';
    document.getElementById('roadmap').style.display = 'none';
    document.getElementById('chatContainer').innerHTML = `
        <div class="chat-message bot-message">
            <p>Hi! I'm your AI career advisor. Ask me questions about your career path!</p>
        </div>
    `;
    document.getElementById('chatInput').value = '';
    scrollToAssess();
}

// ========================================
// FORM HANDLING
// ========================================

/**
 * Initialize slider value displays
 */
document.querySelectorAll('.slider').forEach(slider => {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    
    slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
    });
});

/**
 * Handle CGPA slider and input sync
 */
document.getElementById('CGPA')?.addEventListener('input', function() {
    document.getElementById('CGPAValue').value = this.value;
});

document.getElementById('CGPAValue')?.addEventListener('input', function() {
    document.getElementById('CGPA').value = this.value;
});

/**
 * Main form submission
 */
document.getElementById('assessmentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    showLoading();
    
    try {
        // Collect form data
        const formData = {
            Python: parseInt(document.getElementById('Python').value) || 0,
            Java: parseInt(document.getElementById('Java').value) || 0,
            SQL: parseInt(document.getElementById('SQL').value) || 0,
            ML: parseInt(document.getElementById('ML').value) || 0,
            Communication: parseInt(document.getElementById('Communication').value) || 0,
            ProblemSolving: parseInt(document.getElementById('ProblemSolving').value) || 0,
            Data_Interest: parseInt(document.getElementById('Data_Interest').value) || 50,
            Development_Interest: parseInt(document.getElementById('Development_Interest').value) || 50,
            Management_Interest: parseInt(document.getElementById('Management_Interest').value) || 50,
            Research_Interest: parseInt(document.getElementById('Research_Interest').value) || 50,
            Design_Interest: parseInt(document.getElementById('Design_Interest').value) || 50,
            CGPA: parseFloat(document.getElementById('CGPA').value) || 0,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        
        // Store for later use
        currentAssessmentData = formData;
        
        // Call assessment endpoint
        const response = await fetch(`${API_BASE}/assess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Assessment failed');
        }
        
        const assessmentResult = await response.json();
        
        if (assessmentResult.success) {
            currentCareer = assessmentResult.primary_career;
            
            // Display primary career
            displayPrimaryCareer(assessmentResult);
            
            // Calculate readiness score
            await calculateReadinessScore(formData);
            
            // Display top 3 careers
            displayTop3Careers(assessmentResult.top_3_careers);
            
            // Load and display roadmap
            await loadRoadmap(currentCareer);
            
            showResults();
        } else {
            alert('Error: ' + assessmentResult.error);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing assessment: ' + error.message);
    } finally {
        hideLoading();
    }
});

// ========================================
// DISPLAY FUNCTIONS
// ========================================

/**
 * Display primary career recommendation
 */
function displayPrimaryCareer(data) {
    document.getElementById('careerTitle').textContent = data.primary_career;
    
    const confidencePercent = data.confidence;
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceText = document.getElementById('confidenceText');
    
    // Animate confidence bar
    setTimeout(() => {
        confidenceBar.style.setProperty('--width', confidencePercent + '%');
    }, 100);
    
    confidenceText.textContent = `Confidence: ${confidencePercent}%`;
}

/**
 * Display top 3 careers
 */
function displayTop3Careers(careers) {
    const container = document.getElementById('top3Careers');
    container.innerHTML = '';
    
    careers.forEach((career, index) => {
        const item = document.createElement('div');
        item.className = 'career-item';
        item.innerHTML = `
            <div class="career-rank">${index + 1}</div>
            <div class="career-info">
                <span class="career-name">${career.career}</span>
                <span class="career-confidence">${career.confidence}%</span>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * Calculate and display readiness score
 */
async function calculateReadinessScore(formData) {
    try {
        const response = await fetch(`${API_BASE}/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                predicted_career: currentCareer
            })
        });
        
        const scoreResult = await response.json();
        
        if (scoreResult.success) {
            // Update readiness score
            const score = scoreResult.readiness_score;
            document.getElementById('readinessScore').textContent = Math.round(score);
            document.getElementById('readinessStatus').textContent = scoreResult.status;
            
            // Update circular progress color
            const progressCircle = document.querySelector('.progress-fill');
            if (scoreResult.color === 'red') {
                progressCircle.style.stroke = '#EF4444';
            } else if (scoreResult.color === 'yellow') {
                progressCircle.style.stroke = '#F59E0B';
            } else {
                progressCircle.style.stroke = '#10B981';
            }
            
            // Update breakdown
            document.getElementById('skillsScore').textContent = Math.round(scoreResult.breakdown.skills_match) + '%';
            document.getElementById('skillsBar').style.width = scoreResult.breakdown.skills_match + '%';
            
            document.getElementById('academicScore').textContent = Math.round(scoreResult.breakdown.academic_score) + '%';
            document.getElementById('academicBar').style.width = scoreResult.breakdown.academic_score + '%';
            
            document.getElementById('interestScore').textContent = Math.round(scoreResult.breakdown.interest_alignment) + '%';
            document.getElementById('interestBar').style.width = scoreResult.breakdown.interest_alignment + '%';
        }
    } catch (error) {
        console.error('Error calculating readiness score:', error);
    }
}

/**
 * Load and display career roadmap
 */
async function loadRoadmap(career) {
    try {
        const response = await fetch(`${API_BASE}/roadmap/${career}`);
        const roadmapData = await response.json();
        
        if (roadmapData.success) {
            document.getElementById('roadmapCareer').textContent = career;
            displayRoadmap(roadmapData.steps);
        }
    } catch (error) {
        console.error('Error loading roadmap:', error);
    }
}

/**
 * Display roadmap timeline
 */
function displayRoadmap(steps) {
    const timeline = document.getElementById('roadmapTimeline');
    timeline.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'roadmap-step';
        
        const actionsHTML = step.actions.map(action => `<li>${action}</li>`).join('');
        
        stepDiv.innerHTML = `
            <div class="step-marker"></div>
            <div class="step-content">
                <h4>${step.month}</h4>
                <h5>${step.focus}</h5>
                <ul>
                    ${actionsHTML}
                </ul>
            </div>
        `;
        
        timeline.appendChild(stepDiv);
    });
}

// ========================================
// PDF REPORT DOWNLOAD
// ========================================

/**
 * Download career report as PDF
 */
async function downloadReport() {
    try {
        showLoading();
        
        const reportData = {
            name: currentAssessmentData.name,
            email: currentAssessmentData.email,
            cgpa: currentAssessmentData.CGPA,
            primary_career: currentCareer,
            confidence: document.getElementById('confidenceText').textContent.split(': ')[1],
            readiness_score: parseInt(document.getElementById('readinessScore').textContent),
            skills: {
                Python: currentAssessmentData.Python,
                Java: currentAssessmentData.Java,
                SQL: currentAssessmentData.SQL,
                ML: currentAssessmentData.ML,
                Communication: currentAssessmentData.Communication,
                ProblemSolving: currentAssessmentData.ProblemSolving
            },
            interests: {
                Data_Interest: currentAssessmentData.Data_Interest,
                Development_Interest: currentAssessmentData.Development_Interest,
                Management_Interest: currentAssessmentData.Management_Interest,
                Research_Interest: currentAssessmentData.Research_Interest,
                Design_Interest: currentAssessmentData.Design_Interest
            }
        };
        
        const response = await fetch(`${API_BASE}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        });
        
        if (!response.ok) {
            throw new Error('Report generation failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Career_Report_${currentAssessmentData.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Report downloaded successfully!');
    } catch (error) {
        console.error('Error downloading report:', error);
        alert('Error downloading report: ' + error.message);
    } finally {
        hideLoading();
    }
}

// ========================================
// CHAT FUNCTIONALITY
// ========================================

/**
 * Ask a quick question
 */
async function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    await sendChatMessage();
}

/**
 * Handle chat input keypress
 */
function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

/**
 * Send chat message
 */
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Display user message
    const container = document.getElementById('chatContainer');
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user-message';
    userMsgDiv.innerHTML = `<p>${message}</p>`;
    container.appendChild(userMsgDiv);
    input.value = '';
    container.scrollTop = container.scrollHeight;
    
    try {
        // Get AI response
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: message,
                career: currentCareer,
                user_data: currentAssessmentData
            })
        });
        
        const chatResult = await response.json();
        
        if (chatResult.success) {
            // Display bot response
            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'chat-message bot-message';
            botMsgDiv.innerHTML = `<p>${chatResult.response}</p>`;
            container.appendChild(botMsgDiv);
            container.scrollTop = container.scrollHeight;
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message bot-message';
        errorDiv.innerHTML = `<p>Sorry, I encountered an error. Please try again.</p>`;
        container.appendChild(errorDiv);
    }
}

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('CareerNexus AI loaded successfully');
    console.log('API Base:', API_BASE);
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('chatModal');
    if (event.target == modal) {
        closeChat();
    }
});
