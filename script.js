let submitBtn = document.getElementById('submitBtn')
let resetBtn = document.getElementById('resetBtn')
let numberInput = document.getElementById('number')
let userName = document.getElementById('userName')

let num = false
let user = false


userName.addEventListener('input', (e) => {
    if (e.target.value.length > 2) {
        user = true
        if (num && user) {
            submitBtn.removeAttribute('disabled')
        }else{
            submitBtn.setAttribute('disabled', 'disabled');
        }
    } else {
        user = false
        submitBtn.setAttribute('disabled', 'disabled');
    }
})
numberInput.addEventListener('input', (e) => {
    console.log(e.target.value)
    let phoneNumberPattern = /^(8|\+7)[\- ]?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    let phoneNumber = e.target.value;
    if (phoneNumberPattern.test(phoneNumber)) {
        console.log("Номер телефона верный");
        num = true
        if (num && user) {
            submitBtn.removeAttribute('disabled')
        }else{
            submitBtn.setAttribute('disabled', 'disabled');
        }
    } else {
        num = false
        console.log("Номер телефона неверный");
        submitBtn.setAttribute('disabled', 'disabled');

    }
})
resetBtn.addEventListener('click', () => {
    userName.value = ''
    numberInput.value = ''
})


document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('orderForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitOrder(form);
    });
});

async function submitOrder(form) {
    var formData = new FormData(form);
    const data = {
        stream_code: 'iu244',
        client: {
            name: formData.get('name'),
            phone: formData.get('phone').toString()
        },
        sub1: formData.get('sub1')
    };

    let userName = formData.get('name');
    try {
        let response = await sendRequest(data);
        console.log(response);
        let find = false;
        if (response.uuid) {
            for (let [key, value] of Object.entries(localStorage)) {
                console.log(value);
                console.log(response.uuid);
                if (value === response.uuid) {
                    console.log("Найдено совпадение для id:", response.uuid);
                    find = true;
                    break;
                }
            }
            if (!find) {
                localStorage.setItem(userName, response.uuid);
            }
            document.querySelector('.main').classList.add('none');
            document.querySelector('.error').classList.add('none');
            document.querySelector('.success').classList.remove('none');
        } else {
            console.error('Произошла ошибка:', response.statusText);
            alert('Произошла ошибка при отправке заказа');
            document.querySelector('.main').classList.add('none');
            document.querySelector('.success').classList.add('none');
            document.querySelector('.error').classList.remove('none');
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
        alert('Произошла ошибка при отправке заказа');
    }
}



async function sendRequest(data) {
    const url = `https://order.drcash.sh/v1/order`;

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer NWJLZGEWOWETNTGZMS00MZK4LWFIZJUTNJVMOTG0NJQXOTI3'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Ошибка HTTP: ' + response.status);
    }

    response = await response.json();
    console.log(response);
    return response;
}

window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll('.number'), function (input) {
        var keyCode;
        // Функция для применения маски
        function mask(event) {
            // Если код клавиши определён и keyCode != undefined, то присваиваем его переменной keyCode
            event.keyCode && (keyCode = event.keyCode);
            // Получаем текущую позицию ввода
            var pos = this.selectionStart;
            // Если позиция меньше 3, предотвращаем ввод
            if (pos < 3) event.preventDefault();
            // Задаём матрицу для маски
            var matrix = "+7 (___) ___-__-__",
                i = 0,
                // Получаем значение поля ввода без нечисловых символов
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                // Формируем новое значение с учётом маски
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            // Создаём регулярное выражение для проверки значения поля
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            // Если значение не соответствует регулярному выражению или длина значения меньше 5 или код клавиши находится в диапазоне 47-58 (цифры), заменяем значение поля на новое значение
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            // Если фокус с поля ушёл и его длина меньше 5, очищаем значение поля
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }
        // Применяем обработчики событий к полю ввода
        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    })
})
