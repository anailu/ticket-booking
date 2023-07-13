const today = new Date();
const navLinks = Array.from(document.getElementsByClassName("page-nav__day"));
const mainElement = document.querySelector("main");

fetchData("event=update", function(data) {
  this.pageData = data;
  populate(data, today);
});

function populate(pageData, date) {
  const halls = pageData.halls.result;
  const seances = pageData.seances.result;
  const films = pageData.films.result;

  const openHalls = halls.filter(function(hall) {
    return hall.hall_open === "1";
  });

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
  
      const hall = openHalls.find(function(hall) {
        return hall.hall_id === hallid && hall.hall_open === "1";
      });
    
      if (hall) {
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
    }

    hallWithSeances.sort(function(a, b) {
      const hallA = openHalls.find(function(hall) {
        return hall.hall_id === a[0].seance_hallid;
      });

      const hallB = openHalls.find(function(hall) {
        return hall.hall_id === b[0].seance_hallid;
      });

      const hallNameA = hallA ? hallA.hall_name.toUpperCase() : "";
      const hallNameB = hallB ? hallB.hall_name.toUpperCase() : "";

      if (hallNameA < hallNameB) {
        return -1;
      }

      if (hallNameA > hallNameB) {
        return 1;
      }
      else {
        return 0;
      }
    });
    
    let hallHTML = "";

    for (const hallSeances of hallWithSeances) {
      const hallId = hallSeances[0].seance_hallid;
      let hall = null;
  
      for (const hallCurrent of openHalls) {
        if (hallCurrent.hall_id === hallId) {
          hall = hallCurrent;
          break;
        }
      }

      const hallNumber = hall ? hall.hall_name.replace("Зал", "").trim() : "";
      const hallName = hall ? `Зал ${hallNumber}` : "";
      const seancesForHall = hallSeances;

      let seancesHTML = "";

      for (const seance of seancesForHall) {
        const seanceTimeString = seance.seance_time;
        const seanceTime = seance.seance_start;
        const priceStandart = hall ? hall.hall_price_standart : "";
        const priceVip = hall ? hall.hall_price_vip : "";
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const seanceTimestamp = startOfDay.getTime() + (seanceTime * 60 * 1000);
        const time = Date.now();
        let isPast;

        const options = { month: "short", day: "numeric" }
        const formattedDate = date.toLocaleString("en-US", options);
        const formatedToday = today.toLocaleString("en-US", options);

        if (formattedDate == formatedToday && seanceTimestamp < time) {
          isPast = true;
        } else {
          isPast = false;
        }

        const dataAttributes = `  
          data-film="${film.film_name}" 
          data-time="${seanceTimeString}"
          data-hallName="${hallName}"
          data-price-standart="${priceStandart}" 
          data-price-vip="${priceVip}"
          data-hall-id="${hall ? hall.hall_id : ''}"
          data-seance-id="${seance.seance_id}"
          data-timestamp="${seanceTimestamp}"
          data-hall-config="${hall ? encodeURIComponent(hall.hall_config) : ''}"
          data-hall-places="${hall ? hall.hall_places : ''}"
          data-hall-rows="${hall ? hall.hall_rows : ''}"
        `;
        
        seancesHTML += `
          <li class="movie-seances__time-block">
            <a class="movie-seances__time
            ${isPast ? ' movie-seances__time-block_past' : ''}" href="hall.html" ${dataAttributes} 
            ${isPast ? 'style="background-color: #888 ;"' : ''}
            >
              ${seanceTimeString}  
            </a>
          </li>
        `;
      }

      hallHTML += `
        <h3 class="movie-seances__hall-title">${hallName}</h3>
        <ul class="movie-seances__list">
          ${seancesHTML}
        </ul>
      `;
    }

    return hallHTML
  }

  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("movie-seances__time")) {
      event.preventDefault();
  
      const filmName = event.target.dataset.film; 
      const seanceTime = event.target.dataset.time;
      const priceStandart = event.target.dataset.priceStandart;
      const priceVip = event.target.dataset.priceVip;
      const hallName = event.target.dataset.hallname;
      const isPast = event.target.classList.contains("movie-seances__time-block_past");
      const hallId = event.target.dataset.hallId;
      const seanceId = event.target.dataset.seanceId;
      const seanceTimestamp = event.target.dataset.timestamp;
      const hallConfig = event.target.dataset.hallConfig;
      const hallPlaces= event.target.dataset.hallPlaces;
      const hallRows = event.target.dataset.hallRows;
  
      if (!isPast) {
        const selectedSeance = {
          film: filmName,
          time: seanceTime,
          priceStandart: priceStandart,
          priceVip: priceVip, 
          hall: hallName,
          hallId: hallId,
          seanceId: seanceId,
          timestamp: seanceTimestamp,
          hallConfig: hallConfig,
          hallPlaces: hallPlaces,
          hallRows: hallRows
        };

        localStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));
  
        window.location.href = "hall.html";
      };
    }
  });
}

function formatMinutes(minutes) {
  if (minutes % 10 === 1 && minutes % 100 !== 11) {
    return minutes + " минута";
  } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
    return minutes + " минуты";
  } else {
    return minutes + " минут";
  }
}

function getDayOfWeek(date) {
  return date.getDay();
}

function updateWeekNav() {
  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  for (let i = 0; i < navLinks.length; i++) {
    const navLink = navLinks[i];
    const day = new Date(today);
    day.setDate(today.getDate() + i);

    const dayOfWeek = getDayOfWeek(day);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      navLink.classList.add("page-nav__day_weekend");
    }

    if (i === 0) {
      navLink.classList.add("page-nav__day_today");
    }

    const dayWeek = navLink.querySelector(".page-nav__day-week");
    const dayNumber = navLink.querySelector(".page-nav__day-number");

    dayWeek.textContent = daysOfWeek[dayOfWeek];
    dayNumber.textContent = day.getDate();
    navLink.setAttribute("data-timestamp", day.getTime()); //
  }
}

updateWeekNav();

navLinks.forEach((navElement, index) => {
  navElement.addEventListener("click", function() {
    navLinks.forEach(function(navElement) {
      navElement.classList.remove("page-nav__day_chosen");
    });

    navElement.classList.add("page-nav__day_chosen");
    const selectedTimestamp = parseInt(navElement.getAttribute("data-timestamp")); 
    const selectedDate = new Date(selectedTimestamp);

    navElement.setAttribute("data-date", selectedDate);
    mainElement.innerHTML = "";
    populate(pageData, selectedDate)
    })
});