import { PosI } from "./interfaces";

    const tamanho = 7;
    const logPosLivres = false;

    const localTabuleiros = [];
        for (let y = 0; y < tamanho; y++) {
            for (let x = 0; x < tamanho; x++) {
                let currStartup = { y, x };
                logPosLivres &&
                    console.log(
                        `| Posição Inicial y:[${currStartup.y}] x:[${currStartup.x}] |`
                    );
                const tabuleiro = Array(tamanho)
                    .fill(0)
                    .map(() => Array(tamanho).fill(0)); //[y x]
                //let runs = 0;
                if (verificarAtaques(currStartup, tabuleiro)) {
                    tabuleiro[y][x] = 1;
                }
                scanAround(currStartup, tabuleiro);
                localTabuleiros.push(tabuleiro);
            }
        }

    function verificarAtaques(posVerificando: PosI, tabuleiro: number[][]) {
        function verificarVerticalHorizontal() {
            function CimaLivre() {
                const x = posVerificando.x;
                for (let y = posVerificando.y; y < tamanho; y++) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                }
                //console.log("Cima livre");
                return true;
            }
            function BaixoLivre() {
                const x = posVerificando.x;
                for (let y = posVerificando.y; y >= 0; y--) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                }
                //console.log("Baixo livre");
                return true;
            }
            function DireitaLivre() {
                const y = posVerificando.y;
                for (let x = posVerificando.x; x < tamanho; x++) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                }
                //console.log("Direita livre");
                return true;
            }
            function EsquerdaLivre() {
                const y = posVerificando.y;
                for (let x = posVerificando.x; x >= 0; x--) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                }
                //console.log("Esquerda livre");
                return true;
            }

            if (
                CimaLivre() &&
                BaixoLivre() &&
                DireitaLivre() &&
                EsquerdaLivre()
            )
                return true;
            return false;
        }
        function verificarDiagonais() {
            function DiagonalCimaDireitaLivre() {
                let x = posVerificando.x;
                let y = posVerificando.y;
                while (x < tamanho && y < tamanho) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                    x++;
                    y++;
                }
                return true;
            }
            function DiagonalCimaEsquerdaLivre() {
                let x = posVerificando.x;
                let y = posVerificando.y;
                while (x >= 0 && y < tamanho) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                    x--;
                    y++;
                }
                return true;
            }
            function DiagonalBaixoDireitaLivre() {
                let x = posVerificando.x;
                let y = posVerificando.y;
                while (x < tamanho && y >= 0) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                    x++;
                    y--;
                }
                return true;
            }
            function DiagonalBaixoEsquerdaLivre() {
                let x = posVerificando.x;
                let y = posVerificando.y;
                while (x >= 0 && y >= 0) {
                    if (tabuleiro[y][x] == 1) {
                        return false;
                    }
                    x--;
                    y--;
                }
                return true;
            }

            if (
                DiagonalCimaDireitaLivre() &&
                DiagonalCimaEsquerdaLivre() &&
                DiagonalBaixoDireitaLivre() &&
                DiagonalBaixoEsquerdaLivre()
            )
                return true;
            return false;
        }

        if (verificarVerticalHorizontal() && verificarDiagonais()) {
            logPosLivres &&
                console.log(
                    `   Posição y:[${posVerificando.y}] x:[${posVerificando.x}] livre`
                );
            return true;
        } else {
            return false;
        }
    }

    function scanAround(currStartup: PosI, tabuleiro: number[][]) {
        function tryTopLeft() {
            for (let y = currStartup.y; y < tamanho; y++) {
                for (let x = currStartup.x; x >= 0; x--) {
                    const posVerificando = { y, x };
                    if (
                        posVerificando.y == currStartup.y &&
                        posVerificando.x == currStartup.x
                    )
                        continue;
                    if (verificarAtaques(posVerificando, tabuleiro)) {
                        tabuleiro[y][x] = 1;
                    }
                    //runs++;
                }
            }
        }
        function tryTopRight() {
            for (let y = currStartup.y; y < tamanho; y++) {
                for (let x = currStartup.x; x < tamanho; x++) {
                    const posVerificando = { y, x };
                    if (
                        posVerificando.y == currStartup.y &&
                        posVerificando.x == currStartup.x
                    )
                        continue;
                    if (verificarAtaques(posVerificando, tabuleiro)) {
                        tabuleiro[y][x] = 1;
                    }
                    //runs++;
                }
            }
        }
        function tryBottomLeft() {
            for (let y = currStartup.y; y >= 0; y--) {
                for (let x = currStartup.x; x >= 0; x--) {
                    const posVerificando = { y, x };
                    if (
                        posVerificando.y == currStartup.y &&
                        posVerificando.x == currStartup.x
                    )
                        continue;
                    if (verificarAtaques(posVerificando, tabuleiro)) {
                        tabuleiro[y][x] = 1;
                    }
                    //runs++;
                }
            }
        }
        function tryBottomRight() {
            for (let y = currStartup.y; y >= 0; y--) {
                for (let x = currStartup.x; x < tamanho; x++) {
                    const posVerificando = { y, x };
                    if (
                        posVerificando.y == currStartup.y &&
                        posVerificando.x == currStartup.x
                    )
                        continue;
                    if (verificarAtaques(posVerificando, tabuleiro)) {
                        tabuleiro[y][x] = 1;
                    }
                    //runs++;
                }
            }
        }

        tryTopLeft();
        tryTopRight();
        tryBottomLeft();
        tryBottomRight();
    }
