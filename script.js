"use strict";

function getPost(event) {
  event.preventDefault();

  const { value: postId } = document.getElementById("postIdInputElement");

  const messageContainer = document.getElementById("messageContainer");
  clearContainer(messageContainer);

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
      const postContainer = document.getElementById("postContainer");
      clearContainer(postContainer);

      const postTitle = createElement("h2", "secondtTitle", title);
      const postBody = createElement("p", "", body);

      const commentsButton = createElement("button", "btn", "Comments");
      commentsButton.addEventListener("click", () => getComments(postId));

      appendChildren(postContainer, [postTitle, postBody, commentsButton]);
    })
    .catch((error) => {
      openModalWindow(`Сталася помилка: ${error.message}`);
      return;
    });
}

function getComments(postId) {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Коментарі не знайдено");
      }
      return response.json();
    })
    .then((comments) => {
      const postContainer = document.getElementById("postContainer");
      clearContainer(postContainer);

      const commentsList = document.createElement("ul");
      comments.forEach((comment) => {
        const commentItem = createElement("li", "num", comment.body);
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
}

function closeModalWindow() {
  const modalContainer = document.getElementById("modalContainer");
  modalContainer.style.display = "none";
}

function clickOutside(event) {
  const modalContainer = document.getElementById("modalContainer");
  if (event.target === modalContainer) {
    closeModalWindow();
  }
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function appendChildren(parent, children) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

const close = document.querySelector(".close");
close.addEventListener("click", closeModalWindow);
window.addEventListener("click", clickOutside);

document.getElementById("formContainer").addEventListener("submit", getPost);
