const choise =  process.argv[2].toLowerCase() 
const num =  process.argv[3] 
const pc = Math.floor(Math.random() * 11)

if( choise === 'par' && (+num + pc) % 2 === 0 || choise === 'impar' && (+num + pc) % 2 === 1) {
    console.log(`Você escolheu ${choise} e o computador escolheu ${choise === 'par' ? 'impar' : 'par'}. o Resultado foi ${+num + pc}. Você ganhou!`)
} else {
    console.log(`Você escolheu ${choise} e o computador escolheu ${choise === 'par' ? 'impar' : 'par'}. o Resultado foi ${+num + pc}. Você perdeu!`)
}