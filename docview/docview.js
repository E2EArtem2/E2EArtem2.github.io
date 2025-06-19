//const tg = window.Telegram.WebApp;


tg.BackButton.onClick(() => {
    tg.BackButton.hide();
    //tg.DeviceStorage.removeItem("openDoc");
    window.location.href = '/';
});
tg.BackButton.show();

tg.MainButton.setText("В оплату");
tg.MainButton.onClick(() => {
    window.location.href = '/signature/signature.html';
})
tg.MainButton.show();

//let docUIN;



getValue('openDoc')
    .then((value) => {
        if (value != null) {
            const jsValue = JSON.parse(value);

            document.getElementById('header').innerHTML = `${jsValue.OrgName}<br>СЗ № ${jsValue.PolnyNomer} по проекту ${jsValue.Project}`;

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
            /*
            docUIN = jsValue.UIN;
            tg.SecondaryButton.onClick(SBC);
            */
            //outputString = `СЗ № ${jsValue.PolnyNomer}<br>От ${jsValue.Data}<br>Организация ${jsValue.OrgName}<br>Сумма: ${jsValue.Summa}`
            //document.getElementById('DinamicContainer').innerHTML = outputString;
        }
    })
    .catch((error) => {
        //showAlert("Ошибка ", error);
    });


tg.SecondaryButton.setText("На доработку");
tg.SecondaryButton.onClick(() => {
    window.location.href = 'rework/rework.html';
});
tg.SecondaryButton.position = "left";
tg.SecondaryButton.show();


