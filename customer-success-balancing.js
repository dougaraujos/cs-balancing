/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  // get available customer success
  const availableCS = customerSuccess
    .filter(({ id }) => !customerSuccessAway.includes(id))
    .sort((a, b) => a.score - b.score);

  // get ordered list with customer scores
  let customerScores = customers.map(({ score }) => score).sort((a, b) => a - b);

  // create balancer to record the number of customers per customer success
  const balancer = new Map();

  // balance service load between customer success by score
  availableCS.map(({ id, score }) => {
    // get total customers by score
    const total = getTotalCustomers(customerScores, score);

    // set total customers to active customer success
    balancer.set(id, total);

    // remove customers score that have already been balanced
    customerScores.splice(0, total);
  });

  // no active customer success: return 0
  if (!balancer.size) return 0;

  // create active customer success array from balancer map
  const activeCS = Array.from(balancer, ([id, total]) => ({ id, total }))

  // get first and second most overloaded customer success
  const [first = {}, second = {}] = activeCS.sort((a, b) => b.total - a.total);

  // return 0 if the first and the second total are the same or return first id
  return first.total === second.total ? 0 : first.id;
}


/**
 * Returns the amount of elements less than or equal to a value
 * @param {array}  list
 * @param {number} value
 * @param {number} start
 * @param {number} end
 */
function binarySearch(list, value, start = 0, end = 0) {
  // end unavailable: set end to the last list index
  if (!end) end = list.length - 1;

  // binary search
  while (start <= end) {
    // get the list middle
    let middle = Math.floor((start + end) / 2);

    // value is less than or equal to middle value: search from the next index
    if (list[middle] <= value) start = middle + 1;

    // search up to the previous index
    else end = middle - 1;
  }

  // return amount
  return end + 1;
}


/**
 * Returns the number of Customers to be served by a CustomerSuccess
 * @param {array}  scores
 * @param {number} score
 */
function getTotalCustomers(scores, score) {
  // get total and last index
  const total = scores.length;
  const lastIndex = total - 1;

  // score is higher than the last score: return total
  if (score > scores[lastIndex]) return total;

  // return total from binary search
  return binarySearch(scores, score);
}


test("Scenario 1", () => {
  css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function buildCsAway(size) {
  const result = [];
  for (let i = 0; i < size;) {
    result.push(++i);
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

test("Scenario 2", () => {
  css = mapEntities([11, 21, 31, 3, 4, 5]);
  customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  css = buildSizeEntities(1000, 0);
  css[998].score = 100;
  customers = buildSizeEntities(10000, 10);


  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(999);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  css = mapEntities([1, 2, 3, 4, 5, 6]);
  customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  css = mapEntities([100, 2, 3, 3, 4, 5]);
  customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  css = mapEntities([100, 99, 88, 3, 4, 5]);
  customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  css = mapEntities([100, 99, 88, 3, 4, 5]);
  customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});
