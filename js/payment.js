const updatedSelectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));
const film = updatedSelectedSeance.film;
const hall = updatedSelectedSeance.hall;
const hallNumber = hall.replace("Зал ", "");
const time = updatedSelectedSeance.time;
const price = updatedSelectedSeance.price;
const row = updatedSelectedSeance.rowIndex;
const seat = updatedSelectedSeance.seatIndex;

console.log(seat, row);

function ticketDetails() {
    const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
    const ticketTitle = ticketInfoWrapper.querySelector(".ticket__title");
    const ticketChairs = ticketInfoWrapper.querySelector(".ticket__chairs");
    const ticketHall = ticketInfoWrapper.querySelector(".ticket__hall");
    const ticketStart = ticketInfoWrapper.querySelector(".ticket__start");
    const ticketCost = ticketInfoWrapper.querySelector(".ticket__cost");

    ticketTitle.textContent = film;
    ticketChairs.textContent = row + "/" + seat;
    ticketHall.textContent = hallNumber;
    ticketStart.textContent = time;
    ticketCost.textContent = price;
}

ticketDetails();