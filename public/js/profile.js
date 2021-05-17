console.log("page loaded")
// const saveItem = document.querySelector("#save-Item");

// saveItem.addEventListener("click", function(){
//   console.log("saveItem clicked")
// });

const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#list-name').value.trim();
  // const needed_funding = document.querySelector('#project-funding').value.trim();
  // const description = document.querySelector('#list-desc').value.trim();
  if (name) {
    console.log(name)
    const response = await fetch(`/api/list/create`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      var data = await response.json();
      data = JSON.parse(data);

      document.location.replace('/create/' + data.id); // /profile/
    } else {
      alert('Failed to create list');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');
    const response = await fetch(`/api/list/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete list');
    }
  }
};
document
  .querySelector('.new-list-form')
  .addEventListener('submit', newFormHandler);
document
  .querySelector('.list-list')
  .addEventListener('click', delButtonHandler);
