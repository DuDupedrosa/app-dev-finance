const httpErroKeysMessage: {
  incorrect_password: string;
  email_not_registered: string;
  internal_server_erro: string;
} = {
  incorrect_password:
    "A senha informada está incorreta. Por favor, tente novamente ou redefina sua senha.",
  email_not_registered:
    "O email informado não está cadastrado. Verifique se o endereço está correto ou cadastre-se para continuar.",
  internal_server_erro:
    "Ops! Ocorreu um erro inesperado. Tente novamente mais tarde.",
};

export default httpErroKeysMessage;
