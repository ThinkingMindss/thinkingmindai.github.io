// Thinking Mind AI Agency - Main JavaScript
// 3D Immersive Experience with Interactive Components

// Global variables
let neuralNetwork;
let particles = [];
let selectedIndustry = null;
let selectedChallenges = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNeuralBackground();
    initializeParticles();
    initializeTypewriter();
    initializeScrollAnimations();
    initializeSolutionConfigurator();
    initializeROICalculator();
    initializeContactForm();
    initializeNavigation();
});

// Neural Network Background using p5.js
function initializeNeuralBackground() {
    new p5(function(p) {
        let nodes = [];
        let connections = [];
        
        p.setup = function() {
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('neural-bg');
            
            // Create nodes
            for (let i = 0; i < 50; i++) {
                nodes.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    pulse: p.random(p.TWO_PI)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw nodes
            for (let node of nodes) {
                node.x += node.vx;
                node.y += node.vy;
                node.pulse += 0.02;
                
                // Bounce off edges
                if (node.x < 0 || node.x > p.width) node.vx *= -1;
                if (node.y < 0 || node.y > p.height) node.vy *= -1;
                
                // Draw node with pulse effect
                let alpha = p.map(p.sin(node.pulse), -1, 1, 100, 255);
                p.fill(0, 212, 255, alpha);
                p.noStroke();
                p.ellipse(node.x, node.y, 4, 4);
            }
            
            // Draw connections
            p.stroke(0, 212, 255, 30);
            p.strokeWeight(1);
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let dist = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    if (dist < 150) {
                        let alpha = p.map(dist, 0, 150, 50, 0);
                        p.stroke(0, 212, 255, alpha);
                        p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    }
                }
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Particle System with Matter.js
function initializeParticles() {
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Render = Matter.Render;
    
    let engine = Engine.create();
    let world = engine.world;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        let particle = Bodies.circle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            Math.random() * 3 + 1,
            {
                render: {
                    fillStyle: '#00D4FF',
                    strokeStyle: '#FFB800',
                    lineWidth: 1
                },
                frictionAir: 0.01
            }
        );
        particles.push(particle);
        World.add(world, particle);
    }
    
    // Run the engine
    Engine.run(engine);
    
    // Add mouse interaction
    document.addEventListener('mousemove', function(e) {
        particles.forEach(particle => {
            let force = {
                x: (e.clientX - particle.position.x) * 0.00001,
                y: (e.clientY - particle.position.y) * 0.00001
            };
            Matter.Body.applyForce(particle, particle.position, force);
        });
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const typed = new Typed('#typed-text', {
        strings: [
            'Transform Your Business',
            'Unlock AI Potential',
            'Drive Innovation',
            'Accelerate Growth'
        ],
        typeSpeed: 80,
        backSpeed: 60,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Solution Configurator
function initializeSolutionConfigurator() {
    const industryCards = document.querySelectorAll('.industry-card');
    const challengeCheckboxes = document.querySelectorAll('.challenge-checkbox');
    const getStrategyBtn = document.getElementById('get-strategy-btn');
    const solutionContent = document.getElementById('solution-content');
    
    // Industry selection
    industryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active state from all cards
            industryCards.forEach(c => c.classList.remove('ring-2', 'ring-electric-cyan'));
            
            // Add active state to clicked card
            this.classList.add('ring-2', 'ring-electric-cyan');
            selectedIndustry = this.dataset.industry;
            
            updateSolutionContent();
            checkFormCompletion();
        });
    });
    
    // Challenge selection with gamified checkboxes
    challengeCheckboxes.forEach(checkbox => {
        const challengeOption = checkbox.closest('.challenge-option');
        const checkboxCustom = challengeOption.querySelector('.checkbox-custom');
        const checkIcon = checkboxCustom.querySelector('svg');
        
        challengeOption.addEventListener('click', function() {
            const challenge = checkbox.dataset.challenge;
            
            if (checkbox.checked) {
                checkbox.checked = false;
                checkboxCustom.classList.remove('bg-electric-cyan');
                checkIcon.classList.add('hidden');
                selectedChallenges = selectedChallenges.filter(c => c !== challenge);
            } else {
                checkbox.checked = true;
                checkboxCustom.classList.add('bg-electric-cyan');
                checkIcon.classList.remove('hidden');
                selectedChallenges.push(challenge);
            }
            
            updateSolutionContent();
            checkFormCompletion();
        });
    });
    
    function updateSolutionContent() {
        if (!selectedIndustry || selectedChallenges.length === 0) {
            solutionContent.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <div class="text-6xl mb-4">🤖</div>
                    <p>Select your industry and challenges to see customized AI solutions</p>
                </div>
            `;
            return;
        }
        
        const solutions = getSolutions(selectedIndustry, selectedChallenges);
        
        solutionContent.innerHTML = `
            <div class="space-y-4">
                <h4 class="font-bold text-lg text-electric-cyan">🚀 Recommended Solutions</h4>
                ${solutions.map(solution => `
                    <div class="border-l-4 border-electric-cyan pl-4 py-2 glass-morphism rounded-r-lg">
                        <h5 class="font-semibold text-neon-gold">${solution.name}</h5>
                        <p class="text-sm text-gray-300">${solution.description}</p>
                        <div class="text-xs text-electric-cyan mt-2">⏱️ Implementation: ${solution.timeline}</div>
                    </div>
                `).join('')}
                <div class="mt-6 p-4 bg-gradient-to-r from-electric-cyan/10 to-neural-gold/10 rounded-lg neon-border">
                    <div class="text-sm font-semibold text-electric-cyan">✨ Ready to transform your business?</div>
                    <div class="text-sm text-gray-300">Our AI experts will customize these solutions for your specific needs.</div>
                </div>
            </div>
        `;
    }
    
    function checkFormCompletion() {
        if (selectedIndustry && selectedChallenges.length > 0) {
            getStrategyBtn.disabled = false;
            getStrategyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            getStrategyBtn.disabled = true;
            getStrategyBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
    
    // Get Strategy button click
    getStrategyBtn.addEventListener('click', function() {
        if (!this.disabled) {
            // Show success message
            alert('Thank you! We will prepare a custom AI strategy for your business and contact you within 24 hours.');
        }
    });
}

// Get Solutions based on industry and challenges
function getSolutions(industry, challenges) {
    const solutionMap = {
        healthcare: {
            automation: [
                { name: 'Patient Flow Optimization', description: 'Automate patient scheduling and resource allocation', timeline: '8-12 weeks' },
                { name: 'Medical Records Processing', description: 'AI-powered document classification and extraction', timeline: '6-10 weeks' }
            ],
            analytics: [
                { name: 'Clinical Decision Support', description: 'AI-assisted diagnosis and treatment recommendations', timeline: '12-16 weeks' },
                { name: 'Population Health Analytics', description: 'Predictive models for disease prevention', timeline: '10-14 weeks' }
            ],
            customer: [
                { name: 'AI Chatbot for Patients', description: '24/7 patient support and appointment scheduling', timeline: '4-8 weeks' },
                { name: 'Personalized Care Plans', description: 'AI-driven personalized treatment recommendations', timeline: '8-12 weeks' }
            ],
            prediction: [
                { name: 'Disease Outbreak Prediction', description: 'Early warning systems for epidemic prevention', timeline: '16-20 weeks' },
                { name: 'Patient Risk Stratification', description: 'Identify high-risk patients before complications', timeline: '12-16 weeks' }
            ]
        },
        finance: {
            automation: [
                { name: 'Automated Trading Systems', description: 'AI-powered algorithmic trading strategies', timeline: '12-16 weeks' },
                { name: 'Document Processing', description: 'Automate loan applications and compliance documents', timeline: '6-10 weeks' }
            ],
            analytics: [
                { name: 'Risk Assessment Models', description: 'Real-time credit and market risk analysis', timeline: '10-14 weeks' },
                { name: 'Fraud Detection System', description: 'AI-powered transaction monitoring and alerts', timeline: '8-12 weeks' }
            ],
            customer: [
                { name: 'Personalized Banking', description: 'AI-driven product recommendations and advice', timeline: '8-12 weeks' },
                { name: 'Chatbot Financial Advisor', description: '24/7 customer support and financial guidance', timeline: '6-10 weeks' }
            ],
            prediction: [
                { name: 'Market Trend Prediction', description: 'AI forecasting for investment strategies', timeline: '16-20 weeks' },
                { name: 'Customer Churn Prediction', description: 'Identify at-risk customers before they leave', timeline: '10-14 weeks' }
            ]
        },
        retail: {
            automation: [
                { name: 'Inventory Management', description: 'AI-powered demand forecasting and stock optimization', timeline: '8-12 weeks' },
                { name: 'Supply Chain Automation', description: 'Automated ordering and logistics coordination', timeline: '10-14 weeks' }
            ],
            analytics: [
                { name: 'Customer Behavior Analysis', description: 'Deep insights into shopping patterns and preferences', timeline: '12-16 weeks' },
                { name: 'Pricing Optimization', description: 'Dynamic pricing based on market conditions', timeline: '6-10 weeks' }
            ],
            customer: [
                { name: 'Personalized Shopping', description: 'AI-driven product recommendations and experiences', timeline: '10-14 weeks' },
                { name: 'Visual Search', description: 'AI-powered image-based product discovery', timeline: '8-12 weeks' }
            ],
            prediction: [
                { name: 'Demand Forecasting', description: 'Predict future sales trends and seasonal patterns', timeline: '14-18 weeks' },
                { name: 'Customer Lifetime Value', description: 'Predict long-term customer value and behavior', timeline: '12-16 weeks' }
            ]
        },
        manufacturing: {
            automation: [
                { name: 'Quality Control AI', description: 'Automated defect detection and quality assurance', timeline: '10-14 weeks' },
                { name: 'Predictive Maintenance', description: 'AI-powered equipment monitoring and maintenance', timeline: '12-16 weeks' }
            ],
            analytics: [
                { name: 'Production Optimization', description: 'AI-driven efficiency and throughput improvements', timeline: '8-12 weeks' },
                { name: 'Energy Management', description: 'Optimize energy consumption and costs', timeline: '6-10 weeks' }
            ],
            customer: [
                { name: 'Smart Product Support', description: 'AI-powered customer service and troubleshooting', timeline: '6-10 weeks' },
                { name: 'Custom Product Configurator', description: 'AI-assisted product customization and design', timeline: '10-14 weeks' }
            ],
            prediction: [
                { name: 'Demand Planning', description: 'Accurate forecasting for production planning', timeline: '12-16 weeks' },
                { name: 'Supply Chain Risk', description: 'Predict and mitigate supply chain disruptions', timeline: '14-18 weeks' }
            ]
        },
        d2c: {
            automation: [
                { name: 'Order Fulfillment Automation', description: 'Automate order processing and shipping workflows', timeline: '6-10 weeks' },
                { name: 'Inventory Sync System', description: 'Real-time inventory across all sales channels', timeline: '8-12 weeks' }
            ],
            analytics: [
                { name: 'Customer Journey Analytics', description: 'Track and optimize every touchpoint', timeline: '10-14 weeks' },
                { name: 'Product Performance Insights', description: 'Data-driven product development and optimization', timeline: '8-12 weeks' }
            ],
            customer: [
                { name: 'AI Shopping Assistant', description: 'Personalized product recommendations and support', timeline: '8-12 weeks' },
                { name: 'Social Media Automation', description: 'Automated content creation and engagement', timeline: '6-10 weeks' }
            ],
            prediction: [
                { name: 'Trend Prediction Engine', description: 'Identify emerging market trends early', timeline: '12-16 weeks' },
                { name: 'Customer Lifetime Value', description: 'Predict long-term customer relationships', timeline: '10-14 weeks' }
            ]
        },
        technology: {
            automation: [
                { name: 'Code Review Automation', description: 'AI-powered code quality and security checks', timeline: '6-10 weeks' },
                { name: 'DevOps Pipeline Optimization', description: 'Automate deployment and testing workflows', timeline: '8-12 weeks' }
            ],
            analytics: [
                { name: 'User Behavior Analytics', description: 'Deep insights into product usage patterns', timeline: '8-12 weeks' },
                { name: 'Performance Monitoring', description: 'Real-time system performance and optimization', timeline: '6-10 weeks' }
            ],
            customer: [
                { name: 'AI Support Bot', description: 'Intelligent technical support and troubleshooting', timeline: '6-10 weeks' },
                { name: 'Personalized Onboarding', description: 'Customized user onboarding experiences', timeline: '8-12 weeks' }
            ],
            prediction: [
                { name: 'System Failure Prediction', description: 'Predict and prevent system outages', timeline: '12-16 weeks' },
                { name: 'User Churn Prevention', description: 'Identify and retain at-risk users', timeline: '10-14 weeks' }
            ]
        },
    };
    
    let solutions = [];
    challenges.forEach(challenge => {
        if (solutionMap[industry] && solutionMap[industry][challenge]) {
            solutions = solutions.concat(solutionMap[industry][challenge]);
        }
    });
    
    return solutions.slice(0, 3); // Return max 3 solutions
}

// ROI Calculator
function initializeROICalculator() {
    const companySizeSlider = document.getElementById('company-size');
    const efficiencySlider = document.getElementById('efficiency');
    const sizeDisplay = document.getElementById('size-display');
    const efficiencyDisplay = document.getElementById('efficiency-display');
    const automationGoals = document.querySelectorAll('.automation-goal');
    
    // Chart initialization
    const chartDom = document.getElementById('roi-chart');
    const myChart = echarts.init(chartDom);
    
    function updateROI() {
        const companySize = parseInt(companySizeSlider.value);
        const currentEfficiency = parseInt(efficiencySlider.value);
        
        // Update displays
        sizeDisplay.textContent = companySize;
        efficiencyDisplay.textContent = currentEfficiency + '%';
        
        // Calculate based on selected goals
        let efficiencyGain = 0;
        let costMultiplier = 1;
        
        automationGoals.forEach(goal => {
            if (goal.checked) {
                switch (goal.dataset.value) {
                    case 'process':
                        efficiencyGain += 40;
                        costMultiplier += 0.5;
                        break;
                    case 'analytics':
                        efficiencyGain += 35;
                        costMultiplier += 0.3;
                        break;
                    case 'customer':
                        efficiencyGain += 50;
                        costMultiplier += 0.4;
                        break;
                    case 'prediction':
                        efficiencyGain += 60;
                        costMultiplier += 0.6;
                        break;
                }
            }
        });
        
        // Calculate financial impact with realistic figures
        const baseCostPerEmployee = 40000; // More conservative estimate
        const totalLaborCost = companySize * baseCostPerEmployee;
        const potentialSavings = totalLaborCost * (efficiencyGain / 100) * 0.3; // Conservative 30% of efficiency gain
        const implementationCost = companySize * 2000 * costMultiplier; // Reduced implementation cost
        const annualSavings = potentialSavings - (implementationCost * 0.15); // 15% of implementation cost annually
        const roi = Math.max(0, ((annualSavings - implementationCost * 0.15) / (implementationCost * 0.15)) * 100);
        const paybackMonths = Math.ceil(implementationCost / Math.max(1, annualSavings / 12)); // Avoid division by zero
        
        // Update displays with realistic ranges
        const realisticSavings = Math.round(annualSavings / 1000) * 1000; // Round to nearest thousand
        const realisticROI = Math.min(500, Math.round(roi)); // Cap ROI at 500% for realism
        
        document.getElementById('cost-saving').textContent = '$' + realisticSavings.toLocaleString();
        document.getElementById('efficiency-gain').textContent = efficiencyGain + '%';
        document.getElementById('roi-percentage').textContent = realisticROI + '%';
        document.getElementById('payback-period').textContent = Math.min(36, paybackMonths); // Cap at 36 months
        
        // Update chart
        updateROIChart(annualSavings, implementationCost);
    }
    
    function updateROIChart(annualSavings, implementationCost) {
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00D4FF',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Cumulative Savings', 'Implementation Cost'],
                textStyle: { color: '#fff' }
            },
            xAxis: {
                type: 'category',
                data: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#666' } },
                axisLabel: { color: '#fff' },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [
                {
                    name: 'Cumulative Savings',
                    type: 'line',
                    data: [
                        annualSavings * 0.5,
                        annualSavings * 1.5,
                        annualSavings * 2.5,
                        annualSavings * 3.5,
                        annualSavings * 4.5
                    ],
                    lineStyle: { color: '#00D4FF', width: 3 },
                    itemStyle: { color: '#00D4FF' },
                    areaStyle: { color: 'rgba(0, 212, 255, 0.1)' }
                },
                {
                    name: 'Implementation Cost',
                    type: 'line',
                    data: [
                        implementationCost,
                        implementationCost * 0.2,
                        implementationCost * 0.2,
                        implementationCost * 0.2,
                        implementationCost * 0.2
                    ],
                    lineStyle: { color: '#FFB800', width: 3 },
                    itemStyle: { color: '#FFB800' },
                    areaStyle: { color: 'rgba(255, 184, 0, 0.1)' }
                }
            ]
        };
        
        myChart.setOption(option);
    }
    
    // Event listeners
    companySizeSlider.addEventListener('input', updateROI);
    efficiencySlider.addEventListener('input', updateROI);
    automationGoals.forEach(goal => {
        goal.addEventListener('change', updateROI);
    });
    
    // Initial calculation
    updateROI();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Animate form submission
        anime({
            targets: contactForm,
            scale: [1, 0.95, 1],
            duration: 300,
            easing: 'easeInOutQuad',
            complete: function() {
                alert('Thank you for your interest! Our team will contact you within 24 hours to schedule your AI strategy consultation.');
                contactForm.reset();
            }
        });
    });
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation item on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-electric-cyan');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-electric-cyan');
            }
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover animations to cards
    const cards = document.querySelectorAll('.hover-3d');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotateY: 0,
                rotateX: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Add pulse effect to neural elements
    const neuralElements = document.querySelectorAll('.pulse-neural');
    neuralElements.forEach(element => {
        anime({
            targets: element,
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6],
            duration: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });
    });
});

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add loading animation
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        anime({
            targets: loader,
            opacity: 0,
            duration: 500,
            complete: function() {
                loader.style.display = 'none';
            }
        });
    }
    
    // Animate page entrance
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
    });
});