let filasInputs = [];
for (let i = 1; i <= 5; i++) {
    filasInputs[i] = document.querySelectorAll(`.fila${i}`);
}

let filaActual = 1;

for (let i = 1; i <= 5; i++) {
    let inputs = filasInputs[i];

    for (let i = 0; i < inputs.length; i++) {

        inputs[i].addEventListener('input', function () {

            this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();

            if (this.value !== '' && i < inputs.length - 1) {
                inputs[i + 1].focus();
            }
        });

        inputs[i].addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value === '' && i > 0) {
                inputs[i - 1].focus();
            }
            if (e.key === 'Enter' && filaCompleta(inputs) && filasInputs[filaActual] === inputs) {
            unirPalabra(inputs);
            }
        });
    }
}

// const palabrasValidas = ["PERRO","HUEVO", "RATON"];
// const palabraAleatoria = palabrasValidas[Math.floor(Math.random() * palabrasValidas.length)];

//LLAMAR A LA API DEL WORDLE
let palabraAleatoria = "";

fetch("https://random-word-api.herokuapp.com/word?number=1&length=5&lang=es")
  .then(res => res.json())
  .then(data => {
    palabraAleatoria = data[0].toUpperCase();
  })
  .catch(err => console.error("Error al obtener palabra:", err));
//LLAMAR A LA API DE LA RAE

async function comprobarPalabraRAE(palabra) {
    try {
        const res = await fetch(`https://rae-api.com/api/words/${palabra}`);
        if (!res.ok) {
            return false;
        }
        const data = await res.json();
        return data && data.word ? true : false;
    } catch (err) {
        return false;
    }
}
//FUNCIONES 

function filaCompleta(inputs){
    for(let i = 0; i < inputs.length; i++){
        if (inputs[i].value==="") return false;
    }
    return true;
}

function unirPalabra(inputs){
    let palabra="";
    for(let i = 0; i<inputs.length;i++){
        palabra+=inputs[i].value;
    }
    validarPalabra(palabra, inputs);
}

function validarPalabra(palabra, inputs){
    if(comprobarPalabraRAE(palabra)){
        colorFila(inputs, palabraAleatoria);

        if(palabraAleatoria==palabra){
            alert("Has acertado la palabra era: "+palabraAleatoria);
            location.reload();
            limpiarFilas();
            filaActual = 1;
        }else{
            bloquearFila(inputs);
            filaActual++;
            if(filaActual <= 5){
                focusFila(filaActual);
            }else{
                alert("Has perdido la palabra era: "+palabraAleatoria);
                location.reload();
                limpiarFilas();
                filaActual = 1;
            }
        }
    }else{
        alert("Palabra no valida");
    }
}

function limpiarFilas() {
    const inputs = document.querySelectorAll('table input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
        inputs[i].disabled = false;
        inputs[i].style.backgroundColor = '';
        inputs[i].style.color = '';
    }
}

function bloquearFila(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

function colorFila(inputs, palabra){
    for(let i = 0; i < inputs.length ; i++){
        let letra= inputs[i].value;
        if(letra===palabra[i]){
            inputs[i].style.backgroundColor = "rgb(106, 172, 100)";
            inputs[i].style.color = "white";
        }else if (palabra.includes(letra)){
            inputs[i].style.backgroundColor = "rgb(202, 181, 87)";
            inputs[i].style.color = "white";
        }else{
            inputs[i].style.backgroundColor = "rgb(121, 125, 127)";
            inputs[i].style.color = "white";
        }
    }
}

// función de foco en filaActual
function focusFila(numFila){
    const inputs = filasInputs[numFila];
    for(let i = 0; i < inputs.length; i++){
        if(!inputs[i].disabled){
            inputs[i].focus();
            break;
        }
    }
}

//