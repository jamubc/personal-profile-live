import { Card } from "../ui/Card";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";

export function Contact() {
  return (
    <Section id="contact" centered>
      <div className="max-w-3xl w-full">
        <h2 className="text-display-sm md:text-display-md font-bold mb-12 text-text-primary">Let's Connect</h2>
        <Card className="p-8 md:p-12 text-center bg-bg-card-featured backdrop-blur-xl border-border-secondary">
          <p className="text-body-lg text-text-secondary mb-10 leading-relaxed">
            I'm currently exploring new opportunities to build high-performance web applications. 
            Whether you have a question about my stack, a project idea, or just want to say hi, 
            my inbox is always open.
          </p>
          <Button 
            href="mailto:hello@example.com" 
            variant="primary"
            className="shadow-glow-md hover:scale-105 transition-transform"
          >
            Say Hello
          </Button>
        </Card>
      </div>
    </Section>
  );
}
