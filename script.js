"use strict";
function getPost(event) {
  event.preventDefault();

  const { value: postId } = document.getElementById("postIdInputElement");

  const messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = "";

  if (isNaN(postId) || postId < 1 || postId > 100) {
    openModalWindow(`Пост не знайдено. Введіть номер ID від 1 до 100`);
    return;
  }

  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Пост не знайдено`);
      }
      return response.json();
    })
    .then(({ title, body }) => {
      postContainer.innerHTML = `
      <h2 class="secondtTitle">${title}</h2>
      <p>${body}</p>
      <button class="btn" onclick="getComments('${postId}')">Comments</button>
    `;
    })
    .catch((error) => {
      openModalWindow(`Сталася помилка: ${error.message}`);
      return;
    });
}

function getComments(postId) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Коментарі не знайдено");
      }
      return response.json();
    })
    .then((comments) => {
      const commentsList = document.createElement("ul");
      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.className = "num";
        commentItem.textContent = comment.body;
        commentsList.appendChild(commentItem);
      });
      postContainer.appendChild(commentsList);
    })
    .catch((error) => {
      openModalWindow(`Сталася помилка: ${error.message}`);
      return;
    });
}

function openModalWindow(message) {
  const modalContainer = document.getElementById("modalContainer");
  const modalMessage = document.getElementById("modalMessage");

  modalMessage.textContent = message;
  modalContainer.style.display = "block";

  const close = document.querySelector(".close");
  close.addEventListener("click", closeModalWindow);
  window.addEventListener("click", сlickOutside);
}

function closeModalWindow() {
  const modalContainer = document.getElementById("modalContainer");
  modalContainer.style.display = "none";
}

function сlickOutside(event) {
  const modalContainer = document.getElementById("modalContainer");
  if (event.target == modalContainer) {
    closeModalWindow();
  }
}

document.getElementById("formContainer").addEventListener("submit", getPost);
