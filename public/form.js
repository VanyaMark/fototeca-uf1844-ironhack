
const message = document.querySelector('#message');

if (message) {
    message.addEventListener('click', (event) => {
        event.target.style.display = 'none';
    })
}


const duplicatedImageMessage = document.querySelector('#duplicated-image-message');

if (duplicatedImageMessage) {
    duplicatedImageMessage.addEventListener('click', (event) => {
        event.target.style.display = 'none';
    })
}
