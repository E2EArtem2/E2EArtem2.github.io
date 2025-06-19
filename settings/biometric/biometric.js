tg.MainButton.setText("Сохранить");
tg.MainButton.onClick(MBC);
tg.MainButton.disable();
tg.MainButton.color = tg.themeParams.hint_color;
tg.MainButton.show();
tg.BiometricManager.init();
tg.BackButton.onClick(() => {
    window.location.href = '/settings/settings.html';
});
tg.BackButton.show();


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





function MBC() {
    if (!tg.BiometricManager.isAccessGranted) {
        tg.BiometricManager.requestAccess(
            { reason: "Предоставьте доступ к биометрии для подписания документов" },
            (success) => {
                if (!success) {
                    tg.showAlert("Вы не разрешили доступ к биометрии, пожалуйста, повторите действие");
                    return;
                }
            }
        )
    }

    tg.SecureStorage.setItem("ECP", document.getElementById('passField').value.toString().trim(), (err, isSave) => {
        if ((err == null) && (isSave == true)) {
            tg.DeviceStorage.setItem("biometricEnable", "true");
            window.location.href = '/settings/settings.html';
        } else {
            tg.showAlert("Не удалось сохранить ЭЦП, " + err.toString());
        }
    })

    

}