// ============================================
// MEDIA PEMBELAJARAN HEWAN KELAS 3 SD
// Dengan AI Text-to-Speech (TTS)
// ============================================

// ============================================
// TEXT-TO-SPEECH ENGINE
// ============================================

let isSpeaking = false;
let synth = window.speechSynthesis;
let currentUtterance = null;

function speak(text, rate = 0.85, pitch = 1.2) {
    if (synth.speaking) {
        synth.cancel();
    }

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Cari suara Bahasa Indonesia
    let voices = synth.getVoices();
    let indonesianVoice = voices.find(v =>
        v.lang === 'id-ID' || v.lang.startsWith('id')
    );

    // Fallback ke suara wanita jika tidak ada Indonesia
    if (!indonesianVoice) {
        indonesianVoice = voices.find(v =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('google')
        );
    }

    if (indonesianVoice) {
        utterance.voice = indonesianVoice;
    }

    utterance.lang = 'id-ID';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    utterance.onstart = () => {
        isSpeaking = true;
        document.querySelectorAll('.voice-btn, .voice-btn-small').forEach(btn => {
            btn.style.animation = 'pulse 0.5s ease-in-out infinite';
        });
    };

    utterance.onend = () => {
        isSpeaking = false;
        document.querySelectorAll('.voice-btn, .voice-btn-small').forEach(btn => {
            btn.style.animation = '';
        });
    };

    utterance.onerror = (e) => {
        console.log('Speech error:', e);
        isSpeaking = false;
    };

    currentUtterance = utterance;
    synth.speak(utterance);
}

// Pastikan voices sudah loaded
window.speechSynthesis.onvoiceschanged = function() {
    synth.getVoices();
};

// ============================================
// SPEECH FUNCTIONS
// ============================================

function speakIntro() {
    speak(
        "Halo teman-teman! Selamat datang di Dunia Hewan Seru! " +
        "Aku adalah asisten belajarmu. " +
        "Di sini kamu akan belajar tentang berbagai jenis hewan yang ada di dunia. " +
        "Ada tiga pilihan kegiatan untuk kamu. " +
        "Pertama, kamu bisa membaca Materi tentang jenis-jenis hewan. " +
        "Kedua, kamu bisa mengerjakan Kuis Seru untuk menguji pengetahuanmu. " +
        "Ketiga, kamu bisa bermain game Cocokkan Hewan yang seru! " +
        "Ayo mulai belajar! Kamu pasti bisa!",
        0.85, 1.3
    );
}

function speakMateri() {
    const activeTab = document.querySelector('.tab-content.active');
    const tabTitle = activeTab.querySelector('h3')?.textContent;
    const tabDesc = activeTab.querySelector('.materi-desc')?.textContent;

    speak(
        `Sekarang kita belajar tentang ${tabTitle}. ` +
        `${tabDesc}. ` +
        `Klik pada setiap gambar hewan untuk mendengar penjelasannya. ` +
        `Kamu juga bisa melihat ciri-ciri kelompok hewan ini di bawah ini!`,
        0.85, 1.3
    );
}

function speakAnimal(info) {
    speak(info, 0.9, 1.3);
}

function speakQuestion() {
    const qText = document.getElementById('q-text')?.textContent;
    if (qText) {
        speak("Perhatikan soal berikut ini. " + qText, 0.85, 1.3);
    }
}

function speakMatch() {
    speak(
        "Selamat datang di permainan Cocokkan Hewan! " +
        "Caranya mudah. " +
        "Pertama, klik hewan yang ingin kamu pilih. " +
        "Hewan yang sudah kamu pilih akan bergerak. " +
        "Lalu klik kotak kelompok yang sesuai untuk meletakkan hewan tersebut. " +
        "Kalau benar, kamu dapat poin! " +
        "Ayo coba sekarang!",
        0.85, 1.3
    );
}

function speakResult() {
    const score = document.getElementById('final-score')?.textContent;
    const correct = document.getElementById('r-correct')?.textContent;
    const wrong = document.getElementById('r-wrong')?.textContent;
    const badge = document.getElementById('badge-text')?.textContent;

    speak(
        `Kamu telah menyelesaikan kuis! ` +
        `Skor kamu adalah ${score} poin. ` +
        `Kamu berhasil menjawab ${correct} soal dengan benar, ` +
        `dan ${wrong} soal yang salah. ` +
        `Kamu mendapat gelar ${badge}! ` +
        `Terus semangat belajar ya! Kamu luar biasa!`,
        0.85, 1.3
    );
}

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Auto speak on page load
    if (pageId === 'page-intro') {
        // Update best score
        updateBestScore();
    }
    if (pageId === 'page-match') {
        initMatchGame();
    }
}

// ============================================
// TAB NAVIGATION (MATERI)
// ============================================

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`tab-${tabId}`)?.classList.add('active');

    // Activate button
    event.target.classList.add('active');

    // Speak tab info
    const tabNames = {
        mamalia: 'Mamalia adalah hewan yang menyusui anaknya. Contohnya sapi, kucing, gajah, dan lumba-lumba.',
        unggas: 'Unggas adalah hewan yang memiliki sayap dan bulu. Contohnya ayam, elang, bebek, dan merak.',
        reptil: 'Reptil adalah hewan melata dengan kulit bersisik. Contohnya buaya, ular, kura-kura, dan bunglon.',
        amfibi: 'Amfibi adalah hewan yang bisa hidup di dua tempat, darat dan air. Contohnya katak dan salamander.',
        ikan: 'Ikan adalah hewan yang hidup di air dan bernapas dengan insang. Contohnya ikan nemo, ikan hiu, dan ikan salmon.',
        serangga: 'Serangga adalah hewan kecil yang memiliki enam kaki. Contohnya kupu-kupu, lebah, semut, dan jangkrik.'
    };

    setTimeout(() => {
        if (tabNames[tabId]) {
            speak(tabNames[tabId], 0.85, 1.3);
        }
    }, 300);
}

// ============================================
// QUIZ DATA - 15 SOAL
// ============================================

const quizData = [
    {
        emoji: "🐄",
        question: "Sapi termasuk dalam kelompok hewan apa?",
        options: ["🐟 Ikan", "🐮 Mamalia", "🦎 Reptil", "🐦 Unggas"],
        correct: 1,
        explanation: "Sapi adalah hewan mamalia karena menyusui anaknya dan memiliki rambut/bulu di tubuhnya.",
        category: "Mamalia"
    },
    {
        emoji: "🐸",
        question: "Katak bisa hidup di darat DAN di air. Katak termasuk kelompok hewan...",
        options: ["🐟 Ikan", "🦎 Reptil", "🐸 Amfibi", "🦋 Serangga"],
        correct: 2,
        explanation: "Katak adalah amfibi! Kata 'amfibi' berarti 'dua kehidupan', yaitu di darat dan di air.",
        category: "Amfibi"
    },
    {
        emoji: "🦅",
        question: "Elang memiliki bulu, sayap, dan bertelur. Elang termasuk kelompok...",
        options: ["🐮 Mamalia", "🐦 Unggas/Aves", "🦎 Reptil", "🐸 Amfibi"],
        correct: 1,
        explanation: "Elang adalah unggas (aves) karena memiliki bulu, sayap, dan berkembang biak dengan bertelur.",
        category: "Unggas"
    },
    {
        emoji: "🐍",
        question: "Ular memiliki kulit bersisik dan berdarah dingin. Ular termasuk...",
        options: ["🦋 Serangga", "🐸 Amfibi", "🐦 Unggas", "🦎 Reptil"],
        correct: 3,
        explanation: "Ular adalah reptil karena memiliki kulit bersisik kering dan berdarah dingin.",
        category: "Reptil"
    },
    {
        emoji: "🦋",
        question: "Kupu-kupu memiliki 6 kaki dan 2 sayap. Kupu-kupu termasuk...",
        options: ["🦋 Serangga", "🐦 Unggas", "🐸 Amfibi", "🐮 Mamalia"],
        correct: 0,
        explanation: "Kupu-kupu adalah serangga karena memiliki 6 kaki, 3 bagian tubuh, dan antena.",
        category: "Serangga"
    },
    {
        emoji: "🐠",
        question: "Ikan bernapas menggunakan...",
        options: ["🫁 Paru-paru", "🫧 Insang", "👃 Hidung", "🐚 Cangkang"],
        correct: 1,
        explanation: "Ikan bernapas menggunakan insang yang bisa mengambil oksigen dari dalam air.",
        category: "Ikan"
    },
    {
        emoji: "🐬",
        question: "Lumba-lumba hidup di laut, tetapi lumba-lumba termasuk kelompok...",
        options: ["🐟 Ikan", "🐮 Mamalia", "🦎 Reptil", "🐸 Amfibi"],
        correct: 1,
        explanation: "Lumba-lumba adalah mamalia laut! Ia menyusui anaknya dan bernapas dengan paru-paru.",
        category: "Mamalia"
    },
    {
        emoji: "🥚",
        question: "Hewan manakah yang TIDAK berkembang biak dengan bertelur?",
        options: ["🐊 Buaya", "🐔 Ayam", "🐘 Gajah", "🐍 Ular"],
        correct: 2,
        explanation: "Gajah adalah mamalia yang melahirkan anaknya (vivipar), bukan bertelur!",
        category: "Mamalia"
    },
    {
        emoji: "🐢",
        question: "Kura-kura memiliki tempurung/cangkang. Kura-kura termasuk kelompok...",
        options: ["🦎 Reptil", "🐮 Mamalia", "🐸 Amfibi", "🐟 Ikan"],
        correct: 0,
        explanation: "Kura-kura adalah reptil karena berdarah dingin, kulitnya bersisik, dan bernapas dengan paru-paru.",
        category: "Reptil"
    },
    {
        emoji: "🐝",
        question: "Lebah menghasilkan madu yang manis. Lebah termasuk kelompok...",
        options: ["🐦 Unggas", "🐮 Mamalia", "🦋 Serangga", "🐟 Ikan"],
        correct: 2,
        explanation: "Lebah adalah serangga karena memiliki 6 kaki, tubuh berbuku-buku, dan antena.",
        category: "Serangga"
    },
    {
        emoji: "🦇",
        question: "Kelelawar bisa terbang, tetapi kelelawar termasuk...",
        options: ["🐦 Unggas", "🐮 Mamalia", "🦋 Serangga", "🦎 Reptil"],
        correct: 1,
        explanation: "Meskipun bisa terbang, kelelawar adalah mamalia karena menyusui anaknya dan tubuhnya berbulu.",
        category: "Mamalia"
    },
    {
        emoji: "🐊",
        question: "Buaya sering berendam di air tetapi bernapas dengan paru-paru. Buaya termasuk...",
        options: ["🐟 Ikan", "🐸 Amfibi", "🦎 Reptil", "🐮 Mamalia"],
        correct: 2,
        explanation: "Buaya adalah reptil! Ia berdarah dingin, kulitnya bersisik tebal, dan bertelur.",
        category: "Reptil"
    },
    {
        emoji: "🦚",
        question: "Merak memiliki bulu yang sangat indah. Merak termasuk kelompok...",
        options: ["🐮 Mamalia", "🦋 Serangga", "🐦 Unggas/Aves", "🦎 Reptil"],
        correct: 2,
        explanation: "Merak adalah unggas (aves) karena memiliki bulu, sayap, dan bertelur seperti burung lainnya.",
        category: "Unggas"
    },
    {
        emoji: "🐟",
        question: "Hewan manakah yang bernapas dengan insang?",
        options: ["🐸 Katak", "🐟 Ikan Salmon", "🐬 Lumba-lumba", "🐊 Buaya"],
        correct: 1,
        explanation: "Ikan salmon bernapas dengan insang. Katak, lumba-lumba, dan buaya bernapas dengan paru-paru.",
        category: "Ikan"
    },
    {
        emoji: "🦁",
        question: "Singa menyusui anaknya dan tubuhnya berbulu. Singa termasuk...",
        options: ["🦎 Reptil", "🐸 Amfibi", "🐮 Mamalia", "🐦 Unggas"],
        correct: 2,
        explanation: "Singa adalah mamalia karena menyusui anaknya, tubuhnya berbulu, dan berdarah panas.",
        category: "Mamalia"
    }
];

// ============================================
// QUIZ ENGINE
// ============================================

let currentQuiz = {
    questions: [],
    currentIndex: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    timer: null,
    timeLeft: 30,
    answered: false
};

let bestScore = parseInt(localStorage.getItem('bestScore') || '0');

function updateBestScore() {
    document.getElementById('best-score').textContent = bestScore;
}

function startQuiz() {
    // Shuffle questions
    let shuffled = [...quizData].sort(() => Math.random() - 0.5);
    currentQuiz.questions = shuffled.slice(0, 15);
    currentQuiz.currentIndex = 0;
    currentQuiz.score = 0;
    currentQuiz.correct = 0;
    currentQuiz.wrong = 0;
    currentQuiz.answered = false;

    document.getElementById('q-total').textContent = currentQuiz.questions.length;
    document.getElementById('current-score').textContent = '0';
    document.getElementById('correct-count').textContent = '0';

    showPage('page-quiz');
    loadQuestion();

    // Speak intro
    setTimeout(() => {
        speak(
            "Ayo kita mulai kuisnya! " +
            "Ada lima belas soal yang harus kamu jawab. " +
            "Setiap soal ada waktu tiga puluh detik. " +
            "Pilih jawaban yang benar dan kumpulkan poin sebanyak-banyaknya. Semangat!",
            0.85, 1.3
        );
    }, 500);
}

// ============================================
// LOAD QUESTION
// ============================================

function loadQuestion() {
    if (currentQuiz.currentIndex >= currentQuiz.questions.length) {
        showResult();
        return;
    }

    const q = currentQuiz.questions[currentQuiz.currentIndex];
    currentQuiz.answered = false;

    // Update header stats
    document.getElementById('q-badge').textContent = `Soal ${currentQuiz.currentIndex + 1}`;
    document.getElementById('q-emoji').textContent = q.emoji;
    document.getElementById('q-text').textContent = q.question;
    document.getElementById('q-num').textContent = currentQuiz.currentIndex + 1;

    // Build options
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(idx);
        container.appendChild(btn);
    });

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Reset & start timer
    clearInterval(currentQuiz.timer);
    currentQuiz.timeLeft = 30;
    updateTimerDisplay();
    currentQuiz.timer = setInterval(() => {
        currentQuiz.timeLeft--;
        updateTimerDisplay();
        if (currentQuiz.timeLeft <= 0) {
            clearInterval(currentQuiz.timer);
            if (!currentQuiz.answered) {
                timeOut();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const el = document.getElementById('timer-count');
    if (el) {
        el.textContent = currentQuiz.timeLeft;
        el.style.color = currentQuiz.timeLeft <= 10 ? '#e74c3c' : '';
    }
}

function timeOut() {
    currentQuiz.answered = true;
    currentQuiz.wrong++;

    const q = currentQuiz.questions[currentQuiz.currentIndex];

    // Mark correct answer green
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correct) btn.classList.add('correct');
    });

    showFeedback(false, '⏰ Waktu habis!', q.explanation);
    speak("Waktu habis! Jawaban yang benar adalah pilihan nomor " + (q.correct + 1) + ". " + q.explanation, 0.9, 1.3);
}

// ============================================
// SELECT ANSWER
// ============================================

function selectAnswer(selectedIdx) {
    if (currentQuiz.answered) return;
    currentQuiz.answered = true;
    clearInterval(currentQuiz.timer);

    const q = currentQuiz.questions[currentQuiz.currentIndex];
    const isCorrect = selectedIdx === q.correct;

    // Style buttons
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correct) btn.classList.add('correct');
        else if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
        const points = Math.max(10, currentQuiz.timeLeft * 3);
        currentQuiz.score += points;
        currentQuiz.correct++;
        document.getElementById('current-score').textContent = currentQuiz.score;
        document.getElementById('correct-count').textContent = currentQuiz.correct;
        showFeedback(true, '🎉 Benar! +' + points + ' poin', q.explanation);
        speak("Hebat! Jawaban kamu benar! " + q.explanation, 0.9, 1.3);
        launchConfetti();
    } else {
        currentQuiz.wrong++;
        showFeedback(false, '❌ Kurang tepat...', q.explanation);
        speak("Sayang sekali, jawaban kurang tepat. " + q.explanation, 0.9, 1.3);
    }
}

function showFeedback(isCorrect, title, explanation) {
    const fb = document.getElementById('feedback');
    const icon = document.getElementById('feedback-icon');
    const text = document.getElementById('feedback-text');
    const explain = document.getElementById('feedback-explain');

    icon.textContent = isCorrect ? '✅' : '❌';
    text.textContent = title;
    text.style.color = isCorrect ? '#27ae60' : '#e74c3c';
    explain.textContent = explanation;
    fb.style.display = 'block';
}

// ============================================
// NEXT QUESTION
// ============================================

function nextQuestion() {
    currentQuiz.currentIndex++;
    loadQuestion();
}

// ============================================
// SHOW RESULT
// ============================================

function showResult() {
    clearInterval(currentQuiz.timer);

    const total = currentQuiz.questions.length;
    const correct = currentQuiz.correct;
    const score = currentQuiz.score;
    const stars = Math.round((correct / total) * 5);

    // Save best score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    // Determine badge
    let mascot, title, subtitle, badgeIcon, badgeText;
    if (correct >= 13) {
        mascot = '🏆'; title = 'Luar Biasa!'; subtitle = 'Kamu adalah Juara Hewan!';
        badgeIcon = '🥇'; badgeText = 'Juara Kelas!';
    } else if (correct >= 10) {
        mascot = '🌟'; title = 'Kerja Bagus!'; subtitle = 'Kamu sangat pandai!';
        badgeIcon = '🥈'; badgeText = 'Bintang Pelajar';
    } else if (correct >= 7) {
        mascot = '👍'; title = 'Bagus!'; subtitle = 'Terus belajar ya!';
        badgeIcon = '🥉'; badgeText = 'Pejuang Belajar';
    } else {
        mascot = '💪'; title = 'Semangat!'; subtitle = 'Belajar lagi pasti bisa!';
        badgeIcon = '📚'; badgeText = 'Rajin Belajar';
    }

    document.getElementById('result-mascot').textContent = mascot;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-subtitle').textContent = subtitle;
    document.getElementById('final-score').textContent = score;
    document.getElementById('r-correct').textContent = correct;
    document.getElementById('r-wrong').textContent = currentQuiz.wrong;
    document.getElementById('r-stars').textContent = stars;
    document.getElementById('badge-icon').textContent = badgeIcon;
    document.getElementById('badge-text').textContent = badgeText;

    // Render stars
    const starEl = document.getElementById('star-rating');
    starEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        starEl.innerHTML += `<span class="star ${i < stars ? 'lit' : ''}">${i < stars ? '⭐' : '☆'}</span>`;
    }

    showPage('page-result');
    setTimeout(() => {
        launchConfetti();
        speakResult();
    }, 500);
}

// ============================================
// CONFETTI
// ============================================

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 4,
        d: Math.random() * 80 + 20,
        color: `hsl(${Math.random() * 360},90%,60%)`,
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
        tiltSpeed: Math.random() * 0.1 + 0.05
    }));

    let frame = 0;
    const maxFrames = 120;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.tiltAngle += p.tiltSpeed;
            p.y += (Math.cos(frame / 20) + p.d / 40);
            p.tilt = Math.sin(p.tiltAngle) * 12;
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.ellipse(p.x + p.tilt, p.y, p.r / 2, p.r, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        frame++;
        if (frame < maxFrames) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    draw();
}

// ============================================
// MATCH GAME
// ============================================

const matchAnimals = [
    { emoji: '🐄', name: 'Sapi',       category: 'Mamalia' },
    { emoji: '🐯', name: 'Harimau',    category: 'Mamalia' },
    { emoji: '🐔', name: 'Ayam',       category: 'Unggas'  },
    { emoji: '🦅', name: 'Elang',      category: 'Unggas'  },
    { emoji: '🐍', name: 'Ular',       category: 'Reptil'  },
    { emoji: '🐢', name: 'Kura-kura',  category: 'Reptil'  },
    { emoji: '🐟', name: 'Ikan Mas',   category: 'Ikan'    },
    { emoji: '🦈', name: 'Hiu',        category: 'Ikan'    },
    { emoji: '🦋', name: 'Kupu-kupu',  category: 'Serangga'},
    { emoji: '🐝', name: 'Lebah',      category: 'Serangga'}
];

let matchState = {
    selected: null,
    score: 0,
    correct: 0,
    placed: []
};

function initMatchGame() {
    matchState = { selected: null, score: 0, correct: 0, placed: [] };

    document.getElementById('match-score').textContent = '0';
    document.getElementById('match-correct').textContent = '0';

    // Render animals
    const container = document.getElementById('match-animals');
    container.innerHTML = '';
    const shuffled = [...matchAnimals].sort(() => Math.random() - 0.5);
    shuffled.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'match-animal-card';
        card.id = `animal-${animal.name.replace(/\s/g, '_')}`;
        card.dataset.name = animal.name;
        card.dataset.category = animal.category;
        card.innerHTML = `<div class="ma-emoji">${animal.emoji}</div><div class="ma-name">${animal.name}</div>`;
        card.onclick = () => selectMatchAnimal(card, animal);
        container.appendChild(card);
    });

    // Clear drop zones
    ['mamalia','unggas','reptil','ikan','serangga'].forEach(cat => {
        const zone = document.getElementById(`drop-${cat}`);
        zone.innerHTML = '<span class="drop-hint">Taruh di sini</span>';
    });

    setTimeout(() => speakMatch(), 400);
}

function selectMatchAnimal(card, animal) {
    if (matchState.placed.includes(animal.name)) return;

    // Deselect previous
    document.querySelectorAll('.match-animal-card').forEach(c => c.classList.remove('selected'));

    matchState.selected = animal;
    card.classList.add('selected');
    speak(`${animal.name}. Masuk kelompok apa ya?`, 0.9, 1.3);
}

function dropAnimal(categoryName) {
    if (!matchState.selected) {
        speak('Pilih dulu hewannya ya!', 0.9, 1.3);
        return;
    }

    const animal = matchState.selected;
    const isCorrect = animal.category === categoryName;
    const zoneKey = categoryName.toLowerCase();
    const zone = document.getElementById(`drop-${zoneKey}`);

    if (!zone) return;

    // Remove hint if present
    const hint = zone.querySelector('.drop-hint');
    if (hint) hint.remove();

    // Add chip to drop zone
    const chip = document.createElement('div');
    chip.className = `dropped-chip ${isCorrect ? 'chip-correct' : 'chip-wrong'}`;
    chip.textContent = `${animal.emoji} ${animal.name}`;
    zone.appendChild(chip);

    // Update source card
    const srcCard = document.getElementById(`animal-${animal.name.replace(/\s/g, '_')}`);
    if (srcCard) {
        srcCard.classList.remove('selected');
        srcCard.classList.add(isCorrect ? 'placed-correct' : 'placed-wrong');
        srcCard.onclick = null;
    }

    matchState.placed.push(animal.name);
    matchState.selected = null;

    if (isCorrect) {
        matchState.score += 10;
        matchState.correct++;
        document.getElementById('match-score').textContent = matchState.score;
        document.getElementById('match-correct').textContent = matchState.correct;
        speak(`Benar! ${animal.name} memang termasuk ${categoryName}. Bagus sekali!`, 0.9, 1.3);
        launchConfetti();
    } else {
        speak(`Hmm, belum tepat. ${animal.name} sebenarnya termasuk ${animal.category}.`, 0.9, 1.3);
    }

    // All placed?
    if (matchState.placed.length === matchAnimals.length) {
        setTimeout(() => {
            speak(
                `Selamat! Kamu sudah mencocokkan semua hewan! ` +
                `Skor kamu adalah ${matchState.score} poin. ` +
                `Kamu berhasil mencocokkan ${matchState.correct} dari ${matchAnimals.length} hewan dengan benar. Hebat!`,
                0.85, 1.3
            );
            launchConfetti();
        }, 800);
    }
}

function resetMatch() {
    initMatchGame();
}