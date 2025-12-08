# 🚀 Desafio FullStack – Accenture

Aplicação **FullStack** desenvolvida como solução para o desafio técnico da Accenture.  
O sistema conta com **backend em Java** e **frontend em React**, realizando cadastro e gerenciamento de empresas/fornecedores, com **consulta automática de endereço via CEP** e persistência em banco de dados **PostgreSQL**.

---

## 🧩 Visão geral do projeto

✅ **Objetivo:** permitir o gerenciamento completo de **empresas/fornecedores (PF e PJ)**, automatizando o preenchimento de endereço a partir do CEP.  

📌 **Principais entregas:**
- **CRUD completo** de empresas/fornecedores
- **Consulta de CEP automática** usando **ViaCEP**
- **Validações com Bean Validation** no backend
- **Persistência em PostgreSQL**
- **Frontend responsivo** com React + Tailwind

---

## 🛠️ Tecnologias utilizadas

### 🔙 Backend
- **Java**
- **Spring Boot**
- **Bean Validation (jakarta validation)** para validação de DTOs
- **JPA + Hibernate** para mapeamento objeto-relacional e persistência
- **Maven**

### 🎨 Frontend
- **React**
- **Tailwind CSS** para estilização
- **Axios/Fetch** para consumo da API

### 🗄️ Banco de dados
- **PostgreSQL**

### 🌐 Integração externa
- **ViaCEP** (substituindo a API `cep.la` por indisponibilidade durante o desenvolvimento)

### 🧰 Ferramentas complementares
- Git & GitHub
- Postman

---

## ✨ Funcionalidades principais

📌 **Empresas**
- ➕ Cadastro de empresas
- 📄 Listagem de empresas cadastrados
- ✏️ Edição de empresas
- 🗑️ Exclusão de empresas
- 
📌 **Fornecedores**
- ➕ Cadastro de fornecedor **PF ou PJ**
- 📄 Listagem de fornecedores cadastrados
- ✏️ Edição de fornecedores
- 🗑️ Exclusão de fornecedores

📌 **Endereço via CEP**
- 🔎 Busca automática ao informar o CEP
- 🏠 Preenchimento de logradouro, bairro, cidade e UF
- 🧯 Tratamento de erros para CEP inválido ou API indisponível

📌 **Validações no backend**
- ✅ Campos obrigatórios (ex.: tipoPessoa, cpfCnpj, nome, email, telefone, cep)
- ✅ Regras de formato (ex.: CEP com 8 dígitos, CPF/CNPJ com 11 ou 14 dígitos)
- ✅ Email validado
- ✅ Regras condicionais para PF/PJ *(se aplicável na service)*

---

## 🧭 Sobre a API de CEP

O enunciado do desafio solicitava o consumo da API `http://cep.la/api`.  
Durante o desenvolvimento, o serviço apresentou instabilidade/indisponibilidade, retornando falhas de conexão.

Para manter a aderência ao enunciado e garantir o funcionamento da aplicação, foi implementada uma estratégia de **“tenta-ou-falha” (fallback)**:  
- a aplicação **primeiro tenta consultar a API cep.la**;  
- **se a requisição falhar**, automaticamente realiza a busca pelo CEP na **API ViaCEP**.

Com isso, a regra do desafio foi respeitada e a funcionalidade de consulta de endereço permaneceu estável, mesmo diante da falha externa.

---

## 🗂️ Estrutura do projeto

- `/backend`: API Spring Boot (controllers, services, repositories, models, DTOs).  
- `/frontend`: aplicação React com Tailwind para interface do usuário.  

