const BASE_URL = `https://flyapi.onrender.com/`;
const airline = 'delta';
const airportCodes = [
  {
    origin: 'LIS',
    destination: 'NYC',
  },
  {
    origin: 'TLV',
    destination: 'BER',
  },
  {
    origin: 'ARN',
    destination: 'LHR',
  },
];

const endPoint = (flight) => {
  return `${BASE_URL}${flight.origin.toLowerCase()}_${flight.destination.toLowerCase()}/${airline}`;
};

const getFilghtsJson = async () => {
  const responses = await Promise.all(
    airportCodes
      .filter((flight) => endPoint(flight))
      .map(async (flight) => {
        const response = await fetch(endPoint(flight));
        const dataJson = await response.json();
        [dataJson.origin, dataJson.destination] = [
          flight.origin,
          flight.destination,
        ];
        return dataJson;
      })
  );
  return responses;
};

const createDOM = (data) => {
  const searchEl = document.createElement('div');
  const logoEl = document.createElement('img');
  const deltaEl = document.querySelector('#delta');
  const routeEl = document.createElement('p');
  const priceEl = document.createElement('p');
  logoEl.setAttribute('src', 'https://logo.clearbit.com/delta.com');
  const { price, origin, destination } = data;
  priceEl.textContent = `$${price}`;
  routeEl.textContent = `${origin} ${destination}`;

  // layout and styling
  searchEl.style.cssText = 'display:flex; gap:1rem';
  logoEl.style.cssText = 'width:40px; height:40px';
  priceEl.style.fontWeight = '600';
  searchEl.append(logoEl, routeEl, priceEl);
  deltaEl.appendChild(searchEl);
};

const getFlightDataAndCreateDom = async (flightJsons) => {
  flightJsons = await getFilghtsJson();
  flightJsons.forEach((flightJson) => {
    createDOM(flightJson);
  });
};

getFlightDataAndCreateDom();
