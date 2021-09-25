"use strict";
window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = [];

let bloodData;

// the prototype for all students:
const Student = {
  picture: "",
  firstName: "",
  midName: "",
  lastName: "",
  house: "",
  bloodType: "",
  expelled: "Not expelled",
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

function start() {
  console.log("function 'start' ready");
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("mousedown", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("mousedown", selectSort));
}

async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();

  const response2 = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  const jsonData2 = await response2.json();

  // store bloodtype data in global variable
  bloodData = jsonData2;

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(studentData) {
  allStudents = studentData.map(preparedObject);
  // sort on the first load!
  buildList();
}

function preparedObject(jsonObject) {
  // new object with cleaned data - store that in the global array
  const student = Object.create(Student);
  let trimName = jsonObject.fullname.trim();
  let txtSplit = trimName.split(" ");
  let txtLength = txtSplit.length;

  const firstCap = txtSplit[0].substring(0, 1).toUpperCase();
  const firstLower = txtSplit[0].substring(1).toLowerCase();
  const fixedFirst = firstCap + firstLower;
  student.firstName = fixedFirst;

  if (txtLength > 2) {
    const midCap = txtSplit[1].substring(0, 1).toUpperCase();
    const midLower = txtSplit[1].substring(1).toLowerCase();
    const fixedMid = midCap + midLower;
    student.midName = fixedMid;
  }

  const getLastName = trimName.substring(trimName.lastIndexOf(" ") + 1);
  const lastCap = getLastName.substring(0, 1).toUpperCase();
  const lastLower = getLastName.substring(1).toLowerCase();
  const fixedLast = lastCap + lastLower;
  student.lastName = fixedLast;

  const trimHouse = jsonObject.house.trim();
  const houseCap = trimHouse.substring(0, 1).toUpperCase();
  const houseLower = trimHouse.substring(1).toLowerCase();
  const fixedHouse = houseCap + houseLower;
  student.house = fixedHouse;

  // function that defines each student's blood type
  preparedBlood(student, bloodData);
  function preparedBlood(student, bloodData) {
    const halfBloods = bloodData.half;
    if (halfBloods.includes(student.lastName)) {
      student.bloodType = "Half-Blood";
    } else {
      student.bloodType = "Pure-Blood";
    }
  }

  //    preparedPictures(student);
  //    function preparedPictures(student) {
  //   IF the student's lastname + "_" + firstname's first character + ".png" === /images/filename
  //   THEN student.picture = /images/-thispngfile-
  //   }

  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`Filter by: ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // create a filtered list of only gryffindor/slytherin/ravenclaw/hufflepuff
  // also show count of students on each filter
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  }
  return filteredList;
}

function isGryffindor(student) {
  console.log("isGryffindor");
  const countGryf = allStudents.filter((student) => student.house === "Gryffindor").length;
  document.querySelector("#student_count").textContent = `Showing ${countGryf} students`;
  return student.house === "Gryffindor";
}

function isSlytherin(student) {
  console.log("isSlytherin");
  const countSlyth = allStudents.filter((student) => student.house === "Slytherin").length;
  document.querySelector("#student_count").textContent = `Showing ${countSlyth} students`;
  return student.house === "Slytherin";
}

function isRavenclaw(student) {
  console.log("isRavenclaw");
  const countRav = allStudents.filter((student) => student.house === "Ravenclaw").length;
  document.querySelector("#student_count").textContent = `Showing ${countRav} students`;
  return student.house === "Ravenclaw";
}

function isHufflepuff(student) {
  console.log("isHufflepuff");
  const countHuf = allStudents.filter((student) => student.house === "Hufflepuff").length;
  document.querySelector("#student_count").textContent = `Showing ${countHuf} students`;
  return student.house === "Hufflepuff";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //   Find old sortBy element, and remove .sortby
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  //   Indicate active sort
  event.target.classList.add("sortby");

  // Toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`Sort by: ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

function displayList(students) {
  // clear the list
  document.querySelector("#student_list").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
  document.querySelector("#show_expelled").addEventListener("mousedown", displayExpelled);
}

// function that only displays expelled students
function displayExpelled() {
  document.querySelector("#student_list").innerHTML = "";
  expelledStudents.forEach(displayStudent);
  const expelledLen = expelledStudents.length;
  document.querySelector("#student_count").textContent = `Showing ${expelledLen} students`;
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=fullname]").textContent = `${student.firstName} ${student.midName} ${student.lastName}`;
  clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
  if (student.expelled === "Expelled") {
    clone.querySelector("[data-field=expelled]").textContent = student.expelled;
  }
  clone.querySelector("#article").addEventListener("mousedown", showPopUp);

  //   function that shows popup info about each student
  function showPopUp() {
    document.querySelector("#popup_window").classList.remove("hide");
    document.querySelector("#student_info [data-field=popup_fullname]").textContent = `${student.firstName} ${student.midName} ${student.lastName}`;
    document.querySelector("#student_info [data-field=popup_house]").textContent = `House: ${student.house}`;
    document.querySelector("#student_info [data-field=popup_bloodtype]").textContent = `Blood type: ${student.bloodType}`;
    if (student.expelled === "Expelled") {
      document.querySelector("#student_info [data-field=expelled]").textContent = student.expelled;
    }
    document.querySelector("#closebutton").addEventListener("mousedown", closePopUp);
    document.querySelector("#button_expel").addEventListener("mousedown", clickExpel);
  }

  function closePopUp() {
    document.querySelector("#popup_window").classList.add("hide");
  }

  //  function that changes "expelled" status
  //  also removes the student from the list array
  //  and adds them to the expelledStudents array
  function clickExpel() {
    console.log("click expel");
    let findStudent = allStudents.indexOf(student);
    let currentStudent = allStudents[findStudent];
    if (student.expelled === "Not expelled") {
      student.expelled = `Expelled`;
      console.log(`${currentStudent.firstName} is expelled`);
      console.log(expelledStudents);
      expelledStudents.push(currentStudent);
      allStudents.splice(findStudent, 1);
      closePopUp();
    }
    buildList();
  }

  //   NOT DONE! SHOW COUNT OF STUDENTS ON FIRST LOAD
  //   studentCount();
  //   function studentCount() {
  //     const studentLen = allStudents.length;
  //     document.querySelector("#student_count").textContent = `Showing ${studentLen} students`;
  //   }

  //   houseColors(student);

  //   append clone to list
  document.querySelector("#student_list").appendChild(clone);
}

// function houseColors(student) {
//   const article = document.querySelector("#article");
//   if (student.house === "Gryffindor") {
//     article.classList.add("gryffindor_color");
//   }
//   if (student.house === "Slytherin") {
//     article.classList.add("slytherin_color");
//   }
//   if (student.house === "Ravenclaw") {
//     article.classList.add("ravenclaw_color");
//   }
//   if (student.house === "Hufflepuff") {
//     article.classList.add("hufflepuff_color");
//   }
// }
