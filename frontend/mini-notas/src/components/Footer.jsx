import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Mi Sistema de Notas. Todos los derechos reservados.
                </p>
                <p className="text-xs mt-2">
                    Hecho con ❤️ por Leider Arias Franco
                </p>
            </div>
        </footer>
    );
}

export default Footer;
