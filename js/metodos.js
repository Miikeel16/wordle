let filasInputs = [];
for (let i = 1; i <= 5; i++) {
    filasInputs[i] = document.querySelectorAll(`.fila${i}`);
}

let filaActual = 1;

for (let i = 1; i <= 5; i++) {
    let inputs = filasInputs[i];

    for (let i = 0; i < inputs.length; i++) {

        inputs[i].addEventListener('input', function () {

            this.value = this.value.replace(/[^A-Za-zñÑ]/g, '').toUpperCase();

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


// ---------------------------
//  Metodo de CHATGPT
//  Generar variantes con tildes (POR QUE NO ME ACEPTABA PALABRAS CON TILDES Y NO SABIA HACERLO)
// ---------------------------
function generarVariantesConTildes(palabra) {
    const map = {
        A: ["A", "Á"],
        E: ["E", "É"],
        I: ["I", "Í"],
        O: ["O", "Ó"],
        U: ["U", "Ú"]
    };

    let variantes = [""];

    for (let letra of palabra) {
        letra = letra.toUpperCase();

        if (map[letra]) {
            let nuevas = [];
            for (let base of variantes) {
                for (let alt of map[letra]) {
                    nuevas.push(base + alt);
                }
            }
            variantes = nuevas;
        } else {
            variantes = variantes.map(v => v + letra);
        }
    }

    return variantes;
}

async function comprobarPalabraRAE(palabra) {

    const variantes = generarVariantesConTildes(palabra);

    for (const variante of variantes) {
        try {
            const res = await fetch(`http://localhost:3000/comprobar/${variante}`);
            const data = await res.json();
            console.log("Probando:", variante, "Resultado:", data.ok);

            if (data.ok === true) {
                return true;
            }
        } catch (e) {
            console.log("Error probando variante", variante);
        }
    }

    return false;
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

async function validarPalabra(palabra, inputs) {
    const esValida = await comprobarPalabraRAE(palabra);

    if (esValida) {
        colorFila(inputs, palabraAleatoria);

        if (palabraAleatoria == palabra) {
            alert("Has acertado la palabra era: " + palabraAleatoria);
            location.reload();
            limpiarFilas();
            filaActual = 1;
        } else {
            bloquearFila(inputs);
            filaActual++;
            if (filaActual <= 5) {
                focusFila(filaActual);
            } else {
                alert("Has perdido la palabra era: " + palabraAleatoria);
                location.reload();
                limpiarFilas();
                filaActual = 1;
            }
        }
    } else {
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
function teclasBotones() {
    const teclado = document.querySelector('.teclas');
    teclado.addEventListener('click', function(e) {
        if(e.target.tagName === 'BUTTON') {
            const letra = e.target.textContent.toUpperCase();
            const inputs = filasInputs[filaActual];
            for(let i = 0; i < inputs.length; i++) {
                if(inputs[i].value === "") {
                    inputs[i].value = letra;
                    if(i < inputs.length - 1) {
                        inputs[i+1].focus();
                    } else {
                        inputs[i].focus();
                    }
                    break;
                }
            }
        }
    });
}

teclasBotones()

//SI RECARGO LA PAGINA SE BORRAN LOS INPUT:
window.addEventListener('load', () => {
    limpiarFilas();
});