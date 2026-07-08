import { useState } from 'react';
import { MessageSquare, Zap, BarChart3, Users, Check, ArrowRight, Star, Bot, ShoppingCart, Sparkles, TrendingUp, Shield, Clock, Menu, X } from 'lucide-react';
import { Card } from '../../components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Features', sectionId: 'features' },
    { label: 'Pricing', sectionId: 'pricing' },
    { label: 'Testimonials', sectionId: 'testimonials' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20">
      {/* Modern Header with Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl">WhatsApp CRM</span>
                <p className="text-xs text-muted-foreground">AI-Powered Business OS</p>
              </div>
              <span className="text-xl sm:hidden">WhatsApp CRM</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onLogin}
                className="px-5 py-2 text-foreground hover:text-primary transition-all hover:scale-105"
              >
                Login
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-foreground hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onGetStarted();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                  >
                    Get Started Free
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Framer Style */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary">AI-Powered WhatsApp Business Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl tracking-tight">
              Transform WhatsApp
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Into Your Business OS
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage orders, automate customer support, and grow your business—all from WhatsApp. Powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg group"
              >
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl hover:bg-accent transition-all text-lg">
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">
              Everything you need to
              <span className="block text-primary">run your business</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features that work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'AI Auto-Responses',
                description: 'Let AI handle customer inquiries 24/7 with intelligent, context-aware responses.',
                gradient: 'from-blue-500/10 to-blue-500/5',
                iconColor: 'text-blue-600'
              },
              {
                icon: ShoppingCart,
                title: 'Smart Order Creation',
                description: 'AI automatically detects order intent and creates orders from chat conversations.',
                gradient: 'from-green-500/10 to-green-500/5',
                iconColor: 'text-green-600'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Track revenue, orders, and customer behavior with beautiful, actionable insights.',
                gradient: 'from-purple-500/10 to-purple-500/5',
                iconColor: 'text-purple-600'
              },
              {
                icon: Users,
                title: 'Customer Management',
                description: 'Organize customers into VIP, Regular, and New segments for personalized service.',
                gradient: 'from-orange-500/10 to-orange-500/5',
                iconColor: 'text-orange-600'
              },
              {
                icon: Zap,
                title: 'Workflow Automation',
                description: 'Create custom automation rules to streamline repetitive tasks and save time.',
                gradient: 'from-yellow-500/10 to-yellow-500/5',
                iconColor: 'text-yellow-600'
              },
              {
                icon: TrendingUp,
                title: 'Growth Tools',
                description: 'Broadcast campaigns, track performance, and grow your customer base effortlessly.',
                gradient: 'from-pink-500/10 to-pink-500/5',
                iconColor: 'text-pink-600'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all hover:scale-105 bg-card">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: '10,000+', label: 'Businesses Trust Us' },
                { value: '1M+', label: 'Messages Processed' },
                { value: '99.9%', label: 'Uptime Guarantee' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-5xl mb-2 text-primary">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section - Clean & Modern */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'PKR 2,999',
                period: '/month',
                features: [
                  'Up to 500 customers',
                  '1,000 messages/month',
                  'Basic AI responses',
                  'Order management',
                  'Email support'
                ],
                popular: false
              },
              {
                name: 'Professional',
                price: 'PKR 7,999',
                period: '/month',
                features: [
                  'Up to 2,000 customers',
                  '10,000 messages/month',
                  'Advanced AI & automation',
                  'Analytics & reports',
                  'Priority support',
                  'Custom branding'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: [
                  'Unlimited customers',
                  'Unlimited messages',
                  'White-label solution',
                  'Dedicated account manager',
                  '24/7 phone support',
                  'Custom integrations'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative ${
                  plan.popular
                    ? 'border-2 border-primary shadow-2xl scale-105'
                    : 'border border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:shadow-lg hover:scale-105'
                      : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  Get Started
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">
              Loved by businesses across Pakistan
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "WhatsApp CRM transformed how we handle customer orders. The AI auto-detection is mind-blowing!",
                author: "Rahul Kumar",
                role: "Tech Store Owner, Karachi",
                rating: 5
              },
              {
                quote: "Managing 500+ daily customer chats is now effortless. The automation saves us 20 hours per week.",
                author: "Priya Sharma",
                role: "Fashion Boutique, Lahore",
                rating: 5
              },
              {
                quote: "Best investment for our business. Revenue increased by 40% in just 2 months!",
                author: "Amit Patel",
                role: "Electronics Hub, Islamabad",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p>{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <Card className="p-16 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to transform your business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses already using WhatsApp CRM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-background text-foreground rounded-xl hover:scale-105 transition-all text-lg"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl transition-all text-lg">
                Schedule Demo
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl">WhatsApp CRM</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Transform your WhatsApp into a powerful business management system with AI automation.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Features</li>
                <li className="hover:text-foreground cursor-pointer">Pricing</li>
                <li className="hover:text-foreground cursor-pointer">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">About</li>
                <li className="hover:text-foreground cursor-pointer">Contact</li>
                <li className="hover:text-foreground cursor-pointer">Support</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>© 2026 WhatsApp CRM. Built with ❤️ for Pakistani businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
