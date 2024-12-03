# language: pt
Funcionalidade: Criar pagamento

  Cenário: Cliente realiza o checkout
    Dado que o cliente não se identifica
    Quando o sistema cria o pagamento com o ID "order123" e o valor "100.50"
    Então o pagamento é criado com sucesso

  Cenário: Criar pagamento com identificação
    Dado que o cliente se identifica via CPF "12345678900"
    Quando o sistema cria o pagamento com o ID "order456" e o valor "200.75"
    Então o pagamento é criado com sucesso