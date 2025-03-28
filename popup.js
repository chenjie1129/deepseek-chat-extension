document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send');
  const input = document.getElementById('input');
  
  sendBtn.addEventListener('click', async () => {
    const message = input.value.trim();
    if (!message) return;
    
    // 先显示用户发送的消息
    addMessage('user', message);
    
    // 清除输入框
    input.value = '';
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'chatWithDeepSeek',
        message: message
      });

      if (response.choices?.[0]?.message?.content) {
        addMessage('assistant', response.choices[0].message.content);
      } else if (response.error) {
        addMessage('system', `错误: ${response.error}`);
      }
    } catch (error) {
      addMessage('system', `错误: ${error.message}`);
    }
  });
});

function addMessage(role, content) {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  div.textContent = `${role}: ${content}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}