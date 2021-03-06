// Attention In order to activate hacking mode press on the first big red H on the landing screen or go to the console and type hackTheSystem()
"use strict";

window.addEventListener("DOMContentLoaded", deligator);
//init empty array
let allStudents = [];
// init another empty array
let filteredStudents = [];
//init the array.length tracker
let numberOfStudents = document.querySelector('.studentNumber');
let systemHacked = false;

// The prototype for all students: 
const Student = {
  firstName: '',
  middleName: '',
  lastName: '',
  nickName: '',
  gender: '',
  house: '',
  image: '',
  hacker: '',
  expelled: false,
  squad: false,
  prefect: false,
  toggleExpell() {
    //if student expeled = false make it to true,
    if (this.expelled === false) {
      this.expelled = true;
      //shows only the students that are not expeled
      filteredStudents = filteredStudents.filter(student => student.expelled === false);
    }
    else {
      this.expelled = false;
      //shows only the students that are expeled
      filteredStudents = filteredStudents.filter(student => student.expelled === true);
    }
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
    //display updated array after a delay so class can take place
    setTimeout(() => {
      displayList(filteredStudents);
    }, 500);
  },
  toggleSquad() {
    //change squad status based on what previous status is
    if (this.house === 'Slytherin' && this.squad === false) {
      this.squad = true;
    } else {
      this.squad = false;
    }
    //if system is hacked then call removeInq function
    if (systemHacked) {
      this.removeInq();
    }
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
    displayList(filteredStudents);
  },
  removeInq() {
    //remove the inq squad after a delay if system is hacked
    if (this.squad === true) {
      setTimeout(() => {
        this.squad = false;
        displayList(filteredStudents);
      }, 2000)
    }
  }

}

function deligator() {
  // getButtons();
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json");
  document.querySelector('#selectFilterBar').addEventListener('change', getFilterBarValue);
  document.querySelector('#sortSelect').addEventListener('input', getSortedValues);
  // document.querySelector('.soundImg').addEventListener('click', playTheme);
  document.querySelector('.search').addEventListener('input', searchStudent);
  document.querySelector('.hacked').addEventListener('click', hackTheSystem);
}

function getFilterBarValue() {
  //gets the value from the select bar
  const selectedValue = this.value;
  // console.log(selectedValue);
  //pass value to getStudent
  getStudent(selectedValue);
  //get value for animal sounds
  animalSounds(selectedValue);
}
function getSortedValues() {
  //get the value from the select
  const selectedValue = this.value;
  let sortDirection = this.options[this.selectedIndex].dataset.sortDirection;
  //get the sort button and add event listener 
  document.querySelector('[data-field=sortbtn]').addEventListener('click', changeDirection);

  function changeDirection() {
    //change sorting direction based on what their data-field is. if asc then dec
    if (sortDirection === 'asc') {
      sortDirection = 'desc';
      document.querySelector('[data-field=sortbtn]').textContent = `Sort ↑`
    } else {
      sortDirection = 'asc'
      document.querySelector('[data-field=sortbtn]').textContent = `Sort ↓`

    }

    getSortedStudent(selectedValue, sortDirection);
  }

}

function getStudent(selectedValue) {
  if (selectedValue === '*') {
    // show only students that are not expeled
    filteredStudents = allStudents.filter(students => students.expelled === false);
  }
  else if (selectedValue === 'Expelled') {
    // show only students that are expeled
    filteredStudents = allStudents.filter(students => students.expelled === true);
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  } else if (selectedValue === 'Inquisitorial') {
    filteredStudents = allStudents.filter(students => students.squad === true);
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  } else if (selectedValue === 'prefects') {
    filteredStudents = allStudents.filter(student => student.prefect === true);
  }
  else {
    // show only students based on their house and the ones who are not expelled
    filteredStudents = allStudents.filter(student => student.house === selectedValue && student.expelled === false);
  }
  // update the numbers before displaying.
  numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  displayList(filteredStudents);
}

function animalSounds(selected) {
  //play different sound based on the filtered house
  let lionSound = new Audio('./harryp/lion.mp3');
  let bagerSound = new Audio('./harryp/bager.mp3');
  let eagleSound = new Audio('./harryp/eagle.mp3');
  let snakeSound = new Audio('./harryp/snake.mp3');
  switch (true) {
    case selected === 'Gryffindor':
      return lionSound.play();
    case selected === 'Slytherin':
      return snakeSound.play();
    case selected === 'Ravenclaw':
      return eagleSound.play();
    case selected === 'Hufflepuff':
      return bagerSound.play();
  }
}
//play harry potter theme
// function playTheme() {
//   const theme = new Audio('./harryp/harry_potter_loop.mp3');
//   theme.play()
// }

function getSortedStudent(pressedValue, sortDirection) {
  let sortedStudents = [];
  let direction = 1;
  //change direction descending/ascending
  if (sortDirection === 'desc') {
    direction = 1;
  } else {
    direction = -1;
  }

  sortedStudents = filteredStudents.sort((a, b) => {
    //compairs all the names and sorts after
    if (a[pressedValue] < b[pressedValue]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  });
  displayList(sortedStudents);
}


async function loadJSON(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);
  filteredStudents = allStudents;

  displayList(allStudents);
  numberOfStudents.textContent = `Students: ${allStudents.length}`
}

function preapareObject(studentObject) {
  const student = Object.create(Student);
  // make an array with every letter of names.
  const letterArray = studentObject.fullname.trim().split('');
  // console.log(letterArray);

  //if previous index is equal to '' or - make next index uppercase
  letterArray.forEach((letter, index) => {
    // console.log(letter);
    // index -1 is the previous index before the letter
    if (letterArray[index - 1] === ' ' || letterArray[index - 1] === '-') {
      letterArray[index] = letter.toUpperCase();
    } else if (letterArray[index] === '-') {
      letterArray[index] = letter.replace('-', " ");
    }
    else if (letterArray[index - 1] === '"') {
      letterArray[index] = letter.toUpperCase();
    } else if (letterArray[index] === '"') {
      letterArray[index] = letter.replace('"', "");
    }
    else {
      letterArray[0] = letterArray[0].toUpperCase();

      letterArray[index] = letter.toLowerCase();
    }

  });

  const edittedStudent = student.name = letterArray.join('');

  // find first,middle,last name
  const firstSpace = edittedStudent.indexOf(' ');
  const lastSpace = edittedStudent.lastIndexOf(' ');
  //set names
  let firstName;
  if (firstSpace === -1) {
    firstName = edittedStudent.trim();
  } else {
    firstName = edittedStudent.substring(0, firstSpace);
  }
  const middleName = edittedStudent.substring(firstSpace, lastSpace);
  const lastName = edittedStudent.substring(lastSpace);

  // find gender
  const genderStudent = studentObject.gender.trim();

  //properly capitalise gender
  const firstLetter = genderStudent.substring(0, 1);
  const restOfLetters = genderStudent.substring(1)
  const fixedGender = `${firstLetter.toUpperCase()}${restOfLetters.toLowerCase()}`

  // find house
  const houseOfStudents = studentObject.house.trim();
  //properly capitalise house
  const firstLetterHouse = houseOfStudents.substring(0, 1);
  const restOfHouse = houseOfStudents.substring(1);
  const edittedHouse = `${firstLetterHouse.toUpperCase()}${restOfHouse.toLowerCase()}`


  //set the first of object to be equal to variable firstName
  student.firstName = firstName;
  //if the name of the student is equal to space then set it as undifined
  if (middleName === '') {
    student.middleName = undefined;
  } else {//set it normally
    student.middleName = middleName.trim();
  }
  //set the first of object to be equal to variable lastName
  if (firstName === lastName) {
    student.lastName = undefined;
  } else {
    student.lastName = lastName.trim();
  }
  student.gender = fixedGender;
  student.house = edittedHouse

  const imgLastName = lastName.substring(0, 2).toLowerCase();
  const imgRest = lastName.substring(2)

  //get the images
  if (student.lastName === 'Patil') {
    student.image = `./images/${lastName.toLowerCase().trim()}_${firstName.toLowerCase().trim()}.png`
  } else if (student.firstName === 'Leanne') {
    student.image = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
  }
  else {
    student.image = `./images/${imgLastName.trim()}${imgRest}_${firstName.substring(0, 1).toLowerCase()}.png`
  }

  // console.table(student)
  return student;
}

function displayList(students) {
  // clear the list
  document.querySelector("#main").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("#template").content.cloneNode(true);

  //modal 
  const modal = getModal(clone, openModal, closeModal);
  //open modal (also closes if clicked outside of main modal content)
  function openModal() {
    modalOpen(modal, student);
  }
  //close modal
  function closeModal() {
    modal.style.display = 'none';
  }
  //get the card
  const card = clone.querySelector('[data-field-card=card]');
  const expeledInfo = clone.querySelector('[data-field=expelledField]');
  const fire = new Audio('./harryp/fire.mp3');

  //if student expelled then:
  if (student.expelled === true) {
    expeledInfo.textContent = 'Expeled';
    card.style.background = 'red';
    clone.querySelector('[data-field=expell]').textContent = 'Un-expel';
  } else {
    clone.querySelector('[data-field=expelledField]').textContent = '';
  }

  //if hacker then cant expell
  if (student.hacker) {
    expeledInfo.textContent = 'Expel me if you can';
    clone.querySelector('[data-field=expell]').textContent = 'Can\'t do it, can you?';
    clone.querySelector('[data-field=expell]').disabled = true;
  }
  //get the expell button
  clone.querySelector('[data-field=expell]').addEventListener('click', clickExpell);

  function clickExpell() {
    //play audio
    fire.play();
    expeledInfo.textContent = 'Expeled';
    card.style.background = 'red';
    card.classList.add('fallDown');
    student.toggleExpell();
  }

  clone.querySelector('[data-field=inquisBtn]').addEventListener('click', clickSquad);
  //inquisitorial squad
  if (student.house === 'Slytherin' && student.squad === true) {
    clone.querySelector('[data-field=inquisBtn]').style.opacity = 1;
    card.style.background = 'black';
  }
  //toggle the togglesquad method on the prototype
  function clickSquad() {
    student.toggleSquad();
  }

  //prefect
  clone.querySelector('[data-field=prefectBtn]').addEventListener('click', clickPrefect);
  if (student.prefect === true) {
    clone.querySelector('[data-field=prefectBtn]').style.opacity = 1;
    card.style.background = '#ff8000'
  }
  //if the student is both prefect and inq squad then card color is a mix of both colors.
  if (student.squad === true && student.prefect === true) {
    card.setAttribute('style', 'background: linear-gradient(50deg,#ff8000,#513E3E);')
  }

  function clickPrefect() {
    //if prefect is true make it false else run tryToMakePrefects function
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student)
    }
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
    displayList(filteredStudents);
  }


  // set clone data on the card
  const random = Math.floor(Math.random() * allStudents.length);
  //if system is hacked then names should be random
  if (systemHacked) {
    clone.querySelector("[data-field=name]").textContent = allStudents[random].name;
  }
  else {
    clone.querySelector("[data-field=name]").textContent = student.name;
  }
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector('[data-field=img]').src = student.image
  // append clone to list
  document.querySelector("#main").appendChild(clone);
}

function tryToMakePrefect(selectedStudent) {
  //filter the all students array and find the ones who are prefects
  const prefectsArray = allStudents.filter(student => student.prefect);
  const numberOfPrefects = prefectsArray.length;

  //filter the prefects array and get the students house
  const grif = prefectsArray.filter(student => student.house === 'Gryffindor');
  const raven = prefectsArray.filter(student => student.house === 'Ravenclaw');
  const huffle = prefectsArray.filter(student => student.house === 'Hufflepuff');
  const slyth = prefectsArray.filter(student => student.house === 'Slytherin');

  //if student is hufflepuff and the length of huffle is 2 then remove
  if (selectedStudent.house === 'Hufflepuff' && huffle.length == 2) {
    removeAorB(huffle.shift(), huffle.pop());
  }
  else if (selectedStudent.house === 'Gryffindor' && grif.length == 2) {
    removeAorB(grif.shift(), grif.pop());
  }
  else if (selectedStudent.house === 'Ravenclaw' && raven.length == 2) {
    removeAorB(raven.shift(), raven.pop());
  }
  else if (selectedStudent.house === 'Slytherin' && slyth.length == 2) {
    removeAorB(slyth.shift(), slyth.pop());
  }
  else if (numberOfPrefects > 9) {
    removeAorB(prefectsArray[0], prefectsArray[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    //ask user to ignore or remove A or B
    document.querySelector('#removePrevious').classList.remove('hide');
    //add event listeners
    document.querySelector('.prefCloseBtn').addEventListener('click', closePrefContent);
    document.querySelector('.previous').addEventListener('click', removePrevious);
    document.querySelector('.current').addEventListener('click', removeCurrent);

    //get the names of students to show on the modal
    document.querySelector('.previous').textContent = `Remove ${prefectA.name}`;
    document.querySelector('.current').textContent = `Remove ${prefectB.name}`;


    function closePrefContent() {
      //hide the modal
      document.querySelector('#removePrevious').classList.add('hide');
      //remove the event listeners (good practice) 
      document.querySelector('.prefCloseBtn').removeEventListener('click', closePrefContent);
      document.querySelector('.previous').removeEventListener('click', removePrevious);
      document.querySelector('.current').removeEventListener('click', removeCurrent);
    }

    function removePrevious() {
      //remove prefect that was selected first
      removePrefect(prefectA);
      //make prefect selected one
      makePrefect(selectedStudent);
      displayList(filteredStudents);
      //change the text on the screen
      document.querySelector('.prefTextH3').textContent = 'Removed ✅'
      //close the modal and change text back 
      setTimeout(() => {
        closePrefContent();
        document.querySelector('.prefTextH3').textContent = 'here can only be two prefects of each house. Remove one of the following:'
      }, 1000);
    }
    function removeCurrent() {
      //remove prefect that was selected second
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      displayList(filteredStudents);
      //change the text on the screen
      document.querySelector('.prefTextH3').textContent = 'Removed ✅'
      //close the modal and change text back
      setTimeout(() => {
        closePrefContent();
        document.querySelector('.prefTextH3').textContent = 'here can only be two prefects of each house. Remove one of the following:'
      }, 1000);
    }
  }

  function removePrefect(currentPrefect) {
    //remove the prefect
    currentPrefect.prefect = false;
  }

  function makePrefect(prefects) {
    //add the prefect
    prefects.prefect = true;
  }

}

function searchStudent() {
  //get the value from the input
  const searchValue = document.querySelector('.search').value;
  //filter through the students and find student based on search value
  const search = filteredStudents.filter(element =>
    element.name.toUpperCase().includes(searchValue.toUpperCase())
    || element.name.toLowerCase().includes(searchValue.toLowerCase()));
  //show how many students got filtered
  numberOfStudents.textContent = `Students: ${search.length}`;
  displayList(search);
}


function getModal(clone, openModal, closeModal) {
  const btn = clone.querySelector('.btn');
  btn.addEventListener('click', openModal);
  const modal = document.querySelector('#modal');
  document.querySelector('.close-btn').addEventListener('click', closeModal);
  return modal;
}

function modalOpen(modal, student) {
  modal.style.display = 'block';
  //set the student first/middle/last if they have one or not.
  document.querySelector('.student-firstName').textContent = `First name: ${student.firstName}`;
  if (student.middleName === undefined) {
    document.querySelector('.student-middleName').textContent = `Middle name: None`;
  } else {
    document.querySelector('.student-middleName').textContent = `Middle name: ${student.middleName}`;
  }
  if (student.lastName === undefined) {
    document.querySelector('.student-lastName').textContent = `Last name: None`;
  } else {
    document.querySelector('.student-lastName').textContent = `Last Name: ${student.lastName}`;
  }

  // set the house 
  document.querySelector('.student-house').textContent = `House: ${student.house}`;
  //set the gender
  document.querySelector('.student-gender').textContent = `Gender: ${student.gender}`;
  //set the image
  document.querySelector(' [data-field=img]').src = student.image;

  //get the div where the house crests will be set
  const houseCrest = document.querySelector('.house-crest');
  //set diffrent background for each of the houses.
  switch (true) {
    case student.house === 'Gryffindor':
      houseCrest.setAttribute('style', 'background: url(./harryp/Gryffindor.png); background-size:contain; background-repeat: no-repeat');
      break;
    case student.house === 'Slytherin':
      houseCrest.setAttribute('style', 'background: url(./harryp/Slytherin.png); background-size:contain; background-repeat: no-repeat');
      break;
    case student.house === 'Hufflepuff':
      houseCrest.setAttribute('style', 'background: url(./harryp/Hufflepuff.png); background-size:contain; background-repeat: no-repeat');
      break;
    case student.house === 'Ravenclaw':
      houseCrest.setAttribute('style', 'background: url(./harryp/Ravenclaw.png); background-size:contain; background-repeat: no-repeat');
      break;
  }
  // fetch the data needed for the blood stautus
  fetch('https://petlatkea.dk/2020/hogwarts/families.json').then(response => response.json()).then(data => {
    //get the pure blood name array from the object
    const pure = data.pure;
    //get the half blood name array from the object
    const half = data.half;
    //create an array with pureblood half etc.
    const bloodStatus = ['Pure Blood', 'Half Blood', 'Muggle Blood'];
    //make a random variable
    const random = Math.floor(Math.random() * bloodStatus.length);

    if (systemHacked) {
      //if system is hacked change the blood status to random
      document.querySelector('.student-blood').textContent = `Blood Status: ${bloodStatus[random]}`
    }
    else if (pure.includes(student.lastName)) {
      document.querySelector('.student-blood').textContent = `Blood Status: Pure blood`
    } else if (half.includes(student.lastName)) {
      document.querySelector('.student-blood').textContent = `Blood Status: Half blood`
    }
    else {
      document.querySelector('.student-blood').textContent = `Blood Status: Muggle blood`
    }
  })

  //themes
  const modalContent = document.querySelector("#modal .modal-content");
  //change color automatically when you open the modal
  //change the theme based on the data attribute.
  modalContent.dataset.theme = student.house;
  //close modal if user clicks outside.
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}
function hackTheSystem() {
  //change the systemHacked to true
  systemHacked = true

  //injecting myself in the student list
  const injectMyself = Object.create(Student);
  injectMyself.firstName = 'Klajdi';
  injectMyself.middleName = 'None';
  injectMyself.lastName = 'Ajdini';
  injectMyself.name = `${injectMyself.firstName} ${injectMyself.lastName}`;
  injectMyself.house = 'Slytherin';
  injectMyself.gender = 'Boy';
  injectMyself.image = `./harryp/Klajdi.jpg`;
  injectMyself.hacker = true;

  // if the syste is hacked then do these
  if (systemHacked) {
    const skull = document.querySelector('.systemHacked');
    skull.style.display = 'block';
    document.querySelector('.play').play();
    document.querySelector('.hacked').removeEventListener('click', hackTheSystem);
    const body = document.querySelector('body');
    body.setAttribute('style', 'background: black; font-family: hacked');
    document.querySelector('.houseCrest').classList.add('spin');
    // document.querySelector('.soundImg img').style.background = 'white';
    document.querySelector('.hacked .inquisText').textContent = 'System already hacked!';
    //remove the skull after 5s
    setTimeout(() => {
      skull.style.display = 'none';
    }, 5100);

  }
  //push myself to the student array
  allStudents.unshift(injectMyself);
  numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  displayList(filteredStudents)
}

