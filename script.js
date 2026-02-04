// Enhanced State with Analysis
const state = {
    // Inputs
    isOwner: '',
    hasCRM: '',
    hasSales: '',
    social: '',
    niche: '',
    platform: '',
    goal: 0,
    check: 0,
    conv: 0,

    // Analysis Output
    riskLevel: 'LOW',
    leakAmount: 0,
    strengths: [],
    weaknesses: [],
    plan: []
};

// --- NAVIGATION ---
function nextStep(step, key, value) {
    state[key] = value;

    // Update progress
    const pct = step * 11;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('step-indicator').innerText = (step + 1) + ' / 9';

    // Slide transition
    document.getElementById('step-' + step).style.opacity = '0';
    setTimeout(() => {
        document.getElementById('step-' + step).classList.remove('active');
        document.getElementById('step-' + (step + 1)).classList.add('active');
    }, 300);
}

function validateAndNext(step, id) {
    const el = document.getElementById('input-' + id);
    if (!el.value) {
        el.parentElement.style.borderColor = '#f43f5e';
        return;
    }
    state[id] = el.value;
    nextStep(step, id, el.value);
}

function validateConversion() {
    const el = document.getElementById('input-conv');
    const wrapper = document.getElementById('conv-input-wrapper');
    const errorMsg = document.getElementById('conv-error-msg');

    // Parse value
    const val = parseFloat(el.value);

    // Strict Validation Rules:
    // 1. Must be a number (not empty, not NaN)
    // 2. Must be >= 0
    // 3. Must be <= 100
    if (!el.value || isNaN(val) || val < 0 || val > 100) {
        // ERROR STATE
        wrapper.classList.add('input-error');
        wrapper.style.borderColor = '#f43f5e';
        errorMsg.style.display = 'block';
        return; // BLOCK PROGRESS
    }

    // SUCCESS STATE
    wrapper.classList.remove('input-error');
    wrapper.style.borderColor = 'rgba(255, 255, 255, 0.08)'; // Reset
    errorMsg.style.display = 'none';

    // Proceed
    generateDashboard();
}

// --- ANALYSIS ENGINE ---
function generateDashboard() {
    // 1. Gather Final Data
    const el = document.getElementById('input-conv');
    state.conv = parseFloat(el.value); // Already validated
    state.goal = parseFloat(state.goal);
    state.check = parseFloat(state.check);

    // 2. Perform Audit
    analyzeBusiness();

    // 3. Switch to Dashboard
    document.getElementById('wizard-area').style.display = 'none';
    document.getElementById('top-nav').style.display = 'none';
    document.getElementById('dashboard-area').style.display = 'block';

    // 4. Populate UI
    renderDashboard();
}

function analyzeBusiness() {
    // Reset
    state.strengths = [];
    state.weaknesses = [];
    state.leakAmount = 0;

    // A. Infrastructure Analysis
    let totalPenalty = 0;

    if (state.hasCRM === 'yes') {
        state.strengths.push("CRM Tizimi aktiv (LTV nazoratda)");
    } else {
        state.weaknesses.push("Mijozlar bazasi yo'qotilmoqda");
        totalPenalty += 0.25; // 25% waste
    }

    if (state.hasSales === 'yes') {
        state.strengths.push("Sotuv bo'limi tizimlashgan");
    } else {
        state.weaknesses.push("Lidlarga operativ javob yo'q");
        totalPenalty += 0.25; // 25% waste
    }

    if (state.social === 'good') {
        state.strengths.push("Kuchli Ijtimoiy isbot (Social Proof)");
    } else if (state.social === 'bad') {
        state.weaknesses.push("Brendga ishonch past (Upakovka kerak)");
        totalPenalty += 0.15;
    }

    // B. Financial Constraints
    const clientsNeeded = Math.ceil(state.goal / state.check);
    const leadsNeeded = Math.ceil(clientsNeeded / (state.conv / 100));

    // C. Risk & Leak Calculation
    state.riskLevel = totalPenalty > 0.3 ? 'CRITICAL' : (totalPenalty > 0 ? 'MODERATE' : 'LOW');

    // Leak = Expected Revenue * Penalty. If Goal is 10k, and penalty is 50%, they are losing 5k potential.
    state.leakAmount = Math.round(state.goal * totalPenalty);

    // D. 30-Day Plan Generation
    state.plan = [];

    // Step 1: Fix the biggest hole
    if (state.hasCRM === 'no') {
        state.plan.push({
            title: "1-10 Kun: Raqamlashtirish",
            desc: "Barcha eski mijozlarni Excel yoki CRM ga kiritish. Yo'qotilgan bazani tiklash."
        });
    } else {
        state.plan.push({
            title: "1-10 Kun: Analitika",
            desc: "CRM voronkasidagi 'otkaz' sabablarini tahlil qilish va skriptni tuzatish."
        });
    }

    // Step 2: Traffic or Sales?
    if (state.hasSales === 'no') {
        state.plan.push({
            title: "11-20 Kun: Delegatsiya",
            desc: "Birinchi menejerni yollash va unga 'Call-script' yozib berish."
        });
    } else {
        state.plan.push({
            title: "11-20 Kun: Trafikni oshirish",
            desc: "Reklama byudjetini 20% ga oshirib, yangi kreativlarni test qilish."
        });
    }

    // Step 3: Scale
    state.plan.push({
        title: "21-30 Kun: Skalirlash",
        desc: "Muvaffaqiyatli kanallarga ko'proq pul tikish va LTV ustida ishlash."
    });
}

function renderDashboard() {
    // Date
    document.getElementById('current-date').innerText = new Date().toLocaleDateString();

    // Risk Analysis (Only stored in state, displayed via visual cues elsewhere if needed, or removed)
    // Note: User requested Button instead of Badge in header. We removed the badge HTML.

    // Money Leak
    document.getElementById('leak-amount').innerText = "$" + state.leakAmount.toLocaleString();
    if (state.leakAmount === 0) {
        document.getElementById('leak-desc').innerText = "Tizimingiz mukammalga yaqin. Yo'qotishlar minimal.";
    }

    // Metrics
    const clients = Math.ceil(state.goal / state.check);
    const leads = Math.ceil(clients / (state.conv / 100));
    const cpl = 1.5;
    const minBudget = Math.round(leads * cpl);
    const optBudget = Math.round(minBudget * 1.5);

    document.getElementById('d-goal').innerText = "$" + state.goal.toLocaleString();
    document.getElementById('d-clients').innerText = clients;
    document.getElementById('d-leads').innerText = leads;
    document.getElementById('d-budget').innerText = `$${minBudget} - $${optBudget}`;

    // Lists
    const sList = document.getElementById('list-strengths');
    sList.innerHTML = '';
    state.strengths.forEach(s => sList.innerHTML += `<li>${s}</li>`);
    if (state.strengths.length === 0) sList.innerHTML = '<li>Hozircha aniq ustunliklar yo\'q</li>';

    const wList = document.getElementById('list-weaknesses');
    wList.innerHTML = '';
    state.weaknesses.forEach(w => wList.innerHTML += `<li>${w}</li>`);
    if (state.weaknesses.length === 0) wList.innerHTML = '<li>Kritik xatolar topilmadi</li>';

    // Plan
    const pContainer = document.getElementById('action-plan');
    pContainer.innerHTML = '';
    state.plan.forEach((step, index) => {
        pContainer.innerHTML += `
            <div class="step-item">
                <div class="step-num">${index + 1}</div>
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
            </div>
        `;
    });
}

function contactExpert() {
    alert("Sizni 30 daqiqa ichida +998... raqamidan mutaxassisimiz bog'lanadi.");
}
