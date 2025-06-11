document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start");
    const inicial = document.getElementById("inicial");
    const quantidade = document.getElementById("quantidade");
    const btnNext = document.getElementById('next');
    const players = document.querySelector('.players');
    const sorted = document.getElementById("sorted");

    startBtn.addEventListener("click", () => {
        inicial.classList.add("hidden");
        setTimeout(() => {
            quantidade.classList.add("show");
        }, 600);
    });

    btnNext.addEventListener('click', function () {
        const inpTime = parseInt(document.getElementById('times').value);
        const inpJog = parseInt(document.getElementById('jogPerTime').value);

        if (isNaN(inpTime) || isNaN(inpJog) || inpTime < 2 || inpJog < 3) {
            alert("Mínimo de 2 times e 3 jogadores por time!");
            return;
        }

        quantidade.classList.remove("show");
        quantidade.classList.add('hidden');

        setTimeout(() => {
            players.classList.add("show");
        }, 600);

        for (let i = 1; i <= (inpTime * inpJog); i++) {
            const createJog = document.createElement('input');
            createJog.type = 'text';
            createJog.placeholder = 'Nome do jogador';
            createJog.className = 'dinamic-jog-input';

            const selectHability = document.createElement('select');
            selectHability.className = 'dinamic-hability';
            [1, 2, 3, 4, 5].forEach(v => {
                const opt = document.createElement('option');
                opt.id = 'options';
                opt.value = v;
                opt.innerText = ['Muito Ruim', 'Ruim', 'Médio', 'Bom', 'Muito Bom'][v - 1];
                selectHability.appendChild(opt);
            });

            const selectPosition = document.createElement('select');
            selectPosition.className = 'dinamic-position';
            ['defesa', 'meio', 'ataque'].forEach(pos => {
                const opt = document.createElement('option');
                opt.id = 'optionsPositions';
                opt.value = pos;
                opt.innerText = pos.charAt(0).toUpperCase() + pos.slice(1);
                selectPosition.appendChild(opt);
            });

            const br = document.createElement('br');
            players.appendChild(createJog);
            players.appendChild(selectHability);
            players.appendChild(selectPosition);
            players.appendChild(br);
        }

        const btnSortear = document.createElement('button');
        btnSortear.id = 'btnSortear';
        btnSortear.innerText = 'Sortear';

        btnSortear.addEventListener('click', () => {
            const allNameInputs = document.querySelectorAll('.dinamic-jog-input');
            const allHability = document.querySelectorAll('.dinamic-hability');
            const allPosition = document.querySelectorAll('.dinamic-position');

            const jogadores = [];
            for (let i = 0; i < allNameInputs.length; i++) {
                const nome = allNameInputs[i].value.trim();
                const habilidade = parseInt(allHability[i].value);
                const posicao = allPosition[i].value;
                if (!nome) {
                    alert("Preencha todos os nomes!");
                    return;
                }
                jogadores.push({ nome, habilidade, posicao });
            }

            const defensores = jogadores.filter(j => j.posicao === 'defesa');
            const meios = jogadores.filter(j => j.posicao === 'meio');
            const ataques = jogadores.filter(j => j.posicao === 'ataque');

            if (defensores.length < inpTime || meios.length < inpTime || ataques.length < inpTime) {
                alert("Precisa de pelo menos 1 defensor, 1 meio e 1 atacante por time.");
                return;
            }

            // Sorteia e balanceia
            function sortearBalanceado() {
                const shuffle = arr => arr.sort(() => Math.random() - 0.5);

                shuffle(defensores);
                shuffle(meios);
                shuffle(ataques);

                const times = Array.from({ length: inpTime }, () => []);

                for (let i = 0; i < inpTime; i++) {
                    times[i].push(defensores[i]);
                    times[i].push(meios[i]);
                    times[i].push(ataques[i]);
                }

                const usados = new Set([
                    ...defensores.slice(0, inpTime),
                    ...meios.slice(0, inpTime),
                    ...ataques.slice(0, inpTime)
                ]);

                const restantes = jogadores.filter(j => !Array.from(usados).includes(j));
                shuffle(restantes);

                // Balanceamento por habilidade
                restantes.sort((a, b) => b.habilidade - a.habilidade);

                while (restantes.length > 0) {
                    times.sort((a, b) => somaHabilidade(a) - somaHabilidade(b));
                    const jogador = restantes.shift();
                    for (let time of times) {
                        if (time.length < inpJog) {
                            time.push(jogador);
                            break;
                        }
                    }
                }

                return times;
            }

            function exibirTimesVisualmente(times) {
                const output = document.getElementById("outputTimes");
                output.innerHTML = ""; // limpa antes

                times.forEach((time, index) => {
                const bloco = document.createElement("div");
                bloco.className = "dinamic-div-times";

                const titulo = document.createElement("h4");
                titulo.innerText = `Time ${index + 1}`;
                bloco.appendChild(titulo);

                const media = somaHabilidade(time) / time.length;
                const mediaTag = document.createElement("div");
                mediaTag.className = "team-average";
                mediaTag.innerText = media.toFixed(2);
                bloco.appendChild(mediaTag);

                time.forEach(jogador => {
                const p = document.createElement("p");
                p.innerText = `• ${jogador.nome} (${jogador.posicao})`;
                bloco.appendChild(p);
        });

        output.appendChild(bloco);
    });
}


            function somaHabilidade(time) {
                return time.reduce((sum, j) => sum + j.habilidade, 0);
            }

            const resultado = sortearBalanceado();

            console.log("==== TIMES SORTEADOS ====");
            resultado.forEach((time, i) => {
                console.log(`\nTime ${i + 1}:`);
                time.forEach(j => {
                    console.log(`- ${j.nome} | ${j.posicao} | Habilidade: ${j.habilidade}`);
                });
                console.log(`Média do Time: ${(somaHabilidade(time) / time.length).toFixed(2)}`);
            });

            exibirTimesVisualmente(resultado);

            players.classList.remove("show");
            players.classList.add('hidden');
            setTimeout(() => {
                sorted.classList.add("show");
            }, 600);
        });

        players.appendChild(btnSortear);
    });
});

