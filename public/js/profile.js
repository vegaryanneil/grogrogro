const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#list-name').value.trim();
  // const needed_funding = document.querySelector('#project-funding').value.trim();
  // const description = document.querySelector('#project-desc').value.trim();

  if (name) {
    const response = await fetch(`/api/lists`, {
      method: 'POST',
      body: JSON.stringify({ name}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create list');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/lists/${id}`, {
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
