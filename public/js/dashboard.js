document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let todos = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const todosGrid = document.getElementById('todosGrid');
  const addTodoForm = document.getElementById('addTodoForm');
  const todoTitleInput = document.getElementById('todoTitle');
  const todoDescInput = document.getElementById('todoDescription');
  const searchInput = document.getElementById('searchInput');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const toastContainer = document.getElementById('toastContainer');
  
  // Stats Elements
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statCompleted = document.getElementById('statCompleted');
  const statProgress = document.getElementById('statProgress');
  const progressBarFill = document.getElementById('progressBarFill');
  const healthBadge = document.getElementById('healthBadge');
  const healthStatusText = document.getElementById('healthStatusText');
  const currentTraceId = document.getElementById('currentTraceId');

  // Base API URL
  const API_BASE = '/api/v1';

  // Helper: Toast Notifications
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Update Trace ID Footer Info
  function updateTraceId(meta) {
    if (meta && meta.traceId) {
      currentTraceId.textContent = meta.traceId;
    }
  }

  // Fetch Health Check Status
  async function checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const json = await res.json();
      if (json.success) {
        healthStatusText.textContent = `متصل (${Math.round(json.data.uptime)}s uptime)`;
        healthBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        updateTraceId(json.meta);
      }
    } catch {
      healthStatusText.textContent = 'غير متصل';
      healthBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    }
  }

  // Fetch All Todos
  async function fetchTodos() {
    try {
      const res = await fetch(`${API_BASE}/todos`);
      const json = await res.json();

      if (json.success) {
        todos = json.data;
        updateTraceId(json.meta);
        render();
      } else {
        showToast(json.error?.message || 'فشل جلب المهام', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  }

  // Calculate & Update Stats Bar
  function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    statTotal.textContent = total;
    statPending.textContent = pending;
    statCompleted.textContent = completed;
    statProgress.textContent = `${percentage}%`;
    progressBarFill.style.width = `${percentage}%`;
  }

  // Render Todos Grid
  function render() {
    updateStats();

    // Apply Filter & Search
    let filtered = todos.filter(todo => {
      const matchesFilter =
        currentFilter === 'all' ? true :
        currentFilter === 'completed' ? todo.completed :
        !todo.completed;

      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      todosGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <p>لا توجد مهام مطابقة للعرض</p>
        </div>
      `;
      return;
    }

    todosGrid.innerHTML = filtered.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-left">
          <div class="custom-checkbox" onclick="toggleTodo('${todo.id}', ${!todo.completed})">
            ${todo.completed ? '✓' : ''}
          </div>
          <div>
            <div class="todo-title">${escapeHtml(todo.title)}</div>
            ${todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : ''}
            <div class="todo-meta">تاريخ الإنشاء: ${new Date(todo.createdAt).toLocaleString('ar-EG')}</div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn btn-icon" onclick="deleteTodo('${todo.id}')" title="حذف المهمة">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  // Helper: Escape HTML string to prevent XSS
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Add Todo Form Submit Handler
  addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoTitleInput.value.trim();
    const description = todoDescInput.value.trim();

    if (!title) return;

    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || undefined }),
      });

      const json = await res.json();

      if (json.success) {
        todos.unshift(json.data);
        updateTraceId(json.meta);
        todoTitleInput.value = '';
        todoDescInput.value = '';
        showToast('تمت إضافة المهمة بنجاح');
        render();
      } else {
        showToast(json.error?.message || 'تعذر إضافة المهمة', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('خطأ أثناء إرسال البيانات', 'error');
    }
  });

  // Global Toggle Todo Handler
  window.toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      const json = await res.json();

      if (json.success) {
        const index = todos.findIndex(t => t.id === id);
        if (index !== -1) {
          todos[index] = json.data;
        }
        updateTraceId(json.meta);
        render();
        showToast(completed ? 'تم علم المهمة كمكتملة 🎉' : 'تم تفعيل المهمة مرة أخرى');
      } else {
        showToast(json.error?.message || 'تعذر تعديل المهمة', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('خطأ أثناء التعديل', 'error');
    }
  };

  // Global Delete Todo Handler
  window.deleteTodo = async (id) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذه المهمة؟')) return;

    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (json.success) {
        todos = todos.filter(t => t.id !== id);
        updateTraceId(json.meta);
        render();
        showToast('تم حذف المهمة بنجاح');
      } else {
        showToast(json.error?.message || 'تعذر حذف المهمة', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('خطأ أثناء الحذف', 'error');
    }
  };

  // Filter Tabs Event Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      render();
    });
  });

  // Search Input Event Listener
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    render();
  });

  // Initial Load & Heartbeat
  checkHealth();
  fetchTodos();
  setInterval(checkHealth, 10000);
});
