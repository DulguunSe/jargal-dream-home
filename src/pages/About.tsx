import Layout from "@/components/Layout";
import { Target, Eye, Handshake, TrendingUp } from "lucide-react";

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="section-padding bg-secondary">
      <div className="container-wide text-center max-w-2xl mx-auto">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider">About Us</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-2">Jargal Properties</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
          Building lasting relationships through exceptional real estate experiences since our founding.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="section-padding">
      <div className="container-wide max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Jargal Properties was founded with a simple mission: to make the real estate journey seamless, transparent, and rewarding for every client. We believe that finding the right property is more than a transaction — it's a life-changing decision.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our team of dedicated professionals combines deep market knowledge with a genuine passion for helping people find their perfect home. Whether you're a first-time buyer, seasoned investor, or looking to sell, we bring the same level of commitment and expertise to every interaction.
        </p>
      </div>
    </section>

    {/* Mission / Vision */}
    <section className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Target size={24} className="text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide exceptional real estate services that exceed expectations, built on integrity, expertise, and a deep understanding of our clients' needs.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Eye size={24} className="text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the most trusted and respected real estate partner in the market, known for our unwavering commitment to client success and community growth.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding">
      <div className="container-wide text-center max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-foreground mb-10">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Handshake, title: "Integrity", desc: "Honest and transparent in every deal" },
            { icon: TrendingUp, title: "Excellence", desc: "Going above and beyond always" },
            { icon: Target, title: "Focus", desc: "Client goals drive every decision" },
            { icon: Eye, title: "Innovation", desc: "Modern approach to real estate" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Icon size={24} className="text-accent" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
