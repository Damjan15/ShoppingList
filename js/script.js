const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterInput = document.getElementById("filter");
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Functions
function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate input
  if (newItem === "") {
    alert("Please add an item!");

    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();

    isEditMode = false;
  } else {
    if (checkItem(newItem)) {
        alert("The item already exists!");
        return;
    }
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

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function removeItem(item) {
  if (confirm("Are you sure you want to delete this item?")) {
    // Remove item from DOM
    item.remove();

    // Remove item from Local Storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.clear();

  checkUI();
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll("li").forEach((i) => i.classList.remove('edit-mode'));  // We do this so the two items are not in edit mode.

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = "#228B22";
    itemInput.value = item.textContent;

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

function checkItem(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
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
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    filterInput.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filterInput.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

function init() {
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  filterInput.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();