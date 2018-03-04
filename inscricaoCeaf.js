beginScript();

function beginScript() {
  if (location.href.includes('InscricaoEdit.seam?idEvento=')) {
    fillUpForm();
  }
}

function insertOnElement(id, value) {
  document.getElementById(id).value = value;
}

function fillUpForm() {
  insertOnElement('inscricao:cpfField:cpf', '077.691.084-11');
  insertOnElement('inscricao:nomeField:nome', 'JOSÉ DE ALMEIDA CAVALCANTE NETO');
  insertOnElement('inscricao:enderecoField:endereco', 'Av. Rui Barbosa 1100');
  insertOnElement('inscricao:telefoneField:telefone', '84996077784');
  insertOnElement('inscricao:emailField:email', 'jose.cavalcante@mprn.mp.br');
  insertOnElement('inscricao:empresaField:empresa', 'Ministério Público do Rio Grande do Norte');
  insertOnElement('inscricao:setorField:setor', 'SETOR DE ATENDIMENTO AO USUÁRIO - SAU');
  insertOnElement('inscricao:cargoField:cargo', 'TÉCNICO DO MPE');
  insertOnElement('inscricao:areaAtuacao:areaAtuacao', 'SETOR DE ATENDIMENTO AO USUÁRIO');
  document.getElementById('inscricao:save').click();
}

//Return the element that was found
function findElementsByTagNameAndTextContent(tag, text) {
  var aTags = document.getElementsByTagName(tag);
  var searchText = text;
  var found;

  for (var i = 0; i < aTags.length; i++) {
    if (aTags[i].textContent == searchText) {
      found = aTags[i];
      break;
    }
  }

  return found;
}

//Change feature name function
function changeFeatureName(tag, name, innerHTML) {
  tagFound = findElementsByTagNameAndTextContent(tag, name);
  tagFound.innerHTML = innerHTML;
}
