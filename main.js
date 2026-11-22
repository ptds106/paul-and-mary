let currentLang = "en";
let isSoundOn = true;

let introLang = "en";
let introSound = true;

// 인트로 화면 언어 토글 (영어 모드일 때는 "한글", 한국어 모드일 때는 "ENG" 표시)
function toggleIntroLanguage() {
  introLang = introLang === "en" ? "ko" : "en";
  updateIntroTexts();
}

// 페이지가 처음 로드될 때 인트로 텍스트와 버튼 라벨 세팅
window.onload = function () {
  updateIntroTexts();
};

function toggleIntroSound() {
  introSound = !introSound;
  const soundIcon = document.getElementById("introSoundIcon");
  const soundLabel = document.getElementById("introSoundLabel");

  if (introSound) {
    soundIcon.innerText = "🔊";
    soundLabel.innerText = introLang === "ko" ? "소리: 켜짐" : "Sound: On";
  } else {
    soundIcon.innerText = "🔇";
    soundLabel.innerText = introLang === "ko" ? "소리: 꺼짐" : "Sound: Off";
  }
}

function enterInvitation() {
  currentLang = introLang;
  isSoundOn = introSound;

  document.getElementById("introScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  const container = document.getElementById("invitationContainer");
  if (container) {
    container.scrollTop = 0;
  }

  updateTexts();
  startIntroAnimation();
  startWeddingCountdown();
  initGallery();
  renderGuestMessages();
  handleGuestCountChange();
  initScrollCue();
}

window.onbeforeunload = function () {
  const container = document.getElementById("invitationContainer");
  if (container) container.scrollTop = 0;
};

const typewriterStrings = {
  ko: "이태현과 박효진이 결혼합니다.",
  en: "Paul & Mary are getting married.",
};

const cursiveString = "Welcome to our wedding";

let typingTimeout;
let cursiveTimeout;
let bgmTimeout;

function startIntroAnimation() {
  const targetEl = document.getElementById("typewriterText");
  const cursorEl = document.getElementById("typeCursor");
  const textContainer = document.getElementById("introTextContainer");
  const photoFrame = document.getElementById("fullPhotoFrame");
  const currentString = typewriterStrings[currentLang];

  const cursiveTargetEl = document.getElementById("cursiveTypewriterText");
  const cursiveCursorEl = document.getElementById("cursiveCursor");

  const typeSound = document.getElementById("typeSound");
  const bgmSound = document.getElementById("bgmSound");

  if (!targetEl || !photoFrame) return;

  clearTimeout(typingTimeout);
  clearTimeout(cursiveTimeout);
  clearTimeout(bgmTimeout);

  if (typeSound) {
    typeSound.pause();
    typeSound.currentTime = 0;
  }
  if (bgmSound) {
    bgmSound.pause();
    bgmSound.currentTime = 0;
  }

  targetEl.innerHTML = "";
  cursiveTargetEl.innerHTML = "";
  textContainer.classList.remove("fade-out");
  textContainer.style.display = "flex";
  photoFrame.classList.remove("show");
  cursorEl.style.display = "inline-block";
  cursiveCursorEl.style.display = "inline-block";

  if (isSoundOn && typeSound) {
    typeSound.play().catch((e) => console.log("Audio play prevented:", e));
  }

  let charIndex = 0;

  function typeFirst() {
    if (charIndex < currentString.length) {
      targetEl.innerHTML += currentString.charAt(charIndex);
      charIndex++;
      typingTimeout = setTimeout(typeFirst, 130);
    } else {
      if (typeSound) {
        typeSound.pause();
        typeSound.currentTime = 0;
      }

      bgmTimeout = setTimeout(() => {
        if (isSoundOn && bgmSound) {
          bgmSound.play().catch((e) => console.log("BGM play prevented:", e));
        }
      }, 1000);

      cursorEl.style.display = "none";
      setTimeout(() => {
        textContainer.classList.add("fade-out");
        setTimeout(() => {
          textContainer.style.display = "none";
          photoFrame.classList.add("show");

          let cursiveIndex = 0;
          function typeCursive() {
            if (cursiveIndex < cursiveString.length) {
              cursiveTargetEl.innerHTML += cursiveString.charAt(cursiveIndex);
              cursiveIndex++;
              cursiveTimeout = setTimeout(typeCursive, 40);
            } else {
              cursiveCursorEl.style.display = "none";
            }
          }
          cursiveTimeout = setTimeout(typeCursive, 250);
        }, 800);
      }, 800);
    }
  }
  typeFirst();
}

function startWeddingCountdown() {
  const weddingDate = new Date("March 7, 2027 17:00:00").getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById("daysNum");
    const hoursEl = document.getElementById("hoursNum");
    const minsEl = document.getElementById("minsNum");
    const secsEl = document.getElementById("secsNum");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (distance < 0) {
      daysEl.innerHTML = "00";
      hoursEl.innerHTML = "00";
      minsEl.innerHTML = "00";
      secsEl.innerHTML = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerHTML = String(days).padStart(2, "0");
    hoursEl.innerHTML = String(hours).padStart(2, "0");
    minsEl.innerHTML = String(minutes).padStart(2, "0");
    secsEl.innerHTML = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function toggleSound() {
  isSoundOn = !isSoundOn;
  const soundIcon = document.getElementById("soundIcon");
  const soundText = document.getElementById("soundText");
  const typeSound = document.getElementById("typeSound");
  const bgmSound = document.getElementById("bgmSound");

  if (isSoundOn) {
    soundIcon.innerText = "🔊";
    soundText.innerText = currentLang === "ko" ? "소리 켜짐" : "Sound On";
    if (bgmSound)
      bgmSound.play().catch((e) => console.log("BGM play prevented:", e));
  } else {
    soundIcon.innerText = "🔇";
    soundText.innerText = currentLang === "ko" ? "소리 꺼짐" : "Sound Off";
    if (typeSound) typeSound.pause();
    if (bgmSound) bgmSound.pause();
  }
}

function toggleLanguage() {
  clearTimeout(typingTimeout);
  clearTimeout(cursiveTimeout);
  const typeSound = document.getElementById("typeSound");
  const bgmSound = document.getElementById("bgmSound");

  if (typeSound) typeSound.pause();
  if (!isSoundOn && bgmSound) {
    bgmSound.pause();
  }
  currentLang = currentLang === "en" ? "ko" : "en";
  updateTexts();
  startIntroAnimation();
  renderGuestMessages();
}

function updateTexts() {
  const elements = document.querySelectorAll("#mainContent [data-en][data-ko]");
  elements.forEach((el) => {
    el.innerHTML = el.getAttribute(`data-${currentLang}`);
  });

  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn) {
    langBtn.innerText = currentLang === "en" ? "KOR" : "ENG";
  }

  const soundText = document.getElementById("soundText");
  if (soundText) {
    if (isSoundOn) {
      soundText.innerText = currentLang === "ko" ? "소리 켜짐" : "Sound On";
    } else {
      soundText.innerText = currentLang === "ko" ? "소리 꺼짐" : "Sound Off";
    }
  }

  const nameInput = document.getElementById("rsvpName");
  if (nameInput) {
    nameInput.placeholder =
      currentLang === "ko"
        ? nameInput.dataset.koPlaceholder || "성함을 입력해 주세요"
        : nameInput.dataset.enPlaceholder || "Enter your full name";
  }

  if (typeof handleGuestCountChange === "function") {
    handleGuestCountChange();
  }

  const introNamesEl = document.getElementById("introNames");
  if (introNamesEl) {
    introNamesEl.innerHTML =
      currentLang === "ko"
        ? '박효진 <span class="intro-amp">&</span> 이태현'
        : 'Mary Hyojin Park <span class="intro-amp">&</span> Paul Taehyun Lee';
  }

  const invitationNamesEl = document.getElementById("invitationNames");
  if (invitationNamesEl) {
    invitationNamesEl.innerHTML =
      currentLang === "ko"
        ? '박효진 <span class="intro-amp">&</span> 이태현'
        : 'Mary Hyojin Park <span class="intro-amp">&</span> Paul Taehyun Lee';
  }
}

function updateIntroTexts() {
  const langLabel = document.getElementById("introLangLabel");
  if (langLabel) {
    langLabel.innerHTML = introLang === "en" ? "🇰🇷 한글" : "🇺🇸 ENG";
  }

  const elements = document.querySelectorAll(
    ".intro-screen [data-en][data-ko]"
  );
  elements.forEach((el) => {
    el.innerText = el.getAttribute(`data-${introLang}`);
  });

  const soundLabel = document.getElementById("introSoundLabel");
  if (soundLabel) {
    soundLabel.innerText = introSound
      ? introLang === "ko"
        ? "소리: 켜짐"
        : "Sound: On"
      : introLang === "ko"
      ? "소리: 꺼짐"
      : "Sound: Off";
  }

  const introNamesEl = document.getElementById("introNames");
  if (introNamesEl) {
    introNamesEl.innerHTML =
      introLang === "ko"
        ? '박효진 <span class="intro-amp">&</span> 이태현'
        : 'Mary Hyojin Park <span class="intro-amp">&</span> Paul Taehyun Lee';
  }
}

// ==========================================
// 갤러리 자동 루프 생성 및 슬라이더 제어 로직
// ==========================================
let currentSlideIndex = 0;

function initGallery() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  track.innerHTML = "";

  const totalPhotos = 28;
  let slideGroupsHTML = "";

  for (let i = 1; i <= totalPhotos; i += 2) {
    const photo1 = `images/gallery/gallery-${String(i).padStart(2, "0")}.jpeg`;
    const photo2 =
      i + 1 <= totalPhotos
        ? `images/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpeg`
        : null;

    slideGroupsHTML += `
          <div class="gallery-slide-group">
              <div class="gallery-img-box" onclick="openLightbox('${photo1}')">
                  <img src="${photo1}" alt="Gallery Photo ${i}" onerror="this.src='https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'">
              </div>
              ${
                photo2
                  ? `
              <div class="gallery-img-box" onclick="openLightbox('${photo2}')">
                  <img src="${photo2}" alt="Gallery Photo ${
                      i + 1
                    }" onerror="this.src='https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'">
              </div>`
                  : ""
              }
          </div>
      `;
  }

  track.innerHTML = slideGroupsHTML;
  updateGallerySlide();
}

let currentLightboxIndex = 1;
const TOTAL_GALLERY_PHOTOS = 28;

function openLightbox(imgSrc) {
  if (!imgSrc || !imgSrc.includes("images/gallery/")) return;

  const modal = document.getElementById("photoLightbox");
  const modalImg = document.getElementById("lightboxImg");
  if (!modal || !modalImg) return;

  const match = imgSrc.match(/gallery-(\d+)\.jpeg/);
  if (match) {
    currentLightboxIndex = parseInt(match[1], 10);
  }

  modal.style.display = "flex";
  modalImg.src = imgSrc;

  if (!modalImg.dataset.nextBound) {
    modalImg.style.cursor = "pointer";
    modalImg.addEventListener("click", (e) => {
      e.stopPropagation();
      nextLightboxPhoto();
    });
    modalImg.dataset.nextBound = "true";
  }
}

function nextLightboxPhoto() {
  const modalImg = document.getElementById("lightboxImg");
  if (!modalImg) return;

  currentLightboxIndex =
    currentLightboxIndex >= TOTAL_GALLERY_PHOTOS ? 1 : currentLightboxIndex + 1;

  const nextSrc = `images/gallery/gallery-${String(
    currentLightboxIndex
  ).padStart(2, "0")}.jpeg`;
  modalImg.src = nextSrc;
}

function closeLightbox() {
  const modal = document.getElementById("photoLightbox");
  if (modal) {
    modal.style.display = "none";
  }
}

function updateGallerySlide() {
  const track = document.getElementById("galleryTrack");
  const indicator = document.getElementById("galleryPageIndicator");
  const totalGroups = document.querySelectorAll(".gallery-slide-group").length;

  if (!track || totalGroups === 0) return;

  track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  if (indicator) {
    indicator.innerText = `${currentSlideIndex + 1} / ${totalGroups}`;
  }
}

function nextGallerySlide() {
  const totalGroups = document.querySelectorAll(".gallery-slide-group").length;
  if (totalGroups === 0) return;
  currentSlideIndex = (currentSlideIndex + 1) % totalGroups;
  updateGallerySlide();
}

function prevGallerySlide() {
  const totalGroups = document.querySelectorAll(".gallery-slide-group").length;
  if (totalGroups === 0) return;
  currentSlideIndex = (currentSlideIndex - 1 + totalGroups) % totalGroups;
  updateGallerySlide();
}

// ==========================================
// GUESTBOOK MESSAGE (방명록 팝업 & Public/Private 데이터 관리)
// ==========================================
const STORAGE_KEY = "paul_mary_wedding_messages";
const MY_PRIVATE_IDS_KEY = "paul_mary_my_private_ids";

const MESSAGES_PER_PAGE = 2;
let currentMsgPage = 0;
let msgTouchStartX = 0;
let isMessagePrivate = false;

const defaultMessages = [
  {
    id: "default-1",
    name: "홍길동",
    content:
      "결혼을 진심으로 축하한다!\n둘이 지금처럼 행복하게 백년해로하기를😍\n그림 같은 결혼식도 얼마나 예쁠지 벌써 기대된당 Happy Wedding🩷",
    createdAt: "2026.11.21 16:20",
    isPrivate: false,
  },
  {
    id: "default-2",
    name: "김철수",
    content: "결혼을 진심으로 축하드립니다!",
    createdAt: "2026.11.21 15:10",
    isPrivate: false,
  },
];

function getMyPrivateIds() {
  try {
    return JSON.parse(localStorage.getItem(MY_PRIVATE_IDS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function addMyPrivateId(id) {
  const ids = getMyPrivateIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(MY_PRIVATE_IDS_KEY, JSON.stringify(ids));
  }
}

function setMessagePrivacy(mode) {
  isMessagePrivate = mode === "private";
  document.querySelectorAll(".privacy-opt-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.privacy === mode);
  });
}

async function fetchGuestMessages() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  return JSON.parse(saved);
}

async function saveGuestMessage(newMessage) {
  const messages = await fetchGuestMessages();
  messages.unshift(newMessage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function escapeHTML(str) {
  return String(str).replace(
    /[&<>"']/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[tag])
  );
}

function getMessagePages(messages) {
  const pages = [];
  for (let i = 0; i < messages.length; i += MESSAGES_PER_PAGE) {
    pages.push(messages.slice(i, i + MESSAGES_PER_PAGE));
  }
  return pages.length > 0 ? pages : [[]];
}

function updateMsgPageSlider(totalPages) {
  const track = document.getElementById("msgPagesTrack");
  const indicator = document.getElementById("msgPageIndicator");
  if (!track) return;

  if (currentMsgPage >= totalPages)
    currentMsgPage = Math.max(0, totalPages - 1);
  track.style.transform = `translateX(-${currentMsgPage * 100}%)`;

  if (indicator) {
    indicator.innerText = `${currentMsgPage + 1} / ${totalPages}`;
  }
}

function changeMsgPage(delta, totalPages) {
  if (totalPages <= 1) return;
  currentMsgPage = (currentMsgPage + delta + totalPages) % totalPages;
  updateMsgPageSlider(totalPages);
}

async function renderGuestMessages() {
  const listEl = document.getElementById("messageList");
  if (!listEl) return;

  const messages = await fetchGuestMessages();
  const myPrivateIds = getMyPrivateIds();
  const pages = getMessagePages(messages);
  const totalPages = pages.length;

  const slidesHTML = pages
    .map(
      (pageMsgs) => `
        <div class="msg-page-slide">
          ${pageMsgs
            .map((msg) => {
              const isPrivate = Boolean(msg.isPrivate);
              const isMine = msg.id && myPrivateIds.includes(msg.id);
              const canViewContent = !isPrivate || isMine;

              const displayContent = canViewContent
                ? escapeHTML(msg.content)
                : currentLang === "ko"
                ? "신랑·신부에게만 공개된 비공개 메시지입니다."
                : "Private message visible only to the bride and groom.";

              const lockBadge = isPrivate
                ? `<span class="msg-lock-icon" title="Private">🔒</span>`
                : "";

              return `
                <div class="guest-msg-card">
                  <div class="guest-msg-text ${
                    canViewContent ? "" : "is-private-hidden"
                  }">${displayContent}</div>
                  <div class="guest-msg-footer">
                    <div class="guest-msg-from">
                      <span class="from-label">From</span>${escapeHTML(
                        msg.name
                      )}${lockBadge}
                    </div>
                    <div class="guest-msg-date">${escapeHTML(
                      msg.createdAt
                    )}</div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `
    )
    .join("");

  const paginationHTML =
    totalPages > 1
      ? `
        <div class="msg-pagination-bar" id="msgPaginationBar">
          <button type="button" class="msg-page-btn" id="prevMsgPageBtn">‹</button>
          <span id="msgPageIndicator">${
            currentMsgPage + 1
          } / ${totalPages}</span>
          <button type="button" class="msg-page-btn" id="nextMsgPageBtn">›</button>
        </div>
      `
      : "";

  listEl.innerHTML = `
    <div class="msg-pages-viewport" id="msgPagesViewport">
      <div class="msg-pages-track" id="msgPagesTrack">
        ${slidesHTML}
      </div>
    </div>
    ${paginationHTML}
  `;

  updateMsgPageSlider(totalPages);

  const prevBtn = document.getElementById("prevMsgPageBtn");
  const nextBtn = document.getElementById("nextMsgPageBtn");
  if (prevBtn)
    prevBtn.addEventListener("click", () => changeMsgPage(-1, totalPages));
  if (nextBtn)
    nextBtn.addEventListener("click", () => changeMsgPage(1, totalPages));

  const viewport = document.getElementById("msgPagesViewport");
  if (viewport && totalPages > 1 && !viewport.dataset.swipeBound) {
    viewport.addEventListener(
      "touchstart",
      (e) => {
        msgTouchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      (e) => {
        const diffX = e.changedTouches[0].clientX - msgTouchStartX;
        if (Math.abs(diffX) > 40) {
          changeMsgPage(diffX < 0 ? 1 : -1, totalPages);
        }
      },
      { passive: true }
    );
    viewport.dataset.swipeBound = "true";
  }
}

function openMessageModal() {
  const modal = document.getElementById("messageModal");
  const nameInput = document.getElementById("guestNameInput");
  const contentInput = document.getElementById("guestContentInput");

  setMessagePrivacy("public");

  if (nameInput) {
    nameInput.placeholder =
      currentLang === "ko" ? "성함을 남겨주세요" : "Your Name";
  }
  if (contentInput) {
    contentInput.placeholder =
      currentLang === "ko"
        ? "200자 이내로 작성해 주세요"
        : "Write your message (max 200 chars)";
  }
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeMessageModal() {
  const modal = document.getElementById("messageModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function handleModalOverlayClick(event) {
  if (event.target.id === "messageModal") {
    closeMessageModal();
  }
}

function updateCharCount() {
  const contentInput = document.getElementById("guestContentInput");
  const countEl = document.getElementById("msgCharCount");
  if (contentInput && countEl) {
    countEl.innerText = `${contentInput.value.length} / 200`;
  }
}

function formatCurrentTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

async function submitGuestMessage(event) {
  event.preventDefault();

  const nameInput = document.getElementById("guestNameInput");
  const contentInput = document.getElementById("guestContentInput");

  const name = nameInput.value.trim();
  const content = contentInput.value.trim();

  if (!name || !content) return;

  const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (isMessagePrivate) {
    addMyPrivateId(msgId);
  }

  await saveGuestMessage({
    id: msgId,
    name,
    content,
    createdAt: formatCurrentTimestamp(),
    isPrivate: isMessagePrivate,
  });

  currentMsgPage = 0;
  nameInput.value = "";
  contentInput.value = "";
  setMessagePrivacy("public");
  updateCharCount();
  closeMessageModal();
  await renderGuestMessages();
}

// ==========================================
// RSVP FORM LOGIC & GOOGLE SHEETS SUBMISSION
// ==========================================
let rsvpSide = "신랑측";
let rsvpMeal = "예정";

const GOOGLE_SHEETS_RSVP_URL = "";

function selectRsvpOption(type, btnEl) {
  const group = btnEl.parentElement;
  group
    .querySelectorAll(".rsvp-opt-btn")
    .forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");

  if (type === "side") {
    rsvpSide = btnEl.dataset.value;
  } else if (type === "meal") {
    rsvpMeal = btnEl.dataset.value;
  }
}

function handleGuestCountChange() {
  const countInput = document.getElementById("rsvpCount");
  const companionInput = document.getElementById("rsvpCompanion");
  const companionRow = document.getElementById("companionRow");
  if (!countInput || !companionInput || !companionRow) return;

  const count = parseInt(countInput.value, 10) || 1;

  if (count <= 1) {
    companionInput.value = "";
    companionInput.disabled = true;
    companionInput.placeholder =
      currentLang === "ko"
        ? "참석인원 2명 이상 시 입력 가능"
        : "Available for 2+ guests";
    companionRow.classList.add("is-disabled");
  } else {
    companionInput.disabled = false;
    companionInput.placeholder =
      currentLang === "ko"
        ? "함께 오시는 분 성함을 입력해 주세요"
        : "Enter companion name(s)";
    companionRow.classList.remove("is-disabled");
  }
}

async function submitRsvp(event) {
  event.preventDefault();

  const name = document.getElementById("rsvpName").value.trim();
  const count = parseInt(document.getElementById("rsvpCount").value, 10) || 1;
  const companion =
    count > 1 ? document.getElementById("rsvpCompanion").value.trim() : "";
  const submitBtn = document.getElementById("rsvpSubmitBtn");

  if (!name) return;

  const payload = {
    side: rsvpSide,
    name,
    count,
    companion: companion || "-",
    meal: rsvpMeal,
    submittedAt: formatCurrentTimestamp(),
  };

  submitBtn.disabled = true;
  submitBtn.innerText = currentLang === "ko" ? "전달 중..." : "Sending...";

  try {
    if (GOOGLE_SHEETS_RSVP_URL) {
      await fetch(GOOGLE_SHEETS_RSVP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      const localRsvps = JSON.parse(
        localStorage.getItem("paul_mary_rsvps") || "[]"
      );
      localRsvps.unshift(payload);
      localStorage.setItem("paul_mary_rsvps", JSON.stringify(localRsvps));
    }

    alert(
      currentLang === "ko"
        ? `${name}님의 참석 여부가 소중히 전달되었습니다. 감사합니다!`
        : `Thank you, ${name}! Your RSVP has been received.`
    );

    document.getElementById("rsvpForm").reset();
    handleGuestCountChange();
  } catch (err) {
    alert(
      currentLang === "ko"
        ? "전송 중 오류가 발생했습니다. 다시 시도해 주세요."
        : "Something went wrong. Please try again."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = currentLang === "ko" ? "전달하기" : "Submit RSVP";
  }
}

// ==========================================
// SCROLL CUE: 첫 페이지 진입 후 정확히 5초 뒤 등장
// ==========================================
let scrollCueTimer = null;

function initScrollCue() {
  const container = document.getElementById("invitationContainer");
  const scrollCue = document.getElementById("scrollCue");
  if (!container || !scrollCue) return;

  scrollCue.classList.remove("is-visible", "is-hidden");
  if (scrollCueTimer) clearTimeout(scrollCueTimer);

  scrollCueTimer = setTimeout(() => {
    if (container.scrollTop <= 30) {
      scrollCue.classList.add("is-visible");
    }
  }, 5000);

  if (!scrollCue.dataset.bound) {
    container.addEventListener(
      "scroll",
      () => {
        if (container.scrollTop > 30) {
          scrollCue.classList.add("is-hidden");
        } else {
          scrollCue.classList.remove("is-hidden");
        }
      },
      { passive: true }
    );
    scrollCue.dataset.bound = "true";
  }
}
