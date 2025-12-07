import { NavLink } from 'react-router-dom';

const linkBase = "px-3 py-2 rounded-lg text-sm font-medium transition-colors";

const linkActive = "bg-purple-600 text-white";

const linkInactive = "text-zinc-300 hover:bg-zinc-800 hover:text-white";

export default function Navbar() {
    return (
        <header className="srickt top-0 z-10 bg-zinc-950/80 background-blur border-b border-zinc-800">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold text-purple-400">
                    GestãoCorp
                </h1>

                <nav className="flex gap-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/empresas"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Empresas
                    </NavLink>

                    <NavLink
                        to="/fornecedores"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Fornecedores
                    </NavLink>

                    <NavLink
                        to="/consulta"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Consulta
                    </NavLink>

                    <NavLink
                        to="/vinculos"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Vincular
                    </NavLink>
                </nav>  
            </div>
        </header>
    )
}