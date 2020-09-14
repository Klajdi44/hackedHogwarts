"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
  console.log("ready");

  loadJSON();
}

const Student = {
  firstName: '',
  middleName: '',
  lastName: '',
  nickName: '',
  gender: '',
  house: '',
  image: ''
}



function loadJSON() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(studentObj => {
    // TODO: Create new object with cleaned data - and store that in the allStudents array

    //clone the prototype object
    const student = Object.create(Student);


    // make an array with every letter of names.
    const letterArray = studentObj.fullname.trim().split('');
    console.log(letterArray);

    //if previous index is equal to '' or - make next index uppercase
    letterArray.forEach((letter, index) => {
      console.log(letter);
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
    console.log(edittedStudent);


    // find first,middle,last name
    const firstSpace = edittedStudent.indexOf(' ');
    const lastSpace = edittedStudent.lastIndexOf(' ');

    //set names
    const firstName = edittedStudent.substring(0, firstSpace);
    const middleName = edittedStudent.substring(firstSpace, lastSpace);
    const lastName = edittedStudent.substring(lastSpace);


    // find gender
    const genderStudent = studentObj.gender.trim();

    //properly capitalise gender
    const firstLetter = genderStudent.substring(0, 1);
    const restOfLetters = genderStudent.substring(1)
    const fixedGender = `${firstLetter.toUpperCase()}${restOfLetters.toLowerCase()}`

    // find house
    const houseOfStudents = studentObj.house.trim();
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


    //console.table(student);
    //push the student objects to the allstudentsArray
    allStudents.push(student);
  });

  displayList();
}

function displayList() {
  // clear the list
  document.querySelector("#main").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);

}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("#template").content.cloneNode(true);

  // set clone data   //was  student.name below
  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // clone.querySelector("[data-field=type]").textContent = student.type;
  // clone.querySelector("[data-field=age]").textContent = student.age;

  // append clone to list
  document.querySelector("#main").appendChild(clone);
}

//TODO: get student obj, append it to the main