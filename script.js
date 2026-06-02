const canvas = document.getElementById('canvasPlanta');
const ctx = canvas.getContext('2d');

// Estados da animação: 'semente', 'regando', 'crescendo', 'florida'
let frame = 0;
let estado = 'semente'; 

// Variáveis dos elementos da planta
let alturaCaule = 0;
let tamanhoFlor = 0;
let gotas = [];

// Inicializa ou reseta as variáveis do ciclo de vida da planta
function inicializar() {
    frame = 0;
    estado = 'semente';
    alturaCaule = 0;
    tamanhoFlor = 0;
    gotas = [];
    
    // Cria o array de gotas de chuva com posições aleatórias
    for(let i = 0; i < 20; i++) {
        gotas.push({
            x: 250 + Math.random() * 100,
            y: 50 + Math.random() * 100,
            velocidade: 2 + Math.random() * 3
        });
    }
}

// Desenha o cenário estático (Sol e Terra)
function desenharCenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sol
    ctx.beginPath();
    ctx.arc(520, 70, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    // Solo (Terra)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 320, canvas.width, 80);
    
    // Linha do horizonte (Grama)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 315, canvas.width, 5);
}

// Loop principal da animação
function animar() {
    desenharCenario();
    frame++;

    const centroX = canvas.width / 2;
    const soloY = 315;

    // FASE 1: Semente estática na terra
    if (estado === 'semente') {
        ctx.beginPath();
        ctx.ellipse(centroX, soloY + 15, 8, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#D2B48C';
        ctx.fill();

        if (frame > 60) estado = 'regando';
    }

    // FASE 2: Animação da chuva regando a semente
    if (estado === 'regando') {
        ctx.beginPath();
        ctx.ellipse(centroX, soloY + 15, 8, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#D2B48C';
        ctx.fill();

        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 2;
        
        gotas.forEach(gota => {
            ctx.beginPath();
            ctx.moveTo(gota.x, gota.y);
            ctx.lineTo(gota.x - 2, gota.y + 10);
            ctx.stroke();

            gota.y += gota.velocidade;
            if (gota.y > soloY) {
                gota.y = 50; // Reseta a gota no topo
            }
        });

        if (frame > 180) estado = 'crescendo';
    }

    // FASE 3: Crescimento do caule e folhas
    if (estado === 'crescendo' || estado === 'florida') {
        if (alturaCaule < 120) {
            alturaCaule += 1.5; 
        } else {
            estado = 'florida';
        }

        // Desenha o Caule
        ctx.beginPath();
        ctx.moveTo(centroX, soloY);
        ctx.lineTo(centroX, soloY - alturaCaule);
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Folha esquerda
        if (alturaCaule > 40) {
            ctx.beginPath();
            ctx.ellipse(centroX - 15, soloY - 40, 15, 7, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fillStyle = '#228B22';
            ctx.fill();
        }
        // Folha direita
        if (alturaCaule > 80) {
            ctx.beginPath();
            ctx.ellipse(centroX + 15, soloY - 80, 15, 7, Math.PI / 6, 0, Math.PI * 2);
            ctx.fillStyle = '#228B22';
            ctx.fill();
        }
    }

    // FASE 4: O desabrochar da flor
    if (estado === 'florida') {
        if (tamanhoFlor < 20) {
            tamanhoFlor += 0.4; 
        }

        const florY = soloY - alturaCaule;

        // Pétalas (Rosa)
        ctx.fillStyle = '#FF69B4'; 
        for (let i = 0; i < 5; i++) {
            const angulo = (i * 2 * Math.PI) / 5;
            const petalaX = centroX + Math.cos(angulo) * tamanhoFlor;
            const petalaY = florY + Math.sin(angulo) * tamanhoFlor;
            
            ctx.beginPath();
            ctx.arc(petalaX, petalaY, tamanhoFlor, 0, Math.PI * 2);
            ctx.fill();
        }

        // Miolo (Amarelo)
        ctx.beginPath();
        ctx.arc(centroX, florY, tamanhoFlor * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    requestAnimationFrame(animar);
}

// Função para o botão do HTML reiniciar o ciclo
function reiniciarAnimacao() {
    inicializar();
}

// Inicialização automática ao carregar o script
inicializar();
animar();