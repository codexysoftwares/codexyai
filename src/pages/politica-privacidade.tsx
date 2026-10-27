import LegalPageLayout from "@/components/LegalPageLayout";

const PoliticaPrivacidade = () => (
  <LegalPageLayout
    title="Política de Privacidade"
    seoTitle="Política de Privacidade | CODEXY"
    description="Saiba como a CODEXY coleta, utiliza, armazena e protege dados pessoais dos usuários do site e de seus serviços digitais."
    path="/politica-privacidade/"
    keywords="política de privacidade, proteção de dados, LGPD, CODEXY"
  >
    <p className="mb-4 text-tech-gray">Esta Política de Privacidade explica como a Codexy coleta, utiliza, armazena, compartilha e protege as informações pessoais dos usuários do site e dos serviços oferecidos. Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">1. Informações que Coletamos</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li><b>Informações fornecidas pelo usuário:</b> nome, e-mail, telefone, empresa, cargo, mensagens enviadas via formulários.</li>
      <li><b>Informações de navegação:</b> endereço IP, localização geográfica, tipo de navegador, páginas acessadas, tempo de visita, origem do acesso.</li>
      <li><b>Cookies e tecnologias similares:</b> para autenticação, preferências, análise de uso e personalização de conteúdo.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">2. Como Utilizamos as Informações</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li>Fornecer, operar e melhorar nossos serviços e site.</li>
      <li>Personalizar a experiência do usuário.</li>
      <li>Entrar em contato para suporte, marketing, envio de novidades e informações relevantes.</li>
      <li>Cumprir obrigações legais, regulatórias e contratuais.</li>
      <li>Prevenir fraudes, abusos e garantir a segurança do site.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">3. Compartilhamento de Dados</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li>Com parceiros e fornecedores essenciais para a prestação dos serviços, sempre sob confidencialidade.</li>
      <li>Com autoridades, mediante ordem judicial ou obrigação legal.</li>
      <li>Com terceiros, mediante consentimento explícito do usuário.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">4. Armazenamento e Segurança</h2>
    <p className="mb-4 text-tech-gray">Adotamos medidas técnicas, administrativas e organizacionais para proteger os dados pessoais contra acesso não autorizado, perda, alteração ou destruição. O acesso às informações é restrito a profissionais autorizados.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">5. Retenção de Dados</h2>
    <p className="mb-4 text-tech-gray">Os dados pessoais são armazenados pelo tempo necessário para cumprir as finalidades para as quais foram coletados, obrigações legais ou até eventual solicitação de exclusão pelo titular.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">6. Direitos do Usuário</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li>Acessar, corrigir, atualizar ou solicitar a exclusão de seus dados pessoais.</li>
      <li>Solicitar a portabilidade dos dados.</li>
      <li>Revogar o consentimento a qualquer momento.</li>
      <li>Obter informações sobre o compartilhamento de dados.</li>
      <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">7. Cookies e Tecnologias de Rastreamento</h2>
    <p className="mb-4 text-tech-gray">Utilizamos cookies para melhorar a navegação, analisar o uso do site, personalizar conteúdo e anúncios. O usuário pode gerenciar as preferências de cookies no navegador. Para mais detalhes, consulte nossa <a href="/cookies/" className="text-accent underline">Política de Cookies</a>.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">8. Base Legal para Tratamento</h2>
    <p className="mb-4 text-tech-gray">O tratamento de dados pessoais é realizado com base no consentimento do usuário, execução de contrato, cumprimento de obrigação legal ou legítimo interesse da Codexy.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">9. Transferência Internacional de Dados</h2>
    <p className="mb-4 text-tech-gray">Seus dados podem ser transferidos e armazenados em servidores fora do Brasil. Nesses casos, adotamos medidas para garantir a proteção adequada conforme a legislação aplicável.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">10. Alterações nesta Política</h2>
    <p className="mb-4 text-tech-gray">Esta Política pode ser atualizada periodicamente. Recomendamos revisar esta página regularmente para estar ciente de eventuais mudanças.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">11. Contato</h2>
    <p className="mb-4 text-tech-gray">Em caso de dúvidas, solicitações ou para exercer seus direitos, entre em contato pelo e-mail <a href="mailto:suporte@codexy.com.br" className="text-accent underline">suporte@codexy.com.br</a>.</p>
  </LegalPageLayout>
);

export default PoliticaPrivacidade;
