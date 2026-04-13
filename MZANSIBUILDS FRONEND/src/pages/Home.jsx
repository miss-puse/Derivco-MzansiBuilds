import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-light/10">
      {/* Hero Section */}
      <div className="relative h-[700px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                Building the Future of South Africa
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Build Your<br />
              <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
                Projects in Public
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
              Join a community of developers sharing their journey. Track progress, 
              collaborate with peers, and celebrate your achievements together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="group relative bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all overflow-hidden text-center"
                  >
                    <span className="relative z-10">Go to Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      Go to Dashboard
                    </span>
                  </Link>
                  <Link
                    to="/create-project"
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition text-center"
                  >
                    Start Building
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all overflow-hidden text-center"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      Get Started Free
                    </span>
                  </Link>
                  <Link
                    to="/feed"
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition text-center"
                  >
                    Explore Projects
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-y border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent mb-2">
                100+
              </div>
              <p className="text-black/70 font-medium">Active Developers</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent mb-2">
                250+
              </div>
              <p className="text-black/70 font-medium">Projects Shared</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-black/70 font-medium">Completed Builds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-primary-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent">
                Build in Public
              </span>
            </h2>
            <p className="text-black/70 text-lg max-w-2xl mx-auto font-light">
              A complete platform designed for developers who want to share their journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-10 rounded-2xl shadow-sm border border-black/10 hover:shadow-2xl hover:border-primary-light transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Track Progress</h3>
              <p className="text-black/70 leading-relaxed">
                Document every step of your journey with milestone tracking, updates, and detailed project timelines.
              </p>
            </div>
            
            <div className="group bg-white p-10 rounded-2xl shadow-sm border border-black/10 hover:shadow-2xl hover:border-primary-light transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Collaborate</h3>
              <p className="text-black/70 leading-relaxed">
                Connect with fellow developers, share insights, and request support when you need guidance.
              </p>
            </div>
            
            <div className="group bg-white p-10 rounded-2xl shadow-sm border border-black/10 hover:shadow-2xl hover:border-primary-light transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Celebrate</h3>
              <p className="text-black/70 leading-relaxed">
                Showcase your completed projects on the Celebration Wall and inspire the next generation of builders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-primary-dark to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 text-xl mb-10 font-light">
            Join MzansiBuilds today and become part of a thriving community of developers building the future
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-black px-10 py-4 rounded-lg text-lg font-semibold hover:bg-primary-light transition shadow-xl hover:shadow-2xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
