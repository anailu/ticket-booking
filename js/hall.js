const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));
const timestamp = Math.floor(selectedSeance.timestamp / 1000);
const hallConfig = decodeURIComponent(selectedSeance.hallConfig);
const hallId = selectedSeance.hallId;
const seanceId = selectedSeance.seanceId;
const button = document.querySelector(".acceptin-button");
button.disabled = true;
button.classList.add("disabled");

fetchData(`event=get_hallConfig&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}`, function(data) {
    populate(data);
});

function populate(data) {
    const titleElement = document.querySelector(".buying__info-title");
    const startElement = document.querySelector(".buying__info-start");
    const hallElement = document.querySelector(".buying__info-hall");
    const priceElement = document.querySelector(".price-standart");
    const priceVipElement = document.querySelector(".price-vip");
    
    titleElement.textContent = selectedSeance.film;
    startElement.textContent = "Начало сеанса: " + selectedSeance.time;
    hallElement.textContent = selectedSeance.hall;
    priceElement.textContent = selectedSeance.priceStandart;
    priceVipElement.textContent = selectedSeance.priceVip;

    if (data === null) {
        const hallConfig = decodeURIComponent(selectedSeance.hallConfig);
        const container = document.querySelector(".conf-step__wrapper");
        container.innerHTML = hallConfig;
    }
}

const selectedSeats = [];

document.addEventListener("click", function(event) {
    const target = event.target;
    if (event.target.classList.contains("conf-step__chair") && !event.target.classList.contains("conf-step__chair_taken")) {
        const chair = target;
        let price = 0;

        const legend = document.querySelector(".conf-step__legend");

        if (chair.classList.contains("conf-step__chair_standart")) {
            const priceElement = legend.querySelector(".price-standart");
            price = parseInt(priceElement.textContent);
          } else if (chair.classList.contains("conf-step__chair_vip")) {
            const priceElement = legend.querySelector(".price-vip");
            price = parseInt(priceElement.textContent);
        }
    
        const row = chair.parentNode;
        const rowIndex = Array.from(row.parentNode.children).indexOf(row) + 1;
        const seatIndex = Array.from(row.children).indexOf(chair) + 1;

        const seat = {
            rowIndex: rowIndex,
            seatIndex: seatIndex,
            price: price
        };

        const index = selectedSeats.findIndex((s) => s.rowIndex === rowIndex && s.seatIndex === seatIndex);
        if (index > -1) {
            selectedSeats.splice(index, 1);
            chair.classList.remove("conf-step__chair_selected");
        } else {
            selectedSeats.push(seat);
            chair.classList.add("conf-step__chair_selected");
        }

        if (selectedSeats.length > 0) {
            button.disabled = false;
            button.classList.remove("disabled");
        } else {
            button.disabled = true;
            button.classList.add("disabled");
        }
    }
});

button.addEventListener("click", function() {
    if (selectedSeats.length > 0) {
        const container = document.querySelector(".conf-step__wrapper");

        selectedSeats.forEach((seat) => {
            const row = container.querySelector(`.conf-step__row:nth-child(${seat.rowIndex})`);
            const chair = row.querySelector(`.conf-step__chair:nth-child(${seat.seatIndex})`);

            chair.classList.add("conf-step__chair_taken");
            chair.classList.remove("conf-step__chair_selected");
        });

        const updatedHallConfig = container.innerHTML;
        const encodedHallConfig = encodeURIComponent(updatedHallConfig);
        selectedSeance.hallConfig = encodedHallConfig;
        localStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));
        localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

        window.location.href = "payment.html";
    }
});

function clearSeatSelection() {
    selectedSeance.rowIndex = null;
    selectedSeance.seatIndex = null;
    button.disabled = true;
    button.classList.add("disabled");
}