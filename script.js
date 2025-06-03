const state = {
  completedSteps: [0], // Home is always completed
  newsSource: "",
  chatTurnCount: 0,
}

// Load state from localStorage
function loadState() {
  const storedSteps = localStorage.getItem("completedSteps")
  if (storedSteps) {
    state.completedSteps = JSON.parse(storedSteps)
  }

  const storedNewsSource = localStorage.getItem("newsSource")
  if (storedNewsSource) {
    state.newsSource = storedNewsSource
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("completedSteps", JSON.stringify(state.completedSteps))
  if (state.newsSource) {
    localStorage.setItem("newsSource", state.newsSource)
  }
}

// Update sidebar based on completed steps
function updateSidebar() {
  const menuItems = [
    { id: "survey-menu-item", order: 1, href: "survey.html" },
    { id: "chat-menu-item", order: 2, href: "chat.html" },
    { id: "survey2-menu-item", order: 3, href: "survey-2.html" },
    { id: "thankyou-menu-item", order: 4, href: "thank-you.html" },
  ]

  menuItems.forEach((item) => {
    const menuItem = document.getElementById(item.id)
    if (!menuItem) return

    const isCompleted = state.completedSteps.includes(item.order)

    if (isCompleted) {
      // Enable the menu item
      menuItem.classList.remove("disabled")

      // Replace the disabled span with a link if it's disabled
      if (menuItem.querySelector(".sidebar-menu-button.disabled")) {
        menuItem.innerHTML = `
          <a href="${item.href}" class="sidebar-menu-button">
            ${menuItem.querySelector(".sidebar-menu-button").innerHTML}
          </a>
        `
      }
    }
  })
}

// Mark a step as completed
function completeStep(stepOrder) {
  if (!state.completedSteps.includes(stepOrder)) {
    state.completedSteps.push(stepOrder)
    saveState()
    updateSidebar()
  }
}

// Initialize the survey page
function initSurveyPage() {
  loadState()
  updateSidebar()

  const form = document.getElementById("survey-form")
  const submitButton = document.getElementById("survey-submit")
  const radioInputs = document.querySelectorAll('input[name="news-source"]')
  const otherSourceContainer = document.getElementById("other-source-container")
  const otherSourceInput = document.getElementById("other-source")

  // Enable/disable submit button based on selection
  function updateSubmitButton() {
    const selectedValue = document.querySelector('input[name="news-source"]:checked')?.value

    if (selectedValue === "Other") {
      submitButton.disabled = !otherSourceInput.value.trim()
    } else {
      submitButton.disabled = !selectedValue
    }
  }

  // Show/hide other source input
  radioInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "Other") {
        otherSourceContainer.classList.remove("hidden")
      } else {
        otherSourceContainer.classList.add("hidden")
      }
      updateSubmitButton()
    })
  })

  // Update button state when typing in other source
  if (otherSourceInput) {
    otherSourceInput.addEventListener("input", updateSubmitButton)
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const selectedValue = document.querySelector('input[name="news-source"]:checked').value
    state.newsSource = selectedValue === "Other" ? otherSourceInput.value : selectedValue

    // Save to state
    saveState()

    // Mark step as completed
    completeStep(1)

    // Navigate to chat page
    window.location.href = "chat.html"
  })
}

// Initialize the chat page
function initChatPage() {
  loadState()
  updateSidebar()

  const chatMessages = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")
  const chatSubmit = document.getElementById("chat-submit")

  // Add a message to the chat
  function addMessage(content, role) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `chat-message ${role}`

    messageDiv.innerHTML = `
      <div class="chat-avatar ${role}">${role === "user" ? "U" : "AI"}</div>
      <div class="chat-message-content">${content}</div>
    `

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Add typing indicator
  function addTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "chat-message assistant"
    typingDiv.id = "typing-indicator"

    typingDiv.innerHTML = `
      <div class="chat-avatar assistant">AI</div>
      <div class="chat-message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `

    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Simulate AI response
  function simulateResponse() {
    addTypingIndicator()

    setTimeout(() => {
      removeTypingIndicator()

      let response = ""
      state.chatTurnCount++

      if (state.chatTurnCount >= 3) {
        response =
          "Thank you for sharing your thoughts! We've completed this part of the study. Let's move on to the next section."

        // Disable input after final message
        chatInput.disabled = true
        chatSubmit.disabled = true

        // Mark chat as completed
        completeStep(2)

        // Auto navigate to next page after delay
        setTimeout(() => {
          window.location.href = "survey-2.html"
        }, 3000)
      } else if (state.chatTurnCount === 1) {
        response = `That's interesting! How often do you consume news from ${state.newsSource}?`
      } else {
        response = `Thank you for sharing. Do you think ${state.newsSource} provides balanced coverage of important topics?`
      }

      addMessage(response, "assistant")

      // Enable input after response
      chatInput.disabled = false
      chatInput.focus()
    }, 1000)
  }

  // Handle form submission
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const message = chatInput.value.trim()
    if (!message) return

    // Add user message
    addMessage(message, "user")

    // Clear input
    chatInput.value = ""
    chatInput.disabled = true
    chatSubmit.disabled = true

    // Simulate AI response
    simulateResponse()
  })

  // Add initial message if this is the first load
  if (chatMessages.children.length === 0) {
    const initialMessage = `What is your favorite part about getting your news from ${state.newsSource || "your chosen source"}?`
    addMessage(initialMessage, "assistant")
    chatInput.disabled = false
    chatInput.focus()
  }
}

// Initialize the follow-up survey page
function initSurvey2Page() {
  loadState()
  updateSidebar()

  const form = document.getElementById("survey2-form")
  const submitButton = document.getElementById("survey2-submit")
  const radioInputs = document.querySelectorAll('input[name="satisfaction"]')

  // Enable/disable submit button based on selection
  function updateSubmitButton() {
    const selectedValue = document.querySelector('input[name="satisfaction"]:checked')?.value
    submitButton.disabled = !selectedValue
  }

  // Update button state when selecting satisfaction
  radioInputs.forEach((input) => {
    input.addEventListener("change", updateSubmitButton)
  })

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Mark step as completed
    completeStep(3)

    // Navigate to thank you page
    window.location.href = "thank-you.html"
  })
}

// Initialize the thank you page
function initThankYouPage() {
  loadState()
  updateSidebar()

  // Mark step as completed
  completeStep(4)
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadState()
  updateSidebar()
})
