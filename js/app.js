/**
 * Wellspring University LMS - Main Controller & Application Logic
 */

class LMSApp {
  constructor() {
    this.currentUser = null;
    this.activeTab = "overview";
    this.activeCourse = null;
    this.activeQuizState = null;
    this.quizTimerInterval = null;
    
    // Load persisted state or clone default data
    this.initData();
  }

  initData() {
    const storedData = localStorage.getItem("welsu_lms_data");
    if (storedData) {
      try {
        this.data = JSON.parse(storedData);
        if (!this.data.studentSubmissions) this.data.studentSubmissions = LMS_DATA.studentSubmissions;
        if (!this.data.studentRoster) this.data.studentRoster = LMS_DATA.studentRoster;
      } catch (e) {
        this.data = LMS_DATA;
      }
    } else {
      this.data = LMS_DATA;
      this.saveData();
    }
  }

  saveData() {
    localStorage.setItem("welsu_lms_data", JSON.stringify(this.data));
  }

  init() {
    // Check auth session
    const savedUser = localStorage.getItem("welsu_lms_user");
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    this.bindEvents();
    this.updateAuthStateUI();
    this.renderCatalog();
    this.renderDashboard();
    this.refreshIcons();
  }

  bindEvents() {
    // Login modal toggles
    document.querySelectorAll("[data-action='open-login']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const role = e.currentTarget.getAttribute("data-role") || "student";
        this.openLoginModal(role);
      });
    });

    document.querySelectorAll("[data-action='close-login']").forEach(btn => {
      btn.addEventListener("click", () => this.closeLoginModal());
    });

    // Quick demo login buttons
    const demoStudentBtn = document.getElementById("demo-student-login");
    if (demoStudentBtn) {
      demoStudentBtn.addEventListener("click", () => this.performLogin(this.data.studentProfile));
    }

    const demoFacultyBtn = document.getElementById("demo-faculty-login");
    if (demoFacultyBtn) {
      demoFacultyBtn.addEventListener("click", () => this.performLogin(this.data.facultyProfile));
    }

    // Login Form Submit
    const loginForm = document.getElementById("lms-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const role = document.getElementById("login-role-select").value;
        const profile = role === "faculty" ? this.data.facultyProfile : this.data.studentProfile;
        this.performLogin(profile);
      });
    }

    // Logout Button
    const logoutBtn = document.getElementById("logout-button");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Tab Navigation Buttons
    document.querySelectorAll("[data-tab]").forEach(tabBtn => {
      tabBtn.addEventListener("click", (e) => {
        const targetTab = e.currentTarget.getAttribute("data-tab");
        this.switchTab(targetTab);
      });
    });

    // Course Search in Catalog
    const catalogSearchInput = document.getElementById("catalog-search");
    if (catalogSearchInput) {
      catalogSearchInput.addEventListener("input", (e) => {
        this.renderCatalog(e.target.value);
      });
    }

    // Category Filter Buttons
    document.querySelectorAll("[data-category-filter]").forEach(filterBtn => {
      filterBtn.addEventListener("click", (e) => {
        document.querySelectorAll("[data-category-filter]").forEach(b => b.classList.remove("bg-blue-600", "text-white"));
        e.currentTarget.classList.add("bg-blue-600", "text-white");
        const category = e.currentTarget.getAttribute("data-category-filter");
        this.renderCatalog(document.getElementById("catalog-search")?.value || "", category);
      });
    });
  }

  openLoginModal(role = "student") {
    const modal = document.getElementById("login-modal");
    const roleSelect = document.getElementById("login-role-select");
    if (roleSelect) roleSelect.value = role;
    if (modal) {
      modal.classList.remove("modal-hidden");
      document.body.style.overflow = "hidden";
    }
  }

  closeLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) {
      modal.classList.add("modal-hidden");
      document.body.style.overflow = "";
    }
  }

  performLogin(userProfile) {
    this.currentUser = userProfile;
    localStorage.setItem("welsu_lms_user", JSON.stringify(userProfile));
    this.closeLoginModal();
    if (userProfile.role === "faculty" || userProfile.role === "lecturer") {
      window.location.href = "lecturer-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("welsu_lms_user");
    window.location.href = "login.html";
  }

  updateAuthStateUI() {
    const landingView = document.getElementById("landing-view");
    const dashboardView = document.getElementById("dashboard-view");
    const navLoginBtns = document.querySelectorAll(".nav-public-only");
    const navAuthBtns = document.querySelectorAll(".nav-auth-only");

    if (this.currentUser) {
      if (landingView) landingView.classList.add("hidden");
      if (dashboardView) dashboardView.classList.remove("hidden");
      navLoginBtns.forEach(el => el.classList.add("hidden"));
      navAuthBtns.forEach(el => el.classList.remove("hidden"));

      // Update User Info Labels
      document.querySelectorAll(".user-name-label").forEach(el => el.textContent = this.currentUser.name);
      document.querySelectorAll(".user-email-label").forEach(el => el.textContent = this.currentUser.email);
      document.querySelectorAll(".user-id-label").forEach(el => el.textContent = this.currentUser.id);
      document.querySelectorAll(".user-avatar-img").forEach(img => img.src = this.currentUser.avatar);

      this.renderDashboard();
    } else {
      if (landingView) landingView.classList.remove("hidden");
      if (dashboardView) dashboardView.classList.add("hidden");
      navLoginBtns.forEach(el => el.classList.remove("hidden"));
      navAuthBtns.forEach(el => el.classList.add("hidden"));
    }

    this.refreshIcons();
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update active tab buttons
    document.querySelectorAll("[data-tab]").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("nav-tab-active");
      } else {
        btn.classList.remove("nav-tab-active");
      }
    });

    // Hide all tab sections
    document.querySelectorAll(".tab-content-section").forEach(sec => {
      sec.classList.add("hidden");
    });

    // Show active tab section
    const targetSection = document.getElementById(`tab-section-${tabId}`);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }

    // Refresh specific tab view
    if (tabId === "courses") this.renderEnrolledCourses();
    if (tabId === "catalog") this.renderCatalog();
    if (tabId === "quizzes") this.renderQuizzesTab();
    if (tabId === "assignments") this.renderAssignmentsTab();
    if (tabId === "gradebook") this.renderGradebookTab();

    // Lecturer Tabs
    if (tabId === "taught-courses") this.renderLecturerTaughtCourses();
    if (tabId === "submissions") this.renderLecturerGradingHub();
    if (tabId === "roster") this.renderLecturerRoster();

    this.refreshIcons();
  }

  renderDashboard() {
    if (this.currentUser && (this.currentUser.role === 'faculty' || this.currentUser.role === 'lecturer')) {
      this.renderLecturerDashboard();
    } else {
      this.renderOverview();
      this.renderEnrolledCourses();
      this.renderQuizzesTab();
      this.renderAssignmentsTab();
      this.renderGradebookTab();
    }
  }

  renderOverview() {
    // GPA & Metrics
    const gpaDisplay = document.getElementById("overview-gpa");
    if (gpaDisplay) gpaDisplay.textContent = this.data.studentProfile.gpa;

    const courseCount = document.getElementById("overview-course-count");
    if (courseCount) courseCount.textContent = this.data.courses.length;

    // Recent Course Progress List
    const progressContainer = document.getElementById("overview-progress-list");
    if (progressContainer) {
      progressContainer.innerHTML = this.data.courses.map(course => `
        <div class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              ${course.code.substring(0, 3)}
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm">${course.code}: ${course.title}</h4>
              <p class="text-xs text-gray-500">${course.instructor} • ${course.credits} Credits</p>
            </div>
          </div>
          <div class="w-full md:w-48 flex items-center gap-3">
            <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div class="bg-blue-600 h-2 rounded-full" style="width: ${course.progress}%"></div>
            </div>
            <span class="text-xs font-bold text-gray-700 w-9 text-right">${course.progress}%</span>
          </div>
        </div>
      `).join("");
    }

    // Recent Announcements
    const announcementContainer = document.getElementById("overview-announcements");
    if (announcementContainer) {
      announcementContainer.innerHTML = this.data.announcements.map(ann => `
        <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full uppercase">${ann.category}</span>
            <span class="text-xs text-gray-500">${ann.date}</span>
          </div>
          <h4 class="font-bold text-sm text-gray-900 mb-1">${ann.title}</h4>
          <p class="text-xs text-gray-600 line-clamp-2">${ann.content}</p>
        </div>
      `).join("");
    }
  }

  renderEnrolledCourses() {
    const container = document.getElementById("enrolled-courses-grid");
    if (!container) return;

    container.innerHTML = this.data.courses.map(course => `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div class="relative h-40 overflow-hidden">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 bg-navy text-white text-xs font-bold px-2.5 py-1 rounded-md">
            ${course.code}
          </div>
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i> ${course.rating}
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-blue-600 tracking-wide uppercase">${course.category}</span>
            <h3 class="font-bold text-lg text-gray-900 mt-1 mb-2 leading-snug">${course.title}</h3>
            <p class="text-xs text-gray-600 line-clamp-2 mb-4">${course.description}</p>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span class="font-bold text-gray-800">${course.progress}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
              <div class="bg-blue-600 h-2 rounded-full" style="width: ${course.progress}%"></div>
            </div>

            <button onclick="app.openClassroom('${course.id}')" class="w-full py-2.5 px-4 bg-navy hover:bg-navy-light text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
              <i data-lucide="play-circle" class="w-4 h-4 text-gold"></i> Continue Learning
            </button>
          </div>
        </div>
      </div>
    `).join("");

    this.refreshIcons();
  }

  renderCatalog(searchQuery = "", categoryFilter = "All") {
    const container = document.getElementById("catalog-courses-grid");
    if (!container) return;

    let filtered = this.data.courses;

    if (categoryFilter !== "All") {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      );
    }

    container.innerHTML = filtered.map(course => `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div class="relative h-44 overflow-hidden">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
            ${course.code}
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>${course.category}</span>
              <span>${course.credits} Credits</span>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2 leading-snug">${course.title}</h3>
            <p class="text-xs text-gray-600 line-clamp-2 mb-4">${course.description}</p>
          </div>

          <div>
            <div class="flex items-center gap-3 pt-3 border-t border-gray-100 mb-4">
              <img src="${course.instructorAvatar}" class="w-8 h-8 rounded-full object-cover" alt="Instructor">
              <div>
                <p class="text-xs font-bold text-gray-900">${course.instructor}</p>
                <p class="text-[10px] text-gray-500">${course.duration}</p>
              </div>
            </div>

            <button onclick="app.openLoginModal('student')" class="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4"></i> Access Course
            </button>
          </div>
        </div>
      </div>
    `).join("");

    this.refreshIcons();
  }

  openClassroom(courseId) {
    const course = this.data.courses.find(c => c.id === courseId);
    if (!course) return;

    this.activeCourse = course;
    const modal = document.getElementById("classroom-modal");
    if (!modal) return;

    document.getElementById("classroom-course-code").textContent = course.code;
    document.getElementById("classroom-course-title").textContent = course.title;

    // Render Module Sidebar
    const moduleContainer = document.getElementById("classroom-modules-list");
    let firstLesson = null;

    moduleContainer.innerHTML = course.modules.map(mod => `
      <div class="mb-4">
        <h4 class="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2 px-2">${mod.title}</h4>
        <div class="space-y-1">
          ${mod.lessons.map(les => {
            if (!firstLesson) firstLesson = les;
            return `
              <button onclick="app.loadClassroomLesson('${les.id}')" id="les-btn-${les.id}" class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between text-gray-700 hover:bg-gray-100 transition">
                <div class="flex items-center gap-2 truncate">
                  <i data-lucide="${les.type === 'video' ? 'play-circle' : 'file-text'}" class="w-4 h-4 text-blue-600 flex-shrink-0"></i>
                  <span class="truncate">${les.title}</span>
                </div>
                <span class="text-[10px] ${les.completed ? 'text-emerald-600 font-bold' : 'text-gray-400'}">${les.completed ? 'Done' : les.duration}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");

    if (firstLesson) {
      this.loadClassroomLesson(firstLesson.id);
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    this.refreshIcons();
  }

  closeClassroom() {
    const modal = document.getElementById("classroom-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  loadClassroomLesson(lessonId) {
    if (!this.activeCourse) return;

    let targetLesson = null;
    this.activeCourse.modules.forEach(m => {
      const found = m.lessons.find(l => l.id === lessonId);
      if (found) targetLesson = found;
    });

    if (!targetLesson) return;

    document.getElementById("classroom-lesson-title").textContent = targetLesson.title;
    document.getElementById("classroom-lesson-summary").textContent = targetLesson.summary;

    const displayArea = document.getElementById("classroom-player-display");
    if (targetLesson.type === "video" && targetLesson.videoUrl) {
      displayArea.innerHTML = `
        <div class="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
          <iframe src="${targetLesson.videoUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else {
      displayArea.innerHTML = `
        <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm prose max-w-none text-sm text-gray-800">
          ${targetLesson.readingContent}
        </div>
      `;
    }

    // Toggle complete button state
    const markBtn = document.getElementById("mark-lesson-complete-btn");
    if (markBtn) {
      markBtn.onclick = () => this.toggleLessonCompletion(targetLesson.id);
      markBtn.innerHTML = targetLesson.completed 
        ? `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Completed`
        : `<i data-lucide="circle" class="w-4 h-4"></i> Mark as Completed`;
    }

    this.refreshIcons();
  }

  toggleLessonCompletion(lessonId) {
    if (!this.activeCourse) return;

    this.activeCourse.modules.forEach(m => {
      const les = m.lessons.find(l => l.id === lessonId);
      if (les) {
        les.completed = !les.completed;
      }
    });

    // Recalculate course progress %
    let totalLessons = 0;
    let completedCount = 0;
    this.activeCourse.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.completed) completedCount++;
      });
    });

    this.activeCourse.progress = Math.round((completedCount / totalLessons) * 100);
    this.saveData();
    this.loadClassroomLesson(lessonId);
    this.renderOverview();
    this.renderEnrolledCourses();
  }

  renderQuizzesTab() {
    const container = document.getElementById("quizzes-list-container");
    if (!container) return;

    container.innerHTML = this.data.quizzes.map(quiz => `
      <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-md">${quiz.courseCode}</span>
            <span class="text-xs text-gray-500">${quiz.questions.length} Questions • ${quiz.durationMins} Mins</span>
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-1">${quiz.title}</h3>
          <p class="text-xs text-gray-500">Pass mark: ${quiz.passingScore} / ${quiz.totalPoints} points</p>
        </div>

        <button onclick="app.startQuiz('${quiz.id}')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
          <i data-lucide="edit-3" class="w-4 h-4"></i> Start CBT Assessment
        </button>
      </div>
    `).join("");

    this.refreshIcons();
  }

  startQuiz(quizId) {
    const quiz = this.data.quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    this.activeQuizState = {
      quiz: quiz,
      currentIndex: 0,
      userAnswers: new Array(quiz.questions.length).fill(null),
      secondsRemaining: quiz.durationMins * 60,
      isSubmitted: false
    };

    const modal = document.getElementById("quiz-modal");
    if (!modal) return;

    document.getElementById("quiz-modal-title").textContent = quiz.title;
    this.renderQuizQuestion();

    // Start timer
    if (this.quizTimerInterval) clearInterval(this.quizTimerInterval);
    this.quizTimerInterval = setInterval(() => {
      this.activeQuizState.secondsRemaining--;
      this.updateQuizTimerDisplay();
      if (this.activeQuizState.secondsRemaining <= 0) {
        clearInterval(this.quizTimerInterval);
        this.submitQuiz();
      }
    }, 1000);

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  updateQuizTimerDisplay() {
    if (!this.activeQuizState) return;
    const mins = Math.floor(this.activeQuizState.secondsRemaining / 60);
    const secs = this.activeQuizState.secondsRemaining % 60;
    const timerDisplay = document.getElementById("quiz-timer-display");
    if (timerDisplay) {
      timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  renderQuizQuestion() {
    if (!this.activeQuizState) return;
    const { quiz, currentIndex, userAnswers } = this.activeQuizState;
    const q = quiz.questions[currentIndex];

    document.getElementById("quiz-question-counter").textContent = `Question ${currentIndex + 1} of ${quiz.questions.length}`;
    document.getElementById("quiz-question-text").textContent = q.question;

    const optionsContainer = document.getElementById("quiz-options-container");
    optionsContainer.innerHTML = q.options.map((opt, idx) => {
      const isSelected = userAnswers[currentIndex] === idx;
      return `
        <div onclick="app.selectQuizAnswer(${idx})" class="quiz-option p-4 rounded-xl cursor-pointer flex items-center gap-3 ${isSelected ? 'selected' : ''}">
          <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : ''}">
            ${String.fromCharCode(65 + idx)}
          </div>
          <span class="text-sm font-medium text-gray-800">${opt}</span>
        </div>
      `;
    }).join("");

    // Prev / Next buttons
    const prevBtn = document.getElementById("quiz-prev-btn");
    const nextBtn = document.getElementById("quiz-next-btn");
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.textContent = currentIndex === quiz.questions.length - 1 ? "Submit CBT" : "Next Question";
  }

  selectQuizAnswer(optionIndex) {
    if (!this.activeQuizState || this.activeQuizState.isSubmitted) return;
    this.activeQuizState.userAnswers[this.activeQuizState.currentIndex] = optionIndex;
    this.renderQuizQuestion();
  }

  nextQuizStep() {
    if (!this.activeQuizState) return;
    if (this.activeQuizState.currentIndex < this.activeQuizState.quiz.questions.length - 1) {
      this.activeQuizState.currentIndex++;
      this.renderQuizQuestion();
    } else {
      this.submitQuiz();
    }
  }

  prevQuizStep() {
    if (!this.activeQuizState) return;
    if (this.activeQuizState.currentIndex > 0) {
      this.activeQuizState.currentIndex--;
      this.renderQuizQuestion();
    }
  }

  submitQuiz() {
    if (!this.activeQuizState || this.activeQuizState.isSubmitted) return;
    if (this.quizTimerInterval) clearInterval(this.quizTimerInterval);
    this.activeQuizState.isSubmitted = true;

    const { quiz, userAnswers } = this.activeQuizState;
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += (quiz.totalPoints / quiz.questions.length);
      }
    });

    const isPassed = score >= quiz.passingScore;

    const displayArea = document.getElementById("quiz-content-area");
    displayArea.innerHTML = `
      <div class="text-center py-6">
        <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} mb-4">
          <i data-lucide="${isPassed ? 'check-circle' : 'alert-circle'}" class="w-8 h-8"></i>
        </div>
        <h3 class="font-bold text-2xl text-gray-900 mb-1">${isPassed ? 'CBT Examination Passed!' : 'Assessment Completed'}</h3>
        <p class="text-sm text-gray-500 mb-6">Your official result has been calculated and logged into the LMS gradebook.</p>
        
        <div class="inline-flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Score Achieved</p>
            <p class="text-2xl font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}">${score} / ${quiz.totalPoints}</p>
          </div>
          <div class="h-8 w-px bg-gray-200"></div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Status</p>
            <p class="text-2xl font-bold text-gray-900">${isPassed ? 'PASSED' : 'RE-TAKE REQUIRED'}</p>
          </div>
        </div>

        <div class="text-left space-y-4 max-h-64 overflow-y-auto pr-2 mb-6">
          ${quiz.questions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.correctIndex;
            return `
              <div class="p-4 rounded-xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'}">
                <p class="font-bold text-xs text-gray-900 mb-1">Q${idx+1}: ${q.question}</p>
                <p class="text-xs ${isCorrect ? 'text-emerald-700' : 'text-rose-700'} font-semibold">Your Answer: ${q.options[userAnswers[idx]] || 'None selected'}</p>
                ${!isCorrect ? `<p class="text-xs text-emerald-800 font-semibold mt-0.5">Correct Answer: ${q.options[q.correctIndex]}</p>` : ''}
                <p class="text-[11px] text-gray-500 mt-2"><em>Explanation:</em> ${q.explanation}</p>
              </div>
            `;
          }).join("")}
        </div>

        <button onclick="app.closeQuizModal()" class="px-6 py-3 bg-navy text-white font-bold text-xs rounded-xl hover:bg-navy-light transition">
          Close Quiz Window
        </button>
      </div>
    `;

    this.refreshIcons();
  }

  closeQuizModal() {
    const modal = document.getElementById("quiz-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  renderAssignmentsTab() {
    const container = document.getElementById("assignments-list-container");
    if (!container) return;

    container.innerHTML = this.data.assignments.map(asgn => `
      <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-800 rounded-md">${asgn.courseCode}</span>
              <span class="text-xs text-gray-500">Due: ${asgn.dueDate}</span>
            </div>
            <h3 class="font-bold text-lg text-gray-900">${asgn.title}</h3>
          </div>
          <span class="px-3 py-1 text-xs font-bold rounded-full ${asgn.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${asgn.status} ${asgn.grade ? `(${asgn.grade})` : ''}
          </span>
        </div>

        <p class="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">${asgn.instructions}</p>

        ${asgn.status === 'Graded' ? `
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <strong>Lecturer Feedback:</strong> ${asgn.feedback}
          </div>
        ` : `
          <div class="drag-drop-zone p-6 rounded-xl text-center cursor-pointer" onclick="app.simulateFileUpload('${asgn.id}')">
            <i data-lucide="upload-cloud" class="w-8 h-8 text-blue-500 mx-auto mb-2"></i>
            <p class="text-xs font-bold text-gray-700">${asgn.submittedFile ? `Submitted File: ${asgn.submittedFile}` : 'Click to Upload Assignment PDF / Doc'}</p>
            <p class="text-[10px] text-gray-400 mt-1">Maximum file size: 25MB (.pdf, .docx, .zip)</p>
          </div>
        `}
      </div>
    `).join("");

    this.refreshIcons();
  }

  simulateFileUpload(assignmentId) {
    const asgn = this.data.assignments.find(a => a.id === assignmentId);
    if (!asgn) return;

    asgn.submittedFile = `Emma_Okonjo_${asgn.courseCode}_Submission.pdf`;
    asgn.status = "Submitted";
    this.saveData();
    this.renderAssignmentsTab();
    alert(`File "${asgn.submittedFile}" uploaded successfully to course portal!`);
  }

  renderGradebookTab() {
    const container = document.getElementById("gradebook-table-body");
    if (!container) return;

    container.innerHTML = this.data.gradebook.map(row => `
      <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition">
        <td class="py-4 px-4 font-bold text-xs text-navy">${row.courseCode}</td>
        <td class="py-4 px-4 text-xs font-medium text-gray-800">${row.courseTitle}</td>
        <td class="py-4 px-4 text-xs text-center text-gray-600">${row.cat1} / 20</td>
        <td class="py-4 px-4 text-xs text-center text-gray-600">${row.cat2} / 20</td>
        <td class="py-4 px-4 text-xs text-center text-gray-600">${row.exam} / 60</td>
        <td class="py-4 px-4 text-xs text-center font-bold text-gray-900">${row.total} / 100</td>
        <td class="py-4 px-4 text-xs text-center font-bold text-blue-600">${row.grade}</td>
        <td class="py-4 px-4 text-xs text-center">
          <span class="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">${row.status}</span>
        </td>
      </tr>
    `).join("");
  }

  // ==========================================
  // LECTURER DASHBOARD METHODS
  // ==========================================
  renderLecturerDashboard() {
    this.renderLecturerOverview();
    this.renderLecturerTaughtCourses();
    this.renderLecturerGradingHub();
    this.renderLecturerRoster();
  }

  renderLecturerOverview() {
    // Lecturer Metrics
    const pendingCount = (this.data.studentSubmissions || []).filter(s => s.status === "Pending Review").length;
    
    const countSubmissions = document.getElementById("lecturer-pending-count");
    if (countSubmissions) countSubmissions.textContent = `${pendingCount} Submissions`;

    const countStudents = document.getElementById("lecturer-student-count");
    if (countStudents) countStudents.textContent = `${(this.data.studentRoster || []).length * 74} Enrolled`;

    const countCourses = document.getElementById("lecturer-courses-count");
    if (countCourses) countCourses.textContent = "2 Active Courses";

    // Recent Submissions Overview List
    const recentSubmissionsList = document.getElementById("lecturer-recent-submissions-list");
    if (recentSubmissionsList) {
      recentSubmissionsList.innerHTML = (this.data.studentSubmissions || []).slice(0, 3).map(sub => `
        <div class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="${sub.studentAvatar}" class="w-9 h-9 rounded-full object-cover border border-gold" alt="${sub.studentName}">
            <div>
              <h4 class="font-bold text-gray-900 text-xs">${sub.studentName} (${sub.courseCode})</h4>
              <p class="text-[10px] text-gray-500">${sub.assignmentTitle}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full font-bold text-[10px] ${sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${sub.status} ${sub.grade ? `(${sub.grade}/100)` : ''}
            </span>
            <button onclick="app.switchTab('submissions')" class="px-3 py-1 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light transition">
              Review
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  renderLecturerTaughtCourses() {
    const container = document.getElementById("lecturer-courses-grid");
    if (!container) return;

    const taught = (this.data.courses || []).filter(c => c.instructor.includes("Arinze Eze") || c.code === "SEN301" || c.code === "SEN303");

    container.innerHTML = taught.map(course => `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
        <div class="relative h-40 overflow-hidden">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 bg-navy text-white text-xs font-bold px-2.5 py-1 rounded-md">
            ${course.code}
          </div>
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <i data-lucide="users" class="w-3.5 h-3.5 text-blue-600"></i> ${course.enrolledCount} Students
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">${course.category}</span>
            <h3 class="font-bold text-base text-gray-900 mt-1 mb-2 leading-snug">${course.title}</h3>
            <p class="text-xs text-gray-600 line-clamp-2 mb-4">${course.description}</p>
          </div>

          <div class="pt-3 border-t border-gray-100 flex items-center gap-2">
            <button onclick="app.openClassroom('${course.id}')" class="flex-1 py-2 px-3 bg-navy hover:bg-navy-light text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-gold"></i> View Syllabus
            </button>
            <button onclick="alert('Module creation tool opened for ${course.code}')" class="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border border-blue-200">
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Add Module
            </button>
          </div>
        </div>
      </div>
    `).join("");

    this.refreshIcons();
  }

  renderLecturerGradingHub() {
    const container = document.getElementById("lecturer-submissions-container");
    if (!container) return;

    const subs = this.data.studentSubmissions || [];

    container.innerHTML = subs.map(sub => `
      <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <img src="${sub.studentAvatar}" class="w-12 h-12 rounded-full object-cover border-2 border-gold" alt="${sub.studentName}">
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="px-2.5 py-0.5 text-[10px] font-bold bg-navy text-white rounded">${sub.courseCode}</span>
                <span class="text-xs text-gray-400 font-mono">${sub.studentId}</span>
              </div>
              <h3 class="font-bold text-base text-gray-900">${sub.studentName}</h3>
              <p class="text-xs text-blue-600 font-semibold">${sub.assignmentTitle}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-3 py-1 text-xs font-bold rounded-full ${sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${sub.status}
            </span>
            <span class="text-xs text-gray-500">Submitted: ${sub.submittedDate}</span>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200/80 mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i data-lucide="file-text" class="w-6 h-6 text-red-500"></i>
            <div>
              <p class="text-xs font-bold text-gray-800">${sub.fileName}</p>
              <p class="text-[10px] text-gray-400">${sub.fileSize}</p>
            </div>
          </div>
          <button onclick="alert('Downloading ${sub.fileName} for evaluation...')" class="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Download PDF
          </button>
        </div>

        <!-- Lecturer Grading Box -->
        <div class="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
          <p class="text-xs font-bold text-blue-900 uppercase tracking-wider">Lecturer Evaluation & Grading</p>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="md:col-span-3">
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Score (Out of ${sub.maxScore})</label>
              <input type="number" id="grade-score-${sub.id}" value="${sub.grade || ''}" placeholder="e.g. 95" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue focus:outline-none">
            </div>
            <div class="md:col-span-9">
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Feedback Remarks</label>
              <input type="text" id="grade-feedback-${sub.id}" value="${sub.feedback || ''}" placeholder="Enter comments or suggestions..." class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue focus:outline-none">
            </div>
          </div>
          <div class="flex justify-end">
            <button onclick="app.submitLecturerGrade('${sub.id}')" class="px-5 py-2 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow">
              <i data-lucide="check" class="w-4 h-4 text-gold"></i> Save Grade & Feedback
            </button>
          </div>
        </div>
      </div>
    `).join("");

    this.refreshIcons();
  }

  submitLecturerGrade(submissionId) {
    const sub = (this.data.studentSubmissions || []).find(s => s.id === submissionId);
    if (!sub) return;

    const scoreInput = document.getElementById(`grade-score-${submissionId}`);
    const feedbackInput = document.getElementById(`grade-feedback-${submissionId}`);

    const scoreVal = parseInt(scoreInput?.value || "0");
    const feedbackVal = feedbackInput?.value || "";

    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > sub.maxScore) {
      alert(`Please enter a valid score between 0 and ${sub.maxScore}.`);
      return;
    }

    sub.grade = scoreVal;
    sub.feedback = feedbackVal;
    sub.status = "Graded";

    this.saveData();
    this.renderLecturerOverview();
    this.renderLecturerGradingHub();
    alert(`Successfully graded ${sub.studentName}'s submission with ${scoreVal}/${sub.maxScore}!`);
  }

  renderLecturerRoster() {
    const container = document.getElementById("lecturer-roster-table-body");
    if (!container) return;

    const roster = this.data.studentRoster || [];

    container.innerHTML = roster.map(student => `
      <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition">
        <td class="py-4 px-4 font-mono font-bold text-xs text-navy">${student.id}</td>
        <td class="py-4 px-4">
          <div class="flex items-center gap-3">
            <img src="${student.avatar}" class="w-8 h-8 rounded-full object-cover border border-gold" alt="${student.name}">
            <div>
              <p class="text-xs font-bold text-gray-900">${student.name}</p>
              <p class="text-[10px] text-gray-500">${student.email}</p>
            </div>
          </div>
        </td>
        <td class="py-4 px-4 text-xs text-gray-700">${student.programme}</td>
        <td class="py-4 px-4 text-xs text-center font-bold text-emerald-600">${student.gpa} / 5.00</td>
        <td class="py-4 px-4 text-xs text-center font-medium text-gray-600">${student.coursesEnrolled.join(", ")}</td>
        <td class="py-4 px-4 text-xs text-center">
          <span class="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">${student.status}</span>
        </td>
      </tr>
    `).join("");
  }

  publishNoticeFromForm(event) {
    if (event) event.preventDefault();
    const title = document.getElementById("notice-title")?.value;
    const category = document.getElementById("notice-category")?.value || "Academic";
    const content = document.getElementById("notice-content")?.value;

    if (!title || !content) {
      alert("Please fill in both the title and content fields for the notice.");
      return;
    }

    const newNotice = {
      id: "ann-" + Date.now(),
      title: title,
      date: "Sep 16, 2026",
      author: this.currentUser?.name || "Dr. Arinze Eze",
      category: category,
      content: content
    };

    this.data.announcements.unshift(newNotice);
    this.saveData();

    document.getElementById("notice-title").value = "";
    document.getElementById("notice-content").value = "";

    alert("Notice published successfully to student LMS portals!");
    this.renderOverview();
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

// Global App Instance
const app = new LMSApp();

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
