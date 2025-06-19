//const tg = window.Telegram.WebApp;
tg.BackButton.onClick(() => {
    window.location.href = '/index.html';
});
tg.BackButton.show();

tg.SecondaryButton.onClick(SBC);
tg.SecondaryButton.textColor = tg.themeParams.destructive_text_color;
tg.SecondaryButton.setText("Выйти из учетной записи");
tg.SecondaryButton.position = "top";
tg.SecondaryButton.show();

tg.SettingsButton.hide();

function SBC() {
    tg.showConfirm("Вы действительно хотите Выйти из учетной записи?", (shure) => {
        if (shure) {
            tg.BackButton.hide();
            tg.DeviceStorage.clear();
            tg.SecureStorage.clear();
            window.location.href = '/singin/singin.html';
        }
    });
}


tg.MainButton.onClick(MBC);
tg.MainButton.setText("Применить изменения");
tg.MainButton.show();

function MBC() {

    // Обновление адреса сервера
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

    tg.DeviceStorage.setItem("serverURL", urlOrigin);

    //Обновление имени публтикации
    publishField = document.getElementById('publishField').value
    if (publishField.endsWith("/")){
        publishField = publishField.trim()
    } else {
        publishField = publishField.trim() + "/";
    }

    tg.DeviceStorage.setItem("publishNAME", publishField);

    setTimeout(() => {
        window.location.href = '/';
    }, 500); // пол секунды
    
}


getValue('biometricEnable')
    .then((value) => {
        if ((value != null) || (value != undefined)) {
            if (value == "true") {
                document.getElementById('toggle').checked = true;
            }
        } else {
            console.log("Данных нет");
        }
    })
    .catch((error) => {
        console.log("Ошибка чтения сохраненных данных!", error);
    });



document.getElementById('toggle').addEventListener('change', function () {
    if (this.checked) {

        if (tg.BiometricManager.isInited) {
            if (tg.BiometricManager.isBiometricAvailable) {
                window.location.href = 'biometric/biometric.html';
            } else {
                tg.showAlert("Биометрия недоступна на данном устройстве")
                document.getElementById('toggle').checked = false;
            }
        } else { 
            tg.BiometricManager.init(() => {
                if (tg.BiometricManager.isBiometricAvailable) {
                    window.location.href = 'biometric/biometric.html';
                } else {
                    tg.showAlert("Биометрия недоступна на данном устройстве")
                    document.getElementById('toggle').checked = false;
                }
            });
        }

        
        
    } else {
        tg.SecureStorage.removeItem("ECP");
        tg.DeviceStorage.setItem("biometricEnable", "false");
    }
    //console.log("Состояние переключателя: ", this.checked ? "Включено" : "Выключено");
});

setTimeout(() => {
    document.getElementById('urlField').value = serverURL;
    document.getElementById('publishField').value = publishNAME.slice(0, -1);
}, 500); // пол секунды
