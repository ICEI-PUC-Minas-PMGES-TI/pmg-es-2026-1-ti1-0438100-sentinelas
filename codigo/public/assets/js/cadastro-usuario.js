//exibir senha
function toggleSenha(idInput, botao) {
    const input = document.getElementById(idInput);
  
    if (!input) {
      console.log("Input não encontrado:", idInput);
      return;
    }
  
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

//validação de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

//validação de cpf
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;

  // segundo dígito
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// verificar duplicata
async function verificarDuplicado(email, cpf) {
  const resEmail = await fetch(`http://localhost:3000/usuarios?email=${email}`);
  const resCpf = await fetch(`http://localhost:3000/usuarios?cpf=${cpf}`);

  const emailExiste = (await resEmail.json()).length > 0;
  const cpfExiste = (await resCpf.json()).length > 0;

  return { emailExiste, cpfExiste };
}

//cadastro
async function cadastrar() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const cpf = document.getElementById("cpf").value.trim();
  const perfil = document.getElementById("perfil").value;

  // campos vazios
  if (!nome || !email || !senha || !confirmarSenha || !cpf || !perfil) {
    alert("Preencha todos os campos!");
    return;
  }

  // email
  if (!validarEmail(email)) {
    alert("Email inválido!");
    return;
  }

  // cpf
  if (!validarCPF(cpf)) {
    alert("CPF inválido!");
    return;
  }

  // senha
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    // duplicatas já existentes no json
    const { emailExiste, cpfExiste } = await verificarDuplicado(email, cpf);

    if (emailExiste) {
      alert("Email já cadastrado!");
      return;
    }

    if (cpfExiste) {
      alert("CPF já cadastrado!");
      return;
    }

    // envia
    const usuario = {
      nome,
      email,
      senha,
      cpf,
      perfil
    };

    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar");
    }

    alert("Cadastro realizado com sucesso!");

    //limpa o formulário
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("confirmarSenha").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("perfil").value = "";

  } catch (erro) {
    console.error(erro);
    alert("Erro ao cadastrar. Tente novamente.");
  }
}
