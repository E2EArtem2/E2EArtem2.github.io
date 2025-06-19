var tg = window.Telegram.WebApp;


var UserUIN;
var credentials;
var serverURL;
var publishNAME;


tg.SettingsButton.onClick(() => {
    window.location.href = '/settings/settings.html';
});
tg.SettingsButton.show();

function getValue(key) {
    return new Promise((resolve, reject) => {
        tg.DeviceStorage.getItem(key, (error, value) => {
            if (error != null) {
                tg.showAlert("Ошибка ", error);
                reject(error);
                return;
            }
            resolve(value);
        });
    });
}
/*
async function getValueAsync(key) {
    try {
        const value = await getValueAsync(key);

        if (value != null) {
            console.log("Вы авторизированны");
            return value;
        } else {
            console.log("Вы не авторизированны!");
            const href = window.location.href;
            const origin = window.location.origin;
            // Если мы не на страницах /singin или /settings — редиректим
            if (
                href !== `${origin}/singin/singin.html` &&
                href !== `${origin}/settings/settings.html`
            ) {
                window.location.href = '/singin/singin.html';
            }
        }
    } catch (error) {
        console.log("Вы не авторизированны!", error);
        // При желании можно ещё делать редирект или другую логику
    }
}
*/

function getSecureValue(key) {
    return new Promise((resolve, reject) => {
        tg.SecureStorage.getItem(key, (error, value) => {
            if (error != null) {
                tg.showAlert("Ошибка ", error);
                reject(error);
                return;
            }
            resolve(value);
        });
    });
}


getValue('credentials')
    .then((value) => {
        if (value != null) {
            console.log("Вы авторизированны");
            credentials = value;
        } else {
            console.log("Вы не авторизированны!");
            switch (window.location.href) {
                case (window.location.origin + '/singin/singin'):
                    break;
                case (window.location.origin + '/settings/settings'):
                    break;
                default:
                window.location.href = '/singin/singin.html';
            }
        }
    })
    .catch((error) => {
        console.log("Вы не авторизированны!", error);
    });
  

getValue('UserUIN')
    .then((value) => {
        if ((value != null) && (value != undefined) && (value != '')) {
            console.log("Вы авторизированны");
            UserUIN = value;
        } else {
            console.log("Вы не авторизированны!");
            switch (window.location.href) {
                case (window.location.origin + '/singin/singin'):
                    break;
                case (window.location.origin + '/settings/settings'):
                    break;
                default:
                window.location.href = '/singin/singin.html';
            }
        }
    })
    .catch((error) => {
        console.log("Вы не авторизированны!", error);
    });

getValue('serverURL')
    .then((value) => {
        if ((value != null) && (value != undefined) && (value != '')) {
            console.log("Вы авторизированны");
            serverURL = value;
        } else {
            console.log("Вы не авторизированны!");
            switch (window.location.href) {
                case (window.location.origin + '/singin/singin'):
                    break;
                case (window.location.origin + '/settings/settings'):
                    break;
                default:
                    window.location.href = '/singin/singin.html';
            }

        }
    })
    .catch((error) => {
        console.log("Вы не авторизированны!", error);
    });

getValue('publishNAME')
    .then((value) => {
        if ((value != null) && (value != undefined) && (value != '')) {
            console.log("Вы авторизированны");
            publishNAME = value;
        } else {
            console.log("Вы не авторизированны!");
            switch (window.location.href) {
                case (window.location.origin + '/singin/singin'):
                    break;
                case (window.location.origin + '/settings/settings'):
                    break;
                default:
                    window.location.href = '/singin/singin.html';
            }

        }
    })
    .catch((error) => {
        console.log("Вы не авторизированны!", error);
    });

