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

function start() {
  console.log("ready");

  //   registerButtons();
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  console.log(allStudents);
  jsonData.forEach((jsonObject) => {
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
  });
  // sort on the first load!
  // buildList();
}
