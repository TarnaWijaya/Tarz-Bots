const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const GEMINI_API_KEY = 'AIzaSyC0Cjd5U_kIM9tvqxfjjvQ_MlhabjtxA30';

function addMessage(role, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);

  const logo = document.createElement('img');
  logo.src = role === 'user' ?
  'https://github.com/TarnaWijaya/Tarz-Bots/blob/3b7501a5a5dc179fb6cf6a700ef28d71c8f54647/img/user.png'
  :
  'https://github.com/TarnaWijaya/Tarz-Bots/blob/3b7501a5a5dc179fb6cf6a700ef28d71c8f54647/img/ai.png';
  logo.alt = role === 'user' ? 'User Logo' : 'Tarz Bots Logo';

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.innerText = text;

  const actionButtons = document.createElement('div');
  actionButtons.classList.add('action-buttons');

  if (role === 'ai') {
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Salin';
    copyButton.onclick = () => copyText(text);
    actionButtons.appendChild(copyButton);

    const likeButton = document.createElement('button');
    likeButton.innerText = '👍';
    likeButton.onclick = () => alert('Anda menyukai respons ini!');
    actionButtons.appendChild(likeButton);

    const dislikeButton = document.createElement('button');
    dislikeButton.innerText = '👎';
    dislikeButton.onclick = () => alert('Anda tidak menyukai respons ini!');
    actionButtons.appendChild(dislikeButton);
  }

  messageDiv.appendChild(logo);
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(actionButtons);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Teks berhasil disalin!');
  });
}

async function sendMessageToGemini(message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: message }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content.parts[0].text) {
      throw new Error('Respons dari API tidak valid.');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

sendBtn.addEventListener('click', async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) {
    alert('Silakan ketik pesan Anda terlebih dahulu.');
    return;
  }

  addMessage('user', userMessage);
  userInput.value = '';

  try {
    const aiResponse = await sendMessageToGemini(userMessage);
    addMessage('ai', aiResponse);
  } catch (error) {
    addMessage('ai', '⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
});

addMessage('ai', '👋 Halo! Saya Tarz Bots, asisten AI Anda. Silakan ketik pesan Anda di sini.');