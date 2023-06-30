const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"));
const timestamp = selectedSeance.timestamp / 1000;
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

        console.log("ряд", rowIndex, "место", seatIndex);

        selectedSeance.rowIndex = rowIndex;
        selectedSeance.seatIndex = seatIndex;
        selectedSeance.price = price;
        chair.classList.toggle("conf-step__chair_selected");

        if (selectedSeance.rowIndex && selectedSeance.seatIndex) {
            button.disabled = false;
            button.classList.remove("disabled");
        }
    } 
})

button.addEventListener("click", function() {
    if (selectedSeance.rowIndex && selectedSeance.seatIndex) {
        const updatedSelectedSeance = JSON.stringify(selectedSeance);
        localStorage.setItem("selectedSeance", updatedSelectedSeance);

        window.location.href = 'payment.html';
    } else {
        console.log("Выберите место перед продолжением");
    }
});

function clearSeatSelection() {
    selectedSeance.rowIndex = null;
    selectedSeance.seatIndex = null;
    button.disabled = true;
    button.classList.add("disabled");
}