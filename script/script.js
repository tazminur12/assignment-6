const apiBaseUrl = "https://openapi.programming-hero.com/api";
const container = document.getElementById("user-container");
const lessonMessage = document.getElementById("lesson-message");
const lessonButtons = document.querySelectorAll("#lesson-buttons button");

const navbarButtons = document.getElementById('navbar-buttons');
const loginFormSection = document.getElementById('login-form-section');
const bannerImageSection = document.getElementById('banner-image-section');  // নতুন লাইন
const getStartedButton = document.getElementById('get-started-button');

const lessonSection = document.getElementById('lesson-section');
const faqSection = document.getElementById('faq-section');

const storedUsers = [
  { name: "admin", pass: "1234" },
  { name: "tanim", pass: "5678" }
];

function updateUIByLoginStatus() {
  const user = localStorage.getItem("loggedInUser");

  if (user) {
    // Hide login form & banner image separately
    loginFormSection?.classList.add("hidden");
    bannerImageSection?.classList.add("hidden");

    // Show lesson and FAQ sections
    lessonSection?.classList.remove("hidden");
    faqSection?.classList.remove("hidden");

    // Show navbar buttons
    navbarButtons.innerHTML = `
      <button id="faq-button" class="btn btn-outline btn-primary mr-2">
        <img src="./assets/fa-circle-question.png" alt="" class="w-5 h-5 inline-block mr-1"> FAQ
      </button>
      <button id="learn-button" class="btn btn-outline btn-primary mr-2">
        <img src="./assets/fa-book-open.png" alt="" class="w-5 h-5 inline-block mr-1"> Learn
      </button>
      <button id="logout-button" class="btn btn-outline btn-error">
        <img src="./assets/fa-arrow-right-from-bracket.png" alt="" class="w-5 h-5 inline-block mr-1"> Logout
      </button>
    `;

    // Attach event listeners for new buttons
    document.getElementById('logout-button').addEventListener('click', () => {
      localStorage.removeItem("loggedInUser");
      alert("Successfully Logged Out!");
      window.location.reload();
    });

    document.getElementById('faq-button').addEventListener('click', () => {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('learn-button').addEventListener('click', () => {
      lessonSection.scrollIntoView({ behavior: 'smooth' });
    });

  } else {
    // Show login form & banner image separately
    loginFormSection?.classList.remove("hidden");
    bannerImageSection?.classList.remove("hidden");

    // Hide lesson and FAQ sections
    lessonSection?.classList.add("hidden");
    faqSection?.classList.add("hidden");

    // Clear navbar buttons
    navbarButtons.innerHTML = "";
  }
}

getStartedButton?.addEventListener('click', () => {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const isValid = storedUsers.find(user => user.name === username && user.pass === password);

  if (isValid) {
    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    updateUIByLoginStatus();
  } else {
    alert("Invalid username or password!");
  }
});

function setActiveButton(activeButton) {
  lessonButtons.forEach(btn => {
    btn.classList.remove("bg-blue-500", "text-white");
    btn.classList.add("text-blue-500");
  });
  activeButton.classList.add("bg-blue-500", "text-white");
}

async function loadLesson(lessonNumber) {
  try {
    container.innerHTML = `<span class="loading loading-spinner text-primary"></span>`;
    lessonMessage.classList.add('hidden');
    setActiveButton(event.currentTarget);

    const response = await fetch(`${apiBaseUrl}/level/${lessonNumber}`);
    const data = await response.json();

    container.innerHTML = '';

    if (data.data && data.data.length > 0) {
      data.data.slice(0, 6).forEach(word => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-md shadow hover:shadow-lg transition duration-300 relative';

        div.innerHTML = `
          <h3 class="text-xl font-bold text-center text-black">${word.word}</h3>
          <p class="text-gray-600 text-center text-sm mt-2">Meaning / Pronunciation</p>
          <p class="text-center font-semibold text-lg mt-2">"${word.meaning} / ${word.pronunciation}"</p>

          <div class="flex justify-center gap-4 mt-4">
            <button onclick="openWordDetails('${word.id}')" class="bg-blue-100 p-3 rounded-full text-xl hover:bg-blue-300">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button onclick="playPronunciation('${word.word}')" class="bg-blue-100 p-3 rounded-full text-xl hover:bg-blue-300">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        `;
        container.appendChild(div);
      });
    } else {
      lessonMessage.classList.remove('hidden');
    }
  } catch (error) {
    console.error("Error loading lesson words:", error);
    lessonMessage.classList.remove('hidden');
    container.innerHTML = '';
  }
}

async function openWordDetails(wordId) {
  try {
    const response = await fetch(`${apiBaseUrl}/word/${wordId}`);
    const data = await response.json();
    const word = data.data;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <h2 class="text-2xl font-bold mb-2">${word.word} (${word.pronunciation})</h2>
      <p class="mb-2"><strong>Meaning:</strong> ${word.meaning}</p>
      <p class="mb-2"><strong>Example:</strong> ${word.example_sentence || 'No example available.'}</p>
      <div class="flex flex-wrap gap-2 mt-4">
        ${word.synonyms.map(syn => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${syn}</span>`).join('')}
      </div>
      <button onclick="closeModal()" class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mt-6 w-full">Complete Learning</button>
    `;

    document.getElementById('wordModal').classList.remove('hidden');
  } catch (error) {
    console.error("Error loading word details:", error);
  }
}

function playPronunciation(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function closeModal() {
  document.getElementById('wordModal').classList.add('hidden');
}

// Initialize UI state on page load
updateUIByLoginStatus();
