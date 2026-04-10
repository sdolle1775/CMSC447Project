const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const on = (el, event, handler) => el?.addEventListener(event, handler);

const onEnter = (el, handler) => {
  on(el, 'keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler(e);
    }
  });
};

const clearFields = (ids) => {
  ids.forEach(id => {
    const el = $(id);
    if (el) el.value = '';
  });
};

const toggleDisplay = (el, show) => {
  if (!el) return;
  el.style.display = show ? '' : 'none';
};

const api = {
  root: (window.wpApiSettings?.root || '/wp-json').replace(/\/$/, ''),

  headers() {
    return {
      'Content-Type': 'application/json',
      'X-WP-Nonce': window.wpApiSettings?.nonce || ''
    };
  },

  async request(endpoint, method = 'GET', body = null) {
    const options = { method, headers: this.headers() };

    if (body) options.body = JSON.stringify(body);
    if (method === 'GET') delete options.headers['Content-Type'];

    const res = await fetch(`${this.root}/asc-tutoring/v1${endpoint}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
};

function initExpanders() {
  $$('.sights-expander-trigger').forEach(trigger => {
    const toggle = () => {
      const content = $(trigger.getAttribute('aria-controls'));
      if (!content) return;

      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      content.classList.toggle('sights-expander-hidden', expanded);
    };

    on(trigger, 'click', toggle);
    on(trigger, 'keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function initSubjectFilters() {
  const buttons = $$('.subject-filter-button');
  const sections = $$('.subject-section');

  buttons.forEach(btn => {
    on(btn, 'click', () => {
      const subject = btn.dataset.subject;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach(sec => {
        toggleDisplay(sec, subject === 'all' || sec.dataset.subject === subject);
      });
    });
  });
}

function initAdminUI() {
  const messageBox = $('tutoring-admin-message');
  if (!messageBox) return; // not on admin page

  const showMessage = (text, type = 'success') => {
    messageBox.textContent = text;
    messageBox.className = `tutoring-admin-message ${type}`;
    messageBox.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  $$('.admin-tab').forEach(tab => {
    on(tab, 'click', () => {
      $$('.admin-tab').forEach(t => t.classList.remove('active'));
      $$('.admin-section').forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      $(`admin-tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });

  function renderSearchResults({ listEl, items, renderItem, onSelect }) {
    listEl.innerHTML = '';

    if (!items.length) {
      listEl.innerHTML = `<li>No results found.</li>`;
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'account-search-item';
      li.innerHTML = renderItem(item);

      const select = () => {
        listEl.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        li.classList.add('selected');
        onSelect(item);
      };

      on(li, 'click', select);
      on(li.querySelector('button'), 'click', (e) => {
        e.stopPropagation();
        select();
      });

      listEl.appendChild(li);
    });
  }

  async function searchAccounts(query) {
    const list = $('account-search-list');
    const status = $('account-search-status');
    const resultsBox = $('account_search_results');

    resultsBox.hidden = false;
    status.textContent = 'Searching...';

    try {
      const data = await api.request(`/umbc_db/accounts?search_str=${encodeURIComponent(query)}`);
      const accounts = data.umbc_accounts || [];

      status.textContent = `${accounts.length} result(s) found`;

      renderSearchResults({
        listEl: list,
        items: accounts,
        renderItem: acc => `
          <div class="account-search-item-info">
            <span class="account-search-item-name">${acc.first_name} ${acc.last_name}</span>
            <span class="account-search-item-meta">${acc.umbc_id} • ${acc.umbc_email}</span>
          </div>
          <button type="button" class="button button-secondary">Select</button>
        `,
        onSelect: acc => {
          $('account_lookup_results').value = JSON.stringify(acc);
          fillAccountForm(acc);
          showMessage(`Selected ${acc.first_name} ${acc.last_name}`);
        }
      });

    } catch (err) {
      showMessage(err.message, 'error');
    }
  }

  function fillAccountForm(acc) {
    $('user_login').value = acc.umbc_id || '';
    $('user_email').value = acc.umbc_email || '';
    $('first_name').value = acc.first_name || '';
    $('last_name').value = acc.last_name || '';
  }

  on($('account-search-submit'), 'click', () => {
    const q = $('account_search_query').value.trim();
    if (!q) return showMessage('Enter search term', 'error');
    searchAccounts(q);
  });

  onEnter($('account_search_query'), () => $('account-search-submit')?.click());

  async function searchCourses(query) {
    const list = $('course-search-list');
    const status = $('course-search-status');
    const resultsBox = $('course_search_results');

    resultsBox.hidden = false;
    status.textContent = 'Searching...';

    try {
      const data = await api.request(`/umbc_db/courses?search_str=${encodeURIComponent(query)}`);
      const courses = data.umbc_courses || [];

      status.textContent = `${courses.length} result(s) found`;

      renderSearchResults({
        listEl: list,
        items: courses,
        renderItem: c => `
          <div class="account-search-item-info">
            <span class="account-search-item-name">${c.course_subject} ${c.course_code} — ${c.course_name}</span>
            <span class="account-search-item-meta">${c.subject_name}</span>
          </div>
          <button type="button" class="button button-secondary">Select</button>
        `,
        onSelect: c => {
          $('course_lookup_results').value = JSON.stringify(c);
          $('schedule_course_id').value = c.course_id;
          showMessage(`Selected ${c.course_subject} ${c.course_code}`);
        }
      });

    } catch (err) {
      showMessage(err.message, 'error');
    }
  }

  on($('course-search-submit'), 'click', () => {
    const q = $('course_search_query').value.trim();
    if (!q) return showMessage('Enter search term', 'error');
    searchCourses(q);
  });

  onEnter($('course_search_query'), () => $('course-search-submit')?.click());

  const bindDelete = (selector, endpoint) => {
    $$(selector).forEach(btn => {
      on(btn, 'click', async (e) => {
        const row = e.target.closest('tr');
        const id = Object.values(row.dataset)[0];

        if (!confirm(`Delete ${id}?`)) return;

        try {
          await api.request(`${endpoint}/${id}`, 'DELETE');
          row.remove();
          showMessage(`Deleted ${id}`);
        } catch (err) {
          showMessage(err.message, 'error');
        }
      });
    });
  };

  bindDelete('.admin-delete-event', '/events');
  bindDelete('.admin-delete-schedule', '/schedule');
  bindDelete('.admin-delete-account', '/accounts');
}

function initEventFields() {
  const eventType = $('event_type');
  if (!eventType) return;

  const dateRange = $('date-range-fields');
  const duration = $('duration-field');

  function toggleFields() {
    const text = eventType.options[eventType.selectedIndex]?.text.toLowerCase() || '';

    toggleDisplay(dateRange, text.includes('absent'));
    toggleDisplay(duration, text.includes('leaving early'));
  }

  on(eventType, 'change', toggleFields);
  toggleFields();
}

document.addEventListener('DOMContentLoaded', () => {
  initExpanders();
  initSubjectFilters();
  initAdminUI();
  initEventFields();
});