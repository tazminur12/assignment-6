
    const apiBaseUrl = "https://openapi.programming-hero.com/api";
    const container = document.getElementById("user-container");
    const lessonMessage = document.getElementById("lesson-message");
    const lessonButtons = document.querySelectorAll("#lesson-buttons button");
    
    // Extra buttons (FAQ, Learn, Logout, Get Started)
    const faqButton = document.getElementById('faq-button');
    const learnButton = document.getElementById('learn-button');
    const logoutButton = document.getElementById('logout-button');
    const getStartedButton = document.getElementById('get-started-button');
    
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
    
    // Handle FAQ, Learn, Logout, Get Started Buttons
    faqButton?.addEventListener('click', () => {
      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    learnButton?.addEventListener('click', () => {
      document.getElementById('lesson-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    logoutButton?.addEventListener('click', () => {
      // Session clear korte paren
      alert('Successfully Logged Out!');
      // window.location.reload(); // Optional: Page reload korate hole uncomment koren
    });
    
    getStartedButton?.addEventListener('click', () => {
      window.location.href = '/signup.html'; // Redirect korbe signup page e
    });
  