// Описаний в документації для відображення часу
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації для відображення сповіщення про помилку
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

//додавання змінних для дом елемента кнопка запуску
const buttonDom = document.querySelector('.section button[data-start]');

//додавання змінних для дом елементів відображення елментів
const timerDom = document.querySelectorAll('.timer .field span.value');

// затемененя кнопки для розуміння неактивності кнопки
buttonDom.classList.add('inactive');

// визначення змінних
let userSelectedDate;

// визначення поточного дати та часу
const curDate = new Date();

// визначення змінної поточного шндентифікатора setInterval() для його видалення
let outerItnervalId;

//визначення змінної для прибрання навішування слухача при обранні тієїєж дати відліку
let deltaDatePrev;
let optionsIziToast = {
  class: 'snackbar-box',
  theme: 'dark', // темна тема
  timeout: 3000, // час прогресс бару
  title: 'Please choose a date in the future', //фраза сповіщення
  titleSize: 18,
  position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
  backgroundColor: '#FD4B3F',
  progressBar: false,
  closeOnClick: true, // можливість передчасного закривання вінка
  displayMode: 'once', // спрацювати 1 раз
  icon: 'fa fa-times-circle',
  // iconUrl: './img/cross-x.png',
  transitionIn: 'fadeInUp',
  close: false, // закривання при натисканні на будь-який елемент сповіщення
};

// опції для flatpickr
const optionsFlatpickr = {
  enableTime: true, //відображення дати
  time_24hr: true, // 24-часовий відображення
  defaultDate: new Date(), //поточні дата на приклад як -  placeholder
  minuteIncrement: 1, // встановлення часу минімальні зміни на 1 хвилину
  onClose: closeCalendar, //визов функції після обрання дати та часу
};

// конфігурування flatpickr із підключенням опцій
flatpickr('#datetime-picker', optionsFlatpickr);

/**
 * функція запуску відліку до обраної дати
 * @param {Array} selectedDates формат обраноъ дати
 * @returns
 */
function closeCalendar(selectedDates) {
  //обраний час юзером
  userSelectedDate = selectedDates[0];
  // дельта дат обраної та поточної
  let deltaDateCur = userSelectedDate.getTime() - curDate.getTime();
  // перевірку на дати в минулому
  if (deltaDateCur < 0) {
    // відображення попееджувальноого напису
    // window.alert('Please choose a date in the future');
    iziToast.error(optionsIziToast);
    // кнопка отримує стиль класу'.inactive'
    buttonDom.classList.add('inactive');
    return;
  }

  // перевірка зміни обраної дати для виключення повторно обраної дати
  if (deltaDateCur !== deltaDatePrev) {
    // видалення стилю класу'.inactive'
    buttonDom.classList.remove('inactive');
    // попереднє значення дорівнює поточній дельті дат
    deltaDatePrev = deltaDateCur;
    //визов функції як аргумент додано дельту дат
    iterate(deltaDatePrev);
  }
}

/**
 * функція запуску відображення відліку до обраної дати у полі timerDom
 * @param {Numder} value
 */
function iterate(deltaDate) {
  let value = deltaDate;
  buttonDom.addEventListener(
    'click',
    event => {
      // Перевіряємо, чи існує інтервал перед тим як створювати новий старий треба стерти
      if (outerItnervalId) {
        clearInterval(outerItnervalId);
      }
      // завдання сетІнтревалу() для рахування value
      let intervalId = setInterval(() => {
        //пертворення value до обєкту із 4 параметрами день, час, хвилина, секунда
        let objDateData = convertMs(value);
        // відображення знаяень у span
        addsDataToDom({ objDateData, timerDom });
        //зменьшення значення value на 1000мікросекунд
        value -= 1000;
        //умова завершення циклу та стирання сетІнтервалу()
        if (value < 0) {
          console.log('Done');
          clearInterval(intervalId);
        }
      }, 1000);
      //зберегли значення сетІнтревалу() для його видалення після завдання нового сетІнтервалу()
      outerItnervalId = intervalId;

      buttonDom.classList.add('inactive');
    },
    { once: true } // працює лише 1 раз потім слухач зникає
  );
}

/**
 * adds  numders objDateData in elements timerDom.
 * @param { object} objDateData - date for { days, hours, minutes, seconds }
 * @param { nodeList} timerDom - timerDom link for Dom element Form
 */
function addsDataToDom({ objDateData, timerDom }) {
  // ітерація обєкту objDateData
  for (const item in objDateData) {
    // ітерація timerDom
    for (let i = 0; i < timerDom.length; i++) {
      //якщо i-тий елемент із датасет ==''
      if (timerDom[i].dataset[item] === '') {
        // якщо значення timerDom.textContent не змінилося у objDateData
        if (timerDom[i].textContent !== addLeadingZero(objDateData[item])) {
          // змінити значення timerDom якщо значення objDateData відповідне змінилося
          timerDom[i].textContent = addLeadingZero(objDateData[item]);
        }
      }
    }
  }
}

/**
 * функція додавання "0" до значень за 0...9
 * @param {Number} value - передане значення
 * @returns String
 */
function addLeadingZero(value) {
  return `${value}`.padStart(2, '0');
}

/**
 * перетворення значень поточного часу у (ms) для отримання об'єкту із відповідними параметрами
 * @param {NUmber} ms значення часу у мс
 * @returns Object - { days, hours, minutes, seconds }
 */
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
