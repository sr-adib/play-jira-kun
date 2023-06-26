const body = document.querySelector('body');

const jirakunDiv = document.createElement('div');

// States
let isListening = false;
let isWritingSummary = false;
let isWritingDescription = false;

function initJirakun() {
  // createButton.click();
  jirakunDiv.id = 'jirakun-div';
  body.appendChild(jirakunDiv);

  const recognition = new webkitSpeechRecognition();
  recognition.interimResults = true;

  let transcript = '';
  recognition.onresult = (e) => {
    transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('')
      .toLowerCase();
  };

  recognition.onspeechend = (e) => {
    console.log(transcript);
    translateAction(transcript);
    transcript = '';
  };

  recognition.onend = recognition.start;
  recognition.start();
}
initJirakun();

function translateAction(transcript) {
  const createButton = document.querySelector('#createGlobalItem');
  const realCreateButton = document.querySelector(
    'button[form="issue-create.ui.modal.create-form"]'
  );
  const cancelButton = document.querySelector(
    'button[data-testid="issue-create.common.ui.footer.cancel-button"]'
  );
  const summaryInput = document.querySelector('#summary-field');
  const descriptionInput = document.querySelector(
    'div[aria-label="Description - Main content area, start typing to enter text."]'
  );

  if (transcript === 'hey jira') {
    console.log('I am listening');
    isListening = true;
    return;
  } else if (transcript === 'stop listening') {
    isListening = false;
    return;
  }

  if (!isListening) {
    return;
  }

  if (isWritingSummary) {
    for (let char of transcript) {
      const keyEvent = new KeyboardEvent('keydown', { key: char });
      summaryInput.dispatchEvent(keyEvent);
      summaryInput.value += char;
    }
    isWritingSummary = false;
    return;
  } else if (isWritingDescription) {
    for (let char of transcript) {
      const keyEvent = new KeyboardEvent('keydown', { key: char });
      descriptionInput.dispatchEvent(keyEvent);
      descriptionInput.value += char;
    }
    isWritingDescription = false;
    return;
  }

  switch (transcript) {
    case 'create ticket':
      createButton.click();
      break;
    case 'summary':
      isWritingSummary = true;
      summaryInput.focus();
      break;
    case 'description':
      isWritingDescription = true;
      descriptionInput.focus();
      break;
    case 'create':
      realCreateButton.click();
      break;
    case 'cancel':
      cancelButton.click();
      break;

    default:
      break;
  }
}

function simulateKeyPress(key) {}
