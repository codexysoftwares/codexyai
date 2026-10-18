import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DrawIcon, KineticText, Reveal } from "@/lib/motion";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contato@codexy.com.br",
    description: "Resposta em até 2 horas"
  },
  {
    icon: Phone,
    title: "Telefone/WhatsApp",
    value: "(31) 99166-6106",
    description: "Seg - Sex, 8h às 18h"
  },
  {
    icon: MapPin,
    title: "Endereço",
    value: "Belo Horizonte, MG",
    description: "Brasil"
  }
];

const ContactSection = () => {
  return (
    <section id="contato" className="py-16 sm:py-24 bg-background" data-section="contact">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <KineticText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            parts={[{ text: "Vamos começar seu" }, { text: "projeto", className: "gradient-text" }]}
          />
          <p className="text-lg sm:text-xl text-tech-gray max-w-3xl mx-auto">
            Processo simples e transparente. Em apenas 3 passos, sua ideia 
            se transforma em uma solução digital de sucesso.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Entre em Contato</h3>
              <p className="text-tech-gray leading-relaxed mb-8">
                Nossa equipe está pronta para discutir seu projeto e apresentar 
                a melhor solução para suas necessidades tecnológicas.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Reveal key={info.title} index={index}>
                <Card className="tech-card border-0 group hover:tech-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <DrawIcon>
                          <info.icon className="w-6 h-6 text-white" />
                        </DrawIcon>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-1">{info.title}</h4>
                        <p className="text-tech-gray font-medium mb-1">{info.value}</p>
                        <p className="text-sm text-tech-gray">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Reveal>
              ))}
            </div>

            {/* Quick Response */}
            <Card className="tech-card border-0 bg-gradient-to-br from-accent/10 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <h4 className="font-semibold text-primary">Resposta Rápida</h4>
                </div>
                <p className="text-tech-gray text-sm">
                  Respondemos todos os contatos em até 2 horas durante horário comercial.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Processo de Contato */}
          <Reveal className="lg:col-span-3" index={1}>
            <Card className="tech-card border-0">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">Como Funciona Nosso Processo</h3>
                
                <div className="space-y-8">
                  {/* Passo 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Envie uma Mensagem</h4>
                      <p className="text-sm sm:text-base text-tech-gray mb-4">
                        Clique no botão abaixo e envie uma mensagem inicial pelo WhatsApp. 
                        Inclua informações básicas sobre seu projeto.
                      </p>
                      <div className="bg-accent/10 p-4 rounded-lg">
                        <p className="text-sm text-accent font-medium mb-2">📝 Sua mensagem deve incluir:</p>
                        <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                          <li>• Nome da empresa/projeto</li>
                          <li>• Tipo de solução desejada (site, app, sistema)</li>
                          <li>• Breve descrição do objetivo</li>
                          <li>• Prazo estimado (se houver)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Passo 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Análise e Proposta</h4>
                      <p className="text-sm sm:text-base text-tech-gray mb-4">
                        Nossa equipe analisará sua necessidade e preparará uma proposta 
                        personalizada com cronograma e investimento.
                      </p>
                    </div>
                  </div>

                  {/* Passo 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Início das Conversas</h4>
                      <p className="text-sm sm:text-base text-tech-gray mb-4">
                        Após aprovação, iniciamos o desenvolvimento com acompanhamento 
                        constante e entregas em etapas.
                      </p>
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="w-full px-6 sm:px-8 py-4 sm:py-6 tech-glow group text-base sm:text-lg font-semibold"
                      onClick={() => {
                        const phoneNumber = "5531991666106";
                        const message = `Olá! Gostaria de conversar sobre um projeto.

📋 Informações do Projeto:
• Empresa/Projeto: [Seu nome aqui]
• Tipo de Solução: [Site/App/Sistema]
• Objetivo: [Breve descrição]
• Prazo: [Se houver]

Podem me ajudar?`;
                        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Enviar Mensagem no WhatsApp
                    </Button>
                    
                    <p className="text-xs text-gray-600 text-center mt-4">
                      Resposta garantida em até 2 horas durante horário comercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;