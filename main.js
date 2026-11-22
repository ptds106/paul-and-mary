let currentLang = "en";
let isSoundOn = true;

let introLang = "en";
let introSound = true;

// main.js 파일 안의 toggleIntroLanguage 및 updateIntroTexts 함수 부분 수정

// 인트로 화면 언어 토글 (영어 모드일 때는 "한글", 한국어 모드일 때는 "ENG" 표시)
function toggleIntroLanguage() {
  introLang = introLang === "en" ? "ko" : "en";
  updateIntroTexts(); // 국기와 텍스트가 양쪽 모두 완벽하게 갱신되도록 함수 호출
}

// 페이지가 처음 로드될 때 인트로 텍스트와 버튼 라벨을 초기 상태(영어 모드 + "한글" 버튼 텍스트)로 정확히 세팅
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

  // 인트로 숨기고 메인 콘텐츠 표시
  document.getElementById("introScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  // 컨테이너 스크롤을 무조건 맨 위(0)로 강제 고정
  const container = document.getElementById("invitationContainer");
  if (container) {
    container.scrollTop = 0;
  }

  updateTexts();
  startIntroAnimation();
  startWeddingCountdown();
  initGallery(); //
  renderGuestMessages(); // <-- 방명록 렌더링 추가
  handleGuestCountChange();
  initScrollCue();
}

// 새로고침 시 최상단으로 스크롤 초기화 및 인트로 유지
window.onbeforeunload = function () {
  document.getElementById("invitationContainer").scrollTop = 0;
};

const typewriterStrings = {
  ko: "이태현과 박효진이 결혼합니다.",
  en: "Paul & Mary are getting married.",
};

const cursiveString = "Welcome to our wedding";

let typingTimeout;
let cursiveTimeout;

let bgmTimeout; // 상단 전역 변수에 없으면 함께 선언

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
      // 1) 타자 소리 정지
      if (typeSound) {
        typeSound.pause();
        typeSound.currentTime = 0;
      }

      // 2) 타자 끝난 시점 기준 정확히 1초(1000ms) 뒤 노래 시작
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

          // 3) 'Welcome to our wedding' 타이핑 속도 빠르게(40ms) 및 딜레이 단축(250ms)
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
  // 2027년 3월 7일 오후 5시 기준 타임스탬프
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
  // updateTexts() 함수 내부 하단에 추가
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
}
function updateIntroTexts() {
  const langLabel = document.getElementById("introLangLabel");

  // 영어 모드(en)일 때 다음 선택지인 "한글"과 태극기 표시, 한국어 모드(ko)일 때 "ENG"와 성조기 표시
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
}
// ==========================================
// 갤러리 자동 루프 생성 및 슬라이더 제어 로직
// ==========================================
let currentSlideIndex = 0;

// 갤러리 자동 루프 생성 (클릭 시 확대되도록 onclick 추가)
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

// 라이트박스 열기 (사진 누를 때)
function openLightbox(imgSrc) {
  const modal = document.getElementById("photoLightbox");
  const modalImg = document.getElementById("lightboxImg");
  if (modal && modalImg) {
    modal.style.display = "flex";
    modalImg.src = imgSrc;
  }
}

// 라이트박스 닫기 (배경이나 X 버튼 누를 때)
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

  // 사르르 넘어가는 슬라이드 트랙 이동
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

// 청첩장 입장 시 갤러리 초기화 함수도 함께 실행되도록 enterInvitation 함수 안에 initGallery(); 추가
// ==========================================
// GUESTBOOK MESSAGE (방명록 팝업 & 데이터 관리)
// ==========================================
const STORAGE_KEY = "paul_mary_wedding_messages";

// 기본 샘플 메시지 (DB 연결 전 화면 미리보기용)
const defaultMessages = [
  {
    name: "홍길동",
    content:
      "결혼을 진심으로 축하한다!\n둘이 지금처럼 행복하게 백년해로하기를😍\n그림 같은 결혼식도 얼마나 예쁠지 벌써 기대된당 Happy Wedding🩷",
    createdAt: "2026.11.21 16:20",
  },
  {
    name: "김철수",
    content: "결혼을 진심으로 축하드립니다!",
    createdAt: "2026.11.21 15:10",
  },
];

// 추후 백엔드(Firebase / Supabase) 연동 시 이 함수만 API 호출로 교체하면 됩니다.
async function fetchGuestMessages() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  return JSON.parse(saved);
}

// 추후 백엔드 연동 시 이 저장 함수만 DB insert로 교체하면 됩니다.
async function saveGuestMessage(newMessage) {
  const messages = await fetchGuestMessages();
  messages.unshift(newMessage); // 최신 글이 맨 위로 오도록 추가
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function escapeHTML(str) {
  return str.replace(
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

async function renderGuestMessages() {
  const listEl = document.getElementById("messageList");
  if (!listEl) return;

  const messages = await fetchGuestMessages();
  listEl.innerHTML = messages
    .map(
      (msg) => `
        <div class="guest-msg-card">
            <div class="guest-msg-text">${escapeHTML(msg.content)}</div>
            <div class="guest-msg-footer">
                <div class="guest-msg-from">
                    <span class="from-label">From</span>${escapeHTML(msg.name)}
                </div>
                <div class="guest-msg-date">${escapeHTML(msg.createdAt)}</div>
            </div>
        </div>
    `
    )
    .join("");
}

function openMessageModal() {
  const modal = document.getElementById("messageModal");
  const nameInput = document.getElementById("guestNameInput");
  const contentInput = document.getElementById("guestContentInput");

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

  await saveGuestMessage({
    name,
    content,
    createdAt: formatCurrentTimestamp(),
  });

  nameInput.value = "";
  contentInput.value = "";
  updateCharCount();
  closeMessageModal();
  await renderGuestMessages();
}
// ==========================================
// RSVP FORM LOGIC & GOOGLE SHEETS SUBMISSION
// ==========================================
let rsvpSide = "신랑측";
let rsvpMeal = "예정";

// 나중에 Google Sheets Apps Script 웹앱 URL을 발급받으시면 여기에 붙여넣으세요!
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

// 참석인원 1명일 때 동행인 칸 Grey Out 및 비활성화
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
      // 웹앱 URL 연결 전 로컬 백업 저장
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

  // 처음 진입 시 확실히 숨김 초기화
  scrollCue.classList.remove("is-visible", "is-hidden");
  if (scrollCueTimer) clearTimeout(scrollCueTimer);

  // 5초(5000ms) 뒤에 표시
  scrollCueTimer = setTimeout(() => {
    if (container.scrollTop <= 30) {
      scrollCue.classList.add("is-visible");
    }
  }, 5000);

  // 스크롤 내리면 숨김
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
