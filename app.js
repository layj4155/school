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
    getHeaders() {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    async get(endpoint) {
        try {
            showLoading();
            const response = await axios.get(`${API_URL}${endpoint}`, {
                headers: this.getHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (GET ${endpoint}):`, error);
            const errorData = error.response?.data;
            const errorMessage = errorData?.msg || errorData?.error || errorData?.message || error.message || 'Request failed';
            return { 
                success: false, 
                message: errorMessage,
                status: error.response?.status
            };
        } finally {
            hideLoading();
        }
    },

    async post(endpoint, data) {
        try {
            showLoading();
            const response = await axios.post(`${API_URL}${endpoint}`, data, {
                headers: this.getHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (POST ${endpoint}):`, error);
            const errorData = error.response?.data;
            const errorMessage = errorData?.msg || errorData?.error || errorData?.message || error.message || 'Request failed';
            return { 
                success: false, 
                message: errorMessage,
                status: error.response?.status
            };
        } finally {
            hideLoading();
        }
    },

    async put(endpoint, data) {
        try {
            showLoading();
            const response = await axios.put(`${API_URL}${endpoint}`, data, {
                headers: this.getHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (PUT ${endpoint}):`, error);
            const errorData = error.response?.data;
            const errorMessage = errorData?.msg || errorData?.error || errorData?.message || error.message || 'Request failed';
            return { 
                success: false, 
                message: errorMessage,
                status: error.response?.status
            };
        } finally {
            hideLoading();
        }
    },

    async delete(endpoint) {
        try {
            showLoading();
            const response = await axios.delete(`${API_URL}${endpoint}`, {
                headers: this.getHeaders()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error (DELETE ${endpoint}):`, error);
            const errorData = error.response?.data;
            const errorMessage = errorData?.msg || errorData?.error || errorData?.message || error.message || 'Request failed';
            return { 
                success: false, 
                message: errorMessage,
                status: error.response?.status
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
    '/subjects': renderSubjects,
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
    '/dod-faults': renderDODFaults,
    '/dod-deduct': renderDODDeduct,
    '/dod-alerts': renderDODAlerts,
    '/dod-publish': renderDODPublish,
    '/lib-books': renderLibBooks,
    '/lib-borrow': renderLibBorrow,
    '/lib-overdue': renderLibOverdue,
    '/lib-reports': renderLibReports,
    '/it-users': renderITUsers,
    '/it-news': renderITNews,
    '/it-announcements': renderITAnnouncements,
    '/it-employee-year': renderITEmployeeYear,
    '/it-page-content': renderITPageContent,
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

        <!-- Page Content from IT Management -->
        <div id="home-page-content" class="py-20 bg-gray-50"></div>
    `;
    
    // Load page content for Home
    try {
        const contentResult = await API.get('/it/page-content?page=Home&published=true');
        const contentDiv = document.getElementById('home-page-content');
        if (contentResult.success && contentResult.data.data && contentResult.data.data.length > 0) {
            contentDiv.innerHTML = `
                <div class="container mx-auto px-4">
                    ${contentResult.data.data.sort((a, b) => a.order - b.order).map(item => `
                        <div class="mb-12 bg-white p-8 rounded-lg shadow-lg">
                            <h3 class="text-3xl font-bold text-blue-600 mb-4">${item.title}</h3>
                            <div class="text-gray-700 leading-relaxed whitespace-pre-line mb-4">${item.content}</div>
                            ${item.images && item.images.length > 0 ? `
                                <div class="grid md:grid-cols-2 gap-4 mb-4">
                                    ${item.images.map(img => `<img src="${img}" alt="${item.title}" class="rounded-lg shadow">`).join('')}
                                </div>
                            ` : ''}
                            ${item.documents && item.documents.length > 0 ? `
                                <div class="mt-4">
                                    <p class="font-semibold mb-2">Documents:</p>
                                    ${item.documents.map(doc => `
                                        <a href="${doc}" target="_blank" class="text-blue-600 hover:underline block">
                                            <i class="fas fa-file mr-2"></i>View Document
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading home page content:', error);
    }
}

async function renderAbout() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="relative bg-cover bg-center h-96" style="background-image: url('WEB_1.JPG');">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>
            <div class="relative h-full flex items-center justify-center text-center text-white px-4">
                <div>
                    <h1 class="text-5xl font-bold mb-4">About Kageyo TSS</h1>
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
                        To be a leading TSS institution in Rwanda, recognized for producing skilled graduates.
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
                    Northern Province. Started with 377 students and has grown to become a leading TSS institution.
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

        <!-- Page Content from IT Management -->
        <div id="about-page-content" class="py-20 bg-gray-50"></div>
    `;
    
    // Load page content for About
    try {
        const contentResult = await API.get('/it/page-content?page=About&published=true');
        const contentDiv = document.getElementById('about-page-content');
        if (contentResult.success && contentResult.data.data && contentResult.data.data.length > 0) {
            contentDiv.innerHTML = `
                <div class="container mx-auto px-4">
                    ${contentResult.data.data.sort((a, b) => a.order - b.order).map(item => `
                        <div class="mb-12 bg-white p-8 rounded-lg shadow-lg">
                            <h3 class="text-3xl font-bold text-blue-600 mb-4">${item.title}</h3>
                            <div class="text-gray-700 leading-relaxed whitespace-pre-line mb-4">${item.content}</div>
                            ${item.images && item.images.length > 0 ? `
                                <div class="grid md:grid-cols-2 gap-4 mb-4">
                                    ${item.images.map(img => `<img src="${img}" alt="${item.title}" class="rounded-lg shadow">`).join('')}
                                </div>
                            ` : ''}
                            ${item.documents && item.documents.length > 0 ? `
                                <div class="mt-4">
                                    <p class="font-semibold mb-2">Documents:</p>
                                    ${item.documents.map(doc => `
                                        <a href="${doc}" target="_blank" class="text-blue-600 hover:underline block">
                                            <i class="fas fa-file mr-2"></i>View Document
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading about page content:', error);
    }
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
                    <img src="KTSSlogo.png" alt="Logo" class="w-20 h-20 mx-auto rounded-full mb-4">
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
                        <input type="text" id="student-id" required placeholder="e.g., 2025SOD001"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select id="student-class-select" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Your Class</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" id="student-firstname" required placeholder="e.g., MUNYANA"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="student-lastname" required placeholder="e.g., Celine"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div id="parent-fields" class="hidden space-y-4">
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
    
    // Load classes for student login
    loadClassesForStudentLogin();
    
    // Show/hide parent fields based on user type selection
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]');
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const parentFields = document.getElementById('parent-fields');
            const parentNameField = document.getElementById('parent-name');
            
            if (e.target.value === 'parent') {
                parentFields.classList.remove('hidden');
                parentNameField.required = true;
            } else {
                parentFields.classList.add('hidden');
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
        const studentId = document.getElementById('student-id').value.trim();
        const classId = document.getElementById('student-class-select').value;
        const firstName = document.getElementById('student-firstname').value.trim();
        const lastName = document.getElementById('student-lastname').value.trim();
        
        if (userType === 'parent') {
            const parentName = document.getElementById('parent-name').value.trim();
            
            // Parent login - verify all details match
            const result = await API.post('/students/parent-login', {
                studentId,
                classId,
                firstName,
                lastName,
                parentName
            });
            
            if (result.success && result.data.data) {
                showNotification('Welcome! Access granted.', 'success');
                currentUser = { role: 'Parent', studentId, studentName: `${firstName} ${lastName}`, studentData: result.data.data.student };
                navigateTo('/parent-portal');
            } else {
                console.error('Parent login failed:', result);
                showNotification(result.message || 'Invalid credentials. Please verify:\n- Student ID matches exactly\n- Class is correct\n- Names are spelled correctly\n- Parent name matches registration\n\nContact Dean of Studies if needed.', 'error');
            }
        } else {
            // Student login - verify ID, class, and names
            const result = await API.post('/students/student-login', {
                studentId,
                classId,
                firstName,
                lastName
            });
            
            if (result.success && result.data.data) {
                showNotification('Welcome back!', 'success');
                currentUser = { role: 'Student', studentId, studentName: `${firstName} ${lastName}`, studentData: result.data.data.student };
                navigateTo('/student-portal');
            } else {
                showNotification(result.message || 'Invalid Student ID or Name. Please contact the Dean of Studies if you believe this is an error.', 'error');
            }
        }
    });
    
    async function loadClassesForStudentLogin() {
        const classSelect = document.getElementById('student-class-select');
        const result = await API.get('/dos/classes');
        
        if (result.success && result.data.data) {
            classSelect.innerHTML = '<option value="">Select Your Class</option>' +
                result.data.data.map(cls => `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`).join('');
        }
    }
    
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
                    <img src="KTSSlogo.png" alt="Logo" class="w-20 h-20 mx-auto rounded-full mb-4">
                    <h2 class="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p class="text-gray-600">Join Kageyo TSS</p>
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
                        </select>
                        <p class="text-xs text-gray-500 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>Students & Parents don't need to register - login with your Student ID
                        </p>
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
                    <h3 class="text-2xl font-bold" id="dos-students"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-school text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-classes"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Classes</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chalkboard-teacher text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-teachers"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Teachers</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chart-line text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="dos-avg-performance"><i class="fas fa-spinner fa-spin"></i></h3>
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
    
    // Load DOS statistics
    loadDOSStats();
}

async function loadDOSStats() {
    const studentsCount = document.getElementById('dos-students');
    const classesCount = document.getElementById('dos-classes');
    const teachersCount = document.getElementById('dos-teachers');
    const avgPerformance = document.getElementById('dos-avg-performance');
    
    // Get students count
    const studentsResult = await API.get('/dos/students');
    if (studentsResult.success && studentsResult.data.data) {
        studentsCount.textContent = studentsResult.data.data.length || 0;
    } else {
        studentsCount.textContent = '0';
    }
    
    // Get classes count
    const classesResult = await API.get('/dos/classes');
    if (classesResult.success && classesResult.data.data) {
        classesCount.textContent = classesResult.data.data.length || 0;
    } else {
        classesCount.textContent = '0';
    }
    
    // Get teachers count
    const teachersResult = await API.get('/dos/teachers');
    if (teachersResult.success && teachersResult.data.data) {
        teachersCount.textContent = teachersResult.data.data.length || 0;
    } else {
        teachersCount.textContent = '0';
    }
    
    // Calculate average performance from published marks
    const marksResult = await API.get('/dos/marks');
    if (marksResult.success && marksResult.data.data) {
        const publishedMarks = marksResult.data.data.filter(mark => mark.published === true);
        if (publishedMarks.length > 0) {
            const totalMarks = publishedMarks.reduce((sum, mark) => sum + mark.marks, 0);
            const average = (totalMarks / publishedMarks.length).toFixed(1);
            avgPerformance.textContent = `${average}%`;
        } else {
            avgPerformance.textContent = 'N/A';
        }
    } else {
        avgPerformance.textContent = 'N/A';
    }
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
                    <h3 class="text-2xl font-bold" id="dod-students"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Total Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500">
                    <i class="fas fa-exclamation-triangle text-3xl text-yellow-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="low-conduct"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Low Conduct (&lt;20)</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-clipboard-list text-3xl text-red-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-faults"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Total Faults</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <button onclick="navigateTo('/dod-faults')" class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-clipboard-list text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Discipline Management</h3>
                    <p class="text-sm">Create faults and manage conduct (40 max)</p>
                </button>
                <button onclick="navigateTo('/dod-deduct')" class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-user-minus text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Reduce Conduct Marks</h3>
                    <p class="text-sm">Deduct marks for student faults</p>
                </button>
                <button onclick="navigateTo('/dod-alerts')" class="bg-yellow-600 text-white p-6 rounded-lg hover:bg-yellow-700 transition text-left">
                    <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Low Conduct Alert</h3>
                    <p class="text-sm">Students below 20 conduct marks</p>
                </button>
                <button onclick="navigateTo('/dod-publish')" class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-file-alt text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Publish Reports</h3>
                    <p class="text-sm">Send reports to DOS and SM</p>
                </button>
            </div>
        </div>
    `;
    
    // Load statistics
    loadDODStatistics();
}

async function loadDODStatistics() {
    const studentsCount = document.getElementById('dod-students');
    const lowConductCount = document.getElementById('low-conduct');
    const faultsCount = document.getElementById('total-faults');
    
    // Get conduct statistics
    const statsResult = await API.get('/dod/conducts/statistics');
    
    if (statsResult.success && statsResult.data.data) {
        const stats = statsResult.data.data;
        
        // Total students with conduct records
        studentsCount.textContent = stats.totalStudents || 0;
        
        // Low conduct (<20)
        const criticalStatus = stats.statusCounts.find(s => s._id === 'Critical');
        lowConductCount.textContent = criticalStatus ? criticalStatus.count : 0;
    } else {
        studentsCount.textContent = '0';
        lowConductCount.textContent = '0';
    }
    
    // Get total faults
    const faultsResult = await API.get('/dod/faults');
    if (faultsResult.success && faultsResult.data.data) {
        faultsCount.textContent = faultsResult.data.data.length;
    } else {
        faultsCount.textContent = '0';
    }
}

// IT Dashboard
async function renderITDashboard() {
    const mainContent = document.getElementById('main-content');
    
    // Load statistics
    const [usersResult, studentsResult, teachersResult] = await Promise.all([
        API.get('/it/users').catch(() => ({ success: false, data: { count: 0 } })),
        API.get('/dos/students').catch(() => ({ success: false, data: { count: 0 } })),
        API.get('/dos/teachers').catch(() => ({ success: false, data: { count: 0 } }))
    ]);
    
    const totalUsers = usersResult.success ? usersResult.data.count || usersResult.data.data?.length || 0 : 0;
    const totalStudents = studentsResult.success ? studentsResult.data.count || studentsResult.data.data?.length || 0 : 0;
    const totalTeachers = teachersResult.success ? teachersResult.data.count || teachersResult.data.data?.length || 0 : 0;
    const totalStaff = totalUsers - totalStudents - totalTeachers;
    
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
                    <h3 class="text-2xl font-bold">${totalUsers}</h3>
                    <p class="text-gray-600">Total Users</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-user-graduate text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">${totalStudents}</h3>
                    <p class="text-gray-600">Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-user-tie text-3xl text-purple-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">${totalStaff}</h3>
                    <p class="text-gray-600">Staff</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-chalkboard-teacher text-3xl text-orange-600 mb-3"></i>
                    <h3 class="text-2xl font-bold">${totalTeachers}</h3>
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
                <button onclick="navigateTo('/it-users')" class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-users-cog text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Manage Accounts</h3>
                    <p class="text-sm">Manage all user accounts</p>
                </button>
                <button onclick="navigateTo('/it-news')" class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
                    <i class="fas fa-newspaper text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Create News</h3>
                    <p class="text-sm">Create and publish news</p>
                </button>
                <button onclick="navigateTo('/it-announcements')" class="bg-yellow-600 text-white p-6 rounded-lg hover:bg-yellow-700 transition text-left">
                    <i class="fas fa-bullhorn text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Create Announcements</h3>
                    <p class="text-sm">Create announcements for users</p>
                </button>
                <button onclick="navigateTo('/it-employee-year')" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-trophy text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Employee of Year</h3>
                    <p class="text-sm">Add employee of the year</p>
                </button>
                <button onclick="navigateTo('/trainers')" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-user-tie text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Manage Trainers</h3>
                    <p class="text-sm">Add/edit trainers</p>
                </button>
                <button onclick="navigateTo('/it-page-content')" class="bg-teal-600 text-white p-6 rounded-lg hover:bg-teal-700 transition text-left">
                    <i class="fas fa-file-alt text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Page Content</h3>
                    <p class="text-sm">Manage website page content</p>
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
                <button onclick="navigateTo('/lib-books')" class="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-plus-circle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Book Management</h3>
                    <p class="text-sm">Add and manage library books</p>
                </button>
                <button onclick="navigateTo('/lib-borrow')" class="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-hand-holding text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Borrow/Return</h3>
                    <p class="text-sm">Manage borrowing and returns</p>
                </button>
                <button onclick="navigateTo('/lib-overdue')" class="bg-red-600 text-white p-6 rounded-lg hover:bg-red-700 transition text-left">
                    <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Overdue Tracking</h3>
                    <p class="text-sm">Monitor overdue books</p>
                </button>
                <button onclick="navigateTo('/lib-reports')" class="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
                    <i class="fas fa-chart-pie text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Library Reports</h3>
                    <p class="text-sm">View comprehensive statistics</p>
                </button>
                <button onclick="navigateTo('/lib-reports')" class="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-left">
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
                    <h3 class="text-2xl font-bold" id="assigned-classes-count"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Assigned Classes</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-users text-3xl text-blue-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="total-students-count"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Total Students</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <i class="fas fa-clipboard-check text-3xl text-green-600 mb-3"></i>
                    <h3 class="text-2xl font-bold" id="marks-recorded-count"><i class="fas fa-spinner fa-spin"></i></h3>
                    <p class="text-gray-600">Marks Recorded</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <button onclick="navigateTo('/subjects')" class="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition text-left">
                    <i class="fas fa-book-open text-3xl mb-3"></i>
                    <h3 class="text-xl font-bold mb-2">Subject Management</h3>
                    <p class="text-sm">Create and manage subjects</p>
                </button>
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
    
    // Fetch and display real data
    if (currentUser) {
        const userId = currentUser._id || currentUser.id;
        // Get teacher's assigned classes
        const classesResult = await API.get(`/dos/my-classes/${userId}`);
        const assignedClassesCount = document.getElementById('assigned-classes-count');
        const totalStudentsCount = document.getElementById('total-students-count');
        const marksRecordedCount = document.getElementById('marks-recorded-count');
        
        if (classesResult.success && classesResult.data.data) {
            const classes = classesResult.data.data;
            const classCount = classes.length;
            
            // Calculate total students
            let totalStudents = 0;
            const classIds = [];
            classes.forEach(cls => {
                totalStudents += cls.students?.length || 0;
                classIds.push(cls._id);
            });
            
            assignedClassesCount.textContent = classCount;
            totalStudentsCount.textContent = totalStudents;
            
            // Get marks recorded by this teacher
            const marksResult = await API.get('/dos/marks');
            if (marksResult.success && marksResult.data.data) {
                const teacherMarks = marksResult.data.data.filter(mark => 
                    mark.createdBy === userId || classIds.includes(mark.class?._id || mark.class)
                );
                marksRecordedCount.textContent = teacherMarks.length;
            } else {
                marksRecordedCount.textContent = 0;
            }
        } else {
            assignedClassesCount.textContent = 0;
            totalStudentsCount.textContent = 0;
            marksRecordedCount.textContent = 0;
        }
    }
}

async function renderStudents() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Student Management</h1>
            <button onclick="showRegisterStudentModal()" class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-user-plus mr-2"></i>Register New Student
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="students-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading students...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/dos/students');
    const studentsList = document.getElementById('students-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            studentsList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No students found. Register your first student!</p>
                </div>
            `;
        } else {
            studentsList.innerHTML = `
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-blue-600 text-white">
                            <tr>
                                <th class="px-6 py-3 text-left">Student ID</th>
                                <th class="px-6 py-3 text-left">Name</th>
                                <th class="px-6 py-3 text-left">Gender</th>
                                <th class="px-6 py-3 text-left">Age</th>
                                <th class="px-6 py-3 text-left">Class</th>
                                <th class="px-6 py-3 text-left">Parent</th>
                                <th class="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${result.data.data.map(student => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 font-mono text-sm">${student.studentID}</td>
                                    <td class="px-6 py-4">${student.firstName} ${student.lastName}</td>
                                    <td class="px-6 py-4">${student.gender}</td>
                                    <td class="px-6 py-4">${student.age || 'N/A'}</td>
                                    <td class="px-6 py-4">${student.class?.classID || 'N/A'}</td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm">
                                            <div>${student.parentName}</div>
                                            <div class="text-gray-500">${student.parentPhone}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <button onclick="viewStudent('${student._id}')" class="text-blue-600 hover:text-blue-800 mr-3">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button onclick="editStudent('${student._id}')" class="text-green-600 hover:text-green-800 mr-3">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteStudent('${student._id}')" class="text-red-600 hover:text-red-800">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } else {
        studentsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load students. ${result.message}</p>
            </div>
        `;
    }
}

// Register Student Modal
window.showRegisterStudentModal = async function() {
    const classesResult = await API.get('/dos/classes');
    const locationsResult = await API.get('/locations/all');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-blue-600 sticky top-0 bg-white pb-4 border-b">Register New Student</h2>
            <form id="register-student-form" class="space-y-6">
                <!-- Personal Information -->
                <div class="border-b pb-4">
                    <h3 class="text-lg font-bold text-gray-700 mb-4">Personal Information</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">First Name *</label>
                            <input type="text" name="firstName" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Last Name *</label>
                            <input type="text" name="lastName" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Gender *</label>
                            <select name="gender" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Date of Birth *</label>
                            <input type="date" name="dateOfBirth" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Class *</label>
                            <select name="classId" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Class</option>
                                ${classesResult.success ? classesResult.data.data.map(cls => 
                                    `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`
                                ).join('') : ''}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Parent/Guardian Information -->
                <div class="border-b pb-4">
                    <h3 class="text-lg font-bold text-gray-700 mb-4">Parent/Guardian Information</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Parent/Guardian Name *</label>
                            <input type="text" name="parentName" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Phone Number *</label>
                            <input type="tel" name="parentPhone" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0788123456">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Relationship *</label>
                            <select name="relationship" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Relationship</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Email (Optional)</label>
                            <input type="email" name="parentEmail" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Address Information -->
                <div class="border-b pb-4">
                    <h3 class="text-lg font-bold text-gray-700 mb-4">Address Information</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Province *</label>
                            <select name="province" required id="province-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onchange="loadDistricts(this.value)">
                                <option value="">Select Province</option>
                                ${locationsResult.success ? Object.keys(locationsResult.data.data).map(province => 
                                    `<option value="${province}">${province}</option>`
                                ).join('') : ''}
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">District *</label>
                            <select name="district" required id="district-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select District</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Sector *</label>
                            <input type="text" name="sector" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Cell *</label>
                            <input type="text" name="cell" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Village *</label>
                            <input type="text" name="village" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                        <i class="fas fa-user-plus mr-2"></i>Register Student
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Store locations data globally for district loading
    window.locationsData = locationsResult.success ? locationsResult.data.data : {};

    window.loadDistricts = function(province) {
        const districtSelect = document.getElementById('district-select');
        districtSelect.innerHTML = '<option value="">Select District</option>';
        
        if (province && window.locationsData[province]) {
            const districts = window.locationsData[province].districts;
            districtSelect.innerHTML += districts.map(d => `<option value="${d}">${d}</option>`).join('');
        }
    };

    document.getElementById('register-student-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            gender: formData.get('gender'),
            dateOfBirth: formData.get('dateOfBirth'),
            classId: formData.get('classId'),
            parentName: formData.get('parentName'),
            parentPhone: formData.get('parentPhone'),
            relationship: formData.get('relationship'),
            parentEmail: formData.get('parentEmail'),
            address: {
                province: formData.get('province'),
                district: formData.get('district'),
                sector: formData.get('sector'),
                cell: formData.get('cell'),
                village: formData.get('village')
            }
        };
        
        const result = await API.post('/dos/students', data);
        
        if (result.success) {
            showNotification(`Student registered successfully! Student ID: ${result.data.data.studentID}`, 'success');
            modal.remove();
            renderStudents();
        } else {
            showNotification('Failed to register student: ' + result.message, 'error');
        }
    });
}

// View Student Details
window.viewStudent = async function(studentId) {
    try {
        const result = await API.get(`/dos/students/${studentId}`);
        
        if (!result.success) {
            showNotification('Failed to load student details: ' + result.message, 'error');
            return;
        }
        
        const student = result.data.data;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-blue-600">Student Details</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="space-y-6">
                    <!-- Personal Information -->
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Personal Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Student ID</label>
                                <p class="text-gray-800 font-mono">${student.studentID || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Name</label>
                                <p class="text-gray-800">${student.firstName} ${student.lastName}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Gender</label>
                                <p class="text-gray-800">${student.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Date of Birth</label>
                                <p class="text-gray-800">${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Age</label>
                                <p class="text-gray-800">${student.age || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Class</label>
                                <p class="text-gray-800">${student.class?.classID || 'N/A'} - ${student.class?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Parent/Guardian Information -->
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Parent/Guardian Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Name</label>
                                <p class="text-gray-800">${student.parentName || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Phone</label>
                                <p class="text-gray-800">${student.parentPhone || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Relationship</label>
                                <p class="text-gray-800">${student.relationship || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Email</label>
                                <p class="text-gray-800">${student.parentEmail || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Address Information -->
                    ${student.address ? `
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Address Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Province</label>
                                <p class="text-gray-800">${student.address.province || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">District</label>
                                <p class="text-gray-800">${student.address.district || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Sector</label>
                                <p class="text-gray-800">${student.address.sector || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Cell</label>
                                <p class="text-gray-800">${student.address.cell || 'N/A'}</p>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-sm font-semibold mb-1">Village</label>
                                <p class="text-gray-800">${student.address.village || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="mt-6 flex gap-4">
                    <button onclick="editStudent('${studentId}'); this.closest('.fixed').remove();" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold">
                        <i class="fas fa-edit mr-2"></i>Edit Student
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        showNotification('Error loading student details: ' + error.message, 'error');
    }
}

// Edit Student
window.editStudent = async function(studentId) {
    try {
        const [studentResult, classesResult, locationsResult] = await Promise.all([
            API.get(`/dos/students/${studentId}`),
            API.get('/dos/classes'),
            API.get('/locations/all')
        ]);
        
        if (!studentResult.success) {
            showNotification('Failed to load student: ' + studentResult.message, 'error');
            return;
        }
        
        const student = studentResult.data.data;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
                <h2 class="text-2xl font-bold mb-6 text-blue-600 sticky top-0 bg-white pb-4 border-b">Edit Student</h2>
                <form id="edit-student-form" class="space-y-6">
                    <!-- Personal Information -->
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Personal Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Student ID</label>
                                <input type="text" value="${student.studentID}" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">First Name *</label>
                                <input type="text" name="firstName" value="${student.firstName}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Last Name *</label>
                                <input type="text" name="lastName" value="${student.lastName}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Gender *</label>
                                <select name="gender" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Gender</option>
                                    <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Date of Birth *</label>
                                <input type="date" name="dateOfBirth" value="${student.dateOfBirth ? student.dateOfBirth.split('T')[0] : ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Class *</label>
                                <select name="classId" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Class</option>
                                    ${classesResult.success ? classesResult.data.data.map(cls => 
                                        `<option value="${cls._id}" ${student.class?._id?.toString() === cls._id.toString() ? 'selected' : ''}>${cls.classID} - ${cls.name}</option>`
                                    ).join('') : ''}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Parent/Guardian Information -->
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Parent/Guardian Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Parent/Guardian Name *</label>
                                <input type="text" name="parentName" value="${student.parentName || ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Phone Number *</label>
                                <input type="tel" name="parentPhone" value="${student.parentPhone || ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0788123456">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Relationship *</label>
                                <select name="relationship" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Relationship</option>
                                    <option value="Father" ${student.relationship === 'Father' ? 'selected' : ''}>Father</option>
                                    <option value="Mother" ${student.relationship === 'Mother' ? 'selected' : ''}>Mother</option>
                                    <option value="Guardian" ${student.relationship === 'Guardian' ? 'selected' : ''}>Guardian</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Email (Optional)</label>
                                <input type="email" name="parentEmail" value="${student.parentEmail || ''}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                    </div>

                    <!-- Address Information -->
                    <div class="border-b pb-4">
                        <h3 class="text-lg font-bold text-gray-700 mb-4">Address Information</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Province *</label>
                                <select name="province" required id="edit-province-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onchange="loadEditDistricts(this.value)">
                                    <option value="">Select Province</option>
                                    ${locationsResult.success ? Object.keys(locationsResult.data.data).map(province => 
                                        `<option value="${province}" ${student.address?.province === province ? 'selected' : ''}>${province}</option>`
                                    ).join('') : ''}
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">District *</label>
                                <select name="district" required id="edit-district-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select District</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Sector *</label>
                                <input type="text" name="sector" value="${student.address?.sector || ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Cell *</label>
                                <input type="text" name="cell" value="${student.address?.cell || ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Village *</label>
                                <input type="text" name="village" value="${student.address?.village || ''}" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                            <i class="fas fa-save mr-2"></i>Update Student
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Store locations data globally for district loading
        window.locationsData = locationsResult.success ? locationsResult.data.data : {};
        
        // Load districts if province is already selected
        if (student.address?.province) {
            setTimeout(() => {
                loadEditDistricts(student.address.province, student.address.district);
            }, 100);
        }

        window.loadEditDistricts = function(province, selectedDistrict = '') {
            const districtSelect = document.getElementById('edit-district-select');
            districtSelect.innerHTML = '<option value="">Select District</option>';
            
            if (province && window.locationsData[province]) {
                const districts = window.locationsData[province].districts;
                districtSelect.innerHTML += districts.map(d => 
                    `<option value="${d}" ${d === selectedDistrict ? 'selected' : ''}>${d}</option>`
                ).join('');
            }
        };

        document.getElementById('edit-student-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                gender: formData.get('gender'),
                dateOfBirth: formData.get('dateOfBirth'),
                classId: formData.get('classId'),
                parentName: formData.get('parentName'),
                parentPhone: formData.get('parentPhone'),
                relationship: formData.get('relationship'),
                parentEmail: formData.get('parentEmail'),
                address: {
                    province: formData.get('province'),
                    district: formData.get('district'),
                    sector: formData.get('sector'),
                    cell: formData.get('cell'),
                    village: formData.get('village')
                }
            };
            
            const result = await API.put(`/dos/students/${studentId}`, data);
            
            if (result.success) {
                showNotification('Student updated successfully!', 'success');
                modal.remove();
                renderStudents();
            } else {
                showNotification('Failed to update student: ' + result.message, 'error');
            }
        });
    } catch (error) {
        showNotification('Error loading student: ' + error.message, 'error');
    }
}

// Delete Student
window.deleteStudent = async function(studentId) {
    try {
        // First get student details for confirmation
        const studentResult = await API.get(`/dos/students/${studentId}`);
        
        if (!studentResult.success) {
            showNotification('Failed to load student: ' + studentResult.message, 'error');
            return;
        }
        
        const student = studentResult.data.data;
        const studentName = `${student.firstName} ${student.lastName}`;
        const studentID = student.studentID;
        
        if (!confirm(`Are you sure you want to delete student "${studentName}" (${studentID})?\n\nThis action cannot be undone and will remove all associated data.`)) {
            return;
        }
        
        const result = await API.delete(`/dos/students/${studentId}`);
        
        if (result.success) {
            showNotification(`Student "${studentName}" deleted successfully`, 'success');
            renderStudents();
        } else {
            showNotification('Failed to delete student: ' + result.message, 'error');
        }
    } catch (error) {
        showNotification('Error deleting student: ' + error.message, 'error');
    }
}

async function renderMarks() {
    const mainContent = document.getElementById('main-content');
    const isTeacher = currentUser && currentUser.role === 'Teacher';
    const isDOS = currentUser && currentUser.role === 'DOS';
    
    mainContent.innerHTML = `
        <div class="bg-purple-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Marks Management</h1>
            <div class="flex gap-4 justify-center mt-4">
                <button onclick="showAddMarksModal()" class="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                    <i class="fas fa-plus mr-2"></i>Add Marks
                </button>
                ${isDOS ? `<button onclick="showPublishMarksModal()" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                    <i class="fas fa-paper-plane mr-2"></i>Publish Marks
                </button>` : ''}
            </div>
        </div>
        <div class="container mx-auto px-4 py-16">
            <!-- Filter Section -->
            <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 class="text-xl font-bold mb-4 text-purple-600">Filter Marks</h3>
                <div class="grid md:grid-cols-4 gap-4">
                    <select id="filter-class" class="px-4 py-2 border rounded-lg">
                        <option value="">All Classes</option>
                    </select>
                    <select id="filter-term" class="px-4 py-2 border rounded-lg">
                        <option value="">All Terms</option>
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                    </select>
                    <select id="filter-assessment" class="px-4 py-2 border rounded-lg">
                        <option value="">All Assessment Types</option>
                        <option value="Midterm Exam">Midterm Exam</option>
                        <option value="Formative Assessment">Formative Assessment</option>
                        <option value="End of Unity">End of Unity</option>
                        <option value="Summative Exam">Summative Exam</option>
                        <option value="Integrated Assessment">Integrated Assessment</option>
                        <option value="Final Exam">Final Exam</option>
                    </select>
                    <button onclick="filterMarks()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                        <i class="fas fa-filter mr-2"></i>Filter
                    </button>
                </div>
            </div>

            <div id="marks-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4">Loading marks...</p>
            </div>
        </div>
    `;
    
    // Load classes for filter (teacher's classes only if teacher)
    let classEndpoint = '/dos/classes';
    if (isTeacher && currentUser) {
        const userId = currentUser._id || currentUser.id;
        classEndpoint = `/dos/my-classes/${userId}`;
    }
    
    const classesResult = await API.get(classEndpoint);
    if (classesResult.success) {
        const filterClass = document.getElementById('filter-class');
        filterClass.innerHTML = '<option value="">All Classes</option>' + 
            classesResult.data.data.map(cls => `<option value="${cls._id}">${cls.classID}</option>`).join('');
    }
    
    loadMarks();
}

async function loadMarks(classId = '', term = '', assessmentType = '') {
    const marksList = document.getElementById('marks-list');
    if (!marksList) return;

    marksList.innerHTML = `
        <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
        <p class="mt-4">Loading marks...</p>
    `;

    // Fetch all marks
    const result = await API.get('/dos/marks');
    
    if (!result.success || !result.data.data) {
        marksList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load marks</p>
            </div>
        `;
        return;
    }
    
    let marks = result.data.data;
    
    // Apply filters
    if (classId) {
        marks = marks.filter(mark => mark.class && (mark.class._id === classId || mark.class === classId));
    }
    if (term) {
        marks = marks.filter(mark => mark.term === term);
    }
    if (assessmentType) {
        marks = marks.filter(mark => mark.assessmentType === assessmentType);
    }
    
    if (marks.length === 0) {
        marksList.innerHTML = `
            <div class="text-gray-600">
                <i class="fas fa-info-circle text-4xl mb-4"></i>
                <p class="text-lg">No marks found matching your filters</p>
                <p class="text-sm text-gray-500 mt-2">Try adjusting the filters or add new marks</p>
            </div>
        `;
        return;
    }
    
    // Group marks by class and subject
    const groupedMarks = {};
    marks.forEach(mark => {
        const classKey = mark.class?.classID || 'Unknown Class';
        if (!groupedMarks[classKey]) {
            groupedMarks[classKey] = {};
        }
        const subjectKey = mark.subject || 'Unknown Subject';
        if (!groupedMarks[classKey][subjectKey]) {
            groupedMarks[classKey][subjectKey] = [];
        }
        groupedMarks[classKey][subjectKey].push(mark);
    });
    
    marksList.innerHTML = `
        <div class="space-y-6">
            ${Object.entries(groupedMarks).map(([className, subjects]) => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-purple-600 text-white px-6 py-3">
                        <h3 class="text-xl font-bold">${className}</h3>
                    </div>
                    <div class="p-6 space-y-4">
                        ${Object.entries(subjects).map(([subjectName, subjectMarks]) => `
                            <div class="border-l-4 border-purple-500 pl-4">
                                <h4 class="font-bold text-lg text-gray-800 mb-3">${subjectName}</h4>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student</th>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Term</th>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Assessment</th>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Score</th>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                                                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200">
                                            ${subjectMarks.map(mark => `
                                                <tr class="hover:bg-gray-50">
                                                    <td class="px-4 py-2 text-sm">
                                                        ${mark.student?.firstName || 'N/A'} ${mark.student?.lastName || ''}
                                                        <div class="text-xs text-gray-500">${mark.student?.studentID || ''}</div>
                                                    </td>
                                                    <td class="px-4 py-2 text-sm">${mark.term}</td>
                                                    <td class="px-4 py-2 text-sm">${mark.assessmentType}</td>
                                                    <td class="px-4 py-2">
                                                        <span class="text-lg font-bold ${mark.marks >= 70 ? 'text-green-600' : mark.marks >= 50 ? 'text-yellow-600' : 'text-red-600'}">
                                                            ${mark.marks}%
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-2">
                                                        <span class="px-2 py-1 text-xs font-semibold rounded ${mark.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                                            ${mark.published ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-2">
                                                        <button onclick="deleteMark('${mark._id}')" class="text-red-600 hover:text-red-800 text-sm">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold text-blue-800">Total Marks: ${marks.length}</p>
                    <p class="text-sm text-blue-700">Published: ${marks.filter(m => m.published).length} | Draft: ${marks.filter(m => !m.published).length}</p>
                </div>
            </div>
        </div>
    `;
}

window.deleteMark = async function(markId) {
    if (!confirm('Are you sure you want to delete this mark?')) return;
    
    const result = await API.delete(`/dos/marks/${markId}`);
    if (result.success) {
        showNotification('Mark deleted successfully', 'success');
        const classId = document.getElementById('filter-class').value;
        const term = document.getElementById('filter-term').value;
        const assessment = document.getElementById('filter-assessment').value;
        loadMarks(classId, term, assessment);
    } else {
        showNotification('Failed to delete mark', 'error');
    }
}

window.filterMarks = function() {
    const classId = document.getElementById('filter-class').value;
    const term = document.getElementById('filter-term').value;
    const assessment = document.getElementById('filter-assessment').value;
    loadMarks(classId, term, assessment);
};

window.showAddMarksModal = async function() {
    const isTeacher = currentUser && currentUser.role === 'Teacher';
    let classEndpoint = '/dos/classes';
    if (isTeacher && currentUser) {
        const userId = currentUser._id || currentUser.id;
        classEndpoint = `/dos/my-classes/${userId}`;
    }
    
    const classesResult = await API.get(classEndpoint);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8">
            <h2 class="text-2xl font-bold mb-6 text-purple-600">Add Marks</h2>
            <form id="add-marks-form">
                <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Class *</label>
                        <select name="classId" required id="marks-class-select" class="w-full px-4 py-2 border rounded-lg" onchange="loadClassSubjects(this.value)">
                            <option value="">Select Class</option>
                            ${classesResult.success ? classesResult.data.data.map(cls => 
                                `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Subject *</label>
                        <select name="subject" required id="marks-subject-select" class="w-full px-4 py-2 border rounded-lg" disabled onchange="loadStudentsForSubject()">
                            <option value="">Select Subject</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Assessment Type *</label>
                        <select name="assessmentType" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Type</option>
                            <option value="Midterm Exam">Midterm Exam</option>
                            <option value="Formative Assessment">Formative Assessment</option>
                            <option value="End of Unity">End of Unity</option>
                            <option value="Summative Exam">Summative Exam</option>
                            <option value="Integrated Assessment">Integrated Assessment</option>
                            <option value="Final Exam">Final Exam</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg" value="2024-2025">
                    </div>
                </div>

                <div id="students-marks-container" class="mb-6">
                    <p class="text-gray-500 text-center">Select a class and subject to add marks</p>
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Save Marks
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    let currentClassStudents = [];

    window.loadClassSubjects = async function(classId) {
        const subjectSelect = document.getElementById('marks-subject-select');
        const container = document.getElementById('students-marks-container');
        
        if (!classId) {
            subjectSelect.disabled = true;
            subjectSelect.innerHTML = '<option value="">Select Subject</option>';
            container.innerHTML = '<p class="text-gray-500 text-center">Select a class and subject to add marks</p>';
            return;
        }

        // Load subjects for the class
        const subjectsResult = await API.get(`/dos/subjects?class=${classId}`);
        const subjects = subjectsResult.success ? subjectsResult.data.data : [];

        if (subjects.length === 0) {
            subjectSelect.disabled = true;
            subjectSelect.innerHTML = '<option value="">No subjects available</option>';
            container.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <i class="fas fa-exclamation-triangle text-yellow-600 text-3xl mb-2"></i>
                    <p class="text-yellow-800 font-bold mb-2">No subjects found for this class</p>
                    <p class="text-yellow-700 mb-3">Please create subjects first before adding marks.</p>
                    <button onclick="navigateTo('/subjects')" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                        <i class="fas fa-plus mr-2"></i>Create Subjects
                    </button>
                </div>
            `;
            return;
        }

        // Populate subject dropdown
        subjectSelect.disabled = false;
        subjectSelect.innerHTML = '<option value="">Select Subject</option>' + 
            subjects.map(subj => `<option value="${subj.name}">${subj.name}${subj.code ? ' (' + subj.code + ')' : ''}</option>`).join('');
        
        // Load students for the class
        const studentsResult = await API.get(`/dos/students/class/${classId}`);
        if (studentsResult.success && studentsResult.data.data) {
            currentClassStudents = studentsResult.data.data;
        }
        
        container.innerHTML = '<p class="text-gray-500 text-center">Select a subject to continue</p>';
    };

    window.loadStudentsForSubject = function() {
        const container = document.getElementById('students-marks-container');
        const subjectName = document.getElementById('marks-subject-select').value;
        
        if (!subjectName || currentClassStudents.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">Select a subject to continue</p>';
            return;
        }

        container.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Enter Marks for ${subjectName}</h3>
            <div class="max-h-96 overflow-y-auto space-y-3">
                ${currentClassStudents.map((student, index) => `
                    <div class="border p-4 rounded-lg flex items-center justify-between">
                        <div class="flex-1">
                            <p class="font-bold">${student.firstName} ${student.lastName}</p>
                            <p class="text-sm text-gray-500">${student.studentID}</p>
                        </div>
                        <div class="w-32">
                            <input type="hidden" name="students[${index}][studentId]" value="${student._id}">
                            <input type="number" name="students[${index}][score]" required min="0" max="100" 
                                class="w-full px-3 py-2 border rounded text-sm" placeholder="Score">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    document.getElementById('add-marks-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const subject = formData.get('subject');
        const marks = [];
        let index = 0;
        while (formData.get(`students[${index}][studentId]`)) {
            const score = formData.get(`students[${index}][score]`);
            if (score !== null && score !== '') {
                marks.push({
                    studentId: formData.get(`students[${index}][studentId]`),
                    subject: subject,
                    score: parseFloat(score)
                });
            }
            index++;
        }

        const data = {
            classId: formData.get('classId'),
            assessmentType: formData.get('assessmentType'),
            term: formData.get('term'),
            academicYear: formData.get('academicYear'),
            marks
        };
        
        const result = await API.post('/dos/marks', data);
        
        if (result.success) {
            showNotification(`Marks added successfully for ${result.data.count} students!`, 'success');
            modal.remove();
            // Reload marks with current filters
            const classId = document.getElementById('filter-class')?.value || '';
            const term = document.getElementById('filter-term')?.value || '';
            const assessment = document.getElementById('filter-assessment')?.value || '';
            loadMarks(classId, term, assessment);
        } else {
            showNotification('Failed to add marks: ' + result.message, 'error');
        }
    });
};

window.showPublishMarksModal = async function() {
    const classesResult = await API.get('/dos/classes');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-green-600">Publish Marks</h2>
            <p class="text-gray-600 mb-6">Publishing marks will make them visible to students and parents.</p>
            <form id="publish-marks-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Class *</label>
                        <select name="classId" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Class</option>
                            ${classesResult.success ? classesResult.data.data.map(cls => 
                                `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Assessment Type *</label>
                        <select name="assessmentType" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Type</option>
                            <option value="Midterm Exam">Midterm Exam</option>
                            <option value="Formative Assessment">Formative Assessment</option>
                            <option value="End of Unity">End of Unity</option>
                            <option value="Summative Exam">Summative Exam</option>
                            <option value="Integrated Assessment">Integrated Assessment</option>
                            <option value="Final Exam">Final Exam</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg" value="2024-2025">
                    </div>
                </div>

                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold">
                        <i class="fas fa-paper-plane mr-2"></i>Publish
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('publish-marks-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/dos/marks/publish', data);
        
        if (result.success) {
            showNotification('Marks published successfully!', 'success');
            modal.remove();
            renderMarks();
        } else {
            showNotification('Failed to publish marks: ' + result.message, 'error');
        }
    });
};

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
            <h1 class="text-4xl font-bold mb-4">Discipline Reports (From DOD)</h1>
            <p class="text-xl">View discipline reports published by Director of Discipline</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 class="text-xl font-bold mb-4 text-red-600">Filter Reports</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <select id="disc-term" class="px-4 py-2 border rounded-lg">
                        <option value="">All Terms</option>
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                    </select>
                    <select id="disc-student" class="px-4 py-2 border rounded-lg">
                        <option value="">All Students</option>
                    </select>
                    <button onclick="loadDisciplineReports()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                        <i class="fas fa-search mr-2"></i>Search
                    </button>
                </div>
            </div>

            <div id="discipline-reports" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-red-600"></i>
                <p class="mt-4">Loading discipline reports...</p>
            </div>
        </div>
    `;
    
    loadDisciplineReports();
}

window.loadDisciplineReports = async function() {
    const term = document.getElementById('disc-term')?.value || '';
    const studentId = document.getElementById('disc-student')?.value || '';
    const reportsContainer = document.getElementById('discipline-reports');

    if (!reportsContainer) return;

    reportsContainer.innerHTML = `
        <i class="fas fa-spinner fa-spin text-4xl text-red-600"></i>
        <p class="mt-4">Loading discipline reports...</p>
    `;

    let query = '';
    if (term) query += `?term=${term}`;
    if (studentId) query += (query ? '&' : '?') + `studentId=${studentId}`;

    const result = await API.get(`/dod/published${query}`);

    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            reportsContainer.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No discipline reports found</p>
                </div>
            `;
        } else {
            reportsContainer.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(report => `
                        <div class="bg-white rounded-lg shadow-lg p-6 text-left">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h3 class="text-xl font-bold text-red-600">${report.student?.firstName} ${report.student?.lastName}</h3>
                                    <p class="text-sm text-gray-500">${report.student?.studentID}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-3xl font-bold ${report.conductScore >= 30 ? 'text-green-600' : report.conductScore >= 20 ? 'text-yellow-600' : 'text-red-600'}">${report.conductScore}/40</p>
                                    <p class="text-xs text-gray-500">${report.term}</p>
                                </div>
                            </div>
                            <div class="border-t pt-4">
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Total Deductions:</span>
                                    <span class="font-bold">${report.totalReductions}</span>
                                </div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Published:</span>
                                    <span class="text-sm">${new Date(report.publishedAt).toLocaleDateString()}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Status:</span>
                                    <span class="font-bold ${report.conductScore >= 30 ? 'text-green-600' : report.conductScore >= 20 ? 'text-yellow-600' : 'text-red-600'}">
                                        ${report.conductScore >= 30 ? 'Good' : report.conductScore >= 20 ? 'Warning' : 'Critical'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        reportsContainer.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load discipline reports</p>
            </div>
        `;
    }
};

async function renderPerformance() {
    const mainContent = document.getElementById('main-content');
    const isDOS = currentUser && currentUser.role === 'DOS';
    
    mainContent.innerHTML = `
        <div class="bg-orange-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Performance Analytics</h1>
            ${isDOS ? `<button onclick="showPublishBestPerformersModal()" class="bg-white text-orange-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-trophy mr-2"></i>Publish Best Performers
            </button>` : ''}
        </div>
        <div class="container mx-auto px-4 py-16">
            <!-- Filter Section -->
            <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 class="text-xl font-bold mb-4 text-orange-600">View Performance</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <select id="perf-type" class="px-4 py-2 border rounded-lg">
                        <option value="school">School Performance</option>
                        <option value="class">Class Performance</option>
                    </select>
                    <select id="perf-class" class="px-4 py-2 border rounded-lg" style="display:none;">
                        <option value="">Select Class</option>
                    </select>
                    <button onclick="loadPerformance()" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
                        <i class="fas fa-chart-bar mr-2"></i>View Performance
                    </button>
                </div>
            </div>

            <div id="performance-data" class="text-center">
                <i class="fas fa-info-circle text-4xl text-orange-600 mb-4"></i>
                <p class="text-lg text-gray-600">Select options above to view performance data</p>
            </div>
        </div>
    `;

    // Load classes
    const classesResult = await API.get('/dos/classes');
    if (classesResult.success) {
        const perfClass = document.getElementById('perf-class');
        perfClass.innerHTML = '<option value="">Select Class</option>' + 
            classesResult.data.data.map(cls => `<option value="${cls._id}">${cls.classID}</option>`).join('');
    }

    document.getElementById('perf-type').addEventListener('change', function() {
        document.getElementById('perf-class').style.display = this.value === 'class' ? 'block' : 'none';
    });
}

window.loadPerformance = async function() {
    const type = document.getElementById('perf-type').value;
    const classId = document.getElementById('perf-class').value;
    const perfData = document.getElementById('performance-data');

    perfData.innerHTML = `
        <i class="fas fa-spinner fa-spin text-4xl text-orange-600"></i>
        <p class="mt-4">Loading performance data...</p>
    `;

    let endpoint = '';
    if (type === 'school') {
        endpoint = '/dos/performance/school';
    } else if (type === 'class' && classId) {
        endpoint = `/dos/performance/class/${classId}`;
    } else {
        perfData.innerHTML = `
            <i class="fas fa-exclamation-circle text-4xl text-yellow-600 mb-4"></i>
            <p class="text-lg text-gray-600">Please select a class</p>
        `;
        return;
    }

    const result = await API.get(endpoint);

    if (result.success && result.data.data) {
        const data = result.data.data;
        
        perfData.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-8">
                ${data.class ? `<h2 class="text-2xl font-bold mb-6 text-orange-600">${data.class.classID} - ${data.class.name}</h2>` : 
                    '<h2 class="text-2xl font-bold mb-6 text-orange-600">School-Wide Performance</h2>'}
                
                <!-- Best Performer -->
                ${data.bestPerformer ? `
                    <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg mb-6">
                        <h3 class="text-xl font-bold mb-3 text-orange-700"><i class="fas fa-trophy mr-2"></i>Best Performer</h3>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-lg font-bold">${data.bestPerformer.student.firstName} ${data.bestPerformer.student.lastName}</p>
                                <p class="text-sm text-gray-600">${data.bestPerformer.student.studentID}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-4xl font-bold text-orange-600">${data.bestPerformer.average}%</p>
                                <p class="text-sm text-gray-600">${data.bestPerformer.category}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Performance Categories -->
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    ${Object.entries(data.categoryCounts).map(([category, count]) => `
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600">${category}</p>
                            <p class="text-3xl font-bold text-gray-800">${count}</p>
                            <p class="text-xs text-gray-500">students</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Total Students -->
                <div class="text-center mt-6">
                    <p class="text-gray-600">Total Students: <span class="font-bold text-2xl text-orange-600">${data.totalStudents || data.performanceData.length}</span></p>
                </div>
            </div>
        `;
    } else {
        perfData.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>No performance data available. Make sure marks have been published.</p>
            </div>
        `;
    }
};

window.showPublishBestPerformersModal = async function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-orange-600">Publish Best Performers</h2>
            <p class="text-gray-600 mb-6">This will publish students with 84% or above to the news section.</p>
            <form id="publish-best-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg" value="2024-2025">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Assessment Type (Optional)</label>
                        <select name="assessmentType" class="w-full px-4 py-2 border rounded-lg">
                            <option value="">All Assessments</option>
                            <option value="Midterm Exam">Midterm Exam</option>
                            <option value="Final Exam">Final Exam</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-bold">
                        <i class="fas fa-trophy mr-2"></i>Publish to News
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('publish-best-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/dos/performance/publish-best', data);
        
        if (result.success) {
            showNotification(`Published ${result.data.bestPerformers?.length || 0} best performers to news!`, 'success');
            modal.remove();
        } else {
            showNotification('Failed to publish: ' + result.message, 'error');
        }
    });
};

async function renderClasses() {
    const mainContent = document.getElementById('main-content');
    const isTeacher = currentUser && currentUser.role === 'Teacher';
    const isDOS = currentUser && currentUser.role === 'DOS';
    
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">${isTeacher ? 'My Classes' : 'Classes'}</h1>
            ${isDOS ? `<button onclick="showCreateClassModal()" class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Create New Class
            </button>` : ''}
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="classes-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading classes...</p>
            </div>
        </div>
    `;
    
    let endpoint = '/dos/classes';
    if (isTeacher && currentUser) {
        const userId = currentUser._id || currentUser.id;
        endpoint = `/dos/my-classes/${userId}`;
    }
    
    const result = await API.get(endpoint);
    const classesList = document.getElementById('classes-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            classesList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No classes found. Create your first class!</p>
                </div>
            `;
        } else {
            classesList.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6">
                    ${result.data.data.map(cls => `
                        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <h3 class="text-2xl font-bold mb-3 text-blue-600">${cls.classID}</h3>
                            <p class="text-gray-700 mb-2"><strong>Name:</strong> ${cls.name}</p>
                            <p class="text-gray-600 mb-2"><strong>Level:</strong> ${cls.level}</p>
                            <p class="text-gray-600 mb-2"><strong>Grade:</strong> ${cls.grade} ${cls.section}</p>
                            ${cls.trade !== 'None' ? `<p class="text-gray-600 mb-2"><strong>Trade:</strong> ${cls.trade}</p>` : ''}
                            <p class="text-gray-600 mb-4"><strong>Students:</strong> ${cls.students?.length || 0}</p>
                            <div class="flex gap-2">
                                <button onclick="viewClass('${cls._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                    <i class="fas fa-eye mr-1"></i>View
                                </button>
                                ${isDOS ? `<button onclick="editClass('${cls._id}')" class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>
                                <button onclick="deleteClass('${cls._id}', '${cls.classID}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        classesList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load classes. ${result.message}</p>
            </div>
        `;
    }
}

// Create Class Modal
window.showCreateClassModal = async function() {
    const teachersResult = await API.get('/dos/teachers');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">Create New Class</h2>
            <p class="text-sm text-gray-600 mb-4">Class name will be auto-generated based on your selections</p>
            <form id="create-class-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Level *</label>
                    <select name="level" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onchange="handleLevelChange(this.value)">
                        <option value="">Select Level</option>
                        <option value="O-Level">O-Level</option>
                        <option value="A-Level">A-Level</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Grade *</label>
                    <select name="grade" required id="grade-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Grade</option>
                    </select>
                </div>
                <div class="mb-4" id="trade-div" style="display:none;">
                    <label class="block text-gray-700 font-bold mb-2">Trade *</label>
                    <select name="trade" id="trade-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="None">None</option>
                        <option value="SOD">Software Development (SOD)</option>
                        <option value="ACC">Accounting Profession (ACC)</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Section (Optional)</label>
                    <input type="text" name="section" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxlength="1" placeholder="A, B, C, etc. (Leave empty if no section)">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Class Teacher (Optional)</label>
                    <select name="classTeacher" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Teacher</option>
                        ${teachersResult.success ? teachersResult.data.data.map(teacher => 
                            `<option value="${teacher._id}">${teacher.name}</option>`
                        ).join('') : ''}
                    </select>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                        <i class="fas fa-plus mr-2"></i>Create
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    window.handleLevelChange = function(level) {
        const gradeSelect = document.getElementById('grade-select');
        const tradeDiv = document.getElementById('trade-div');
        const tradeSelect = document.getElementById('trade-select');
        
        gradeSelect.innerHTML = '<option value="">Select Grade</option>';
        
        if (level === 'O-Level') {
            gradeSelect.innerHTML += '<option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option>';
            tradeDiv.style.display = 'none';
            tradeSelect.value = 'None';
        } else if (level === 'A-Level') {
            gradeSelect.innerHTML += '<option value="S4">S4</option><option value="S5">S5</option><option value="S6">S6</option><option value="L3">L3</option><option value="L4">L4</option><option value="L5">L5</option>';
            tradeDiv.style.display = 'block';
        }
    };

    document.getElementById('create-class-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Remove empty section
        if (!data.section || data.section.trim() === '') {
            delete data.section;
        }
        
        // Remove empty classTeacher
        if (!data.classTeacher || data.classTeacher === '') {
            delete data.classTeacher;
        }
        
        const result = await API.post('/dos/classes', data);
        
        if (result.success) {
            showNotification(`Class created: ${result.data.data.classID}`, 'success');
            modal.remove();
            renderClasses();
        } else {
            showNotification('Failed to create class: ' + result.message, 'error');
        }
    });
}

window.deleteClass = async function(classId, className) {
    if (!confirm(`Are you sure you want to delete class "${className}"? This action cannot be undone.`)) {
        return;
    }
    
    const result = await API.delete(`/dos/classes/${classId}`);
    
    if (result.success) {
        showNotification(`Class "${className}" deleted successfully`, 'success');
        renderClasses();
    } else {
        showNotification('Failed to delete class: ' + result.message, 'error');
    }
}

// Subject Management
async function renderSubjects() {
    const mainContent = document.getElementById('main-content');
    const isTeacher = currentUser && currentUser.role === 'Teacher';
    
    mainContent.innerHTML = `
        <div class="bg-indigo-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Subject Management</h1>
            ${isTeacher ? `<button onclick="showCreateSubjectModal()" class="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Create New Subject
            </button>` : ''}
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="subjects-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
                <p class="mt-4">Loading subjects...</p>
            </div>
        </div>
    `;
    
    let endpoint = '/dos/subjects';
    if (isTeacher && currentUser) {
        const userId = currentUser._id || currentUser.id;
        endpoint = `/dos/subjects/teacher/${userId}`;
    }
    
    const result = await API.get(endpoint);
    const subjectsList = document.getElementById('subjects-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            subjectsList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No subjects found. Create your first subject!</p>
                </div>
            `;
        } else {
            subjectsList.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6">
                    ${result.data.data.map(subject => `
                        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-2xl font-bold text-indigo-600">${subject.name}</h3>
                                ${subject.code ? `<span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-bold">${subject.code}</span>` : ''}
                            </div>
                            <p class="text-gray-700 mb-2"><strong>Class:</strong> ${subject.class?.classID || 'N/A'}</p>
                            <p class="text-gray-600 mb-2"><strong>Teacher:</strong> ${subject.teacher?.name || 'N/A'}</p>
                            <p class="text-gray-600 mb-4"><strong>Students:</strong> ${subject.students?.length || 0}</p>
                            ${subject.description ? `<p class="text-gray-500 text-sm mb-4 italic">${subject.description}</p>` : ''}
                            <div class="flex gap-2">
                                ${isTeacher ? `
                                    <button onclick="syncSubjectStudents('${subject._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm" title="Sync new students from class">
                                        <i class="fas fa-sync mr-1"></i>Sync
                                    </button>
                                    <button onclick="deleteSubject('${subject._id}', '${subject.name}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        subjectsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load subjects. ${result.message}</p>
            </div>
        `;
    }
}

window.showCreateSubjectModal = async function() {
    if (!currentUser) {
        showNotification('Please log in to create subjects', 'error');
        return;
    }

    const userId = currentUser._id || currentUser.id;
    const classesResult = await API.get(`/dos/my-classes/${userId}`);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
            <h2 class="text-2xl font-bold mb-6 text-indigo-600">Create New Subject</h2>
            <form id="create-subject-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Subject Name *</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Mathematics">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Subject Code (Optional)</label>
                    <input type="text" name="code" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., MATH101" maxlength="10">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Class *</label>
                    <select name="class" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select Class</option>
                        ${classesResult.success ? classesResult.data.data.map(cls => 
                            `<option value="${cls._id}">${cls.classID} (${cls.students?.length || 0} students)</option>`
                        ).join('') : ''}
                    </select>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Description (Optional)</label>
                    <textarea name="description" rows="3" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Brief description of the subject"></textarea>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-bold">
                        <i class="fas fa-plus mr-2"></i>Create
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('create-subject-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        data.teacher = currentUser._id || currentUser.id;
        
        if (!data.code || data.code.trim() === '') {
            delete data.code;
        }
        
        if (!data.description || data.description.trim() === '') {
            delete data.description;
        }
        
        const result = await API.post('/dos/subjects', data);
        
        if (result.success) {
            showNotification(`Subject created: ${result.data.data.name} (${result.data.data.students.length} students assigned)`, 'success');
            modal.remove();
            renderSubjects();
        } else {
            showNotification('Failed to create subject: ' + result.message, 'error');
        }
    });
}

window.syncSubjectStudents = async function(subjectId) {
    const result = await API.post(`/dos/subjects/${subjectId}/sync-students`);
    
    if (result.success) {
        if (result.data.added > 0) {
            showNotification(`Synced! Added ${result.data.added} new student(s)`, 'success');
        } else {
            showNotification('Already up to date - no new students to add', 'info');
        }
        renderSubjects();
    } else {
        showNotification('Failed to sync students: ' + result.message, 'error');
    }
}

window.deleteSubject = async function(subjectId, subjectName) {
    if (!confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
        return;
    }
    
    const result = await API.delete(`/dos/subjects/${subjectId}`);
    
    if (result.success) {
        showNotification(`Subject "${subjectName}" deleted successfully`, 'success');
        renderSubjects();
    } else {
        showNotification('Failed to delete subject: ' + result.message, 'error');
    }
}

async function renderTrainers() {
    const mainContent = document.getElementById('main-content');
    const isIT = currentUser && currentUser.role === 'IT';
    
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Our Trainers</h1>
            <p class="text-xl">Meet our dedicated and experienced team</p>
            ${isIT ? `<button onclick="showCreateTrainerModal()" class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Add Trainer
            </button>` : ''}
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
        if (result.data.data.length === 0) {
            trainersList.innerHTML = '<p class="text-gray-500">No trainers found.</p>';
        } else {
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
                                <p class="text-gray-600 mb-1">${trainer.subject || 'Trainer'}</p>
                                ${trainer.level ? `<p class="text-sm text-gray-500 mb-1"><i class="fas fa-graduation-cap mr-1"></i>${trainer.level}${trainer.trade && trainer.trade !== 'None' ? ` - ${trainer.trade}` : ''}</p>` : ''}
                                ${trainer.phone ? `<p class="text-sm text-gray-500"><i class="fas fa-phone mr-2"></i>${trainer.phone}</p>` : ''}
                                ${isIT ? `
                                    <div class="mt-4 flex gap-2">
                                        <button onclick="editTrainer('${trainer._id}')" class="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                            <i class="fas fa-edit mr-1"></i>Edit
                                        </button>
                                        <button onclick="deleteTrainer('${trainer._id}')" class="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                                            <i class="fas fa-trash mr-1"></i>Delete
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        trainersList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load trainers. ${result.message}</p>
            </div>
        `;
    }
}

window.showCreateTrainerModal = async function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">Add Trainer</h2>
            <form id="create-trainer-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Name *</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Teacher ID *</label>
                        <input type="text" name="teacherId" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., T001">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Email *</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Phone Number *</label>
                        <input type="tel" name="phone" required class="w-full px-4 py-2 border rounded-lg" placeholder="0788123456">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Level *</label>
                        <select name="level" required id="level-select" class="w-full px-4 py-2 border rounded-lg" onchange="handleTrainerLevelChange(this.value)">
                            <option value="">Select Level</option>
                            <option value="O-Level">O-Level</option>
                            <option value="A-Level">A-Level</option>
                        </select>
                    </div>
                    <div id="trade-div" style="display:none;">
                        <label class="block text-gray-700 font-bold mb-2">Trade *</label>
                        <select name="trade" id="trade-select" class="w-full px-4 py-2 border rounded-lg">
                            <option value="None">None</option>
                            <option value="SOD">Software Development (SOD)</option>
                            <option value="ACC">Accounting Profession (ACC)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Subject *</label>
                        <input type="text" name="subject" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Mathematics">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Photo</label>
                        <input type="file" name="photo" accept="image/*" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Add Trainer
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    window.handleTrainerLevelChange = function(level) {
        const tradeDiv = document.getElementById('trade-div');
        const tradeSelect = document.getElementById('trade-select');
        if (level === 'A-Level') {
            tradeDiv.style.display = 'block';
            tradeSelect.required = true;
        } else {
            tradeDiv.style.display = 'none';
            tradeSelect.required = false;
            tradeSelect.value = 'None';
        }
    };
    
    document.getElementById('create-trainer-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const data = {
            name: formData.get('name'),
            teacherId: formData.get('teacherId'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            level: formData.get('level'),
            trade: formData.get('trade') || 'None',
            subject: formData.get('subject'),
            department: formData.get('level') === 'O-Level' ? 'O-Level' : (formData.get('trade') === 'SOD' ? 'Software Development' : 'Accounting')
        };
        
        // Handle photo upload
        const photoFile = formData.get('photo');
        if (photoFile && photoFile.size > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                data.photo = e.target.result;
                const result = await API.post('/trainers', data);
                if (result.success) {
                    showNotification('Trainer added successfully!', 'success');
                    modal.remove();
                    renderTrainers();
                } else {
                    showNotification('Failed to add trainer: ' + result.message, 'error');
                }
            };
            reader.readAsDataURL(photoFile);
        } else {
            const result = await API.post('/trainers', data);
            if (result.success) {
                showNotification('Trainer added successfully!', 'success');
                modal.remove();
                renderTrainers();
            } else {
                showNotification('Failed to add trainer: ' + result.message, 'error');
            }
        }
    });
};

window.editTrainer = function(trainerId) {
    showNotification('Edit trainer functionality coming soon', 'info');
};

window.deleteTrainer = async function(trainerId) {
    if (!confirm('Are you sure you want to delete this trainer?')) return;
    const result = await API.delete(`/trainers/${trainerId}`);
    if (result.success) {
        showNotification('Trainer deleted successfully', 'success');
        renderTrainers();
    } else {
        showNotification('Failed to delete trainer: ' + result.message, 'error');
    }
};

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
                                <div class="text-lg text-gray-700 leading-relaxed whitespace-pre-line">${news.content}</div>
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
            <p class="text-xl">Important updates and notices</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="announcements-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-orange-600"></i>
                <p class="mt-4">Loading announcements...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/it/announcements?published=true');
    const announcementsList = document.getElementById('announcements-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            announcementsList.innerHTML = '<p class="text-gray-500">No announcements at this time.</p>';
        } else {
            announcementsList.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">` : ''}
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold">${item.title}</h3>
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">${item.concerns}</span>
                                </div>
                                <p class="text-gray-600 mb-4">${item.content}</p>
                                <p class="text-sm text-gray-500">${new Date(item.createdAt).toLocaleDateString()}</p>
                                ${item.documents && item.documents.length > 0 ? `
                                    <div class="mt-4">
                                        <p class="text-sm font-semibold mb-2">Documents:</p>
                                        ${item.documents.map(doc => `
                                            <a href="${doc}" target="_blank" class="text-blue-600 hover:underline text-sm block">
                                                <i class="fas fa-file mr-1"></i>View Document
                                            </a>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        announcementsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load announcements. ${result.message || 'Unknown error'}</p>
            </div>
        `;
    }
}

async function renderEmployeeOfYear() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-yellow-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Employee of the Year</h1>
            <p class="text-xl">Recognizing excellence and dedication</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="employee-year-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-yellow-600"></i>
                <p class="mt-4">Loading employees of the year...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/it/employee-of-year?published=true');
    const employeeList = document.getElementById('employee-year-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            employeeList.innerHTML = '<p class="text-gray-500">No employees of the year yet.</p>';
        } else {
            employeeList.innerHTML = `
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                            ${item.photo ? `<img src="${item.photo}" alt="${item.employeeName}" class="w-full h-64 object-cover">` : 
                                `<div class="w-full h-64 bg-yellow-100 flex items-center justify-center"><i class="fas fa-user text-6xl text-yellow-400"></i></div>`}
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2">${item.employeeName}</h3>
                                <p class="text-sm text-yellow-600 mb-2">${item.employeeType} - ${item.year}</p>
                                <p class="text-gray-600">${item.achievement}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        employeeList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load employees. ${result.message || 'Unknown error'}</p>
            </div>
        `;
    }
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
    if (!currentUser.studentData || !currentUser.studentData._id) {
        document.getElementById('student-data').innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load student data. Please log in again.</p>
            </div>
        `;
        return;
    }
    
    const studentId = currentUser.studentData._id;
    const studentData = document.getElementById('student-data');
    const studentContent = document.getElementById('student-content');
    
    studentData.classList.add('hidden');
    studentContent.classList.remove('hidden');
    
    // Load PUBLISHED marks by student (only marks that DOS has published)
    const marksResult = await API.get(`/dos/students/${studentId}`);
    const studentMarks = document.getElementById('student-marks');
    
    if (marksResult.success && marksResult.data.data) {
        // Get all PUBLISHED marks for this student
        const allMarksResult = await API.get('/dos/marks');
        
        if (allMarksResult.success && allMarksResult.data.data) {
            const studentMarksData = allMarksResult.data.data.filter(mark => 
                mark.student && (mark.student._id === studentId || mark.student === studentId) &&
                mark.published === true  // Only show published marks
            );
            
            // Group marks by subject
            const subjectMarks = {};
            let totalMarks = 0;
            let totalSubjects = 0;
            
            studentMarksData.forEach(mark => {
                if (!subjectMarks[mark.subject]) {
                    subjectMarks[mark.subject] = [];
                }
                subjectMarks[mark.subject].push(mark);
                totalMarks += mark.marks;
                totalSubjects++;
            });
            
            const averagePercentage = totalSubjects > 0 ? (totalMarks / totalSubjects).toFixed(1) : 0;
            
            if (Object.keys(subjectMarks).length > 0) {
                studentMarks.innerHTML = `
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg mb-6">
                        <h3 class="text-2xl font-bold mb-2">Overall Average</h3>
                        <p class="text-5xl font-bold">${averagePercentage}%</p>
                        <p class="text-sm mt-2">${totalSubjects} assessments across ${Object.keys(subjectMarks).length} subjects</p>
                    </div>
                    
                    <div class="space-y-4">
                        ${Object.entries(subjectMarks).map(([subject, marks]) => {
                            const subjectAvg = (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1);
                            return `
                                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div class="flex justify-between items-center mb-2">
                                        <h4 class="text-lg font-bold text-gray-800">${subject}</h4>
                                        <span class="text-2xl font-bold ${subjectAvg >= 70 ? 'text-green-600' : subjectAvg >= 50 ? 'text-yellow-600' : 'text-red-600'}">${subjectAvg}%</span>
                                    </div>
                                    <div class="space-y-2">
                                        ${marks.map(mark => `
                                            <div class="flex justify-between text-sm">
                                                <span class="text-gray-600">${mark.assessmentType} - ${mark.term}</span>
                                                <span class="font-semibold">${mark.marks}%</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                studentMarks.innerHTML = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <i class="fas fa-info-circle text-blue-600 text-4xl mb-3"></i>
                        <p class="text-blue-800 font-bold text-lg mb-2">No Published Marks Yet</p>
                        <p class="text-blue-700">Your academic performance will appear here once the Dean of Studies publishes your marks.</p>
                        <p class="text-blue-700 text-sm mt-2">Contact the Dean of Studies if you have questions.</p>
                    </div>
                `;
            }
        }
    }
    
    // Load PUBLISHED conduct reports (only reports that DOD has published)
    const publishedReportsResult = await API.get(`/dod/published?studentId=${studentId}`);
    const studentConduct = document.getElementById('student-conduct');
    
    if (publishedReportsResult.success && publishedReportsResult.data.data && publishedReportsResult.data.data.length > 0) {
        // Get the most recent published report
        const reports = publishedReportsResult.data.data;
        const latestReport = reports[0]; // Already sorted by publishedAt descending
        
        const conductScore = latestReport.conductScore || 40;
        const deductionsCount = latestReport.totalReductions || 0;
        const percentage = (conductScore / 40) * 100;
        
        // Display all published reports
        let deductionsHTML = '';
        
        if (reports.length > 0) {
            deductionsHTML = `
                <div class="mt-4 space-y-3">
                    <h4 class="font-bold text-gray-700">Published Reports History:</h4>
                    ${reports.map(report => `
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-semibold text-blue-800">${report.term}</p>
                                    <p class="text-sm text-gray-600">Academic Year: ${report.academicYear || 'N/A'}</p>
                                    <p class="text-sm text-gray-600">Published: ${new Date(report.publishedAt).toLocaleDateString()}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-bold ${report.conductScore >= 30 ? 'text-green-600' : report.conductScore >= 20 ? 'text-yellow-600' : 'text-red-600'}">${report.conductScore}/40</p>
                                    <p class="text-sm text-gray-600">${report.totalReductions} deductions</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        studentConduct.innerHTML = `
            <div class="bg-gradient-to-r from-${conductScore >= 30 ? 'green' : conductScore >= 20 ? 'yellow' : 'red'}-500 to-${conductScore >= 30 ? 'green' : conductScore >= 20 ? 'yellow' : 'red'}-600 text-white p-6 rounded-lg mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-lg font-semibold mb-2">Current Conduct Score</p>
                        <p class="text-5xl font-bold">${conductScore} <span class="text-2xl">/ 40</span></p>
                        <p class="text-sm mt-2">${conductScore >= 30 ? 'Good Standing' : conductScore >= 20 ? 'Warning' : 'Critical - Needs Attention'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-bold">${percentage.toFixed(0)}%</p>
                        <p class="text-sm">Conduct Grade</p>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Total Deductions</p>
                    <p class="text-3xl font-bold text-gray-800">${deductionsCount}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600">Points Lost</p>
                    <p class="text-3xl font-bold text-red-600">${40 - conductScore}</p>
                </div>
            </div>
            
            ${deductionsHTML}
            
            ${deductionsCount === 0 ? `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center mt-4">
                    <i class="fas fa-check-circle text-green-600 text-3xl mb-2"></i>
                    <p class="text-green-800 font-semibold">Excellent! No conduct deductions for ${latestReport.term}</p>
                    <p class="text-green-700 text-sm">Keep up the good behavior!</p>
                </div>
            ` : ''}
        `;
    } else {
        studentConduct.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <i class="fas fa-info-circle text-yellow-600 text-4xl mb-3"></i>
                <p class="text-yellow-800 font-bold text-lg mb-2">No Published Reports Yet</p>
                <p class="text-yellow-700">Your conduct reports will appear here once the Dean of Discipline publishes them.</p>
                <p class="text-yellow-700 text-sm mt-2">Contact the Dean of Discipline if you have questions.</p>
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
// DOD (Director of Discipline) FEATURES
// ============================================

async function renderDODFaults() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-red-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Fault Management</h1>
            <button onclick="showCreateFaultModal()" class="bg-white text-red-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Create New Fault
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="faults-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-red-600"></i>
                <p class="mt-4">Loading faults...</p>
            </div>
        </div>
    `;
    
    loadFaults();
}

async function loadFaults() {
    const faultsList = document.getElementById('faults-list');
    if (!faultsList) return;

    const result = await API.get('/dod/faults');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            faultsList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No faults found. Create your first fault!</p>
                </div>
            `;
        } else {
            faultsList.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6">
                    ${result.data.data.map(fault => `
                        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <h3 class="text-xl font-bold mb-3 text-red-600">${fault.name}</h3>
                            <div class="text-center mb-4">
                                <p class="text-4xl font-bold text-gray-800">-${fault.pointsToDeduct}</p>
                                <p class="text-sm text-gray-500">points</p>
                            </div>
                            ${fault.description ? `<p class="text-gray-600 mb-4 text-sm">${fault.description}</p>` : ''}
                            <div class="flex gap-2">
                                <button onclick="editFault('${fault._id}')" class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>
                                <button onclick="deleteFault('${fault._id}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        faultsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load faults</p>
            </div>
        `;
    }
}

window.showCreateFaultModal = function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-red-600">Create New Fault</h2>
            <form id="create-fault-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Fault Name *</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Late to class">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Points to Deduct (1-40) *</label>
                    <input type="number" name="pointsToDeduct" required min="1" max="40" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Description (Optional)</label>
                    <textarea name="description" class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-bold">
                        <i class="fas fa-plus mr-2"></i>Create
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('create-fault-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/dod/faults', data);
        
        if (result.success) {
            showNotification('Fault created successfully!', 'success');
            modal.remove();
            loadFaults();
        } else {
            showNotification('Failed to create fault: ' + result.message, 'error');
        }
    });
};

window.deleteFault = async function(faultId) {
    if (!confirm('Are you sure you want to delete this fault?')) return;
    
    const result = await API.delete(`/dod/faults/${faultId}`);
    
    if (result.success) {
        showNotification('Fault deleted successfully!', 'success');
        loadFaults();
    } else {
        showNotification('Failed to delete fault: ' + result.message, 'error');
    }
};

async function renderDODDeduct() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-orange-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Reduce Conduct Marks</h1>
            <p class="text-xl">Deduct points from students for misconduct</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <button onclick="showDeductFromStudentsModal()" class="bg-blue-600 text-white p-8 rounded-lg hover:bg-blue-700 transition text-left">
                    <i class="fas fa-user text-4xl mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Deduct from Individual Students</h3>
                    <p>Select one or more students to deduct conduct points</p>
                </button>
                <button onclick="showDeductFromClassModal()" class="bg-purple-600 text-white p-8 rounded-lg hover:bg-purple-700 transition text-left">
                    <i class="fas fa-users text-4xl mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Deduct from Entire Class</h3>
                    <p>Apply deduction to all students in a class</p>
                </button>
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <h4 class="font-bold text-blue-800 mb-2"><i class="fas fa-info-circle mr-2"></i>Conduct Point System</h4>
                <ul class="text-blue-700 space-y-1 text-sm">
                    <li>• Each student starts with <strong>40 points</strong> per term</li>
                    <li>• <strong>30-40 points:</strong> Good Conduct</li>
                    <li>• <strong>20-29 points:</strong> Warning Status</li>
                    <li>• <strong>Below 20 points:</strong> Critical (Parent Alert)</li>
                </ul>
            </div>
        </div>
    `;
}

window.showDeductFromStudentsModal = async function() {
    const [classesResult, faultsResult] = await Promise.all([
        API.get('/dos/classes'),
        API.get('/dod/faults')
    ]);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 my-8">
            <h2 class="text-2xl font-bold mb-6 text-orange-600">Deduct from Students</h2>
            <form id="deduct-students-form">
                <!-- Step 1: Select Class -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Select Class *</label>
                    <select id="class-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" onchange="loadStudentsForDeduction(this.value)">
                        <option value="">Select a class first</option>
                        ${classesResult.success ? classesResult.data.data.map(cls => 
                            `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`
                        ).join('') : ''}
                    </select>
                    <p class="text-sm text-gray-500 mt-1">Select a class to view its students</p>
                </div>

                <!-- Step 2: Search and Select Students -->
                <div class="mb-6" id="students-section" style="display: none;">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-gray-700 font-bold">Select Students *</label>
                        <button type="button" onclick="toggleSelectAll()" class="text-sm text-orange-600 hover:text-orange-800 font-semibold" id="select-all-btn">
                            Select All
                        </button>
                    </div>
                    <div class="mb-3">
                        <input type="text" id="student-search" placeholder="Search students by name or ID..." 
                               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                               onkeyup="filterStudents()">
                        <p class="text-xs text-gray-500 mt-1"><i class="fas fa-search mr-1"></i>Type to search students</p>
                    </div>
                    <div class="border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50" id="students-list">
                        <p class="text-gray-500 text-center py-8">Please select a class to view students</p>
                    </div>
                    <div class="mt-2 text-sm text-gray-600">
                        <span id="selected-count">0</span> student(s) selected
                    </div>
                </div>

                <!-- Step 3: Select Fault -->
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Select Fault *</label>
                        <select name="faultId" required id="fault-select" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" onchange="updateDeductionPoints(this.value)">
                            <option value="">Select Fault</option>
                            ${faultsResult.success ? faultsResult.data.data.map(fault => 
                                `<option value="${fault._id}" data-points="${fault.pointsToDeduct}">${fault.name} (-${fault.pointsToDeduct} pts)</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Points to Deduct</label>
                        <input type="number" id="points-display" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100" value="0">
                    </div>
                </div>

                <!-- Step 4: Term and Academic Year -->
                <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" value="2024-2025">
                    </div>
                </div>

                <!-- Step 5: Comment -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Comment *</label>
                    <textarea name="comment" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" rows="3" placeholder="Describe the incident..."></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-bold">
                        <i class="fas fa-minus-circle mr-2"></i>Deduct Points
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Store students data
    let allStudents = [];
    let filteredStudents = [];

    // Load students when class is selected
    window.loadStudentsForDeduction = async function(classId) {
        if (!classId) {
            document.getElementById('students-section').style.display = 'none';
            document.getElementById('students-list').innerHTML = '<p class="text-gray-500 text-center py-8">Please select a class to view students</p>';
            return;
        }

        try {
            showLoading();
            const studentsResult = await API.get(`/dos/students/class/${classId}`);
            hideLoading();

            if (studentsResult.success && studentsResult.data.data) {
                allStudents = studentsResult.data.data;
                filteredStudents = [...allStudents];
                renderStudentsList();
                document.getElementById('students-section').style.display = 'block';
                document.getElementById('student-search').value = '';
            } else {
                document.getElementById('students-list').innerHTML = '<p class="text-gray-500 text-center py-8">No students found in this class</p>';
                document.getElementById('students-section').style.display = 'block';
            }
        } catch (error) {
            hideLoading();
            showNotification('Failed to load students: ' + error.message, 'error');
            document.getElementById('students-list').innerHTML = '<p class="text-red-500 text-center py-8">Error loading students</p>';
        }
    };

    // Render students list
    function renderStudentsList() {
        const studentsList = document.getElementById('students-list');
        
        if (filteredStudents.length === 0) {
            studentsList.innerHTML = '<p class="text-gray-500 text-center py-8">No students match your search</p>';
            updateSelectedCount();
            return;
        }

        studentsList.innerHTML = filteredStudents.map(student => `
            <label class="flex items-center p-3 hover:bg-white rounded cursor-pointer border-b border-gray-200 student-item" data-student-id="${student._id}">
                <input type="checkbox" name="studentIds" value="${student._id}" class="mr-3 student-checkbox" onchange="updateSelectedCount()">
                <div class="flex-1">
                    <p class="font-semibold text-gray-800">${student.firstName} ${student.lastName}</p>
                    <p class="text-xs text-gray-500">${student.studentID}</p>
                </div>
            </label>
        `).join('');
        
        updateSelectedCount();
    }

    // Filter students by search term
    window.filterStudents = function() {
        const searchTerm = document.getElementById('student-search').value.toLowerCase().trim();
        
        if (!searchTerm) {
            filteredStudents = [...allStudents];
        } else {
            filteredStudents = allStudents.filter(student => {
                const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                const studentID = student.studentID.toLowerCase();
                return fullName.includes(searchTerm) || studentID.includes(searchTerm);
            });
        }
        
        renderStudentsList();
    };

    // Toggle select all students
    window.toggleSelectAll = function() {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        const selectAllBtn = document.getElementById('select-all-btn');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
        
        selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
        updateSelectedCount();
    };

    // Update selected count
    window.updateSelectedCount = function() {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        const count = checkboxes.length;
        document.getElementById('selected-count').textContent = count;
        
        const selectAllBtn = document.getElementById('select-all-btn');
        const allCheckboxes = document.querySelectorAll('.student-checkbox');
        if (allCheckboxes.length > 0) {
            selectAllBtn.textContent = count === allCheckboxes.length ? 'Deselect All' : 'Select All';
        }
    };

    // Update deduction points
    window.updateDeductionPoints = function(faultId) {
        const select = document.getElementById('fault-select');
        const option = select.options[select.selectedIndex];
        const points = option.getAttribute('data-points') || 0;
        document.getElementById('points-display').value = points;
    };

    // Form submission
    document.getElementById('deduct-students-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const studentIds = formData.getAll('studentIds');
        const classId = document.getElementById('class-select').value;
        
        if (!classId) {
            showNotification('Please select a class first', 'error');
            return;
        }
        
        if (studentIds.length === 0) {
            showNotification('Please select at least one student', 'error');
            return;
        }

        const data = {
            studentIds,
            faultId: formData.get('faultId'),
            term: formData.get('term'),
            academicYear: formData.get('academicYear'),
            comment: formData.get('comment')
        };
        
        showLoading();
        const result = await API.post('/dod/deduct/students', data);
        hideLoading();
        
        if (result.success) {
            showNotification(`Points deducted from ${result.data.count} student(s)!`, 'success');
            modal.remove();
        } else {
            showNotification('Failed to deduct points: ' + result.message, 'error');
        }
    });
};

window.showDeductFromClassModal = async function() {
    const classesResult = await API.get('/dos/classes');
    const faultsResult = await API.get('/dod/faults');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-purple-600">Deduct from Entire Class</h2>
            <form id="deduct-class-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Select Class *</label>
                    <select name="classId" required class="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select Class</option>
                        ${classesResult.success ? classesResult.data.data.map(cls => 
                            `<option value="${cls._id}">${cls.classID} - ${cls.name}</option>`
                        ).join('') : ''}
                    </select>
                </div>
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Select Fault *</label>
                        <select name="faultId" required id="class-fault-select" class="w-full px-4 py-2 border rounded-lg" onchange="updateClassDeductionPoints(this.value)">
                            <option value="">Select Fault</option>
                            ${faultsResult.success ? faultsResult.data.data.map(fault => 
                                `<option value="${fault._id}" data-points="${fault.pointsToDeduct}">${fault.name} (-${fault.pointsToDeduct} pts)</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Points to Deduct</label>
                        <input type="number" id="class-points-display" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100" value="0">
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg" value="2024-2025">
                    </div>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Comment *</label>
                    <textarea name="comment" required class="w-full px-4 py-2 border rounded-lg" rows="3" placeholder="Describe what the class did..."></textarea>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-bold">
                        <i class="fas fa-minus-circle mr-2"></i>Deduct from Class
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    window.updateClassDeductionPoints = function(faultId) {
        const select = document.getElementById('class-fault-select');
        const option = select.options[select.selectedIndex];
        const points = option.getAttribute('data-points') || 0;
        document.getElementById('class-points-display').value = points;
    };

    document.getElementById('deduct-class-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/dod/deduct/class', data);
        
        if (result.success) {
            showNotification(result.data.message, 'success');
            modal.remove();
        } else {
            showNotification('Failed to deduct points: ' + result.message, 'error');
        }
    });
};

async function renderDODAlerts() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-yellow-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Low Conduct Alerts</h1>
            <p class="text-xl">Students with less than 20 conduct points</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="alerts-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-yellow-600"></i>
                <p class="mt-4">Loading alerts...</p>
            </div>
        </div>
    `;
    
    loadAlerts();
}

async function loadAlerts() {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    const result = await API.get('/dod/conducts/alerts');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            alertsList.innerHTML = `
                <div class="text-green-600">
                    <i class="fas fa-check-circle text-4xl mb-4"></i>
                    <p class="text-lg">No low conduct alerts! All students are doing well.</p>
                </div>
            `;
        } else {
            alertsList.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(conduct => `
                        <div class="bg-white rounded-lg shadow-lg p-6 text-left border-l-4 ${
                            conduct.remainingPoints < 10 ? 'border-red-600' : 'border-yellow-600'
                        }">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h3 class="text-xl font-bold ${conduct.remainingPoints < 10 ? 'text-red-600' : 'text-yellow-600'}">
                                        ${conduct.student?.firstName} ${conduct.student?.lastName}
                                    </h3>
                                    <p class="text-sm text-gray-500">${conduct.student?.studentID}</p>
                                    <p class="text-sm text-gray-600">${conduct.student?.class?.classID || 'N/A'}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-4xl font-bold ${conduct.remainingPoints < 10 ? 'text-red-600' : 'text-yellow-600'}">
                                        ${conduct.remainingPoints}/40
                                    </p>
                                    <p class="text-xs text-gray-500">${conduct.term}</p>
                                </div>
                            </div>
                            
                            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                <h4 class="font-bold text-gray-700 mb-2">Parent Contact Information</h4>
                                <p class="text-sm text-gray-700"><i class="fas fa-user mr-2"></i>${conduct.student?.parentName}</p>
                                <p class="text-sm text-gray-700"><i class="fas fa-phone mr-2"></i>${conduct.student?.parentPhone}</p>
                                ${conduct.student?.parentEmail ? `<p class="text-sm text-gray-700"><i class="fas fa-envelope mr-2"></i>${conduct.student?.parentEmail}</p>` : ''}
                                <p class="text-sm text-gray-500"><i class="fas fa-user-tag mr-2"></i>${conduct.student?.relationship}</p>
                            </div>

                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Total Deductions:</span>
                                <span class="font-bold">${conduct.deductionsCount}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Points Lost:</span>
                                <span class="font-bold text-red-600">${40 - conduct.remainingPoints}</span>
                            </div>
                            
                            <div class="mt-4 pt-4 border-t">
                                <a href="tel:${conduct.student?.parentPhone}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full text-center">
                                    <i class="fas fa-phone mr-2"></i>Call Parent
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        alertsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load alerts</p>
            </div>
        `;
    }
}

async function renderDODPublish() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-indigo-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Publish Discipline Reports</h1>
            <p class="text-xl">Send conduct reports to students, parents, DOS, and SM</p>
            <button onclick="showPublishReportModal()" class="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-paper-plane mr-2"></i>Publish Reports
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h4 class="font-bold text-blue-800 mb-2"><i class="fas fa-info-circle mr-2"></i>About Publishing</h4>
                <p class="text-blue-700">Publishing reports will make conduct information visible to:</p>
                <ul class="text-blue-700 mt-2 space-y-1">
                    <li>• <strong>Students:</strong> Can view their own conduct scores</li>
                    <li>• <strong>Parents:</strong> Can monitor their child's behavior</li>
                    <li>• <strong>DOS:</strong> For academic correlation</li>
                    <li>• <strong>School Manager:</strong> For oversight</li>
                </ul>
            </div>

            <div id="published-reports" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
                <p class="mt-4">Loading published reports...</p>
            </div>
        </div>
    `;
    
    loadPublishedReports();
}

async function loadPublishedReports() {
    const reportsList = document.getElementById('published-reports');
    if (!reportsList) return;

    const result = await API.get('/dod/published');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            reportsList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No reports published yet</p>
                </div>
            `;
        } else {
            reportsList.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-indigo-600 text-white">
                            <tr>
                                <th class="px-6 py-3 text-left">Student</th>
                                <th class="px-6 py-3 text-left">Term</th>
                                <th class="px-6 py-3 text-left">Conduct Score</th>
                                <th class="px-6 py-3 text-left">Deductions</th>
                                <th class="px-6 py-3 text-left">Published</th>
                                <th class="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${result.data.data.map(report => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4">
                                        <div>
                                            <p class="font-semibold">${report.student?.firstName} ${report.student?.lastName}</p>
                                            <p class="text-xs text-gray-500">${report.student?.studentID}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">${report.term}</td>
                                    <td class="px-6 py-4">
                                        <span class="text-2xl font-bold ${
                                            report.conductScore >= 30 ? 'text-green-600' : 
                                            report.conductScore >= 20 ? 'text-yellow-600' : 'text-red-600'
                                        }">${report.conductScore}/40</span>
                                    </td>
                                    <td class="px-6 py-4">${report.totalReductions}</td>
                                    <td class="px-6 py-4 text-sm">${new Date(report.publishedAt).toLocaleDateString()}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold ${
                                            report.conductScore >= 30 ? 'bg-green-100 text-green-800' : 
                                            report.conductScore >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }">
                                            ${report.conductScore >= 30 ? 'Good' : report.conductScore >= 20 ? 'Warning' : 'Critical'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } else {
        reportsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load published reports</p>
            </div>
        `;
    }
}

window.showPublishReportModal = function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-indigo-600">Publish Discipline Reports</h2>
            <p class="text-gray-600 mb-6">This will publish conduct reports to students, parents, DOS, and SM.</p>
            <form id="publish-report-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Term *</label>
                        <select name="term" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Academic Year *</label>
                        <input type="text" name="academicYear" required class="w-full px-4 py-2 border rounded-lg" value="2024-2025">
                    </div>
                </div>

                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-bold">
                        <i class="fas fa-paper-plane mr-2"></i>Publish
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('publish-report-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/dod/publish', data);
        
        if (result.success) {
            showNotification(result.data.message, 'success');
            modal.remove();
            loadPublishedReports();
        } else {
            showNotification('Failed to publish reports: ' + result.message, 'error');
        }
    });
};

// ============================================
// LIBRARIAN FEATURES
// ============================================

async function renderLibBooks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-purple-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Book Management</h1>
            <button onclick="showAddBookModal()" class="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Add New Book
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="books-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4">Loading books...</p>
            </div>
        </div>
    `;
    
    loadBooks();
}

async function loadBooks() {
    const booksList = document.getElementById('books-list');
    if (!booksList) return;

    const result = await API.get('/librarian/books');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            booksList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No books found. Add your first book!</p>
                </div>
            `;
        } else {
            booksList.innerHTML = `
                <div class="grid md:grid-cols-4 gap-6">
                    ${result.data.data.map(book => `
                        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <div class="flex items-start justify-between mb-3">
                                <i class="fas fa-book text-3xl text-purple-600"></i>
                                <span class="px-2 py-1 text-xs font-bold rounded ${
                                    book.status === 'Available' ? 'bg-green-100 text-green-800' :
                                    book.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }">${book.status}</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2 text-gray-800">${book.title}</h3>
                            <p class="text-sm text-gray-600 mb-1">By ${book.author}</p>
                            <p class="text-xs text-gray-500 mb-3">${book.category}</p>
                            <div class="flex justify-between text-sm mb-3">
                                <span class="text-gray-600">Available:</span>
                                <span class="font-bold">${book.availableQuantity}/${book.quantity}</span>
                            </div>
                            <div class="flex justify-between text-sm mb-4">
                                <span class="text-gray-600">Borrowed:</span>
                                <span class="font-bold text-blue-600">${book.borrowCount} times</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="editBook('${book._id}')" class="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteBook('${book._id}')" class="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        booksList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load books</p>
            </div>
        `;
    }
}

window.showAddBookModal = function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-purple-600">Add New Book</h2>
            <form id="add-book-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Title *</label>
                    <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Author *</label>
                    <input type="text" name="author" required class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">ISBN (Optional)</label>
                    <input type="text" name="isbn" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Category *</label>
                    <input type="text" name="category" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Science, Literature">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Quantity *</label>
                    <input type="number" name="quantity" required min="1" class="w-full px-4 py-2 border rounded-lg" value="1">
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-bold">
                        <i class="fas fa-plus mr-2"></i>Add Book
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('add-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.availableQuantity = data.quantity;
        
        const result = await API.post('/librarian/books', data);
        
        if (result.success) {
            showNotification('Book added successfully!', 'success');
            modal.remove();
            loadBooks();
        } else {
            showNotification('Failed to add book: ' + result.message, 'error');
        }
    });
};

window.deleteBook = async function(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    const result = await API.delete(`/librarian/books/${bookId}`);
    
    if (result.success) {
        showNotification('Book deleted successfully!', 'success');
        loadBooks();
    } else {
        showNotification('Failed to delete book: ' + result.message, 'error');
    }
};

async function renderLibBorrow() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-blue-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Borrow / Return Books</h1>
            <button onclick="showBorrowBookModal()" class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-hand-holding mr-2"></i>Borrow Book
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 class="text-xl font-bold mb-4 text-blue-600">Filter Records</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <select id="borrow-status" class="px-4 py-2 border rounded-lg">
                        <option value="">All Status</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <button onclick="loadBorrowRecords()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        <i class="fas fa-filter mr-2"></i>Filter
                    </button>
                </div>
            </div>

            <div id="borrow-records" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4">Loading records...</p>
            </div>
        </div>
    `;
    
    loadBorrowRecords();
}

async function loadBorrowRecords() {
    const recordsList = document.getElementById('borrow-records');
    if (!recordsList) return;

    const status = document.getElementById('borrow-status')?.value || '';
    let query = status ? `?status=${status}` : '';

    const result = await API.get(`/librarian/records${query}`);
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            recordsList.innerHTML = `
                <div class="text-gray-600">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p class="text-lg">No borrow records found</p>
                </div>
            `;
        } else {
            recordsList.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-blue-600 text-white">
                            <tr>
                                <th class="px-6 py-3 text-left">Student</th>
                                <th class="px-6 py-3 text-left">Book</th>
                                <th class="px-6 py-3 text-left">Borrow Date</th>
                                <th class="px-6 py-3 text-left">Due Date</th>
                                <th class="px-6 py-3 text-left">Status</th>
                                <th class="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${result.data.data.map(record => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4">
                                        <div>
                                            <p class="font-semibold">${record.student?.firstName} ${record.student?.lastName}</p>
                                            <p class="text-xs text-gray-500">${record.student?.studentID}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div>
                                            <p class="font-semibold">${record.book?.title}</p>
                                            <p class="text-xs text-gray-500">${record.book?.author}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm">${new Date(record.borrowDate).toLocaleDateString()}</td>
                                    <td class="px-6 py-4 text-sm">${new Date(record.dueDate).toLocaleDateString()}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold ${
                                            record.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                                            record.status === 'Returned' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }">${record.status}</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        ${record.status === 'Borrowed' || record.status === 'Overdue' ? 
                                            `<button onclick="returnBook('${record._id}')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                                                <i class="fas fa-undo mr-1"></i>Return
                                            </button>` : 
                                            '<span class="text-gray-400 text-sm">Returned</span>'
                                        }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } else {
        recordsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load records</p>
            </div>
        `;
    }
}

window.showBorrowBookModal = async function() {
    const booksResult = await API.get('/librarian/books');
    const studentsResult = await API.get('/dos/students');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">Borrow Book</h2>
            <form id="borrow-book-form">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Select Student *</label>
                    <select name="studentId" required class="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select Student</option>
                        ${studentsResult.success ? studentsResult.data.data.map(student => 
                            `<option value="${student._id}">${student.firstName} ${student.lastName} (${student.studentID})</option>`
                        ).join('') : ''}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Select Book *</label>
                    <select name="bookId" required class="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select Book</option>
                        ${booksResult.success ? booksResult.data.data.filter(b => b.availableQuantity > 0).map(book => 
                            `<option value="${book._id}">${book.title} - ${book.author} (${book.availableQuantity} available)</option>`
                        ).join('') : ''}
                    </select>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 font-bold mb-2">Due Date *</label>
                    <input type="date" name="dueDate" required class="w-full px-4 py-2 border rounded-lg" 
                        value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                        <i class="fas fa-hand-holding mr-2"></i>Borrow
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('borrow-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const result = await API.post('/librarian/borrow', data);
        
        if (result.success) {
            showNotification('Book borrowed successfully!', 'success');
            modal.remove();
            loadBorrowRecords();
        } else {
            showNotification('Failed to borrow book: ' + result.message, 'error');
        }
    });
};

window.returnBook = async function(recordId) {
    if (!confirm('Confirm book return?')) return;
    
    const result = await API.put(`/librarian/return/${recordId}`);
    
    if (result.success) {
        if (result.data.data.fine > 0) {
            showNotification(`Book returned. Fine: ${result.data.data.fine} RWF`, 'info');
        } else {
            showNotification('Book returned successfully!', 'success');
        }
        loadBorrowRecords();
    } else {
        showNotification('Failed to return book: ' + result.message, 'error');
    }
};

async function renderLibOverdue() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-red-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Overdue Books Tracking</h1>
            <p class="text-xl">Monitor and manage overdue returns</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="overdue-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-red-600"></i>
                <p class="mt-4">Loading overdue books...</p>
            </div>
        </div>
    `;
    
    loadOverdueBooks();
}

async function loadOverdueBooks() {
    const overdueList = document.getElementById('overdue-list');
    if (!overdueList) return;

    const result = await API.get('/librarian/overdue');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            overdueList.innerHTML = `
                <div class="text-green-600">
                    <i class="fas fa-check-circle text-4xl mb-4"></i>
                    <p class="text-lg">No overdue books! All returns are on time.</p>
                </div>
            `;
        } else {
            overdueList.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(record => {
                        const daysOverdue = Math.ceil((new Date() - new Date(record.dueDate)) / (1000 * 60 * 60 * 24));
                        const fine = daysOverdue * 100;
                        return `
                            <div class="bg-white rounded-lg shadow-lg p-6 text-left border-l-4 border-red-600">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 class="text-xl font-bold text-red-600">${record.student?.firstName} ${record.student?.lastName}</h3>
                                        <p class="text-sm text-gray-500">${record.student?.studentID}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-bold text-red-600">${daysOverdue}</p>
                                        <p class="text-xs text-gray-500">days late</p>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p class="font-bold text-gray-700 mb-2">${record.book?.title}</p>
                                    <p class="text-sm text-gray-600">By ${record.book?.author}</p>
                                    <p class="text-xs text-gray-500 mt-2">Due: ${new Date(record.dueDate).toLocaleDateString()}</p>
                                </div>

                                <div class="bg-red-50 p-3 rounded-lg mb-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-gray-700">Estimated Fine:</span>
                                        <span class="text-lg font-bold text-red-600">${fine} RWF</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">100 RWF per day overdue</p>
                                </div>

                                <div class="bg-blue-50 p-3 rounded-lg mb-4">
                                    <p class="text-sm font-semibold text-gray-700 mb-1">Parent Contact:</p>
                                    <p class="text-sm text-gray-600">${record.student?.parentName}</p>
                                    <p class="text-sm text-gray-600">${record.student?.parentPhone}</p>
                                </div>
                                
                                <button onclick="returnBook('${record._id}')" class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    <i class="fas fa-undo mr-2"></i>Process Return
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    } else {
        overdueList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load overdue books</p>
            </div>
        `;
    }
}

async function renderLibReports() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-green-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Library Reports & Statistics</h1>
            <p class="text-xl">Comprehensive library analytics</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <!-- Stats Cards -->
            <div id="library-stats" class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                    <i class="fas fa-spinner fa-spin text-3xl text-green-600"></i>
                </div>
            </div>

            <!-- Most Borrowed Books -->
            <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 class="text-2xl font-bold mb-6 text-orange-600"><i class="fas fa-trophy mr-2"></i>Top 10 Most Borrowed Books</h3>
                <div id="most-borrowed" class="text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-orange-600"></i>
                    <p class="mt-4">Loading...</p>
                </div>
            </div>
        </div>
    `;
    
    loadLibraryStats();
    loadMostBorrowed();
}

async function loadLibraryStats() {
    const statsContainer = document.getElementById('library-stats');
    if (!statsContainer) return;

    const result = await API.get('/librarian/stats');
    
    if (result.success && result.data.data) {
        const stats = result.data.data;
        statsContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <i class="fas fa-book text-3xl text-purple-600 mb-3"></i>
                <h3 class="text-3xl font-bold">${stats.totalBooks}</h3>
                <p class="text-gray-600">Total Books</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <i class="fas fa-check-circle text-3xl text-green-600 mb-3"></i>
                <h3 class="text-3xl font-bold">${stats.availableBooks}</h3>
                <p class="text-gray-600">Available</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <i class="fas fa-book-open text-3xl text-blue-600 mb-3"></i>
                <h3 class="text-3xl font-bold">${stats.borrowedBooks}</h3>
                <p class="text-gray-600">Borrowed</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-500">
                <i class="fas fa-exclamation-triangle text-3xl text-red-600 mb-3"></i>
                <h3 class="text-3xl font-bold">${stats.overdueBooks}</h3>
                <p class="text-gray-600">Overdue</p>
            </div>
        `;
    }
}

async function loadMostBorrowed() {
    const container = document.getElementById('most-borrowed');
    if (!container) return;

    const result = await API.get('/librarian/most-borrowed');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            container.innerHTML = `
                <p class="text-gray-600">No borrowing history yet</p>
            `;
        } else {
            container.innerHTML = `
                <div class="space-y-4">
                    ${result.data.data.map((book, index) => `
                        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl">
                                    ${index + 1}
                                </div>
                                <div class="text-left">
                                    <p class="font-bold text-gray-800">${book.title}</p>
                                    <p class="text-sm text-gray-600">${book.author}</p>
                                    <p class="text-xs text-gray-500">${book.category}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-orange-600">${book.borrowCount}</p>
                                <p class="text-xs text-gray-500">times borrowed</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// ============================================
// IT MANAGEMENT PAGES
// ============================================

// IT Users Management
async function renderITUsers() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-indigo-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">User Account Management</h1>
            <p class="text-xl">Manage all user accounts in the system</p>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-indigo-600 text-white">
                        <tr>
                            <th class="px-6 py-3 text-left">Name</th>
                            <th class="px-6 py-3 text-left">Email</th>
                            <th class="px-6 py-3 text-left">Role</th>
                            <th class="px-6 py-3 text-left">Created</th>
                            <th class="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-list" class="divide-y">
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center">
                                <i class="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
                                <p class="mt-4">Loading users...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    const result = await API.get('/it/users');
    const usersList = document.getElementById('users-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            usersList.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        No users found
                    </td>
                </tr>
            `;
        } else {
            usersList.innerHTML = result.data.data.map(user => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">${user.name}</td>
                    <td class="px-6 py-4">${user.email}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">${user.role}</span>
                    </td>
                    <td class="px-6 py-4">${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                        <button onclick="editITUser('${user._id}')" class="text-green-600 hover:text-green-800 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteITUser('${user._id}', '${user.name}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } else {
        usersList.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-red-600">
                    Error loading users: ${result.message || 'Unknown error'}
                </td>
            </tr>
        `;
    }
}

window.editITUser = async function(userId) {
    const result = await API.get(`/it/users/${userId}`);
    // Implementation for editing user
    showNotification('User editing functionality coming soon', 'info');
};

window.deleteITUser = async function(userId, userName) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    
    const result = await API.delete(`/it/users/${userId}`);
    if (result.success) {
        showNotification('User deleted successfully', 'success');
        renderITUsers();
    } else {
        showNotification('Failed to delete user: ' + result.message, 'error');
    }
};

// IT News Creation
async function renderITNews() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-orange-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Create News</h1>
            <button onclick="showCreateNewsModal()" class="bg-white text-orange-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Create New News
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="news-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-orange-600"></i>
                <p class="mt-4">Loading news...</p>
            </div>
        </div>
    `;
    
    // Get all news for IT management (including unpublished)
    const result = await API.get('/news?all=true');
    const newsList = document.getElementById('news-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            newsList.innerHTML = '<p class="text-gray-500">No news found. Create your first news!</p>';
        } else {
            newsList.innerHTML = `
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">` : 
                                `<div class="w-full h-48 bg-orange-100 flex items-center justify-center"><i class="fas fa-newspaper text-4xl text-orange-400"></i></div>`}
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2">${item.title}</h3>
                                <p class="text-sm text-gray-500 mb-2">${item.author || 'N/A'} - ${new Date(item.createdAt).toLocaleDateString()}</p>
                                <p class="text-xs mb-3">
                                    <span class="px-2 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                        ${item.published ? 'Published' : 'Draft'}
                                    </span>
                                </p>
                                <div class="flex gap-2">
                                    <button onclick="editITNews('${item._id || item.id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                        <i class="fas fa-edit mr-1"></i>Edit
                                    </button>
                                    <button onclick="deleteITNews('${item._id || item.id}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        newsList.innerHTML = `
            <div class="text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Unable to load news. ${result.message || 'Unknown error'}</p>
            </div>
        `;
    }
}

window.showCreateNewsModal = async function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-orange-600">Create News</h2>
            <form id="create-news-form" enctype="multipart/form-data">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Title *</label>
                        <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Content *</label>
                        <textarea name="content" required rows="6" class="w-full px-4 py-2 border rounded-lg"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Image</label>
                        <input type="file" name="image" accept="image/*" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Document</label>
                        <input type="file" name="document" accept=".pdf,.doc,.docx" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Category</label>
                        <select name="category" class="w-full px-4 py-2 border rounded-lg">
                            <option value="News">News</option>
                            <option value="Events">Events</option>
                            <option value="Announcements">Announcements</option>
                            <option value="Achievements">Achievements</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="published" id="published" checked class="mr-2">
                        <label for="published" class="text-gray-700">Publish immediately</label>
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Create News
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('create-news-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating...';
            
            // For now, we'll convert image to base64 or handle file upload
            // In production, you'd upload to a file server
            const data = {
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category') || 'News',
                published: formData.get('published') === 'on',
                author: currentUser?.name || 'Unknown'
            };
            
            // Handle file uploads
            const imageFile = formData.get('image');
            const documentFile = formData.get('document');
            
            // Handle image
            if (imageFile && imageFile.size > 0) {
                data.image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            }
            
            // Handle document
            if (documentFile && documentFile.size > 0) {
                const docData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(documentFile);
                });
                data.documents = [docData];
            }
            
            // Submit data
            const result = await API.post('/news', data);
            if (result.success) {
                showNotification('News created successfully!', 'success');
                modal.remove();
                renderITNews();
            } else {
                showNotification('Failed to create news: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error creating news:', error);
            showNotification('Failed to create news: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
};

window.editITNews = function(newsId) {
    showNotification('Edit news functionality coming soon', 'info');
};

window.deleteITNews = async function(newsId) {
    if (!confirm('Are you sure you want to delete this news?')) return;
    const result = await API.delete(`/news/${newsId}`);
    if (result.success) {
        showNotification('News deleted successfully', 'success');
        renderITNews();
    } else {
        showNotification('Failed to delete news: ' + result.message, 'error');
    }
};

// IT Announcements
async function renderITAnnouncements() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-yellow-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Create Announcements</h1>
            <button onclick="showCreateAnnouncementModal()" class="bg-white text-yellow-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Create New Announcement
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="announcements-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-yellow-600"></i>
                <p class="mt-4">Loading announcements...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/it/announcements');
    const announcementsList = document.getElementById('announcements-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            announcementsList.innerHTML = '<p class="text-gray-500">No announcements found. Create your first announcement!</p>';
        } else {
            announcementsList.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg p-6">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-bold">${item.title}</h3>
                                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${item.concerns}</span>
                            </div>
                            <p class="text-gray-600 mb-4">${item.content.substring(0, 100)}...</p>
                            <p class="text-sm text-gray-500 mb-4">${new Date(item.createdAt).toLocaleDateString()}</p>
                            <div class="flex gap-2">
                                <button onclick="editITAnnouncement('${item._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>
                                <button onclick="deleteITAnnouncement('${item._id}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

window.showCreateAnnouncementModal = async function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-yellow-600">Create Announcement</h2>
            <form id="create-announcement-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Title *</label>
                        <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Concerns *</label>
                        <select name="concerns" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select</option>
                            <option value="Parents">Parents</option>
                            <option value="Teachers">Teachers</option>
                            <option value="Staff">Staff</option>
                            <option value="Students">Students</option>
                            <option value="All">All</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Content *</label>
                        <textarea name="content" required rows="6" class="w-full px-4 py-2 border rounded-lg"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Image</label>
                        <input type="file" name="image" accept="image/*" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Documents</label>
                        <input type="file" name="documents" multiple accept=".pdf,.doc,.docx" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="published" id="announcement-published" checked class="mr-2">
                        <label for="announcement-published" class="text-gray-700">Publish immediately</label>
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Create Announcement
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('create-announcement-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            concerns: formData.get('concerns'),
            published: formData.get('published') === 'on'
        };
        
        // Handle file uploads
        const imageFile = formData.get('image');
        const documentFiles = formData.getAll('documents');
        
        const uploadFiles = async () => {
            // Handle image
            if (imageFile && imageFile.size > 0) {
                const reader = new FileReader();
                data.image = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageFile);
                });
            }
            
            // Handle documents
            if (documentFiles.length > 0) {
                data.documents = [];
                for (const file of documentFiles) {
                    if (file.size > 0) {
                        const reader = new FileReader();
                        const docData = await new Promise((resolve) => {
                            reader.onload = (e) => resolve(e.target.result);
                            reader.readAsDataURL(file);
                        });
                        data.documents.push(docData);
                    }
                }
            }
            
            // Submit data
            const result = await API.post('/it/announcements', data);
            if (result.success) {
                showNotification('Announcement created successfully!', 'success');
                modal.remove();
                renderITAnnouncements();
            } else {
                showNotification('Failed to create announcement: ' + result.message, 'error');
            }
        };
        
        uploadFiles();
    });
};

window.editITAnnouncement = function(id) {
    showNotification('Edit announcement functionality coming soon', 'info');
};

window.deleteITAnnouncement = async function(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    const result = await API.delete(`/it/announcements/${id}`);
    if (result.success) {
        showNotification('Announcement deleted successfully', 'success');
        renderITAnnouncements();
    } else {
        showNotification('Failed to delete announcement: ' + result.message, 'error');
    }
};

// IT Employee of Year
async function renderITEmployeeYear() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-purple-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Employee of the Year</h1>
            <button onclick="showCreateEmployeeYearModal()" class="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Add Employee of the Year
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div id="employee-year-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4">Loading employees of the year...</p>
            </div>
        </div>
    `;
    
    const result = await API.get('/it/employee-of-year');
    const employeeList = document.getElementById('employee-year-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            employeeList.innerHTML = '<p class="text-gray-500">No employees of the year found. Add your first one!</p>';
        } else {
            employeeList.innerHTML = `
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                            ${item.photo ? `<img src="${item.photo}" alt="${item.employeeName}" class="w-full h-64 object-cover">` : 
                                `<div class="w-full h-64 bg-purple-100 flex items-center justify-center"><i class="fas fa-user text-6xl text-purple-400"></i></div>`}
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2">${item.employeeName}</h3>
                                <p class="text-sm text-purple-600 mb-2">${item.employeeType} - ${item.year}</p>
                                <p class="text-gray-600 mb-4">${item.achievement.substring(0, 100)}...</p>
                                <div class="flex gap-2">
                                    <button onclick="editITEmployeeYear('${item._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                        <i class="fas fa-edit mr-1"></i>Edit
                                    </button>
                                    <button onclick="deleteITEmployeeYear('${item._id}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

window.showCreateEmployeeYearModal = async function() {
    const [teachersResult, usersResult] = await Promise.all([
        API.get('/dos/teachers').catch(() => ({ success: false, data: { data: [] } })),
        API.get('/it/users').catch(() => ({ success: false, data: { data: [] } }))
    ]);
    
    const staffUsers = usersResult.success ? usersResult.data.data.filter(u => 
        ['SM', 'DOS', 'DOD', 'IT', 'Librarian', 'Bursar', 'Patron', 'Matron'].includes(u.role)
    ) : [];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-purple-600">Add Employee of the Year</h2>
            <form id="create-employee-year-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Employee Type *</label>
                        <select name="employeeType" required id="employee-type-select" class="w-full px-4 py-2 border rounded-lg" onchange="updateEmployeeSelect(this.value)">
                            <option value="">Select Type</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    <div id="teacher-select-div" style="display:none;">
                        <label class="block text-gray-700 font-bold mb-2">Select Teacher *</label>
                        <select name="employee" id="teacher-select" class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Teacher</option>
                            ${teachersResult.success ? teachersResult.data.data.map(teacher => 
                                `<option value="${teacher._id}">${teacher.name}</option>`
                            ).join('') : ''}
                        </select>
                    </div>
                    <div id="staff-select-div" style="display:none;">
                        <label class="block text-gray-700 font-bold mb-2">Select Staff *</label>
                        <select name="employee" id="staff-select" class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Staff</option>
                            ${staffUsers.map(staff => 
                                `<option value="${staff._id}">${staff.name} (${staff.role})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Year *</label>
                        <input type="text" name="year" required value="${new Date().getFullYear()}" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Achievement *</label>
                        <textarea name="achievement" required rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Describe the achievement..."></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Photo</label>
                        <input type="file" name="photo" accept="image/*" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="published" id="employee-published" checked class="mr-2">
                        <label for="employee-published" class="text-gray-700">Publish immediately</label>
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Add Employee
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    window.updateEmployeeSelect = function(type) {
        const teacherDiv = document.getElementById('teacher-select-div');
        const staffDiv = document.getElementById('staff-select-div');
        const teacherSelect = document.getElementById('teacher-select');
        const staffSelect = document.getElementById('staff-select');
        
        if (type === 'Teacher') {
            teacherDiv.style.display = 'block';
            staffDiv.style.display = 'none';
            teacherSelect.required = true;
            staffSelect.required = false;
            staffSelect.value = ''; // Clear staff selection
        } else if (type === 'Staff') {
            teacherDiv.style.display = 'none';
            staffDiv.style.display = 'block';
            teacherSelect.required = false;
            staffSelect.required = true;
            teacherSelect.value = ''; // Clear teacher selection
        } else {
            teacherDiv.style.display = 'none';
            staffDiv.style.display = 'none';
            teacherSelect.required = false;
            staffSelect.required = false;
            teacherSelect.value = '';
            staffSelect.value = '';
        }
    };
    
    document.getElementById('create-employee-year-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
            
            const employeeType = formData.get('employeeType');
            
            // Get employee from the correct select based on type
            let employee = null;
            if (employeeType === 'Teacher') {
                employee = document.getElementById('teacher-select')?.value;
            } else if (employeeType === 'Staff') {
                employee = document.getElementById('staff-select')?.value;
            }
            
            // Validate employee selection
            if (!employee || employee === '' || employee === 'null' || employee === 'undefined') {
                showNotification('Please select an employee', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                return;
            }
            
            if (!employeeType) {
                showNotification('Please select an employee type', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                return;
            }
            
            const data = {
                employeeType: employeeType,
                employee: employee,
                year: formData.get('year'),
                achievement: formData.get('achievement'),
                published: formData.get('published') === 'on'
            };
            
            // Handle photo upload
            const photoFile = formData.get('photo');
            if (photoFile && photoFile.size > 0) {
                data.photo = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(photoFile);
                });
            }
            
            const result = await API.post('/it/employee-of-year', data);
            if (result.success) {
                showNotification('Employee of the year added successfully!', 'success');
                modal.remove();
                renderITEmployeeYear();
            } else {
                showNotification('Failed to add employee: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error adding employee of the year:', error);
            showNotification('Failed to add employee: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
};

window.editITEmployeeYear = function(id) {
    showNotification('Edit employee functionality coming soon', 'info');
};

window.deleteITEmployeeYear = async function(id) {
    if (!confirm('Are you sure you want to delete this employee of the year?')) return;
    const result = await API.delete(`/it/employee-of-year/${id}`);
    if (result.success) {
        showNotification('Employee deleted successfully', 'success');
        renderITEmployeeYear();
    } else {
        showNotification('Failed to delete employee: ' + result.message, 'error');
    }
};

// IT Page Content
async function renderITPageContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-teal-600 text-white py-12 text-center">
            <h1 class="text-4xl font-bold mb-4">Page Content Management</h1>
            <button onclick="showCreatePageContentModal()" class="bg-white text-teal-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition mt-4">
                <i class="fas fa-plus mr-2"></i>Add Page Content
            </button>
        </div>
        <div class="container mx-auto px-4 py-16">
            <div class="mb-6">
                <label class="block text-gray-700 font-bold mb-2">Filter by Page</label>
                <select id="page-filter" class="w-full md:w-64 px-4 py-2 border rounded-lg" onchange="filterPageContent(this.value)">
                    <option value="">All Pages</option>
                    <option value="Home">Home</option>
                    <option value="About">About</option>
                    <option value="Academics">Academics</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Contact">Contact</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div id="page-content-list" class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-teal-600"></i>
                <p class="mt-4">Loading page content...</p>
            </div>
        </div>
    `;
    
    loadPageContent();
}

async function loadPageContent(filterPage = '') {
    const result = await API.get(`/it/page-content${filterPage ? '?page=' + filterPage : ''}`);
    const contentList = document.getElementById('page-content-list');
    
    if (result.success && result.data.data) {
        if (result.data.data.length === 0) {
            contentList.innerHTML = '<p class="text-gray-500">No page content found. Add your first content!</p>';
        } else {
            contentList.innerHTML = `
                <div class="grid md:grid-cols-2 gap-6">
                    ${result.data.data.map(item => `
                        <div class="bg-white rounded-lg shadow-lg p-6">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-bold">${item.title}</h3>
                                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">${item.page}</span>
                            </div>
                            <p class="text-gray-600 mb-4">${item.content.substring(0, 150)}...</p>
                            <div class="flex gap-2">
                                <button onclick="editITPageContent('${item._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>
                                <button onclick="deleteITPageContent('${item._id}')" class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

window.filterPageContent = function(page) {
    loadPageContent(page);
};

window.showCreatePageContentModal = async function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6 text-teal-600">Add Page Content</h2>
            <form id="create-page-content-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Page *</label>
                        <select name="page" required class="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Page</option>
                            <option value="Home">Home</option>
                            <option value="About">About</option>
                            <option value="Academics">Academics</option>
                            <option value="Admissions">Admissions</option>
                            <option value="Contact">Contact</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Title *</label>
                        <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Content *</label>
                        <textarea name="content" required rows="8" class="w-full px-4 py-2 border rounded-lg"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Images</label>
                        <input type="file" name="images" multiple accept="image/*" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Documents</label>
                        <input type="file" name="documents" multiple accept=".pdf,.doc,.docx" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">Order</label>
                        <input type="number" name="order" value="0" class="w-full px-4 py-2 border rounded-lg">
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="published" id="content-published" checked class="mr-2">
                        <label for="content-published" class="text-gray-700">Publish immediately</label>
                    </div>
                </div>
                <div class="flex gap-4 mt-6">
                    <button type="submit" class="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-bold">
                        <i class="fas fa-save mr-2"></i>Add Content
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-bold">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('create-page-content-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
            
            const data = {
                page: formData.get('page'),
                title: formData.get('title'),
                content: formData.get('content'),
                order: parseInt(formData.get('order')) || 0,
                published: formData.get('published') === 'on'
            };
            
            // Handle multiple images
            const imageFiles = formData.getAll('images');
            if (imageFiles.length > 0 && imageFiles.some(f => f.size > 0)) {
                data.images = [];
                const validFiles = imageFiles.filter(f => f.size > 0);
                
                // Process all images in parallel
                const imagePromises = validFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });
                
                data.images = await Promise.all(imagePromises);
            }
            
            // Handle multiple documents
            const documentFiles = formData.getAll('documents');
            if (documentFiles.length > 0 && documentFiles.some(f => f.size > 0)) {
                data.documents = [];
                const validDocs = documentFiles.filter(f => f.size > 0);
                
                // Process all documents in parallel
                const docPromises = validDocs.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });
                
                data.documents = await Promise.all(docPromises);
            }
            
            const result = await API.post('/it/page-content', data);
            if (result.success) {
                showNotification('Page content added successfully!', 'success');
                modal.remove();
                renderITPageContent();
            } else {
                showNotification('Failed to add content: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error adding page content:', error);
            showNotification('Failed to add content: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
};

window.editITPageContent = function(id) {
    showNotification('Edit page content functionality coming soon', 'info');
};

window.deleteITPageContent = async function(id) {
    if (!confirm('Are you sure you want to delete this page content?')) return;
    const result = await API.delete(`/it/page-content/${id}`);
    if (result.success) {
        showNotification('Page content deleted successfully', 'success');
        renderITPageContent();
    } else {
        showNotification('Failed to delete content: ' + result.message, 'error');
    }
};

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
