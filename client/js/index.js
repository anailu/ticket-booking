const url = "https://jscp-diplom.netoserver.ru/";

function fetchDataAndPopulate() {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "event=update"
  };
      
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(data => {
    const halls = data.halls.result;
    const seances = data.seances.result;
    const films = data.films.result;
    const mainElement = document.querySelector("main");
    
    for (const film of films) {
      const movieContainer = document.createElement("section");
      movieContainer.classList.add("movie");
      movieContainer.classList.add("container");
      movieContainer.innerHTML = `
        <div class="movie__info row">
          <div class="movie__poster col-4">
              <img class="movie__poster-image" src="${film.film_poster}">
          </div>
          <div class="movie__description col-8">
            <h2 class="movie__title">${film.film_name}</h2>
            <p class="movie__synopsis">${film.film_description}</p>
            <p class="movie__data">
              <span class="movie__data-duration">${formatMinutes(film.film_duration)}</span>
              <span class="movie__data-origin">${film.film_origin}</span>
            </p>
          </div>
        </div> 
        <div class="movie-seances__hall">
          ${getHallHTML(film)}
        </div>
      `;

      mainElement.appendChild(movieContainer);
    }

    function getHallHTML(film) {
      const listSeances = seances.filter(function(seance) {
        return seance.seance_filmid === film.film_id;
      });
      const hallWithSeances = [];
    
      for (const seance of listSeances) {
        const hallid = seance.seance_hallid;
        let foundHall = false;

        for (const hallSeances of hallWithSeances) {
        if (hallSeances[0].seance_hallid === hallid) {
          hallSeances.push(seance);
          foundHall = true;
          break;
        }
      }
  
      if (!foundHall) {
        hallWithSeances.push([seance]);
      }
    }

      hallWithSeances.sort(function(a, b) {
        const hallA = halls.find(function(hall) {
          return hall.hall_id === a[0].seance_hallid;
        });
        const hallB = halls.find(function(hall) {
          return hall.hall_id === b[0].seance_hallid;
        });
    
        const hallNameA = hallA.hall_name.toUpperCase();
        const hallNameB = hallB.hall_name.toUpperCase();
    
        if (hallNameA < hallNameB) {
          return -1;
        }
        if (hallNameA > hallNameB) {
          return 1;
        }
        return 0;
      });
      
      let hallHTML = "";
  
      for (const hallSeances of hallWithSeances) {
        const hallId = hallSeances[0].seance_hallid;
        let hall = null;
    
        for (const hallCurrent of halls) {
          if (hallCurrent.hall_id === hallId) {
            hall = hallCurrent;
            break;
          }
        }
    
        /*const hallName = hall.hall_name;
        const seancesForHall = hallSeances;*/
        const hallNumber = hall.hall_name.replace("Зал", "").trim();
        const hallName = `Зал ${hallNumber}`;
        const seancesForHall = hallSeances;

        let seancesHTML = "";
    
        for (const seance of seancesForHall) {
          const seanceTime = seance.seance_time;
          seancesHTML += `
            <li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html">${seanceTime}</a></li>
          `;
        }
    
        hallHTML += `
          <h3 class="movie-seances__hall-title">${hallName}</h3>
          <ul class="movie-seances__list">
            ${seancesHTML}
          </ul>
        `;
      }
  
      return hallHTML;
    }
  })
  .catch(error => {
      console.error("Ошибка:", error);
  });
}

fetchDataAndPopulate();

function formatMinutes(minutes) {
  if (minutes % 10 === 1 && minutes % 100 !== 11) {
    return minutes + " минута";
  } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
    return minutes + " минуты";
  } else {
    return minutes + " минут";
  }
}