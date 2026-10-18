import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { KineticText, Pop, Reveal } from "@/lib/motion";

const testimonials = [
  {
    name: "Cristhian Oliveira",
    role: "Fundador, Coruja Cortes",
    content: "A CODEXY transformou completamente nossa presença digital. O aplicativo que desenvolveram aumentou nossas vendas em 300% no primeiro trimestre.",
    rating: 5,
    company: "Coruja Cortes"
  },
  {
    name: "Gabriela Nassif",
    role: "Fundadora, Clinica Gabriela Nassif",
    content: "Profissionalismo excepcional e entrega dentro do prazo. A solução de automação implementada reduziu nossos custos operacionais significativamente.",
    rating: 5,
    company: "Clinica Grabiela Nassif"
  },
  {
    name: "Tiago Hauque",
    role: "Fundador, Seu Expresso",
    content: "Desde o primeiro contato até a entrega final, a CODEXY demonstrou expertise técnica e compreensão do nosso negócio. Recomendo fortemente!",
    rating: 5,
    company: "Seu Expresso"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <KineticText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            parts={[{ text: "O que nossos" }, { text: "clientes", className: "gradient-text" }, { text: "dizem" }]}
          />
          <p className="text-lg sm:text-xl text-tech-gray max-w-3xl mx-auto">
            A satisfação dos nossos clientes é nossa maior conquista. 
            Veja o que eles têm a dizer sobre nossos serviços.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} index={index}>
            <Card className="tech-card border-0 relative group hover:tech-glow transition-all duration-500 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {/* Estrelas acendendo uma a uma, depois que o card abre. */}
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Pop key={i} index={index + 3 + i}>
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-accent text-accent" />
                    </Pop>
                  ))}
                </div>
                
                <p className="text-sm sm:text-base text-tech-gray leading-relaxed mb-4 sm:mb-6 relative z-10">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-tech-gray-light pt-4 sm:pt-6">
                  <div className="font-semibold text-primary mb-1 text-sm sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-tech-gray">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-accent font-medium mt-1">
                    {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;