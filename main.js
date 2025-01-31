const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);

  const img = document.createElement('img');
  img.src = role === 'user' ? '../img/user.png' : '../img/ai.png';
  img.alt = role === 'user' ? 'User' : 'Tarz Bots';

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.textContent = content;

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('message-actions');
  actionsDiv.innerHTML = `
    <button onclick="copyText('${content}')">Salin</button>
    <button onclick="likeMessage()">👍</button>
    <button onclick="dislikeMessage()">👎</button>
    <button onclick="editMessage()">✏️</button>
  `;

  messageDiv.appendChild(img);
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(actionsDiv);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  userInput.value = '';

  try {
    const response = await fetch('https://api.gemini.google.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'AIzaSyC0Cjd5U_kIM9tvqxfjjvQ_MlhabjtxA30'
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    addMessage('bot', data.response);
  } catch (error) {
    addMessage('bot', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Teks berhasil disalin!');
  });
}

function likeMessage() {
  alert('Anda menyukai pesan ini!');
}

function dislikeMessage() {
  alert('Anda tidak menyukai pesan ini!');
}

function editMessage() {
  alert('Fitur edit belum tersedia.');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});