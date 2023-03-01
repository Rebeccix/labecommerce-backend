const player = process.argv[2].toLowerCase();
const pc = Math.floor(Math.random() * 3);
let playerHand = 0;
let pcHand = ''

switch (player) {
  case "pedra":
    playerHand = 0;
    break;
  case "tesoura":
    playerHand = 1;
    break;
  case "papel":
    playerHand = 2;
    break;
    default:
    break;
}

switch (pc) {
    case 0:
        pcHand = "pedra";
      break;
    case 1:
        pcHand = "tesoura";
      break;
    case 2:
        pcHand = "papel";
      break;
}

if (player === 'papel' && pcHand === 'pedra' || player === 'tesoura' && pcHand === 'papel' || player === 'pedra' && pcHand === 'tesoura') {
    console.log(`Você escolheu ${player} e o computador escolheu ${pcHand}. Win!`)
} else if ( player === 'tesoura' && pcHand === 'pedra' || player === 'pedra' && pcHand === 'papel' || player === 'papel' && pcHand === 'tesoura') {
    console.log(`Você escolheu ${player} e o computador escolheu ${pcHand}. Loss!`)
} else {
    console.log(`Você escolheu ${player} e o computador escolheu ${pcHand}. empate!`)
}