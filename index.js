const axios = require('axios');

const cookie = "your_cookie";

const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'cookie': cookie,
    'origin': 'https://stake.com',
    'priority': 'u=1, i',
    'referer': 'https://stake.com/casino/games/dice',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '"126.0.6478.182"',
    'sec-ch-ua-full-version-list': '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.182", "Google Chrome";v="126.0.6478.182"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"15.0.0"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'x-access-token': '97da176d82ee318f9d39ea1083094945e31def5888a5ceabf5ad9fc44dd2235b2e1d9f514e6bef8c23f91a9f78a6777a',
    'x-lockdown-token': 's5MNWtjTM5TvCMkAzxov'
};

const data = (amount) => ({
    "query": "mutation DiceRoll($amount: Float!, $target: Float!, $condition: CasinoGameDiceConditionEnum!, $currency: CurrencyEnum!, $identifier: String!) {\n  diceRoll(\n    amount: $amount\n    target: $target\n    condition: $condition\n    currency: $currency\n    identifier: $identifier\n  ) {\n    ...CasinoBet\n    state {\n      ...CasinoGameDice\n    }\n  }\n}\n\nfragment CasinoBet on CasinoBet {\n  id\n  active\n  payoutMultiplier\n  amountMultiplier\n  amount\n  payout\n  updatedAt\n  currency\n  game\n  user {\n    id\n    name\n  }\n}\n\nfragment CasinoGameDice on CasinoGameDice {\n  result\n  target\n  condition\n}\n",
    "variables": {
        "target": 50.5,
        "condition": "above",
        "identifier": "83MM-Z6ShnBVx7ByQz8Lk",
        "amount": amount,
        "currency": "inr"
    }
});

async function sendRequest(amount) {
    try {
        const response = await axios.post('https://stake.com/_api/graphql', data(amount), { headers });
        return response.data.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function main() {
    const defaultAmount = 5;
    let amount = defaultAmount;
    let lossesInARow = 0;
    let numberOfBets = 0;
    while(1) {
        console.log(`Betting ${amount}`)
        console.log(`Losses in a row: ${lossesInARow}`);
        console.log(`Number of bets: ${numberOfBets++}`);
        try {
            const response = await sendRequest(amount);
            if (response.diceRoll.state.result < 50.5) {
                console.log(`Lost`)
                lossesInARow++;
                amount = amount * 2;
            } else {
                console.log(`Won`)
                lossesInARow = 0;
                amount = defaultAmount;
            }
            await new Promise(resolve => setTimeout(resolve, 10));
            if (lossesInARow >= 8) {
                console.log("Stopping")
                process.exit(0);
            }
        } catch (e) {
            // console.log("Error came");
        }
    }
}

main();
