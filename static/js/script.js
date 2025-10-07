// Custom JavaScript untuk Aplikasi Prediksi Nilai Ujian

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tooltips Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Form validation dan interaktivitas
    const form = document.getElementById('predictionForm');
    const hoursInput = document.getElementById('hours');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Real-time validation
    hoursInput.addEventListener('input', function() {
        validateInput();
    });

    // Form submission dengan loading state
    form.addEventListener('submit', function(e) {
        if (!validateInput()) {
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        showLoadingState();
        
        // Add to history after successful prediction
        setTimeout(() => {
            const resultElement = document.getElementById('predictionResult');
            if (resultElement) {
                addToHistory();
            }
        }, 1000);
    });

    // Validasi input
    function validateInput() {
        const value = parseFloat(hoursInput.value);
        const isValid = !isNaN(value) && value >= 0 && value <= 24;
        
        if (hoursInput.value === '') {
            hoursInput.classList.remove('is-valid', 'is-invalid');
            return false;
        }
        
        if (isValid) {
            hoursInput.classList.remove('is-invalid');
            hoursInput.classList.add('is-valid');
            return true;
        } else {
            hoursInput.classList.remove('is-valid');
            hoursInput.classList.add('is-invalid');
            return false;
        }
    }

    // Loading state
    function showLoadingState() {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memproses...';
        submitBtn.disabled = true;
        
        // Re-enable after 3 seconds (fallback)
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }

    // Auto-hide alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                alert.style.transition = 'opacity 0.5s ease';
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.remove();
                }, 500);
            }, 5000);
        }
    });

    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Number input formatting
    hoursInput.addEventListener('blur', function() {
        if (this.value && !isNaN(this.value)) {
            this.value = parseFloat(this.value).toFixed(1);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key untuk submit form
        if (e.key === 'Enter' && e.target === hoursInput) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
        
        // Escape key untuk clear form
        if (e.key === 'Escape') {
            form.reset();
            hoursInput.classList.remove('is-valid', 'is-invalid');
        }
    });

    // Copy result to clipboard (jika ada hasil)
    const resultElement = document.querySelector('.prediction-result h2');
    if (resultElement) {
        resultElement.style.cursor = 'pointer';
        resultElement.title = 'Klik untuk menyalin hasil';
        
        resultElement.addEventListener('click', function() {
            copyResult();
        });
    }

    // Toast notification function
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme);
    
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
        
        showToast(`Mode ${newTheme === 'dark' ? 'gelap' : 'terang'} diaktifkan`, 'success');
    });
    
    function updateDarkModeIcon(theme) {
        if (theme === 'dark') {
            darkModeIcon.className = 'fas fa-sun';
            darkModeToggle.title = 'Switch to Light Mode';
        } else {
            darkModeIcon.className = 'fas fa-moon';
            darkModeToggle.title = 'Switch to Dark Mode';
        }
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Halaman dimuat dalam ${loadTime}ms`);
        });
    }
});

// Global functions untuk copy dan export
function copyResult() {
    const resultElement = document.getElementById('predictionResult');
    if (resultElement) {
        const text = resultElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Hasil berhasil disalin!', 'success');
        }).catch(() => {
            showToast('Gagal menyalin hasil', 'error');
        });
    }
}

function exportResult() {
    const resultElement = document.getElementById('predictionResult');
    const hoursInput = document.getElementById('hours');
    
    if (resultElement && hoursInput) {
        const result = resultElement.textContent;
        const hours = hoursInput.value;
        const timestamp = new Date().toLocaleString('id-ID');
        
        // Create PDF content
        const pdfContent = `
            LAPORAN PREDIKSI NILAI UJIAN
            =============================
            
            Tanggal: ${timestamp}
            Jam Belajar: ${hours} jam/hari
            Hasil Prediksi: ${result}
            
            Model: Regresi Linear Sederhana
            Aplikasi: Prediksi Nilai Ujian
            
            ---
            Laporan ini dibuat secara otomatis oleh sistem.
        `;
        
        // Create and download file
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prediksi-nilai-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Laporan berhasil diunduh!', 'success');
    }
}

// History functions
function addToHistory() {
    const resultElement = document.getElementById('predictionResult');
    const hoursInput = document.getElementById('hours');
    
    if (resultElement && hoursInput) {
        const result = resultElement.textContent;
        const hours = hoursInput.value;
        const timestamp = new Date().toLocaleString('id-ID');
        
        const historyItem = {
            id: Date.now(),
            hours: hours,
            result: result,
            timestamp: timestamp
        };
        
        // Get existing history
        let history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
        
        // Add new item to beginning
        history.unshift(historyItem);
        
        // Keep only last 10 items
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('predictionHistory', JSON.stringify(history));
        
        // Update display
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    
    if (history.length > 0) {
        historySection.style.display = 'block';
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            historyItem.innerHTML = `
                <div>
                    <strong>${item.hours} jam/hari</strong> → ${item.result}
                    <br>
                    <small class="text-muted">${item.timestamp}</small>
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="removeHistoryItem(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            historyList.appendChild(historyItem);
        });
    } else {
        historySection.style.display = 'none';
    }
}

function removeHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('predictionHistory', JSON.stringify(history));
    updateHistoryDisplay();
    showToast('Item riwayat dihapus', 'success');
}

function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
        localStorage.removeItem('predictionHistory');
        updateHistoryDisplay();
        showToast('Semua riwayat dihapus', 'success');
    }
}

// Load history on page load
document.addEventListener('DOMContentLoaded', function() {
    updateHistoryDisplay();
});

// Service Worker untuk caching (opsional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker berhasil didaftarkan');
            })
            .catch(function(error) {
                console.log('ServiceWorker gagal didaftarkan');
            });
    });
}
