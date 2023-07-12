const updatedSelectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));
const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
const timestamp = Math.floor(updatedSelectedSeance.timestamp / 1000);
const hallConfig = decodeURIComponent(updatedSelectedSeance.hallConfig);
const hallId = updatedSelectedSeance.hallId;
const seanceId = updatedSelectedSeance.seanceId;
const button = document.querySelector(".acceptin-button");

function ticketDetails() {
    const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
    const ticketTitle = ticketInfoWrapper.querySelector(".ticket__title");
    const ticketChairs = ticketInfoWrapper.querySelector(".ticket__chairs");
    const ticketHall = ticketInfoWrapper.querySelector(".ticket__hall");
    const ticketStart = ticketInfoWrapper.querySelector(".ticket__start");
    const ticketCost = ticketInfoWrapper.querySelector(".ticket__cost");
    const film = updatedSelectedSeance.film;
    const hall = updatedSelectedSeance.hall;
    const hallNumber = hall.replace("Зал ", "");
    const time = updatedSelectedSeance.time;
    const price = updatedSelectedSeance.price;
    let sum = 0;

    ticketTitle.textContent = film;
    ticketHall.textContent = hallNumber;
    ticketStart.textContent = time;
    ticketCost.textContent = price;

    if (selectedSeats && selectedSeats.length > 0) {
        selectedSeats.forEach((seat) => {
            const { rowIndex, seatIndex, price } = seat;
            const seatText = `${rowIndex}/${seatIndex} `;
            const seatElement = document.createElement("span");

            seatElement.textContent = seatText;
            ticketChairs.appendChild(seatElement);

            sum += price;
        });
    }

    ticketCost.textContent = sum;
}

ticketDetails();

button.addEventListener("click", function() {
    const requestBody = `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfiguration=${hallConfig}`;
    const emptyCallback = () => {};

    fetchData(requestBody, emptyCallback);

    window.location.href = 'ticket.html';
});