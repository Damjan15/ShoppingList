const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterInput = document.getElementById("filter");

// Functions
function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate input
  if (newItem === "") {
    alert("Please add an item!");

    return;
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function removeItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure you want to delete this item?")) {
      e.target.parentElement.parentElement.remove(); // This is the list item

      checkUI();
    }
  }
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.includes(text)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;

  return icon;
}

function checkUI() {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    filterInput.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filterInput.style.display = "block";
  }
}

function init() {
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", removeItem);
  clearBtn.addEventListener("click", clearItems);
  filterInput.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();