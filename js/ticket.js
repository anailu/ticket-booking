const updatedSelectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));
const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
const film = updatedSelectedSeance.film;
const hall = updatedSelectedSeance.hall;
const hallNumber = hall.replace("Зал ", "");
const time = updatedSelectedSeance.time;
let seatText = [];

selectedSeats.forEach((seat) => {
  const { rowIndex, seatIndex } = seat;
  seatText.push(`Ряд: ${rowIndex} Место: ${seatIndex}`);
});

function ticketDetails() {
    const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
    const ticketTitle = ticketInfoWrapper.querySelector(".ticket__title");
    const ticketChairs = ticketInfoWrapper.querySelector(".ticket__chairs");
    const ticketHall = ticketInfoWrapper.querySelector(".ticket__hall");
    const ticketStart = ticketInfoWrapper.querySelector(".ticket__start");

    ticketTitle.textContent = film;
    ticketHall.textContent = hallNumber;
    ticketStart.textContent = time;

    selectedSeats.forEach((seat) => {
      const { rowIndex, seatIndex } = seat;
      const seatText = `${rowIndex}/${seatIndex} `;
      const seatElement = document.createElement("span");

      seatElement.textContent = seatText;
      ticketChairs.appendChild(seatElement);
    });
}

ticketDetails();

const data = seatText + ", Фильм: " + film + ", Зал: " + hallNumber + ", Время: " + time;

const qrcode = QRCreator(data, {
    mode: 4,
    eccl: 0,
    version: -1,
    mask: -1,
    image: 'svg',
    modsize: -1,
    margin: 0
  });

const content = (qrcode) =>{
  return qrcode.error ?
    `недопустимые исходные данные ${qrcode.error}`:
     qrcode.result;
};

document.getElementById('qrcode').append(content(qrcode));