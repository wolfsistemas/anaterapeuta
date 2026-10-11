import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function Privacy() {
  return (
    <div>
      <SiteHeader solid />
      <article className="prose-ana mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-600">LGPD</p>
        <h1 className="serif mb-8 mt-2 text-4xl">Politica de privacidade</h1>
        <p>
          Tratamos dados pessoais para prestar o servico: conta, plano, pagamentos, logs de acesso e, quando
          houver, mensagens da inbox. Base legal: execucao de contrato e legitimo interesse operacional.
        </p>
        <h2>1. Dados que coletamos</h2>
        <ul>
          <li>Identificacao: nome, e-mail, telefone opcional.</li>
          <li>Conta: senha (hash no Supabase Auth), papel (aluno ou superadmin), plano.</li>
          <li>Pagamento: status, metodo e IDs do Mercado Pago — nao armazenamos numero de cartao.</li>
          <li>Uso: logs simples de login, troca de plano, reset de senha e envio de avisos.</li>
          <li>Push: endpoint de inscricao do navegador, se voce autorizar.</li>
        </ul>
        <h2>2. Conteudo clinico</h2>
        <p>
          Relatos de sessao nao devem ser colocados na inbox da plataforma. Preferimos o encontro ao vivo. Se
          alguma nota for registrada pelo terapeuta, fica isolada por tenant, com acesso restrito ao superadmin.
        </p>
        <h2>3. Compartilhamento</h2>
        <p>
          Operadores: Supabase (banco, auth, storage), GitHub Pages (front estatico), Mercado Pago (cobranca),
          YouTube (player). Nao vendemos lista de alunos.
        </p>
        <h2>4. Seus direitos</h2>
        <p>
          Voce pode pedir acesso, correcao, portabilidade e exclusao pelo e-mail de contato. Retencao minima de
          registros financeiros segue obrigacoes fiscais brasileiras.
        </p>
        <h2>5. Cookies e notificacoes</h2>
        <p>
          Usamos armazenamento local para sessao demo e preferencias. Notificacoes push so apos permissao do
          navegador. Voce pode revogar a qualquer momento nas configuracoes do aparelho.
        </p>
        <p className="text-sm text-ink-500">Controladora: Ana | Terapia e Mentoria. Texto-base para revisao juridica.</p>
      </article>
      <SiteFooter />
    </div>
  )
}
