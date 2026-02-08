import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Impact Project Planner',
  description: 'Design rigorous social impact projects with AI-powered guidance',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
              </span>
              AI-Powered Social Impact Planning
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-6xl">
              Design <span className="text-primary-600">Rigorous</span> Social Impact Projects
            </h1>
            <p className="mb-8 text-lg text-slate-600 lg:text-xl">
              Get AI-powered guidance grounded in program evaluation literature. 
              Build Theory of Change, Logic Models, and Results-Based Accountability frameworks 
              for your social impact initiatives.
            </p>
            <a
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200"
            >
              Start Planning
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary-100 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-100 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Guided by Evidence-Based Literature</h2>
            <p className="text-slate-600">
              Our chatbot is grounded in curated academic research on program evaluation and social impact methodology.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Theory of Change',
                description: 'Build causal pathways that clearly link your activities to desired outcomes.',
                icon: '🔗',
              },
              {
                title: 'Logic Models',
                description: 'Create visual representations of inputs, activities, outputs, and outcomes.',
                icon: '📊',
              },
              {
                title: 'Results-Based Accountability',
                description: 'Structure your programs around measurable results and community impact.',
                icon: '🎯',
              },
              {
                title: 'Source Attribution',
                description: 'Every recommendation is backed by peer-reviewed academic literature.',
                icon: '📚',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600">
              Three simple steps to get started with your social impact project planning.
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Describe Your Project',
                  description: 'Share details about your social impact goals, target population, and context.',
                },
                {
                  step: '02',
                  title: 'Get AI Guidance',
                  description: 'Receive structured recommendations grounded in evaluation literature.',
                },
                {
                  step: '03',
                  title: 'Refine & Plan',
                  description: 'Iterate on your approach with context-aware assistance.',
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="mb-4 text-5xl font-bold text-primary-100">{item.step}</div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-center text-white lg:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to Design Impact?</h2>
            <p className="mb-8 text-lg opacity-90">
              Start building rigorous, evidence-based social impact projects today.
            </p>
            <a
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-primary-600 transition-all hover:bg-slate-50"
            >
              Launch Chatbot
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-slate-500">
              © 2025 Social Impact Project Planner. Built with ❤️ for social good.
            </div>
            <div className="text-sm text-slate-500">
              Grounded in peer-reviewed research on Theory of Change, Logic Models, and Results-Based Accountability.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
