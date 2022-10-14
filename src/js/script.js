let secaoProdutos = document.querySelector(".containerListaProdutos ul")
let secaoCategorias = document.querySelector("#botoesContainer")
let secaoCarrinho = document.querySelector(".priceContainer ul")

// LISTA OS PRODUTOS NA SEÇÃO, PODE TER UMA CATEGORIA ESPECÍFICA DE ACORDO COM AQUILO ESCOLHIDO PELO USUÁRIO
function listarProdutos(listaProdutos, secao, categoria = 'Todos Produtos'){

    secao.innerHTML = ""

    let categoriaDoProduto
    
    for(let i = 0; i<listaProdutos.length; i++){
        
        let produto = listaProdutos[i]
        categoriaDoProduto = produto.secao.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

        if(categoria.includes('Todos Produtos') || categoria.includes(categoriaDoProduto)){

            let cardProduto    = criarCardProduto(produto)
            secao.appendChild(cardProduto)
        }
    }
   
}

listarProdutos(produtos, secaoProdutos)

// FUNÇÃO RESPONSÁVEL PELO DOM DO CARD
function criarCardProduto(produto){

    let tagLi       = document.createElement("li")
    let tagImge     = document.createElement("img")
    let tagNome     = document.createElement("h3")
    let tagSecao    = document.createElement("span")
    let tagOl = document.createElement("ol")
    let tagPreco    = document.createElement("p")
    let componentes;
    let btnComprar  = document.createElement("button")
    let tagDiv = document.createElement("article")
   
    if(produto.id != undefined){
        btnComprar.id =  produto.id
    }

    tagImge.src = `${produto.img}`
    tagImge.alt = `Imagem ${produto.nome}`
    tagNome.innerText = produto.nome
    tagSecao.innerText = produto.secao
    tagPreco.innerText = `R$ ${parseFloat(produto.preco).toFixed(2)}`.replace(".",",")
    btnComprar.innerText = "Comprar"


    if(produto.categoria != undefined){
        tagSecao.id =  produto.categoria
    }

    tagDiv.append(tagNome)
    tagDiv.append(tagSecao)

    for(let i = 0; i<produto.componentes.length; i++){
        componentes = document.createElement("li")
        componentes.innerText = produto.componentes[i]

        tagOl.append(componentes)
    }

    tagDiv.append(tagOl)
    tagDiv.append(tagPreco)
    tagDiv.append(btnComprar)

    tagLi.append(tagImge)
    tagLi.append(tagDiv)

    tagLi.classList.add("produto")

    return tagLi
}

// INTERCEPTANDO CATEGORIA CLICADA PARA LISTAGEM
secaoCategorias.addEventListener("click", interceptandoCategoria)
function interceptandoCategoria(event){

    let btnClicado  = event.target
    if(btnClicado.tagName == "BUTTON"){

        let btnComClasse = document.querySelector(".botoesClickStyle");
        btnComClasse.classList.remove("botoesClickStyle");

        btnClicado.classList.add("botoesClickStyle")

        let categoriaDesejada = btnClicado.innerText.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        listarProdutos(produtos, secaoProdutos, categoriaDesejada)

        document.getElementsByClassName("campoBuscaPorNome")[0].value = "";
            // -- DEIXA O CAMPO DE BUSCA COM VALOR VAZIO ASSIM QUE ESCOLHIDA UMA NOVA CATEGORIA
    }

}

//CARRINHO DE COMPRAS
secaoProdutos.addEventListener("click", interceptandoProdutoClicado)
secaoCarrinho.addEventListener("click", interceptandoProdutoClicado)

let carrinhoCompras = []

function interceptandoProdutoClicado(event){

    let classeSecaoClicada = this.getAttribute('class')

    let btnComprar  = event.target
    
    if(btnComprar.tagName == "BUTTON"){

        let idProduto = btnComprar.id

        let produto = produtos.find(function(produto){

            if(produto.id == idProduto){
                return produto
            }
            
        });

        if(classeSecaoClicada == 'produtos') {
            adicionarCarrinho(produto)
        } else{
            removerProdutoCarrinho(produto)
        }
    }

}


function adicionarCarrinho(produto){

    if(produto !== undefined){
        carrinhoCompras.push(produto)

        add(produto.preco)
        qtd(1)

        document.querySelector('.quantidade__produtos').style.display = "flex"
        document.querySelector('.soma__produtos').style.display = "flex"

        listarProdutos(carrinhoCompras,secaoCarrinho)
    }
}

let quantidade = document.querySelector('.quantidade__produtos span')
let soma = document.querySelector('.soma__produtos span')

function removerProdutoCarrinho(produto){

    let posicaoDoProduto = carrinhoCompras.indexOf(produto)
    carrinhoCompras.splice(posicaoDoProduto, 1)

    add(produto.preco * -1)
    let qtdProdutos = qtd(-1)

    listarProdutos(carrinhoCompras,secaoCarrinho)

    if (qtdProdutos == 0){
        let tagLi = document.createElement ("li")
        tagLi.classList.add("carrinho-vazio")
        let h5 = document.createElement("h5")
        let img = document.createElement("img")

        h5.innerText = "Por enquanto não temos produtos no carrinho"
        img.src = "/img-carrinho/shopping-bag.png"

        tagLi.append(img)
        tagLi.append(h5)

        secaoCarrinho.append(tagLi)

        document.querySelector('.quantidade__produtos').style.display = "none"
        document.querySelector('.soma__produtos').style.display = "none"
    }

}


function add (preco) {
    let somar = parseFloat(soma.textContent)
    somar += parseFloat(preco) 

    soma.textContent = somar
}

function qtd (num){
    let qtdProdutos = parseFloat(quantidade.textContent)
    qtdProdutos += num 

    quantidade.textContent = qtdProdutos

    return qtdProdutos
}

// ÁREA DE PESQUISA 
function pesquisarNaPagina() {

    let input = document.getElementsByClassName("campoBuscaPorNome")[0];
    let tituloDigitado = input.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let li = secaoProdutos.getElementsByClassName("produto");
    let h3, tituloProduto, span, secao


    for (i = 0; i < li.length; i++) {
        h3 = li[i].getElementsByTagName("h3")[0];
        tituloProduto = h3.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        span = li[i].getElementsByTagName("span")[0];
        secao = span.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        categoria =  span.id.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        if (tituloProduto.includes(tituloDigitado) || secao.includes(tituloDigitado) || categoria.includes(tituloDigitado)) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}












