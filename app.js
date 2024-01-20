document.addEventListener('DOMContentLoaded', () => {
    const movieDetailsContainer = document.getElementById('movie-details');
    const filmsList = document.getElementById('films');
  
    // Fetch initial movie details
    fetchMovieDetails(1);
  
    // Fetch and display movie list
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(films => {
        films.forEach(film => {
          const listItem = document.createElement('li');
          listItem.classList.add('film', 'item');
          listItem.textContent = film.title;
          listItem.addEventListener('click', () => fetchMovieDetails(film.id));
          filmsList.appendChild(listItem);
        });
      });
  
    // Function to fetch and display movie details
    function fetchMovieDetails(movieId) {
      fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
          const isSoldOut = movie.tickets_sold >= movie.capacity;
          const buyButton = isSoldOut ? 'Sold Out' : 'Buy Ticket';
  
          movieDetailsContainer.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster">
            <h2>${movie.title}</h2>
            <p>${movie.description}</p>
            <p>Runtime: ${movie.runtime} minutes</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Tickets Available: ${isSoldOut ? 'Sold Out' : movie.capacity - movie.tickets_sold}</p>
            <button id="buy-ticket" onclick="buyTicket(${movie.id}, ${movie.tickets_sold}, ${movie.capacity})">${buyButton}</button>
          `;
        });
    }
  
    // Function to handle buying a ticket
    window.buyTicket = function(movieId, ticketsSold, capacity) {
      if (ticketsSold < capacity) {
        // Update tickets_sold on the server
        const updatedTicketsSold = ticketsSold + 1;
        fetch(`http://localhost:3000/films/${movieId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tickets_sold: updatedTicketsSold,
          }),
        })
          .then(response => response.json())
          .then(updatedMovie => {
            // Update the movie details UI
            fetchMovieDetails(updatedMovie.id);
          })
          .catch(error => console.error('Error updating tickets sold:', error));
      }
    };
  });
  