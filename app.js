// ============================================
// Kageyo TSS - SINGLE PAGE APPLICATION
// Connected to Backend API
// ============================================

console.log('📚 App.js loaded!');

// Configuration
const API_URL = 'http://localhost:5002/api';
let currentUser = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white transition-opacity duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// API SERVICE FUNCTIONS
// ============================================

const API = {
    async get(endpoint) {
        try {
            showLoading();
            const response = await axios.get(`${API_URL}${endpoint}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (GET ${endpoint}):`, error);
            return { 
                success: false, 
                message: error.response?.data?.msg || error.message || 'Request failed' 
            };
        } finally {
            hideLoading();
        }
    },

    async post(endpoint, data) {
        try {
            showLoading();
            const response = await axios.post(`${API_URL}${endpoint}`, data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (POST ${endpoint}):`, error);
            return { 
                success: false, 
                message: error.response?.data?.msg || error.message || 'Request failed' 
            };
        } finally {
            hideLoading();
        }
    },

    async put(endpoint, data) {
        try {
            showLoading();
            const response = await axios.put(`${API_URL}${endpoint}`, data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (PUT ${endpoint}):`, error);
            return { 
                success: false, 
                message: error.response?.data?.msg || error.message || 'Request failed' 
            };
        } finally {
            hideLoading();
        }
    },

    async delete(endpoint) {
        try {
            showLoading();
            const response = await axios.delete(`${API_URL}${endpoint}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (DELETE ${endpoint}):`, error);
            return { 
                success: false, 
                message: error.response?.data?.msg || error.message || 'Request failed' 
            };
        } finally {
            hideLoading();
        }
    }
};

// ============================================
// AUTHENTICATION
// ============================================

async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        currentUser = null;
        updateAuthUI();
        return false;
    }

    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        currentUser = response.data.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        updateAuthUI();
        return true;
    } catch (error) {
        localStorage.removeItem('token');
        currentUser = null;
        updateAuthUI();
        return false;
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const headerInfo = document.getElementById('header-info');

    if (currentUser) {
        loginBtn?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
        if (headerInfo) headerInfo.textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;
    } else {
        loginBtn?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
        if (headerInfo) headerInfo.textContent = '';
    }
}

async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', response.data.token);
        await checkAuth();
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.msg || 'Login failed' 
        };
    }
}

async function register(name, email, password, role) {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { 
            name, email, password, role 
        });
        localStorage.setItem('token', response.data.token);
        await checkAuth();
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.msg || 'Registration failed' 
        };
    }
}

function logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    currentUser = null;
    updateAuthUI();
    navigateTo('/');
    showNotification('Logged out successfully');
}

// ============================================
// ROUTING SYSTEM
// ============================================

const routes = {
    '/': renderHome,
    '/about': renderAbout,
    '/academics': renderAcademics,
    '/admissions': renderAdmissions,
    '/contact': renderContact,
    '/login': renderLogin,
    '/register': renderRegister,
    '/dashboard': renderDashboard,
    '/students': renderStudents,
    '/marks': renderMarks,
    '/library': renderLibrary,
    '/discipline': renderDiscipline,
    '/performance': renderPerformance,
    '/classes': renderClasses,
    '/trainers': renderTrainers,
    '/news': renderNews,
    '/announcements': renderAnnouncements,
    '/employee-of-year': renderEmployeeOfYear,
    '/developers': renderDevelopers,
    '/best-performers': renderBestPerformers,
    '/student-portal': renderStudentPortal,
    '/parent-portal': renderParentPortal,
};

function navigateTo(path) {
    window.location.hash = path;
}

async function router() {
    const path = window.location.hash.slice(1) || '/';
    console.log('🔄 Navigating to:', path);
    
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('❌ main-content element not found!');
        return;
    }
    
    const route = routes[path] || render404;
    console.log('📍 Rendering route:', path);
    
    try {
        await route();
        console.log('✅ Content displayed!');
        updateAuthUI();
    } catch (error) {
        console.error('❌ Error:', error);
        mainContent.innerHTML = `<div class="container mx-auto px-4 py-16 text-center">
            <h1 class="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
            <p class="text-gray-600">${error.message}</p>
            <button onclick="navigateTo('/')" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Go Home
            </button>
        </div>`;
    }
    
    window.scrollTo(0, 0);
}

// ============================================
// PAGE RENDERERS - CONNECTED TO BACKEND
// ============================================

async function renderHome() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="relative bg-cover bg-center h-screen" style="background-image: url('WEB_1.JPG');">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-600/90"></div>
            <div class="relative h-full flex items-center justify-center text-center text-white px-4">
                <div class="max-w-4xl animate-fade-in">
                    <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Kageyo TSS</span>
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 text-blue-100">Excellence in Technical and Vocational Education</p>
                    <p class="text-lg mb-10 text-blue-50">WORK - COURAGE - SOLIDARITY</p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <a href="#/admissions" class="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 hover:shadow-xl transition transform hover:scale-105">
                            <i class="fas fa-user-graduate mr-2"></i>Apply Now
                        </a>
                        <a href="#/about" class="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:scale-105 border-2 border-white">
                            <i class="fas fa-info-circle mr-2"></i>Learn More
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12">Quick Access</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <a href="#/students" class="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                        <i class="fas fa-users text-4xl text-blue-600 mb-4"></i>
                        <p class="font-bold">Students</p>
                    </a>
                    <a href="#/trainers" class="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                        <i class="fas fa-chalkboard-teacher text-4xl text-green-600 mb-4"></i>
                        <p class="font-bold">Trainers</p>
                    </a>
                    <a href="#/news" class="bg-purple-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                        <i class="fas fa-newspaper text-4xl text-purple-600 mb-4"></i>
                        <p class="font-bold">News</p>
                    </a>
                    <a href="#/contact" class="bg-orange-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                        <i class="fas fa-envelope text-4xl text-orange-600 mb-4"></i>
                        <p class="font-bold">Contact</p>
                    </a>
                </div>
            </div>
        </div>
    `;
}

async function renderAbout() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="relative bg-cover bg-center h-96" style="background-image: url('WEB_1.JPG');">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>
            <div class="relative h-full flex items-center justify-center text-center text-white px-4">
                <div>
                    <h1 class="text-5xl font-bold mb-4">About Kageyo TVET School</h1>
                    <p class="text-xl mb-6">Discover our rich history and commitment to excellence</p>
                    <div class="flex space-x-2 justify-center text-sm">
                        <a href="#/" class="hover:underline">Home</a>
                        <span>/</span>
                        <span class="font-bold">About Us</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-bullseye text-white text-2xl"></i>
                        </div>
                        <h2 class="text-3xl font-bold text-blue-600">Our Mission</h2>
                    </div>
                    <p class="text-gray-700 leading-relaxed">
                        To provide quality technical and vocational education that empowers students 
                        with practical skills and knowledge for successful careers.
                    </p>
                </div>
                
                <div class="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-eye text-white text-2xl"></i>
                        </div>
                        <h2 class="text-3xl font-bold text-blue-600">Our Vision</h2>
                    </div>
                    <p class="text-gray-700 leading-relaxed">
                        To be a leading TVET institution in Rwanda, recognized for producing skilled graduates.
                    </p>
                </div>
            </div>

            <div class="mb-12">
                <h2 class="text-3xl font-bold text-center text-blue-600 mb-8">Our Core Values</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                        <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-briefcase text-3xl text-white"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-blue-600">WORK</h3>
                        <p class="text-gray-600">Dedication and commitment to excellence</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                        <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-heart text-3xl text-white"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-blue-600">COURAGE</h3>
                        <p class="text-gray-600">Bravery to face challenges</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                        <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-hands-helping text-3xl text-white"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-blue-600">SOLIDARITY</h3>
                        <p class="text-gray-600">Unity and mutual support</p>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 p-8 rounded-lg shadow-lg mb-8">
                <h3 class="text-3xl font-bold text-blue-600 mb-6">History and Background</h3>
                <hr class="my-4 border-blue-200">
                
                <h5 class="text-xl font-bold text-blue-600 mb-3 mt-6">Origin</h5>
                <p class="text-gray-700 leading-relaxed mb-6">
                    Established in 1997 in KAJEVUBA village, Bugomba cell, Kaniga sector, Gicumbi district, 
                    Northern Province. Started with 377 students and has grown to become a leading TVET institution.
                </p>
            </div>

            <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-bold mb-6 text-center">Our Location</h2>
                <div class="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p class="text-lg mb-4">
                            <i class="fas fa-map-marker-alt mr-3"></i>
                            <strong>Northern Province</strong>
                        </p>
                        <p class="mb-2"><i class="fas fa-chevron-right mr-2"></i> Gicumbi District</p>
                        <p class="mb-2"><i class="fas fa-chevron-right mr-2"></i> Kaniga Sector</p>
                        <p class="mb-2"><i class="fas fa-chevron-right mr-2"></i> Near Kageyo Tea Factory</p>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden">
                        <img src="kageyo.jpg" alt="School" class="w-full h-64 object-cover">
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderAcademics() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 text-center">
            <h1 class="text-5xl font-bold mb-4">Academic Programs</h1>
            <p class="text-xl">Excellence in Technical and Vocational Education</p>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <!-- Programs Overview -->
            <section class="mb-12">
                <h2 class="text-3xl font-bold text-blue-600 mb-6 text-center">Our Programs</h2>
                <div id="programs-list" class="text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                    <p class="mt-4">Loading programs...</p>
                </div>
            </section>
            
            <!-- Academic Calendar -->
            <section class="bg-blue-50 p-8 rounded-lg mb-12">
                <h2 class="text-3xl font-bold text-blue-600 mb-6">Academic Calendar 2025-2026</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h3 class="text-xl font-bold mb-3 text-blue-600">Term 1</h3>
                        <p class="text-gray-600 mb-2">September 4, 2025 - December 20, 2025</p>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>First Day: Sept 4</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Mid-term: Oct 15-20</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Final Exams: Nov 15-30</li>
                        </ul>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h3 class="text-xl font-bold mb-3 text-blue-600">Term 2</h3>
                        <p class="text-gray-600 mb-2">January 6, 2026 - April 3, 2026</p>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Classes Resume: Jan 6</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Mid-term: Feb 15-20</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Final Exams: Mar 15-30</li>
                        </ul>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h3 class="text-xl font-bold mb-3 text-blue-600">Term 3</h3>
                        <p class="text-gray-600 mb-2">April 20, 2026 - July 31, 2026</p>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Term Begins: Apr 20</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Mid-term: May 15-20</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Final Exams: Jul 1-15</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <!-- Study Resources -->
            <section class="mb-12">
                <h2 class="text-3xl font-bold text-blue-600 mb-6">Study Resources</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <i class="fas fa-book text-4xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-bold mb-3">E-Library</h3>
                        <p class="text-gray-600 mb-4">Access digital textbooks, research papers, and study materials</p>
                        <a href="#/library" class="text-blue-600 hover:underline font-semibold">Browse Library →</a>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <i class="fas fa-file-pdf text-4xl text-red-600 mb-4"></i>
                        <h3 class="text-xl font-bold mb-3">Past Papers</h3>
                        <p class="text-gray-600 mb-4">Download previous examination papers for practice</p>
                        <a href="#/library" class="text-blue-600 hover:underline font-semibold">View Papers →</a>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <i class="fas fa-video text-4xl text-purple-600 mb-4"></i>
                        <h3 class="text-xl font-bold mb-3">Video Tutorials</h3>
                        <p class="text-gray-600 mb-4">Watch instructional videos and recorded lectures</p>
                        <a href="#/library" class="text-blue-600 hover:underline font-semibold">Watch Now →</a>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <i class="fas fa-project-diagram text-4xl text-green-600 mb-4"></i>
                        <h3 class="text-xl font-bold mb-3">Student Projects</h3>
                        <p class="text-gray-600 mb-4">Explore projects by fellow students</p>
                        <a href="#/library" class="text-blue-600 hover:underline font-semibold">Explore Projects →</a>
                    </div>
                </div>
            </section>
        </div>
    `;
    
    const result = await API.get('/programs');
    const programsList = document.getElementById('programs-list');
    
    if (result.success && result.data.data) {
        programsList.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${result.data.data.map((program, index) => {
                    const colors = ['blue', 'green', 'purple', 'orange'];
                    const icons = ['fa-laptop-code', 'fa-calculator', 'fa-network-wired', 'fa-utensils'];
                    const color = colors[index % colors.length];
                    const icon = icons[index % icons.length];
                    
                    return `
                        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-2 border-t-4 border-${color}-600">
                            <div class="w-16 h-16 bg-gradient-to-br from-${color}-600 to-${color}-700 rounded-xl flex items-center justify-center mb-4">
                                <i class="fas ${icon} text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-gray-800">${program.name}</h3>
                            <p class="text-gray-600 text-sm mb-4">${program.description || 'Quality technical and vocational education'}</p>
                            <div class="text-sm text-gray-500">
                                ${program.duration ? `<p><i class="fas fa-clock mr-2"></i>${program.duration}</p>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        programsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load programs. ${result.message}</p>
            </div>
        `;
    }
}

async function renderAdmissions() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 text-center">
            <h1 class="text-5xl font-bold mb-4">Admissions</h1>
            <p class="text-2xl">Join Kageyo TSS Today</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-bold mb-6 text-center">Application Information</h2>
                <p class="text-gray-700 mb-4">Ready to start your journey with us? Contact our admissions office for more information.</p>
                <div class="text-center">
                    <a href="#/contact" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">
                        Contact Admissions
                    </a>
                </div>
            </div>
        </div>
    `;
}

async function renderContact() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-bold mb-4">Get in Touch</h2>
                    <div class="space-y-4">
                        <p><i class="fas fa-map-marker-alt mr-2 text-blue-600"></i> Gicumbi District, Kaniga Sector</p>
                        <p><i class="fas fa-phone mr-2 text-blue-600"></i> +250 738266603</p>
                        <p><i class="fas fa-envelope mr-2 text-blue-600"></i> kageyoTSS@gmail.com</p>
                    </div>
                </div>
                <div>
                    <form id="contact-form" class="space-y-4">
                        <input type="text" placeholder="Name" class="w-full p-3 border rounded-lg" required>
                        <input type="email" placeholder="Email" class="w-full p-3 border rounded-lg" required>
                        <textarea placeholder="Message" rows="4" class="w-full p-3 border rounded-lg" required></textarea>
                        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

async function renderLogin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4">
            <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div class="text-center mb-8">
                    <img src="logo.jpg" alt="Logo" class="w-20 h-20 mx-auto rounded-full mb-4">
                    <h2 class="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p class="text-gray-600">Sign in to your account</p>
                </div>
                
                <!-- Login Type Selection -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
                    <div class="grid grid-cols-2 gap-3">
                        <button type="button" onclick="showStaffLogin()" 
                            class="login-type-btn active px-4 py-3 border-2 border-blue-600 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                            <i class="fas fa-user-tie mr-2"></i>Staff/Teacher
                        </button>
                        <button type="button" onclick="showStudentParentLogin()" 
                            class="login-type-btn px-4 py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                            <i class="fas fa-user-graduate mr-2"></i>Student/Parent
                        </button>
                    </div>
                </div>
                
                <!-- Staff Login Form -->
                <form id="staff-login-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="staff-email" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="staff-password" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    
                    <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                        <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                    </button>
                </form>
                
                <!-- Student/Parent Login Form -->
                <form id="student-parent-login-form" class="space-y-4 hidden">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">I am:</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                <input type="radio" name="user-type" value="student" checked class="mr-2">
                                <span class="font-medium">Student</span>
                            </label>
                            <label class="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                <input type="radio" name="user-type" value="parent" class="mr-2">
                                <span class="font-medium">Parent</span>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                        <input type="text" id="student-id" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Student Full Name</label>
                        <input type="text" id="student-name" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div id="parent-fields" class="hidden space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Student Class</label>
                            <input type="text" id="student-class" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                            <input type="text" id="parent-name" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <button type="submit" 
                        class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                        <i class="fas fa-sign-in-alt mr-2"></i>Access Portal
                    </button>
                </form>
                
                <p class="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <a href="#/register" class="text-blue-600 hover:underline font-semibold">Register</a>
                </p>
            </div>
        </div>
    `;
    
    // Show/hide parent fields based on user type selection
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]');
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const parentFields = document.getElementById('parent-fields');
            const studentClassField = document.getElementById('student-class');
            const parentNameField = document.getElementById('parent-name');
            
            if (e.target.value === 'parent') {
                parentFields.classList.remove('hidden');
                studentClassField.required = true;
                parentNameField.required = true;
            } else {
                parentFields.classList.add('hidden');
                studentClassField.required = false;
                parentNameField.required = false;
            }
        });
    });
    
    // Staff login handler
    document.getElementById('staff-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('staff-email').value;
        const password = document.getElementById('staff-password').value;
        
        const result = await login(email, password);
        if (result.success) {
            showNotification('Login successful!', 'success');
            navigateTo('/dashboard');
        } else {
            showNotification(result.message, 'error');
        }
    });
    
    // Student/Parent login handler
    document.getElementById('student-parent-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userType = document.querySelector('input[name="user-type"]:checked').value;
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        
        if (userType === 'parent') {
            const studentClass = document.getElementById('student-class').value;
            const parentName = document.getElementById('parent-name').value;
            
            // Parent login - verify all details match
            const result = await API.post('/students/parent-login', {
                studentId,
                studentName,
                studentClass,
                parentName
            });
            
            if (result.success) {
                showNotification('Welcome! Access granted.', 'success');
                currentUser = { role: 'Parent', studentId, studentName };
                navigateTo('/parent-portal');
            } else {
                showNotification('Invalid credentials. Please check all details.', 'error');
            }
        } else {
            // Student login - verify ID and name
            const result = await API.post('/students/student-login', {
                studentId,
                studentName
            });
            
            if (result.success) {
                showNotification('Welcome back!', 'success');
                currentUser = { role: 'Student', studentId, studentName };
                navigateTo('/student-portal');
            } else {
                showNotification('Invalid Student ID or Name.', 'error');
            }
        }
    });
    
    // Global functions for login type switching
    window.showStaffLogin = function() {
        document.getElementById('staff-login-form').classList.remove('hidden');
        document.getElementById('student-parent-login-form').classList.add('hidden');
        
        document.querySelectorAll('.login-type-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
            btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        });
        event.target.closest('button').classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
        event.target.closest('button').classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
    };
    
    window.showStudentParentLogin = function() {
        document.getElementById('staff-login-form').classList.add('hidden');
        document.getElementById('student-parent-login-form').classList.remove('hidden');
        
        document.querySelectorAll('.login-type-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
            btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        });
        event.target.closest('button').classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
        event.target.closest('button').classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
    };
}

async function renderRegister() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4">
            <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div class="text-center mb-8">
                    <img src="logo.jpg" alt="Logo" class="w-20 h-20 mx-auto rounded-full mb-4">
                    <h2 class="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p class="text-gray-600">Join Kageyo TVET School</p>
                    <div class="mt-3 bg-blue-50 rounded-lg p-3">
                        <p class="text-xs text-blue-800 font-semibold">Select your role from the dropdown below</p>
                    </div>
                </div>
                
                <form id="register-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="register-name" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="register-email" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="register-password" required minlength="6"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
                        <select id="register-role" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">-- Choose Role --</option>
                            <optgroup label="Administrative Staff">
                                <option value="SM">School Manager (SM)</option>
                                <option value="DOS">Dean of Studies (DOS)</option>
                                <option value="DOD">Dean of Discipline (DOD)</option>
                                <option value="IT">IT Technician</option>
                                <option value="Bursar">Bursar</option>
                                <option value="Librarian">Librarian</option>
                                <option value="Patron">Patron</option>
                                <option value="Matron">Matron</option>
                            </optgroup>
                            <optgroup label="Teaching Staff">
                                <option value="Teacher">Teacher</option>
                            </optgroup>
                            <optgroup label="Students & Parents">
                                <option value="Student">Student</option>
                                <option value="Parent">Parent</option>
                            </optgroup>
                        </select>
                    </div>
                    
                    <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                        <i class="fas fa-user-plus mr-2"></i>Create Account
                    </button>
                </form>
                
                <p class="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <a href="#/login" class="text-blue-600 hover:underline">Sign In</a>
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;
        
        const result = await register(name, email, password, role);
        if (result.success) {
            showNotification('Registration successful!', 'success');
            navigateTo('/dashboard');
        } else {
            showNotification(result.message, 'error');
        }
    });
}

async function renderDashboard() {
    if (!currentUser) {
        navigateTo('/login');
        return;
    }
    
    // Route to role-specific dashboard
    const role = currentUser.role;
    
    switch(role) {
        case 'SM':
            renderSMDashboard();
            break;
        case 'DOS':
            renderDOSDashboard();
            break;
        case 'DOD':
        case 'Patron':
        case 'Matron':
            renderDODDashboard();
            break;
        case 'IT':
            renderITDashboard();
            break;
        case 'Librarian':
            renderLibrarianDashboard();
            break;
        case 'Bursar':
            renderBursarDashboard();
            break;
        case 'Teacher':
            renderTeacherDashboard();
            break;
        case 'Student':
            navigateTo('/student-portal');
            break;
        case 'Parent':
            navigateTo('/parent-portal');
            break;
        default:
            renderDefaultDashboard();
    }
}

// Default dashboard for unknown roles
async function renderDefaultDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2">Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name} (${currentUser.role})</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-4xl text-blue-600 mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Students</h3>
                    <p class="text-gray-600">Manage student records</p>
                    <a href="#/students" class="text-blue-600 hover:underline mt-2 inline-block">View Students →</a>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chart-line text-4xl text-green-600 mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Performance</h3>
                    <p class="text-gray-600">View analytics</p>
                    <a href="#/performance" class="text-green-600 hover:underline mt-2 inline-block">View Analytics →</a>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-book text-4xl text-purple-600 mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Library</h3>
                    <p class="text-gray-600">Manage resources</p>
                    <a href="#/library" class="text-purple-600 hover:underline mt-2 inline-block">View Library →</a>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// ROLE-BASED DASHBOARDS
// ============================================

// School Manager Dashboard
async function renderSMDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-user-shield mr-3"></i>School Manager Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <!-- Quick Stats -->
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-600">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-students">...</h3>
                    <p class="text-gray-600">Total Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-600">
                    <i class="fas fa-chalkboard-teacher text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-teachers">...</h3>
                    <p class="text-gray-600">Total Teachers</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-600">
                    <i class="fas fa-book text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-books">...</h3>
                    <p class="text-gray-600">Library Books</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-orange-600">
                    <i class="fas fa-dollar-sign text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="fees-collected">...</h3>
                    <p class="text-gray-600">Fees Collected</p>
                </div>
            </div>
            
            <!-- Department Reports -->
            <h2 class="text-3xl font-bold text-blue-600 mb-6">Department Reports</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <!-- DOS Report -->
                <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="navigateTo('/dos-report')">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-graduation-cap text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-blue-600">Dean of Studies (DOS)</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Academic performance, marks, and class management</p>
                    <button class="text-blue-600 font-semibold hover:underline">View Full Report →</button>
                </div>
                
                <!-- DOD Report -->
                <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="navigateTo('/dod-report')">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-gavel text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-red-600">Dean of Discipline (DOD)</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Student discipline and conduct reports</p>
                    <button class="text-red-600 font-semibold hover:underline">View Full Report →</button>
                </div>
                
                <!-- Librarian Report -->
                <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="navigateTo('/librarian-report')">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-book-reader text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-purple-600">Librarian</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Library usage, books, and borrowing stats</p>
                    <button class="text-purple-600 font-semibold hover:underline">View Full Report →</button>
                </div>
                
                <!-- Bursar Report -->
                <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="navigateTo('/bursar-report')">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-money-bill-wave text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-green-600">Bursar</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Financial reports and fee collection status</p>
                    <button class="text-green-600 font-semibold hover:underline">View Full Report →</button>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-12">
                <h2 class="text-3xl font-bold text-blue-600 mb-6">Quick Actions</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <button onclick="navigateTo('/students')" class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-user-plus text-2xl mb-2"></i>
                        <p class="font-semibold">Register Student</p>
                    </button>
                    <button onclick="navigateTo('/performance')" class="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition">
                        <i class="fas fa-chart-bar text-2xl mb-2"></i>
                        <p class="font-semibold">View Performance</p>
                    </button>
                    <button onclick="navigateTo('/classes')" class="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition">
                        <i class="fas fa-school text-2xl mb-2"></i>
                        <p class="font-semibold">Manage Classes</p>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Load statistics
    loadSMStats();
}

async function loadSMStats() {
    const studentsResult = await API.get('/students');
    const teachersResult = await API.get('/trainers');
    
    if (studentsResult.success) {
        document.getElementById('total-students').textContent = studentsResult.data.count || 0;
    }
    if (teachersResult.success) {
        document.getElementById('total-teachers').textContent = teachersResult.data.count || 0;
    }
}

// Dean of Studies Dashboard
async function renderDOSDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-graduation-cap mr-3"></i>Dean of Studies Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-students">...</h3>
                    <p class="text-gray-600">Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-school text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-classes">...</h3>
                    <p class="text-gray-600">Classes</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chalkboard-teacher text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-teachers">...</h3>
                    <p class="text-gray-600">Teachers</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chart-line text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">95%</h3>
                    <p class="text-gray-600">Avg Performance</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <button onclick="navigateTo('/students')" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-user-plus text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Student Management</h3>
                    <p class="text-sm">Register and manage students</p>
                </button>
                <button onclick="navigateTo('/classes')" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-school text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Classes Management</h3>
                    <p class="text-sm">Create classes and assign students</p>
                </button>
                <button onclick="navigateTo('/marks')" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-edit text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Marks Management</h3>
                    <p class="text-sm">Add, edit, and publish marks</p>
                </button>
                <button onclick="navigateTo('/performance')" class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-chart-bar text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Performance Analysis</h3>
                    <p class="text-sm">View detailed performance reports</p>
                </button>
                <button onclick="navigateTo('/discipline')" class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-gavel text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Discipline Reports</h3>
                    <p class="text-sm">View discipline from DOD</p>
                </button>
                <button class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-file-export text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Final Reports</h3>
                    <p class="text-sm">Export PDF reports</p>
                </button>
            </div>
        </div>
    `;
}

// Dean of Discipline Dashboard
async function renderDODDashboard() {
    const mainContent = document.getElementById('main-content');
    const roleTitle = currentUser.role === 'Patron' ? 'Patron' : currentUser.role === 'Matron' ? 'Matron' : 'Dean of Discipline';
    
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-gavel mr-3"></i>${roleTitle} Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dod-students">...</h3>
                    <p class="text-gray-600">Total Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500">
                    <i class="fas fa-exclamation-triangle text-3xl text-yellow-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="low-conduct">...</h3>
                    <p class="text-gray-600">Low Conduct (&lt;20)</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-clipboard-list text-3xl text-red-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-faults">...</h3>
                    <p class="text-gray-600">Total Faults</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <button onclick="navigateTo('/discipline')" class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-clipboard-list text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Discipline Management</h3>
                    <p class="text-sm">Create faults and manage conduct (40 max)</p>
                </button>
                <button class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-user-minus text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Reduce Conduct Marks</h3>
                    <p class="text-sm">Deduct marks for student faults</p>
                </button>
                <button class="bg-yellow-600 text-white p-6 rounded-lg hover:bg-yellow-700 transition text-left">
                    <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Low Conduct Alert</h3>
                    <p class="text-sm">Students below 20 conduct marks</p>
                </button>
                <button class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-file-alt text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Publish Reports</h3>
                    <p class="text-sm">Send reports to DOS and SM</p>
                </button>
            </div>
        </div>
    `;
}

// IT Dashboard
async function renderITDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-cog mr-3"></i>IT Technician Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">...</h3>
                    <p class="text-gray-600">Total Users</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-user-graduate text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">...</h3>
                    <p class="text-gray-600">Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-user-tie text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">...</h3>
                    <p class="text-gray-600">Staff</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chalkboard-teacher text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">...</h3>
                    <p class="text-gray-600">Teachers</p>
                </div>
            </div>
            
            <h2 class="text-3xl font-bold text-gray-800 mb-6">System Management</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <button onclick="navigateTo('/students')" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-user-plus text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Register Student</h3>
                    <p class="text-sm">Add new students to system</p>
                </button>
                <button onclick="navigateTo('/trainers')" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-user-tie text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Manage Staff</h3>
                    <p class="text-sm">Add/edit staff and teachers</p>
                </button>
                <button class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-database text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Database Manager</h3>
                    <p class="text-sm">Manage database and backups</p>
                </button>
                <button onclick="navigateTo('/news')" class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-newspaper text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Website Content</h3>
                    <p class="text-sm">Manage news and announcements</p>
                </button>
                <button class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-shield-alt text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Security</h3>
                    <p class="text-sm">User permissions and access</p>
                </button>
                <button class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-server text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">System Settings</h3>
                    <p class="text-sm">Configure application settings</p>
                </button>
            </div>
        </div>
    `;
}

// Librarian Dashboard
async function renderLibrarianDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-book-reader mr-3"></i>Librarian Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-book text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="lib-books">...</h3>
                    <p class="text-gray-600">Total Books</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-book-open text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="lib-borrowed">...</h3>
                    <p class="text-gray-600">Borrowed</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500">
                    <i class="fas fa-clock text-3xl text-red-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="lib-overdue">...</h3>
                    <p class="text-gray-600">Overdue (7 days)</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-star text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">Top 10</h3>
                    <p class="text-gray-600">Most Borrowed</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <button onclick="navigateTo('/library')" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-plus-circle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Add Books</h3>
                    <p class="text-sm">Register new books to library</p>
                </button>
                <button class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-hand-holding text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Borrow/Return</h3>
                    <p class="text-sm">Manage borrowing and returns</p>
                </button>
                <button class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Overdue Tracking</h3>
                    <p class="text-sm">Monitor overdue books</p>
                </button>
                <button class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-chart-pie text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Library Reports</h3>
                    <p class="text-sm">View comprehensive reports</p>
                </button>
                <button class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-trophy text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Most Borrowed</h3>
                    <p class="text-sm">Popular books statistics</p>
                </button>
                <button onclick="navigateTo('/students')" class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-users text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">View Students</h3>
                    <p class="text-sm">Access students per class</p>
                </button>
            </div>
        </div>
    `;
}

// Bursar Dashboard
async function renderBursarDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-money-bill-wave mr-3"></i>Bursar Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-dollar-sign text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="fees-expected">...</h3>
                    <p class="text-gray-600">Expected Fees</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
                    <i class="fas fa-check-circle text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="fees-paid">...</h3>
                    <p class="text-gray-600">Collected</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500">
                    <i class="fas fa-exclamation-circle text-3xl text-red-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="fees-unpaid">...</h3>
                    <p class="text-gray-600">Balance</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="bursar-students">...</h3>
                    <p class="text-gray-600">Students</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <button class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-dollar-sign text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Record Payment</h3>
                    <p class="text-sm">Record student fee payments</p>
                </button>
                <button onclick="navigateTo('/students')" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-users text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">View Students</h3>
                    <p class="text-sm">All students and their classes</p>
                </button>
                <button class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-file-invoice-dollar text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Payment Status</h3>
                    <p class="text-sm">Paid/Unpaid tracking</p>
                </button>
                <button class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-chart-pie text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Financial Reports</h3>
                    <p class="text-sm">Generate fee collection reports</p>
                </button>
                <button class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Unpaid Fees</h3>
                    <p class="text-sm">Students with unpaid fees</p>
                </button>
                <button class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-file-export text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Export Reports</h3>
                    <p class="text-sm">Download fee reports as PDF</p>
                </button>
            </div>
        </div>
    `;
}

// Teacher Dashboard
async function renderTeacherDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-chalkboard-teacher mr-3"></i>Teacher Dashboard</h1>
                <p class="text-xl">Welcome, ${currentUser.name}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-school text-3xl text-teal-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">3</h3>
                    <p class="text-gray-600">Assigned Classes</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">120</h3>
                    <p class="text-gray-600">Total Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-clipboard-check text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">45</h3>
                    <p class="text-gray-600">Marks Recorded</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <button onclick="navigateTo('/marks')" class="bg-teal-600 text-white p-6 rounded-lg hover:bg-teal-700 transition text-left">
                    <i class="fas fa-edit text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Record Marks</h3>
                    <p class="text-sm">Add marks for your classes</p>
                </button>
                <button onclick="navigateTo('/classes')" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-users text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">My Classes</h3>
                    <p class="text-sm">View assigned classes</p>
                </button>
                <button onclick="navigateTo('/performance')" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-chart-line text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Student Performance</h3>
                    <p class="text-sm">View student analytics</p>
                </button>
                <button onclick="navigateTo('/library')" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-book text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Teaching Resources</h3>
                    <p class="text-sm">Access library materials</p>
                </button>
            </div>
        </div>
    `;
}

async function renderStudents() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Students</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="students-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading students...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/students');
    const studentsList = document.getElementById('students-list');
    
    if (result.success && result.data.data) {
        studentsList.innerHTML = `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-blue-600 text-white">
                        <tr>
                            <th class="px-6 py-3 text-left">Name</th>
                            <th class="px-6 py-3 text-left">Email</th>
                            <th class="px-6 py-3 text-left">Program</th>
                            <th class="px-6 py-3 text-left">Class</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${result.data.data.map(student => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4">${student.name}</td>
                                <td class="px-6 py-4">${student.email}</td>
                                <td class="px-6 py-4">${student.program || 'N/A'}</td>
                                <td class="px-6 py-4">${student.class || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        studentsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load students. ${result.message}</p>
            </div>
        `;
    }
}

async function renderMarks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Marks Management</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Marks management system - Connect to backend for data</p>
        </div>
    `;
}

async function renderLibrary() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-green-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Library</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Library management system - Connect to backend for data</p>
        </div>
    `;
}

async function renderDiscipline() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-red-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Discipline</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Discipline management system - Connect to backend for data</p>
        </div>
    `;
}

async function renderPerformance() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-purple-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Performance Analytics</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Performance analytics - Connect to backend for data</p>
        </div>
    `;
}

async function renderClasses() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Classes</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="classes-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading classes...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/classes');
    const classesList = document.getElementById('classes-list');
    
    if (result.success && result.data.data) {
        classesList.innerHTML = `
            <div class="grid md:grid-cols-3 gap-6">
                ${result.data.data.map(cls => `
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl font-bold mb-2 text-blue-600">${cls.name}</h3>
                        <p class="text-gray-600">Program: ${cls.program || 'N/A'}</p>
                        <p class="text-gray-600">Students: ${cls.studentCount || 0}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        classesList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load classes. ${result.message}</p>
            </div>
        `;
    }
}

async function renderTrainers() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Our Trainers</h1>
            <p class="text-xl">Meet our dedicated and experienced team</p>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-blue-600 mb-2">Our Professional Team</h2>
                <div class="flex space-x-2 text-sm text-gray-600">
                    <a href="#/" class="hover:text-blue-600">Home</a>
                    <span>/</span>
                    <span class="text-blue-600">Trainers</span>
                </div>
            </div>
            
            <div id="trainers-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading trainers...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/trainers');
    const trainersList = document.getElementById('trainers-list');
    
    if (result.success && result.data.data) {
        trainersList.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${result.data.data.map(trainer => `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                        <div class="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            ${trainer.photo ? 
                                `<img src="${trainer.photo}" alt="${trainer.name}" class="w-full h-full object-cover">` :
                                `<i class="fas fa-user-tie text-6xl text-blue-600"></i>`
                            }
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-blue-600">${trainer.name}</h3>
                            <p class="text-gray-600 mb-2">${trainer.subject || trainer.role || 'Trainer'}</p>
                            <p class="text-sm text-gray-500 mb-3">${trainer.email || ''}</p>
                            ${trainer.phone ? `<p class="text-sm text-gray-500"><i class="fas fa-phone mr-2"></i>${trainer.phone}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        trainersList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load trainers. ${result.message}</p>
            </div>
        `;
    }
}

async function renderNews() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 text-center">
            <h1 class="text-5xl font-bold mb-4">Latest News & Updates</h1>
            <p class="text-xl">Stay informed about school events and announcements</p>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-blue-600 mb-2">School News</h2>
                <div class="flex space-x-2 text-sm text-gray-600">
                    <a href="#/" class="hover:text-blue-600">Home</a>
                    <span>/</span>
                    <span class="text-blue-600">News</span>
                </div>
            </div>
            
            <!-- Featured News Section -->
            <div id="featured-news" class="mb-12">
                <!-- Featured news will load here -->
            </div>
            
            <!-- News Grid -->
            <div id="news-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4">Loading news...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/news');
    const newsList = document.getElementById('news-list');
    const featuredNews = document.getElementById('featured-news');
    
    if (result.success && result.data.data) {
        const newsItems = result.data.data;
        
        if (newsItems.length > 0) {
            const featured = newsItems[0];
            featuredNews.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl overflow-hidden grid md:grid-cols-2 gap-0">
                    <div class="h-80 md:h-auto">
                        ${featured.image ? 
                            `<img src="${featured.image}" alt="${featured.title}" class="w-full h-full object-cover">` :
                            `<div class="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                                <i class="fas fa-newspaper text-white text-6xl"></i>
                            </div>`
                        }
                    </div>
                    <div class="p-8 flex flex-col justify-center">
                        <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block w-fit mb-4">
                            <i class="fas fa-star mr-1"></i>Featured Story
                        </span>
                        <h3 class="text-3xl font-bold mb-4 text-gray-800">${featured.title}</h3>
                        <p class="text-sm text-gray-500 mb-4">
                            <i class="fas fa-calendar mr-2"></i>${new Date(featured.createdAt || featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            ${featured.author ? `<span class="ml-4"><i class="fas fa-user mr-2"></i>${featured.author}</span>` : ''}
                        </p>
                        <p class="text-gray-700 leading-relaxed mb-6">${featured.content?.substring(0, 200) || featured.excerpt || ''}...</p>
                        <button onclick="viewNewsDetail('${featured.id}')" class="text-purple-600 font-semibold hover:text-purple-800 flex items-center">
                            Read More <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        newsList.innerHTML = `
            <h3 class="text-2xl font-bold text-blue-600 mb-6 text-left">More News</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${newsItems.slice(1).map(item => `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer" onclick="viewNewsDetail('${item.id}')">
                        <div class="h-48 overflow-hidden">
                            ${item.image ? 
                                `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">` :
                                `<div class="w-full h-full bg-gradient-to-br from-purple-200 to-indigo-300 flex items-center justify-center">
                                    <i class="fas fa-newspaper text-purple-600 text-4xl"></i>
                                </div>`
                            }
                        </div>
                        <div class="p-6">
                            <span class="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                                ${new Date(item.createdAt || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <h3 class="text-xl font-bold mt-3 mb-2 text-gray-800 line-clamp-2">${item.title}</h3>
                            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${item.content?.substring(0, 120) || item.excerpt || ''}...</p>
                            <div class="flex items-center text-purple-600 font-semibold text-sm">
                                Read More <i class="fas fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        window.viewNewsDetail = function(newsId) {
            const news = newsItems.find(n => n.id === newsId);
            if (news) {
                mainContent.innerHTML = `
                    <div class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12 text-center">
                        <div class="container mx-auto px-4">
                            <button onclick="navigateTo('/news')" class="text-white hover:text-gray-200 mb-4 inline-flex items-center">
                                <i class="fas fa-arrow-left mr-2"></i> Back to News
                            </button>
                            <h1 class="text-4xl font-bold">${news.title}</h1>
                            <p class="mt-4">
                                <i class="fas fa-calendar mr-2"></i>${new Date(news.createdAt || news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                ${news.author ? `<span class="ml-4"><i class="fas fa-user mr-2"></i>${news.author}</span>` : ''}
                            </p>
                        </div>
                    </div>
                    <div class="container mx-auto px-4 py-16">
                        <div class="max-w-4xl mx-auto">
                            ${news.image ? `<img src="${news.image}" alt="${news.title}" class="w-full rounded-lg shadow-lg mb-8">` : ''}
                            <div class="prose max-w-none">
                                <p class="text-lg text-gray-700 leading-relaxed">${news.content}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        };
    } else {
        newsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load news. ${result.message}</p>
            </div>
        `;
    }
}

async function renderAnnouncements() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-orange-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Announcements</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Announcements - Connect to backend for data</p>
        </div>
    `;
}

async function renderEmployeeOfYear() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-yellow-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Employee of the Year</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Employee recognition - Connect to backend for data</p>
        </div>
    `;
}

async function renderDevelopers() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-indigo-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Development Team</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Meet the developers behind this system</p>
        </div>
    `;
}

async function renderBestPerformers() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-pink-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Best Performers</h1>
        </div>
        <div class="container mx-auto px-4 py-16">
            <p class="text-center text-gray-600">Top performing students - Connect to backend for data</p>
        </div>
    `;
}

function render404() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container mx-auto px-4 py-16 text-center">
            <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
            <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <a href="#/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Go Home
            </a>
        </div>
    `;
}

// ============================================
// STUDENT & PARENT PORTALS
// ============================================

async function renderStudentPortal() {
    if (!currentUser || currentUser.role !== 'Student') {
        navigateTo('/login');
        return;
    }
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-user-graduate mr-3"></i>Student Portal</h1>
                <p class="text-xl">Welcome, ${currentUser.studentName}</p>
                <p class="text-sm">Student ID: ${currentUser.studentId}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div id="student-data" class="text-center mb-8">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading your information...</p>
            </div>
            
            <div id="student-content" class="hidden">
                <!-- Academic Performance -->
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 class="text-2xl font-bold text-blue-600 mb-4">
                        <i class="fas fa-chart-line mr-2"></i>Academic Performance
                    </h2>
                    <div id="student-marks" class="space-y-4">
                        <!-- Marks will load here -->
                    </div>
                </div>
                
                <!-- Conduct/Behavior -->
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 class="text-2xl font-bold text-red-600 mb-4">
                        <i class="fas fa-gavel mr-2"></i>Conduct & Behavior
                    </h2>
                    <div id="student-conduct" class="space-y-4">
                        <!-- Conduct will load here -->
                    </div>
                </div>
                
                <!-- Claim/Dispute Section -->
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-yellow-800 mb-3">
                        <i class="fas fa-exclamation-circle mr-2"></i>Have a Concern?
                    </h3>
                    <p class="text-gray-700 mb-4">If you believe there's an error in your marks or conduct record, you can file a claim.</p>
                    <button class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">
                        <i class="fas fa-flag mr-2"></i>File a Claim
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Load student data
    const result = await API.post('/students/student-login', {
        studentId: currentUser.studentId,
        studentName: currentUser.studentName
    });
    
    const studentData = document.getElementById('student-data');
    const studentContent = document.getElementById('student-content');
    
    if (result.success) {
        studentData.classList.add('hidden');
        studentContent.classList.remove('hidden');
        
        // Load marks
        const marksResult = await API.get(`/marks/student/${result.data.student._id}`);
        const studentMarks = document.getElementById('student-marks');
        
        if (marksResult.success && marksResult.data.data) {
            studentMarks.innerHTML = `
                <div class="grid md:grid-cols-3 gap-4">
                    ${['Term 1', 'Term 2', 'Term 3'].map(term => `
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-bold text-blue-600 mb-2">${term}</h4>
                            <p class="text-3xl font-bold text-gray-800">85%</p>
                            <p class="text-sm text-gray-600">Average</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Load conduct
        const conductResult = await API.get(`/discipline/student/${result.data.student._id}`);
        const studentConduct = document.getElementById('student-conduct');
        
        studentConduct.innerHTML = `
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                    <p class="text-sm text-gray-600">Current Conduct Score</p>
                    <p class="text-4xl font-bold text-gray-800">35 <span class="text-lg text-gray-500">/ 40</span></p>
                </div>
                <div class="w-24 h-24">
                    <svg viewBox="0 0 36 36" class="circular-chart">
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"/>
                        <path class="circle" stroke-dasharray="${(35/40)*100}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" stroke-width="3"/>
                    </svg>
                </div>
            </div>
        `;
    } else {
        studentData.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load your data. Please contact administration.</p>
            </div>
        `;
    }
}

async function renderParentPortal() {
    if (!currentUser || currentUser.role !== 'Parent') {
        navigateTo('/login');
        return;
    }
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-gradient-to-r from-green-600 to-teal-700 text-white py-12">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2"><i class="fas fa-users mr-3"></i>Parent Portal</h1>
                <p class="text-xl">Student: ${currentUser.studentName}</p>
                <p class="text-sm">Student ID: ${currentUser.studentId}</p>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-16">
            <div id="parent-data" class="text-center mb-8">
                <i class="fas fa-spinner fa-spin text-4xl text-green-600"></i>
                <p class="mt-4">Loading student information...</p>
            </div>
            
            <div id="parent-content" class="hidden">
                <!-- Student Info Card -->
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 class="text-2xl font-bold text-green-600 mb-4">
                        <i class="fas fa-id-card mr-2"></i>Student Information
                    </h2>
                    <div id="student-info" class="grid md:grid-cols-2 gap-4">
                        <!-- Student info will load here -->
                    </div>
                </div>
                
                <!-- Academic Performance -->
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 class="text-2xl font-bold text-blue-600 mb-4">
                        <i class="fas fa-graduation-cap mr-2"></i>Academic Performance
                    </h2>
                    <div id="parent-marks" class="space-y-4">
                        <!-- Marks will load here -->
                    </div>
                </div>
                
                <!-- Discipline Record -->
                <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 class="text-2xl font-bold text-red-600 mb-4">
                        <i class="fas fa-clipboard-check mr-2"></i>Behavior & Conduct
                    </h2>
                    <div id="parent-conduct">
                        <!-- Conduct will load here -->
                    </div>
                </div>
                
                <!-- Payment Status -->
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-2xl font-bold text-green-600 mb-4">
                        <i class="fas fa-money-bill-wave mr-2"></i>Fee Payment Status
                    </h2>
                    <div id="parent-fees">
                        <!-- Fees will load here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load student data for parent
    const parentData = document.getElementById('parent-data');
    const parentContent = document.getElementById('parent-content');
    
    // Simulate loading student info
    setTimeout(() => {
        parentData.classList.add('hidden');
        parentContent.classList.remove('hidden');
        
        document.getElementById('student-info').innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Full Name</p>
                <p class="font-bold text-gray-800">${currentUser.studentName}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Student ID</p>
                <p class="font-bold text-gray-800">${currentUser.studentId}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Class</p>
                <p class="font-bold text-gray-800">L3 Software Development</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Status</p>
                <p class="font-bold text-green-600">Active</p>
            </div>
        `;
        
        document.getElementById('parent-marks').innerHTML = `
            <div class="grid md:grid-cols-3 gap-4">
                ${['Term 1', 'Term 2', 'Term 3'].map((term, i) => `
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-bold text-blue-600 mb-2">${term}</h4>
                        <p class="text-3xl font-bold text-gray-800">${85 + i * 2}%</p>
                        <p class="text-sm text-gray-600">Average Score</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('parent-conduct').innerHTML = `
            <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-600">Conduct Score</p>
                        <p class="text-4xl font-bold text-green-600">38 <span class="text-lg text-gray-500">/ 40</span></p>
                        <p class="text-sm text-gray-600 mt-2">Excellent behavior</p>
                    </div>
                    <i class="fas fa-check-circle text-6xl text-green-500"></i>
                </div>
            </div>
        `;
        
        document.getElementById('parent-fees').innerHTML = `
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Total Fees</p>
                    <p class="text-2xl font-bold text-gray-800">450,000 RWF</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Amount Paid</p>
                    <p class="text-2xl font-bold text-green-600">450,000 RWF</p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Balance</p>
                    <p class="text-2xl font-bold text-blue-600">0 RWF</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-check-circle text-4xl text-green-600 mb-2"></i>
                        <p class="font-bold text-green-600">Fully Paid</p>
                    </div>
                </div>
            </div>
        `;
    }, 1000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Application starting...');
    
    // Hide preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000);
    }
    
    // Setup mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Setup scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('hidden');
            } else {
                scrollTopBtn.classList.add('hidden');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Check authentication
    await checkAuth();
    
    // Setup router
    window.addEventListener('hashchange', router);
    router();
    
    console.log('✅ Application ready!');
});
