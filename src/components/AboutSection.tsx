import { Users, Award, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CountUp, DrawIcon, KineticText, Pop, Reveal, ease } from "@/lib/motion";

const stats = [
  { icon: Users, number: "10+", label: "Especialistas" },
  { icon: Award, number: "30+", label: "Projetos Entregues" },
  { icon: Clock, number: "3+", label: "Anos de Experiência" },
  { icon: Target, number: "99%", label: "Taxa de Sucesso" }
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <KineticText
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                parts={[{ text: "Sobre a" }, { text: "CODEXY", className: "gradient-text" }]}
              />
              <p className="text-lg sm:text-xl text-tech-gray leading-relaxed mb-8">
                Somos uma empresa de tecnologia apaixonada por criar soluções digitais 
                que impulsionam o crescimento dos nossos clientes. Nossa equipe combina 
                expertise técnica com visão estratégica para entregar resultados excepcionais.
              </p>
              
              <div className="space-y-4 mb-8">
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Inovação Constante</h3>
                    <p className="text-tech-gray">Utilizamos as tecnologias mais avançadas para criar soluções à frente do mercado.</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.2 }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Foco no Cliente</h3>
                    <p className="text-tech-gray">Cada projeto é desenvolvido com foco nas necessidades específicas do cliente.</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.3 }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Qualidade Premium</h3>
                    <p className="text-tech-gray">Mantemos os mais altos padrões de qualidade em todos os nossos entregáveis.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Reveal key={stat.label} index={index}>
                <Card className="tech-card border-0 text-center group hover:tech-glow transition-all duration-300 h-full">
                  <CardContent className="p-6 sm:p-8">
                    {/* Pop por fora: o transform inline dele anularia o group-hover:scale do ícone. */}
                    <Pop index={index} className="w-fit mx-auto mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <DrawIcon>
                          <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </DrawIcon>
                      </div>
                    </Pop>
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                      <CountUp value={stat.number} />
                    </div>
                    <div className="text-sm sm:text-base text-tech-gray font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
                </Reveal>
              ))}
            </div>
            
            {/* Mission Card */}
            <Reveal index={4}>
            <Card className="tech-card border-0 p-6 sm:p-8">
              <CardContent className="p-0">
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Nossa Missão</h3>
                <p className="text-sm sm:text-base text-tech-gray leading-relaxed">
                  Democratizar o acesso à tecnologia de ponta, capacitando empresas 
                  de todos os portes a competirem no mercado digital através de 
                  soluções inovadoras e sustentáveis.
                </p>
              </CardContent>
            </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;