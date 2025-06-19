//const tg = window.Telegram.WebApp;

tg.MainButton.onClick(MBC);
tg.MainButton.setText("Войти");
tg.MainButton.disable();
tg.MainButton.color = tg.themeParams.hint_color;
tg.MainButton.show();

tg.BackButton.onClick(() => {
    tg.BackButton.hide();
    //tg.DeviceStorage.removeItem("openDoc");
    window.location.href = '/';
});


var loginField = document.getElementById('loginField');
var passField = document.getElementById('passField');
var publishField = document.getElementById('publishField');
var urlField = document.getElementById('urlField');

var necessaryFields = [loginField, passField, publishField]

function checkNecessaryFields (inputElementsArray){
    if ( necessaryFields.every(element => element.value.trim() != "") ){
        tg.MainButton.enable();
        tg.MainButton.color = tg.themeParams.button_color;
        tg.MainButton.hasShineEffect = true;
    } else {
        tg.MainButton.disable();
        tg.MainButton.color = tg.themeParams.hint_color;
    }
}


document.querySelectorAll('input').forEach((element) => {
    element.addEventListener('input', checkNecessaryFields );
})




/*
document.getElementById('loginField').addEventListener('input', function () {
    const loginField = this.value.trim(); // убираем пробелы в начале и конце
    const passField = document.getElementById('passField').value.trim();;

    if ((loginField != '') && (passField != '')) {
        tg.MainButton.enable();
        tg.MainButton.color = tg.themeParams.button_color;
        tg.MainButton.hasShineEffect = true;
    } else {
        tg.MainButton.disable();
        tg.MainButton.color = tg.themeParams.hint_color;
    }
});
document.getElementById('passField').addEventListener('input', function () {
    const passField = this.value.trim(); // убираем пробелы в начале и конце
    const loginField = document.getElementById('loginField').value.trim();;

    if ((loginField != '') && (passField != '')) {
        tg.MainButton.enable();
        tg.MainButton.color = tg.themeParams.button_color;
        tg.MainButton.hasShineEffect = true;
    } else {
        tg.MainButton.disable();
        tg.MainButton.color = tg.themeParams.hint_color;
    }
});
*/

function MBC() {
    let username = document.getElementById('loginField').value;
    let password = document.getElementById('passField').value;

    // Добавляем слэш после имени публикации
    publishNAME = document.getElementById('publishField').value.toString().trim() + "/";
    let urlOrigin = '';  
    let urlField = document.getElementById('urlField').value

    if (urlField != '') {
        if (urlField.includes("http")) {
            urlOrigin += ("https://" + urlField.split("//")[1]);
        } else {
            urlOrigin += ("https://" + urlField);
        }
    } else {
        urlOrigin += window.location.origin;
    }
    urlOrigin += "/";

    let url = urlOrigin + publishNAME + "hs/sz/user/" + username;


    // Формирование строки авторизации в формате "username:password" в Base64
    //let token = btoa(`${username}:${password}`);
    let token = btoa(unescape(encodeURIComponent(`${username}:${password}`)));
    
    fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Basic ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                tg.DeviceStorage.setItem("credentials", token);
            } else {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            // В зависимости от возвращаемых данных можно выбрать response.json() или response.text()
            return response.json();
        })
        .then(data => {
            console.log("Данные получены");
            if (data[0].UIN) {
                tg.DeviceStorage.setItem("UserUIN", data[0].UIN);
                tg.DeviceStorage.setItem("serverURL", urlOrigin);
                tg.DeviceStorage.setItem("publishNAME", publishNAME);
                window.location.href = '/';
            } else {
                tg.showAlert("Доступ отклонен, обратитесь к администратору");
            }
        })
        .catch(error => {
            console.error("Ошибка qwe:", error);
            tg.showAlert("Неверный логин или пароль");
        });

}



