async function loadProperties() {
  try {
    const response = await fetch('http://localhost:3000/api/properties');
    const properties = await response.json();
    console.log(properties[0]);

    const container = document.getElementsByClassName('l5')[0];
    container.innerHTML = ''; // Clear previous items

    properties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'box';
      card.setAttribute('data-type', property.type);
      card.innerHTML = `
        <div class="image">
          <img src="${Array.isArray(property.images) && property.images[0] ? property.images[0] : 'svg/default.jpg'}" alt="" class="box-img">
        </div>
        <div class="rating">
          <h3>${property.area || property.name}</h3>
          <div class="rating-sc">
            <i class="fa-regular fa-heart like"></i>
          </div>
        </div>
        <p>${property.description ? property.description.split('.')[0] : 'No description available'}</p>
        <h3>₹${property.price || 'N/A'}</h3>
      `;

      // Like button toggle
      const likeIcon = card.querySelector('.like');
      likeIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent navigation
        likeIcon.classList.toggle('fa-solid');
        likeIcon.classList.toggle('fa-regular');
      });

      // Card click -> redirect
      card.addEventListener('click', () => {
        window.location.href = `/frontend/insedep.htm/?${property._id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to fetch properties:', err);
    document.getElementsByClassName('l5')[0].innerText = 'Failed to load properties.';
  }
}

// Filter logic
const filterButtons = document.querySelectorAll('.l1-center h3');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filterType = button.getAttribute('data-filter');

    // Highlight selected filter
    filterButtons.forEach(btn => btn.classList.remove('exp'));
    button.classList.add('exp');

    const cards = document.querySelectorAll('.l5 .box');

    cards.forEach(card => {
      const cardType = card.getAttribute('data-type');
      card.style.display = (filterType === 'all' || cardType === filterType) ? 'block' : 'none';
    });
  });
});

loadProperties();
