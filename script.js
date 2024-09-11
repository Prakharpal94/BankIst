'use strict';

// DATA
const account1 = {
  owner: 'Prakhar pal',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  intrestRate: 1.2, //%
  pin: 1111,

  movementsDates: [
    '2024-05-08T21:31:17.178Z',
    '2024-05-07T07:42:02.383Z',
    '2024-05-06T09:15:04.904Z',
    '2024-05-05T10:17:24.185Z',
    '2024-05-04T14:11:59.604Z',
    '2024-05-03T17:01:17.194Z',
    '2024-05-02T23:36:17.929Z',
    '2024-05-01T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Priyanshi Rawat',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  intrestRate: 1.5, //%
  pin: 2222,

  movementsDates: [
    '2024-05-08T21:31:17.178Z',
    '2024-05-07T07:42:02.383Z',
    '2024-05-06T09:15:04.904Z',
    '2024-05-05T10:17:24.185Z',
    '2024-05-04T14:11:59.604Z',
    '2024-05-03T17:01:17.194Z',
    '2024-05-02T23:36:17.929Z',
    '2024-05-01T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account3 = {
  owner: 'Alankrit Prakesh Shukla',
  movements: [5000, 3400, -50, 508, -3210, 100, 8500, -30],
  intrestRate: 1.5, //%
  pin: 3333,

  movementsDates: [
    '2024-05-08T21:31:17.178Z',
    '2024-05-07T07:42:02.383Z',
    '2024-05-06T09:15:04.904Z',
    '2024-05-05T10:17:24.185Z',
    '2024-05-04T14:11:59.604Z',
    '2024-05-03T17:01:17.194Z',
    '2024-05-02T23:36:17.929Z',
    '2024-05-01T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // Function sorting
  const movs = sort ? movements.slice().sort((a, b) => a -b) : movements 

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}INR</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Printing Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} INR`;
};

// SumIn or SumOut
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} INR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} INR`;

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.intrestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest}`;
};

// Computing username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display and Movements
  displayMovements(acc.movements);
  // Display and Blance
  calcDisplayBalance(acc);
  // Display and Summary
  calcDisplaySummary(acc);
};

// Event Hendlear
// Login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display and UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// Implement Transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiveAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Loan button
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})

// Close Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Inplement sorting
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
// last topic sorting array