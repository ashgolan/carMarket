//?  2)
//?  create a car Market Object
//?  fetch all data from the API and assign it to the carMarketObj
//?  add spinner to see that everything works
//?  and show message when done

//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/tax

//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers/:id
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies/:id

const spinner = document.querySelector(".spinner");
const agenciesBtn = document.querySelector("#sellers");
const customersBtn = document.querySelector("#customers");
const mainUl = document.querySelector(".mainUl");
const cardContainer = document.querySelector(".cardContainer");
const imageElement = document.createElement("img");
const bigContainer = document.querySelector(".big-container");

const handleClicks = (e) => {
  if (e.target.getAttribute("class") !== "spanImageOfCar") return;
  const model = e.target.parentElement.parentElement.getAttribute("model");
  const brand = e.target.parentElement.parentElement.getAttribute("brand");
  getCarImage(brand, model);
  imageElement.style.display = "block";
};
document.body.addEventListener("click", handleClicks);

const exitImage = () => {
  imageElement.style.display = "none";
};
let stat = {};

const arrOfUrls = [
  `https://capsules7.herokuapp.com/api/carMarket/agencies`,
  `https://capsules7.herokuapp.com/api/carMarket/customers`,
  `https://capsules7.herokuapp.com/api/carMarket/tax`,
];

const fetchData = async function (url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const getAllPromis = async function (urls) {
  const allfetches = urls.map((url) => {
    return fetchData(url);
  });
  const [sellers, customers, taxesAuthority] = await Promise.all(allfetches);
  return { sellers, customers, taxesAuthority };
};

const startup = async function () {
  spinnerShow(true);
  cardContainer.style.display = "none";
  stat = await getAllPromis(arrOfUrls);
  spinnerShow(false);
};

const spinnerShow = function (bool) {
  if (bool) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
};

const createMainCardUl = function (item) {
  const mainCardUl = document.createElement("ul");
  cardContainer.appendChild(mainCardUl);
  mainCardUl.classList.add("mainCardUl");
  mainCardUl.textContent = item;
  return mainCardUl;
};
const createBrandUl = function (brand, mainCardUl) {
  let brandUl = document.createElement("ul");
  mainCardUl.appendChild(brandUl);
  brandUl.classList.add("brandUl");
  brandUl.textContent = brand;
  return brandUl;
};
const createCarLi = function (brandUl, idNumber, brand, name) {
  let carLi = document.createElement("li");
  carLi.classList.add("carData");
  brandUl.appendChild(carLi);
  brandUl.setAttribute("id", idNumber);
  brandUl.setAttribute("brand", brand);
  brandUl.setAttribute("model", name);
  let spanImageOfCar = document.createElement("span");
  spanImageOfCar.classList.add("spanImageOfCar");
  carLi.appendChild(spanImageOfCar);
  spanImageOfCar.textContent = "📷 ";
  return carLi;
};
const createDataOfCar = function (carLi, title, data) {
  const divOfCar = document.createElement("div");
  divOfCar.classList.add("dataDiv");
  carLi.appendChild(divOfCar);
  divOfCar.textContent = title + " :" + data;
  return divOfCar;
};

const displayCustomersCars = function (fullDataInItem, mainCardUl) {
  for (let brand of fullDataInItem) {
    const brandUl = createBrandUl(brand.name, mainCardUl);
    const carLi = createCarLi(brandUl, brand.carNumber);
    for (let dataOfCar in brand) {
      createDataOfCar(carLi, dataOfCar, brand[dataOfCar]);
    }
  }
};
const displayAgenciesCars = function (fullDataInItem, mainCardUl) {
  let brandUl;
  for (let brand in fullDataInItem) {
    if (typeof fullDataInItem[brand] !== "object") {
      brandUl = createBrandUl(brand, mainCardUl);
      brandUl.textContent += " : " + fullDataInItem[brand];
    }
    if (
      fullDataInItem[brand].length > 0 &&
      typeof fullDataInItem[brand] === "object"
    ) {
      const brandUl = createBrandUl(brand, mainCardUl);
      for (let car of fullDataInItem[brand]) {
        const carLi = createCarLi(brandUl, car.carNumber, brand, car.name);
        for (let dataOfCar in car) {
          createDataOfCar(carLi, dataOfCar, car[dataOfCar]);
        }
      }
    }
  }
};

const showCard = async (data, typeofData) => {
  const fullData = await data;
  cardContainer.replaceChildren("");
  cardContainer.style.display = "flex";
  let mainCardUl;

  for (let item in fullData) {
    mainCardUl = createMainCardUl(item);
    const fullDataInItem = fullData[item];
    if (item !== "cars") {
      mainCardUl.textContent += " : " + fullDataInItem;
      if (fullDataInItem === "Dorsi Road") {
        displayAgenciesCars(fullData, mainCardUl);
        return;
      }
    } else {
      mainCardUl.textContent += " : ";
      typeofData === "customers"
        ? displayCustomersCars(fullDataInItem, mainCardUl)
        : displayAgenciesCars(fullDataInItem, mainCardUl);
    }
  }
};

const getAgencyById = async function (id) {
  const agencyData = await fetchData(
    `https://capsules7.herokuapp.com/api/carMarket/agencies/${id}`
  );
  showCard(agencyData, "sellers");
};

const getCustomerById = async (id) => {
  const customerData = await fetchData(
    `https://capsules7.herokuapp.com/api/carMarket/customers/${id}`
  );
  showCard(customerData, "customers");
};

const searchForResaults = function (e) {
  const res = e.target.parentElement.id;
  if (res === "sellers") getAgencyById(e.target.id);
  else getCustomerById(e.target.id);
};

const showAList = function (e) {
  cardContainer.style.display = "none";
  if (mainUl) mainUl.replaceChildren("");
  const id = e.target.getAttribute("id");
  mainUl.classList.add("mainUl");
  for (let item of stat[id]) {
    const li = document.createElement("li");
    if (id === "sellers") {
      li.textContent = item.agencyName;
      li.setAttribute("id", item.agencyId);
      mainUl.setAttribute("id", "sellers");
    } else {
      li.textContent = item.name;
      li.setAttribute("id", item.id);
      mainUl.setAttribute("id", "customers");
    }
    mainUl.appendChild(li);
  }

  mainUl.addEventListener("click", searchForResaults);
};

const events = function () {
  agenciesBtn.addEventListener("click", showAList);
  customersBtn.addEventListener("click", showAList);
  imageElement.addEventListener("click", exitImage);
};

async function getCarImage(brand, model) {
  try {
    const imgUrl = await fetch(
      `https://capsules7.herokuapp.com/api/carMarket/img/${brand}/${model}`
    );
    const url = imgUrl.url;
    const img = await fetch(url);
    const imageInfo = await img.json();
    imageElement.classList.add("car-image");
    imageElement.src = `${imageInfo.image}`;
    document.body.append(imageElement);
  } catch (e) {
    console.log("car image isn't available");
  }
}
// getCarImage("Chevrolet", "Malibu");
startup();
events();

//? 3)
//? Create two button on the screen "Customers" "Agencies"
//? When the user clicks the button display a list of Customers / Agencies names
//? Only one list can be presented at a time

//? 4)
//? When the user clicks on single name of a Customer / Agency
//? Show over the screen a card with all the data of that particular Customer / Agency

//? 5)
//? When the user clicks on get image of the car fetch the car image and display another card with the image.
//! but what if i did no get the image ?????

//? ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// https://capsules7.herokuapp.com/api/carMarket/img/':brand'/:model

//! Questions we should ask ourselves:
//! Where functions can be combined into one function?
//! Am I holding unnecessary information in the client's browser?
//! Why did I choose to call the API the way I did?

//* You can divide the work inside the capsule and share the responsibility
//* Separate the functions of logic and The functions related to HTML
//* Don't mess with the design (CSS)
