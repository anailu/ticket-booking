const url = "https://jscp-diplom.netoserver.ru/";

async function fetchData(requestBody, callback) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: requestBody
    };
  
    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
}