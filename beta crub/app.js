// Seleccionar elementos del DOM
const createForm = document.getElementById('create-form');
const carBrandInput = document.getElementById('car-brand');
const carModelInput = document.getElementById('car-model');
const carYearInput = document.getElementById('car-year');
const carCostInput = document.getElementById('car-cost');
const carStartDateInput = document.getElementById('car-start-date');
const carEndDateInput = document.getElementById('car-end-date');
const carTypeInput = document.getElementById('car-type');
const carsList = document.getElementById('cars-list');
const searchBrandInput = document.getElementById('search-brand');
const searchModelInput = document.getElementById('search-model');
const filterTypeInput = document.getElementById('filter-type');
const filterYearInput = document.getElementById('filter-year');
const filterMinPriceInput = document.getElementById('filter-min-price');
const filterMaxPriceInput = document.getElementById('filter-max-price');
const filterStartDateInput = document.getElementById('filter-start-date');
const filterEndDateInput = document.getElementById('filter-end-date');
const applyFiltersButton = document.getElementById('apply-filters');

// Cargar carros al iniciar
document.addEventListener('DOMContentLoaded', loadCars);

// Función para calcular los días restantes
function calcularDiasRestantes(fechaFin) {
  const fechaActual = new Date(); // Fecha actual
  const fechaFinal = new Date(fechaFin); // Fecha de finalización de la renta
  const diferencia = fechaFinal - fechaActual; // Diferencia en milisegundos
  const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24)); // Convertir a días
  return diasRestantes >= 0 ? diasRestantes : 0; // Retornar 0 si ya pasó la fecha
}

// Función para cargar carros desde localStorage
function loadCars() {
  const cars = getCarsFromStorage();
  renderCars(cars);
}

// Función para obtener carros desde localStorage
function getCarsFromStorage() {
  return JSON.parse(localStorage.getItem('cars')) || [];
}

// Función para guardar carros en localStorage
function saveCarsToStorage(cars) {
  localStorage.setItem('cars', JSON.stringify(cars));
}

// Función para agregar un carro
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const brand = carBrandInput.value.trim();
  const model = carModelInput.value.trim();
  const year = parseInt(carYearInput.value.trim());
  const cost = parseFloat(carCostInput.value.trim());
  const startDate = carStartDateInput.value;
  const endDate = carEndDateInput.value;
  const type = carTypeInput.value;

  if (brand && model && !isNaN(year) && !isNaN(cost) && startDate && endDate && type) {
    const cars = getCarsFromStorage();
    cars.push({ brand, model, year, cost, startDate, endDate, type });
    saveCarsToStorage(cars);
    carBrandInput.value = ''; // Limpiar inputs
    carModelInput.value = '';
    carYearInput.value = '';
    carCostInput.value = '';
    carStartDateInput.value = '';
    carEndDateInput.value = '';
    carTypeInput.value = '';
    loadCars(); // Recargar tabla
  } else {
    alert('Por favor, completa todos los campos correctamente.');
  }
});

// Función para borrar un carro
function deleteCar(index) {
  const cars = getCarsFromStorage();
  cars.splice(index, 1); // Eliminar carro
  saveCarsToStorage(cars);
  loadCars(); // Recargar tabla
}

// Función para editar un carro
function editCar(index) {
  const cars = getCarsFromStorage();
  const car = cars[index];
  const newBrand = prompt('Editar marca:', car.brand);
  const newModel = prompt('Editar modelo:', car.model);
  const newYear = parseInt(prompt('Editar año:', car.year));
  const newCost = parseFloat(prompt('Editar costo:', car.cost));
  const newStartDate = prompt('Editar inicio de renta:', car.startDate);
  const newEndDate = prompt('Editar fin de renta:', car.endDate);
  const newType = prompt('Editar tipo (deportivo/camioneta/suv):', car.type);

  if (newBrand && newModel && !isNaN(newYear) && !isNaN(newCost) && newStartDate && newEndDate && newType) {
    cars[index] = { brand: newBrand, model: newModel, year: newYear, cost: newCost, startDate: newStartDate, endDate: newEndDate, type: newType };
    saveCarsToStorage(cars);
    loadCars(); // Recargar tabla
  } else {
    alert('Por favor, completa todos los campos correctamente.');
  }
}

// Función para aplicar filtros
applyFiltersButton.addEventListener('click', () => {
  const cars = getCarsFromStorage();
  const filteredCars = cars.filter(car => {
    // Filtro por marca
    const matchesBrand = car.brand.toLowerCase().includes(searchBrandInput.value.toLowerCase());

    // Filtro por modelo
    const matchesModel = car.model.toLowerCase().includes(searchModelInput.value.toLowerCase());

    // Filtro por tipo
    const matchesType = filterTypeInput.value ? car.type === filterTypeInput.value : true;

    // Filtro por año
    const matchesYear = filterYearInput.value ? car.year === parseInt(filterYearInput.value) : true;

    // Filtro por rango de precios
    const minPrice = parseFloat(filterMinPriceInput.value) || 0;
    const maxPrice = parseFloat(filterMaxPriceInput.value) || Infinity;
    const matchesPrice = car.cost >= minPrice && car.cost <= maxPrice;

    // Filtro por disponibilidad (fechas)
    const filterStartDate = filterStartDateInput.value ? new Date(filterStartDateInput.value) : null;
    const filterEndDate = filterEndDateInput.value ? new Date(filterEndDateInput.value) : null;
    const carStartDate = new Date(car.startDate);
    const carEndDate = new Date(car.endDate);

    let matchesDates = true;
    if (filterStartDate && filterEndDate) {
      matchesDates = (carStartDate <= filterEndDate) && (carEndDate >= filterStartDate);
    }

    return matchesBrand && matchesModel && matchesType && matchesYear && matchesPrice && matchesDates;
  });

  renderCars(filteredCars);
});

// Función para renderizar carros
function renderCars(cars) {
  carsList.innerHTML = '';
  cars.forEach((car, index) => {
    const row = document.createElement('tr');
    const diasRestantes = calcularDiasRestantes(car.endDate); // Calcular días restantes
    row.innerHTML = `
      <td>${car.brand}</td>
      <td>${car.model}</td>
      <td>${car.year}</td>
      <td>$${car.cost}</td>
      <td>${car.startDate}</td>
      <td>${car.endDate}</td>
      <td>${diasRestantes} días</td>
      <td>${car.type === 'deportivo' ? 'Deportivo' : car.type === 'camioneta' ? 'Camioneta' : 'SUV'}</td>
      <td>
        <button class="edit" onclick="editCar(${index})">Editar</button>
        <button class="delete" onclick="deleteCar(${index})">Borrar</button>
      </td>
    `;
    carsList.appendChild(row);
  });
}