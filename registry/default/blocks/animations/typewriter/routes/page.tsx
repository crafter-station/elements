import { Typewriter } from "@/registry/default/blocks/animations/typewriter/components/elements/typewriter";

export default function TypewriterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Typewriter</h1>
            <p className="text-muted-foreground">
              Framework-agnostic typewriter effect with multi-segment support,
              viewport triggers, and custom cursors.
            </p>
          </div>

          <section className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Single line
            </p>
            <Typewriter
              className="text-xl"
              text="Hola, soy Andenar. Te voy a ayudar a entender tu situación tributaria."
            />
          </section>

          <section className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Multi-segment with emphasis
            </p>
            <Typewriter
              className="text-xl leading-relaxed"
              speed={24}
              text={[
                { text: "Vamos a repasar " },
                {
                  text: "6 temas clave",
                  className: "text-[#c2794a] font-medium",
                  speed: 60,
                },
                { text: " para armar tu diagnóstico personalizado." },
              ]}
            />
          </section>

          <section className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Loop with custom cursor
            </p>
            <Typewriter
              className="text-2xl font-medium"
              loop
              loopDelay={1800}
              cursorCharacter="▌"
              text="streams · en · vivo"
            />
          </section>

          <section className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Triggered on viewport entry
            </p>
            <div className="h-72 overflow-y-auto rounded-lg border p-6">
              <div className="h-[200%] flex flex-col justify-end">
                <Typewriter
                  className="text-lg"
                  startOnView
                  text="Este párrafo espera a estar visible antes de escribirse."
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              As a heading
            </p>
            <Typewriter
              as="h2"
              className="text-4xl font-semibold tracking-tight"
              speed={40}
              text="Polymorphic element"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
