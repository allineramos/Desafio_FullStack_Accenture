import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import bg from './assets/background.png';

export default function App() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        <img src={bg} alt="" className="pointer-events-none fixed inset-0 w-full h-full object-cover opacity-30"/>

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-black/80 via-zinc-950/80 to-purple-950/50" />

        <div className="relative z-10">
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-6">
            <AppRoutes />
          </main>
        </div>
    </div>
  );
}