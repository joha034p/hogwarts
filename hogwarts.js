"use strict";
window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

// the prototype for all students:
const Student = {
  firstName: "",
  midName: "",
  lastName: "",
  house: "",
};

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  console.log("ready");
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

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preparedObject);

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
  student.firstName = firstCap + firstLower;

  if (txtLength > 2) {
    const midCap = txtSplit[1].substring(0, 1).toUpperCase();
    const midLower = txtSplit[1].substring(1).toLowerCase();
    student.midName = midCap + midLower;
  }

  const getLastName = trimName.substring(trimName.lastIndexOf(" ") + 1);
  const lastCap = getLastName.substring(0, 1).toUpperCase();
  const lastLower = getLastName.substring(1).toLowerCase();
  student.lastName = lastCap + lastLower;

  const trimHouse = jsonObject.house.trim();
  const houseCap = trimHouse.substring(0, 1).toUpperCase();
  const houseLower = trimHouse.substring(1).toLowerCase();
  student.house = houseCap + houseLower;
  console.log(student);
  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // Create a filtered list of only gryffindor/slytherin/ravenclaw/hufflepuff
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
  return student.house === "gryffindor";
}

function isSlytherin(student) {
  console.log("isSlytherin");
  return student.house === "slytherin";
}

function isRavenclaw(student) {
  console.log("isRavenclaw");
  return student.house === "ravenclaw";
}

function isHufflepuff(student) {
  console.log("isHufflepuff");
  return student.house === "hufflepuff";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //   Find old sortBy element, and remove .sortBy
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
  console.log(`User selected ${sortBy} - ${sortDir}`);
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

  function sortByProperty(animalA, animalB) {
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
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
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  //   clone.querySelector("[data-field=midname]").textContent = student.midName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //   append clone to list
  document.querySelector("#student_list").appendChild(clone);
}
