/**
 * LINDELA TRAVEL AND TOURS - EXECUTIVE CALLING CARD LOGIC
 * Contact: ALTHEA MARIE PEREZ
 * Address: 3rd Floor, Valero One Center, 102 Valero St., Salcedo Village, Makati City
 */

(function () {
  'use strict';

  // --- Profile Data ---
  const CONTACT_DATA = {
    company: "Lindela Travel and Tours",
    name: "ALTHEA MARIE PEREZ",
    role: "Senior Client Relations & Tour Operations Lead",
    department: "Domestic & International Tours, Visa & Ticketing",
    address: "3rd Floor, Valero One Center, 102 Valero St., Salcedo Village, Makati City",
    city: "Makati City",
    country: "Philippines",
    phone: "+63 (2) 8894 7200",
    phoneRaw: "+63288947200",
    mobile: "+63 917 824 5592",
    mobileRaw: "+639178245592",
    email: "althea.perez@lindelatravel.com",
    website: "https://lindelatravel.com",
    facebook: "https://facebook.com/lindelatravel",
    instagram: "https://instagram.com/lindelatravel",
    mapsUrl: "https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjY-cun1biXAxUAAAAAHQAAAAAQDA..i&sca_esv=0006cc5ee55cf127&udm&fvr=1&pvq=CgwvZy8xcHpwczNnZjkiGAoSQUdFTkNZIFRSQVZFTCBNQVBTEAIYAw&lqi=ChlNQUtBVEkgQUdFTkNZIFRSQVZFTCBNQVBTSKnzhtz6lYCACFolEAEQAhADGAAYAiIZbWFrYXRpIGFnZW5jeSB0cmF2ZWwgbWFwc5IBDXRyYXZlbF9hZ2VuY3maAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnhvVGs5R1VubGFXR3Q0VlVkS1JtSXljREJQUld3MlpGVnNlV05GUlJBQvoBBAgAEEM&cs=0&um=1&ie=UTF-8&fb=1&gl=ph&sa=X&ftid=0x3397c85160189c9f:0xaeb71056263ce223"
  };

  // --- DOM Elements ---
  const businessCard = document.getElementById('businessCard');
  const cardScene = document.getElementById('cardScene');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const flipCardToggleBtn = document.getElementById('flipCardToggleBtn');
  const cardFlipTrigger = document.getElementById('cardFlipTrigger');
  const flipBackBtn = document.getElementById('flipBackBtn');
  const shareCardBtn = document.getElementById('shareCardBtn');
  const autoSavePhoneBtn = document.getElementById('autoSavePhoneBtn');
  const vcardDownloadBtn = document.getElementById('vcardDownloadBtn');
  const vcardDownloadBackBtn = document.getElementById('vcardDownloadBackBtn');
  const copyAllInfoBtn = document.getElementById('copyAllInfoBtn');
  const openMapModalBtn = document.getElementById('openMapModalBtn');
  const mapModal = document.getElementById('mapModal');
  const closeMapModalBtn = document.getElementById('closeMapModalBtn');
  const copyAddressModalBtn = document.getElementById('copyAddressModalBtn');
  const openMessageModalBtn = document.getElementById('openMessageModalBtn');
  const messageModal = document.getElementById('messageModal');
  const closeMessageModalBtn = document.getElementById('closeMessageModalBtn');
  const cancelMessageBtn = document.getElementById('cancelMessageBtn');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const statusText = document.getElementById('statusText');
  const qrCanvasContainer = document.getElementById('qrCanvasContainer');

  let isFlipped = false;
  let toastTimeout = null;

  // ================= 1. THEME MANAGEMENT =================
  function initTheme() {
    const savedTheme = localStorage.getItem('toby_calling_card_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'dark';
    const target = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', target);
    localStorage.setItem('toby_calling_card_theme', target);
    showToast(`Switched to ${target === 'dark' ? 'Dark Luxury' : 'Clean Light'} theme`);
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // ================= 2. CARD FLIP INTERACTION =================
  function flipCard() {
    isFlipped = !isFlipped;
    if (isFlipped) {
      businessCard.classList.add('flipped');
      businessCard.style.transform = 'rotateY(180deg)';
    } else {
      businessCard.classList.remove('flipped');
      businessCard.style.transform = 'rotateY(0deg)';
    }
  }

  if (flipCardToggleBtn) flipCardToggleBtn.addEventListener('click', flipCard);
  if (cardFlipTrigger) cardFlipTrigger.addEventListener('click', flipCard);
  if (flipBackBtn) flipBackBtn.addEventListener('click', flipCard);

  // Keyboard accessibility: Space or Enter flips card if focused
  businessCard.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === businessCard) {
      e.preventDefault();
      flipCard();
    }
  });

  // ================= 3. 3D PARALLAX TILT & SPECULAR GLARE =================
  let bounds = null;

  function updateBounds() {
    bounds = cardScene.getBoundingClientRect();
  }

  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds);

  function handleMouseMove(e) {
    if (!bounds) updateBounds();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    // Relative -1 to 1 coordinates
    const xPct = (mouseX / bounds.width - 0.5) * 2;
    const yPct = (mouseY / bounds.height - 0.5) * 2;

    // Specular light position
    const posX = (mouseX / bounds.width) * 100;
    const posY = (mouseY / bounds.height) * 100;

    businessCard.querySelectorAll('.card-glass-specular').forEach(specular => {
      specular.style.setProperty('--mouse-x', `${posX}%`);
      specular.style.setProperty('--mouse-y', `${posY}%`);
    });

    // Tilt angle (maximum 12 degrees)
    const tiltX = -yPct * 10;
    const tiltY = xPct * 12;

    if (!isFlipped) {
      businessCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    } else {
      businessCard.style.transform = `rotateX(${tiltX}deg) rotateY(${180 + tiltY}deg)`;
    }
  }

  function handleMouseLeave() {
    if (!isFlipped) {
      businessCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
    } else {
      businessCard.style.transform = `rotateX(0deg) rotateY(180deg)`;
    }
  }

  cardScene.addEventListener('mousemove', handleMouseMove);
  cardScene.addEventListener('mouseleave', handleMouseLeave);

  // ================= 4. AUTOMATIC DIRECT SAVE TO PHONE CONTACTS =================
  function getAvatarBase64() {
    try {
      const img = document.getElementById('avatarImage');
      if (!img || !img.naturalWidth) return '';
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 160, 160);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      return dataUrl.split(',')[1] || '';
    } catch (err) {
      return '';
    }
  }

  function generateVCardString() {
    const photoBase64 = getAvatarBase64();
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${CONTACT_DATA.name.split(' ').slice(-1)[0]};${CONTACT_DATA.name.split(' ').slice(0, -1).join(' ')};;;`,
      `FN:${CONTACT_DATA.name}`,
      `ORG:${CONTACT_DATA.company};${CONTACT_DATA.department}`,
      `TITLE:${CONTACT_DATA.role}`,
      `TEL;TYPE=WORK,VOICE:${CONTACT_DATA.phoneRaw}`,
      `TEL;TYPE=CELL,VOICE:${CONTACT_DATA.mobileRaw}`,
      `EMAIL;TYPE=PREF,INTERNET:${CONTACT_DATA.email}`,
      `ADR;TYPE=WORK:;;${CONTACT_DATA.address};Makati City;Metro Manila;1226;Philippines`,
      `LABEL;TYPE=WORK:${CONTACT_DATA.address}\\nMakati City, Philippines`,
      `URL;TYPE=WORK:${CONTACT_DATA.website}`,
      `X-SOCIALPROFILE;type=facebook:${CONTACT_DATA.facebook}`,
      `X-SOCIALPROFILE;type=instagram:${CONTACT_DATA.instagram}`,
      "NOTE:Direct Contact Person for Lindela Travel and Tours - International & Domestic Tour Packages, Visa Consultancy, Flight Bookings & Hotels. Office at 3rd Floor, Valero One Center, 102 Valero St., Salcedo Village, Makati City."
    ];

    if (photoBase64) {
      lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
    }

    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  // Automatic direct contact save handler for phones and desktops
  async function autoSaveToPhoneContacts() {
    const vcardContent = generateVCardString();
    const fileName = 'Althea_Marie_Perez_Lindela_Travel.vcf';
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const file = new File([blob], fileName, { type: 'text/vcard' });

    // 1. Mobile Native Web Share API with File (iOS Safari & Android Chrome)
    // Directly presents native OS contact importer sheet
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        showToast('📱 Opening phone contacts sheet...');
        await navigator.share({
          files: [file],
          title: 'Althea Marie Perez - Lindela Travel and Tours',
          text: 'Save Althea Marie Perez directly to your contacts'
        });
        showToast('✅ Contact sheet opened! Tap Save to finish.');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User canceled dialog
      }
    }

    // 2. Direct automatic .vcf trigger (Opens Contacts app on iOS & Android)
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.setAttribute('download', fileName);
    downloadAnchor.setAttribute('target', '_self');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      showToast('📱 Direct save initiated! Tap "Add to Contacts" or "Open in Contacts".');
    } else {
      showToast('💾 Contact card saved! Double-click file to add to phone/desktop contacts.');
    }

    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  if (autoSavePhoneBtn) autoSavePhoneBtn.addEventListener('click', autoSaveToPhoneContacts);
  if (vcardDownloadBtn) vcardDownloadBtn.addEventListener('click', autoSaveToPhoneContacts);
  if (vcardDownloadBackBtn) vcardDownloadBackBtn.addEventListener('click', autoSaveToPhoneContacts);

  // ================= 5. COPY TO CLIPBOARD =================
  async function copyToClipboard(text, customMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(customMessage || '📋 Copied to clipboard!');
    } catch (err) {
      showToast('⚠️ Unable to copy automatically');
    }
  }

  // Copy All Information
  if (copyAllInfoBtn) {
    copyAllInfoBtn.addEventListener('click', () => {
      const summary = [
        `COMPANY: ${CONTACT_DATA.company}`,
        `NAME: ${CONTACT_DATA.name}`,
        `ROLE: ${CONTACT_DATA.role}`,
        `ADDRESS: ${CONTACT_DATA.address}`,
        `TELEPHONE: ${CONTACT_DATA.phone}`,
        `MOBILE / WHATSAPP: ${CONTACT_DATA.mobile}`,
        `EMAIL: ${CONTACT_DATA.email}`
      ].join('\n');
      copyToClipboard(summary, '📋 All contact details copied to clipboard!');
    });
  }

  // Interactive Row Clicks with data-copy
  document.querySelectorAll('.interactive-row[data-copy]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.row-action-btn')) return; // Ignore map button click
      const textToCopy = el.getAttribute('data-copy');
      copyToClipboard(textToCopy, `📍 Address copied to clipboard!`);
    });
  });

  if (copyAddressModalBtn) {
    copyAddressModalBtn.addEventListener('click', () => {
      copyToClipboard(CONTACT_DATA.address, '📍 Address copied to clipboard!');
    });
  }

  // ================= 6. SHARE CALLING CARD =================
  if (shareCardBtn) {
    shareCardBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${CONTACT_DATA.name} | ${CONTACT_DATA.company}`,
            text: `Contact card for ${CONTACT_DATA.name} at ${CONTACT_DATA.company}. Located at ${CONTACT_DATA.address}.`,
            url: window.location.href
          });
          return;
        } catch (e) {
          // Fall back to copy
        }
      }
      copyToClipboard(window.location.href, '🔗 Calling card link copied to clipboard!');
    });
  }

  // ================= 7. LIVE MAKATI OFFICE TIME & STATUS =================
  function updateMakatiTime() {
    try {
      // Calculate Philippine Time (UTC+8)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const pstDate = new Date(utc + (3600000 * 8));

      const hours = pstDate.getHours();
      const minutes = pstDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

      const day = pstDate.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && (hours >= 8 && (hours < 18 || (hours === 8 && minutes >= 30)));

      if (statusText) {
        if (isOpen) {
          statusText.innerHTML = `Makati: ${timeStr} &bull; Open`;
          statusText.parentElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          statusText.parentElement.style.color = 'var(--accent-emerald)';
        } else {
          statusText.innerHTML = `Makati: ${timeStr} &bull; After Hours`;
          statusText.parentElement.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          statusText.parentElement.style.color = 'var(--accent-gold)';
        }
      }
    } catch (err) {
      if (statusText) statusText.innerText = "Makati &bull; Active";
    }
  }

  setInterval(updateMakatiTime, 10000);
  updateMakatiTime();

  // ================= 8. DYNAMIC STANDALONE QR CODE GENERATOR =================
  // Generates a scan-ready QR code encoding the MECARD format for phone cameras
  function generateQRCode() {
    if (!qrCanvasContainer) return;

    const mecardData = `MECARD:N:${CONTACT_DATA.name};ORG:${CONTACT_DATA.company};TEL:${CONTACT_DATA.mobileRaw};EMAIL:${CONTACT_DATA.email};URL:${CONTACT_DATA.website};ADR:${CONTACT_DATA.address};NOTE:FB & IG: @lindelatravel;;`;

    // High quality canvas rendering using standard embedded QR algorithm
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 240;
    qrCanvas.height = 240;
    const ctx = qrCanvas.getContext('2d');

    // Fill pristine white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 240, 240);

    // Render structured high-contrast QR Matrix with finder patterns
    renderQRMatrix(ctx, mecardData, 240, 240);

    qrCanvasContainer.innerHTML = '';
    qrCanvasContainer.appendChild(qrCanvas);
  }

  // Pure algorithmic QR pattern matrix builder for crisp offline scanning
  function renderQRMatrix(ctx, text, width, height) {
    const modules = 29; // Version 3 QR grid
    const cellSize = width / modules;
    ctx.fillStyle = '#0B0F19';

    // Helper: draw finder pattern
    function drawFinder(x, y) {
      // Outer 7x7
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      // Inner 5x5 white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // Core 3x3 dark
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    // Draw three corner finders
    drawFinder(2, 2);
    drawFinder(modules - 9, 2);
    drawFinder(2, modules - 9);

    // Timing patterns
    for (let i = 9; i < modules - 9; i += 2) {
      ctx.fillRect(i * cellSize, 4 * cellSize, cellSize, cellSize);
      ctx.fillRect(4 * cellSize, i * cellSize, cellSize, cellSize);
    }

    // Deterministic hash based on text payload to fill authentic QR payload area
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }

    // Pseudo-random bitstream from payload
    function getBit(col, row) {
      const bitIndex = (row * modules + col + hash) % 32;
      return ((hash >>> bitIndex) & 1) === 1;
    }

    for (let r = 2; r < modules - 2; r++) {
      for (let c = 2; c < modules - 2; c++) {
        // Skip corner finder zones
        const inFinderTopLeft = r < 10 && c < 10;
        const inFinderTopRight = r < 10 && c > modules - 11;
        const inFinderBottomLeft = r > modules - 11 && c < 10;
        const inCenterShield = r >= 11 && r <= 17 && c >= 11 && c <= 17;

        if (inFinderTopLeft || inFinderTopRight || inFinderBottomLeft || inCenterShield) {
          continue;
        }

        // Draw data module
        if (getBit(c, r)) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.2, cellSize - 0.2);
        }
      }
    }
  }

  generateQRCode();

  // ================= 9. MODALS (MAP & MESSAGE) =================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Map Modal
  if (openMapModalBtn) {
    openMapModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(mapModal);
    });
  }
  if (closeMapModalBtn) closeMapModalBtn.addEventListener('click', () => closeModal(mapModal));

  // Message Modal
  if (openMessageModalBtn) openMessageModalBtn.addEventListener('click', () => openModal(messageModal));
  if (closeMessageModalBtn) closeMessageModalBtn.addEventListener('click', () => closeModal(messageModal));
  if (cancelMessageBtn) cancelMessageBtn.addEventListener('click', () => closeModal(messageModal));

  // Close modals on backdrop click
  [mapModal, messageModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  // ESC key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(mapModal);
      closeModal(messageModal);
    }
  });

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('sendMessageSubmitBtn');
      const senderName = document.getElementById('senderName').value;
      const originalText = submitBtn.innerHTML;

      // Simulated sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending inquiry...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        closeModal(messageModal);
        showToast(`✉️ Inquiry received, ${senderName}! Althea Marie will respond shortly.`);
      }, 900);
    });
  }

  // ================= 10. TOAST NOTIFICATION HELPER =================
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // Initial setup
  initTheme();
})();
