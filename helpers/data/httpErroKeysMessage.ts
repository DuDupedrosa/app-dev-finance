const httpErroKeysMessage: {
  incorrect_password: string;
  email_not_registered: string;
  internal_server_erro: string;
  incorrect_current_password: string;
  new_password_is_the_same_current: string;
  email_already_register: string;
} = {
  incorrect_password:
    "A senha informada está incorreta. Por favor, tente novamente ou redefina sua senha.",
  email_not_registered:
    "O email informado não está cadastrado. Verifique se o endereço está correto ou cadastre-se para continuar.",
  internal_server_erro:
    "Ops! Ocorreu um erro inesperado. Tente novamente mais tarde.",
  incorrect_current_password: "Senha atual incorreta.",
  new_password_is_the_same_current:
    "A nova senha, precisa ser diferente da senha atual.",
  email_already_register:
    "Este e-mail já está registrado na plataforma. Por favor, insira um e-mail diferente.",
};

export default httpErroKeysMessage;
