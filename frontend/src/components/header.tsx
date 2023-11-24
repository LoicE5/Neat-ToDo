export default function Header() {
    return (
        <header className="bg-gray-800" style={{ marginBottom: "20px" }}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1" >
                    <a href="#" className="-m-1.5 p-1.5">
                        <img className="h-8 w-auto" src="logoV1.png" alt="" style={{ display: "block", height: "80px" }} />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-lg font-semibold leading-6 text-red-500 no-underline">Créer une ToDoom</a>
                    <a href="#" className="text-lg font-semibold leading-6 text-red-500 no-underline">Vos groupes</a>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-lg font-semibold leading-6 text-red-500 no-underline">Log out</a>
                </div>
            </nav>
        </header>
    )
}