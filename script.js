document.addEventListener("DOMContentLoaded", function() {
  function scrollToMembership() {
      const membershipElement = document.querySelector('.membership-container');
      if (membershipElement) {
          const offsetPosition = membershipElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  }

  function scrollToOurTrainers() {
      const trainerElement = document.querySelector('.trainers-section');
      if (trainerElement) {
          const offsetPosition = trainerElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  }

  function scrollToContactUs() {
      const contactElement = document.querySelector('.footer-container');
      if (contactElement) {
          const offsetPosition = contactElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  }

  document.getElementById("plans")?.addEventListener("click", scrollToMembership);
  document.querySelector(".mt-3")?.addEventListener("click", scrollToMembership);
  document.getElementById("our-trainers")?.addEventListener("click", scrollToOurTrainers);
  document.getElementById("contact-us")?.addEventListener("click", scrollToContactUs);

  const chatContainer = document.querySelector(".chat-container");
  const chatBox = document.querySelector(".chat-box");
  const chatButton = document.querySelector(".chat-button");
  const promptInput = document.querySelector(".prompt");
  const chatBtn = document.querySelector(".input-area button");
  const h1 = document.querySelector(".chat-box h1");

  let userMessage = "";

  if (chatButton && chatBox) {
      chatButton.addEventListener("click", () => {
          chatBox.classList.toggle("active-chat-box");
          if (chatBox.classList.contains("active-chat-box")) {
              chatBox.style.display = "block";
              document.querySelector(".material-symbols-outlined").innerText="close";
          } else {
              document.querySelector(".material-symbols-outlined").innerText="chat";
              chatBox.style.display = "none";
          }
      });
  } else {
      console.error("Chat button or chat box not found.");
  }

  const Api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDvNRFmRVdPtvbtlDYXTeBA04XAk_A99uk';

  async function generateApiResponse(aiChatBox) {
      const textElement = aiChatBox.querySelector(".text");
      try {
          const response = await fetch(Api_url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  contents: [{
                      "role": "user",
                      "parts": [{ text: `${userMessage} in 100 words` }]
                  }]
              })
          });
          const data = await response.json();
          const apiResponse = data?.candidates[0]?.content?.parts[0]?.text.trim();
          textElement.innerText = apiResponse || "Sorry, I couldn't process your request.";
      } catch (error) {
          console.error("API Error:", error);
          textElement.innerText = "Error fetching response. Please try again later.";
      } finally {
          aiChatBox.querySelector(".loading").style.display = "none";
          chatContainer.scrollTop = chatContainer.scrollHeight;
      }
  }

  function createChatBox(html, className) {
      const div = document.createElement("div");
      div.classList.add(className);
      div.innerHTML = html;
      return div;
  }

  function showLoading() {
      const html = `<p class="text"></p>
                    <img src="load.gif" class="loading" width="50px">`;
      let aiChatBox = createChatBox(html, "ai-chat-box");
      chatContainer.appendChild(aiChatBox);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      generateApiResponse(aiChatBox);
  }

  function addChat() {
      h1.style.display = "none";
      userMessage = promptInput.value.trim();
      if (!userMessage) return;

      const html = '<p class="text"></p>';
      let userChatBox = createChatBox(html, "user-chat-box");
      userChatBox.querySelector(".text").innerText = userMessage;
      chatContainer.appendChild(userChatBox);
      promptInput.value = "";

      setTimeout(showLoading, 500);
  }

  chatBtn.addEventListener("click", addChat);

  promptInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          event.preventDefault();
          addChat();
      }
  });
});
