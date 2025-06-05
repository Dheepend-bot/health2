// Health Information Management System core logic

document.addEventListener('DOMContentLoaded', () => {
    // Section navigation
    window.showSection = function(sectionId) {
        document.querySelectorAll('main section').forEach(sec => {
            sec.classList.remove('active');
        });
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }

    // Patient records management
    const patientForm = document.getElementById('patientForm');
    const patientList = document.getElementById('patientList');
    let patients = JSON.parse(localStorage.getItem('patients') || '[]');

    function renderPatients() {
        if (!patients.length) {
            patientList.innerHTML = '<em>No patient records found.</em>';
            return;
        }
        patientList.innerHTML = patients.map((p, i) => `
            <div class="patient-card">
                <input type="checkbox" data-index="${i}" />
                <div>
                    <strong>${p.name}</strong> (ID: ${p.id})<br/>
                    DOB: ${p.dob} | Diagnosis: ${p.diagnosis}
                </div>
                <button onclick="deletePatient(${i})" aria-label="Delete patient">🗑️</button>
            </div>
        `).join('');
    }

    window.deletePatient = function(index) {
        if (confirm('Delete this patient record?')) {
            patients.splice(index, 1);
            localStorage.setItem('patients', JSON.stringify(patients));
            renderPatients();
            updateAnalytics();
        }
    };

    patientForm.onsubmit = function(e) {
        e.preventDefault();
        const newPatient = {
            name: document.getElementById('patientName').value.trim(),
            id: document.getElementById('patientId').value.trim(),
            dob: document.getElementById('dob').value,
            diagnosis: document.getElementById('diagnosis').value.trim()
        };
        patients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(patients));
        renderPatients();
        updateAnalytics();
        patientForm.reset();
    };

    // Analytics
    function updateAnalytics() {
        const analyticsContent = document.getElementById('analyticsContent');
        if (!patients.length) {
            analyticsContent.textContent = 'No data yet.';
            return;
        }
        const diagnosisCounts = {};
        patients.forEach(p => {
            diagnosisCounts[p.diagnosis] = (diagnosisCounts[p.diagnosis] || 0) + 1;
        });
        analyticsContent.innerHTML = `
            <strong>Total Patients:</strong> ${patients.length}<br/>
            <strong>Diagnosis Breakdown:</strong>
            <ul>
                ${Object.entries(diagnosisCounts).map(([diag, count]) => `<li>${diag}: ${count}</li>`).join('')}
            </ul>
        `;
    }

    // Data sharing (simulated)
    window.shareData = function() {
        const checkboxes = patientList.querySelectorAll('input[type="checkbox"]:checked');
        if (!checkboxes.length) {
            document.getElementById('sharingStatus').textContent = 'Select records to share.';
            return;
        }
        // Simulate secure sharing
        document.getElementById('sharingStatus').textContent = 'Sharing selected records securely with authorized providers...';
        setTimeout(() => {
            document.getElementById('sharingStatus').textContent = 'Data shared successfully!';
        }, 1200);
    };

    // Login modal logic and authentication
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Register modal logic
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // Add Account logic (now in profile section)
    const addAccountForm = document.getElementById('addAccountForm');
    const addAccountStatus = document.getElementById('addAccountStatus');
    if (addAccountForm) {
        addAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value.trim();
            const newPassword = document.getElementById('newPassword').value;
            if (!newUsername || !newPassword) {
                addAccountStatus.textContent = 'Please fill in all fields.';
                addAccountStatus.style.color = '#d32f2f';
                return;
            }
            if (accounts.some(acc => acc.username === newUsername)) {
                addAccountStatus.textContent = 'Username already exists.';
                addAccountStatus.style.color = '#d32f2f';
            } else {
                accounts.push({ username: newUsername, password: newPassword });
                saveAccounts();
                addAccountStatus.textContent = 'Account created successfully!';
                addAccountStatus.style.color = '#388e3c';
                addAccountForm.reset();
            }
        });
    }

    // Registration logic
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newUsername = document.getElementById('registerUsername').value.trim();
            const newPassword = document.getElementById('registerPassword').value;
            if (!newUsername || !newPassword) {
                registerError.textContent = 'Please fill in all fields.';
                registerError.style.color = '#d32f2f';
                return;
            }
            if (accounts.some(acc => acc.username === newUsername)) {
                registerError.textContent = 'Username already exists.';
                registerError.style.color = '#d32f2f';
            } else {
                accounts.push({ username: newUsername, password: newPassword });
                saveAccounts();
                registerError.textContent = 'Account created! You can now log in.';
                registerError.style.color = '#388e3c';
                setTimeout(() => {
                    registerModal.classList.remove('active');
                    registerModal.style.display = 'none';
                    loginModal.classList.add('active');
                    loginModal.style.display = 'flex';
                    registerForm.reset();
                    registerError.textContent = '';
                }, 1200);
            }
        });
    }

    // Account management (load/save accounts)
    let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    function saveAccounts() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    // Profile management
    let currentUser = null;

    // Login logic
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const user = accounts.find(acc => acc.username === username && acc.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginModal.classList.remove('active');
                loginModal.style.display = 'none';
                loginError.textContent = '';
                renderProfile();
            } else {
                loginError.textContent = 'Invalid username or password.';
            }
        });
    }

    // On page load, restore current user if available
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loginModal.classList.remove('active');
        loginModal.style.display = 'none';
        renderProfile();
    }

    // Render profile info
    function renderProfile() {
        const profileContent = document.getElementById('profileContent');
        if (!profileContent) return;
        if (currentUser) {
            profileContent.innerHTML = `
                <p><strong>Username:</strong> ${currentUser.username}</p>
                <button id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').onclick = function() {
                localStorage.removeItem('currentUser');
                currentUser = null;
                showSection('home');
                loginModal.classList.add('active');
                loginModal.style.display = 'flex';
            };
        } else {
            profileContent.innerHTML = '<p>You are not logged in.</p>';
        }
    }

    // Show registration modal
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        loginModal.style.display = 'none';
        registerModal.classList.add('active');
        registerModal.style.display = 'flex';
    });
    // Show login modal
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        registerModal.style.display = 'none';
        loginModal.classList.add('active');
        loginModal.style.display = 'flex';
    });

    // Appointment form logic
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.getElementById('appointmentList');
    let appointments = [];

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const appt = {
                patientId: document.getElementById('apptPatientId').value,
                date: document.getElementById('apptDate').value,
                time: document.getElementById('apptTime').value,
                reason: document.getElementById('apptReason').value
            };
            appointments.push(appt);
            renderAppointments();
            appointmentForm.reset();
        });
    }

    function renderAppointments() {
        if (!appointmentList) return;
        if (appointments.length === 0) {
            appointmentList.innerHTML = '<p>No appointments scheduled.</p>';
            return;
        }
        appointmentList.innerHTML = appointments.map((appt, i) => `
            <div class="appointment-card">
                <strong>Patient ID:</strong> ${appt.patientId} <br>
                <strong>Date:</strong> ${appt.date} <br>
                <strong>Time:</strong> ${appt.time} <br>
                <strong>Reason:</strong> ${appt.reason}
            </div>
        `).join('');
    }

    // Initial render
    renderPatients();
    updateAnalytics();
});
