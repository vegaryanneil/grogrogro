let listTitle;
let groceryText;
let saveListBtn;
let newListBtn;
let noteList;
if (window.location.pathname === '/list') {
  listTitle = document.querySelector('.note-title');
  groceryText = document.querySelector('.grocery-textarea');
  saveListBtn = document.querySelector('.save-note');
  newListBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}
// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};
// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};
// activeNote is used to keep track of the note in the textarea
let activeList = {};
const getLists = () =>
  fetch('/api/create', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
const saveList = (note) =>
  fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
const deleteList = (id) =>
  fetch(`/api/create/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
const renderActiveList = () => {
  hide(saveNoteBtn);
  if (activeNote.id) {
    listTitle.setAttribute('readonly', true);
    listText.setAttribute('readonly', true);
    listTitle.value = activeList.title;
    listText.value = activeList.text;
  } else {
    listTitle.removeAttribute('readonly');
    listText.removeAttribute('readonly');
    listTitle.value = '';
    listText.value = '';
  }
};
const handleListSave = () => {
  const newList = {
    title: listTitle.value,
    text: listText.value,
  };
  saveList(newlist).then(() => {
    getAndRenderLists();
    renderActiveList();
  });
};
// Delete the clicked note
const handleListDelete = (e) => {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();
  const list = e.target;
  const listId = JSON.parse(list.parentElement.getAttribute('data-list')).id;
  if (activeList.id === listId) {
    activeList = {};
  }
  deleteList(listId).then(() => {
    getAndRenderLists();
    renderActiveList();
  });
};
// Sets the activeNote and displays it
const handleListView = (e) => {
  e.preventDefault();
  activeList = JSON.parse(e.target.parentElement.getAttribute('data-list'));
  renderActiveList();
};
// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewListeView = (e) => {
  activeList = {};
  renderActiveList();
};
const handleRenderSaveBtn = () => {
  if (!listTitle.value.trim() || !listText.value.trim()) {
    hide(saveListBtn);
  } else {
    show(saveListBtn);
  }
};
// Render the list of note titles
const renderListList = async (lists) => {
  let jsonLists = await lists.json();
  if (window.location.pathname === '/create') {
    listList.forEach((el) => (el.innerHTML = ''));
  }
  let listListItems = [];
  // Returns HTML element with or without a delete button
  const createList = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleListView);
    liEl.append(spanEl);
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-list'
      );
      delBtnEl.addEventListener('click', handleListDelete);
      liEl.append(delBtnEl);
    }
    return liEl;
  };
  if (jsonLists.length === 0) {
    noteListItems.push(createLi('No saved Lists', false));
  }
  jsonLists.forEach((list) => {
    const li = createLi(list.title);
    li.dataset.list = JSON.stringify(list);
    listListItems.push(li);
  });
  if (window.location.pathname === '/create') {
    listListItems.forEach((list) => listList[0].append(list));
  }
};
// Gets lists from the db and renders them to the sidebar
const getAndRenderLists = () => getLists().then(renderListList);
if (window.location.pathname === '/create') {
  savelistBtn.addEventListener('click', handleListSave);
  newlistBtn.addEventListener('click', handleNewlistView);
  listTitle.addEventListener('keyup', handleRenderSaveBtn);
  listText.addEventListener('keyup', handleRenderSaveBtn);
}
getAndRenderlists();
