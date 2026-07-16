// Collect and isolate state management DOM target nodes
document.addEventListener('DOMContentLoaded', () => {
    const chatFeed = document.getElementById('chatFeed');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const newThreadBtn = document.getElementById('newThreadBtn');
    const presetItems = document.querySelectorAll('[data-preset]');

    // Pin scroll window position values cleanly to footer boundaries
    function scrollToBottom() {
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }

    // Process and dispatch clear history buffer states
    function clearFeed() {
        chatFeed.innerHTML = `
            <div class="message-group">
                <div class="message-row bot">
                    <div class="avatar">AI</div>
                    <div class="message-bubble">Thread buffer cleared. Ready for initialization.</div>
                </div>
            </div>`;
        scrollToBottom();
    }

    // Inject preset text directly from side shortcuts
    function insertPreset(text) {
        userInput.value = text;
        sendMessage();
    }

    // Primary runtime payload dispatch loop logic
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Render user message bubble layout immediately
        appendMessage(text, 'user');
        userInput.value = '';
        setLoadingState(true);

        try {
            // Forward payload string elements tracking back to local Flask server route
            const response = await fetch("https://your-chatbot.onrender.com/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "Hello"
  })
})
.then(response => response.json())
.then(data => console.log(data.reply));
            const data = await response.json();

            if (response.ok) {
                appendMessage(data.reply, 'bot', true);
            } else {
                appendMessage(`Error: ${data.message || 'Verification failure.'}`, 'bot');
            }
        } catch (err) {
            appendMessage("Connection problem.", "bot");
        } finally {
            setLoadingState(false);
        }
    }

    // Dynamic Element Builder Engine for message streams
    function appendMessage(text, sender, includeMeta = false) {
        const group = document.createElement('div');
        group.className = 'message-group';

        const avatarLabel = sender === 'user' ? 'ME' : 'AI';
        
        // Construct standard structural content row
        const row = document.createElement('div');
        row.className = `message-row ${sender}`;
        row.innerHTML = `
            <div class="avatar">${avatarLabel}</div>
            <div class="message-bubble"></div>
        `;
        // Use textContent securely to avoid malicious raw HTML script injections
        row.querySelector('.message-bubble').textContent = text;
        group.appendChild(row);

        // Append sub-action control nodes if requested
        if (includeMeta) {
            const meta = document.createElement('div');
            meta.className = 'msg-meta';
            
            const copyBtn = document.createElement('span');
            copyBtn.className = 'meta-action';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => navigator.clipboard.writeText(text));

            const reuseBtn = document.createElement('span');
            reuseBtn.className = 'meta-action';
            reuseBtn.textContent = 'Reuse';
            reuseBtn.addEventListener('click', () => insertPreset(text));

            meta.appendChild(copyBtn);
            meta.appendChild(reuseBtn);
            group.appendChild(meta);
        }
        
        chatFeed.appendChild(group);
        scrollToBottom();
    }

    // Toggle interactive focus variables during network transmission
    function setLoadingState(isLoading) {
        if (isLoading) {
            userInput.disabled = true;
            sendBtn.disabled = true;
            
            const loader = document.createElement('div');
            loader.id = 'activeLoader';
            loader.className = 'message-row bot';
            loader.innerHTML = `
                <div class="avatar">AI</div>
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            chatFeed.appendChild(loader);
        } else {
            userInput.disabled = false;
            sendBtn.disabled = false;
            const loader = document.getElementById('activeLoader');
            if (loader) loader.remove();
            userInput.focus();
        }
        scrollToBottom();
    }

    // Clean Event Listener Triggers
    sendBtn.addEventListener('click', sendMessage);
    newThreadBtn.addEventListener('click', clearFeed);
    
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    presetItems.forEach(item => {
        item.addEventListener('click', () => {
            const command = item.getAttribute('data-preset');
            insertPreset(command);
        });
    });
});
