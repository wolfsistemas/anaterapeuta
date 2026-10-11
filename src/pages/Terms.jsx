import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function Terms() {
  return (
    <div>
      <SiteHeader solid />
      <article className="prose-ana mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-sage-600">Documento</p>
        <h1 className="serif mb-8 mt-2 text-4xl">Termos de uso</h1>
        <p>
          Estes termos regulam o uso da plataforma Ana | Terapia e Mentoria, um servico digital de conteudo,
          mentoria e agendamento de sessoes online. Ao criar conta, voce concorda com este texto.
        </p>
        <h2>1. O que este espaco e</h2>
        <p>
          Oferecemos cursos gravados, materiais, avisos e, nos planos que incluem, sessoes de terapia ou mentoria
          por video (Google Meet ou Zoom). Conteudo gratuito e aberto; conteudo pago exige assinatura ativa.
        </p>
        <h2>2. O que este espaco nao e</h2>
        <p>
          Nao substitui atendimento de urgencia, pronto-socorro ou internacao. Em risco de vida, ligue 188 (CVV)
          ou 192. A plataforma nao e consultorio fisico e nao emite diagnostico por mensagem assincrona.
        </p>
        <h2>3. Conta e senha</h2>
        <p>
          Voce e responsavel por manter sua senha em sigilo. O superadmin pode redefinir senha a pedido, com
          registro em log. Contas podem ser bloqueadas em caso de abuso, compartilhamento ilegal de acesso ou
          inadimplencia.
        </p>
        <h2>4. Planos e pagamento</h2>
        <p>
          Assinaturas sao cobradas via Mercado Pago (PIX ou cartao). O acesso ao conteudo pago permanece enquanto
          a assinatura estiver ativa. Cancelamento encerra a renovacao; o periodo ja pago segue disponivel ate o
          vencimento.
        </p>
        <h2>5. Sessoes</h2>
        <p>
          Planos com sessoes entregam um link fixo de Meet/Zoom e um saldo mensal. Faltas sem aviso podem debitar
          o saldo, conforme combinado no atendimento. Gravacao de sessao so ocorre com consentimento explicito.
        </p>
        <h2>6. Propriedade do conteudo</h2>
        <p>
          Videos (YouTube unlisted), textos e arquivos no Supabase Storage sao de Ana | Terapia e Mentoria.
          Compartilhar login ou republicar aulas e vedado.
        </p>
        <h2>7. Encerramento</h2>
        <p>
          Voce pode pedir exclusao de conta pelo painel ou e-mail. Dados de sessao clinica seguem as regras eticas
          e legais de guarda, mesmo apos o cancelamento da assinatura.
        </p>
        <p className="text-sm text-ink-500">Ultima atualizacao: outubro de 2026. Texto-base para revisao juridica.</p>
      </article>
      <SiteFooter />
    </div>
  )
}
