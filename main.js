//const tg = window.Telegram.WebApp;
tg.SecondaryButton.onClick(SBC);
tg.SecondaryButton.setText("Обновить список документов");
tg.SecondaryButton.show();
tg.BackButton.hide();



var docList;


getValue('docList')
    .then((value) => {
        if ((value != null) || (value != undefined) ) {
            const jsValue = JSON.parse(value);
            docList = jsValue;
            showDocList(jsValue);
        } else {
            SBC();
        }
    })
    .catch((error) => {
        console.log("Ошибка чтения сохраненных данных!", error);
        //tg.showAlert("Не удалось загрузить локальные данные ", error);
        SBC();
    });
    

function SBC() {

    const url = serverURL + publishNAME + "hs/sz/getsz/" + UserUIN;

    fetch(url, {
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
            console.log("Результат запроса:", data);
            docList = data;
            showDocList(data);
            let serializedData = JSON.stringify(data);
            tg.DeviceStorage.setItem("docList", serializedData);
        })
        .catch(error => {
            console.error("Ошибка запроса:", error);
        });
}

function showDocList(data) {
    document.getElementById('DinamicContainer').innerHTML = ""
    let htmlAddString = "";
    data.forEach((doc) => {

        if (dateExpiredCheck(doc.DataOplaty)) {
            htmlAddString += `  <a id="${doc.UIN}" name="toDocButton" style="color: ${tg.themeParams.destructive_text_color}" >
                            <div class="section">
                                <div>${doc.OrgName}<br>СЗ № ${doc.PolnyNomer} от ${doc.Data}<br>сумма ${doc.Summa} ${doc.Valuta}</div>
                            </div>
                        </a>         `;
        } else {
            htmlAddString += `  <a id="${doc.UIN}" name="toDocButton" >
                            <div class="section">
                                <div>${doc.OrgName}<br>СЗ № ${doc.PolnyNomer} от ${doc.Data}<br>сумма ${doc.Summa} ${doc.Valuta}</div>
                            </div>
                        </a>         `;
        }

        

        
    })
    document.getElementById('DinamicContainer').innerHTML = htmlAddString;
    document.getElementsByName("toDocButton").forEach((obj) => {
        obj.addEventListener('click', toDoc);
    });
}

function toDoc(event) {
    // Предотвращаем переход по ссылке
    event.preventDefault();

    // Ваш скрипт, который нужно выполнить
    let UIN = event.currentTarget.id;

    docList.forEach((obj) => {
        if (obj.UIN == UIN) {
            let serializedData = JSON.stringify(obj);
            console.log(serializedData)
            tg.DeviceStorage.setItem("openDoc", serializedData);

        }
    });

    // Если нужно, можно выполнить переход позже
    window.location.href = '/docview/docview.html';
}


setTimeout(() => {
    console.log('Это сообщение появится через 2 секунды');
    SBC();
}, 500); // 2000 мс = 2 секунды

function dateExpiredCheck(tagetDataString) {

    tdm = tagetDataString.split('.');
    
    const targetData = new Date(parseInt(tdm[2]), parseInt(tdm[1])-1, parseInt(tdm[0])+1); 

    const currentDate = new Date();

    if (targetData > currentDate) {
        console.log(targetData + " больше " + currentDate);
        return false;
    } 
    return true;
}
