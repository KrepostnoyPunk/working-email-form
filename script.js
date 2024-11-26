const formEl = document.querySelector('form')
const resultEl = document.querySelector('#result-mark')

function sendData(jsonObj){
    fetch('https://api.web3forms.com/submit', { // адрес раздела(эндпоинта) сервера на который будет сохранена и откуда в последующем отправлена, информация
        method: 'POST', // метод отправки данных на сервер
        headers: { // заголовки для более корректной обработки информации сервером
            'Content-Type': 'application/json', // тип данных JSON
            'Accept': 'application/json' // какие данные принять серверу(?)
        },
        body: jsonObj // отправляемые данные
    })
    .then(async (response) => { // получаем промис 
        let serverResponse = await response.json(); // декодируем ответ сервера из JSON в JS объект
        // благодаря async/await код дальше не будет выполняться, а сначала дождется получения промиса + декодирования его результата что позволит избежать ошибок ведь дальше код синхронный и использует данные, получение и преобразование которых требует времени
        if (response.status == 200){ // если запрос успешен
            resultEl.innerHTML = "Form submitted successfully"; // заполняем метку текстом об успехе
        } else {
            console.log(response);
            resultEl.innerHTML = serverResponse.status // в ином случае обращаемся к свойству status которое укажет на то что пошло не так
        }
    })
    .catch(error => { // в случае ошибки...
        console.log(error);
        resultEl.innerHTML = "Something went wrong!";
    })
    .then(function() { // после выполнения промиса...
        formEl.reset(); // сбрасываем поля формы...

        setTimeout(() => {
            resultEl.innerHTML = ""; // и очищаем метку через 3 секунды
        }, 3000);
    });
}

formEl.addEventListener('submit', event => {
    event.preventDefault() // предотвращаем дефолтную перезагрузку странциы

    const formData = new FormData(formEl); // получаем объект с данными полей формы
    const formDataObj = Object.fromEntries(formData); // преобразуем его в "человекопонятный" объект

    const jsonFormObj = JSON.stringify(formDataObj) // преобразуем объект в JSON формат чтобы его можно было отправить на сервер

    resultEl.innerHTML = 'Please wait...' // в это же время появляется надпись об ожидании

    sendData(jsonFormObj) // вызывается функция которая делает отправку данных на сервер, который отправляет их по указанному адресу который скрывается за access__key
})