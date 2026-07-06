/* iSoko bilingual survey — plain JS, no framework. */
(function () {
  const app = document.getElementById('app');
  const langButtons = document.querySelectorAll('.lang-toggle button');

  const state = {
    lang: localStorage.getItem('isoko_lang') || 'en',
    screen: 'welcome', // welcome | role | question | contact | thanks
    role: null,
    qIndex: 0,
    answers: {},
    contact: { name: '', phone: '', district: '', contact_ok: false },
    submitting: false,
  };

  function t() {
    return window.SURVEY.ui[state.lang];
  }
  function questions() {
    return state.role ? window.SURVEY.questions[state.role] : [];
  }

  function setLang(lang) {
    state.lang = lang;
    localStorage.setItem('isoko_lang', lang);
    document.documentElement.lang = lang;
    langButtons.forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    render();
  }

  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    for (const c of children) {
      if (c == null) continue;
      node.append(c.nodeType ? c : document.createTextNode(c));
    }
    return node;
  }

  /* ---------- Screens ---------- */

  function renderWelcome() {
    app.replaceChildren(
      el('h1', {}, t().title),
      el('p', { class: 'intro' }, t().intro),
      el(
        'button',
        { class: 'btn btn-primary btn-block', onclick: () => go('role') },
        t().start
      )
    );
  }

  function renderRole() {
    const roleCard = (role, emoji, title, hint) =>
      el(
        'button',
        {
          type: 'button',
          class: 'role-card' + (state.role === role ? ' selected' : ''),
          onclick: () => {
            state.role = role;
            state.qIndex = 0;
            state.answers = {};
            go('question');
          },
        },
        el('span', { class: 'emoji' }, emoji),
        el('span', { class: 'role-title' }, title),
        el('span', { class: 'role-hint' }, hint)
      );

    app.replaceChildren(
      el('div', { class: 'section-label' }, t().brand),
      el('h1', {}, t().whoAreYou),
      el(
        'div',
        { class: 'role-grid' },
        roleCard('customer', '🛒', t().customer, t().customerHint),
        roleCard('shop_owner', '🏪', t().shopOwner, t().shopOwnerHint)
      ),
      el(
        'div',
        { class: 'nav-row' },
        el('button', { class: 'btn btn-ghost', onclick: () => go('welcome') }, t().back)
      )
    );
  }

  function renderQuestion() {
    const qs = questions();
    const q = qs[state.qIndex];
    const total = qs.length;
    const current = state.qIndex + 1;
    const saved = state.answers[q.id];

    const error = el('p', { class: 'error-msg', role: 'alert' }, t().required);

    let inputArea;
    if (q.type === 'text') {
      inputArea = el('textarea', {
        placeholder: t().textPlaceholder,
        maxlength: '2000',
        oninput: (e) => (state.answers[q.id] = e.target.value),
      });
      if (saved) inputArea.value = saved;
    } else {
      const multi = q.type === 'multi';
      inputArea = el(
        'div',
        { class: 'options' },
        ...q.options.map((opt) => {
          const checked = multi
            ? Array.isArray(saved) && saved.includes(opt.value)
            : saved === opt.value;
          const input = el('input', {
            type: multi ? 'checkbox' : 'radio',
            name: q.id,
            value: opt.value,
          });
          input.checked = checked;
          const row = el(
            'label',
            { class: 'option' + (checked ? ' selected' : '') },
            input,
            el('span', {}, opt.label[state.lang])
          );
          input.addEventListener('change', () => {
            if (multi) {
              const arr = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
              state.answers[q.id] = input.checked
                ? [...arr, opt.value]
                : arr.filter((v) => v !== opt.value);
              row.classList.toggle('selected', input.checked);
            } else {
              state.answers[q.id] = opt.value;
              inputArea.querySelectorAll('.option').forEach((o) => o.classList.remove('selected'));
              row.classList.add('selected');
            }
            error.classList.remove('show');
          });
          return row;
        })
      );
    }

    const validate = () => {
      if (!q.required) return true;
      const a = state.answers[q.id];
      if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
      return Boolean(a && String(a).trim());
    };

    const next = () => {
      if (!validate()) {
        error.classList.add('show');
        return;
      }
      if (state.qIndex < total - 1) {
        state.qIndex++;
        render();
      } else {
        go('contact');
      }
    };

    const back = () => {
      if (state.qIndex > 0) {
        state.qIndex--;
        render();
      } else {
        go('role');
      }
    };

    app.replaceChildren(
      el('div', { class: 'progress-track' },
        el('div', { class: 'progress-fill', style: `width:${(current / (total + 1)) * 100}%` })
      ),
      el('div', { class: 'step-label' }, t().stepOf(current, total)),
      el('h2', { class: 'q-label' }, q.label[state.lang] + (q.required ? '' : ' ' + t().optional)),
      q.type === 'multi' ? el('p', { class: 'q-sub' }, t().chooseAll) : null,
      inputArea,
      error,
      el(
        'div',
        { class: 'nav-row' },
        el('button', { class: 'btn btn-ghost', onclick: back }, t().back),
        el('button', { class: 'btn btn-primary', onclick: next }, t().next)
      )
    );
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderContact() {
    const error = el('p', { class: 'error-msg', role: 'alert' }, t().submitError);

    const field = (key, label, type = 'text') => {
      const input = el('input', {
        type,
        value: state.contact[key],
        oninput: (e) => (state.contact[key] = e.target.value),
      });
      return el(
        'div',
        { class: 'field' },
        el('label', {}, label + ' ', el('span', { class: 'opt' }, t().optional)),
        input
      );
    };

    const consent = el('input', { type: 'checkbox' });
    consent.checked = state.contact.contact_ok;
    consent.addEventListener('change', () => (state.contact.contact_ok = consent.checked));

    const submitBtn = el(
      'button',
      { class: 'btn btn-primary', onclick: submit },
      t().submit
    );

    async function submit() {
      if (state.submitting) return;
      state.submitting = true;
      submitBtn.disabled = true;
      error.classList.remove('show');
      try {
        const res = await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: state.role,
            language: state.lang,
            name: state.contact.name,
            phone: state.contact.phone,
            district: state.contact.district,
            contact_ok: state.contact.contact_ok,
            answers: state.answers,
          }),
        });
        if (!res.ok) throw new Error('bad status ' + res.status);
        go('thanks');
      } catch (e) {
        error.classList.add('show');
      } finally {
        state.submitting = false;
        submitBtn.disabled = false;
      }
    }

    app.replaceChildren(
      el('div', { class: 'progress-track' }, el('div', { class: 'progress-fill', style: 'width:100%' })),
      el('h1', {}, t().contactTitle),
      el('p', { class: 'intro' }, t().contactIntro),
      field('name', t().nameLabel),
      field('phone', t().phoneLabel, 'tel'),
      field('district', t().districtLabel),
      el('label', { class: 'check-row' }, consent, el('span', {}, t().contactOk)),
      error,
      el(
        'div',
        { class: 'nav-row' },
        el(
          'button',
          {
            class: 'btn btn-ghost',
            onclick: () => {
              state.qIndex = questions().length - 1;
              go('question');
            },
          },
          t().back
        ),
        submitBtn
      )
    );
  }

  function renderThanks() {
    app.replaceChildren(
      el(
        'div',
        { class: 'thanks' },
        el('div', { class: 'big' }, '🎉'),
        el('h1', {}, t().thanksTitle),
        el('p', {}, t().thanksBody),
        el(
          'button',
          {
            class: 'btn btn-primary',
            onclick: () => {
              state.role = null;
              state.qIndex = 0;
              state.answers = {};
              state.contact = { name: '', phone: '', district: '', contact_ok: false };
              go('welcome');
            },
          },
          t().submitAnother
        )
      )
    );
  }

  function go(screen) {
    state.screen = screen;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    if (state.screen === 'welcome') renderWelcome();
    else if (state.screen === 'role') renderRole();
    else if (state.screen === 'question') renderQuestion();
    else if (state.screen === 'contact') renderContact();
    else renderThanks();
  }

  setLang(state.lang);
})();
