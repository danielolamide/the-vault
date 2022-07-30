import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000));
const accBob = await stdlib.newTestAccount(startingBalance);

const getBalanceOf = async (who) => stdlib.formatCurrency(await stdlib.balanceOf(who));

console.log(`Alice's balance before is ${await getBalanceOf(accAlice)}`);
console.log(`Bob's balance before is ${await getBalanceOf(accBob)}`);

const Shared = {
	showTime : (time) => {
		console.log((parseInt(time)));
	}
}

const choiceArray = [
	"Not here ",
	"I'm here"
]

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    // implement Alice's interact object here
		...Shared,
		inherit : stdlib.parseCurrency(5000),
		getChoice : () => {
			const choice = Math.floor(Math.random() * 2);
			console.log(`Alice choice is ${choiceArray[choice]}`);
			return choice === 0 ? false : true
		}
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
		...Shared,
		acceptTerms : (num) => {
			console.log(`Bob accepts terms of the vault ${stdlib.formatCurrency(num)}`)
			return true;
		},
  }),
]);

console.log(`Alice's balance after is ${await getBalanceOf(accAlice)}`);
console.log(`Bob's balance after is ${await getBalanceOf(accBob)}`);
console.log('Goodbye, Alice and Bob!');
