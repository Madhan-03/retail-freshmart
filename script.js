// script.js - FreshMart Pulse Dashboard Application

(function () {
  // ========= USER MANAGEMENT =========
  const users = JSON.parse(localStorage.getItem('freshmart_users') || '[]');

  function saveUsers() {
    localStorage.setItem('freshmart_users', JSON.stringify(users));
  }

  function findUser(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  function createUser(fullName, email, password) {
    const newUser = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers();
    return newUser;
  }

  function validateUser(email, password) {
    const user = findUser(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // ========= TOAST NOTIFICATIONS =========
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || (() => {
      const div = document.createElement('div');
      div.id = 'toastContainer';
      div.className = 'toast-container';
      document.body.appendChild(div);
      return div;
    })();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ========= DATASET =========
  const salesData = {
    totalSales: 11256342.89,
    grossProfit: 2459823.78,
    avgDiscount: 6734.23,
    productsSold: 200,
  };

  const categorySales = {
    Groceries: 1250000,
    Beverages: 980000,
    Snacks: 1670000,
    "Personal Care": 2040000,
    Household: 1890000,
    "Fresh Produce": 2210000,
    Dairy: 1460000,
  };

  const topProducts = [
    { name: "Product_039 (Dairy Elite)", revenue: 197611.26 },
    { name: "Product_077 (Beverage Plus)", revenue: 179702.2 },
    { name: "Product_009 (Household Pack)", revenue: 163606.4 },
    { name: "Product_010 (Snack Delight)", revenue: 165118.05 },
    { name: "Product_053 (Fresh Harvest)", revenue: 156705.44 },
  ];

  const topSKUs = [
    { id: "PRD0039", name: "Product_039", category: "Dairy", sales: 197611.26 },
    { id: "PRD0077", name: "Product_077", category: "Beverages", sales: 179702.2 },
    { id: "PRD0009", name: "Product_009", category: "Household", sales: 163606.4 },
    { id: "PRD0010", name: "Product_010", category: "Snacks", sales: 165118.05 },
    { id: "PRD0053", name: "Product_053", category: "Fresh Produce", sales: 156705.44 },
  ];

  // ========= HELPER FUNCTIONS =========
  function formatCurrency(value) {
    if (value >= 1e6) return "£" + (value / 1e6).toFixed(2) + "M";
    if (value >= 1e3) return "£" + (value / 1e3).toFixed(1) + "k";
    return "£" + value.toFixed(2);
  }

  function updateKPIcards() {
    const totalEl = document.getElementById("totalSalesValue");
    const profitEl = document.getElementById("grossProfitValue");
    const discountEl = document.getElementById("avgDiscountValue");
    const productsEl = document.getElementById("productsSoldValue");

    if (totalEl) totalEl.innerText = formatCurrency(salesData.totalSales);
    if (profitEl) profitEl.innerText = formatCurrency(salesData.grossProfit);
    if (discountEl)
      discountEl.innerText =
        "£" +
        salesData.avgDiscount.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
    if (productsEl) productsEl.innerText = salesData.productsSold;
  }

  let categoryChartInstance = null;

  function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart");
    if (!ctx) return;

    const canvasCtx = ctx.getContext("2d");
    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(canvasCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(categorySales),
        datasets: [
          {
            data: Object.values(categorySales),
            backgroundColor: [
              "#2c6e49",
              "#3b8c5e",
              "#5fa87c",
              "#8fc0a9",
              "#cfe8cf",
              "#a1cca5",
              "#4b8b6b",
            ],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { size: 11 },
              color: getComputedStyle(document.body)
                .getPropertyValue("--text-primary")
                .trim() || "#1a2e26",
            },
          },
        },
      },
    });
  }

  function renderTopProducts() {
    const container = document.getElementById("topProductsList");
    if (!container) return;
    container.innerHTML = "";
    topProducts.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="product-name">${p.name}</span><span class="product-revenue">${formatCurrency(p.revenue)}</span>`;
      container.appendChild(li);
    });
  }

  function renderSKUTable() {
    const tbody = document.getElementById("skuTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    topSKUs.forEach((sku) => {
      const row = tbody.insertRow();
      row.insertCell(0).innerText = sku.id;
      row.insertCell(1).innerText = sku.name;
      row.insertCell(2).innerText = sku.category;
      row.insertCell(3).innerText = formatCurrency(sku.sales);
    });
  }

  // ========= THEME MANAGEMENT =========
  function setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      localStorage.setItem("freshmart_theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("freshmart_theme", "light");
    }
    if (categoryChartInstance) {
      const textColor = getComputedStyle(document.body)
        .getPropertyValue("--text-primary")
        .trim();
      categoryChartInstance.options.plugins.legend.labels.color = textColor;
      categoryChartInstance.update();
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    setTheme(isDark ? "light" : "dark");
  }

  function initTheme() {
    const saved = localStorage.getItem("freshmart_theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }

  // ========= COGNOS IFRAME CONTROLS =========
  function refreshCognos() {
    const iframe = document.getElementById("cognosFrame");
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = "about:blank";
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  }

  function openCognosFullScreen() {
    const iframe = document.getElementById("cognosFrame");
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      } else {
        window.open(iframe.src, "_blank");
      }
    }
  }

  // ========= AUTHENTICATION =========
  const loginPage = document.getElementById("loginPage");
  const dashboardPage = document.getElementById("dashboardPage");
  const loginForm = document.getElementById("loginForm");
  const signUpForm = document.getElementById("signUpForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const displaySpan = document.getElementById("displayUsername");
  const loginContainer = document.getElementById("loginFormContainer");
  const signUpContainer = document.getElementById("signUpFormContainer");
  const showSignUp = document.getElementById("showSignUp");
  const showLogin = document.getElementById("showLogin");

  function switchToSignUp() {
    loginContainer.style.display = "none";
    signUpContainer.style.display = "block";
  }

  function switchToLogin() {
    loginContainer.style.display = "block";
    signUpContainer.style.display = "none";
  }

  function showDashboard(username) {
    let displayName = username.trim();
    if (displayName.includes("@")) displayName = displayName.split("@")[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    if (displaySpan) displaySpan.innerText = displayName;

    localStorage.setItem("freshmart_user", displayName);
    localStorage.setItem("freshmart_logged_in", "true");

    if (loginPage) loginPage.style.display = "none";
    if (dashboardPage) dashboardPage.style.display = "flex";

    renderAll();
    initTheme();
    showToast(`Welcome back, ${displayName}!`, 'success');
  }

  function renderAll() {
    updateKPIcards();
    renderCategoryChart();
    renderTopProducts();
    renderSKUTable();
  }

  function logout() {
    localStorage.removeItem("freshmart_user");
    localStorage.removeItem("freshmart_logged_in");
    if (loginPage) loginPage.style.display = "flex";
    if (dashboardPage) dashboardPage.style.display = "none";
    
    // Reset forms
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("signUpFullName").value = "";
    document.getElementById("signUpEmail").value = "";
    document.getElementById("signUpPassword").value = "";
    document.getElementById("signUpConfirmPassword").value = "";
    
    switchToLogin();
    initTheme();
    showToast('Logged out successfully', 'info');
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const user = validateUser(email, password);
    if (user) {
      showDashboard(user.fullName);
    } else {
      // Check if user exists
      const existingUser = findUser(email);
      if (existingUser) {
        showToast('Incorrect password. Please try again.', 'error');
      } else {
        showToast('Account not found. Please sign up first.', 'error');
      }
    }
  }

  function handleSignUp(e) {
    e.preventDefault();
    const fullName = document.getElementById("signUpFullName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("signUpConfirmPassword").value;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (fullName.length < 2) {
      showToast('Full name must be at least 2 characters', 'error');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    // Check if user already exists
    if (findUser(email)) {
      showToast('An account with this email already exists. Please login.', 'error');
      return;
    }

    // Create account
    const newUser = createUser(fullName, email, password);
    showToast(`Account created successfully! Welcome ${fullName}!`, 'success');
    
    // Auto-login
    showDashboard(fullName);
  }

  function checkSession() {
    if (localStorage.getItem("freshmart_logged_in") === "true") {
      const storedUser = localStorage.getItem("freshmart_user") || "Analyst";
      showDashboard(storedUser);
    } else {
      if (loginPage) loginPage.style.display = "flex";
      if (dashboardPage) dashboardPage.style.display = "none";
      switchToLogin();
      initTheme();
    }
  }

  // ========= EVENT LISTENERS =========
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signUpForm) signUpForm.addEventListener("submit", handleSignUp);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (showSignUp) showSignUp.addEventListener("click", (e) => {
    e.preventDefault();
    switchToSignUp();
  });
  if (showLogin) showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchToLogin();
  });

  const loginThemeToggle = document.getElementById("loginThemeToggle");
  const dashThemeToggle = document.getElementById("dashThemeToggle");

  if (loginThemeToggle) loginThemeToggle.addEventListener("click", toggleTheme);
  if (dashThemeToggle) dashThemeToggle.addEventListener("click", toggleTheme);

  const refreshBtn = document.getElementById("refreshCognosBtn");
  const openBtn = document.getElementById("openCognosBtn");

  if (refreshBtn) refreshBtn.addEventListener("click", refreshCognos);
  if (openBtn) openBtn.addEventListener("click", openCognosFullScreen);

  // Handle window resize for chart responsiveness
  window.addEventListener("resize", () => {
    if (categoryChartInstance) categoryChartInstance.resize();
  });

  // Initialize application
  checkSession();
})();