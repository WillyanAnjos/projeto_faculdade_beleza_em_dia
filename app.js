(() => {
  const screens = {
    dashboard: document.querySelector('#screen-dashboard'),
    form: document.querySelector('#screen-form'),
    result: document.querySelector('#screen-result'),
  };

  const state = {
    currentScreen: 'dashboard',
    appointments: [
      {
        id: 1,
        client: 'Mariana Costa',
        service: 'Maquiagem Social',
        date: todayIso(),
        startTime: '09:00',
        endTime: '10:00',
        price: 120,
        notes: '',
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      {
        id: 2,
        client: 'Carla Lima',
        service: 'Maquiagem para Evento',
        date: todayIso(),
        startTime: '14:30',
        endTime: '16:00',
        price: 150,
        notes: '',
        status: 'confirmed',
        paymentStatus: 'pending',
      },
      {
        id: 3,
        client: 'Juliana Mendes',
        service: 'Maquiagem para Formatura',
        date: todayIso(),
        startTime: '17:00',
        endTime: '18:30',
        price: 180,
        notes: '',
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      {
        id: 4,
        client: 'Mariana Costa',
        service: 'Maquiagem Social',
        date: '2026-10-15',
        startTime: '09:00',
        endTime: '10:00',
        price: 120,
        notes: '',
        status: 'confirmed',
        paymentStatus: 'paid',
      },
    ],
    lastResult: null,
  };

  const bookingForm = document.querySelector('#bookingForm');
  const clientSelect = document.querySelector('#clientSelect');
  const serviceSelect = document.querySelector('#serviceSelect');
  const dateInput = document.querySelector('#dateInput');
  const startTimeInput = document.querySelector('#startTimeInput');
  const endTimeInput = document.querySelector('#endTimeInput');
  const notesInput = document.querySelector('#notesInput');
  const servicePrice = document.querySelector('#servicePrice');
  const notesCounter = document.querySelector('#notesCounter');
  const toast = document.querySelector('#toast');
  const clientDialog = document.querySelector('#clientDialog');
  const newClientName = document.querySelector('#newClientName');
  const newClientPhone = document.querySelector('#newClientPhone');

  const resultHero = document.querySelector('#resultHero');
  const resultIcon = document.querySelector('#resultIcon');
  const resultTitle = document.querySelector('#resultTitle');
  const resultSubtitle = document.querySelector('#resultSubtitle');
  const resultAlert = document.querySelector('#resultAlert');
  const resultAlertSymbol = document.querySelector('#resultAlertSymbol');
  const resultAlertTitle = document.querySelector('#resultAlertTitle');
  const resultAlertText = document.querySelector('#resultAlertText');
  const appointmentStatusBadge = document.querySelector('#appointmentStatusBadge');
  const registerPaymentButton = document.querySelector('#registerPaymentButton');
  const backToAgendaButton = document.querySelector('#backToAgendaButton');
  const fixTimeButton = document.querySelector('#fixTimeButton');
  const dayAgendaCard = document.querySelector('#dayAgendaCard');

  hydrateDefaults();
  bindEvents();
  renderAppointments();

  function bindEvents() {
    document.querySelector('#brandButton').addEventListener('click', () => showScreen('dashboard'));
    document.querySelector('#newAppointmentButton').addEventListener('click', () => showScreen('form'));
    document.querySelector('#backFromFormButton').addEventListener('click', () => showScreen('dashboard'));
    document.querySelector('#cancelBookingButton').addEventListener('click', () => showScreen('dashboard'));
    document.querySelector('#viewAgendaButton').addEventListener('click', () => showToast('Agenda completa: versão demonstrativa do MVP.'));
    document.querySelector('#resultViewAgendaButton').addEventListener('click', () => showToast('Agenda completa: versão demonstrativa do MVP.'));

    document.querySelector('#logoutButton').addEventListener('click', () => {
      showToast('Sessão encerrada na demonstração.');
      setTimeout(() => showScreen('dashboard'), 250);
    });

    document.querySelectorAll('[data-shortcut]').forEach((button) => {
      button.addEventListener('click', () => {
        const shortcut = button.dataset.shortcut;
        if (shortcut === 'agenda') {
          showToast('Agenda: use “Novo agendamento” para testar o fluxo central.');
        } else {
          showToast(`${capitalize(shortcut)}: módulo previsto no MVP.`);
        }
      });
    });

    document.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        const nav = button.dataset.nav;
        if (nav === 'dashboard') {
          showScreen('dashboard');
        } else if (nav === 'agenda') {
          showScreen('dashboard');
          document.querySelector('.appointments-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          showToast(`${capitalize(nav)}: módulo previsto no MVP.`);
        }
      });
    });

    serviceSelect.addEventListener('change', () => {
      updatePriceAndDuration();
      clearFieldError(serviceSelect, 'serviceError');
    });

    startTimeInput.addEventListener('change', () => {
      autoFillEndTime();
      clearFieldError(startTimeInput, 'startTimeError');
    });

    dateInput.addEventListener('change', () => clearFieldError(dateInput, 'dateError'));
    endTimeInput.addEventListener('change', () => clearFieldError(endTimeInput, 'endTimeError'));
    clientSelect.addEventListener('change', () => clearFieldError(clientSelect, 'clientError'));

    notesInput.addEventListener('input', () => {
      notesCounter.textContent = `${notesInput.value.length}/250`;
    });

    bookingForm.addEventListener('submit', handleBookingSubmit);

    document.querySelector('#newClientButton').addEventListener('click', () => {
      newClientName.value = '';
      newClientPhone.value = '';
      clientDialog.showModal();
      setTimeout(() => newClientName.focus(), 50);
    });

    document.querySelector('#clientForm').addEventListener('submit', (event) => {
      const submitterValue = event.submitter?.value;
      if (submitterValue === 'cancel') return;

      event.preventDefault();
      const name = newClientName.value.trim();
      const phone = newClientPhone.value.trim();

      if (!name || !phone) {
        showToast('Preencha nome e telefone para cadastrar a cliente.');
        return;
      }

      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      clientSelect.appendChild(option);
      clientSelect.value = name;
      clientDialog.close();
      showToast('Cliente cadastrada para esta demonstração.');
    });

    registerPaymentButton.addEventListener('click', () => {
      if (!state.lastResult || state.lastResult.type !== 'success') return;
      state.lastResult.appointment.paymentStatus = 'paid';
      document.querySelector('#paymentStatusText').textContent = 'Pago';
      renderAppointments();
      showToast('Pagamento registrado como pago.');
    });

    backToAgendaButton.addEventListener('click', () => {
      showScreen('dashboard');
      setTimeout(() => document.querySelector('.appointments-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    });

    fixTimeButton.addEventListener('click', () => showScreen('form'));
  }

  function hydrateDefaults() {
    clientSelect.value = 'Ana Souza';
    serviceSelect.value = 'Maquiagem Social';
    dateInput.value = '2026-10-15';
    startTimeInput.value = '14:00';
    endTimeInput.value = '15:00';
    notesInput.value = 'Evento às 18h';
    notesCounter.textContent = `${notesInput.value.length}/250`;
    updatePriceAndDuration(false);
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, screen]) => {
      const active = key === name;
      screen.hidden = !active;
      screen.classList.toggle('is-active', active);
    });

    state.currentScreen = name;
    updateBottomNav(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      screens[name]?.querySelector('h1')?.focus?.();
      document.querySelector('#mainContent')?.focus({ preventScroll: true });
    }, 20);
  }

  function updateBottomNav(name) {
    document.querySelectorAll('.bottom-nav-item').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.nav === (name === 'dashboard' ? 'dashboard' : 'agenda'));
    });
  }

  function handleBookingSubmit(event) {
    event.preventDefault();
    clearAllErrors();

    const selectedOption = serviceSelect.selectedOptions[0];
    const appointment = {
      id: Date.now(),
      client: clientSelect.value.trim(),
      service: serviceSelect.value.trim(),
      date: dateInput.value,
      startTime: startTimeInput.value,
      endTime: endTimeInput.value,
      price: Number(selectedOption?.dataset.price || 0),
      notes: notesInput.value.trim(),
      status: 'confirmed',
      paymentStatus: 'pending',
    };

    const errors = validateAppointment(appointment);
    if (errors.length > 0) {
      errors.forEach(({ field, id, message }) => setFieldError(field, id, message));
      errors[0].field.focus();
      showToast('Revise os campos destacados antes de continuar.');
      return;
    }

    const conflictingAppointment = findConflict(appointment);
    if (conflictingAppointment) {
      state.lastResult = { type: 'conflict', appointment, conflictingAppointment };
      renderResult();
      showScreen('result');
      return;
    }

    state.appointments.push(appointment);
    state.lastResult = { type: 'success', appointment };
    renderAppointments();
    renderResult();
    showScreen('result');
  }

  function validateAppointment(appointment) {
    const errors = [];

    if (!appointment.client) errors.push({ field: clientSelect, id: 'clientError', message: 'Selecione uma cliente.' });
    if (!appointment.service) errors.push({ field: serviceSelect, id: 'serviceError', message: 'Selecione um serviço.' });
    if (!appointment.date) errors.push({ field: dateInput, id: 'dateError', message: 'Informe a data do atendimento.' });
    if (!appointment.startTime) errors.push({ field: startTimeInput, id: 'startTimeError', message: 'Informe o horário inicial.' });
    if (!appointment.endTime) errors.push({ field: endTimeInput, id: 'endTimeError', message: 'Informe o horário final.' });

    if (appointment.startTime && appointment.endTime && appointment.endTime <= appointment.startTime) {
      errors.push({ field: endTimeInput, id: 'endTimeError', message: 'O horário final deve ser posterior ao horário inicial.' });
    }

    return errors;
  }

  function findConflict(candidate) {
    return state.appointments.find((appointment) => {
      if (appointment.date !== candidate.date || appointment.status === 'cancelled') return false;
      return candidate.startTime < appointment.endTime && candidate.endTime > appointment.startTime;
    });
  }

  function renderResult() {
    const result = state.lastResult;
    if (!result) return;

    const appointment = result.appointment;
    fillSummary(appointment);

    if (result.type === 'success') {
      resultHero.classList.remove('error');
      resultIcon.textContent = '✓';
      resultTitle.textContent = 'Agendamento realizado';
      resultSubtitle.textContent = 'Tudo certo. O horário foi reservado na agenda.';

      resultAlert.className = 'alert-banner success';
      resultAlertSymbol.textContent = '✓';
      resultAlertTitle.textContent = 'Agendamento realizado com sucesso';
      resultAlertText.textContent = 'O atendimento foi salvo e já aparece na agenda.';

      appointmentStatusBadge.className = 'status-badge confirmed';
      appointmentStatusBadge.textContent = '✓ Confirmado';
      document.querySelector('#bookingStatusText').textContent = 'Confirmado';
      document.querySelector('#paymentStatusText').textContent = appointment.paymentStatus === 'paid' ? 'Pago' : 'Pendente';

      registerPaymentButton.classList.remove('is-hidden');
      backToAgendaButton.classList.remove('is-hidden');
      fixTimeButton.classList.add('is-hidden');
      dayAgendaCard.classList.remove('is-hidden');
    } else {
      const conflict = result.conflictingAppointment;
      resultHero.classList.add('error');
      resultIcon.textContent = '!';
      resultTitle.textContent = 'Horário indisponível';
      resultSubtitle.textContent = 'Já existe um atendimento ativo nesse intervalo.';

      resultAlert.className = 'alert-banner error';
      resultAlertSymbol.textContent = '!';
      resultAlertTitle.textContent = 'Não foi possível salvar o agendamento';
      resultAlertText.textContent = `Já existe um atendimento entre ${conflict.startTime} e ${conflict.endTime}. Escolha outro horário.`;

      appointmentStatusBadge.className = 'status-badge cancelled';
      appointmentStatusBadge.textContent = '! Não salvo';
      document.querySelector('#bookingStatusText').textContent = 'Não salvo';
      document.querySelector('#paymentStatusText').textContent = 'Não iniciado';

      registerPaymentButton.classList.add('is-hidden');
      backToAgendaButton.classList.remove('is-hidden');
      fixTimeButton.classList.remove('is-hidden');
      dayAgendaCard.classList.add('is-hidden');
    }
  }

  function fillSummary(appointment) {
    document.querySelector('#summaryClient').textContent = appointment.client || '—';
    document.querySelector('#summaryService').textContent = appointment.service || '—';
    document.querySelector('#summaryDate').textContent = formatDate(appointment.date);
    document.querySelector('#summaryTime').textContent = `${appointment.startTime} – ${appointment.endTime}`;
    document.querySelector('#summaryPrice').textContent = formatCurrency(appointment.price);
    document.querySelector('#summaryNotes').textContent = appointment.notes || 'Sem observações.';
  }

  function renderAppointments() {
    renderAppointmentList(document.querySelector('#appointmentList'), todayIso(), 3);

    const resultDate = state.lastResult?.appointment?.date || '2026-10-15';
    renderAppointmentList(document.querySelector('#resultAppointmentList'), resultDate, 5);
  }

  function renderAppointmentList(container, date, limit) {
    const items = state.appointments
      .filter((appointment) => appointment.date === date && appointment.status !== 'cancelled')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, limit);

    if (items.length === 0) {
      container.innerHTML = '<p class="screen-subtitle">Nenhum atendimento para esta data.</p>';
      return;
    }

    container.innerHTML = items.map((appointment) => {
      const paid = appointment.paymentStatus === 'paid';
      return `
        <article class="appointment-item">
          <time class="appointment-time" datetime="${appointment.date}T${appointment.startTime}">${appointment.startTime}</time>
          <div class="appointment-main">
            <strong>${escapeHtml(appointment.client)}</strong>
            <span>${escapeHtml(appointment.service)}</span>
          </div>
          <span class="status-badge ${paid ? 'confirmed' : 'pending'}">
            ${paid ? '✓ Confirmado' : '$ Pendente'}
          </span>
        </article>
      `;
    }).join('');
  }

  function updatePriceAndDuration(updateEndTime = true) {
    const option = serviceSelect.selectedOptions[0];
    const price = Number(option?.dataset.price || 0);
    servicePrice.textContent = formatCurrency(price);

    if (updateEndTime && startTimeInput.value && option?.dataset.duration) {
      endTimeInput.value = addMinutesToTime(startTimeInput.value, Number(option.dataset.duration));
    }
  }

  function autoFillEndTime() {
    const option = serviceSelect.selectedOptions[0];
    const duration = Number(option?.dataset.duration || 60);
    if (startTimeInput.value) {
      endTimeInput.value = addMinutesToTime(startTimeInput.value, duration);
    }
  }

  function setFieldError(field, errorId, message) {
    field.classList.add('field-invalid');
    field.setAttribute('aria-invalid', 'true');
    document.querySelector(`#${errorId}`).textContent = message;
  }

  function clearFieldError(field, errorId) {
    field.classList.remove('field-invalid');
    field.removeAttribute('aria-invalid');
    document.querySelector(`#${errorId}`).textContent = '';
  }

  function clearAllErrors() {
    [
      [clientSelect, 'clientError'],
      [serviceSelect, 'serviceError'],
      [dateInput, 'dateError'],
      [startTimeInput, 'startTimeError'],
      [endTimeInput, 'endTimeError'],
    ].forEach(([field, id]) => clearFieldError(field, id));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function todayIso() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
  }

  function addMinutesToTime(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const total = hours * 60 + mins + minutes;
    const newHours = Math.floor((total % (24 * 60)) / 60);
    const newMinutes = total % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
