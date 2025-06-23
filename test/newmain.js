//const tg = window.Telegram.WebApp;
tg.SecondaryButton.onClick(SBC);
tg.SecondaryButton.setText("�������� ������ ����������");
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
        console.log("������ ������ ����������� ������!", error);
        //tg.showAlert("�� ������� ��������� ��������� ������ ", error);
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
                throw new Error(`������ HTTP: ${response.status}`);
            }
            // � ����������� �� ������������ ������ ����� ������� response.json() ��� response.text()
            return response.json();
        })
        .then(data => {
            console.log("��������� �������:", data);
            docList = data;
            showDocList(data);
            let serializedData = JSON.stringify(data);
            tg.DeviceStorage.setItem("docList", serializedData);
        })
        .catch(error => {
            console.error("������ �������:", error);
        });
}

function showDocList(data) {
    document.getElementById('DinamicContainer').innerHTML = ""
    let htmlAddString = "";
    data.forEach((doc) => {

        if (dateExpiredCheck(doc.DataOplaty)) {
            htmlAddString += `  <a id="${doc.UIN}" name="toDocButton" style="color: ${tg.themeParams.destructive_text_color}" >
                            <div class="section">
                                <div>${doc.OrgName}<br>�� � ${doc.PolnyNomer} �� ${doc.Data}<br>����� ${doc.Summa} ${doc.Valuta}</div>
                            </div>
                        </a>         `;
        } else {
            htmlAddString += `  <a id="${doc.UIN}" name="toDocButton" >
                            <div class="section">
                                <div>${doc.OrgName}<br>�� � ${doc.PolnyNomer} �� ${doc.Data}<br>����� ${doc.Summa} ${doc.Valuta}</div>
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
    // ������������� ������� �� ������
    event.preventDefault();

    // ��� ������, ������� ����� ���������
    let UIN = event.currentTarget.id;

    docList.forEach((obj) => {
        if (obj.UIN == UIN) {
            let serializedData = JSON.stringify(obj);
            console.log(serializedData)
            tg.DeviceStorage.setItem("openDoc", serializedData);

        }
    });

    // ���� �����, ����� ��������� ������� �����
    window.location.href = '/docview/docview.html';
}


setTimeout(() => {
    console.log('��� ��������� �������� ����� 2 �������');
    SBC();
}, 500); // 2000 �� = 2 �������

function dateExpiredCheck(tagetDataString) {

    tdm = tagetDataString.split('.');
    
    const targetData = new Date(parseInt(tdm[2]), parseInt(tdm[1])-1, parseInt(tdm[0])+1); 

    const currentDate = new Date();

    if (targetData > currentDate) {
        console.log(targetData + " ������ " + currentDate);
        return false;
    } 
    return true;
}
