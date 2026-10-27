import LegalPageLayout from "@/components/LegalPageLayout";

const TermosUso = () => (
  <LegalPageLayout
    title="Termos de Uso"
    seoTitle="Termos de Uso | CODEXY"
    description="Consulte as condições aplicáveis ao acesso e uso do site, dos conteúdos e dos serviços digitais oferecidos pela CODEXY."
    path="/termos-uso/"
    keywords="termos de uso, condições de uso, serviços digitais, CODEXY"
  >
    <p className="mb-4 text-tech-gray">Estes Termos de Uso regulam o acesso e uso do site e dos serviços da Codexy. Ao utilizar nossos serviços, você concorda com estes termos e com a legislação vigente.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">1. Aceitação dos Termos</h2>
    <p className="mb-4 text-tech-gray">Ao acessar ou usar o site, o usuário concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">2. Uso do Site e Serviços</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li>O usuário compromete-se a utilizar o site de forma lícita, ética e segura.</li>
      <li>É proibido tentar acessar áreas restritas, modificar, danificar ou interferir no funcionamento do site.</li>
      <li>O conteúdo do site é protegido por direitos autorais e não pode ser reproduzido sem autorização prévia.</li>
      <li>O usuário é responsável pelas informações fornecidas e pelo uso de seus dados de acesso.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">3. Propriedade Intelectual</h2>
    <p className="mb-4 text-tech-gray">Todo o conteúdo do site, incluindo textos, imagens, logotipos, marcas, layouts, códigos e demais elementos, é de propriedade da Codexy ou de seus licenciantes, sendo protegido pela legislação de direitos autorais e propriedade intelectual.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">4. Responsabilidades</h2>
    <ul className="list-disc pl-6 mb-4 text-tech-gray">
      <li>A Codexy não se responsabiliza por danos decorrentes do uso indevido do site ou de informações incorretas fornecidas pelo usuário.</li>
      <li>O usuário é responsável por manter a confidencialidade de seus dados de acesso.</li>
      <li>Não garantimos que o site estará sempre disponível, livre de erros ou vírus.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">5. Links Externos</h2>
    <p className="mb-4 text-tech-gray">Nosso site pode conter links para sites de terceiros. Não nos responsabilizamos pelo conteúdo, políticas ou práticas desses sites. Recomendamos que o usuário leia os termos e políticas de privacidade de cada site visitado.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">6. Privacidade</h2>
    <p className="mb-4 text-tech-gray">O uso do site também está sujeito à nossa <a href="/politica-privacidade/" className="text-accent underline">Política de Privacidade</a> e <a href="/cookies/" className="text-accent underline">Política de Cookies</a>.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">7. Alterações nos Termos</h2>
    <p className="mb-4 text-tech-gray">A Codexy pode alterar estes Termos de Uso a qualquer momento. As alterações serão publicadas nesta página e o uso continuado do site implica aceitação das novas condições.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">8. Legislação Aplicável</h2>
    <p className="mb-4 text-tech-gray">Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao foro da comarca de Belo Horizonte, MG.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-primary">9. Contato</h2>
    <p className="mb-4 text-tech-gray">Dúvidas sobre estes Termos? Entre em contato pelo e-mail <a href="mailto:suporte@codexy.com.br" className="text-accent underline">suporte@codexy.com.br</a>.</p>
  </LegalPageLayout>
);

export default TermosUso;
