//função
//function start(){
//console.log("começou")
//}

//start()

//arrow function

//const start = () => {
//  console.log("começou")
//}

//start()

//WHILE - ESTRUTURA DE REPETIÇÃO

//const start = () => {
//let count = 0;

//while (count < 10) {
//contando 10x por isso de 0 a 9
//console.log(count);
//count++;
//count = count + 1
//}
//};

//start();

//--------

//importação de módulos (require/CommonJS) - biblioteca 'inquirer' para criar promps interativos
const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let mensagem = "Bem vindo ao app de metas";

let meta = {
  value: "Tomar 3l de água por dia",
  checked: false,
};

let metas;

const carregarMetas = async () => {
  try {
    //tentar pegar os dados no fs read.file  leia o arquivo
    const dados = await fs.readFile("metas.json", "utf-8");
    metas = JSON.parser(dados); //parse convete os dados do JSON para um array
  } catch (erro) {
    metas = [];
  }
};

const salvarMetas = async() =>{
  await fs.writeFile("metas.json", JSON.stringify(metas,null, 2))
}

//CONDICIONAIS SWITCH
//cuidado com o while, ele pode dar loop

//sempre que for usar uma função async utilizar o await antes. Quando chegar na linha, esperar awai toda a função acontecer.
const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite sua meta:" });
  //conceito if e else - condicionais, controle de fluxo

  if (meta.length == 0) {
    //lenght : número de caracteres
    mensagem = "A meta não pode ser vazia";
    return cadastrarMeta();
  }

  metas.push({
    value: meta,
    checked: false,
  }); //push: colocar alguma coisa dentro
  mensagem = "metas cadastrada com sucesso";
};

const listarMetas = async () => {

  if(metas.lenght == 0){
    mensagem = "Não existem metas!"
    return
  }

  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
    choices: [...metas],
    //choices quer dizer escolhas
    // ... spread -  espalhar , pegando tudo que tem dentro da array, e colocando dentro de um novo array
    instructions: false, //para não mostrar as instruções que o terminal sugere
  });

  //desmarcar todas e deixar apenas a que estiverem marcadas
  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length == 0) {
    mensagem = "Nenhuma meta selecionada";
    return;
  }

  //forEach quer dizer para cada. Para cada uma, execute essa função.
  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      //find: procurar. Para cada uma das metas, procure
      return m.value == resposta;
    });
    meta.checked = true; //checked é um valor boolean
  });
  mensagem = "Meta(s) marcadas como concluída (s)";
};

const metasRealizadas = async () => {

  if(metas.lenght == 0){
    mensagem = "Não existem metas!"
    return
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length == 0) {
    mensagem = "Não existem metas realizadas! : (')";
    return;
  }

  await select({
    message: "Metas Realizadas" + realizadas.lenght,
    choices: [...realizadas],
  });
};

//agua [] - caminhar [] - cantar [x]
const metasAbertas = async () => {

  if(metas.lenght == 0){
    mensagem = "Não existem metas!"
    return
  }

  const abertas = metas.filter((meta) => {
    return meta.checked != true;
    //return !meta.checked true  outra forma de inverter o valor boleando
  });

  if (abertas.length == 0) {
    mensagem = "Não existem metas abertas! :";
    return;
  }

  await select({
    message: "Metas Abertas:" + abertas.lenght,
    choices: [...abertas],
  });
};

const deletarMetas = async () => {

  if(metas.lenght == 0){
    mensagem = "Não existem metas!"
    return
  }
  
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });

  const itemsADeletar = await checkbox({
    message: "Selecione item para deletar",
    choices: [...metasDesmarcadas],
    instructions: false,
  });

  if (itemsADeletar.length == 0) {
    mensagem = "Nenhum item para deletar";
    return;
  }

  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item;
    });
  });
  mensagem = "Metas deletadas com sucesso";
};

const mostrarMensagem = () => {
  console.clear();

  if (mensagem != "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
};

//programaçaõ assincrona (chegou e parou no awai pra depois continuar (esperar pra receber a promessa)) e promessas
const play = async () => {
  await carregarMetas();

  while (true) {
    // let opcao = "sair"  //se eu colocar cadasrtrar vai dar loop infinito, fica clicando ctrl+c várias vezes pra parar
    mostrarMensagem();
    await salvarMetas()

    const opcao = await select({
      //await esperar alguma coisa acontecer
      message: "Menu >",
      choices: [
        {
          name: "Cadastro",
          value: "cadastrar",
        },
        {
          name: "Listar metas",
          value: "listar",
        },
        {
          name: "Metas realizadas",
          value: "realizadas",
        },
        {
          name: "Metas abertas",
          value: "abertas",
        },
        {
          name: "Deletar",
          value: "deletar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMetas();

        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("Até a próxima");
        return;
    }
  }
};

play();
