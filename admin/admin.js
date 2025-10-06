// Admin Panel JavaScript
let leaderboardData = [];
let filteredData = [];

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadLeaderboard();
    setupEventListeners();
    addLogoutButton();
});

function isAuthenticated() {
    const authenticated = sessionStorage.getItem('adminAuthenticated');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (!authenticated || authenticated !== 'true') {
        return false;
    }
    
    // Check if session is older than 24 hours
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            sessionStorage.removeItem('adminAuthenticated');
            sessionStorage.removeItem('loginTime');
            return false;
        }
    }
    
    return true;
}

function addLogoutButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.createElement('button');
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i>Logout';
    logoutBtn.className = 'ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors';
    logoutBtn.onclick = logout;
    refreshBtn.parentNode.appendChild(logoutBtn);
}

function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

function setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadLeaderboard);
    
    // Filter controls
    document.getElementById('quizFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
}

async function loadLeaderboard() {
    showLoadingState();
    
    try {
        const response = await fetch('/api/leaderboard');
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to load leaderboard');
        }
        
        leaderboardData = result.data || [];
        updateStatistics(result.stats || {});
        updateLastUpdated(result.lastUpdated);
        populateQuizFilter();
        applyFilters();
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showErrorState();
    }
}

function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('resultsTable').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function showErrorState() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
    document.getElementById('resultsTable').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function showResultsTable() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('resultsTable').classList.remove('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

function showEmptyState() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('resultsTable').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
}

function updateStatistics(stats) {
    const statsCards = document.getElementById('statsCards');
    statsCards.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <i class="fas fa-users text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Submissions</p>
                    <p class="text-2xl font-bold text-gray-900">${stats.totalSubmissions || 0}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <i class="fas fa-user-friends text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Unique Participants</p>
                    <p class="text-2xl font-bold text-gray-900">${stats.uniqueParticipants || 0}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i class="fas fa-chart-line text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Average Score</p>
                    <p class="text-2xl font-bold text-gray-900">${stats.averageScore || 0}%</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                    <i class="fas fa-trophy text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Highest Score</p>
                    <p class="text-2xl font-bold text-gray-900">${stats.highestScore || 0}%</p>
                </div>
            </div>
        </div>
    `;
}

function updateLastUpdated(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp);
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${date.toLocaleString()}`;
    }
}

function populateQuizFilter() {
    const quizFilter = document.getElementById('quizFilter');
    const uniqueQuizzes = [...new Set(leaderboardData.map(item => item.quiz))];
    
    // Clear existing options except "All Quizzes"
    quizFilter.innerHTML = '<option value="">All Quizzes</option>';
    
    uniqueQuizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz;
        option.textContent = quiz;
        quizFilter.appendChild(option);
    });
}

function applyFilters() {
    const quizFilter = document.getElementById('quizFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter data
    filteredData = leaderboardData.filter(item => {
        const matchesQuiz = !quizFilter || item.quiz === quizFilter;
        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm);
        return matchesQuiz && matchesSearch;
    });
    
    // Sort data
    filteredData.sort((a, b) => {
        switch (sortBy) {
            case 'score':
                if (b.percentage !== a.percentage) return b.percentage - a.percentage;
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'percentage':
                return b.percentage - a.percentage;
            case 'date':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return b.percentage - a.percentage;
        }
    });
    
    renderLeaderboard();
}

function renderLeaderboard() {
    if (filteredData.length === 0) {
        showEmptyState();
        return;
    }
    
    showResultsTable();
    
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        
        const rankBadge = getRankBadge(index + 1);
        const scoreBadge = getScoreBadge(item.percentage);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                ${rankBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span class="text-white font-semibold">${item.name.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${escapeHtml(item.name)}</div>
                        ${item.email ? `<div class="text-sm text-gray-500">${escapeHtml(item.email)}</div>` : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(item.quiz)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-semibold">${item.score}/${item.total}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${scoreBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(item.timestamp)}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function getRankBadge(rank) {
    let badgeClass = 'bg-gray-100 text-gray-800';
    let icon = '';
    
    if (rank === 1) {
        badgeClass = 'bg-yellow-100 text-yellow-800';
        icon = '<i class="fas fa-crown mr-1"></i>';
    } else if (rank === 2) {
        badgeClass = 'bg-gray-200 text-gray-800';
        icon = '<i class="fas fa-medal mr-1"></i>';
    } else if (rank === 3) {
        badgeClass = 'bg-orange-100 text-orange-800';
        icon = '<i class="fas fa-medal mr-1"></i>';
    }
    
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                ${icon}#${rank}
            </span>`;
}

function getScoreBadge(percentage) {
    let badgeClass = 'bg-red-100 text-red-800';
    
    if (percentage >= 90) {
        badgeClass = 'bg-green-100 text-green-800';
    } else if (percentage >= 80) {
        badgeClass = 'bg-blue-100 text-blue-800';
    } else if (percentage >= 70) {
        badgeClass = 'bg-yellow-100 text-yellow-800';
    } else if (percentage >= 60) {
        badgeClass = 'bg-orange-100 text-orange-800';
    }
    
    return `<span class="score-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                ${percentage.toFixed(1)}%
            </span>`;
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}