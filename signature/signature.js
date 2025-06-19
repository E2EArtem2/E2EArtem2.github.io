//const tg = window.Telegram.WebApp;

tg.BackButton.onClick(() => {
    tg.BackButton.hide();
    //tg.DeviceStorage.removeItem("openDoc");
    window.location.href = '/docview/docview.html';
});
tg.BackButton.show();

tg.MainButton.setText("Подписать");
tg.MainButton.onClick(MBC);
tg.MainButton.disable();
tg.MainButton.color = tg.themeParams.hint_color;

tg.BiometricManager.init();

/*
tg.SecondaryButton.setText("Подписать биометрией");
tg.SecondaryButton.onClick(() => {
    
    if (tg.BiometricManager.isAccessGranted) {
        tg.BiometricManager.authenticate(
            { reason: "Для подписания документа через биометрию" },
            (success, token) => {
                if (success) {
                    MBC(success);
                }
            }
        )
    } else {
        tg.BiometricManager.requestAccess(
            { reason: "Предоставьте доступ к биометрии для подписания документов" }
        )
    }
    
});
tg.SecondaryButton.position = "bottom";
tg.SecondaryButton.show();*/
tg.SecondaryButton.hide();

var signed = false;
var doc;



getValue('openDoc')
    .then((value) => {
        if (value != null) {
            const jsValue = JSON.parse(value);

            document.getElementById('header').innerHTML = `${jsValue.OrgName}<br>СЗ № ${jsValue.PolnyNomer} по проекту ${jsValue.Project}`;

            doc = jsValue;

            let keys = Object.keys(jsValue);
            keys.forEach(key => {
                let element = document.getElementById(key);
                if (element) {
                    element.innerHTML = jsValue[key].trim();
                }
                if (key == "Valuta") {
                    document.getElementsByName(key).forEach(n => {
                        n.innerHTML = jsValue[key];
                    })
                }

            });

            if (jsValue.SummaNDS == 0) {
                document.getElementById('spanNDS').innerHTML = "";
            }


            //outputString = `СЗ № ${jsValue.PolnyNomer}<br>От ${jsValue.Data}<br>Организация ${jsValue.OrgName}<br>Сумма: ${jsValue.Summa}`
            //document.getElementById('DinamicContainer').innerHTML = outputString;
        }
    })
    .catch((error) => {
        //showAlert("Ошибка ", error);
    });



document.getElementById('passField').addEventListener('input', function () {
    const passField = this.value.trim(); // убираем пробелы в начале и конце

    if (passField != '') {
        tg.MainButton.enable();
        tg.MainButton.color = tg.themeParams.button_color;
        tg.MainButton.hasShineEffect = true;
    } else {
        tg.MainButton.disable();
        tg.MainButton.color = tg.themeParams.hint_color;
    }
});

/*
function secondaryButtonShow() {
    tg.SecondaryButton.onClick(() => {
        window.location.href = '/index.html';
    });
    tg.SecondaryButton.setText("Обновить список документов");
    tg.SecondaryButton.show();
}
*/

function MBC(isBiometric) {
    

    if (signed) {
        window.location.href = '/index.html';
    } else {
        document.getElementById('header').focus();
        

        //UserID/SzUIN/Пароль который вводит при подписании СЗ"

        if (isBiometric) {
            let url = serverURL + publishNAME +"hs/sz/sign/" + UserUIN.toString() + "/" + doc.UIN.toString() + "/123" ;
            doFetch(url);
        } else {
            
        }
          
        
        
    }
}


function passSignature() {
    let url = serverURL + publishNAME + "hs/sz/sign/" + UserUIN.toString() + "/" + doc.UIN.toString() + "/" + document.getElementById('passField').value.toString().trim();
    doFetch(url);
    tg.MainButton.hide();
    tg.SecondaryButton.onClick(() => {
        window.location.href = '/index.html';
    })
    tg.SecondaryButton.setText("На главную");
    tg.SecondaryButton.position = "bottom";
    tg.SecondaryButton.show();
}

function passBiometric() {

    tg.BiometricManager.authenticate(
        { reason: "Для подписания документа через биометрию" },
        (success, token) => {
            if (success) {
                getSecureValue('ECP')
                    .then((value) => {
                        if ((value != null) || (value != undefined)) {
                            let url = serverURL + publishNAME + "hs/sz/sign/" + UserUIN.toString() + "/" + doc.UIN.toString() + "/" + value.toString().trim();
                            doFetch(url);
                            tg.MainButton.hide();
                            tg.SecondaryButton.onClick(() => {
                                window.location.href = '/index.html';
                            })
                            tg.SecondaryButton.setText("На главную");
                            tg.SecondaryButton.position = "bottom";
                            tg.SecondaryButton.show();
                        } else {
                            console.log("Ошибка подписания, нет сохраненной подписи ЭЦП");
                        }
                    })
                    .catch((error) => {
                        console.log("Ошибка чтения сохраненных данных!", error);
                    });
            }
        }
    )
}




function doFetch(urlString) {
    fetch(urlString, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            // В зависимости от возвращаемых данных можно выбрать response.json() или response.text()
            return response.json();
        })
        .then(data => {
            //console.log("Результат запроса:", data);
            let resultString = "";
            let resultColor = tg.themeParams.destructive_text_color;

            switch (data[0].Status) {
                case "E0002":
                    resultString = "Не найдена СЗ по Уникальному Идентификатору";
                    break;
                case "E0003":
                    resultString = "Пользователь не найден по УникальномуИдентификатору";
                    break;
                case "E0004":
                    resultString = "У Вас отсутствует право подписи";
                    break;
                case "E0005":
                    resultString = "Неправильный пароль для подписи СЗ";
                    break;
                case "E0006":
                    resultString = "СЗ уже подписана другим руководителем";
                    break;
                case "E0007":
                    resultString = "Вы отсутствуете в списке подписантов данной СЗ";
                    break;
                case "E0008":
                    resultString = "Ошибка записи СЗ, возможно документ открыт другим пользователем";
                    break;
                case "Signed":
                    resultString = "Подписано успешно";
                    resultColor = "green";
                    break;
                default:
                    resultString = "Неизвестная ошибка";
            }



            document.getElementById('dinamicContent').innerHTML = `<div style='color: ${resultColor}'><b>${resultString}</b></div>`;

        })
        .catch(error => {
            console.error("Ошибка запроса:", error);
        });
}




getValue('biometricEnable')
    .then((value) => {
        if ((value != null) || (value != undefined)) {
            if (value == "true") {
                tg.MainButton.onClick(passBiometric);
                console.log("Применяется биометрическая подпись");
                tg.MainButton.enable();
                tg.MainButton.color = tg.themeParams.button_color;
                tg.MainButton.hasShineEffect = true;
                document.getElementById('dinamicContent').innerHTML = `<div>Выбрано подписание по биометрии</div>`;
            } else if (value == "false") {
                tg.MainButton.onClick(passSignature);
                console.log("Применяется подпись паролем");
            }
        } else {
            console.log("Данных нет");
        }
    })
    .catch((error) => {
        console.log("Ошибка чтения сохраненных данных!", error);
    });

tg.MainButton.show();
