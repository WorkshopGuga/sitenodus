import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PageHero } from "../components/ui";

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="py-8 border-t border-ink/10 first:border-t-0 first:pt-0">
      <h2 className="m-0 text-[19px] font-semibold text-ink tracking-[-.015em]">{titulo}</h2>
      <div className="mt-3 text-ink/65 text-[15px] leading-[1.72] font-light [&_p]:m-0 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:mb-0 [&_ul]:pl-5 [&_li]:mb-1.5">
        {children}
      </div>
    </div>
  );
}

export default function Privacidade() {
  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Privacidade"
        titulo="Política de Privacidade"
        texto="Como a nodus tecnologia trata os dados enviados por este site. Em linguagem direta, sem juridiquês desnecessário."
      />

      <section className="bg-paper px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <p className="text-ink/45 text-[13px] m-0">Última atualização: setembro de 2026</p>

          <Bloco titulo="Quem trata os seus dados">
            <p>
              A responsável pelo tratamento dos dados coletados neste site é a Nodus
              Tecnologia (CNPJ 34.054.137/0001-40), com sede na Rua Roque Callage, 87,
              Caxias do Sul, RS.
            </p>
            <p>
              Para qualquer assunto relacionado aos seus dados — dúvida, correção,
              exclusão — o contato é{" "}
              <a href="mailto:gustavo@somosnodus.com" className="text-accent-deep">gustavo@somosnodus.com</a>.
            </p>
          </Bloco>

          <Bloco titulo="Quais dados coletamos e onde">
            <p>
              Coletamos dados pessoais apenas quando você preenche o formulário de
              contato deste site: nome, e-mail, telefone, empresa e a mensagem que você
              escreve.
            </p>
            <p>
              Este site não usa cookies de rastreamento nem pixels de terceiros no
              momento. Se isso mudar — por exemplo, para medir a origem dos contatos
              recebidos — esta política será atualizada antes da mudança entrar no ar.
            </p>
          </Bloco>

          <Bloco titulo="Para que usamos">
            <ul>
              <li>Responder ao seu contato e entender o que sua empresa precisa antes de propor algo.</li>
              <li>Registrar o histórico da conversa comercial, caso ela avance.</li>
            </ul>
            <p>Não usamos esses dados para enviar newsletter ou material de marketing sem você pedir.</p>
          </Bloco>

          <Bloco titulo="Base legal">
            <p>
              O tratamento se apoia no seu consentimento, dado ao marcar a caixa de
              aceite no formulário, e no legítimo interesse da nodus em responder a um
              contato comercial que você mesmo iniciou (art. 7º, incisos I e IX, da Lei
              Geral de Proteção de Dados).
            </p>
          </Bloco>

          <Bloco titulo="Com quem compartilhamos">
            <p>
              Os dados ficam armazenados em um banco de dados (Supabase, com servidores
              nos Estados Unidos) usado como infraestrutura técnica — não como terceiro
              que acessa ou usa esses dados para fins próprios. Não vendemos nem
              compartilhamos seus dados com terceiros para marketing.
            </p>
          </Bloco>

          <Bloco titulo="Por quanto tempo guardamos">
            <p>
              Enquanto durar a relação comercial, ou até você solicitar a exclusão. Se
              não houver retorno seu após o contato inicial, os dados podem ser mantidos
              por até 24 meses e depois removidos.
            </p>
          </Bloco>

          <Bloco titulo="Seus direitos">
            <p>Você pode, a qualquer momento e sem custo, solicitar:</p>
            <ul>
              <li>Confirmação de que tratamos seus dados, e acesso a eles.</li>
              <li>Correção de dado incompleto ou desatualizado.</li>
              <li>Exclusão dos seus dados dos nossos registros.</li>
              <li>Revogação do consentimento dado no formulário.</li>
            </ul>
            <p>
              Basta escrever para{" "}
              <a href="mailto:gustavo@somosnodus.com" className="text-accent-deep">gustavo@somosnodus.com</a>.
              Respondemos em até 15 dias.
            </p>
          </Bloco>

          <Bloco titulo="Segurança">
            <p>
              O acesso aos dados no banco é restrito por controle de permissões — só
              pessoas autenticadas da equipe conseguem ler o que é enviado pelo
              formulário. Ninguém acessa isso anonimamente pela internet.
            </p>
          </Bloco>

          <div className="pt-8 border-t border-ink/10">
            <Link to="/contato" className="text-accent-deep text-[14.5px] no-underline">
              ← Voltar para contato
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
