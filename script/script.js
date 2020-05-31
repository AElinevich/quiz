document.addEventListener('DOMContentLoaded', function() {
    const btnOpenModal = document.querySelector('#btnOpenModal'),
          modalBlock = document.querySelector('#modalBlock'),
          closeModal = document.querySelector('#closeModal'),
          questionTitle = document.querySelector('#question'),
          formAnswers = document.querySelector('#formAnswers'),
          burgerBtn = document.getElementById("burger"),
          nextButton = document.querySelector("#next"),
          prevButton = document.querySelector("#prev"),
          modalDialog = document.querySelector('.modal-dialog'),
          sendButton = document.querySelector('#send'),
          modalTitle = document.querySelector(".modal-title");

     // Your web app's Firebase configuration
     const firebaseConfig = {
        apiKey: "AIzaSyBqngrDMi2oalW0kOrNiJYGnculYSu4ThQ",
        authDomain: "testburger-29a8c.firebaseapp.com",
        databaseURL: "https://testburger-29a8c.firebaseio.com",
        projectId: "testburger-29a8c",
        storageBucket: "testburger-29a8c.appspot.com",
        messagingSenderId: "798911727231",
        appId: "1:798911727231:web:e6c2b799c9b673b275614a",
        measurementId: "G-TPCMRWJBES"
      }; 

      firebase.initializeApp(firebaseConfig);
// функция получения данных
const getData = () => {
    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');
    setTimeout(()=>{
        firebase.database().ref().child('questions').once('value')
        .then(snap =>playTest(snap.val()))
    }, 500)
    
}

     /*     const questions = [
            {
                question: "Какого цвета бургер?",
                answers: [
                    {
                        title: 'Стандарт',
                        url: './image/burger.png'
                    },
                    {
                        title: 'Черный',
                        url: './image/burgerBlack.png'
                    }
                ],
                type: 'radio'
            },
            {
                question: "Из какого мяса котлета?",
                answers: [
                    {
                        title: 'Курица',
                        url: './image/chickenMeat.png'
                    },
                    {
                        title: 'Говядина',
                        url: './image/beefMeat.png'
                    },
                    {
                        title: 'Свинина',
                        url: './image/porkMeat.png'
                    }
                ],
                type: 'radio'
            },
            {
                question: "Дополнительные ингредиенты?",
                answers: [
                    {
                        title: 'Помидор',
                        url: './image/tomato.png'
                    },
                    {
                        title: 'Огурец',
                        url: './image/cucumber.png'
                    },
                    {
                        title: 'Салат',
                        url: './image/salad.png'
                    },
                    {
                        title: 'Лук',
                        url: './image/onion.png'
                    }
                ],
                type: 'checkbox'
            },
            {
                question: "Добавить соус?",
                answers: [
                    {
                        title: 'Чесночный',
                        url: './image/sauce1.png'
                    },
                    {
                        title: 'Томатный',
                        url: './image/sauce2.png'
                    },
                    {
                        title: 'Горчичный',
                        url: './image/sauce3.png'
                    }
                ],
                type: 'radio'
            }
        ];
          */

        


          let clientWidth = document.documentElement.clientWidth;

            if(clientWidth<768) {
                burgerBtn.style.display = "flex";
            } else {
                burgerBtn.style.display = "none";
            }

          window.addEventListener('resize', function() {
              clientWidth = document.documentElement.clientWidth;
            if(clientWidth < 768) {
                burgerBtn.style.display = "flex";
            } else {
                burgerBtn.style.display = "none";
            }
            })
            burgerBtn.addEventListener('click', function(){
               burgerBtn.classList.add("active");
                modalBlock.classList.add("d-block");
    
                playTest();
            })  
// анимируем модальное окон
let count =-100;
let interval;
modalDialog.style.top = count + "%";

const animatiModal = () => {
    modalDialog.style.top = count + "%";
    count++;
    if(count >=0) {
        clearInterval(interval);
        count=-100;
    }
};


// в bootstrape d-block как в css display block
    btnOpenModal.addEventListener('click', () =>{
        interval = setInterval(animatiModal, 5);
        modalBlock.classList.add('d-block');
        getData();
      
    })   
    
    closeModal.addEventListener('click', () =>{
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove("active");
    })
    

    document.addEventListener('click', function (event){
        if(
        !event.target.closest(".modal-dialog") &&
        !event.target.closest(".openModalButton") &&
        !event.target.closest(".burger")
        ) {
            modalBlock.classList.remove("d-block");
            burgerBtn.classList.remove("active");
    }
        
        
    });


    const playTest = (questions) => {
        let numberQuestion = 0;
        modalTitle.textContent = "Ответь на вопрос";
        const finalAnswers = [];
        const obj = {};
        const renderAnswers = (index) => {
        /**forEach удобнее цикла как так не привязан к числу элементов
         * ведь у нас мб много бургеров*/
            questions[index].answers.forEach ((answer) => {
            const answerItem = document.createElement('div');
            answerItem.classList.add("answers-item", "d-flex", "justify-content-center");
    
            answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${answer.url}" alt="burger">
                <span>${answer.title}</span>
                </label>
            `;
        formAnswers.appendChild(answerItem);

            })
        }
       // ф-ия рендеринга вопросов+ответов  
        const renderQuestions = (indexQuestion) => {
    // чтобы при каждом запуске не дублировался бургер
            formAnswers.innerHTML = '';
            
switch (true) {
    case (numberQuestion >=0 && indexQuestion <= questions.length-1):
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);
        nextButton.classList.remove('d-none');
        prevButton.classList.remove('d-none');
        sendButton.classList.add('d-none');
        break;
    case numberQuestion === 0:
        prevButton.classList.add('d-none');
        break;
    case numberQuestion === questions.length:
        questionTitle.textContent = "";
        modalTitle.textContent = "";
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        sendButton.classList.remove('d-none');
        formAnswers.innerHTML = `
            <div class="form-group">
            <label for="numberPhone">inter your number</label>
            <input type="phone" class="form-control" id="numberPhone"
            </div>
            `;
        
    const numberPhone = document.getElementById("numberPhone");
    numberPhone.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/[^0-9+-]/,"");
    })
    break;
    case numberQuestion === questions.length+1:
        formAnswers.textContent = 'Спасибо за пройденный тест';
        sendButton.classList.add("d-none");
        for (let key in obj) {
            console.log(key, obj[key]);
            let newObj = {};
            newObj[key] = obj[key];
            finalAnswers.push(newObj);

        }
        setTimeout(() => {
        modalBlock.classList.remove('d-block');
        }, 5000);
    } 
        } 
        renderQuestions(numberQuestion);
const checkAnswer = () => {
    console.log('check');

    const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
    
    inputs.forEach((input, index) =>{
        if (numberQuestion >= 0 && numberQuestion <= questions.length-1){
        obj[`${index}_${questions[numberQuestion].question}`] = input.value;

    }
    if(numberQuestion === questions.length) {
        obj['Номер телефона'] = input.value;
        console.log(input.value)
    }

})
   // finalAnswers.push(obj);

}



    nextButton.onclick = () =>{
// запуск ф-ии рендеринга
checkAnswer();
    numberQuestion++; 
        renderQuestions(numberQuestion);
    }
    
    prevButton.onclick = () =>{
        numberQuestion--;
        renderQuestions(numberQuestion);
        
    }
sendButton.onclick = () => {
    checkAnswer();
    numberQuestion++; 
    renderQuestions(numberQuestion);
    firebase
    .database()
    .ref()
    .child('contacts')
    .push(finalAnswers);
    console.log(finalAnswers);

}

    }
    
})


/* Эту ф-цию заменила на switch case
if (numberQuestion >=0 && indexQuestion <= questions.length-1){
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
            }
            if (numberQuestion === 0) {
                prevButton.classList.add('d-none');
            }
            if(numberQuestion === questions.length) {
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                formAnswers.innerHTML = `
                <div class="form-group">
                <label for="numberPhone">inter your number</label>
                <input type="phone" class="form-control" id="numberPhone"
                </div>
                `;
            }

           if(numberQuestion === questions.length-1) {
            
               formAnswers.textContent = 'Спасибо за пройденный тест';
               setTimeout(() => {
                modalBlock.classList.remove('d-block');
               }, 5000);
               
           } 

*/