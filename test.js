////TODO: 1)sorting must sort from other way around.
//// 2)make filtering and sorting work together
//// 3) make an expell button,
//// 4) make a place where to display the number of students that are currently displayed. 
// 5 make the images appear.

"use strict";

window.addEventListener("DOMContentLoaded", deligator);
//init empty array
let allStudents = [];
// init another empty array
let filteredStudents = [];
//init the array.length tracker
let numberOfStudents = document.querySelector('.studentNumber');

// The prototype for all students: 
const Student = {
  firstName: '',
  middleName: '',
  lastName: '',
  nickName: '',
  gender: '',
  house: '',
  image: '',
  expelled: false,
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
    //display updated array
    setTimeout(() => {
      displayList(filteredStudents);
    }, 500);
  },
  squad: false,
  toggleSquad() {
    if (this.squad === false) {
      this.squad = true;
    } else {
      this.squad = false;
    }

    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
    displayList(filteredStudents);
  },
  prefect: false,
}

// function start() {
//   console.log("ready");

//   deligator();
// }

function deligator() {
  // getButtons();
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json");
  document.querySelector('#selectFilterBar').addEventListener('change', getFilterBarValue);
  document.querySelector('#sortSelect').addEventListener('input', getSortedValues);
  document.querySelector('.soundImg').addEventListener('click', playTheme);
}


// function getButtons() {
//   const buttons = document.querySelectorAll('.button');
//   for (const button of buttons) {
//     button.addEventListener('click', function () {
//       console.log(this.dataset.filter);
//       // getStudent(this.dataset.filter);
//     });
//   }
// }

function getFilterBarValue() {
  //gets the value from the select bar
  const selectedValue = this.value;
  console.log(selectedValue);
  //pass value to getStudent
  getStudent(selectedValue);
  //get value for animal sounds
  animalSounds(selectedValue);
}
function getSortedValues() {
  const selectedValue = this.value;
  let sortDirection = this.options[this.selectedIndex].dataset.sortDirection;
  document.querySelector('[data-field=sortbtn]').addEventListener('click', changeDirection);
  function changeDirection() {
    if (sortDirection === 'asc') {
      sortDirection = 'desc';
      document.querySelector('[data-field=sortbtn]').textContent = `Sort ↑`
    } else {
      sortDirection = 'asc'
      document.querySelector('[data-field=sortbtn]').textContent = `Sort ↓`

    }

    console.log(sortDirection);
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
  }
  else {
    // show only students based on their house and the ones who are not expelled
    filteredStudents = allStudents.filter(student => student.house === selectedValue && student.expelled === false && student.squad === false);
  }
  numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  displayList(filteredStudents);
}

function animalSounds(selected) {
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
function playTheme() {
  const theme = new Audio('./harryp/harry_potter_loop.mp3');
  theme.play()
}

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
    // console.log(a[pressedValue],b[pressedValue]);
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

  // TODO: This might not be the function we want to call first

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

  //TODO:fix this mess with 2 times =
  const edittedStudent = student.name = letterArray.join('');
  // console.log(edittedStudent);


  // find first,middle,last name
  const firstSpace = edittedStudent.indexOf(' ');
  const lastSpace = edittedStudent.lastIndexOf(' ');

  //set names
  const firstName = edittedStudent.substring(0, firstSpace + 1);
  // console.log(firstName);
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
  student.lastName = lastName.trim();
  student.gender = fixedGender;
  student.house = edittedHouse

  const imgLastName = lastName.substring(0, 2).toLowerCase();
  const imgRest = lastName.substring(2)

  // student.image = `./images/${lastName.toLowerCase().trim()}_${firstName.toLowerCase()}`
  student.image = `./images/${imgLastName.trim()}${imgRest}_${firstName.substring(0, 1).toLowerCase()}.png`
  // console.log(`./images/${lastName.toLowerCase().trim()}_${firstName.toLowerCase()}`);

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

  const card = clone.querySelector('[data-field-card=card]');
  const expeledInfo = clone.querySelector('[data-field=expelledField]');
  const fire = new Audio('./harryp/fire.mp3');


  if (student.expelled === true) {
    expeledInfo.textContent = 'Expeled';
    card.style.background = 'red';
    clone.querySelector('[data-field=expell]').textContent = 'Un-expel';
  } else {
    clone.querySelector('[data-field=expelledField]').textContent = '';
  }

  clone.querySelector('[data-field=expell]').addEventListener('click', clickExpell);

  function clickExpell() {
    fire.play();
    expeledInfo.textContent = 'Expeled';
    card.style.background = 'red';
    card.classList.add('fallDown');
    student.toggleExpell();
  }

  clone.querySelector('[data-field=inquisBtn]').addEventListener('click', clickSquad);
  //inquisitorial squad
  if (student.squad === true) {
    clone.querySelector('[data-field=inquisBtn]').style.opacity = 1;
    card.style.background = 'black';
  }

  function clickSquad() {
    student.toggleSquad();
  }

  //prefect
  clone.querySelector('[data-field=prefectBtn]').addEventListener('click', clickPrefect);
  if (student.prefect === true) {
    clone.querySelector('[data-field=prefectBtn]').style.opacity = 1;
    card.style.background = '#ff8000'
  }

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student)
    }
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
    displayList(filteredStudents);
  }



  // set clone data on the card
  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector('[data-field=img]').src = student.image
  // append clone to list
  document.querySelector("#main").appendChild(clone);
}

function tryToMakePrefect(selectedStudent) {

  const prefectsArray = allStudents.filter(student => student.prefect);

  const numberOfPrefects = prefectsArray.length;

  const other = prefectsArray.filter(student => student.house === selectedStudent.house).shift();

  //if there is another of same house
  if (other !== undefined && other !== other.numberOfPrefects) {
    console.log(`There can be only one prefects from each house`);
    removeOther(other);
  } else if (numberOfPrefects > 9) {
    // console.log(`there can only be 2 prefects!`);
    removeAorB(prefectsArray[0], prefectsArray[1]);
  } else {
    makePrefect(selectedStudent);
  }



  makePrefect(selectedStudent)


  function removeOther(other) {
    //ask user to ignore or remove other

    //if ignore - do nothing
    //if remove-other
    removePrefect(other);
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    //ask user to ignore or remove A or B
    // if ignore do nothing
    //if removeA:
    removePrefect(prefectA);
    makePrefect(selectedStudent);

    //else - if removeB
    removePrefect(prefectB);
    makePrefect(selectedStudent);

  }

  function removePrefect(currentPrefect) {
    currentPrefect.prefect = false;
  }

  function makePrefect(prefects) {
    prefects.prefect = true;
  }

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

  fetch('https://petlatkea.dk/2020/hogwarts/families.json').then(response => response.json()).then(data => {
    const pure = data.pure;
    const half = data.half;

    if (pure.includes(student.lastName)) {
      document.querySelector('.student-blood').textContent = `Blood Status: Pure blood`
    } else if (half.includes(student.lastName)) {
      document.querySelector('.student-blood').textContent = `Blood Status: Half blood`
    } else {
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
//TODO: can change the filter buttons to have all the houses when the buttons are clicked they would work.

