//TODO: 1)sorting must sort from other way around.
// 2)make filtering and sorting work together
// 3) make an expell button,
//// 4) make a place where to display the number of students that are currently displayed. 
// 5 make the images appear.

"use strict";

window.addEventListener("DOMContentLoaded", deligator);
let allStudents = [];
let filteredStudents = [];
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
    // let expelledStudents = [];

    if (this.expelled === false) {
      this.expelled = true;
    } else {
      this.expelled = false;
    }
    displayList(filteredStudents);
  }
}

// function start() {
//   console.log("ready");
//   // TODO: Add event-listeners to filter and sort buttons

//   deligator();
// }

function deligator() {
  // getButtons();
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json");
  document.querySelector('#selectFilterBar').addEventListener('change', getFilterBarValue);
  document.querySelector('#sortSelect').addEventListener('input', getSortedValues);
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
  const selectedValue = this.value;
  console.log(selectedValue);
  getStudent(selectedValue);

}
function getSortedValues() {
  const selectedValue = this.value;
  let sortDirection = this.options[this.selectedIndex].dataset.sortDirection;

  if (sortDirection === 'asc') {
    this.options[this.selectedIndex].dataset.sortDirection = 'desc';
  } else {
    this.options[this.selectedIndex].dataset.sortDirection = 'asc'
  }

  console.log(sortDirection);
  getSortedStudent(selectedValue, sortDirection);
}

function getStudent(selectedValue) {
  if (selectedValue === '*') {
    filteredStudents = allStudents;
  }
  else if (selectedValue === 'Expelled') {
    filteredStudents = allStudents.filter(students => students.expelled === true);
    numberOfStudents.textContent = `Students: ${filteredStudents.length}`;

  }
  else {
    filteredStudents = allStudents.filter(student => student.house === selectedValue);
  }
  numberOfStudents.textContent = `Students: ${filteredStudents.length}`;
  displayList(filteredStudents);
}

function getSortedStudent(pressedValue, sortDirection) {
  let sortedStudents = [];
  let direction = 1;
  if (sortDirection === 'desc') {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedStudents = filteredStudents.sort((a, b) => {
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

  if (student.expelled === true) {
    clone.querySelector('[data-field=expelledField]').textContent = 'Expelled';
    card.style.background = 'red';
    clone.querySelector('[data-field=expell]').textContent = 'Un-expell';
  } else {
    clone.querySelector('[data-field=expelledField]').textContent = '';
  }

  clone.querySelector('[data-field=expell]').addEventListener('click', clickExpell);

  function clickExpell() {
    student.toggleExpell();
  }


  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector('[data-field=img]').src = student.image
  // append clone to list
  document.querySelector("#main").appendChild(clone);
}


function getModal(clone, openModal, closeModal) {
  const btn = clone.querySelector('.btn');
  btn.addEventListener('click', openModal);
  const modal = document.querySelector('#modal');
  const closeBtn = document.querySelector('.close-btn').addEventListener('click', closeModal);
  return modal;
}

function modalOpen(modal, student) {
  modal.style.display = 'block';
  //set the student name 
  document.querySelector('.student-name').textContent = `Name: ${student.name}`;
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

